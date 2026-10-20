# BEBEPUNT · Guía de puesta en marcha
Versión del 20 de octubre de 2026

## Actualización: catálogo de ejemplo y Ceremonia
Se incluyen 22 modelos de ejemplo: 6 de Otoño Invierno, 6 de Primavera Verano y 10 de Ceremonia. El área cliente muestra estos modelos junto a los productos reales que existan en Supabase. Sus fichas se abren en páginas individuales. Los nombres, precios y medidas son orientativos; las composiciones y cuidados requieren confirmación. No se pueden añadir estos modelos de muestra a pedidos reales.

La web pública muestra exactamente tres fotografías por colección. La colección Ceremonia aparece también en los menús públicos y en Para tiendas. El catálogo del área cliente muestra las diez fotografías recibidas, renombradas ceremonia1.jpg a ceremonia10.jpg. Los JPEG recibidos se conservan sin recomprimir y los PNG se convierten a JPEG con sus dimensiones originales.

Para ver el catálogo de ejemplo, sube todos los archivos de esta versión y entra con una cuenta aprobada. No requiere una nueva migración SQL adicional a las de la entrega anterior. La configuración BEBEPUNT_SHOW_DEMO_CATALOG = true en portal/config.js activa los ejemplos; cambia a false para mostrar solo los productos comerciales de Supabase.

Los ejemplos y sus fotografías están incluidos como recursos estáticos de demostración, accesibles por URL. No contienen tarifas ni especificaciones comerciales confidenciales. Para el catálogo comercial protegido utiliza los productos reales y el bucket privado de Supabase según esta guía; retira los recursos estáticos exclusivos cuando pases a contenido confidencial.

## 1. Qué contiene esta entrega
La web pública conserva sus páginas, fotografías, textos, animación y estilo. El área cliente tiene páginas independientes de inicio, colecciones, catálogo, ficha de producto, perfil, pedidos y carrito. La cabecera privada muestra nombre, foto (o inicial mientras no se suba una foto) y cesta. El acceso requiere correo verificado y aprobación comercial.

Se incluye código para pagos con Stripe, anticipo del 50 % y saldo del 50 %, documentos de pago generados por Stripe, formulario de contacto y suscripción de doble confirmación con Brevo. Las campañas se preparan y envían en Brevo a la lista completa: no se envía ninguna campaña automáticamente desde esta entrega.

IMPORTANTE: el código está preparado, pero no se han configurado ni probado tus cuentas externas. No se ha modificado tu Supabase ni tu web publicada. La compra queda deshabilitada por defecto en la nueva migración, hasta completar los pasos siguientes. No presentes esta versión como operativa para cobros sin completar la prueba de extremo a extremo.

## 2. Orden recomendado
1. Conserva una copia del ZIP original y exporta una copia de seguridad de Supabase.
2. Descomprime este ZIP en una carpeta nueva. Abre GUIA-CONFIGURACION.html para leer esta guía cómodamente.
3. Prueba primero con una base de Supabase de pruebas. Copia la configuración pública de ese proyecto a portal/config.js.
4. Aplica las migraciones SQL en el orden indicado en el apartado 3.
5. Publica el código en un proyecto de Vercel de pruebas conectado a GitHub.
6. Configura los enlaces legales, los productos y los datos de la empresa.
7. Configura Stripe en modo de prueba y Brevo/Turnstile.
8. Recorre las comprobaciones del apartado 11.
9. Solo entonces cambia a credenciales de producción y conecta el dominio definitivo.

## 3. Supabase: actualizar sin borrar los datos existentes
En Supabase → SQL Editor abre una consulta nueva.

Si tu proyecto YA contiene profiles, products, orders y el portal original: ejecuta solamente supabase/migrations/202610200002_client_area.sql. No vuelvas a ejecutar la primera migración, porque crea tablas y tipos que ya existen.

Si es un proyecto completamente NUEVO: ejecuta primero 202610190001_b2b_portal.sql y después 202610200002_client_area.sql.

La segunda migración se ejecuta como una transacción. Está pensada para aplicarse una sola vez. Conserva usuarios, productos y pedidos anteriores; agrega campos, restricciones, funciones y permisos. Los pedidos anteriores no se convierten automáticamente en pedidos cobrables, porque carecen de una instantánea fiscal y de importes de anticipo. Revísalos por separado con el equipo comercial.

En Authentication → URL Configuration configura Site URL con la dirección definitiva y añade estas Redirect URLs (sustituye DOMINIO):
- https://DOMINIO/portal/index.html
- https://DOMINIO/portal/recuperar.html

Activa la confirmación de correo. Configura SMTP de producción en Supabase para los correos de alta y recuperación. Usa los límites de registro y protección antiabuso disponibles en Supabase; el Turnstile de esta entrega protege los formularios públicos, no está conectado a Supabase Auth.

La consulta del perfil ahora utiliza el ID del usuario conectado. Una cuenta administradora puede acceder sin que la consulta confunda su perfil con los de otras tiendas. Los eventos de refresco de sesión ya no recargan el portal. Los errores de carga muestran Reintentar sin cerrar la sesión.

En Storage crea, si aún no existe, el bucket PRIVADO b2b-product-media. La migración original aporta sus políticas. El bucket PRIVADO b2b-avatars se crea en la segunda migración. No hagas públicos estos buckets. No pongas imágenes exclusivas del catálogo en la carpeta pública img.

## 4. Dónde publicar
Configuración recomendada: GitHub para guardar el código, Vercel para servir tanto la web como /api, Supabase para usuarios/datos/archivos, Cloudflare para el dominio y Turnstile, Stripe para pagos y Brevo para correo.

En Vercel importa el repositorio con estos archivos en su raíz. Usa el preset Other, Node 22 o posterior, instalación npm install, sin comando de compilación y salida estática en la raíz (.). Las funciones de api se despliegan como funciones de Vercel. Si la interfaz permite dejar Output Directory vacío con Other, conserva ese valor; comprueba que /index.html, /portal/index.html y /api/commerce estén disponibles. No selecciones una compilación de React ni un directorio dist que no existe.

Mantén todas las páginas y todos los archivos, no solo index.html. Incluye portal/config.js: contiene exclusivamente la URL y la clave pública de Supabase. Se ha corregido .gitignore para que este archivo público se pueda versionar. Nunca pongas la service_role ni claves de Stripe/Brevo ahí.

GitHub Pages por sí solo NO ejecuta /api. El catálogo y la autenticación pueden funcionar allí, pero los pagos y los formularios necesitan el servidor. Para evitar sesiones separadas, cookies y rutas inconsistentes, publica también el portal en el mismo dominio de Vercel. La configuración suministrada y SITE_URL están diseñadas para un único origen. No repartas web/portal/API entre dominios sin adaptar la lista de orígenes y las redirecciones.

No ejecutes gen.py del proyecto antiguo para regenerar las páginas: es un generador anterior a esta actualización.

## 5. Configuración pública y variables privadas
En portal/config.js conserva la URL y publishable key de tu proyecto. Completa:
- BEBEPUNT_API_BASE: vacío cuando web y API comparten dominio.
- BEBEPUNT_PRIVACY_URL: URL real de la política de privacidad.
- BEBEPUNT_TERMS_URL: URL real de las condiciones de venta profesional.

En js/services-config.js completa:
- BEBEPUNT_API_BASE: vacío en el mismo dominio.
- BEBEPUNT_TURNSTILE_SITE_KEY: clave pública del widget.
- BEBEPUNT_PRIVACY_URL: la misma política real.

En Vercel → Settings → Environment Variables configura las siguientes variables. No las escribas en archivos publicados:

| Variable | Contenido |
| --- | --- |
| SITE_URL | Origen completo, por ejemplo https://www.tudominio.es, sin ruta ni barra final |
| SUPABASE_URL | URL del proyecto de Supabase |
| SUPABASE_SERVICE_ROLE_KEY | Clave de servidor de Supabase, exclusiva de las funciones |
| STRIPE_SECRET_KEY | Clave secreta de Stripe; de pruebas al principio |
| STRIPE_WEBHOOK_SECRET | Secreto de firma del webhook configurado |
| BREVO_API_KEY | Clave de API de Brevo |
| BREVO_LIST_ID | ID numérico de la lista de newsletter |
| BREVO_DOI_TEMPLATE_ID | ID numérico de una plantilla de doble confirmación activa |
| MAIL_FROM | Remitente verificado en Brevo |
| CONTACT_EMAIL | Buzón real que recibe las consultas |
| TURNSTILE_SECRET_KEY | Clave secreta del widget de Cloudflare |

Después de modificar variables de Vercel, despliega de nuevo. Los secretos de Preview y Production deben corresponder a sus respectivos proyectos y cuentas de prueba/producción.

## 6. Alta de clientes y perfil
El cliente solicita acceso en /portal/index.html, confirma el correo y espera la aprobación. En el panel de administración → Tiendas, cambia pending a approved. El cliente entra entonces en su inicio personalizado. No se concede el acceso solo por completar el registro.

La cuenta de administración existente conserva su rol. Si necesitas crear la primera en un proyecto nuevo, crea y verifica la cuenta y cambia su role a admin desde Supabase con tu cuenta propietaria. Nunca permitas elegir el rol en el formulario de registro.

Mi perfil permite guardar razón social, contacto, NIF/CIF, teléfono, dirección, código postal, ciudad, país, foto y contraseña. El país se introduce como código de dos letras (ES, PT, FR…). La foto puede ser JPG, PNG o WebP de hasta 2 MB. Los datos personales se actualizan mediante una función que no permite cambiar role ni status.

## 7. Colecciones, modelos y fichas
El catálogo de muestra contiene nombres, medidas y precios orientativos. Para vender productos reales, carga y verifica los datos comerciales en Supabase → Table Editor; los modelos de ejemplo no se convierten automáticamente en productos comprables.

En collections crea cada colección: name, slug único, season, is_active = true y sort_order.

En products crea o actualiza cada modelo:
- collection_id: el ID de su colección.
- name y slug: nombre y referencia URL única.
- description: descripción comercial.
- image_path: ruta dentro de b2b-product-media, por ejemplo otono-2026/peto-01.jpg; no pegues una URL pública.
- is_active: true para que aparezca en el catálogo privado.
- is_orderable: true para producirse/venderse esta temporada. Hace aparecer Disponible en verde. False mantiene el modelo consultable como Fuera de temporada, sin compra.
- made_to_order: true para confección bajo pedido (no depende del stock). False para unidades limitadas por stock.
- lead_time: plazo real, por ejemplo el texto aprobado por la empresa.
- composition: composición real de la prenda.
- washing: instrucciones reales de lavado y cuidado.
- measurements: descripción de medidas reales y cómo medir.
- size_guide: tabla JSON con las claves size y measurements.

Ejemplo de ESTRUCTURA de size_guide, no de medidas reales:
```json
[
  {"size":"TALLA REAL 1","measurements":"Pecho: MEDIDA REAL cm; largo: MEDIDA REAL cm"},
  {"size":"TALLA REAL 2","measurements":"Pecho: MEDIDA REAL cm; largo: MEDIDA REAL cm"}
]
```

En product_variants crea cada combinación: product_id, sku único, size, color, professional_price (base sin impuestos), stock e is_active. No repitas la misma combinación talla/color para el producto. Las variantes sin stock no se compran si made_to_order es false.

La administración permite activar/desactivar la disponibilidad por temporada. El resto del mantenimiento se realiza en Table Editor y Storage. No se incluye un editor visual completo de productos en el portal.

## 8. Importes, facturación y pagos 50/50
En commerce_settings revisa con la empresa tax_rate, allowed_countries y terms_version. El código usa una tarifa fiscal única, NO un motor fiscal por destino/cliente. No calcula recargo de equivalencia, exenciones intracomunitarias, retenciones ni portes variables. Si la empresa necesita esos casos, adapta la lógica antes de abrir ventas. La interfaz indica envío incluido: los precios comerciales deben cubrirlo o se debe desarrollar el cálculo de portes antes de vender.

No se ha fijado ningún porcentaje fiscal por cuenta de la empresa. El valor inicial es 0 y checkout_enabled es false. Introduce el porcentaje aplicable como decimal y una versión real de las condiciones (por ejemplo, la fecha de aprobación). Configura allowed_countries solo para los destinos cubiertos por esa política. Después de revisar todo, activa checkout_enabled.

El servidor calcula precios, impuestos y total; el navegador no decide los importes cobrados. El pedido guarda una copia de los datos de facturación y la versión de condiciones. El anticipo se redondea a céntimos y el saldo se calcula por diferencia, por lo que ambos suman exactamente el total.

Stripe:
1. Completa los datos de empresa, identidad comercial, cuenta bancaria, soporte y ajustes de facturación en Stripe.
2. Configura claves de prueba en Vercel.
3. Crea un destino de webhook con URL https://DOMINIO/api/stripe-webhook. Suscribe checkout.session.completed y checkout.session.async_payment_succeeded.
4. Copia el secreto whsec_… del destino a STRIPE_WEBHOOK_SECRET y redespliega.
5. Activa/configura recibos por correo y revisa la plantilla de factura de Stripe.
6. Comprueba en modo de prueba el anticipo y el segundo pago antes de pasar a producción.

Cada pago usa Stripe Checkout y solicita creación de factura para ese abono. Las líneas conservan los modelos, referencias, cantidades y la parte del importe abonada; el documento incluye la referencia del pedido y NIF/CIF del cliente. En Mis pedidos se abre el documento generado o el recibo cuando está disponible. No se descarga una factura fabricada localmente ni se marca un pedido pagado por visitar una URL de éxito.

Los documentos de Stripe requieren revisar configuración fiscal, identificación del emisor, series y tratamiento de anticipos con la persona responsable de facturación. Esta entrega no integra un sistema contable certificado ni garantiza requisitos fiscales concretos. Si usas otro programa de facturación, conecta sus documentos antes de sustituir el circuito de la empresa.

Flujo diario:
1. La tienda crea el pedido y paga el anticipo del 50 %.
2. El webhook verificado registra el cobro. Si se vuelve atrás sin pagar, el pedido queda en Mis pedidos y se retoma sin crearlo otra vez.
3. BEBEPUNT empieza la confección; el estado En confección exige anticipo pagado.
4. Cuando está listo, administración pulsa Marcar listo para envío / habilitar resto.
5. El cliente paga el resto desde Mis pedidos. Avisa al cliente por tu canal habitual: este botón habilita el pago, pero no envía un correo automático.
6. Solo con ambos pagos registrados permite marcar Enviado o Completado.

El segundo cobro no se carga automáticamente a la tarjeta: el cliente lo autoriza de nuevo en Checkout. Las sesiones de pago se reutilizan y las llamadas repetidas tienen claves de idempotencia para evitar duplicados.

Cancelaciones y devoluciones: no hay un botón automático de reembolso. Revisa el pedido en Stripe, expira cualquier Checkout abierto, procesa el reembolso si procede y deja constancia en tu gestión interna. Para pedidos con stock reservado, repón las unidades correspondientes una sola vez desde Supabase; después marca el pedido cancelled en Table Editor. No reabras pedidos pagados como si estuvieran pendientes. La entrega no automatiza conciliación de reembolsos, abonos ni liberación temporal de reservas. Para stock limitado, revisa también pedidos abandonados sin pagar; los modelos bajo pedido no descuentan stock.

## 9. Contacto, newsletter y campañas
En Brevo verifica el dominio/remitente. Crea una lista exclusiva de suscriptores y una plantilla activa de Double Opt-In siguiendo las instrucciones de Brevo. Introduce los IDs en Vercel.

En Cloudflare → Turnstile crea un widget para el dominio real. Introduce site key en js/services-config.js y secret key en Vercel. El servidor comprueba el token y el hostname. Configura también límites de tráfico para /api/forms en tu hosting para controlar abuso y gasto.

El formulario de contacto y el de tiendas envían un correo al CONTACT_EMAIL con Reply-To del visitante. La newsletter solicita un correo de confirmación y solo añade a la lista mediante el flujo de confirmación de Brevo. No confunde un clic con una suscripción completada.

Para comunicar ofertas/novedades a todos: entra en Brevo → Campañas, crea la campaña, selecciona la lista de newsletter, revisa destinatarios, remitente, contenido y baja, envía una prueba y programa o envía la campaña. El acceso Campañas newsletter del administrador abre Brevo. No añade a las tiendas a la newsletter automáticamente.

## 10. Seguridad y publicación
Las políticas RLS de Supabase protegen productos, precios, pedidos e imágenes privadas. Ocultar enlaces por sí solo no sería suficiente. Se mantiene una web pública de muestra y el contenido profesional se consulta después de verificar el acceso.

No introduzcas secretos en config.js ni en archivos HTML. La clave pública de Supabase puede estar en el frontend; la service_role solo en Vercel. Revisa que los buckets profesionales sigan siendo privados.

Completa los datos que la web original deja de muestra, especialmente dirección y teléfono de Contacto, privacidad y condiciones. Los formularios de registro y compra comprueban que sus enlaces estén configurados. Define los datos reales de producción, entrega y atención al cliente.

## 11. Comprobaciones antes de abrir a clientes
1. Sin sesión: visitar todas las páginas públicas; comprobar slider, textos, imágenes y animación. La web pública no muestra carrito. Abrir directamente /portal/carrito.html debe llevar al acceso.
2. Registrar una tienda de prueba; comprobar correo y recuperación de contraseña.
3. Cuenta pending: no debe acceder a productos, precios ni archivos privados. Aprobarla y entrar con su nombre.
4. Navegar inicio → colecciones → catálogo → producto → perfil → pedidos. Comprobar que son páginas separadas y que el foco/cambio de pestaña no cierra sesión.
5. Subir una foto, guardar perfil y volver a cargar. Verificar persistencia.
6. Producto publicado y disponible: badge verde y compra. Desactivar is_orderable: se puede consultar, pero no comprar. Comprobar variante agotada con made_to_order false.
7. Añadir productos, cambiar de página, actualizar cantidades y eliminar. Cerrar sesión y verificar que se vacía el carrito de esa cuenta.
8. Completar un pago de prueba; verificar pedido, total, anticipo y que el webhook devuelve 200. Reenviar el mismo evento: no debe duplicar el abono.
9. Cancelar Checkout y retomar desde Mis pedidos. Refrescar después de pagar: no debe cobrar otra vez.
10. Habilitar saldo como admin, pagarlo y marcar enviado. Revisar ambos documentos y sus datos fiscales.
11. Probar dos tiendas: cada una solo puede acceder a sus pedidos. Comprobar con una cuenta no aprobada las políticas de lectura de productos y Storage.
12. Suscribirse, confirmar correo y comprobar la lista de Brevo; enviar un contacto de prueba y revisar el buzón.
13. Revisar la presentación en móvil y ordenador, teclado y mensajes de error. Mantener una copia del proyecto anterior para revertir si fuese necesario.

## 12. Verificación realizada en esta entrega
Se han superado 13 pruebas automatizadas de reglas de pago y sesión con datos simulados: reparto exacto de céntimos, saldo bloqueado hasta preparación, cobros ya pagados, pedidos antiguos, permisos de envío, nombre del usuario, consulta de perfil por ID, renovación de token sin recarga, acceso anónimo, cuentas pendientes y fallos temporales sin cerrar sesión.

Se ha comprobado la sintaxis de JavaScript y la resolución de enlaces y archivos locales de las páginas. No se ha ejecutado la migración en tu Supabase, no se ha hecho una prueba visual en navegador ni se han probado cobros/correos reales. Las pruebas simuladas no sustituyen el recorrido de preproducción anterior.

## Referencias de las integraciones
- Supabase: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
- Stripe Checkout: https://docs.stripe.com/api/checkout/sessions/create
- Stripe webhooks: https://docs.stripe.com/webhooks
- Brevo Double Opt-In: https://developers.brevo.com/reference/create-doi-contact
- Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
