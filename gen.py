# Ejecuta este script desde la carpeta raíz de la web (donde está index.html): python3 gen.py
# Regenera index.html y las páginas de about, contacto, colecciones y puntos-de-venta.
URL="https://ferre33.github.io/pruebapaginaweb.github.io/"
IG="https://www.instagram.com/bebepunt/"   # <-- CAMBIA por tu Instagram real
FB="https://www.facebook.com/bebepunt"     # <-- CAMBIA por tu Facebook real
def T(es,en,tag="span",cls=""):return f'<{tag} class="{cls}" data-es="{es}" data-en="{en}">{es}</{tag}>'
def head(t,d,p,sub):
    return f'''<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{t}</title><meta name="description" content="{d}">
<link rel="canonical" href="{URL}{p}"><meta property="og:url" content="{URL}{p}">
<meta property="og:title" content="{t}"><meta property="og:image" content="{URL}img/LOGO_BEBEPUNT.jpeg">
<!-- TIPOGRAFÍA: Comfortaa (Google Fonts) para TODA la web -->
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet">
<link rel="icon" href="{sub}img/LOGO_BEBEPUNT.jpeg"><link rel="stylesheet" href="{sub}css/styles.css">
</head><body{' class="interior"' if sub else ''}>
<!-- ========== CABECERA / MENÚ (logo, menú, selector idioma ES/EN, acceso B2B, redes) ========== -->
<header id="cabecera">
 <a class="logo" href="{sub or './'}"><img src="{sub}img/logo-bebepunt-largo.png" alt="BEBEPUNT" style="background:#4d4d4d;border-radius:12px;padding:4px"></a>
 <button id="burger" aria-label="Menú">☰</button>
 <ul id="menu">
  <li><a href="{sub or './'}">{T("INICIO","HOME")}</a></li>
  <li><a href="#">{T("COLECCIONES","COLLECTIONS")} ▾</a><ul class="sub">
    <li><a href="{sub}colecciones/#otono">{T("Otoño Invierno 26/27","Autumn Winter 26/27")}</a></li>
    <li><a href="{sub}colecciones/#primavera">{T("Primavera Verano 2026","Spring Summer 2026")}</a></li></ul></li>
  <li><a href="{sub}about/">{T("EMPRESA","COMPANY")}</a></li>
  <li><a href="{sub}puntos-de-venta/">{T("PUNTOS DE VENTA","POINTS OF SALE")}</a></li>
  <li><a class="b2b" href="#" title="Pon aquí el enlace de tu portal profesional">B2B {T("PROFESIONALES","PROFESSIONALS")}</a></li>
  <li><a href="{sub}contacto/">{T("CONTACTO","CONTACT")}</a></li>
  <li><a href="{FB}" target="_blank">Facebook</a></li><li><a href="{IG}" target="_blank">Instagram</a></li>
  <li class="idioma"><button data-l="es">ES</button> / <button data-l="en">EN</button></li>
 </ul>
</header>
'''
def foot(sub):
    return f'''
<!-- ========== PIE DE PÁGINA ========== -->
<footer><div class="wrap"><div class="pie">
 <div><img src="{sub}img/LOGO_BEBEPUNT.jpeg" alt="BEBEPUNT" style="width:120px;border-radius:50%"></div>
 <div><h4>{T("CONTÁCTANOS","CONTACT US")}</h4><ul><li>📍 Tu dirección, CP Ciudad (España)</li><li>📞 +34 000 000 000</li><li>✉ info@bebepunt.com</li></ul></div>
 <div><h4>{T("SÍGUENOS","FOLLOW US")}</h4><ul><li><a href="{FB}" target="_blank">Facebook</a></li><li><a href="{IG}" target="_blank">Instagram</a></li></ul></div>
 <div><h4>BEBEPUNT</h4><ul><li><a href="{sub}about/">{T("Sobre nosotros","About us")}</a></li><li><a href="{sub}puntos-de-venta/">{T("Puntos de venta","Points of sale")}</a></li><li><a href="{sub}colecciones/">{T("Colecciones","Collections")}</a></li><li><a href="{sub}contacto/">{T("Contacto","Contact")}</a></li></ul></div>
</div><p class="copy">© 2026 BEBEPUNT · {T("Todos los derechos reservados","All rights reserved")} · {T("Política de privacidad","Privacy policy")} | Cookies</p></div></footer>
<script src="{sub}js/main.js"></script></body></html>'''
def page(path,t,d,body,sub):
    import os;os.makedirs(os.path.dirname(path) or '.',exist_ok=True)
    open(path,'w').write(head(t,d,path.replace('index.html',''),sub)+body+foot(sub))
def cab(es,en):return f'<section class="cabecera-int"><h1 class="reveal">{T(es,en)}</h1><div class="sep"></div></section>'

# ---------- INICIO ----------
slides="".join(f'''
  <div class="slide" style="background-image:url(img/{im})"><h3>{T("NUEVA COLECCIÓN","NEW COLLECTION")}</h3><h2>{T("Otoño Invierno 26/27","Autumn Winter 26/27")}</h2><a class="btn" href="colecciones/#otono">{T("VER AHORA","SEE NOW")}</a></div>''' for im in ["bebe21.png","bebe22.png","bebe24.png"])
ops=[("bebe1.jpg","Marisol","“Diseño, calidad y un trato directo y amable. Sus colecciones son las mejores para vestir a los más pequeños.”","“Design, quality and friendly service. The best collections to dress the little ones.”"),
("bebe11.jpg","La Casita de Blanca","“Los diseños más dulces; destacaría la calidad de su punto, delicado y muy fino. Tejidos y estampados únicos.”","“The sweetest designs; the knitwear is delicate and very fine. Unique fabrics and prints.”"),
("bebe15.png","Primer bebé","“Prendas suaves y preciosas para los primeros días. Nos encantó el estilo y la comodidad.”","“Soft, beautiful clothes for the first days. We loved the style and comfort.”")]
opi="".join(f'<div class="opi reveal"><img src="img/{i}" alt="{n}"><h4>{n}</h4><p data-es="{e}" data-en="{n_}">{e}</p></div>' for i,n,e,n_ in ops)
ig="".join(f'<a href="{IG}" target="_blank"{" class=oculto" if k>7 else ""}><img src="img/bebe{k}.{"jpg" if k in(1,2,3,4,5,6,8,11,12,13,14,16,17,19) else "png"}" alt="BEBEPUNT" loading="lazy"></a>' for k in [1,2,3,4,6,8,9,11,12,13,14,16,17,19,15,18])
home=f'''
<!-- ========== 1. SLIDER PRINCIPAL (cambia las fotos en style="background-image") ========== -->
<section id="hero">{slides}
 <button class="flecha" id="prev">‹</button><button class="flecha" id="next">›</button><div class="puntos"></div></section>
<!-- ========== 2. INTRODUCCIÓN (logo animado + texto) ========== -->
<section id="intro" class="wrap reveal">
 <iframe src="img/bebepunt-animacion.html" title="BEBEPUNT" scrolling="no"></iframe>
 <img class="ramas" src="img/ramas-olivo.png" alt="" style="mix-blend-mode:multiply"><div class="sep"></div>
 <p data-es="Vistiendo a los pequeños reyes de la casa. Moda de <b>bebé</b> diseñada con mimo, tejidos suaves y la más alta <b>calidad</b>. Fábrica de ropa de bebé · Hecho en España." data-en="Dressing the little kings and queens of the house. <b>Baby</b> fashion made with love, soft fabrics and top <b>quality</b>. Baby clothing factory · Made in Spain.">Vistiendo a los pequeños reyes de la casa. Moda de <b>bebé</b> diseñada con mimo, tejidos suaves y la más alta <b>calidad</b>. Fábrica de ropa de bebé · Hecho en España.</p>
 <img class="ninos" src="img/ninos-andando.png" alt="">
</section>
<!-- ========== 3. BANNERS (colección + puntos de venta) ========== -->
<section class="banners">
 <a class="banner" href="colecciones/#primavera"><div class="fondo" style="background-image:url(img/bebe10.png)"></div><h4>{T("COLECCIÓN","COLLECTION")}</h4><h2>{T("Primavera Verano 26","Spring Summer 26")}</h2><span class="btn">{T("ENTRAR","ENTER")}</span></a>
 <a class="banner" href="puntos-de-venta/"><div class="fondo" style="background-image:url(img/bebe5.jpg)"></div><h4>{T("ENCUÉNTRANOS","FIND US")}</h4><h2>{T("PUNTOS DE VENTA","SALES POINTS")}</h2><span class="btn">{T("ENTRAR","ENTER")}</span></a>
</section>
<!-- ========== 4. CLIENTES SATISFECHOS (cambia nombre, foto y texto) ========== -->
<section id="opiniones"><div class="wrap"><img class="estrellas reveal" src="img/ramas-olivo.png" alt="" style="filter:invert(1) opacity(.6)">
 <h2 class="titulo" style="margin-top:20px">{T("CLIENTES SATISFECHOS","SATISFIED CUSTOMERS")}</h2><div class="sep"></div><div class="opi-lista">{opi}</div></div></section>
<!-- ========== 5. INSTAGRAM (8 fotos + "Cargar más") ========== -->
<section class="wrap"><h2 class="titulo reveal">{T("VISITA NUESTRO INSTAGRAM","VISIT OUR INSTAGRAM")}</h2><div class="sep"></div>
 <div class="ig-grid reveal">{ig}</div>
 <div class="centro"><button class="btn oscuro" id="masIg" style="background:none;cursor:pointer">{T("Cargar más","Load more")}</button><a class="btn oscuro" href="{IG}" target="_blank">{T("Seguir en Instagram","Follow on Instagram")}</a></div></section>
<!-- ========== 6. NEWSLETTER ========== -->
<section id="news"><div class="wrap reveal"><h2>{T("SUSCRÍBETE A BEBEPUNT","SIGN UP TO BEBEPUNT")}</h2><div class="sep"></div>
 <form><input type="email" required placeholder="email@ejemplo.com"><button class="btn oscuro" style="background:none;cursor:pointer">{T("Suscribirme","Subscribe")}</button>
 <label><input type="checkbox" id="priv"> {T("Acepto la política de privacidad.","I agree with the privacy policy.")}</label></form><p id="ok">{T("¡Te has suscrito correctamente!","You have successfully subscribed.")}</p></div></section>'''
page("index.html","BEBEPUNT · Moda y ropa de bebé","Fábrica de ropa de bebé BEBEPUNT. Hecho en España.",home,"")

# ---------- COLECCIONES ----------
def grid(ims):return '<div class="cuadricula">'+"".join(f'<div class="prenda reveal"><div><img src="../img/{i}" alt="" loading="lazy"></div><p>{T("Modelo","Model")} {k+1}</p></div>' for k,i in enumerate(ims))+'</div>'
col=cab("COLECCIONES","COLLECTIONS")+f'''<main class="wrap">
<!-- COLECCIÓN OTOÑO INVIERNO -->
<h2 class="titulo" id="otono">{T("Otoño Invierno 26/27","Autumn Winter 26/27")}</h2><div class="sep"></div>{grid(["bebe2.jpg","bebe4.jpg","bebe8.jpg","bebe12.jpg","bebe14.jpg","bebe19.jpg"])}
<!-- COLECCIÓN PRIMAVERA VERANO -->
<h2 class="titulo" id="primavera">{T("Primavera Verano 2026","Spring Summer 2026")}</h2><div class="sep"></div>{grid(["bebe1.jpg","bebe3.jpg","bebe6.jpg","bebe9.png","bebe13.jpg","bebe17.jpg"])}</main>'''
page("colecciones/index.html","Colecciones · BEBEPUNT","Colecciones de ropa de bebé BEBEPUNT",col,"../")

# ---------- PUNTOS DE VENTA ----------
tn=[("Madrid","Calle Ejemplo 1"),("Barcelona","Calle Ejemplo 2"),("Sevilla","Calle Ejemplo 3"),("Valencia","Calle Ejemplo 4")]
pv=cab("PUNTOS DE VENTA","POINTS OF SALE")+'<main class="wrap"><!-- Duplica un bloque .tienda por cada tienda --><div class="tiendas">'+"".join(f'<div class="tienda reveal"><h3>BEBEPUNT {c}</h3><p>📍 {d}<br>📞 +34 000 000 000</p></div>' for c,d in tn)+'</div></main>'
page("puntos-de-venta/index.html","Puntos de venta · BEBEPUNT","Dónde comprar BEBEPUNT",pv,"../")

# ---------- ABOUT ----------
ab=cab("LA EMPRESA","THE COMPANY")+f'''<main class="wrap" style="text-align:center;max-width:820px"><img class="reveal" src="../img/ninos-bebepunt.png" style="width:260px;margin:0 auto">
<p class="reveal" data-es="BEBEPUNT es una fábrica de ropa de bebé hecha en España. Diseñamos prendas suaves, delicadas y duraderas para los primeros años. (Edita este texto.)" data-en="BEBEPUNT is a baby clothing factory made in Spain. We design soft, delicate, long-lasting garments for the first years. (Edit this text.)">BEBEPUNT es una fábrica de ropa de bebé hecha en España. Diseñamos prendas suaves, delicadas y duraderas para los primeros años. (Edita este texto.)</p>
<img class="reveal" src="../img/bebe20.jpg" style="margin:40px auto;border-radius:24px"></main>'''
page("about/index.html","Empresa · BEBEPUNT","Sobre BEBEPUNT",ab,"../")

# ---------- CONTACTO ----------
ct=cab("CONTACTO","CONTACT")+f'''<main class="wrap"><div class="contacto-caja"><form class="reveal izq" onsubmit="event.preventDefault();alert('OK')"><input placeholder="Nombre / Name" required><input type="email" placeholder="Email" required><textarea rows="6" placeholder="Mensaje / Message"></textarea><button class="btn oscuro" style="background:none;cursor:pointer">{T("ENVIAR","SEND")}</button></form>
<div class="reveal der"><p>📍 Tu dirección<br>📞 +34 000 000 000<br>✉ info@bebepunt.com</p><br><img src="../img/LOGO_BEBEPUNT.jpeg" style="width:200px;border-radius:50%"></div></div></main>'''
page("contacto/index.html","Contacto · BEBEPUNT","Contacta con BEBEPUNT",ct,"../")
