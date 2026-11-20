import {formOrigin} from '../server/form-security.mjs';
// Retired browser endpoint: stale clients cannot create session events or double count.
export default function handler(req,res){
 if(!formOrigin(req,res))return;
 return res.status(204).end();
}
