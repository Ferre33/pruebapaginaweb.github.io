import {createHmac, createHash, randomBytes, timingSafeEqual} from 'node:crypto';
export const ZONE_CONSENT_VERSION='2026-11-26';
const lifetime=15*60*1000;
const signature=(value,key)=>createHmac('sha256',key).update('bebepunt-zone-v1.'+value).digest();
export function issueZoneToken(places, method, key, now=Date.now()) {
  const payload={ids:places.map(p=>p.id),method,expires:now+lifetime,nonce:randomBytes(18).toString('base64url')};
  const encoded=Buffer.from(JSON.stringify(payload)).toString('base64url');
  return encoded+'.'+signature(encoded,key).toString('base64url');
}
export function verifyZoneToken(token, id, key, now=Date.now()) {
  try {
    if(typeof token!=='string'||token.length>1600||!Number.isSafeInteger(id))return null;
    const [encoded,sig,extra]=token.split('.');if(extra||!sig)return null;
    const provided=Buffer.from(sig,'base64url'), expected=signature(encoded,key);
    if(provided.length!==expected.length||!timingSafeEqual(provided,expected))return null;
    const p=JSON.parse(Buffer.from(encoded,'base64url'));
    if(!Array.isArray(p.ids)||p.ids.length>12||!p.ids.includes(id)||!['device','selected'].includes(p.method)||!Number.isFinite(p.expires)||p.expires<now||p.expires>now+lifetime||typeof p.nonce!=='string')return null;
    return {method:p.method,token_hash:createHash('sha256').update(token).digest('hex')};
  }catch{return null;}
}
