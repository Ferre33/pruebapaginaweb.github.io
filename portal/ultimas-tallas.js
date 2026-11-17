// Private demo checkout: quantities are revalidated atomically in Supabase.
export async function show({db,root,tr,esc,say,fail,userId}) {
 const key='bebepunt.lastSizes.'+userId;
 let cart=JSON.parse(sessionStorage.getItem(key)||'null')||{lines:{},request:null};
 const save=()=>sessionStorage.setItem(key,JSON.stringify(cart));
 const unwrap=r=>{if(r.error)throw r.error;return r.data;};
 let rows=[],busy=false;
 const title=p=>tr(p.name,p.name_en);
 const stock=p=>tr('Stock de prueba: ','Demo stock: ')+p.stock+tr(' uds.',' units');
 const stockError=()=>tr('No hay suficientes unidades disponibles. Revisa las cantidades de tu cesta.','There are not enough units available. Check the quantities in your basket.');
 async function refresh(){rows=unwrap(await db.from('last_sizes_demo').select('id,name,name_en,size_label,stock,published').order('name').order('size_label'));render();}
 function render(){
 const visible=rows.filter(p=>p.published),lines=Object.entries(cart.lines);
 const invalid=lines.some(([id,q])=>!rows.some(p=>p.id===id&&p.published&&Number.isInteger(q)&&q>0&&p.stock>=q));
 root.innerHTML=`<p class="eyebrow">${tr('ÁREA DE ADMINISTRACIÓN','ADMINISTRATION')}</p><h1>${tr('Últimas tallas','Last sizes')}</h1><p>${tr('Última oportunidad: estas tallas están disponibles hasta agotar existencias.','Last chance: these sizes are available while stocks last.')}</p><p class="note">${tr('Simulación privada. Solo se descuenta stock de prueba; no se realizan cobros ni envíos.','Private simulation. Only demo stock changes; there are no charges or deliveries.')}</p><div class="grid">${visible.map(p=>{
 const max=p.stock-(cart.lines[p.id]||0);
 return `<article class="panel"><h2>${esc(title(p))}</h2><p>${tr('Talla','Size')}: ${esc(p.size_label)}</p><small>${esc(stock(p))}</small>${max>0?`<form data-add="${p.id}"><label>${tr('Cantidad','Quantity')}<input type="number" name="quantity" min="1" max="${max}" value="1" step="1" required></label><button>${tr('Añadir a la cesta de prueba','Add to demo basket')}</button></form>`:`<p>${p.stock===0?tr('Agotado','Sold out'):tr('Todas las unidades están en tu cesta.','All available units are in your basket.')}</p>`}</article>`;
 }).join('')||tr('No hay tallas publicadas.','No sizes have been published.')}</div>
 <section class="panel"><h2>${tr('Cesta de últimas tallas','Last sizes basket')}</h2>${lines.map(([id,q])=>{const p=rows.find(r=>r.id===id);return `<p>${esc(p?title(p):tr('Artículo retirado','Withdrawn item'))} · ${esc(p?.size_label)} × ${esc(q)} <button type="button" class="secondary" data-remove="${esc(id)}">${tr('Quitar','Remove')}</button></p>`}).join('')||tr('Tu cesta está vacía.','Your basket is empty.')}${invalid?`<p>${stockError()}</p>`:''}${lines.length?`<button data-buy ${invalid?'disabled':''}>${tr('Confirmar compra ficticia','Confirm demo purchase')}</button>`:''}</section>
 <details class="panel"><summary>${tr('Gestionar artículos de prueba','Manage demo items')}</summary>${rows.map(p=>`<p>${esc(title(p))} · ${esc(p.size_label)} · <small>${esc(stock(p))}</small> <button type="button" class="secondary" data-toggle="${p.id}">${p.published?tr('Retirar','Unpublish'):tr('Publicar','Publish')}</button></p>`).join('')}
 <form data-new><h3>${tr('Crear un borrador','Create a draft')}</h3>
 <label>${tr('Nombre en español','Spanish name')}<input name="name" required maxlength="120"></label>
 <label>${tr('Nombre en inglés','English name')}<input name="name_en" required maxlength="120"></label>
 <label>${tr('Talla','Size')}<input name="size_label" required maxlength="32"></label>
 <label>${tr('Stock inicial de prueba','Initial demo stock')}<input name="stock" type="number" min="0" max="99999" step="1" required></label>
 <button>${tr('Guardar borrador','Save draft')}</button></form></details>`;
 }
 async function act(fn){if(busy)return;busy=true;root.inert=true;try{await fn();}catch(e){if(e.message==='insufficient_stock'){await refresh();say(stockError(),true);}else fail(e);}finally{busy=false;root.inert=false;}}
 root.onsubmit=e=>{e.preventDefault();const f=e.target;if(!f.reportValidity())return;act(async()=>{
 if(f.hasAttribute('data-add')){const id=f.dataset.add,q=Number(f.elements.quantity.value),p=rows.find(r=>r.id===id),total=q+(cart.lines[id]||0);
 if(!p?.published||!Number.isInteger(q)||q<1||total>p.stock){say(stockError(),true);return;}
 cart.lines[id]=total;cart.request=null;save();render();say(tr('Añadido a la cesta de prueba.','Added to the demo basket.'));return;}
 if(f.hasAttribute('data-new')){const d=new FormData(f);unwrap(await db.from('last_sizes_demo').insert({name:d.get('name').trim(),name_en:d.get('name_en').trim(),size_label:d.get('size_label').trim(),stock:Number(d.get('stock'))}));await refresh();say(tr('Borrador guardado.','Draft saved.'));}
 });};
 root.onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;actClick();
 function actClick(){if(b.hasAttribute('data-remove'))return act(async()=>{delete cart.lines[b.dataset.remove];cart.request=null;save();render();});
 if(b.hasAttribute('data-toggle'))return act(async()=>{const p=rows.find(r=>r.id===b.dataset.toggle);unwrap(await db.from('last_sizes_demo').update({published:!p.published}).eq('id',p.id));await refresh();});
 if(b.hasAttribute('data-buy'))return act(async()=>{if(!Object.keys(cart.lines).length)return;cart.request||=crypto.randomUUID();save();unwrap(await db.rpc('buy_last_sizes_demo',{request_id:cart.request,basket:cart.lines}));cart={lines:{},request:null};save();await refresh();say(tr('Compra ficticia completada. El stock de prueba está actualizado.','Demo purchase complete. Demo stock has been updated.'));});}
 };
 await refresh();
}
