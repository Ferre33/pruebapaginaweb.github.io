# Clasificación de clientes y tarifas

En Administración → Clientes se guarda el estado y el tipo de cliente juntos. Tipos: Particular (`retail`), Tienda (`shop`), Almacén (`warehouse`). El filtro permite consultar cada grupo. Los perfiles existentes y las solicitudes nuevas empiezan como Tienda; el administrador puede reclasificarlos sin cambiar su rol de acceso.

En Administración → Catálogo se editan tres importes independientes por variante comercial, en EUR sin impuestos. Un campo vacío significa tarifa pendiente, nunca precio cero ni sustitución por otra categoría. Los precios se guardan en `variant_prices`; los campos anteriores se conservan como datos históricos. Las futuras importaciones deben escribir en `variant_prices`.

Las compras y los precios continúan visibles solo para administración. `commerce_settings.customer_prices_enabled` es false; la política RLS también oculta las tarifas. Si se prepara la apertura comercial, la base de datos ya permite entregar únicamente la tarifa de la categoría del perfil autenticado. La apertura requiere adaptar el permiso `canShop` del portal y las condiciones comerciales; no basta con cambiar una bandera. Particular continúa bloqueado en el checkout, incluso si se altera la bandera retail. El checkout de tienda/almacén obtiene el precio del servidor y conserva la categoría en el pedido.

Solo administración puede reclasificar clientes y editar precios. `update_my_profile` no acepta categoría, estado ni rol. Se ha retirado la política de lectura pública de perfiles y el acceso de clientes a columnas históricas de precios para evitar que se puedan consultar datos de otros clientes o tarifas ajenas.

Validación: `npm test`, `python scripts/check-seo.py`, `python scripts/check-portable-paths.py`. `tests/customer-tariffs.sql` prueba permisos reales en una transacción que termina con rollback, sin conservar cambios de clientes ni productos.
