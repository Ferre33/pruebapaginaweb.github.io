# Idiomas, privacidad y futura venta a particulares

- ES/EN comparte la preferencia `lang` en toda la web. Los textos del catálogo comercial se mantienen en columnas `_en` de Supabase; cuando falten se muestra el original español. Los 22 modelos ilustrativos tienen traducción.
- La política enlaza a `politica-privacidad-bebepunt/privacidad/index.html`. Conserva el contenido aportado por BEBEPUNT y sus avisos de borrador; la integración técnica no la convierte en una política legal revisada.
- Registro: enlace en pestaña nueva; checkbox obligatorio, desmarcado. La migración 202610220003 exige la aceptación y guarda versión, idioma y fecha del servidor en una tabla sin permisos de escritura para clientes. Las cuentas existentes se conservan, sin inventar aceptaciones históricas.
- Mayoristas: precio común por variante `professional_price`; el pedido SQL sigue calculando sus importes con ese precio. No hay acceso público a precios profesionales.
- Particulares: campo independiente `retail_price`, inicialmente NULL, y `retail_enabled=false`. No se copia ni calcula desde la tarifa profesional. No hay venta minorista en esta versión. Para activarla más adelante se requiere implementar el registro/checkout minorista, permisos, precios con impuestos, condiciones y devoluciones, y validar esa versión antes de habilitarla.
- Aplicar la migración después de las dos anteriores y después de publicar el formulario actualizado. No ejecutar de nuevo las migraciones iniciales.
