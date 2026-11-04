export const formOrigins = ['https://pruebapaginawebgithubio.vercel.app', 'https://ferre33.github.io'];
export function formOrigin(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');
 if(!formOrigins.includes(req.headers.origin)){res.status(403).json({error:'Origen no permitido.'});return false;}
 res.setHeader('Access-Control-Allow-Origin',req.headers.origin);
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
 if(req.method==='OPTIONS'){res.status(204).end();return false;}
 if(req.method!=='POST'){res.status(405).json({error:'Método no permitido.'});return false;}
 return true;
}
export function validFormChallenge(verified,requestOrigin){
 return verified.success === true && formOrigins.includes(requestOrigin) && verified.hostname === new URL(requestOrigin).hostname;
}
