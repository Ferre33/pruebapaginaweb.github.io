import {formOrigins} from '../server/form-security.mjs';
import {nearbyPlaces, searchPlaces, placeById} from '../server/geography.mjs';
import {issueZoneToken,verifyZoneToken,ZONE_CONSENT_VERSION} from '../server/zone-consent.mjs';

export function createZoneHandler({env=process.env,send=fetch}={}) {
 return async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');
  const origin=req.headers.origin;
  const preview=env.VERCEL_ENV==='preview'&&origin===`https://${req.headers.host}`&&req.headers.host?.endsWith('.vercel.app');
  if(!formOrigins.includes(origin)&&!preview)return res.status(403).json({error:'origin'});
  res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(req.headers.dnt==='1'||req.headers['sec-gpc']==='1')return res.status(409).json({error:'privacy_signal'});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'content_type'});
  let body;
  try {
   const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);
   if(!raw||Buffer.byteLength(raw)>2400)return res.status(413).json({error:'size'});
   body=JSON.parse(raw);
   if(!body||typeof body!=='object'||Array.isArray(body))throw Error();
  }catch{return res.status(400).json({error:'invalid'});}
  // Preview tokens only exercise the form. This key cannot sign a production write.
  const key=env.VERCEL_ENV==='preview'?'bebepunt-preview-only-no-production-writes':env.SUPABASE_SERVICE_ROLE_KEY;
  if(!key)return res.status(503).json({error:'unavailable'});
  try {
   if(body.action==='nearby'||body.action==='search'){
    const fields=body.action==='nearby'?['action','consent','version','latCell','lonCell','accuracy']:['action','query','country'];
    if(Object.keys(body).some(k=>!fields.includes(k)))return res.status(400).json({error:'fields'});
    if(body.action==='nearby'&&(body.consent!==true||body.version!==ZONE_CONSENT_VERSION))return res.status(400).json({error:'consent'});
    const places=body.action==='nearby'?nearbyPlaces(body.latCell,body.lonCell,body.accuracy):searchPlaces(body.query,body.country);
    const method=body.action==='nearby'?'device':'selected';
    return res.status(200).json({places,token:places.length?issueZoneToken(places,method,key):null});
   }
   if(body.action!=='record'||Object.keys(body).some(k=>!['action','consent','version','placeId','token'].includes(k))||body.consent!==true||body.version!==ZONE_CONSENT_VERSION)return res.status(400).json({error:'consent'});
   const proof=verifyZoneToken(body.token,body.placeId,key), place=placeById(body.placeId);
   if(!proof||!place)return res.status(400).json({error:'expired'});
   if(env.VERCEL_ENV!=='production')return res.status(200).json({recorded:false,preview:true});
   if(!env.SUPABASE_URL)return res.status(503).json({error:'unavailable'});
   const p={country:place.country,region:place.region||'Unknown',province:place.province||'Unknown',city:place.city,method:proof.method,consent_version:ZONE_CONSENT_VERSION};
   const result=await send(`${env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/rpc/record_website_zone`,{
    method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:`Bearer ${key}`},
    body:JSON.stringify({p,receipt:proof.token_hash}),signal:AbortSignal.timeout(5000)
   });
   if(!result.ok)return res.status(503).json({error:'unavailable'});
   return res.status(200).json({recorded:true});
  }catch{
   // Do not log coordinates, request bodies, account data or tokens.
   return res.status(503).json({error:'unavailable'});
  }
 };
}
export default createZoneHandler();
