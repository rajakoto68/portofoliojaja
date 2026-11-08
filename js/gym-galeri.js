/* Galeri Gym: tombol tema + lightbox (panah, keyboard, swipe) */
(function(){
 var r=document.documentElement,tg=document.getElementById('ggTg');
 if(tg)tg.addEventListener('click',function(){var d=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',d);try{localStorage.setItem('tema',d)}catch(e){}});
 var its=[].slice.call(document.querySelectorAll('.gg-it')),lb=document.getElementById('ggLb');
 if(!its.length||!lb)return;
 var img=lb.querySelector('img'),cap=lb.querySelector('p'),pv=lb.querySelector('.pv'),nx=lb.querySelector('.nx'),k=0,x0=null,last=null;
 function show(i){k=(i+its.length)%its.length;var b=its[k],im=b.querySelector('img');
  img.src=b.getAttribute('data-full')||im.src;img.alt=im.alt;
  cap.textContent=b.getAttribute('data-cap')||im.alt;var n=document.createElement('b');n.textContent=(k+1)+' / '+its.length;cap.appendChild(n);
  [new Image(),new Image()].forEach(function(p,j){var t=its[(k+(j?-1:1)+its.length)%its.length];p.src=t.getAttribute('data-full')||t.querySelector('img').src})}
 function open(i,b){last=b;show(i);if(lb.showModal)lb.showModal();else lb.setAttribute('open','');document.body.style.overflow='hidden'}
 function close(){if(lb.close)lb.close();else lb.removeAttribute('open');document.body.style.overflow='';if(last)last.focus()}
 its.forEach(function(b,i){b.addEventListener('click',function(){open(i,b)})});
 pv.addEventListener('click',function(){show(k-1)});nx.addEventListener('click',function(){show(k+1)});
 lb.querySelector('.x').addEventListener('click',close);
 lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('gg-lb-in')||e.target.tagName==='FIGURE')close()});
 lb.addEventListener('close',function(){document.body.style.overflow=''});
 lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(k-1);else if(e.key==='ArrowRight')show(k+1)});
 lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 lb.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>50)show(k+(d<0?1:-1))},{passive:true});
})();
