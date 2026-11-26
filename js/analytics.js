// Server page totals stay separate from the optional, confirmed locality contribution.
(() => {
  try { localStorage.removeItem('bebepunt.analytics.choice.v1'); } catch {}
  try { sessionStorage.removeItem('bebepunt.analytics.session.v1'); } catch {}
  const source=document.currentScript?.src;
  if(source)import(new URL('location-consent.mjs?v=20261126',source)).then(module=>module.startLocationConsent()).catch(()=>{});
})();
