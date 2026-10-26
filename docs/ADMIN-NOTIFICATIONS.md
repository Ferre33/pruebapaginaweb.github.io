# BEBEPUNT — avisos de solicitudes

Estado 2026-10-25: migración instalada en producción, envío activado y entrega al administrador comprobada en Brevo (HTTP 201 y evento Entregado). Cola contiene la solicitud de prueba confirmada. Nunca guardar claves en Git o SQL Editor.

## Funcionamiento
Cada minuto `bebepunt_private.process_application_mail()` detecta perfiles shop/pending con correo confirmado. Crea una sola entrada por perfil. Un proceso independiente del registro envía mediante Brevo a ferrepancracio@gmail.com. El correo ES/EN muestra tienda, contacto y correo, y enlaza al panel web existente. Allí el administrador selecciona Aprobada/Rechazada y guarda; `set_shop_status` comprueba `is_admin()` en servidor. Abrir enlaces no aprueba solicitudes. No se ha concedido acceso a la tienda de prueba.

## Activación (completada)
1. Crear clave **API** de Brevo (diferente de SMTP) y copiarla privadamente.
2. Supabase > Integrations > Vault: crear secreto `bebepunt_brevo_api_key` con ese valor.
3. Activar: `update bebepunt_private.application_mail_settings set enabled=true where singleton;`
4. Ejecutar `select bebepunt_private.process_application_mail();` y comprobar respuesta y entrega en Brevo. `accepted` significa aceptado por API, no entrega en buzón.
5. Comprobar el enlace con sesión administrativa y probar decisión con autorización del usuario.

## Seguridad y operación
Schema privado, RLS habilitado sin políticas de cliente; ni anon ni authenticated pueden ejecutar el proceso o leer tablas. Destinatario debe seguir siendo admin. Solo propietario de base de datos administra configuración. Clave leída de Vault, nunca enviada al navegador. pg_net guarda temporalmente headers en su cola: accesible para roles con acceso directo a la base; no exponer el schema net ni conceder acceso directo a terceros.

Reintentos cada 15 minutos en fallos temporales, máximo 5. Fallos 4xx salvo 408/429 requieren corrección manual. Pérdida de respuesta puede ocasionar duplicado (entrega al menos una vez). Las solicitudes siguen en Supabase aunque no se entregue el aviso. Consultar `state`, `attempts`, `last_http_status` en la cola; no imprimir secretos o headers. Para reintentar manualmente una fila fallida, corregir antes la causa y cambiar state a queued, attempts a 0, next_attempt_at a now().

Desactivar de forma reversible: `update bebepunt_private.application_mail_settings set enabled=false where singleton;`.
Al migrar a Netlify actualizar review_url conservando /portal/admin.html, y configurar redirecciones Auth. El sistema no depende del hosting. Revisar periódicamente el historial de cron (crece por cada ejecución); no se ha instalado ninguna eliminación automática de datos.

## Validación realizada
Migración ejecutada sin error. Una solicitud en queued, attempts=0. Cron activo una vez/minuto. Configuración enabled=false y destinatario correcto. Privilegios anon_schema, anon_execute, member_table y member_execute todos false. Clave API guardada por el usuario en Vault. Aviso de prueba aceptado al primer intento y entregado a ferrepancracio@gmail.com. Abrir el enlace sin sesión exige login. La tienda permanece pendiente: no se ha decidido su acceso.

## Trabajo siguiente autorizado
1. Terminar activación y prueba de avisos y aprobación/denegación.
2. Adaptar todas las secciones nuevas al móvil, mantener estilo y ES/EN.
3. Compra de simulación: catálogo demo, cesta, pago ficticio sin cobro y factura de prueba con detalles claramente identificada sin validez fiscal.
4. Completar rama migracion-netlify (scripts/functions/tests pendientes de subir), Netlify Free, privacidad y guía PDF separada. Mantener Vercel hasta validar destino.
