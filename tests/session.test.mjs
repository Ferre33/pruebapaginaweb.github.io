import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
const source=fs.readFileSync(new URL('../portal/portal.js',import.meta.url),'utf8');
async function start({page='inicio',session=true,role='shop',status='approved',broken=false,lang='es'}={}){
 const nodes=new Map(),redirects=[],calls=[];let callback;const storage=new Map();
 const node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:s==='#variant'?'demo-modelo-01-0':s==='#availability'?'all':'',dataset:{},classList:{add(){},remove(){},toggle(){}},querySelector:node,querySelectorAll:()=>[],reset(){}});return nodes.get(s);};
 const user={id:'user-123',email:'shop@example.test',email_confirmed_at:'2026-01-01'};const profile={id:user.id,role,status,contact_name:'Ferreol',shop_name:'Tienda',avatar_path:null};
 const db={auth:{getSession:async()=>({data:{session:session?{user}:null},error:broken?Error('Sin conexión'):null}),getUser:async()=>({data:{user}}),onAuthStateChange:fn=>{callback=fn;},signOut:async()=>({})},from:table=>{const query={select(){return query;},order:async()=>({data:[]}),eq(k,v){calls.push([table,k,v]);return query;},single:async()=>({data:profile})};return query;}};
 const context={console,setTimeout,URL,URLSearchParams,FormData:class{},Intl,Map,Number,JSON,location:{href:'https://example.test/portal/'+page+'.html',search:page==='producto'?'?id=demo-modelo-01':'',replace:u=>redirects.push(u)},document:{getElementById:()=>({}),body:{dataset:{page},classList:{toggle(){}}},querySelector:node},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},window:{BEBEPUNT_SHOW_DEMO_CATALOG:true,BEBEPUNT_I18N:{lang,message:x=>x,text:(es,en)=>lang==='en'?en:es},addEventListener(){},BEBEPUNT_SUPABASE_URL:'https://example.supabase.co',BEBEPUNT_SUPABASE_ANON_KEY:'public',supabase:{createClient:()=>db}}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../portal/catalogo-ejemplo.js',import.meta.url),'utf8'),context);vm.runInContext(fs.readFileSync(new URL('../portal/demo-shop.js',import.meta.url),'utf8'),context);context.window.BEBEPUNT_DEMO_SHOP=context.BEBEPUNT_DEMO_SHOP;vm.runInContext(source,context);await new Promise(resolve=>setImmediate(resolve));return {nodes,redirects,calls,event:e=>callback(e)};
}
test('authenticated user sees own name and own profile query',async()=>{const r=await start();assert.match(r.nodes.get('#content').innerHTML,/Hola, Ferreol/);assert.deepEqual(r.calls,[['profiles','id','user-123']]);assert.equal(r.redirects.length,0);});
test('token refresh and focus sign-in do not reload private pages',async()=>{const r=await start();r.event('TOKEN_REFRESHED');r.event('SIGNED_IN');assert.equal(r.redirects.length,0);});
test('anonymous direct access returns to login',async()=>{const r=await start({session:false,page:'carrito'});assert.deepEqual(r.redirects,['index.html']);});
test('pending shop cannot see catalog',async()=>{const r=await start({status:'pending',page:'catalogo'});assert.match(r.nodes.get('#content').innerHTML,/Solicitud en revisión/);assert.equal(r.calls.filter(c=>c[0]==='products').length,0);});
test('temporary network failure does not sign user out',async()=>{const r=await start({broken:true});assert.equal(r.redirects.length,0);assert.match(r.nodes.get('#content').innerHTML,/Tu sesión no se ha cerrado/);});
test('signed out event leaves private page',async()=>{const r=await start();r.event('SIGNED_OUT');assert.deepEqual(r.redirects,['index.html']);});

for(const page of ['carrito','pedidos','simulacion'])test('approved shop cannot open '+page,async()=>{const r=await start({page});assert.deepEqual(r.redirects,['inicio.html']);assert.equal(r.calls.filter(c=>c[0]==='orders').length,0);});
test('administrator retains account access',async()=>{const r=await start({role:'admin'});assert.match(r.nodes.get('#content').innerHTML,/Hola, Ferreol/);assert.equal(r.redirects.length,0);});

for(const lang of ['es','en'])test('shop product details omit prices and purchase form in '+lang,async()=>{const r=await start({page:'producto',lang});const html=r.nodes.get('#content').innerHTML;assert.match(html,lang==='en'?/Size guide/:/Guía de tallas/);assert.doesNotMatch(html,/id="add"|€|wholesale prices|Precios sin impuestos|Añadir al carrito|Add to basket/);});
for(const lang of ['es','en'])test('shop catalogue omits prices in '+lang,async()=>{const r=await start({page:'catalogo',lang});const html=r.nodes.get('#catalog').innerHTML;assert.match(html,/demo-modelo-01/);assert.doesNotMatch(html,/€|Price coming soon|Tarifa pendiente/);});

test('administrator catalogue retains prices',async()=>{const r=await start({page:'catalogo',role:'admin'});assert.match(r.nodes.get('#catalog').innerHTML,/€/);});

test('administrator product retains prices and basket form',async()=>{const r=await start({page:'producto',role:'admin'});const html=r.nodes.get('#content').innerHTML;assert.match(html,/id="add"/);assert.match(html,/€/);});
