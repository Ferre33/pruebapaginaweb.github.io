from pathlib import Path
from lxml import html,etree
from urllib.parse import urlsplit,unquote,urljoin
import json,runpy
cfg=runpy.run_path(str(Path(__file__).with_name('build-seo.py')))
root=cfg['ROOT']; pages=cfg['PAGES'];origin=cfg['ORIGIN'];urls=[]
for page in pages:
 for lang in ('es','en'):
    file=root/(('en/' if lang=='en' else '')+page);doc=html.parse(str(file));url=origin+cfg['route'](page,lang);urls.append(url)
    assert len(doc.xpath('//h1'))==1,file
    assert doc.xpath('string(/html/@lang)')==lang,file
    assert doc.xpath('//link[@rel="canonical"]/@href')==[url],file
    assert len(doc.xpath('//link[@hreflang]'))==3,file
    assert len(doc.xpath('//meta[@name="description"]'))==1,file
    assert len(doc.xpath('//title'))==1,file
    assert not doc.xpath('//h1[not(normalize-space())]|//h2[not(normalize-space())]'),file
    for s in doc.xpath('//script[@type="application/ld+json"]/text()'):json.loads(s)
    for e in doc.xpath('//*[@href or @src]'):
        v=e.get('src') or e.get('href');path=unquote(urlsplit(v).path)
        if not urlsplit(v).netloc and path.startswith('/') and not path.startswith('//'):
            target=root/path.lstrip('/')
            if path.endswith('/'):target=target/'index.html'
            assert target.exists(),(file,v)
    for a in doc.xpath('//*[@data-language-link]'):
        assert urljoin('/'+str(file.relative_to(root)),a.get('href')).removesuffix('index.html')==cfg['route'](page,a.get('data-language-link')).removesuffix('index.html')
assert sorted(etree.parse(str(root/'sitemap.xml')).xpath('//*[local-name()="loc"]/text()'))==sorted(urls)
for p in (root/'portal').glob('*.html'):
 assert 'noindex' in p.read_text(),p
print('PASS: 12 public language pages, headings, canonical/hreflang, structured data, local links, sitemap and private noindex.')

from PIL import Image
manifest=json.loads((root/'scripts/image-manifest.json').read_text()) if (root/'scripts/image-manifest.json').exists() else {}
for entry in manifest.values():
 for key in ('src','small'):
  if key in entry:
   with Image.open(root/entry[key].lstrip('/')) as im:im.load()
for p in [root/q for q in pages]+list((root/'en').rglob('*.html')):
 doc=html.parse(str(p))
 for img in doc.xpath('//img[@srcset]'):
  for candidate in img.get('srcset').split(','):
   assert (root/urljoin('/'+str(p.relative_to(root)),candidate.strip().split()[0]).lstrip('/')).exists()
assert html.parse(str(root/'index.html')).xpath('//meta[@name="google-site-verification"]')
print('PASS: optimized images decode, responsive sources exist, verification tag present.')
