import {regionName} from './region-names.mjs';
export async function show({db,root,tr,esc}) {
 let days=30,data=null,zones=null,busy=false,query='';
 const num=n=>new Intl.NumberFormat().format(n||0);
 const countries=new Intl.DisplayNames([tr('es','en')],{type:'region'});
 const countryName=code=>{try{return code==='Unknown'?tr('Desconocido','Unknown'):countries.of(code)||code;}catch{return code;}};
 const value=(key,v,row)=>key==='country'?countryName(v):v==='Unknown'?tr('Desconocido','Unknown'):key==='region'?regionName(row.country,v):v??0;
 const table=(rows,columns)=>'<div style="overflow:auto"><table><thead><tr>'+columns.map(([k,t])=>'<th scope="col">'+esc(t)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+columns.map(([k])=>'<td>'+esc(value(k,r[k],r))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
 const exportRows=(headers,rows,name)=>{
  const cell=v=>'"'+String(v??'').replace(/^[\s\u0000-\u001f]*[=+@-]/,"'").replaceAll('"','""')+'"';
  const csv=[headers,...rows].map(row=>row.map(cell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=name+'-'+days+'-dias.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 function render() {
  const d=data,max=Math.max(1,...d.daily.map(x=>Number(x.views)));
  const coverage=d.views?Math.round(100*d.located_views/d.views):0;
  root.innerHTML=`<p class="eyebrow">BEBEPUNT · ${tr('ADMINISTRACIÓN','ADMINISTRATION')}</p>
  <h1>${tr('Estadísticas de la web','Website analytics')}</h1>
  <p>${tr('Páginas consultadas y procedencia aproximada de las conexiones. Recuentos diarios sin identificar a las personas: una misma persona puede consultar varias páginas.','Page requests and approximate connection locations. Daily totals without identifying people: one person may request several pages.')}</p>
  <div class="toolbar"><label>${tr('Periodo','Period')} <select id="stats-period">${[1,7,30,90].map(n=>`<option value="${n}" ${n===days?'selected':''}>${n===1?tr('Hoy','Today'):n+tr(' días',' days')}</option>`).join('')}</select></label><button id="stats-refresh">${tr('Actualizar','Refresh')}</button><button id="stats-csv" class="secondary">${tr('Exportar estimaciones por IP (CSV)','Export IP estimates (CSV)')}</button></div>
  <p class="note" id="stats-status" role="status">${tr('Actualizado','Updated')}: ${esc(new Date(d.updated_at).toLocaleString(tr('es-ES','en-GB'),{timeZone:'Europe/Madrid'}))} · ${tr('Actualización automática cada 30 segundos. Horario de Madrid.','Auto-refresh every 30 seconds. Madrid time zone.')}</p>
  <div class="grid">${[[tr('Páginas vistas en el periodo','Page views in period'),num(d.views)],[tr('Páginas vistas hoy','Page views today'),num(d.today_views)],[tr('Países identificados','Identified countries'),num(d.countries)],[tr('Vistas con país conocido','Views with known country'),coverage+' %']].map(([label,n])=>`<section class="panel"><p>${label}</p><strong style="font-size:32px">${n}</strong></section>`).join('')}</div>
  ${d.previous_views!==null?`<p>${tr('Vistas en el periodo de días anterior','Views in the previous calendar-day period')}: ${num(d.previous_views)}. ${tr('El día de hoy sigue en curso; los días anteriores a la activación no tienen mediciones.','Today is still in progress; days before activation have no measurements.')}</p>`:''}
  ${!Number(d.views)?`<p class="empty">${tr('Todavía no hay páginas registradas en este periodo con el nuevo sistema de recuento.','No pages recorded in this period with the new counting system yet.')}</p>`:''}
  <section class="panel"><h2>${tr('Evolución diaria','Daily trend')}</h2>${d.daily.map(x=>`<div style="display:grid;grid-template-columns:92px minmax(20px,1fr) auto;gap:10px;margin:8px 0"><span>${esc(x.day_label)}</span><span aria-hidden="true" style="background:#eee8e0"><span style="display:block;height:18px;background:#82766b;width:${100*x.views/max}%"></span></span><span>${num(x.views)}</span></div>`).join('')}</section>
  <section class="panel"><h2>${tr('Localidades confirmadas por los visitantes','Towns confirmed by visitors')}</h2>
  <p>${tr('Una muestra voluntaria más concreta: el visitante confirma la localidad sugerida por su dispositivo o la elige manualmente. No depende de la ciudad del operador de Internet.','A more specific voluntary sample: visitors confirm the town suggested by their device or choose it manually. It does not depend on the Internet provider’s city.')}</p>
  <div class="grid">${[[tr('Aportaciones de localidad','Town contributions'),zones.reports],[tr('Con ubicación y confirmación','With location and confirmation'),zones.device_reports],[tr('Elección manual','Manual selection'),zones.selected_reports]].map(([name,n])=>`<div><p>${name}</p><strong style="font-size:28px">${num(n)}</strong></div>`).join('')}</div>
  <p class="note">${tr('Son aportaciones, no personas únicas ni páginas vistas. No se suman al contador general. Una persona puede aportar más de una vez y quienes no comparten su zona no aparecen en esta muestra. Las cifras antiguas no se pueden precisar retroactivamente.','These are contributions, not unique people or page views. They are not added to the general counter. A person can contribute more than once; people who do not share an area are absent from this sample. Historical figures cannot be made more precise retrospectively.')}</p>
  <label for="zone-filter">${tr('Filtrar por localidad, provincia o país','Filter by town, province or country')}</label><input id="zone-filter" type="search" style="width:100%;max-width:460px;margin:10px 0" placeholder="${tr('Por ejemplo, Ayora o Valencia','For example, Ayora or Valencia')}">
  <div id="zone-table"></div><p class="note">${tr('Zonas en el periodo','Locations in period')}: ${num(zones.locations_total)}. ${tr('Se muestran hasta 1.000 zonas. Solo administradores; conservación de 90 días.','Up to 1,000 locations shown. Administrators only; retained for 90 days.')}</p>
  <button type="button" id="zone-csv" class="secondary">${tr('Exportar localidades confirmadas (CSV)','Export confirmed towns (CSV)')}</button></section>
  <section class="panel"><h2>${tr('Estimación por conexión a Internet','Estimate from Internet connection')}</h2><p class="note">${tr('Fuente: geolocalización de la IP de conexión. La ciudad puede corresponder al operador, una VPN o un centro de datos; no demuestra que el visitante esté físicamente allí. No es la dirección ni el GPS de la persona.','Source: connection IP geolocation. A city can reflect the carrier, a VPN or a data centre; it does not prove that the visitor is physically there. It is not a person’s address or GPS location.')} ${tr('Se muestran y exportan las 100 zonas con más vistas. Zonas en este periodo:','The top 100 locations are shown and exported. Locations in this period:')} ${num(d.locations_total)}.</p>${table(d.locations,[['country',tr('País','Country')],['region',tr('Región','Region')],['city',tr('Ciudad estimada por IP','IP-estimated city')],['views',tr('Páginas vistas','Page views')]])}</section>
  <section class="panel"><h2>${tr('Páginas más visitadas','Top pages')}</h2>${table(d.pages,[['page',tr('Página','Page')],['views',tr('Vistas','Views')]])}</section>
  <p class="note">${tr('Datos de la web de producción en Vercel; no incluye visitas a la copia de GitHub Pages ni versiones de prueba. Se conservan 90 días. No se guardan IP, cookies de medición ni identificadores de sesión. Se excluyen pantallas de administración, precargas, robots detectados y solicitudes con DNT o GPC. Las recargas pueden sumar y los errores de red o páginas recuperadas de la caché del navegador pueden reducir el recuento. No es una cifra de personas únicas.','Data from the production website on Vercel; visits to the GitHub Pages copy and preview builds are not included. Retained for 90 days. No IP addresses, analytics cookies or session identifiers are stored. Administration pages, prefetches, detected bots and requests with DNT or GPC are excluded. Reloads may add views, while network errors or pages restored from the browser cache may reduce the count. This is not a unique-person count.')}</p>`;
  root.querySelector('#stats-period').onchange=e=>{days=+e.target.value;refresh();};
  root.querySelector('#stats-refresh').onclick=refresh;
  root.querySelector('#stats-csv').onclick=()=>exportRows(['Country','Region','IP-estimated city','Page views'],d.locations.map(r=>[countryName(r.country),regionName(r.country,r.region),r.city,r.views]),'bebepunt-zonas-estimadas-ip');
  const cols=[['country',tr('País','Country')],['region',tr('Región','Region')],['province',tr('Provincia / área','Province / area')],['city',tr('Localidad confirmada','Confirmed town')],['device_reports',tr('Dispositivo + confirmación','Device + confirmation')],['selected_reports',tr('Manual','Manual')],['reports',tr('Aportaciones','Contributions')]];
  let filtered=zones.locations;
  root.querySelector('#zone-filter').value=query;
  const filter=()=>{query=root.querySelector('#zone-filter').value;const q=query.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase();filtered=zones.locations.filter(r=>[countryName(r.country),r.region,r.province,r.city].join(' ').normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase().includes(q));root.querySelector('#zone-table').innerHTML=filtered.length?table(filtered,cols):`<p class="empty">${tr('No hay aportaciones para esta selección.','There are no contributions for this selection.')}</p>`;};
  root.querySelector('#zone-filter').oninput=filter;filter();
  root.querySelector('#zone-csv').onclick=()=>exportRows(cols.map(([,title])=>title),filtered.map(r=>cols.map(([k])=>value(k,r[k],r))),'bebepunt-localidades-confirmadas');
 }
 async function refresh() {
  if(busy)return;busy=true;
  try {const [r,z]=await Promise.all([db.rpc('website_audience_dashboard',{days}),db.rpc('website_zone_dashboard',{days})]);if(r.error||z.error)throw r.error||z.error;data=r.data;zones=z.data;render();}
  catch {const msg=tr('No se han podido actualizar las estadísticas. Reintenta actualizando la página.','Statistics could not be updated. Refresh the page to retry.');const status=root.querySelector('#stats-status');if(status)status.textContent=msg;else root.innerHTML='<p role="alert">'+msg+'</p>';}
  finally {busy=false;}
 }
 await refresh();clearInterval(window.bebepuntStatsTimer);
 window.bebepuntStatsTimer=setInterval(()=>{if(!document.hidden&&document.activeElement?.id!=='zone-filter')refresh();},30000);
}
