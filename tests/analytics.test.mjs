import test from 'node:test';import assert from 'node:assert/strict';import {validateAnalytics} from '../server/analytics-validation.mjs';
const base={consent:true,id:'12345678-1234-4234-8234-123456789012',session_id:'12345678-1234-4234-8234-123456789013',page:'/en/contacto/',device:'mobile',language:'en',referrer:'https://example.test/search?email=private@example.test'};
test('analytics allowlists routes and removes referring queries',()=>{const p=validateAnalytics(base);assert.equal(p.page,'/contacto/index.html');assert.equal(p.referrer,'example.test');assert(!JSON.stringify(p).includes('private@'));});
test('analytics rejects unconsented events, identifiers and admin routes',()=>{for(const x of [{consent:false},{id:'bad'},{page:'/portal/admin.html'},{page:'/portal/producto.html?id=secret'},{page:'/invented'},{device:'tracking'}])assert.throws(()=>validateAnalytics({...base,...x}));});
test('GitHub Pages and root routes normalize identically',()=>{assert.equal(validateAnalytics({...base,page:'/pruebapaginaweb.github.io/en/'}).page,'/index.html');});
import vm from 'node:vm';import fs from 'node:fs';
test('no analytics fetch before opt-in or after decline',()=>{
 const nodes=[],calls=[],memory=new Map();
 const node=()=>{const n={style:{},append(...a){this.children=(this.children||[]).concat(a)},setAttribute(){},hidden:false};nodes.push(n);return n};
 const ctx={URL,Date,JSON,crypto:{randomUUID:()=>base.id},navigator:{userAgent:'browser'},location:{pathname:'/index.html',hostname:'example.test'},document:{currentScript:{src:'https://example.test/js/analytics.js'},documentElement:{lang:'es'},createElement:node,body:{append(){}},referrer:''},window:{addEventListener(){}},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},sessionStorage:{getItem:()=>null,setItem(){},removeItem(){}},clearTimeout(){},setTimeout(){},fetch:(...x)=>{calls.push(x);return Promise.resolve()}};
 vm.runInNewContext(fs.readFileSync(new URL('../js/analytics.js',import.meta.url),'utf8'),ctx);
 assert.equal(calls.length,0);
 nodes.find(n=>n.textContent==='Rechazar').onclick();assert.equal(calls.length,0);
 nodes.find(n=>n.textContent==='Aceptar estadísticas').onclick();assert.equal(calls.length,1);
 nodes.find(n=>n.textContent==='Rechazar').onclick();assert.equal(calls.length,1);
});
test('ceremony compositions preserve both materials on both Alma sets',()=>{
 const c={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../portal/catalogo-ejemplo.js',import.meta.url),'utf8'),c);
 const ps=c.window.BEBEPUNT_GET_DEMO_CATALOG().products;
 for(const ref of ['27.907','27.908'])assert.equal(ps.find(p=>p.reference===ref).composition,'100 % poliéster · 100 % algodón');
 assert.equal(ps.find(p=>p.name==='Conjunto Avellana').composition,'100 % poliéster');
 assert.equal(ps.find(p=>p.name==='Conjunto Magnolia').composition,'90 % poliéster · 10 % algodón');
});
