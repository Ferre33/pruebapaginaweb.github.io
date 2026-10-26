/* Isolated browser-only purchase simulation. Never calls payment or order APIs. */
(function (root) {
'use strict';
function quote(cart, products) {
  if (!Array.isArray(cart) || !cart.length || cart.length > 100) throw Error('Invalid demo basket');
  const seen = new Set();
  const lines = cart.map(item => {
    if (seen.has(item.variant_id)) throw Error('Duplicate variant');
    seen.add(item.variant_id);
    const p = products.find(p => p.is_demo && p.is_orderable && p.product_variants?.some(v => v.id === item.variant_id));
    const v = p?.product_variants.find(v => v.id === item.variant_id && v.is_active);
    const qty = item.quantity, cents = Math.round(Number(v?.professional_price) * 100);
    if (!v || !Number.isInteger(qty) || qty < 1 || qty > 9999 || !Number.isSafeInteger(cents) || cents < 0) throw Error('Invalid demo item');
    return {name:p.name,sku:v.sku,size:v.size,color:v.color,quantity:qty,unit_cents:cents,total_cents:cents*qty};
  });
  const subtotal_cents = lines.reduce((sum,line)=>sum+line.total_cents,0);
  if (!Number.isSafeInteger(subtotal_cents)) throw Error('Invalid demo total');
  const tax_cents = Math.round(subtotal_cents * .21);
  return {lines,subtotal_cents,tax_cents,total_cents:subtotal_cents+tax_cents,tax_rate:21};
}
function store(userId) {
  const key = 'bebepunt-simulation-v1:' + userId;
  const read = () => {try {const x=JSON.parse(localStorage.getItem(key)||'{}');return {cart:Array.isArray(x.cart)?x.cart:[],orders:Array.isArray(x.orders)?x.orders:[]};} catch {return {cart:[],orders:[]};}};
  const write = x => localStorage.setItem(key,JSON.stringify(x));
  return {read,write,add(variant_id,quantity,products) {const x=read(),line=x.cart.find(i=>i.variant_id===variant_id);if(line)line.quantity+=quantity;else x.cart.push({variant_id,quantity});quote(x.cart,products);write(x);},pay(products,billing) {const x=read(),totals=quote(x.cart,products);const order={...totals,id:'DEMO-'+crypto.randomUUID(),date:new Date().toISOString(),billing:{shop_name:billing.shop_name||'',contact_name:billing.contact_name||'',address:billing.address||'',city:billing.city||''},status:'simulated_paid'};x.orders=[order,...x.orders].slice(0,20);x.cart=[];write(x);return order;}};
}
root.BEBEPUNT_DEMO_SHOP={quote,store};
})(globalThis);
