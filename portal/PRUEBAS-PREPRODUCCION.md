# Checklist de pruebas antes de publicar

- [ ] Registro crea perfil `shop/pending`, nunca `admin` ni `approved` a partir de metadatos.
- [ ] El usuario no puede entrar al catálogo hasta verificar el correo y ser aprobado.
- [ ] Anónimo y tienda pendiente no pueden leer `products`, `product_variants`, precios ni stock por REST.
- [ ] Tienda aprobada solo lee sus pedidos; otra tienda no puede leerlos ni modificarlos.
- [ ] Solo admin puede cambiar estados, gestionar catálogo y actualizar estados de pedido.
- [ ] La RPC rechaza cantidades 0, negativas, enormes, variantes inactivas, stock insuficiente y usuario no aprobado.
- [ ] Cambiar el precio o el total en DevTools no altera el precio almacenado ni el total calculado en servidor.
- [ ] Dos pedidos concurrentes del último stock no pueden vender más unidades de las existentes.
- [ ] Fotos de catálogo no se abren con una sesión anónima ni con cuenta pendiente; URLs firmadas expiran.
- [ ] Contraseña, correo, notas y formularios no se escriben en logs públicos.
- [ ] SMTP, redirecciones de Auth, privacidad, condiciones comerciales, política de cookies y correo de aviso configurados.
- [ ] Pruebas de accesibilidad y móvil; backup y procedimiento de recuperación definidos.
