/* app2 loader — join base64 parts then eval */
(function(){
  var b64 = [window.__APP2_B0||"",window.__APP2_B1||"",window.__APP2_B2||"",window.__APP2_B3||""].join('');
  if (!b64) { console.error('[app2] empty'); return; }
  try {
    var str = decodeURIComponent(Array.prototype.map.call(atob(b64), function(c){
      return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    (0,eval)(str);
  } catch(e) { console.error('[app2]', e); }
})();
