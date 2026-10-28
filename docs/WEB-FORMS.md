# Formularios por categoría

Preparación pendiente de activar en Supabase, Brevo y alojamiento. No declarar estos formularios operativos antes de completar una prueba real autorizada.

- newsletter: petición registrada en Supabase; confirmación doble de Brevo antes de pertenecer a la lista de newsletter.
- contact: consulta guardada y contacto clasificado en una lista exclusiva de consultas.
- retailer: consulta profesional guardada y contacto clasificado en otra lista exclusiva de tiendas.
- Las solicitudes de acceso al portal conservan su circuito propio de profiles y aprobación manual.

Las listas de contacto y tiendas no equivalen a consentimiento de marketing. Un remitente puede aparecer en varias categorías; no se restablecen flags de baja. Los mensajes completos quedan en Supabase y en el aviso transaccional enviado por Brevo, etiquetado web-newsletter, web-contact o web-retailer.

Aplicar 202610270001_ceremony_availability.sql y 202610270002_web_forms.sql una sola vez. La segunda crea web_submissions (lectura solo administración), configuración privada, cola de avisos y sincronización, RPC exclusiva del servidor y un cron por minuto.

La configuración hereda el destinatario y remitente privados ya usados para solicitudes de acceso. Cambiar web_form_settings.recipient para futuros avisos de formularios y application_mail_settings.recipient para avisos de acceso. No guardar direcciones personales ni secretos en el código público.

En Brevo crear tres listas separadas y dos plantillas DOI activas (ES/EN) con el enlace de confirmación exigido por Brevo. Guardar sus IDs en web_form_settings. La clave existente en Vault necesita permisos para contactos además de correo transaccional; revisar con el propietario antes de ampliar permisos. Mantenerla en Vault, nunca en GitHub.

Configurar Turnstile (clave pública en services-config.js y secreto en alojamiento), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y SITE_URL en alojamiento. Activar web_form_settings.enabled solo tras verificar listas, remitente y plantillas.

La API verifica Turnstile y registra el envío y dos trabajos en una transacción. Devuelve recibido, no entregado. El cron conserva resultado HTTP e ID de mensaje y reintenta fallos transitorios cada 15 minutos, hasta cinco veces. Los errores permanentes quedan failed para revisión; los trabajos sin IDs configurados esperan en queued. Un timeout después de que Brevo acepte puede duplicar el correo; la recepción de formularios usa UUID para evitar duplicados en Supabase.

accepted significa aceptación de la API, no entrega ni confirmación del suscriptor. La confirmación final de newsletter se consulta en Brevo; esta versión no sincroniza ese evento de vuelta a Supabase. No inferirlo desde la página de agradecimiento.

Antes de activar: probar los tres formularios con un destino autorizado, verificar filas y categorías, listas, aviso al administrador y confirmación de newsletter; comprobar rechazo de entradas inválidas y lectura anónima denegada. Revisar en privado los failed y la retención de mensajes y del historial cron.
