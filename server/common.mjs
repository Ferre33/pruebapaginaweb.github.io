import {createClient} from '@supabase/supabase-js';
import Stripe from 'stripe';
export const need=k=>{if(!process.env[k])throw Error('Configuración del servidor pendiente: '+k);return process.env[k];};
export const db=()=>createClient(need('SUPABASE_URL'),need('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
export const stripe=()=>new Stripe(need('STRIPE_SECRET_KEY'));
export const ok=r=>{if(r.error)throw r.error;return r.data;};
export function origin(req,res){const allowed=need('SITE_URL').replace(/\/$/,'');res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');if(req.headers.origin&&req.headers.origin!==allowed){res.status(403).json({error:'Origen no permitido.'});return false;}if(req.headers.origin)res.setHeader('Access-Control-Allow-Origin',allowed);res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');if(req.method==='OPTIONS'){res.status(204).end();return false;}if(req.method!=='POST'){res.status(405).json({error:'Método no permitido.'});return false;}return true;}
export async function member(req,client){const token=(req.headers.authorization||'').replace(/^Bearer /,'');if(!token)throw Error('Inicia sesión.');const {user}=ok(await client.auth.getUser(token));const profile=ok(await client.from('profiles').select('*').eq('id',user.id).single());if(profile.role!=='admin'&&(profile.status!=='approved'||!user.email_confirmed_at))throw Error('Acceso no aprobado.');return {user,profile};}
export const body=req=>typeof req.body==='string'?JSON.parse(req.body):req.body||{};
