(function(){
  var n=0, total=4;
  function tryGo(){
    if(n<total) return;
    try{ (0,eval)([0,1,2,3].map(function(i){return window['__A'+i+'__']||'';}).join('')); }
    catch(e){console.error(e)}
  }
  [0,1,2,3].forEach(function(i){
    var s=document.createElement('script');
    s.src='ap'+i+'.js';
    s.onload=function(){n++;tryGo();};
    s.onerror=function(){n++;tryGo();};
    document.head.appendChild(s);
  });
})();
