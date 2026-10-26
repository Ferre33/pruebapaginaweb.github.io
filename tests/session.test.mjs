import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
const source=fs.readFileSync(new URL('../portal/portal.js',import.meta.url),'utf8');
async function start({page='inicio',session=true,role='shop',status='approved',broken=false}={}){
 const nodes=new Map(),redirects=[],calls=[];let callback;const storage=new Map();
 const node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:'',dataset:{},classList:{add(){},remove(){},toggle(){}},querySelector:node,querySelectorAll:()=>[],reset(){}});return nodes.get(s);};
 const user={id:'user-123',email:'shop@example.test',email_confirmed_at:'2026-01-01'};const profile={id:user.id,role,status,contact_name:'Ferreol',shop_name:'Tienda',avatar_path:null};
 const db={auth:{getSession:async()=>({data:{session:session?{user}:null},error:broken?Error('Sin conexión'):null}),getUser:async()=>({data:{user}}),onAuthStateChange:fn=>{callback=fn;},signOut:async()=>({})},from:table=>{const query={select(){return query;},eq(k,v){calls.push([table,k,v]);return query;},single:async()=>({data:profile})};return query;}};
 const context={console,setTimeout,URL,URLSearchParams,FormData:class{},Intl,Map,Number,JSON,location:{href:'https://example.test/portal/'+page+'.html',search:'',replace:u=>redirects.push(u)},document:{getElementById:()=>({}),body:{dataset:{page}},querySelector:node},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},window:{addEventListener(){},BEBEPUNT_SUPABASE_URL:'https://example.supabase.co',BEBEPUNT_SUPABASE_ANON_KEY:'public',supabase:{createClient:()=>db}}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../portal/demo-shop.js',import.meta.url),'utf8'),context);context.window.BEBEPUNT_DEMO_SHOP=context.BEBEPUNT_DEMO_SHOP;vm.runInContext(source,context);await new Promise(resolve=>setImmediate(resolve));return {nodes,redirects,calls,event:e=>callback(e)};
}
test('authenticated user sees own name and own profile query',async()=>{const r=await start();assert.match(r.nodes.get('#content').innerHTML,/Hola, Ferreol/);assert.deepEqual(r.calls,[['profiles','id','user-123']]);assert.equal(r.redirects.length,0);});
test('token refresh and focus sign-in do not reload private pages',async()=>{const r=await start();r.event('TOKEN_REFRESHED');r.event('SIGNED_IN');assert.equal(r.redirects.length,0);});
test('anonymous direct access returns to login',async()=>{const r=await start({session:false,page:'carrito'});assert.deepEqual(r.redirects,['index.html']);});
test('pending shop cannot see catalog',async()=>{const r=await start({status:'pending',page:'catalogo'});assert.match(r.nodes.get('#content').innerHTML,/Solicitud en revisión/);assert.equal(r.calls.filter(c=>c[0]==='products').length,0);});
test('temporary network failure does not sign user out',async()=>{const r=await start({broken:true});assert.equal(r.redirects.length,0);assert.match(r.nodes.get('#content').innerHTML,/Tu sesión no se ha cerrado/);});
test('signed out event leaves private page',async()=>{const r=await start();r.event('SIGNED_OUT');assert.deepEqual(r.redirects,['index.html']);});
