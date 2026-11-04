// PUBLIC configuration only. Secret keys belong in Vercel environment variables.
window.BEBEPUNT_API_BASE = location.hostname === 'ferre33.github.io' ? 'https://pruebapaginawebgithubio.vercel.app' : '';
window.BEBEPUNT_TURNSTILE_SITE_KEY = '0x4AAAAAAFzrdpk_wkfDreh5';
window.BEBEPUNT_PRIVACY_URL = new URL('../politica-privacidad-bebepunt/privacidad/index.html', document.currentScript.src).href;
window.BEBEPUNT_PRIVACY_VERSION = '2026-10-22'; // Real, published privacy-policy URL.
