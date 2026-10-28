/* Shared language preference: public site, customer portal and legal documents. */
(() => {
 'use strict';
 let lang='es';try{lang=localStorage.getItem('lang')==='en'?'en':'es';}catch{}
 const pageLang=document.documentElement.dataset.pageLang;
 if(pageLang==='es'||pageLang==='en'){lang=pageLang;try{localStorage.setItem('lang',lang);}catch{}}
 const api=window.BEBEPUNT_I18N={get lang(){return lang;},get locale(){return lang==='en'?'en-GB':'es-ES';},message, text:(es,en)=>lang==='en'?en:es,set};
 function message(value){const text=String(value||'');const messages=window.BEBEPUNT_MESSAGES||{};const auth={"Invalid login credentials":["Correo o contraseña incorrectos.","Incorrect email or password."],"Email not confirmed":["Verifica tu correo antes de iniciar sesión.","Verify your email before signing in."],"User already registered":["Este correo ya está registrado.","This email is already registered."],"Email rate limit exceeded":["Demasiados intentos. Espera unos minutos antes de volver a intentarlo.","Too many attempts. Please wait a few minutes and try again."],"Failed to fetch":["No se ha podido conectar. Comprueba tu conexión.","Could not connect. Check your connection."]};if(auth[text])return auth[text][lang==='en'?1:0];if(lang==='es')return text;if(messages[text])return messages[text];if(Object.values(messages).includes(text))return text;return 'The request could not be completed. Please try again or contact BEBEPUNT.';}
 function render(){document.documentElement.lang=lang;document.querySelectorAll('[data-es][data-en]').forEach(el=>{const value=el.getAttribute('data-'+lang);if(el.innerHTML!==value)el.innerHTML=value;});for(const attr of ['placeholder','aria-label','alt','title'])document.querySelectorAll('[data-'+attr+'-'+lang+']').forEach(el=>el.setAttribute(attr,el.getAttribute('data-'+attr+'-'+lang)));document.querySelectorAll('.idioma button').forEach(b=>{const active=b.dataset.l===lang;b.classList.toggle('on',active);b.setAttribute('aria-pressed',String(active));});}
 function set(value){if(!['es','en'].includes(value))return;if(pageLang&&value!==pageLang){const link=document.querySelector('[data-language-link="'+value+'"]');if(link){location.href=link.href;return;}}const changed=value!==lang;lang=value;try{localStorage.setItem('lang',lang);}catch{}render();if(changed)window.dispatchEvent(new CustomEvent('bebepunt:language',{detail:{lang}}));}
 document.addEventListener('DOMContentLoaded',()=>{render();document.querySelectorAll('.idioma button').forEach(b=>b.onclick=()=>set(b.dataset.l));});
 window.addEventListener('storage',e=>{if(!pageLang&&e.key==='lang')set(e.newValue);});
 document.documentElement.lang=lang;
})();
