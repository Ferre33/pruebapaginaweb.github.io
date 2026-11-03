import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
test('only ceremony sample designs are available in both languages',()=>{for(const lang of ['es','en']){const c={window:{BEBEPUNT_I18N:{text:(es,en)=>lang==='en'?en:es}}};vm.createContext(c);vm.runInContext(fs.readFileSync(new URL('../portal/catalogo-ejemplo.js',import.meta.url),'utf8'),c);const products=c.window.BEBEPUNT_GET_DEMO_CATALOG().products;assert.equal(products.length,21);assert.equal(products.filter(p=>p.is_orderable).length,10);for(const p of products)assert.equal(p.is_orderable,p.collection_id==='demo-ceremonia');}});

test('summer 27 contains all eleven renamed designs and autumn is coming soon',()=>{
 const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(new URL('../portal/catalogo-ejemplo.js',import.meta.url),'utf8'),c);
 const data=c.window.BEBEPUNT_GET_DEMO_CATALOG(),summer=data.products.filter(p=>p.collection_id==='demo-primavera');
 assert.equal(summer.length,11);assert.equal(data.products.filter(p=>p.collection_id==='demo-otono').length,0);
 assert.equal(data.collections.find(c=>c.id==='demo-primavera').name,'Verano 27');
 assert.equal(data.collections.find(c=>c.id==='demo-otono').coming_soon,true);
 assert.equal(data.products.some(p=>p.id==='demo-modelo-06'),false);
 assert.deepEqual(Array.from(summer,p=>p.name),['Conjunto Trépoles color Rosa Palo','Vestido Nube color Nude','Dos piezas Galga 12','Conjunto Jardín','Dos piezas Faro color Lavanda','Pelele Salvia color Verde Empolvado','Vestido Lavanda','Peto Aguamarina','Vestido Brisa color Melocotón','Vestido Lunares','Pichi Trépoles']);
});
