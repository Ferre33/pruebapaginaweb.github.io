import test from 'node:test';
import assert from 'node:assert/strict';
import {searchPlaces,nearbyPlaces,placeById} from '../server/geography.mjs';
import {issueZoneToken,verifyZoneToken,ZONE_CONSENT_VERSION} from '../server/zone-consent.mjs';
import {coordinateCell,savedChoice,CHOICE_KEY} from '../js/location-consent.mjs';
import {createZoneHandler} from '../api/visitor-zone.js';
import {regionName} from '../portal/region-names.mjs';

const env={VERCEL_ENV:'production',SUPABASE_SERVICE_ROLE_KEY:'unit-test-only-key',SUPABASE_URL:'https://database.example.test'};
const request=(body,headers={})=>({method:'POST',headers:{origin:'https://bebepunt.com','content-type':'application/json',...headers},body});
async function invoke(body,{headers={},environment=env,send=async()=>{throw Error('unexpected database access');}}={}){
 const response={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.data=v;return this;},end(){return this;}};
 await createZoneHandler({env:environment,send})(request(body,headers),response);return response;
}
test('device coordinates are reduced before transmission and poor accuracy is not accepted',()=>{
 assert.deepEqual(coordinateCell({latitude:39.0582123,longitude:-1.0563456,accuracy:17}),{latCell:3906,lonCell:-106,accuracy:100});
 for(const c of [{latitude:91,longitude:1,accuracy:1},{latitude:39,longitude:1,accuracy:5001},{latitude:NaN,longitude:1,accuracy:1},{latitude:39,longitude:Infinity,accuracy:1}])assert.equal(coordinateCell(c),null);
});
test('locality lookup handles a small Spanish town, accent folding and no-match cases',()=>{
 const p=searchPlaces('Ayora','ES')[0];assert.equal(p.id,2521451);assert.equal(p.country,'ES');
 assert.equal(nearbyPlaces(3906,-106,100)[0].id,p.id);
 assert.equal(nearbyPlaces(0,0,100).length,0);
 assert.equal(nearbyPlaces(3906,-106,5001).length,0);
 assert.equal(nearbyPlaces(39.06,-1.06,100).length,0);
 assert(searchPlaces('Malaga','ES').some(x=>x.city==='Málaga'));
 assert.equal(searchPlaces('a','ES').length,0);
 assert.equal(searchPlaces('Ayora','invalid').length,0);
 assert.deepEqual(Object.keys(p).sort(),['id','city','country','region','province'].sort());
 assert.equal(placeById(-1),null);
});
test('signed confirmation is scoped to returned localities, method and expiry',()=>{
 const token=issueZoneToken([{id:2521451}],'device',env.SUPABASE_SERVICE_ROLE_KEY,1000);
 assert.equal(verifyZoneToken(token,2521451,env.SUPABASE_SERVICE_ROLE_KEY,2000).method,'device');
 assert.equal(verifyZoneToken(token,123,env.SUPABASE_SERVICE_ROLE_KEY,2000),null);
 assert.equal(verifyZoneToken(token,2521451,'wrong-key',2000),null);
 assert.equal(verifyZoneToken(token,2521451,env.SUPABASE_SERVICE_ROLE_KEY,1000+16*60000),null);
 const [payload,sig]=token.split('.');const parsed=JSON.parse(Buffer.from(payload,'base64url'));parsed.method='selected';
 assert.equal(verifyZoneToken(Buffer.from(JSON.stringify(parsed)).toString('base64url')+'.'+sig,2521451,env.SUPABASE_SERVICE_ROLE_KEY,2000),null);
});
test('geolocation requires affirmative current-version consent and rejects extra personal fields',async()=>{
 for(const body of [
  {action:'nearby',latCell:3906,lonCell:-106,accuracy:100},
  {action:'nearby',consent:false,version:ZONE_CONSENT_VERSION,latCell:3906,lonCell:-106,accuracy:100},
  {action:'nearby',consent:true,version:'old',latCell:3906,lonCell:-106,accuracy:100},
  {action:'nearby',consent:true,version:ZONE_CONSENT_VERSION,latCell:3906,lonCell:-106,accuracy:100,email:'not-stored@example.test'}
 ])assert.equal((await invoke(body)).code,400);
 const result=await invoke({action:'nearby',consent:true,version:ZONE_CONSENT_VERSION,latCell:3906,lonCell:-106,accuracy:100});
 assert.equal(result.code,200);assert(result.data.places.some(p=>p.city==='Ayora'));assert(result.data.token);
});
test('records only confirmed administrative locality, consent version and a one-time receipt',async()=>{
 const found=(await invoke({action:'search',query:'Ayora',country:'ES'})).data;let sent;
 const result=await invoke({action:'record',consent:true,version:ZONE_CONSENT_VERSION,placeId:2521451,token:found.token},{send:async(url,options)=>{sent={url,options};return {ok:true};}});
 assert.equal(result.code,200);assert.equal(result.data.recorded,true);
 const payload=JSON.parse(sent.options.body);
 assert.equal(sent.url,'https://database.example.test/rest/v1/rpc/record_website_zone');
 assert.deepEqual(Object.keys(payload.p).sort(),['country','region','province','city','method','consent_version'].sort());
 assert.equal(payload.p.city,'Ayora');assert.equal(payload.p.method,'selected');assert.match(payload.receipt,/^[a-f0-9]{64}$/);
 assert(!JSON.stringify(payload).includes('latitude'));assert(!JSON.stringify(payload).includes('longitude'));
 for(const consent of [false,undefined])assert.equal((await invoke({action:'record',consent,version:ZONE_CONSENT_VERSION,placeId:2521451,token:found.token})).code,400);
});
test('respects origin, DNT/GPC, body limits and preview isolation',async()=>{
 assert.equal((await invoke({action:'search',query:'Ayora'},{headers:{origin:'https://untrusted.example'}})).code,403);
 for(const h of [{dnt:'1'},{'sec-gpc':'1'}])assert.equal((await invoke({action:'search',query:'Ayora'},{headers:h})).code,409);
 assert.equal((await invoke({action:'search',query:'x'.repeat(2500)})).code,413);
 assert.equal((await invoke({action:'search',query:'Ayora'},{headers:{'content-type':'text/plain'}})).code,415);
 const previewEnv={VERCEL_ENV:'preview'};
 const found=(await invoke({action:'search',query:'Ayora'},{environment:previewEnv})).data;
 const result=await invoke({action:'record',consent:true,version:ZONE_CONSENT_VERSION,placeId:2521451,token:found.token},{environment:previewEnv});
 assert.deepEqual(result.data,{recorded:false,preview:true});
 assert.equal((await invoke({action:'record',consent:true,version:ZONE_CONSENT_VERSION,placeId:2521451,token:found.token})).code,400);
});
test('does not turn network/database failures into a claimed successful contribution',async()=>{
 const found=(await invoke({action:'search',query:'Ayora'})).data;
 const body={action:'record',consent:true,version:ZONE_CONSENT_VERSION,placeId:2521451,token:found.token};
 assert.equal((await invoke(body,{send:async()=>({ok:false})})).code,503);
 assert.equal((await invoke(body,{send:async()=>{throw Error('offline');}})).code,503);
});
test('stored choice expires, contains no locality and older notices do not imply consent',()=>{
 const storage=value=>({getItem:key=>{assert.equal(key,CHOICE_KEY);return value;}});
 assert.equal(savedChoice(storage(JSON.stringify({choice:'declined',version:ZONE_CONSENT_VERSION,expires:2000})),1000),'declined');
 assert.equal(savedChoice(storage(JSON.stringify({choice:'shared',version:ZONE_CONSENT_VERSION,expires:500})),1000),null);
 assert.equal(savedChoice(storage(JSON.stringify({choice:'shared',version:'old',expires:2000})),1000),null);
 assert.equal(savedChoice(storage('broken'),1000),null);
 assert.equal(savedChoice({getItem(){throw Error('blocked storage');}},1000),null);
});
test('no geolocation calls or analytics requests occur when loading the consent module',async()=>{
 // Import itself must be inert. GPS is requested only by the explicit button handler.
 const oldNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{geolocation:{getCurrentPosition(){throw Error('GPS without user action');}}}});
 try{await import('../js/location-consent.mjs?inert-test');}finally{if(oldNavigator)Object.defineProperty(globalThis,'navigator',oldNavigator);else delete globalThis.navigator;}
});
test('region codes are named without inventing unknown regions',()=>{
 assert.equal(regionName('ES','VC'),'Comunitat Valenciana');assert.equal(regionName('US','CA'),'California');assert.equal(regionName('ZZ','123'),'123');
});
