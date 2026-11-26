import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {audienceBucket,recordAudience} from '../server/audience.mjs';
import middleware,{config} from '../middleware.js';
const req=(path='/en/contacto/',headers={},method='GET')=>new Request('https://pruebapaginawebgithubio.vercel.app'+path,{method,headers:{accept:'text/html','user-agent':'Mozilla/5.0','sec-fetch-dest':'document','sec-fetch-mode':'navigate','x-vercel-ip-country':'ES','x-vercel-ip-country-region':'MU','x-vercel-ip-city':'Murcia',...headers}});
test('counts only a whitelisted page and coarse geography, never identifiers',()=>{
 const p=audienceBucket(req('/en/contacto/?email=private@example.test',{'cookie':'sid=secret','x-forwarded-for':'203.0.113.50',authorization:'Bearer secret','referer':'https://example.test/?token=private'}));
 assert.deepEqual(p,{page:'/contacto/index.html',country:'ES',region:'MU',city:'Murcia'});
 assert.equal(audienceBucket(req('/')).page,'/index.html');
 assert.equal(audienceBucket(req('/en/index.html')).page,'/index.html');
});
test('excludes admin, recovery, assets, unknown pages, bots, prefetches and privacy signals',()=>{
 for(const path of ['/portal/admin.html','/portal/estadisticas.html','/portal/recuperar.html','/portal/ultimas-tallas.html','/api/contact','/img/bebe1.jpg','/unknown','/en/portal/index.html'])assert.equal(audienceBucket(req(path)),null);
 for(const headers of [{'user-agent':'Googlebot'},{purpose:'prefetch'},{'sec-purpose':'prefetch;prerender'},{'next-router-prefetch':'1'},{dnt:'1'},{'sec-gpc':'1'},{accept:'application/json'},{'sec-fetch-dest':'image'},{'sec-fetch-mode':'cors'}])assert.equal(audienceBucket(req('/',headers)),null);
 for(const method of ['HEAD','POST'])assert.equal(audienceBucket(req('/',{},method)),null);
});
test('handles absent and invalid geography without persisting arbitrary header content',()=>{
 const p=audienceBucket(req('/',{'x-vercel-ip-country':'invalid','x-vercel-ip-country-region':'','x-vercel-ip-city':'%E0%A4%A'}));
 assert.deepEqual(p,{page:'/index.html',country:'Unknown',region:'Unknown',city:'Unknown'});
 assert.equal(audienceBucket(req('/',{'x-vercel-ip-city':'Val%C3%A8ncia'})).city,'València');
 assert.equal(audienceBucket(req('/',{'x-vercel-ip-city':'person@example.test'})).city,'Unknown');
});
test('background counter sends only a bucket and survives network/database failures',async()=>{
 const p=audienceBucket(req());let called=0;
 const env={SUPABASE_URL:'https://example.test/',SUPABASE_SERVICE_ROLE_KEY:'test-only'};
 assert.equal(await recordAudience(p,env,async(url,options)=>{called++;assert.equal(url,'https://example.test/rest/v1/rpc/record_website_pageview');assert.deepEqual(JSON.parse(options.body),{p});assert(options.signal);return {ok:true};}),true);
 assert.equal(called,1);
 assert.equal(await recordAudience(p,env,async()=>{throw Error('offline');}),false);
 assert.equal(await recordAudience(p,env,async()=>({ok:false})),false);
 assert.equal(await recordAudience(p,{},()=>{throw Error('must not run');}),false);
});
test('previews pass through without collecting and matchers do not invoke on assets',()=>{
 const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';
 try {assert.equal(middleware(req()).headers.get('x-middleware-next'),'1');}finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
 for(const path of config.matcher)assert(audienceBucket(req(path)),path);
 assert(!config.matcher.some(p=>p.includes('api/')||p.includes('img/')||p.includes('admin')));
});
test('legacy session tracking remains removed without starting requests in unsupported pages',()=>{
 const removed=[];
 vm.runInNewContext(fs.readFileSync(new URL('../js/analytics.js',import.meta.url),'utf8'),{document:{currentScript:null},localStorage:{removeItem:k=>removed.push(k)},sessionStorage:{removeItem:k=>removed.push(k)},fetch:()=>{throw Error('automatic browser analytics must remain disabled');}});
 assert.deepEqual(removed,['bebepunt.analytics.choice.v1','bebepunt.analytics.session.v1']);
});
test('ceremony compositions preserve both materials on both Alma sets',()=>{
 const c={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../portal/catalogo-ejemplo.js',import.meta.url),'utf8'),c);
 const ps=c.window.BEBEPUNT_GET_DEMO_CATALOG().products;
 for(const ref of ['27.907','27.908'])assert.equal(ps.find(p=>p.reference===ref).composition,'100 % poliéster · 100 % algodón');
 assert.equal(ps.find(p=>p.name==='Conjunto Avellana').composition,'100 % poliéster');
 assert.equal(ps.find(p=>p.name==='Conjunto Magnolia').composition,'90 % poliéster · 10 % algodón');
});
