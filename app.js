(function(){
  var n=0,total=4;
  function go(){if(n<total)return;try{(0,eval)([0,1,2,3].map(function(i){return window['__A'+i+'__']||''}).join(''))}catch(e){console.error(e)}}
  for(var i=0;i<4;i++){(function(i){var s=document.createElement('script');s.src='ap'+i+'.js';s.onload=function(){n++;go()};s.onerror=function(){n++;go()};document.head.appendChild(s)})(i)}
})();
