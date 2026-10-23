#!/usr/bin/env python3
"""Integration regression: runtime text, future content, redirects and pruning."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='font-subset-test-') as temporary:
    base = Path(temporary)
    for marker in ['龙', '龟']:
        dist = base / marker
        assets = dist / '_astro'
        assets.mkdir(parents=True)
        for part in ['chinese-simplified', 'latin']:
            shutil.copyfile(ROOT / f'node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-{part}-400-normal.woff2', assets / f'{part}.woff2')
        (assets / 'site.css').write_text(''.join(f'@font-face{{font-family:"Noto Sans SC";font-weight:400;font-style:normal;src:url({part}.woff2)}}' for part in ['chinese-simplified', 'latin']) + 'body{font-family:"Noto Sans SC"}@font-face{font-family:KaTeX_Main;src:url(math.woff2)}')
        (assets / 'math.woff2').write_bytes(b'preserve unrelated font')
        (assets / 'runtime.js').write_text('import{value}from"./shared.js";document.body.dataset.message=value;')
        (assets / 'shared.js').write_text('export const value="\\u6D4B\\u8BD5";')
        html = f'<html><head><link rel="stylesheet" href="/_astro/site.css"></head><body><button aria-label="播放">你好{marker}</button><script src="/_astro/runtime.js"></script></body></html>'
        (dist / 'index.html').write_text(html)
        (dist / 'second.html').write_text(html.replace(f'你好{marker}', '世界'))
        redirect = '<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>'
        (dist / 'redirect.html').write_text(redirect)
        subprocess.run([sys.executable, str(ROOT / 'scripts/subset-fonts.py'), str(dist)], check=True, stdout=subprocess.DEVNULL)
        manifest = json.loads((dist / 'font-subsets.json').read_text())
        assert len(manifest['pages']) == 2
        assert (dist / 'redirect.html').read_text() == redirect
        assert not (assets / 'chinese-simplified.woff2').exists()
        assert (assets / 'math.woff2').exists()
        assert 'KaTeX_Main' in (assets / 'site.css').read_text()
        assert 'body{font-family:"Noto Sans SC"}' in (assets / 'site.css').read_text()
        supplied = set()
        for font in (assets / 'font-subsets').glob('*.woff2'):
            with TTFont(font) as loaded:
                supplied.update(loaded.getBestCmap())
        assert set(map(ord, f'你好{marker}世界播放测试')) <= supplied
        # No payload other than the stylesheet link changes during processing.
        optimized = (dist / 'index.html').read_text()
        assert html.split('<body>')[1] == optimized.split('<body>')[1]
print('Font subset integration passed: HTML, accessible labels, imported escaped runtime text, future content, redirects, safe pruning.')
