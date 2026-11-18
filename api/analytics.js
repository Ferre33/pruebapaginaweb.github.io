import {body,db,ok} from '../server/common.mjs';
import {formOrigin} from '../server/form-security.mjs';
import {validateAnalytics} from '../server/analytics-validation.mjs';
export default async function handler(req,res){
 if(!formOrigin(req,res))return;
 if(/bot|crawler|spider|headless/i.test(req.headers['user-agent']||''))return res.status(204).end();
 try{
  let data;try{data=validateAnalytics(body(req));}catch{return res.status(400).json({error:'invalid_event'});}
  const geo=k=>{try{return decodeURIComponent(String(req.headers[k]||'Unknown')).slice(0,100);}catch{return 'Unknown';}};
  // Only Vercel's trusted geographic headers. Never store IP or raw user-agent.
  data.country=geo('x-vercel-ip-country');data.region=geo('x-vercel-ip-country-region');data.city=geo('x-vercel-ip-city');
  ok(await db().rpc('record_website_event',{p:data}));return res.status(204).end();
 }catch{return res.status(503).json({error:'analytics_unavailable'});}
}
