// halaman hobi: tema gelap/terang + lightbox galeri (klik foto/video untuk memperbesar)
(function(){
 var tg=document.getElementById('hbTg');
 if(tg)tg.addEventListener('click',function(){
  var d=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',d);
  try{localStorage.setItem('tema',d)}catch(e){}
 });
 var items=[].slice.call(document.querySelectorAll('.hb-it')),lb=document.getElementById('hbLb');
 if(!items.length||!lb)return;
 var box=lb.querySelector('.hb-lb-in'),cap=lb.querySelector('p'),cur=0,media=null;
 function show(i){
  cur=(i+items.length)%items.length;
  var it=items[cur],v=it.querySelector('video'),im=it.querySelector('img');
  if(media)media.remove();
  if(v){media=document.createElement('video');media.src=v.currentSrc||v.src;media.controls=true;media.autoplay=true;media.loop=true;media.playsInline=true}
  else{media=document.createElement('img');media.src=im.currentSrc||im.src;media.alt=im.alt||''}
  box.insertBefore(media,cap);
  cap.textContent=it.getAttribute('data-cap')||'';
 }
 items.forEach(function(it,i){it.addEventListener('click',function(){show(i);if(lb.showModal)lb.showModal();else lb.setAttribute('open','')})});
 function close(){if(media&&media.pause)media.pause();lb.close?lb.close():lb.removeAttribute('open')}
 lb.querySelector('.x').addEventListener('click',close);
 lb.querySelector('.pv').addEventListener('click',function(){show(cur-1)});
 lb.querySelector('.nx').addEventListener('click',function(){show(cur+1)});
 lb.addEventListener('click',function(e){if(e.target===lb||e.target===box)close()});
 lb.addEventListener('close',function(){if(media&&media.pause)media.pause()});
 document.addEventListener('keydown',function(e){if(!lb.open)return;if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
})();
