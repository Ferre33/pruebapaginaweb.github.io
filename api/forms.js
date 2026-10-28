import {need,origin,body,db,ok} from '../server/common.mjs';
import {validateForm} from '../server/form-validation.mjs';
export default async function handler(req,res){
 let lang='es';
 try{
  if(!origin(req,res))return;
  const input=body(req);lang=input.lang==='en'?'en':'es';
  let row;try{row=validateForm(input);}catch{return res.status(400).json({error:lang==='en'?'Check the form fields and accept the privacy policy.':'Revisa los campos y acepta la política de privacidad.'});}
  if(typeof input.token!=='string'||!input.token||input.token.length>2048)return res.status(400).json({error:lang==='en'?'Complete the security check.':'Completa la verificación de seguridad.'});
  const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(10000),body:JSON.stringify({secret:need('TURNSTILE_SECRET_KEY'),response:input.token})});
  const verified=await result.json();
  if(!result.ok||!verified.success||verified.hostname!==new URL(need('SITE_URL')).hostname)return res.status(400).json({error:lang==='en'?'Please complete the security check again.':'Vuelve a completar la verificación de seguridad.'});
  // Persist the submission and its delivery jobs in one database transaction.
  // Brevo failures do not erase a message or turn it into a duplicate submission.
  ok(await db().rpc('record_web_submission',{p_data:row}));
  return res.status(202).json({ok:true,message:lang==='en'?(row.category==='newsletter'?'Subscription request recorded. You will receive an email to confirm it.':'Your message has been recorded. Thank you for contacting BEBEPUNT.'):(row.category==='newsletter'?'Solicitud de suscripción registrada. Recibirás un correo para confirmarla.':'Tu mensaje ha quedado registrado. Gracias por contactar con BEBEPUNT.')});
 }catch(e){console.error('Form submission failed:',e.code||e.name||'error');return res.status(503).json({error:lang==='en'?'We could not register your request. Please try again later.':'No hemos podido registrar tu solicitud. Inténtalo de nuevo más tarde.'});}
}
