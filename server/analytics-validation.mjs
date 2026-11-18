const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const pages=new Set(['index.html','about/index.html','colecciones/index.html','contacto/index.html','para-tiendas/index.html','puntos-de-venta/index.html','politica-privacidad-bebepunt/privacidad/index.html','portal/index.html','portal/inicio.html','portal/catalogo.html','portal/colecciones.html','portal/producto.html','portal/perfil.html']);
export function validateAnalytics(p){
 if(p?.consent!==true||!uuid.test(p.id)||!uuid.test(p.session_id)||!['mobile','tablet','desktop'].includes(p.device))throw Error('invalid');
 let path=String(p.page).replace(/^\/pruebapaginaweb.github.io\//,'/').replace(/^\//,'').replace(/^en\//,'');
 if(!path||path.endsWith('/'))path+='index.html';
 if(!pages.has(path))throw Error('invalid_page');
 let referrer='Direct';
 try{if(p.referrer){const url=new URL(p.referrer);if(!['http:','https:'].includes(url.protocol))throw Error();referrer=url.hostname.slice(0,150);}}catch{referrer='Unknown';}
 if(['pruebapaginawebgithubio.vercel.app','ferre33.github.io'].includes(referrer))referrer='Internal';
 return {id:p.id,session_id:p.session_id,page:'/'+path,device:p.device,language:p.language==='en'?'en':'es',referrer};
}
