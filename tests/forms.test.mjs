import test from 'node:test';import assert from 'node:assert/strict';
import {validateForm} from '../server/form-validation.mjs';
const base={request_id:'12345678-1234-4234-8234-123456789012',email:' TEST@example.com ',consent:true,kind:'contact',name:'Client',message:'Hello'};
test('preserves separate categories and normalizes email',()=>{for(const kind of ['contact','retailer','newsletter']){const row=validateForm({...base,kind,shop_name:'Shop'});assert.equal(row.category,kind);assert.equal(row.email,'test@example.com');assert.equal(row.privacy_version,'2026-10-22');}});
test('newsletter does not import enquiry text or imply confirmed subscription',()=>{const row=validateForm({...base,kind:'newsletter'});assert.equal(row.message,'');assert.equal(row.name,'');assert.equal(row.confirmed,undefined);});
test('rejects missing consent, unknown categories and malformed identifiers',()=>{for(const change of [{consent:false},{kind:'admin'},{email:'a@b'},{request_id:'bad'},{name:''},{message:'a'.repeat(5001)},{kind:'retailer',shop_name:''}])assert.throws(()=>validateForm({...base,...change}));});
