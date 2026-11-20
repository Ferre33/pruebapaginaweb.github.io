import { next, waitUntil } from '@vercel/functions';
import { audienceBucket, recordAudience } from './server/audience.mjs';

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/', '/index.html', '/en/', '/en/index.html',
    '/about/', '/about/index.html', '/colecciones/', '/colecciones/index.html',
    '/contacto/', '/contacto/index.html', '/para-tiendas/', '/para-tiendas/index.html',
    '/puntos-de-venta/', '/puntos-de-venta/index.html',
    '/en/about/', '/en/about/index.html', '/en/colecciones/', '/en/colecciones/index.html',
    '/en/contacto/', '/en/contacto/index.html', '/en/para-tiendas/', '/en/para-tiendas/index.html',
    '/en/puntos-de-venta/', '/en/puntos-de-venta/index.html',
    '/portal/index.html', '/portal/inicio.html', '/portal/catalogo.html',
    '/portal/colecciones.html', '/portal/producto.html', '/portal/perfil.html',
    '/politica-privacidad-bebepunt/privacidad/', '/politica-privacidad-bebepunt/privacidad/index.html'
  ]
};

export default function middleware(request) {
  // Preview builds must never inflate production statistics. No database failure blocks the site.
  if (process.env.VERCEL_ENV === 'production') {
    const bucket = audienceBucket(request);
    if (bucket) waitUntil(recordAudience(bucket).then(ok => {
      if (!ok) console.warn('audience_counter_unavailable');
    }));
  }
  return next();
}
