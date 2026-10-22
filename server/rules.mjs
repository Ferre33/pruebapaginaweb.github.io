export function paymentAmount(order,phase){if(!['deposit','balance'].includes(phase))throw Error('Fase de pago no válida.');if(order.status==='cancelled')throw Error('Pedido cancelado.');if(order.total==null||order.deposit_amount==null)throw Error('Pedido anterior: solicita revisión al equipo comercial.');if(phase==='deposit'&&order.deposit_paid||phase==='balance'&&order.balance_paid)throw Error('Este pago ya está abonado.');if(phase==='balance'&&(!order.deposit_paid||!order.balance_requested))throw Error('El pago final aún no está habilitado.');return Math.round(Number(phase==='deposit'?order.deposit_amount:order.total-order.deposit_amount)*100);}
export function canChangeStatus(order,status){if(!['received','processing','shipped','completed','cancelled'].includes(status))throw Error('Estado no válido.');if(['processing','shipped','completed'].includes(status)&&!order.deposit_paid)throw Error('El anticipo no está abonado.');if(['shipped','completed'].includes(status)&&!order.balance_paid)throw Error('Debe abonarse el importe completo antes de enviar.');if(status==='cancelled')throw Error('Las cancelaciones requieren revisión de pagos y stock. Gestiona primero el reembolso y la reposición según la guía.');}

// Allocate the installment across all order lines, retaining exact cents.
export function paymentLines(order,phase,lang='es'){
 const cents=paymentAmount(order,phase),items=order.order_items||[];
 if(!items.length)throw Error('El pedido no tiene líneas.');
 const subtotal=items.reduce((sum,i)=>sum+Math.round(Number(i.line_total)*100),0);
 if(subtotal<=0)throw Error('Base de pedido no válida.');
 let allocated=0;
 return items.map((i,index)=>{const value=index===items.length-1?cents-allocated:Math.floor(cents*Math.round(Number(i.line_total)*100)/subtotal);allocated+=value;
 return {price_data:{currency:'eur',unit_amount:value,product_data:{name:`${i.product_snapshot} · ${i.sku_snapshot} × ${i.quantity}`.slice(0,250),description:(lang==='en'?`${phase==='deposit'?'Deposit':'Balance'} 50%. Size: ${i.size_snapshot}; colour: ${i.color_snapshot}. Unit price excluding tax: ${i.unit_price} EUR. Tax included in this payment according to the order.`:`${phase==='deposit'?'Anticipo':'Resto'} 50 %. Talla: ${i.size_snapshot}; color: ${i.color_snapshot}. Precio por unidad sin impuestos: ${i.unit_price} EUR. Impuestos incluidos en este pago según pedido.`).slice(0,500)}},quantity:1};}).filter(i=>i.price_data.unit_amount>0);
}
