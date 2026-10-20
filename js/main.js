/* ===== BEBEPUNT · SCRIPTS ===== */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
/* 1. Cabecera que se vuelve blanca al bajar */
addEventListener('scroll',()=>$('#cabecera')?.classList.toggle('fijo',scrollY>60));
if($('#burger'))$('#burger').onclick=()=>$('#menu')?.classList.toggle('abierto');
/* 2. Selector de idioma ES/EN: cada texto lleva data-es y data-en */
function idioma(l){l=['es','en'].includes(l)?l:'es';try{localStorage.setItem('lang',l);}catch{}document.documentElement.lang=l;
 $$('[data-es]').forEach(e=>{if(e.dataset[l]!==undefined)e.innerHTML=e.dataset[l]});
 $$('.idioma button').forEach(b=>b.classList.toggle('on',b.dataset.l===l));}
$$('.idioma button').forEach(b=>b.onclick=()=>idioma(b.dataset.l));
let preferred='es';try{preferred=localStorage.getItem('lang')||'es';}catch{}idioma(preferred);
/* 3. Slider principal (cambia solo cada 6 s) */
const sl=$$('.slide');if(sl.length){let i=0;const pts=$('.puntos');
 sl.forEach((_,k)=>{const s=document.createElement('span');s.onclick=()=>ir(k);pts.append(s)});
 function ir(n){sl[i].classList.remove('activo');pts.children[i].classList.remove('on');i=(n+sl.length)%sl.length;sl[i].classList.add('activo');pts.children[i].classList.add('on')}
 ir(0);let t=setInterval(()=>ir(i+1),6000);
 $('#prev').onclick=()=>{ir(i-1);clearInterval(t)};$('#next').onclick=()=>{ir(i+1);clearInterval(t)};}
/* 4. Aparición de elementos al hacer scroll */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.15}):null;
$$('.reveal').forEach(e=>io?io.observe(e):e.classList.add('visible'));
/* 5. Instagram: botón "Cargar más" */
const mas=$('#masIg');if(mas)mas.onclick=()=>{$$('.ig-grid .oculto').forEach(e=>e.classList.remove('oculto'));mas.style.display='none'};
