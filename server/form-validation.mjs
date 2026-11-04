const limits={name:160,message:5000,shop_name:160,phone:60,city:160};
export function validateForm(input){
 if(!['newsletter','contact','retailer'].includes(input.kind))throw Error('invalid');
 const email=typeof input.email==='string'?input.email.trim().toLowerCase():'';
 if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||input.consent!==true)throw Error('invalid');
 if(typeof input.request_id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.request_id))throw Error('invalid');
 const row={request_id:input.request_id,category:input.kind,email,language:input.lang==='en'?'en':'es',privacy_version:'2026-10-22'};
 for(const [key,max] of Object.entries(limits)){const value=input[key]??'';if(typeof value!=='string'||value.length>max)throw Error('invalid');row[key]=value.trim();}
 if(row.category!=='newsletter'&&(!row.name||!row.message))throw Error('invalid');
 if(row.category==='retailer'&&!row.shop_name)throw Error('invalid');
 if(row.category==='newsletter')for(const key of Object.keys(limits))row[key]='';
 return row;
}
