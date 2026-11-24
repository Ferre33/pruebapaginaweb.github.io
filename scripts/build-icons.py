"""Package the existing three-children brand image as circular website icons.

No artwork is redrawn or cropped. Keep the source image unchanged; only resize
proportionally and center it in a neutral circle. The file canvas stays square,
as required by browsers and search engines; pixels outside the circle are clear.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'img' / 'niños-bebepunt.png'


def square_icon(source, size):
    edge = size * 4
    canvas = Image.new('RGBA', (edge, edge), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).ellipse((2, 2, edge - 3, edge - 3), fill='#f2efeb')
    artwork = ImageOps.contain(source, (int(edge * .84), int(edge * .84)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(artwork, ((edge - artwork.width) // 2, (edge - artwork.height) // 2))
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def build():
    with Image.open(SOURCE) as original:
        source = original.convert('RGBA')
        square_icon(source, 192).save(ROOT / 'img' / 'favicon-bebepunt.png', optimize=True)
        square_icon(source, 180).save(ROOT / 'img' / 'apple-touch-icon.png', optimize=True)
        square_icon(source, 48).save(ROOT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    print('Built circular PNG, Apple touch icon and ICO from the original three-children artwork.')


if __name__ == '__main__':
    build()
