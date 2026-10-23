import test from 'node:test';import assert from 'node:assert/strict';import {unitPrice} from '../server/sales-policy.mjs';
test('professional price remains independent of the future retail price',()=>{assert.equal(unitPrice({professional_price:20,retail_price:42}),20);});
test('retail cannot be enabled by client input or a premature database flag',()=>{for(const retail_enabled of [false,true])assert.throws(()=>unitPrice({professional_price:20,retail_price:42},'retail',{retail_enabled}));});
test('missing wholesale price never falls back to retail',()=>assert.throws(()=>unitPrice({professional_price:null,retail_price:42})));
