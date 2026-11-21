import test from 'node:test';
import assert from 'node:assert/strict';
import {origin} from '../server/common.mjs';

function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.payload=v;},end(){}};}

test('commerce accepts both production domains before and after the domain switch',()=>{
 const previous=process.env.SITE_URL;
 try{
  for(const configured of ['https://pruebapaginawebgithubio.vercel.app','https://bebepunt.com/']){
   process.env.SITE_URL=configured;
   for(const requestOrigin of ['https://bebepunt.com','https://www.bebepunt.com','https://pruebapaginawebgithubio.vercel.app']){
    const preflight=response();
    assert.equal(origin({method:'OPTIONS',headers:{origin:requestOrigin}},preflight),false);
    assert.equal(preflight.code,204);
    assert.equal(preflight.headers['Access-Control-Allow-Origin'],requestOrigin);
    assert.equal(preflight.headers['Vary'],'Origin');
    const post=response();
    assert.equal(origin({method:'POST',headers:{origin:requestOrigin}},post),true);
    assert.equal(post.headers['Access-Control-Allow-Origin'],requestOrigin);
   }
   for(const requestOrigin of ['null','https://evil.example','http://bebepunt.com','https://bebepunt.com.evil.example','https://bebepunt.com:444','https://other.bebepunt.com','https://ferre33.github.io']){
    const res=response();assert.equal(origin({method:'POST',headers:{origin:requestOrigin}},res),false);
    assert.equal(res.code,403);assert.equal(res.headers['Access-Control-Allow-Origin'],undefined);
   }
   const get=response();assert.equal(origin({method:'GET',headers:{origin:'https://bebepunt.com'}},get),false);assert.equal(get.code,405);
   // Non-browser clients still proceed to the existing bearer-token authentication.
   const direct=response();assert.equal(origin({method:'POST',headers:{}},direct),true);
   assert.equal(direct.headers['Access-Control-Allow-Origin'],undefined);
  }
 }finally{if(previous===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=previous;}
});
