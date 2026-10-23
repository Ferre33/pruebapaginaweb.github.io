# Despliegue de BEBEPUNT en Netlify

Estado: adaptación preparada; pendiente de acceso a Netlify y verificación del despliegue real.

Importar este repositorio, seleccionar el plan Free y la rama de migración para la primera prueba. Netlify lee `netlify.toml`: Node 22, comando `node scripts/build-netlify.mjs`, publicación `dist`, funciones `netlify/functions`. No habilitar planes de pago ni recargas automáticas.

Las rutas `/api/forms`, `/api/commerce` y `/api/stripe-webhook` usan los mismos controladores que Vercel mediante un adaptador. Los bytes originales del webhook se conservan para verificar su firma. La compilación publica únicamente archivos estáticos autorizados; excluye servidor, SQL, pruebas y documentación interna.

## Configuración privada en Netlify

En las variables de entorno del proyecto, configurar para producción y funciones:
- `SUPABASE_URL`: URL del proyecto existente.
- `SUPABASE_SERVICE_ROLE_KEY`: secreto del proyecto correcto, introducido directamente en el panel. Nunca en GitHub, el navegador del cliente ni el chat.
- `SITE_URL`: origen HTTPS final de Netlify sin barra final.

Los formularios necesitan además Turnstile y Brevo (`TURNSTILE_SECRET_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `MAIL_FROM`, `CONTACT_EMAIL`), y la clave pública Turnstile en `js/services-config.js`. No se consideran operativos hasta configurarlos y comprobarlos.

Los pagos continúan desactivados. Su activación futura requiere Stripe, términos aprobados y configuración comercial; no forma parte de esta migración.

## Supabase y comprobación antes del cambio

Añadir las URL exactas de Netlify `/portal/index.html` y `/portal/recuperar.html` a Authentication / URL Configuration / Redirect URLs. Mantener temporalmente las URL anteriores para no romper enlaces enviados. Cambiar Site URL solamente cuando el nuevo despliegue esté comprobado.

Verificar navegación ES/EN, imágenes y colecciones, documento de privacidad, casilla de consentimiento, recuperación de contraseña y acceso con una cuenta autorizada. Comprobar OPTIONS y rechazo de orígenes ajenos en API; verificar que archivos `/server/common.mjs`, SQL y documentación interna devuelven 404. No crear registros ni enviar correos de prueba sin destino autorizado.

Revisar la política de privacidad al confirmar Netlify como proveedor efectivo y sus condiciones/DPA. Mantener el borrador de privacidad separado hasta cerrar los puntos pendientes. Actualizar URLs canónicas y proveedores activos cuando se conozca la dirección definitiva.

## Vuelta futura a Vercel

Se conservan `api/`, `server/` y `vercel.json`. Desplegar la misma rama, configurar las variables en Vercel, autorizar las URL exactas de autenticación en Supabase, verificar y cambiar la dirección principal. Revisar entonces el plan comercial y el DPA de Vercel. No eliminar el alojamiento anterior hasta verificar el nuevo.
