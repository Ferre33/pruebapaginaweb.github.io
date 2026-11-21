import test from 'node:test';import assert from 'node:assert/strict';
import {formOrigin,validFormChallenge} from '../server/form-security.mjs';
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.payload=v;},end(){}};}
test('allows preflight for the custom domain and existing public sites',()=>{
 for(const origin of ['https://bebepunt.com','https://www.bebepunt.com','https://pruebapaginawebgithubio.vercel.app','https://ferre33.github.io']){
  const res=response();assert.equal(formOrigin({method:'OPTIONS',headers:{origin}},res),false);assert.equal(res.code,204);assert.equal(res.headers['Access-Control-Allow-Origin'],origin);
 }
 for(const origin of [undefined,'null','https://evil.example','https://ferre33.github.io.evil.example','http://bebepunt.com','https://bebepunt.com.evil.example','https://bebepunt.com:444','https://other.bebepunt.com']){const res=response();assert.equal(formOrigin({method:'POST',headers:{origin}},res),false);assert.equal(res.code,403);assert.equal(res.headers['Access-Control-Allow-Origin'],undefined);}
});
test('requires a successful challenge for the submitting hostname',()=>{
 assert.equal(validFormChallenge({success:true,hostname:'ferre33.github.io'},'https://ferre33.github.io'),true);
 assert.equal(validFormChallenge({success:true,hostname:'other.github.io'},'https://ferre33.github.io'),false);
 assert.equal(validFormChallenge({success:false,hostname:'ferre33.github.io'},'https://ferre33.github.io'),false);
 assert.equal(validFormChallenge({success:true,hostname:'evil.example'},'https://evil.example'),false);
 for(const hostname of ['bebepunt.com','www.bebepunt.com']){
  const requestOrigin='https://'+hostname;
  assert.equal(validFormChallenge({success:true,hostname},requestOrigin),true);
  assert.equal(validFormChallenge({success:false,hostname},requestOrigin),false);
  assert.equal(validFormChallenge({success:true,hostname:'pruebapaginawebgithubio.vercel.app'},requestOrigin),false);
  const res=response();assert.equal(formOrigin({method:'POST',headers:{origin:requestOrigin}},res),true);
 }
 assert.equal(validFormChallenge({success:true,hostname:'bebepunt.com'},'https://www.bebepunt.com'),false);
});
