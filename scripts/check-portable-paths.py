from pathlib import Path
from urllib.parse import urljoin,urlsplit,unquote
from lxml import html
import runpy,re
cfg=runpy.run_path(str(Path(__file__).with_name('build-seo.py')));root=cfg['ROOT']
for page in cfg['PAGES']:
 for lang in ('es','en'):
  path=('en/' if lang=='en' else '')+page
  doc=html.parse(str(root/path));refs=doc.xpath('//@src|//@href')
  for srcset in doc.xpath('//@srcset'):refs += [s.strip().split()[0] for s in srcset.split(',')]
  for style in doc.xpath('//@style|//style/text()'):refs += re.findall(r'url\(([^)]+)\)',style)
  for prefix in ('/','/pruebapaginaweb.github.io/'):
   for ref in refs:
    if urlsplit(ref).scheme or ref.startswith('//'):continue
    assert not ref.startswith('/'),(path,ref)
    resolved=urlsplit(urljoin('https://example.test'+prefix+path,ref)).path
    assert resolved.startswith(prefix),(path,ref)
    target=root/unquote(resolved[len(prefix):])
    if resolved.endswith('/'):target=target/'index.html'
    assert target.is_file(),(path,ref,target)
print('PASS: assets, CSS, scripts, srcset, backgrounds and navigation on both root and GitHub Pages subpath; 12 ES/EN pages.')
