#!/usr/bin/env python3
"""Subset production Fontsource fonts, retaining complete development sources.

Run after astro build. Every page gets a shared character set and a page set;
fontTools retains shaping/ligature dependencies. Inline and linked JavaScript,
attributes, and CSS generated content are scanned too, so interactive text is
not lost. Unavailable characters keep their existing browser font fallback.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import logging
import re
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FAMILIES = {'Noto Sans SC', 'Noto Serif SC', 'JetBrains Mono'}
FACE_RE = re.compile(r'@font-face\s*\{[^}]*\}')
URL_RE = re.compile(r'url\([\'"]?([^\)\'"\s]+)[\'"]?\)')
logging.getLogger('fontTools').setLevel(logging.ERROR)


def chars(text):
    # JS escapes survive minification; decode them without corrupting UTF-8.
    text += ''.join(chr(int(m.group(1) or m.group(2), 16)) for m in re.finditer(r'\\u(?:\{([0-9a-fA-F]{1,6})\}|([0-9a-fA-F]{4}))', text))
    text += ''.join(chr(int(m.group(1), 16)) for m in re.finditer(r'\\x([0-9a-fA-F]{2})', text))
    text += ''.join(chr(int(m.group(1), 16)) for m in re.finditer(r'\\([0-9a-fA-F]{1,6})(?:\s|(?=[^0-9a-fA-F])|$)', text) if int(m.group(1), 16) <= 0x10FFFF)
    return {ord(c) for c in text if ord(c) >= 32 and not 0xD800 <= ord(c) <= 0xDFFF}


def ranges(points):
    runs = []
    for cp in sorted(points):
        if runs and cp == runs[-1][1] + 1:
            runs[-1][1] = cp
        else:
            runs.append([cp, cp])
    return ','.join(f'U+{a:X}' + (f'-{b:X}' if b != a else '') for a, b in runs)


def local_path(url, owner, dist):
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return None
    path = (dist / unquote(parsed.path).lstrip('/') if parsed.path.startswith('/') else owner.parent / unquote(parsed.path)).resolve()
    return path if path.is_relative_to(dist) and path.is_file() else None


class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.values = []
        self.scripts = []
        self.styles = []
    def handle_data(self, data):
        self.values.append(data)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.values.extend(v for v in attrs.values() if v)
        if tag == 'script' and attrs.get('src'):
            self.scripts.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.styles.append(attrs['href'])


def font_subset(font, codepoints):
    options = subset.Options()
    options.recalc_timestamp = False
    options.canonical_order = True
    options.layout_features = ['*']
    worker = subset.Subsetter(options=options)
    worker.populate(unicodes=codepoints)
    worker.subset(font)
    return font


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('dist', nargs='?', default='dist')
    args = parser.parse_args()
    dist = Path(args.dist).resolve()
    manifest_path = dist / 'font-subsets.json'
    if manifest_path.exists():
        raise SystemExit('Font subsets already generated. Run a fresh Astro build before subsetting.')
    css_files = sorted(dist.rglob('*.css'))
    fonts = {}
    embedded_temp = tempfile.TemporaryDirectory(prefix='myweb-font-input-')
    originals = set()
    bytes_css_before = sum(p.stat().st_size for p in css_files)
    def remove_face(match, css):
        block = match.group()
        family_match = re.search(r'font-family\s*:\s*([^;}]+)', block)
        if not family_match:
            return block
        family = family_match.group(1).strip('\'" ')
        if family not in FAMILIES:
            return block
        weight = re.search(r'font-weight\s*:\s*([^;}]+)', block).group(1).strip()
        style_match = re.search(r'font-style\s*:\s*([^;}]+)', block)
        style = style_match.group(1).strip() if style_match else 'normal'
        candidates = []
        for url in URL_RE.findall(block):
            if url.startswith('data:') and 'font/woff2;base64,' in url:
                data = base64.b64decode(url.split(',', 1)[1])
                embedded = Path(embedded_temp.name) / (hashlib.sha256(data).hexdigest() + '.woff2')
                embedded.write_bytes(data)
                candidates.append(embedded)
                continue
            file = local_path(url, css, dist)
            if file:
                originals.add(file)
                if file.suffix == '.woff2':
                    candidates.append(file)
        if not candidates:
            raise RuntimeError(f'Missing WOFF2 source for {family} {weight} in {css}')
        fonts.setdefault((family, weight, style), set()).update(candidates)
        return ''
    stripped = {css: FACE_RE.sub(lambda m: remove_face(m, css), css.read_text()) for css in css_files}
    if not fonts:
        raise SystemExit('No Fontsource faces found; font optimization did not run.')

    page_chars = {}
    for page in sorted(dist.rglob('*.html')):
        parsed = PageText()
        parsed.feed(page.read_text())
        # Redirect-only / exported legacy HTML has no site font stylesheet.
        if not any((css := local_path(url, page, dist)) in stripped and
                   stripped[css] != css.read_text() for url in parsed.styles):
            continue
        points = chars(''.join(parsed.values)) | set(range(32, 127))
        # Follow module imports too; bundled shared demos may supply runtime text.
        pending = [local_path(url, page, dist) for url in parsed.scripts]
        seen = set()
        while pending:
            script = pending.pop()
            if script is None or script in seen:
                continue
            seen.add(script)
            text = script.read_text()
            points |= chars(text)
            for url in re.findall(r'(?:from\s*|import\s*\(?)[\'"]([^\'"]+)[\'"]', text):
                pending.append(local_path(url, script, dist))
        for url in parsed.styles:
            style = local_path(url, page, dist)
            if style in stripped:
                points |= chars(stripped[style])
        page_chars[page] = points
    if not page_chars:
        raise SystemExit('No HTML pages found.')
    shared = set.intersection(*page_chars.values())
    all_points = set.union(*page_chars.values())
    output_dir = dist / '_astro' / 'font-subsets'
    output_dir.mkdir(parents=True, exist_ok=True)
    for family in FAMILIES:
        package = family.lower().replace(' ', '-')
        license_file = ROOT / 'node_modules' / '@fontsource' / package / 'LICENSE'
        (output_dir / f'{package}-LICENSE.txt').write_text(license_file.read_text())
    page_rules = {p: [] for p in page_chars}
    manifest = {'version': 1, 'sharedCharacters': len(shared), 'pages': {}, 'fonts': [], 'cssBytesBefore': bytes_css_before}
    generated = set()
    with tempfile.TemporaryDirectory(prefix='myweb-fonts-') as temp:
        temp = Path(temp)
        for (family, weight, style), files in sorted(fonts.items()):
            print(f'[fonts] {family} {weight}: combining {len(files)} source fragments', flush=True)
            remaining = set(all_points)
            parts = []
            available = set()
            for i, file in enumerate(sorted(files)):
                font = TTFont(file, recalcTimestamp=False)
                cmap = set(font.getBestCmap())
                available |= cmap
                selected = remaining & cmap
                if selected:
                    font_subset(font, selected)
                    font.flavor = None
                    part = temp / f'{i}.ttf'
                    font.save(part)
                    parts.append(str(part))
                    remaining -= selected
                font.close()
            if not parts:
                raise RuntimeError(f'No supported glyphs for {family}')
            master = Merger().merge(parts) if len(parts) > 1 else TTFont(parts[0], recalcTimestamp=False)
            master.recalcTimestamp = False
            master.flavor = None
            buf = io.BytesIO()
            master.save(buf)
            master_bytes = buf.getvalue()
            master.close()
            supported = all_points & available
            # Validation: merging must never drop a character the original supplied.
            with TTFont(io.BytesIO(master_bytes)) as check:
                missing = supported - set(check.getBestCmap())
                if missing:
                    raise RuntimeError(f'Merge lost glyphs: {family} {sorted(missing)}')
            cache = {}
            def create_set(points):
                points = frozenset(points & supported)
                if not points:
                    return ''
                if points in cache:
                    return cache[points]
                font = font_subset(TTFont(io.BytesIO(master_bytes), recalcTimestamp=False), points)
                if points - set(font.getBestCmap()):
                    raise RuntimeError(f'Subset lost glyphs: {family}')
                font.flavor = 'woff2'
                out = io.BytesIO()
                font.save(out)
                font.close()
                data = out.getvalue()
                digest = hashlib.sha256(data).hexdigest()[:16]
                name = f'{family.lower().replace(" ", "-")}-{weight}-{digest}.woff2'
                file = output_dir / name
                if file not in generated:
                    file.write_bytes(data)
                    generated.add(file)
                rule = f'@font-face{{font-family:"{family}";font-style:{style};font-weight:{weight};font-display:swap;src:url("/_astro/font-subsets/{name}") format("woff2");unicode-range:{ranges(points)}}}'
                cache[points] = rule
                return rule
            common_rule = create_set(shared)
            for page, points in page_chars.items():
                if common_rule:
                    page_rules[page].append(common_rule)
                specific = create_set(points - shared)
                if specific:
                    page_rules[page].append(specific)
            manifest['fonts'].append({'family': family, 'weight': weight, 'style': style, 'supportedUsedCharacters': len(supported), 'fallbackCharacters': ''.join(chr(c) for c in sorted(all_points - available))})
    # Only mutate source CSS and HTML after all subsets pass cmap validation.
    for css, text in stripped.items():
        css.write_text(text)
    for page, rules in page_rules.items():
        text = ''.join(rules)
        digest = hashlib.sha256(text.encode()).hexdigest()[:16]
        css = output_dir / f'page-{digest}.css'
        css.write_text(text)
        html = page.read_text()
        if '</head>' not in html:
            raise RuntimeError(f'No head found: {page}')
        page.write_text(html.replace('</head>', f'<link rel="stylesheet" href="/_astro/font-subsets/{css.name}"></head>', 1))
        urls = URL_RE.findall(text)
        manifest['pages']['/' + str(page.relative_to(dist))] = {'characters': len(page_chars[page]), 'css': str(css.relative_to(dist)), 'fontFiles': len(urls), 'availableFontBytes': sum((dist / u.lstrip('/')).stat().st_size for u in set(urls))}
    # Delete only emitted originals with no remaining reference in text assets.
    references = '\n'.join(p.read_text() for p in dist.rglob('*') if p.suffix in {'.html', '.css', '.js', '.json', '.svg'} and p.is_file())
    removed_bytes = 0
    removed_count = 0
    for file in originals:
        if file.name not in references:
            removed_bytes += file.stat().st_size
            removed_count += 1
            file.unlink()
    manifest.update({'removedFontFiles': removed_count, 'removedFontBytes': removed_bytes, 'generatedFontFiles': len(generated), 'generatedFontBytes': sum(p.stat().st_size for p in generated), 'cssBytesAfter': sum(p.stat().st_size for p in dist.rglob('*.css'))})
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f'[fonts] {len(page_chars)} pages; removed {removed_bytes:,} bytes; generated {manifest["generatedFontBytes"]:,} font bytes across all routes', flush=True)


if __name__ == '__main__':
    main()
