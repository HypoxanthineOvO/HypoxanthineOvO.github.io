from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse


DIST = Path('dist').resolve()


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for attribute in ('href', 'src'):
            value = values.get(attribute)
            if value:
                self.links.append(value)
        if values.get('srcset'):
            self.links.extend(item.strip().split()[0] for item in values['srcset'].split(','))


def resolves_to_file(url_path: str) -> bool:
    path = DIST / unquote(url_path.lstrip('/'))
    if path.is_file():
        return True
    if path.is_dir() and (path / 'index.html').is_file():
        return True
    return (DIST / f"{url_path.lstrip('/')}.html").is_file()


def main() -> int:
    failures: list[str] = []
    html_files = sorted(DIST.rglob('*.html'))
    for html_file in html_files:
        route = '/' + html_file.relative_to(DIST).as_posix()
        if route.endswith('/index.html'):
            route = route[:-10]
        parser = LinkParser()
        parser.feed(html_file.read_text(encoding='utf-8'))
        for raw_link in parser.links:
            if raw_link.startswith(('#', 'mailto:', 'tel:', 'data:', 'javascript:')):
                continue
            parsed = urlparse(raw_link)
            if parsed.scheme or parsed.netloc:
                continue
            absolute = urlparse(urljoin(f'https://hypox.cn{route}', raw_link)).path
            if not resolves_to_file(absolute):
                failures.append(f'{html_file.relative_to(DIST)} -> {raw_link}')

    print(f'checked_html={len(html_files)}')
    print(f'broken_internal_links={len(failures)}')
    for failure in failures[:100]:
        print(failure)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
