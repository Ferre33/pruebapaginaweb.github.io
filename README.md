# BEBEPUNT · Área cliente profesional
Empieza por **GUIA-CONFIGURACION.html** (o su versión Markdown).

La web pública se conserva. El portal nuevo está en `portal/`; cada sección tiene su propio HTML. Para actualizar Supabase existente, aplica solo `supabase/migrations/202610200002_client_area.sql`.

Para pagos y formularios despliega también `api/` en Vercel y configura las variables de la guía. GitHub Pages no ejecuta estas funciones. No se han activado servicios externos ni modificado cuentas reales.

Pruebas locales sin instalar dependencias: `npm test`. Para desplegar las funciones, Vercel instala las dependencias de `package.json`.
