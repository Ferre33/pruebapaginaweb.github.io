import test from 'node:test';import assert from 'node:assert/strict';
import {formOrigin,validFormChallenge} from '../server/form-security.mjs';
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.payload=v;},end(){}};}
test('allows preflight only for the two public sites',()=>{
 for(const origin of ['https://pruebapaginawebgithubio.vercel.app','https://ferre33.github.io']){
  const res=response();assert.equal(formOrigin({method:'OPTIONS',headers:{origin}},res),false);assert.equal(res.code,204);assert.equal(res.headers['Access-Control-Allow-Origin'],origin);
 }
 for(const origin of [undefined,'https://evil.example','https://ferre33.github.io.evil.example']){const res=response();assert.equal(formOrigin({method:'POST',headers:{origin}},res),false);assert.equal(res.code,403);}
});
test('requires a successful challenge for the submitting hostname',()=>{
 assert.equal(validFormChallenge({success:true,hostname:'ferre33.github.io'},'https://ferre33.github.io'),true);
 assert.equal(validFormChallenge({success:true,hostname:'other.github.io'},'https://ferre33.github.io'),false);
 assert.equal(validFormChallenge({success:false,hostname:'ferre33.github.io'},'https://ferre33.github.io'),false);
 assert.equal(validFormChallenge({success:true,hostname:'evil.example'},'https://evil.example'),false);
});
