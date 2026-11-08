(function(){var p=document.querySelector('.ng-code pre');if(!p)return;
var T=[['k','const '],['f','siyo'],['','= {\n  '],['','sekolah: '],['s','"SMK Mandiri, RPL"'],['',',\n  '],['','bisaBikin: ['],['s','"website"'],['',', '],['s','"kasir"'],['','],\n  '],['','kopi: '],['k','true'],['',',\n};\n'],['c','// ngoding dari nol ☕']];
function mk(c){var s=document.createElement('span');if(c)s.className=c;p.appendChild(s);return s}
if(matchMedia('(prefers-reduced-motion:reduce)').matches){T.forEach(function(t){mk(t[0]).textContent=t[1]});return}
var i=0,j=0,el=mk(T[0][0]);
(function tick(){var t=T[i];el.textContent+=t[1][j++];
 if(j>=t[1].length){i++;j=0;if(i>=T.length){setTimeout(function(){p.textContent='';i=0;el=mk(T[0][0]);tick()},4000);return}el=mk(T[i][0])}
 setTimeout(tick,38+Math.random()*50)})();
})();

/* munculkan panel klien & bento pelan-pelan saat di-scroll */
(function(){
 var els=[].slice.call(document.querySelectorAll('[data-rv]'));if(!els.length)return;
 if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.documentElement.classList.add('ng-js');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
 els.forEach(function(el){io.observe(el)});
})();

/* gelombang hanya bergerak saat terlihat (hemat baterai/CPU) */
(function(){
 var w=[].slice.call(document.querySelectorAll('.ngw'));if(!w.length)return;
 if(!('IntersectionObserver' in window)){w.forEach(function(e){e.classList.add('on')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('on',e.isIntersecting)})},{rootMargin:'80px'});
 w.forEach(function(e){io.observe(e)});
})();

/* indikator titik carousel "Di balik layar" (HP) */
(function(){
 var b=document.querySelector('.ng-bento'),d=document.querySelectorAll('.ng-dots i');if(!b||!d.length)return;
 var t;b.addEventListener('scroll',function(){if(t)return;t=requestAnimationFrame(function(){t=0;
  var c=b.children,mid=b.scrollLeft+b.clientWidth/2,k=0,best=1e9;
  for(var i=0;i<c.length;i++){var x=Math.abs(c[i].offsetLeft+c[i].offsetWidth/2-mid);if(x<best){best=x;k=i}}
  for(i=0;i<d.length;i++)d[i].classList.toggle('on',i===k)})},{passive:true});
})();

/* tombol salin nomor WhatsApp */
(function(){
 var b=document.querySelector('.ng-ct-cp');if(!b)return;var t=b.textContent;
 b.addEventListener('click',function(){
  var n=b.getAttribute('data-copy');
  function ok(){b.textContent='Nomor tersalin \u2713';setTimeout(function(){b.textContent=t},1800)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(n).then(ok,function(){b.textContent=n})}
  else{b.textContent=n}
 });
})();
