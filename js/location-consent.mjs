export const CHOICE_KEY='bebepunt.zone.preference.v1';
export const CONSENT_VERSION='2026-11-26';
export function coordinateCell(coords) {
  if(!coords||!Number.isFinite(coords.latitude)||Math.abs(coords.latitude)>90||!Number.isFinite(coords.longitude)||Math.abs(coords.longitude)>180||!Number.isFinite(coords.accuracy)||coords.accuracy<0||coords.accuracy>5000)return null;
  return {latCell:Math.round(coords.latitude*100),lonCell:Math.round(coords.longitude*100),accuracy:Math.ceil(coords.accuracy/100)*100};
}
export function savedChoice(storage, now=Date.now()) {
  try {const p=JSON.parse(storage.getItem(CHOICE_KEY));return p?.version===CONSENT_VERSION&&['shared','declined'].includes(p.choice)&&p.expires>now?p.choice:null;}catch{return null;}
}

export function startLocationConsent({rootURL=new URL('../',import.meta.url),delay=6000}={}) {
  if(document.getElementById('zone-preferences'))return;
  const production=['bebepunt.com','www.bebepunt.com','pruebapaginawebgithubio.vercel.app'].includes(location.hostname);
  const preview=location.hostname.endsWith('.vercel.app');
  if(!production&&!preview)return;
  if(['admin','estadisticas','recuperar','ultimas-tallas','simulacion'].includes(document.body.dataset.page))return;
  const blocked=()=>navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1';
  const tr=(es,en)=>(window.BEBEPUNT_I18N?.lang||document.documentElement.lang)==='en'?en:es;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const countryName=code=>{try{return new Intl.DisplayNames([tr('es','en')],{type:'region'}).of(code);}catch{return code;}};
  const label=p=>[p.city,p.province||p.region,countryName(p.country)].filter(Boolean).join(' · ');
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('css/location-consent.css?v=20261126',rootURL).href;document.head.append(stylesheet);
  const entry=document.createElement('button');entry.id='zone-preferences';entry.type='button';entry.className='zone-preferences';
  (document.querySelector('footer')||document.body).append(entry);
  const panel=document.createElement('section');panel.id='zone-panel';panel.hidden=true;panel.setAttribute('aria-labelledby','zone-title');panel.setAttribute('role','region');document.body.append(panel);
  let stage='intro',epoch=0,controller=null,candidates=[],token=null,error='',notice='',timer,openedBy=null;
  let memoryChoice=null;
  const choice=()=>{try{return savedChoice(localStorage)||memoryChoice;}catch{return memoryChoice;}};
  const remember=value=>{memoryChoice=value;try{localStorage.setItem(CHOICE_KEY,JSON.stringify({version:CONSENT_VERSION,choice:value,expires:Date.now()+90*86400000}));}catch{}};
  const cancelPending=()=>{epoch++;controller?.abort();controller=null;};
  function close(reject=false){cancelPending();clearTimeout(timer);if(reject)remember('declined');panel.hidden=true;openedBy?.focus();}
  function open(manual=false){clearTimeout(timer);cancelPending();stage='intro';error='';notice='';openedBy=manual?entry:null;panel.hidden=false;render();if(manual)panel.querySelector('button')?.focus();}
  function render() {
   if(!entry.isConnected)(document.querySelector('footer')||document.body).append(entry);
   entry.textContent=tr('Preferencias de ubicación','Location preferences');
   if(panel.hidden)return;
   const preferences=choice();
   panel.innerHTML=`<h2 id="zone-title">${tr('¿Desde qué localidad nos visitas?','Which town are you visiting from?')}</h2>
    <p>${tr('Ayúdanos a conocer las zonas donde interesa BEBEPUNT. Con tu permiso usaremos la ubicación del dispositivo para sugerir una localidad que podrás confirmar. Es opcional y puedes seguir navegando sin compartirla.','Help us understand where people are interested in BEBEPUNT. With your permission, we will use your device location to suggest a town for you to confirm. This is optional; you can keep browsing without sharing it.')}</p>
    <p class="zone-detail">${tr('Guardamos solo recuentos por localidad, sin asociarlos a tu nombre ni a tu cuenta. Las coordenadas se redondean antes de enviarlas y no se guardan.','We store only totals by town, without linking them to your name or account. Coordinates are rounded before being sent and are not stored.')} <a href="${new URL('politica-privacidad-bebepunt/privacidad/index.html#section-14',rootURL).href}">${tr('Cómo usamos la ubicación','How we use location')}</a></p>
    <div id="zone-step"></div><p id="zone-status" role="status" aria-live="polite">${esc(error||notice)}</p>
    <div class="zone-actions" id="zone-reject-row"><button type="button" id="zone-decline">${tr(preferences==='shared'?'Retirar permiso y cerrar':'Continuar sin compartir',preferences==='shared'?'Withdraw permission and close':'Continue without sharing')}</button></div>`;
   const step=panel.querySelector('#zone-step');
   if(blocked())step.innerHTML=`<p>${tr('Tu navegador ha indicado que no desea medición. Respetamos esa preferencia y no solicitamos tu ubicación.','Your browser has requested no measurement. We respect that preference and do not request your location.')}</p>`;
   else if(stage==='intro'){
    step.innerHTML=`<div class="zone-actions" id="zone-main-actions"><button type="button" id="zone-device">${tr('Aceptar y usar mi ubicación','Accept and use my location')}</button></div><div class="zone-actions"><button type="button" id="zone-manual">${tr('Elegir localidad sin ubicación','Choose town without location')}</button></div>${preferences==='shared'?`<p class="zone-detail">${tr('Ya has compartido una localidad. No accedemos a tu ubicación en segundo plano. Puedes retirar el permiso o aportar una nueva zona si ha cambiado.','You have already shared a town. We do not access your location in the background. You can withdraw permission or share a new area if it has changed.')}</p>`:''}`;
    panel.querySelector('#zone-main-actions').append(panel.querySelector('#zone-decline'));
    panel.querySelector('#zone-reject-row').remove();
    panel.querySelector('#zone-device').onclick=locate;
    panel.querySelector('#zone-manual').onclick=()=>{cancelPending();stage='search';error='';render();};
   } else if(stage==='search'){
    step.innerHTML=`<form id="zone-search"><label for="zone-query">${tr('Nombre de tu localidad','Town name')}</label><div class="zone-search-row"><input id="zone-query" name="town" type="search" minlength="2" maxlength="80" required autocomplete="off" placeholder="${tr('Por ejemplo, Ayora','For example, Ayora')}"><button type="submit">${tr('Buscar','Search')}</button></div><p class="zone-detail">${tr('Escribe solo la localidad, sin calle, dirección ni datos personales. Comprueba la provincia y el país en los resultados.','Enter only the town, without a street, address or personal details. Check the province and country in the results.')}</p></form>`;
    panel.querySelector('#zone-search').onsubmit=async event=>{
     event.preventDefault();const query=panel.querySelector('#zone-query').value.trim();if(query.length<2)return;
     const current=++epoch;stage='loading';error='';notice=tr('Buscando localidades…','Searching towns…');render();
     try{const result=await request({action:'search',query});if(current!==epoch)return;showCandidates(result);}catch(e){if(current!==epoch)return;stage='search';notice='';error=tr('No hemos podido buscar. Puedes intentarlo de nuevo o continuar sin compartir.','We could not search. Try again or continue without sharing.');render();}
    };
   } else if(stage==='candidates'){
    step.innerHTML=`<label for="zone-place">${tr('Confirma tu localidad','Confirm your town')}</label><select id="zone-place">${candidates.map(p=>`<option value="${p.id}">${esc(label(p))}</option>`).join('')}</select><p class="zone-detail">${tr('La sugerencia puede no coincidir con tu municipio. Confirma solo si es correcta.','The suggestion may not match your town. Confirm only if it is correct.')}</p><div class="zone-actions"><button type="button" id="zone-confirm">${tr('Compartir esta localidad','Share this town')}</button><button type="button" id="zone-other">${tr('Buscar otra localidad','Find another town')}</button></div>`;
    panel.querySelector('#zone-other').onclick=()=>{cancelPending();stage='search';error='';notice='';render();};
    panel.querySelector('#zone-confirm').onclick=record;
   } else if(stage==='done') {
    step.innerHTML=`<p>${tr('Gracias. Tu aportación ayuda a conocer mejor el interés por zonas. No se ha añadido a tu perfil ni se rastrearán tus movimientos.','Thank you. Your contribution helps us understand interest by area. It has not been added to your profile, and your movements will not be tracked.')}</p><button type="button" id="zone-close">${tr('Cerrar','Close')}</button>`;
    panel.querySelector('#zone-close').onclick=()=>close();
   }
   panel.querySelector('#zone-decline').onclick=()=>close(true);
  }
  async function request(body) {
   controller?.abort();controller=new AbortController();
   const timeout=setTimeout(()=>controller?.abort(),12000);
   try{
    const response=await fetch(new URL('api/visitor-zone',rootURL),{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});
    const result=await response.json();if(!response.ok)throw Error(result.error||'unavailable');return result;
   }finally{clearTimeout(timeout);}
  }
  function showCandidates(result){
   notice='';candidates=result.places||[];token=result.token;
   if(!candidates.length){stage='search';error=tr('No hemos encontrado una localidad cercana. Puedes buscarla por su nombre; si no aparece, continúa sin compartir.','No nearby town was found. You can search by name; if it is missing, continue without sharing.');}
   else {stage='candidates';error='';}render();
  }
  function locate() {
   if(blocked())return render();
   if(!navigator.geolocation){stage='search';error=tr('Este navegador no permite obtener la ubicación. Puedes elegir la localidad.','This browser cannot get your location. You can choose a town instead.');return render();}
   cancelPending();const current=epoch;stage='loading';error='';notice=tr('Autoriza la ubicación en el aviso de tu navegador. También puedes continuar sin compartir.','Allow location in your browser prompt. You can also continue without sharing.');render();
   navigator.geolocation.getCurrentPosition(async position=>{
    if(current!==epoch||panel.hidden||blocked())return;
    const cell=coordinateCell(position.coords);
    if(!cell){stage='search';notice='';error=tr('La precisión del dispositivo no es suficiente. Elige tu localidad para evitar una zona equivocada.','Device accuracy is insufficient. Choose your town to avoid an incorrect area.');return render();}
    notice=tr('Buscando localidades próximas…','Finding nearby towns…');render();
    try{const result=await request({action:'nearby',consent:true,version:CONSENT_VERSION,...cell});if(current===epoch&&!panel.hidden)showCandidates(result);}catch{if(current!==epoch)return;stage='search';notice='';error=tr('No se ha podido localizar la zona. Puedes elegir tu localidad.','The area could not be located. You can choose your town.');render();}
   },()=>{if(current!==epoch||panel.hidden)return;stage='search';notice='';error=tr('No se ha compartido tu ubicación. Puedes elegir una localidad o continuar sin compartir.','Your location has not been shared. You can choose a town or continue without sharing.');render();},{enableHighAccuracy:false,timeout:12000,maximumAge:0});
  }
  async function record() {
   if(blocked())return render();
   const placeId=Number(panel.querySelector('#zone-place').value), current=++epoch;
   stage='loading';error='';notice=tr('Guardando la localidad…','Saving the town…');render();
   try{
    const result=await request({action:'record',consent:true,version:CONSENT_VERSION,placeId,token});if(current!==epoch)return;
    if(!result.recorded&&!result.preview)throw Error('unavailable');
    if(result.recorded)remember('shared');
    stage='done';notice=result.preview?tr('Vista de prueba: no se ha guardado ninguna estadística.','Preview: no statistics have been saved.'):'';render();
   }catch{if(current!==epoch)return;stage='candidates';notice='';error=tr('No se ha podido confirmar el envío. Puedes reintentarlo; un mismo envío no se cuenta dos veces.','The submission could not be confirmed. You can retry; the same submission is not counted twice.');render();}
  }
  entry.onclick=()=>open(true);
  panel.addEventListener('keydown',event=>{if(event.key==='Escape')close(true);});
  window.addEventListener('bebepunt:language',render);
  window.addEventListener('storage',event=>{if(event.key===CHOICE_KEY&&choice()==='declined')close();});
  render();
  if(!blocked()&&!choice()&&!location.pathname.includes('politica-privacidad'))timer=setTimeout(()=>open(),delay);
}
