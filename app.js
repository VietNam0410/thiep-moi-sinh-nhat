/* Load full app from horse.js */
(function(){
  if (typeof __APP_SOURCE__ === 'string') {
    try { (0, eval)(__APP_SOURCE__); }
    catch (e) { console.error('app load error', e); }
  } else {
    console.error('__APP_SOURCE__ missing');
  }
})();
