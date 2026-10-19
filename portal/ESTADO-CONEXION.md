# Estado de conexión Supabase — BEBEPUNT B2B

La configuración del frontend se ha rellenado con la URL del proyecto y la publishable key proporcionadas por el propietario.

- Project URL: https://mmssqogvjlkodxwlpyll.supabase.co
- Clave utilizada: publishable key (`sb_publishable_...`)
- Archivo cargado por portal/index.html: `config.js`
- `portal/config.js` está excluido de Git por `.gitignore` para evitar publicar configuración local accidentalmente. Para un despliegue estático, deberá inyectarse durante el build o incluirse conscientemente en el artefacto de despliegue; la publishable key no es una clave secreta.

## No verificado todavía

No se ha probado una conexión de red real a Supabase desde este entorno y no se ha inspeccionado el estado de la base de datos en el Dashboard. Por tanto, no se afirma que la conexión esté operativa.

Antes de probar el portal:
1. En Supabase SQL Editor, aplicar `../supabase/migrations/202610190001_b2b_portal.sql` en el proyecto correcto, primero en entorno de pruebas.
2. Crear el bucket privado `b2b-product-media` y aplicar políticas de acceso adecuadas.
3. Configurar Authentication > URL Configuration con la URL real de despliegue y sus redirect URLs.
4. Verificar que la migración se ejecutó sin errores y que RLS está habilitado en todas las tablas expuestas.
5. Crear un usuario de prueba y comprobar acceso anónimo, pendiente, aprobado, suspendido y administrador.
6. Configurar el primer administrador solo después de registrar y verificar su cuenta, usando su UUID real en SQL Editor. No hacerlo desde el frontend público.

No guardar aquí ninguna `service_role`/secret key ni contraseña de base de datos.
