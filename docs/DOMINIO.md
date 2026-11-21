# Conexión de bebepunt.com

Estado revisado el 21 de noviembre de 2026. Esta preparación no significa que el dominio esté sirviendo ya la web.

## Preparado

- Vercel tiene asociados `bebepunt.com` y `www.bebepunt.com` al proyecto de esta web.
- `www.bebepunt.com` redirige a `bebepunt.com` con código 308.
- La barra de comentarios de Vercel en producción está desactivada.
- El servidor acepta los formularios y las llamadas autenticadas de comercio desde ambos nombres nuevos y mantiene el alias de producción durante la transición.
- Los formularios siguen comprobando que el token Turnstile pertenece al mismo hostname que realiza el envío. No se permiten comodines de origen.

## Pendiente antes del cambio de DNS

1. En Supabase, Authentication → URL Configuration, añadir estas direcciones exactas a Redirect URLs sin borrar las existentes:
   - `https://bebepunt.com/portal/index.html`
   - `https://bebepunt.com/portal/recuperar.html`
   - `https://www.bebepunt.com/portal/index.html`
   - `https://www.bebepunt.com/portal/recuperar.html`
2. Revisar las plantillas de confirmación y recuperación. Deben respetar el destino solicitado por la aplicación; no sustituir el enlace de confirmación completo por un enlace ordinario sin token.
3. En Cloudflare → Turnstile, editar el widget ya usado por la web y añadir `bebepunt.com` en Hostname Management. Este nombre cubre también `www`. Mantener los hostnames anteriores y la clave del widget existente.
4. Obtener acceso al panel DNS actual o coordinar el cambio con su administrador. El usuario y la contraseña FTP no sustituyen el acceso a ese panel.

El Site URL predeterminado de Supabase y los enlaces de correo se cambian después de comprobar DNS y HTTPS, para no enviar a los usuarios a una web todavía desconectada.

## DNS observado y destino

La comprobación de Vercel del 21/11/2026 muestra DNS externos: `ns1.incuatroagr.com` y `ns2.incuatroagr.com`. El dominio raíz resuelve a `204.93.189.118` y `www` es un CNAME a `bebepunt.com`. Ambos aparecen como configuración incorrecta para Vercel.

Vercel devuelve estas recomendaciones para este proyecto; comprobarlas de nuevo justo antes de editar la zona:

| Nombre | Tipo | Destinos recomendados de prioridad 1 |
| --- | --- | --- |
| `@` | A | `216.198.79.1`, `64.29.17.1` |
| `www` | CNAME | `771297d3914d96f3.vercel-dns-017.com.` |

Guardar una copia de la zona antes del cambio. Sustituir los registros web incompatibles, sin mezclar la antigua IP con las nuevas. Revisar posibles AAAA del mismo nombre. Conservar los servidores de nombres y los registros de correo y verificación. Si el MX o el host de correo dependen de la IP del dominio raíz, separar su destino de correo antes de cambiar el A de la web.

## Cambio final, tras comprobar HTTPS

- Confirmar que ambos dominios tienen configuración válida y certificado, y que `www` redirige a la raíz conservando la ruta.
- Establecer `SITE_URL=https://bebepunt.com` en el entorno de producción de Vercel y desplegar de nuevo.
- En Supabase Auth, establecer Site URL en `https://bebepunt.com/portal/index.html`; mantener las redirecciones exactas anteriores durante la transición.
- Actualizar únicamente las URL de `bebepunt_private.application_mail_settings.review_url` a `https://bebepunt.com/portal/admin.html` y `bebepunt_private.web_form_settings.site_url` a `https://bebepunt.com`. Conservar destinatarios, remitentes, listas y plantillas.
- Cambiar el origen SEO predeterminado de `scripts/build-seo.py`, regenerar con `SITE_ORIGIN=https://bebepunt.com` y revisar el diff de las páginas, sitemap y robots antes de publicar. Ejecutar `scripts/check-seo.py` y `scripts/check-portable-paths.py`.
- Actualizar la base de API de la copia en GitHub Pages a `https://bebepunt.com` cuando ese destino esté validado. Las páginas servidas por Vercel ya usan rutas relativas.
- Comprobar desde el dominio propio: navegación ES/EN, imágenes, contacto, solicitud de tiendas, suscripción, confirmación de correo, recuperación y acceso de cliente/administrador.
- Comprobar la recepción de los envíos de prueba en la base de datos y su procesamiento por la cola de correo, sin duplicar contactos.

Si todavía falla DNS, conservar las URL actuales de correo, SEO y configuración principal. No desactivar el alias de Vercel hasta finalizar la transición y decidir una redirección compatible con las llamadas a la API.

## Referencias

- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://supabase.com/docs/guides/auth/redirect-urls
- https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
