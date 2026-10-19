# BEBEPUNT B2B — guía de integración segura

## Decisión técnica
- Mantener el diseño público HTML/CSS/JS del sitio.
- Alojar el frontend en Cloudflare Pages o Vercel para producción comercial; GitHub Pages no ejecuta backend ni debe ser la base de una tienda privada.
- Supabase Auth para registro, verificación de correo, login y recuperación; Postgres + RLS para permisos; Storage privado para imágenes/fichas exclusivas.
- Tarifa profesional común almacenada en `product_variants.professional_price`. No se acepta ningún precio enviado por el navegador.
- Pedido enviado desde carrito con `place_b2b_order()`; el servidor valida aprobación, precio y stock y descuenta existencias dentro de una transacción. Es confirmación de pedido, no cobro con tarjeta.

## Instalación
1. Crear proyecto Supabase en la región adecuada y guardar credenciales en un gestor seguro.
2. Ejecutar `supabase/migrations/202610190001_b2b_portal.sql` en SQL Editor en un proyecto de pruebas primero.
3. Crear bucket privado `b2b-product-media`. No hacer públicas las fotos/fichas reservadas a tiendas.
4. Crear primer usuario administrador con registro normal. Después, desde SQL Editor, elevar SOLO ese UUID verificado: `update public.profiles set role='admin', status='approved', approved_at=now() where id='UUID-REAL';`. No añadir esa operación a la web pública.
5. Copiar `config.example.js` a `config.js` y poner URL + publishable key. No publicar nunca `service_role` ni la contraseña de base de datos.
6. Añadir `config.js` a `.gitignore` si se prefiere no guardar configuración local; para despliegues, usar variables de entorno de la plataforma y un paso de build que genere el archivo.
7. Añadir las etiquetas de `portal/index.html` al proyecto y publicar en un entorno de pruebas.
8. Crear colecciones, productos y variantes desde Supabase o el panel admin, con precios profesionales y stock iniciales.
9. Antes de producción: configurar SMTP de Auth, dominio y redirecciones permitidas; completar privacidad/cookies/condiciones comerciales; probar permisos con cuentas anónimas, pendientes, aprobadas, suspendidas y admin.

## Modelo de acceso
- Anónimo: no ve productos ni precios B2B.
- Registrado pendiente: ve su estado; no consulta catálogo ni hace pedidos.
- Tienda aprobada + correo verificado por Supabase Auth: catálogo, precio profesional común, stock y pedidos propios.
- Admin: gestión de tiendas, catálogo, variantes/stock y pedidos.
- El navegador no puede insertar pedidos directamente: usa la RPC transaccional `place_b2b_order`.

## Puntos que requieren decisión antes del lanzamiento
- Si el precio profesional se muestra con IVA excluido o incluido; el esquema actual almacena precio unitario sin especificar fiscalidad y NO calcula IVA, transporte ni descuentos.
- Política de mínimos, gastos de envío, plazos, cancelaciones y reserva de stock.
- Integración de correo para avisar al equipo y a la tienda de cada pedido; actualmente la RPC guarda el pedido, no envía emails.
- Acceso privado a imágenes: el ejemplo inicial no descarga imágenes; para archivos privados generar URLs firmadas desde un backend confiable o función Edge.
