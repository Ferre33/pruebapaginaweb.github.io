// Keep the existing Vercel handlers usable on Netlify without duplicating business rules.
import { Readable } from 'node:stream';
export function adapt(handler, { raw = false, maxBytes = 2_000_000 } = {}) {
  return async request => {
    const headers = new Headers({ 'Cache-Control': 'no-store' });
    let status = 200, payload = null;
    const res = {
      setHeader(name, value) { headers.set(name, String(value)); return this; },
      status(value) { status = value; return this; },
      json(value) { headers.set('Content-Type', 'application/json; charset=utf-8'); payload = JSON.stringify(value); return this; },
      send(value) { payload = value; return this; },
      end(value) { payload = value ?? null; return this; }
    };
    try {
      const chunks = []; let size = 0;
      if (request.body) for await (const chunk of request.body) {
        size += chunk.byteLength;
        if (size > maxBytes) return new Response('Payload demasiado grande', { status: 413, headers });
        chunks.push(Buffer.from(chunk));
      }
      const bytes = Buffer.concat(chunks);
      const req = Readable.from(bytes.length ? [bytes] : []);
      req.method = request.method;
      req.headers = Object.fromEntries(request.headers);
      req.url = new URL(request.url).pathname;
      if (!raw) {
        try { req.body = bytes.length ? JSON.parse(bytes.toString('utf8')) : {}; }
        catch { return new Response('JSON no válido', { status: 400, headers }); }
      }
      await handler(req, res);
      return new Response([204, 205, 304].includes(status) ? null : payload, { status, headers });
    } catch {
      return new Response(JSON.stringify({ error: 'Servicio temporalmente no disponible.' }), {
        status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }
  };
}
