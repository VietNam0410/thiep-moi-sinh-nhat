(function(){
  var code = (window.__APP_A||'')+(window.__APP_B||'')+(window.__APP_C||'');
  if (!code) { console.error('[app] missing'); return; }
  try { (0,eval)(code); }
  catch (e) { console.error('[app]', e); }
})();
