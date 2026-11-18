(() => {
 const script=document.currentScript, base=new URL('../',script.src), privacy=new URL('politica-privacidad-bebepunt/privacidad/index.html',base);
 if(/\/portal\/(admin|estadisticas|ultimas-tallas|simulacion|carrito|pedidos)/.test(location.pathname))return;
 const tr=(es,en)=>window.BEBEPUNT_I18N?.text(es,en)||(document.documentElement.lang==='en'?en:es);
 const key='bebepunt.analytics.choice.v1',sessionKey='bebepunt.analytics.session.v1';
 let choice=null,sent=false,timer;
 try{choice=JSON.parse(localStorage.getItem(key));if(!choice||Date.now()-choice.at>180*86400000)choice=null;}catch{}
 const panel=document.createElement('aside');panel.setAttribute('aria-label',tr('Preferencias de estadísticas','Analytics preferences'));
 panel.style.cssText='position:fixed;bottom:18px;left:18px;right:18px;max-width:560px;z-index:10000;padding:22px;background:#fff;color:#49443f;border:1px solid #c9c2b9;border-radius:12px;box-shadow:0 5px 30px #0002;font:14px/1.6 sans-serif';
 const prefs=document.createElement('button');prefs.type='button';prefs.style.cssText='margin:14px;padding:8px 12px;font-size:12px';document.body.append(prefs,panel);
 function send(){
  if(!choice?.yes||sent)return;sent=true;
  try{
   let session=JSON.parse(sessionStorage.getItem(sessionKey)||'null');
   if(!session||Date.now()-session.at>30*60000)session={id:crypto.randomUUID()};
   session.at=Date.now();sessionStorage.setItem(sessionKey,JSON.stringify(session));
   const ua=navigator.userAgent,device=/ipad|tablet/i.test(ua)?'tablet':/mobile/i.test(ua)?'mobile':'desktop';
   const endpoint=location.hostname==='ferre33.github.io'?'https://pruebapaginawebgithubio.vercel.app/api/analytics':'/api/analytics';
   fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,body:JSON.stringify({consent:true,id:crypto.randomUUID(),session_id:session.id,page:location.pathname,device,language:window.BEBEPUNT_I18N?.lang||document.documentElement.lang,referrer:document.referrer})}).catch(()=>{});
  }catch{}
 }
 function render(open=!choice){
  prefs.textContent=tr('Preferencias de estadísticas','Analytics preferences');
  panel.hidden=!open;panel.innerHTML='';
  const p=document.createElement('p');p.textContent=tr('¿Nos permites medir las visitas para mejorar BEBEPUNT? Con tu permiso recogemos las páginas visitadas y la ciudad aproximada de conexión, sin guardar tu IP en las estadísticas. Puedes rechazarlo y seguir navegando.','May we measure visits to improve BEBEPUNT? With your permission we collect visited pages and the approximate connection city, without storing your IP in analytics. You can decline and continue browsing.');
  const a=document.createElement('a');a.href=privacy.href;a.textContent=tr('Política de privacidad','Privacy policy');panel.append(p,a);
  const actions=document.createElement('div');actions.style.cssText='display:flex;gap:12px;flex-wrap:wrap;margin-top:16px';
  for(const [yes,label] of [[false,tr('Rechazar','Decline')],[true,tr('Aceptar estadísticas','Accept analytics')]]){
   const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='background:#655f59;color:white;border:0;border-radius:6px;padding:12px;cursor:pointer;font:inherit';
   b.onclick=()=>{choice={yes,at:Date.now()};try{localStorage.setItem(key,JSON.stringify(choice));if(!yes)sessionStorage.removeItem(sessionKey);}catch{}clearTimeout(timer);panel.hidden=true;if(yes)send();};actions.append(b);
  }panel.append(actions);
 }
 prefs.onclick=()=>render(true);window.addEventListener('bebepunt:language',()=>render(!panel.hidden));
 render();if(choice?.yes)timer=setTimeout(send,500);
})();
