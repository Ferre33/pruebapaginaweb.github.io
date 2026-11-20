// Compatibility cleanup only. Audience totals are now computed by the production server.
(() => {
  try { localStorage.removeItem('bebepunt.analytics.choice.v1'); } catch {}
  try { sessionStorage.removeItem('bebepunt.analytics.session.v1'); } catch {}
})();
