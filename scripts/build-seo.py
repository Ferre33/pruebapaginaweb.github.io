"""Regenerate public metadata and static English pages. Requires lxml and Pillow.
Run from any directory: python scripts/build-seo.py
Set SITE_ORIGIN when permanently migrating the production domain.
"""
from pathlib import Path
from lxml import html, etree
from PIL import Image
from urllib.parse import urljoin, urlsplit
import os, json, re, copy
ROOT=Path(__file__).resolve().parents[1]
ORIGIN=os.environ.get('SITE_ORIGIN','https://pruebapaginawebgithubio.vercel.app').rstrip('/')
PAGES={
'index.html': ('Ropa de bebé para tiendas · Fabricada en España | BEBEPUNT','Baby clothing for retailers · Made in Spain | BEBEPUNT','Moda de bebé fabricada en España. Descubre las colecciones BEBEPUNT, la colección de ceremonia y la información para tiendas y distribuidores.','Baby clothing made in Spain. Explore BEBEPUNT collections, occasion wear and information for retailers and distributors.','Ropa de bebé fabricada en España para tiendas','Baby clothing made in Spain for retailers'),
'about/index.html':('BEBEPUNT · Fabricación de ropa de bebé en Ayora','BEBEPUNT · Baby clothing made in Ayora, Spain','Conoce la historia familiar de BEBEPUNT desde 1967 y nuestra fabricación de ropa de bebé en Ayora, Valencia.','Discover BEBEPUNT’s family history since 1967 and our baby clothing manufacturing in Ayora, Valencia, Spain.','BEBEPUNT: nuestra historia y fabricación en Ayora','BEBEPUNT: our history and manufacturing in Ayora'),
'colecciones/index.html':('Colecciones de ropa de bebé y ceremonia | BEBEPUNT','Baby clothing and occasion wear collections | BEBEPUNT','Descubre las colecciones de ropa de bebé BEBEPUNT: otoño-invierno, primavera-verano y ceremonia. Información del catálogo para tiendas.','Explore BEBEPUNT baby clothing collections: autumn-winter, spring-summer and occasion wear. Catalogue information for retailers.','Colecciones de ropa de bebé y ceremonia','Baby clothing and occasion wear collections'),
'para-tiendas/index.html':('Ropa de bebé al por mayor para tiendas | BEBEPUNT','Wholesale baby clothing for retailers | BEBEPUNT','¿Tienes una tienda de moda infantil? Conoce BEBEPUNT, fabricante de ropa de bebé en España, y solicita información para distribuir nuestras colecciones.','Do you run a baby clothing shop? Discover BEBEPUNT, a baby clothing manufacturer in Spain, and enquire about stocking our collections.','Ropa de bebé al por mayor para tiendas','Wholesale baby clothing for retailers'),
'puntos-de-venta/index.html':('Dónde encontrar ropa de bebé BEBEPUNT · Puntos de venta','Where to find BEBEPUNT baby clothing · Stockists','Consulta los puntos de venta de BEBEPUNT y encuentra tiendas de moda infantil donde conocer nuestras colecciones de ropa de bebé.','Find BEBEPUNT stockists and baby clothing shops where you can discover our collections.','Tiendas y puntos de venta BEBEPUNT','BEBEPUNT shops and stockists'),
'contacto/index.html':('Contacto BEBEPUNT · Consultas de tiendas y distribuidores','Contact BEBEPUNT · Retailer and distributor enquiries','Contacta con BEBEPUNT en Ayora, Valencia. Resolvemos consultas sobre nuestras colecciones de bebé y la distribución para tiendas.','Contact BEBEPUNT in Ayora, Valencia, Spain. Ask about our baby clothing collections and distribution for retailers.','Contacta con BEBEPUNT','Contact BEBEPUNT')}
def route(path,lang):
    return ('/en/' if lang=='en' else '/')+('' if path=='index.html' else path)
def bilingual(tag,es,en,**attrs):
    e=html.Element(tag,**attrs);e.set('data-es',es);e.set('data-en',en);e.text=es;return e
def replace_content(el,value):
    for c in list(el):el.remove(c)
    el.text=None
    fragments=html.fragments_fromstring(value)
    for f in fragments:
        if isinstance(f,str): el.text=(el.text or '')+f
        else:el.append(f)
def paths(doc,path,lang):
    def rewrite(v):
        if not v or v.startswith(('#','data:','mailto:','tel:','javascript:','//')) or urlsplit(v).scheme:return v
        absolute=urlsplit(urljoin('/'+path,v)); p=absolute.path
        key=p.lstrip('/')
        if key=='' :key='index.html'
        if key in PAGES:p=route(key,lang)
        return p+('?' +absolute.query if absolute.query else '')+('#'+absolute.fragment if absolute.fragment else '')
    for el in doc.iter():
        for attr in ('href','src','action','poster'):
            if el.get(attr):el.set(attr,rewrite(el.get(attr)))
        if el.get('style'):el.set('style',re.sub(r'url\([\'"]?([^\)\'\"]+)[\'"]?\)',lambda m:'url('+rewrite(m[1])+')',el.get('style')))
        if el.tag=='style' and el.text:el.text=re.sub(r'url\([\'"]?([^\)\'\"]+)[\'"]?\)',lambda m:'url('+rewrite(m[1])+')',el.text)
    # Public menu headings must be crawlable, not placeholder links.
    for a in doc.xpath('//a[@href="#"][.//span[@data-es="COLECCIONES"]]'):a.set('href',route('colecciones/index.html',lang))
    for a in doc.xpath('//a[@data-privacy]'):a.set('href','/politica-privacidad-bebepunt/privacidad/index.html')

def optimize_assets(doc,path):
    manifest_file=ROOT/'scripts/image-manifest.json'
    if not manifest_file.exists():return
    manifest=json.loads(manifest_file.read_text())
    by_output={v['src']:v for v in manifest.values()}
    for img in doc.xpath('//img[@src]'):
        src=urlsplit(urljoin('/'+path,img.get('src'))).path
        entry=manifest.get(src) or by_output.get(src)
        if entry:
            img.set('src',entry['src']);img.set('width',str(entry['width']));img.set('height',str(entry['height']))
            if 'small' in entry:
                img.set('srcset',f"{entry['small']} {entry['small_width']}w, {entry['src']} {entry['width']}w")
                img.set('sizes','(max-width: 700px) 100vw, 50vw')
        if not img.xpath('ancestor::header') and not img.xpath('ancestor::section[contains(@class,"cabecera-int")]'):
            img.set('loading','lazy')
    for el in doc.xpath('//*[@style]|//style'):
        value=el.get('style') if el.tag!='style' else el.text
        if not value:continue
        for source,entry in manifest.items():
            value=value.replace(source,entry['src'])
        if el.tag=='style':el.text=value
        else:el.set('style',value)
    head=doc.find('head')
    if path=='index.html':
        for el in head.xpath('./link[@id="hero-preload"]'):head.remove(el)
        etree.SubElement(head,'link',id='hero-preload',rel='preload',href=manifest.get('/img/bebe21.png',{}).get('src','/img/bebe21.png'),**{'as':'image','type':'image/webp','fetchpriority':'high'})

def build():
 for path,data in PAGES.items():
    base=html.document_fromstring((ROOT/path).read_text())
    # Keep one visible main heading, with lower levels used for subsections.
    hs=base.xpath('//h1')
    if not hs:
        h=bilingual('h1',data[4],data[5],**{'class':'seo-title'})
        target=base.get_element_by_id('intro') if path=='index.html' else base.xpath('//section[contains(@class,"cabecera-int")]')[0]
        target.insert(0,h)
    else:
        h=hs[0];replace_content(h,data[4]);h.set('data-es',data[4]);h.set('data-en',data[5])
    for e in base.xpath('//h2[not(normalize-space())]'):e.getparent().remove(e)
    if path=='index.html':
        for e in base.xpath('//div[contains(@class,"slide")]/h3'):e.tag='p';e.set('class','collection-label')
        for e in base.xpath('//a[@class="banner"]/h4'):e.tag='p'
        for e in base.xpath('//div[contains(concat(" ",@class," ")," opi ")]/h4'):e.tag='h3'
    if path=='index.html' and not base.xpath('//*[@id="seo-retail-intro"]'):
        section=base.get_element_by_id('intro')
        section.append(bilingual('p','Diseñamos y fabricamos ropa de bebé en Ayora, Valencia. Descubre nuestras colecciones de punto y ceremonia para tiendas de moda infantil.','We design and manufacture baby clothing in Ayora, Valencia, Spain. Explore our knitwear and occasion wear collections for baby clothing retailers.',id='seo-retail-intro'))
        section.append(bilingual('a','Información para tiendas y distribuidores','Information for retailers and distributors',href='/para-tiendas/index.html',**{'class':'btn oscuro'}))
    if path=='colecciones/index.html' and not base.xpath('//*[@id="seo-collections-intro"]'):
        h=base.xpath('//h1')[0]
        p=bilingual('p','Conoce nuestras propuestas de ropa de bebé para cada temporada y la colección de ceremonia. La colección de ceremonia está disponible actualmente para tiendas; el resto de colecciones no está disponible para pedidos.','Explore our seasonal baby clothing and occasion wear collections. The occasion wear collection is currently available to retailers; the other collections are not currently available to order.',id='seo-collections-intro',**{'class':'seo-intro'})
        h.addnext(p)
    # Below-fold images: reserve aspect ratio and defer network work.
    for img in base.xpath('//img[@src]'):
        file=ROOT/urlsplit(urljoin('/'+path,img.get('src'))).path.lstrip('/')
        if file.is_file():
            try:
                with Image.open(file) as im:img.set('width',str(im.width));img.set('height',str(im.height))
            except OSError:pass
        img.set('decoding','async')
        if not img.xpath('ancestor::header') and path=='index.html':img.set('loading','lazy')
        if 'alt' not in img.attrib:img.set('alt','')
    for lang in ('es','en'):
        doc=copy.deepcopy(base);doc.set('lang',lang);doc.set('data-page-lang',lang)
        for e in doc.xpath('//*[@data-es and @data-en]'):replace_content(e,e.get('data-'+lang))
        for attr in ('alt','title','placeholder','aria-label'):
            for e in doc.xpath('//*[@data-'+attr+'-'+lang+']'):e.set(attr,e.get('data-'+attr+'-'+lang))
        paths(doc,path,lang)
        optimize_assets(doc,path)
        head=doc.find('head');canonical=ORIGIN+route(path,lang); title=data[0 if lang=='es' else 1];desc=data[2 if lang=='es' else 3]
        for e in head.xpath('./title|./meta[@name="description" or starts-with(@property,"og:") or starts-with(@name,"twitter:")]|./link[@rel="canonical" or @hreflang]|./script[@id="seo-schema"]|./noscript[@id="seo-noscript"]'):head.remove(e)
        etree.SubElement(head,'title').text=title
        def meta(**a):etree.SubElement(head,'meta',**a)
        meta(name='description',content=desc)
        etree.SubElement(head,'link',rel='canonical',href=canonical)
        for l in ('es','en','x-default'):etree.SubElement(head,'link',rel='alternate',hreflang=l,href=ORIGIN+route(path,'es' if l=='x-default' else l))
        for prop,val in {'type':'website','site_name':'BEBEPUNT','title':title,'description':desc,'url':canonical,'image':ORIGIN+'/img/logo-bebepunt-largo.png','locale':'es_ES' if lang=='es' else 'en_GB'}.items():meta(property='og:'+prop,content=val)
        meta(name='twitter:card',content='summary');meta(name='twitter:title',content=title);meta(name='twitter:description',content=desc);meta(name='twitter:image',content=ORIGIN+'/img/logo-bebepunt-largo.png')
        org={'@type':'Organization','@id':ORIGIN+'/#organization','name':'BEBEPUNT','url':ORIGIN+'/','logo':ORIGIN+'/img/logo-bebepunt-largo.png','sameAs':['https://www.instagram.com/bebepunt/','https://www.facebook.com/bebepunt']}
        graph=[org,{'@type':'WebSite','@id':ORIGIN+'/#website','url':ORIGIN+'/','name':'BEBEPUNT','inLanguage':['es','en'],'publisher':{'@id':org['@id']}}]
        if path!='index.html':graph.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Inicio' if lang=='es' else 'Home','item':ORIGIN+route('index.html',lang)},{'@type':'ListItem','position':2,'name':data[4 if lang=='es' else 5],'item':canonical}]})
        etree.SubElement(head,'script',type='application/ld+json',id='seo-schema').text=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False)
        etree.SubElement(etree.SubElement(head,'noscript',id='seo-noscript'),'style').text='.reveal{opacity:1!important;transform:none!important}'
        for holder in doc.xpath('//*[contains(concat(" ",@class," ")," idioma ")]'):
            for c in list(holder):holder.remove(c)
            holder.text=None
            for l in ('es','en'):
                a=etree.SubElement(holder,'a',href=route(path,l),hreflang=l,lang=l);a.text=l.upper();a.set('data-language-link',l)
                if l==lang:a.set('aria-current','page')
                a.tail=' / ' if l=='es' else ''
        dest=ROOT/(('en/' if lang=='en' else '')+path);dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text('<!DOCTYPE html>\n'+html.tostring(doc,encoding='unicode',method='html')+'\n')
 sitemap=etree.Element('urlset',xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
 for p in PAGES:
    for l in ('es','en'):etree.SubElement(etree.SubElement(sitemap,'url'),'loc').text=ORIGIN+route(p,l)
 (ROOT/'sitemap.xml').write_bytes(etree.tostring(sitemap,encoding='UTF-8',xml_declaration=True,pretty_print=True))
 (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+ORIGIN+'/sitemap.xml\n')
if __name__=='__main__':build()
