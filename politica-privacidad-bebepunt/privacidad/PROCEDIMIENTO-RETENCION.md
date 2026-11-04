# Procedimiento de conservación de solicitudes rechazadas

Criterio aprobado por BEBEPUNT el 23 de octubre de 2026: seis meses desde la comunicación del rechazo. Este documento describe un procedimiento manual; no activa tareas ni elimina datos.

1. La persona administradora revisa la solicitud y comunica el rechazo al solicitante por el canal profesional acordado. Cambiar el estado en el portal no envía automáticamente esa comunicación.
2. Anota en un registro interno de acceso restringido el identificador de la solicitud, la fecha efectiva de comunicación, el medio utilizado y el vencimiento de los seis meses naturales. No publicar ese registro en GitHub. No utilizar `updated_at`: cambia con otras modificaciones y no acredita la notificación.
3. Antes del vencimiento comprueba si la solicitud ha sido reabierta o aprobada, si hay pedidos o documentos sujetos a conservación propia, o una reclamación pendiente. No borrar cuentas aprobadas o suspendidas con esta regla.
4. Si existe una reclamación, documenta su motivo y restringe el acceso a los datos estrictamente necesarios; revisa la excepción cuando se resuelva. No establecer una retención indefinida por defecto.
5. Al vencer el plazo, elimina los datos de la solicitud y sus copias operativas que ya no deban conservarse: cuenta de autenticación, perfil, ficheros y comunicaciones, verificando primero las dependencias y las obligaciones aplicables. La eliminación es una actuación manual que debe revisarse antes de ejecutarse; este documento no es una orden de borrar ninguna cuenta concreta.
6. Registra la ejecución con la mínima información necesaria para acreditar el borrado. Revisa también las políticas de copias de seguridad y evita reintroducir datos eliminados al restaurarlas.

## Estado técnico

El portal permite marcar una solicitud como rechazada, pero no registra la fecha de comunicación ni envía el rechazo. Por tanto, el plazo debe controlarse en el registro interno anterior hasta implementar y verificar ese flujo. No se han configurado borrados automáticos ni se han enviado comunicaciones.

La política continúa como borrador mientras se completan la revisión de proveedores, las transferencias internacionales y los demás criterios de conservación. El plazo de seis meses es una decisión de BEBEPUNT, no un plazo legal general impuesto para este tipo de solicitud.
