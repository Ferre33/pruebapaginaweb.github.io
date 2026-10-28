"""Encode public raster assets as WebP; retain original files. Run before build-seo.py."""
from pathlib import Path
from PIL import Image,ImageOps
import json,re,io
def save_webp(im,dest,quality):
    buffer=io.BytesIO();im.save(buffer,'WEBP',quality=quality,method=6)
    data=buffer.getvalue();assert len(data)>0
    dest.write_bytes(data)
    assert dest.read_bytes()==data

ROOT=Path(__file__).resolve().parents[1]
paths=['index.html','about/index.html','colecciones/index.html','contacto/index.html','para-tiendas/index.html','puntos-de-venta/index.html']
text='\n'.join((ROOT/p).read_text() for p in paths)+'\n'+'\n'.join(p.read_text() for p in (ROOT/'css').glob('*.css'))
refs=sorted(set(re.findall(r'(?:/|\.\./)?img/([^\s\"\'<>;)]+\.(?:png|jpg|jpeg))',text)))
manifest={}
previous=ROOT/'scripts/image-manifest.json'
if previous.exists():refs=sorted(set(refs)|{Path(k).name for k in json.loads(previous.read_text())})
for name in refs:
    src=ROOT/'img'/name
    if not src.exists() or src.stat().st_size<40000:continue
    with Image.open(src) as opened:
        im=ImageOps.exif_transpose(opened).convert('RGBA' if 'A' in opened.getbands() else 'RGB')
        im.thumbnail((1600,1600),Image.Resampling.LANCZOS)
        dest=ROOT/'img'/'optimized'/(src.stem+'.webp');dest.parent.mkdir(exist_ok=True)
        save_webp(im,dest,84)
        if dest.stat().st_size>=src.stat().st_size:dest.unlink();continue
        entry={'src':'/img/optimized/'+dest.name,'width':im.width,'height':im.height,'original_bytes':src.stat().st_size,'bytes':dest.stat().st_size}
        # Responsive variants for photographic content; avoid logos/icons.
        if (name.startswith('bebe') or name.startswith('ceremonia')) and im.width>640:
            small=im.copy();small.thumbnail((640,640),Image.Resampling.LANCZOS)
            mobile=dest.with_name(dest.stem+'-640.webp');save_webp(small,mobile,82)
            entry['small']='/img/optimized/'+mobile.name;entry['small_width']=small.width
        manifest['/img/'+name]=entry
(ROOT/'scripts/image-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'images':len(manifest),'original_bytes':sum(x['original_bytes'] for x in manifest.values()),'webp_bytes':sum(x['bytes'] for x in manifest.values())}))
