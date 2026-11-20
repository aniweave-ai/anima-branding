"""Builds team/, team-plain/ and the Google Cloud for Startups partner logo from the sales zip.
Usage: python3 make_logos.py <sales assets dir> <anima-brand/assets/logos dir>
team/<n>.png          original file from the sales zip (grey mono, transparent)
team-plain/<n>.png    transparent, trimmed to the mark
team-plain/<n>-dark.png  same alpha, white fill, for dark grounds (no CSS filter needed)
partners/ + partners-plain/google-cloud-for-startups(.png|-dark.png): grey text turns white on the dark version, the coloured cloud stays."""
import sys, shutil, pathlib
from PIL import Image
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
def trim(im):
    box = im.getchannel('A').point(lambda a: 255 if a >= 16 else 0).getbbox()
    return im.crop(box)
def white(im, only_grey=False):
    out = im.copy(); px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a and (not only_grey or max(r, g, b) - min(r, g, b) < 40):
                px[x, y] = (255, 255, 255, a)
    return out
for d in ('team', 'team-plain'): (dst / d).mkdir(exist_ok=True)
for f in sorted((src / 'team').glob('*.png')):
    shutil.copyfile(f, dst / 'team' / f.name)
    im = trim(Image.open(f).convert('RGBA'))
    im.save(dst / 'team-plain' / f.name)
    white(im).save(dst / 'team-plain' / (f.stem + '-dark.png'))
g = src / 'eco' / 'google-cloud-for-startups.png'
shutil.copyfile(g, dst / 'partners' / g.name)
im = trim(Image.open(g).convert('RGBA'))
im.save(dst / 'partners-plain' / g.name)
white(im, only_grey=True).save(dst / 'partners-plain' / (g.stem + '-dark.png'))
print('ok')
