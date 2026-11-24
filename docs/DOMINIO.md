# Dominio de producción BEBEPUNT

Activado el 24 de noviembre de 2026: **https://bebepunt.com**. La versión con `www` redirige a la raíz mediante HTTP 308 y conserva la ruta.

## DNS y certificado

La zona sigue en el proveedor original, con servidores `ns1.incuatroagr.com` y `ns2.incuatroagr.com`. En cPanel se cambiaron únicamente los dos registros web:

| Nombre | Tipo | Valor actual | TTL |
| --- | --- | --- | --- |
| `bebepunt.com` | A | `216.198.79.1` | 300 |
| `www.bebepunt.com` | CNAME | `771297d3914d96f3.vercel-dns-017.com.` | 300 |

Son destinos recomendados por Vercel para este proyecto. Vercel confirmó ambos dominios como correctamente configurados. Se emitió un certificado para los dos nombres con renovación automática. Las páginas de inicio, inglés, acceso al portal y recuperación responden por HTTPS desde Vercel.

Se conservan los registros de correo, FTP, cPanel, verificaciones y los de otros dominios. El MX de `bebepunt.com` apunta a `mail.bebepunt.com`, que mantiene su registro A en `204.93.189.118`. El acceso de administración del alojamiento sigue disponible en `https://cpanel.bebepunt.com:2083/`.

Antes del cambio, el A raíz era `204.93.189.118` y el CNAME de `www` era `bebepunt.com`; ambos tenían TTL 14400. Por ello, algunas redes pueden seguir usando el alojamiento anterior durante hasta cuatro horas desde el cambio. No es necesario cambiar los servidores de nombres.

## Configuración de la aplicación

- Vercel: `SITE_URL=https://bebepunt.com` en producción. Requiere un despliegue posterior para aplicarse.
- Supabase Auth: Site URL `https://bebepunt.com/portal/index.html`.
- Redirect URLs de Supabase: conservar las rutas exactas `portal/index.html` y `portal/recuperar.html` de `bebepunt.com`, `www.bebepunt.com`, el alias de Vercel y GitHub Pages mientras dure la transición.
- Correos de solicitudes: `bebepunt_private.application_mail_settings.review_url=https://bebepunt.com/portal/admin.html`.
- Correos de formularios: `bebepunt_private.web_form_settings.site_url=https://bebepunt.com`.
- SEO: el origen predeterminado de `scripts/build-seo.py`, las URL canónicas, hreflang, datos estructurados, sitemap y robots utilizan `https://bebepunt.com`.
- La copia de GitHub Pages utiliza `https://bebepunt.com` como base de API; la web principal usa rutas relativas.
- Cloudflare Turnstile: el usuario confirmó el 23/11/2026 que añadió `bebepunt.com` al widget existente, conservando los dominios anteriores. No se rotaron las claves. La comprobación del servidor sigue exigiendo que el hostname del token coincida con el origen del formulario.
- Se mantiene el alias `pruebapaginawebgithubio.vercel.app` durante la transición. La barra de comentarios de Vercel en producción está desactivada.

## Comprobaciones y mantenimiento

Las pruebas de aplicación, SEO y rutas portables deben pasar antes de publicar. Revisar el diff del generador SEO para conservar traducciones y ajustes manuales existentes. Las páginas privadas permanecen excluidas de indexación.

La verificación de HTTPS y de los ajustes de correo no sustituye una prueba completa de recepción de mensajes. Para probar contacto, suscripción, solicitud de tienda, confirmación y recuperación, usar una cuenta de prueba autorizada; no duplicar contactos ni solicitudes reales.

Si se cambia de proveedor en el futuro, consultar los valores DNS específicos de ese proyecto y mantener el correo separado del registro A de la web. No retirar el alias anterior hasta comprobar los enlaces antiguos y las integraciones.

## Referencias

- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://supabase.com/docs/guides/auth/redirect-urls
- https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
