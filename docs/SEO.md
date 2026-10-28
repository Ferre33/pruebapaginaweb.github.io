# SEO público BEBEPUNT

Las seis páginas públicas tienen una versión española y una inglesa estática en `/en/`, con canonical propio y hreflang recíproco. El origen canónico actual es https://pruebapaginawebgithubio.vercel.app.

## Cómo editar

Editar las páginas españolas y sus atributos `data-es` y `data-en`. Los títulos y descripciones se mantienen en `scripts/build-seo.py`. Ejecutar `python scripts/optimize-images.py` y `python scripts/build-seo.py` (dependencias: lxml y Pillow), `python scripts/check-seo.py` y `npm test` antes de publicar. No editar a mano las páginas generadas de `/en/`.

Mantener un H1 descriptivo por página, H2 para secciones y H3 para subsecciones. Elegir el nivel por la estructura, no por el tamaño de letra. Escribir textos útiles sobre fabricación, colecciones y distribución, sin repetir palabras clave artificialmente. Las etiquetas de campaña no son encabezados.

## Prioridades fuera del código

1. Propiedad verificada en Google Search Console y `/sitemap.xml` enviado el 28 de octubre de 2026. Google muestra estado Correcto y 12 páginas descubiertas. Esto no significa que estén indexadas. Revisar indexación, consultas reales, clics y problemas móviles cuando Google disponga de datos. Mantener la etiqueta google-site-verification publicada en la portada.
2. Al disponer de dominio definitivo, cambiar `SITE_ORIGIN` al ejecutar el generador y redirigir permanentemente todas las URL anteriores a su equivalente. Conservar rutas ES/EN. No cambiar solo el canonical mientras el sitio nuevo no esté publicado.
3. Completar información comercial auténtica: materiales, procesos, tallas y condiciones para tiendas. Publicar solo datos contrastados, sin exponer precios ni fichas privadas. Añadir contenido de colecciones cuando realmente cambien.
4. Medir Core Web Vitals y optimizar las fotografías grandes en formatos modernos. Las páginas públicas sirven versiones WebP, variantes de 640 px para fotografías y precarga de la primera imagen de portada. Los originales se conservan. La mejora de bytes no equivale a una puntuación de Core Web Vitals; medirla con datos de laboratorio y tráfico real.
5. Conseguir menciones y enlaces reales desde tiendas y entidades del sector. No comprar enlaces ni generar reseñas falsas. No hay garantías de primeras posiciones.

El área cliente conserva noindex. No se publican precios, datos de clientes ni productos de demostración como datos estructurados de venta. No se han contratado servicios ni enviado formularios de prueba a clientes.

La configuración pendiente de formularios/Brevo sigue separada en PR #6; esta modificación SEO no la activa. Al integrar esa PR, conservar los atributos SEO y regenerar `/en/` para incorporar cualquier cambio en las páginas españolas.
