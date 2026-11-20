#!/usr/bin/env python3
"""把 anima-brand/assets/icons/{ui,domain}/*.svg 寫進 slides.css 的 icon 區塊（data URI）。

用法：python3 slides/tools-icons.py（Web DS 的 icon 同步過來之後跑一次）

為什麼內嵌：slides.js 直接從 CSS 讀出 SVG 插成 <svg>（印 PDF 不會有遮罩的框邊細線），
不用 fetch，所以 file:// 開也看得到；CSS 遮罩只是 JS 還沒跑時的備案。
"""
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
CSS = ROOT / 'slides' / 'slides.css'
START, END = '/* icons:start', '/* icons:end */'


def clean(svg):
    svg = re.sub(r'<metadata>.*?</metadata>', '', svg, flags=re.S)
    svg = re.sub(r'\s+xmlns:c2pa="[^"]*"', '', svg)
    svg = re.sub(r'>\s+<', '><', svg.strip())
    return svg.replace('"', "'")


def main():
    lines = [f'{START}（tools-icons.py 從 anima-brand/assets/icons 產生，不要手改） */', ':root {']
    names = []
    for group in ('ui', 'domain'):
        for f in sorted((ROOT / 'anima-brand' / 'assets' / 'icons' / group).glob('*.svg')):
            names.append(f.stem)
            lines.append(f'  --icon-{f.stem}: url("data:image/svg+xml,{quote(clean(f.read_text()), safe=" =:/,.-")}");')
    lines.append('}')
    lines += [f'.ico-{n} {{ --ico: var(--icon-{n}); }}' for n in names]
    lines.append(END)
    css = CSS.read_text()
    a, b = css.index(START), css.index(END) + len(END)
    CSS.write_text(css[:a] + '\n'.join(lines) + css[b:])
    print(f'{len(names)} icons -> {CSS.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
