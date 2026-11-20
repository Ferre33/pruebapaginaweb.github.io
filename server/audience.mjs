const publicSections = ['about', 'colecciones', 'contacto', 'para-tiendas', 'puntos-de-venta'];
const paths = new Map([['/', '/index.html'], ['/index.html', '/index.html']]);
for (const prefix of ['', '/en']) {
  paths.set(prefix + '/', '/index.html');
  paths.set(prefix + '/index.html', '/index.html');
  for (const section of publicSections) {
    paths.set(`${prefix}/${section}/`, `/${section}/index.html`);
    paths.set(`${prefix}/${section}/index.html`, `/${section}/index.html`);
  }
}
for (const page of ['index', 'inicio', 'catalogo', 'colecciones', 'producto', 'perfil']) {
  paths.set(`/portal/${page}.html`, `/portal/${page}.html`);
}
paths.set('/politica-privacidad-bebepunt/privacidad/', '/politica-privacidad-bebepunt/privacidad/index.html');
paths.set('/politica-privacidad-bebepunt/privacidad/index.html', '/politica-privacidad-bebepunt/privacidad/index.html');

function geography(headers, name, max) {
  try {
    const value = decodeURIComponent(headers.get(name) || '').trim();
    return value && value.length <= max && /^[\p{L}\p{M}\p{N} .,'’()\/-]+$/u.test(value) ? value : 'Unknown';
  } catch { return 'Unknown'; }
}

// No cookies, account/session identifiers, IP addresses, full URLs or request timestamps.
export function audienceBucket(request) {
  const h = request.headers;
  if (request.method !== 'GET' || !h.get('accept')?.includes('text/html')) return null;
  if (h.get('dnt') === '1' || h.get('sec-gpc') === '1') return null;
  if (/prefetch|prerender/i.test(`${h.get('purpose')} ${h.get('sec-purpose')}`) || h.has('next-router-prefetch')) return null;
  if (h.has('sec-fetch-dest') && h.get('sec-fetch-dest') !== 'document') return null;
  if (h.has('sec-fetch-mode') && h.get('sec-fetch-mode') !== 'navigate') return null;
  if (/bot|crawler|spider|headless|lighthouse|pagespeed|preview|curl|wget|python|node|monitor/i.test(h.get('user-agent') || '')) return null;
  const page = paths.get(new URL(request.url).pathname);
  if (!page) return null;
  const country = h.get('x-vercel-ip-country') || '';
  return {
    page,
    country: /^[A-Z]{2}$/.test(country) ? country : 'Unknown',
    region: geography(h, 'x-vercel-ip-country-region', 80),
    city: geography(h, 'x-vercel-ip-city', 100)
  };
}

export async function recordAudience(bucket, env = process.env, send = fetch) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return false;
  try {
    const response = await send(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/record_website_pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
      body: JSON.stringify({ p: bucket }),
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch { return false; }
}
