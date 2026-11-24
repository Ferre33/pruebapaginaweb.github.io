# SEO público BEBEPUNT

El dominio canónico es **https://bebepunt.com/**. Las seis páginas públicas tienen versiones españolas e inglesas estáticas en `/en/`, canonical propio y hreflang recíproco. El título español de la portada es **BEBEPUNT COOP. V. - Ropa de bebé en Ayora**; la versión inglesa tiene su traducción.

## Estructura y contenido

- Mantener un H1 por página, H2 para secciones y H3 para subsecciones. El tamaño visual se controla con CSS, no cambiando arbitrariamente el nivel de encabezado.
- Los títulos y descripciones describen fabricación en Ayora, colecciones y distribución al por mayor. La página de ubicaciones describe la sede actual, sin anunciar una red de tiendas que aún no figura en el mapa.
- Los datos estructurados conectan Organization, WebSite y cada página. Incluyen la denominación BEBEPUNT COOP. V., dirección, teléfono y correo públicos. No se atribuye a BEBEPUNT la ficha de Google Maps de otra empresa que comparte dirección.
- No publicar precios privados, clientes, productos de demostración, reseñas inventadas, horarios sin confirmar ni disponibilidad que no sea real. El área cliente conserva `noindex`.
- Mantener textos útiles y traducciones completas; evitar repeticiones artificiales de palabras clave. Las imágenes públicas conservan sus modelos y tienen versiones WebP y textos alternativos cuando aportan información.
- El favicon muestra los tres niños originales dentro de un círculo neutro, con exterior transparente. Se publica en `/img/favicon-bebepunt.png` (192 × 192), `/favicon.ico` (16, 32 y 48) y `/img/apple-touch-icon.png` (180 × 180). El formato del archivo es cuadrado aunque la figura sea circular. Estas URL estables deben permanecer accesibles al rastreador de imágenes. Para reconstruir los iconos desde `img/niños-bebepunt.png`, ejecutar `python scripts/build-icons.py`.

## Cómo editar y comprobar

Editar las páginas españolas y sus atributos `data-es`, `data-en`, `data-alt-es` y `data-alt-en`. Los títulos y descripciones están en `scripts/build-seo.py`. No editar a mano las páginas generadas de `/en/`.

Después de editar, ejecutar:

```sh
python scripts/build-seo.py
python scripts/check-seo.py
python scripts/check-portable-paths.py
npm test
```

Las comprobaciones verifican títulos, datos estructurados, canonical, idiomas, enlaces, imágenes, sitemap y exclusión de páginas privadas. Comprobar también las páginas desplegadas; superar estos controles no equivale a una puntuación de Core Web Vitals.

## Dominio e indexación

`sitemap.xml` enumera las 12 URL públicas canónicas y `robots.txt` lo anuncia. Las URL públicas de `pruebapaginawebgithubio.vercel.app` redirigen con HTTP 301 a su equivalente en `bebepunt.com`. Las rutas `/api` y `/portal` del origen anterior se mantienen para conservar integraciones, sesiones y enlaces de autenticación existentes. Los alias de despliegues de prueba no se redirigen con estas reglas.

Conservar las etiquetas `google-site-verification` de la portada: la propiedad antigua y la nueva tienen tokens distintos. En Google Search Console usar la propiedad **https://bebepunt.com/**, verificarla mediante la etiqueta HTML y enviar **https://bebepunt.com/sitemap.xml**. Tras publicar y comprobar las redirecciones, tramitar el cambio de dirección desde la propiedad antigua y solicitar la indexación de la portada. Un sitemap aceptado o una solicitud enviada no confirman que las páginas estén ya indexadas.

Google decide qué título mostrar y la posición de cada resultado. Revisar consultas, impresiones, clics, indexación y experiencia móvil cuando haya datos. Mantener la información de colecciones al día y obtener menciones auténticas de tiendas y entidades del sector; no comprar enlaces ni reseñas. No se garantizan primeras posiciones.
