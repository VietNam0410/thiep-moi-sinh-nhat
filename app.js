(function(){
  function go(){
    try{ (0,eval)((window.__AP1__||'')+(window.__AP2__||'')); }
    catch(e){console.error('app',e)}
  }
  var s1=document.createElement('script');
  s1.src='app-p1.js';
  s1.onload=function(){
    var s2=document.createElement('script');
    s2.src='app-p2.js';
    s2.onload=go;
    s2.onerror=go;
    document.head.appendChild(s2);
  };
  s1.onerror=function(){console.error('p1 fail')};
  document.head.appendChild(s1);
})();
