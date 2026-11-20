export async function show({db,root,tr,esc}) {
 let days=30,data=null,busy=false;
 const num=n=>new Intl.NumberFormat().format(n||0);
 const countries=new Intl.DisplayNames([tr('es','en')],{type:'region'});
 const countryName=code=>{try{return code==='Unknown'?tr('Desconocido','Unknown'):countries.of(code)||code;}catch{return code;}};
 const value=(key,v)=>key==='country'?countryName(v):v==='Unknown'?tr('Desconocido','Unknown'):v;
 const table=(rows,columns)=>'<div style="overflow:auto"><table><thead><tr>'+columns.map(([k,t])=>'<th scope="col">'+esc(t)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+columns.map(([k])=>'<td>'+esc(value(k,r[k]))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
 function render() {
  const d=data,max=Math.max(1,...d.daily.map(x=>Number(x.views)));
  const coverage=d.views?Math.round(100*d.located_views/d.views):0;
  root.innerHTML=`<p class="eyebrow">BEBEPUNT · ${tr('ADMINISTRACIÓN','ADMINISTRATION')}</p>
  <h1>${tr('Estadísticas de la web','Website analytics')}</h1>
  <p>${tr('Páginas consultadas y procedencia aproximada de las conexiones. Recuentos diarios sin identificar a las personas: una misma persona puede consultar varias páginas.','Page requests and approximate connection locations. Daily totals without identifying people: one person may request several pages.')}</p>
  <div class="toolbar"><label>${tr('Periodo','Period')} <select id="stats-period">${[1,7,30,90].map(n=>`<option value="${n}" ${n===days?'selected':''}>${n===1?tr('Hoy','Today'):n+tr(' días',' days')}</option>`).join('')}</select></label><button id="stats-refresh">${tr('Actualizar','Refresh')}</button><button id="stats-csv" class="secondary">${tr('Exportar tabla de ubicaciones (CSV)','Export location table (CSV)')}</button></div>
  <p class="note" id="stats-status" role="status">${tr('Actualizado','Updated')}: ${esc(new Date(d.updated_at).toLocaleString(tr('es-ES','en-GB'),{timeZone:'Europe/Madrid'}))} · ${tr('Actualización automática cada 30 segundos. Horario de Madrid.','Auto-refresh every 30 seconds. Madrid time zone.')}</p>
  <div class="grid">${[[tr('Páginas vistas en el periodo','Page views in period'),num(d.views)],[tr('Páginas vistas hoy','Page views today'),num(d.today_views)],[tr('Países identificados','Identified countries'),num(d.countries)],[tr('Vistas con país conocido','Views with known country'),coverage+' %']].map(([label,n])=>`<section class="panel"><p>${label}</p><strong style="font-size:32px">${n}</strong></section>`).join('')}</div>
  ${d.previous_views!==null?`<p>${tr('Vistas en el periodo de días anterior','Views in the previous calendar-day period')}: ${num(d.previous_views)}. ${tr('El día de hoy sigue en curso; los días anteriores a la activación no tienen mediciones.','Today is still in progress; days before activation have no measurements.')}</p>`:''}
  ${!Number(d.views)?`<p class="empty">${tr('Todavía no hay páginas registradas en este periodo con el nuevo sistema de recuento.','No pages recorded in this period with the new counting system yet.')}</p>`:''}
  <section class="panel"><h2>${tr('Evolución diaria','Daily trend')}</h2>${d.daily.map(x=>`<div style="display:grid;grid-template-columns:92px minmax(20px,1fr) auto;gap:10px;margin:8px 0"><span>${esc(x.day_label)}</span><span aria-hidden="true" style="background:#eee8e0"><span style="display:block;height:18px;background:#82766b;width:${100*x.views/max}%"></span></span><span>${num(x.views)}</span></div>`).join('')}</section>
  <section class="panel"><h2>${tr('Procedencia aproximada','Approximate locations')}</h2><p class="note">${tr('La ciudad corresponde a la conexión y puede diferir por la red del operador o una VPN. No es la dirección ni el GPS de la persona.','The city reflects the connection and may differ because of the carrier network or a VPN. It is not a person’s address or GPS location.')} ${tr('Se muestran y exportan las 100 zonas con más vistas. Zonas en este periodo:','The top 100 locations are shown and exported. Locations in this period:')} ${num(d.locations_total)}.</p>${table(d.locations,[['country',tr('País','Country')],['region',tr('Región / código','Region / code')],['city',tr('Ciudad aproximada','Approximate city')],['views',tr('Páginas vistas','Page views')]])}</section>
  <section class="panel"><h2>${tr('Páginas más visitadas','Top pages')}</h2>${table(d.pages,[['page',tr('Página','Page')],['views',tr('Vistas','Views')]])}</section>
  <p class="note">${tr('Datos de la web de producción en Vercel; no incluye visitas a la copia de GitHub Pages ni versiones de prueba. Se conservan 90 días. No se guardan IP, cookies de medición ni identificadores de sesión. Se excluyen pantallas de administración, precargas, robots detectados y solicitudes con DNT o GPC. Las recargas pueden sumar y los errores de red o páginas recuperadas de la caché del navegador pueden reducir el recuento. No es una cifra de personas únicas.','Data from the production website on Vercel; visits to the GitHub Pages copy and preview builds are not included. Retained for 90 days. No IP addresses, analytics cookies or session identifiers are stored. Administration pages, prefetches, detected bots and requests with DNT or GPC are excluded. Reloads may add views, while network errors or pages restored from the browser cache may reduce the count. This is not a unique-person count.')}</p>`;
  root.querySelector('#stats-period').onchange=e=>{days=+e.target.value;refresh();};
  root.querySelector('#stats-refresh').onclick=refresh;
  root.querySelector('#stats-csv').onclick=()=>{
   const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'").replaceAll('"','""')+'"';
   const csv=['Country,Region,City,Page views',...d.locations.map(r=>[countryName(r.country),r.region,r.city,r.views].map(cell).join(','))].join('\r\n');
   const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;a.download='bebepunt-ubicaciones-'+days+'-dias.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
 }
 async function refresh() {
  if(busy)return;busy=true;
  try {const r=await db.rpc('website_audience_dashboard',{days});if(r.error)throw r.error;data=r.data;render();}
  catch {const msg=tr('No se han podido actualizar las estadísticas. Reintenta actualizando la página.','Statistics could not be updated. Refresh the page to retry.');const status=root.querySelector('#stats-status');if(status)status.textContent=msg;else root.innerHTML='<p role="alert">'+msg+'</p>';}
  finally {busy=false;}
 }
 await refresh();clearInterval(window.bebepuntStatsTimer);
 window.bebepuntStatsTimer=setInterval(()=>{if(!document.hidden)refresh();},30000);
}
