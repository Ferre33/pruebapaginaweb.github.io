from pathlib import Path
from lxml import html,etree
from urllib.parse import urlsplit,unquote
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
        assert a.get('href')==cfg['route'](page,a.get('data-language-link'))
assert sorted(etree.parse(str(root/'sitemap.xml')).xpath('//*[local-name()="loc"]/text()'))==sorted(urls)
for p in (root/'portal').glob('*.html'):
 assert 'noindex' in p.read_text(),p
print('PASS: 12 public language pages, headings, canonical/hreflang, structured data, local links, sitemap and private noindex.')
