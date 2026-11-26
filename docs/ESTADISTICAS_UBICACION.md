# Estadísticas geográficas · 26 noviembre 2026

El panel de administración distingue dos fuentes que no se suman:

- **Estimación por conexión a Internet**: recuentos de páginas con país, región y ciudad de Vercel. Pueden reflejar la salida del operador, VPN o un centro de datos. No son personas únicas.
- **Localidades confirmadas**: aportaciones voluntarias. El visitante acepta usar su ubicación y confirma una de las localidades sugeridas, o busca y elige una localidad manualmente. No son personas únicas ni páginas vistas. Son una muestra voluntaria, con posible sesgo de participación. Los datos históricos no se pueden corregir retrospectivamente.

El aviso ES/EN permite aceptar o continuar sin compartir, con botones de igual estilo. No bloquea la navegación. «Preferencias de ubicación», en el pie, permite volver a abrirlo o retirar el permiso. No se accede al GPS al cargar la web, después de rechazar ni en segundo plano. Se respetan DNT/GPC. Se recuerda solo la decisión y su caducidad (90 días), sin guardar una localidad ni un identificador de visitante en el navegador. Al cambiar de zona, el visitante puede abrir las preferencias y aportar de nuevo; no hay seguimiento automático.

Las coordenadas del dispositivo se reducen en el navegador a centésimas de grado (una celda de aproximadamente un kilómetro, variable con la latitud). Solo se envían por POST al servidor de BEBEPUNT para sugerir localidades de un directorio público offline de GeoNames. Si la precisión que comunica el dispositivo supera 5 km, se ofrece elegir localidad. No se envían datos de visitantes a GeoNames ni a un geocodificador externo. Una localidad próxima no prueba los límites municipales: se exige confirmación del visitante. Si falta una localidad, no se inventa ni se graba una posición alternativa.

`website_zone_daily` guarda día, país, región, provincia/área, localidad, método, versión de consentimiento y contador. No guarda coordenadas, IP, nombre, correo, cuenta, ruta visitada ni hora individual. El servidor no registra cuerpos de peticiones. Los proveedores siguen tratando metadatos técnicos necesarios para el alojamiento, según la política de privacidad; no se promete ausencia de todo tratamiento de datos personales.

El endpoint exige origen permitido, JSON acotado y consentimiento de la versión actual. Solo admite lugares del directorio, firmados por el servidor durante un máximo de 15 minutos. La firma usa una clave derivada por HMAC del secreto del servidor, que nunca se publica. Un hash aleatorio de la operación evita duplicar reintentos; se conserva 30 minutos y se limpia cada 10 minutos, sin datos geográficos ni de identidad asociados. No es un identificador persistente de visitante. Esto evita reintentos duplicados, no demuestra que cada aportación pertenezca a una persona diferente ni impide toda automatización.

Solo los administradores aprobados según el modelo existente pueden leer el panel y exportar CSV. La base conserva los agregados 90 días y los borra con cron. Los previews permiten probar el recorrido, pero no guardan aportaciones. El contador automático permanece independiente.

## Validación

- `npm test`: coordenadas reducidas, precisión insuficiente, directorio y homónimos, consentimiento, firmas, caducidad, rechazo de campos personales, origen, DNT/GPC, errores de red y aislamiento de previews.
- `python scripts/check-seo.py` y `python scripts/check-portable-paths.py`.
- Prueba SQL con rollback: primer envío incrementa una vez, reintento no suma; acceso anónimo/cliente no autorizado rechazado; tabla agregada sin coordenadas o identificadores.
- Revisión visual del aviso en móvil y escritorio, rechazo, selección manual ES/EN y consulta administrativa.

No se necesitan cookies analíticas, una API de geocodificación de pago ni nuevas cuentas. Se utilizan los recursos existentes de Vercel/Supabase y el directorio GeoNames bajo CC BY 4.0; ver `server/data/README.md`.
