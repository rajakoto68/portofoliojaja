/* carousel foto/video per gunung + video hanya jalan saat terlihat */
(function(){
 [].forEach.call(document.querySelectorAll('[data-car]'),function(car){
  var trk=car.querySelector('.ab-trk'),sl=[].slice.call(trk.children),dots=car.querySelector('.ab-dots'),cnt=car.querySelector('.ab-cnt'),
      pv=car.querySelector('.ab-pv'),nx=car.querySelector('.ab-nx'),k=0,t=0;
  sl.forEach(function(_,i){dots.appendChild(document.createElement('i'))});
  function upd(){t=0;var w=trk.clientWidth||1;k=Math.max(0,Math.min(sl.length-1,Math.round(trk.scrollLeft/w)));
   [].forEach.call(dots.children,function(d,i){d.classList.toggle('on',i===k)});
   if(cnt)cnt.textContent=('0'+(k+1)).slice(-2)+' / '+('0'+sl.length).slice(-2);
   if(pv)pv.disabled=k===0;if(nx)nx.disabled=k===sl.length-1}
  trk.addEventListener('scroll',function(){if(!t)t=requestAnimationFrame(upd)},{passive:true});
  function go(d){trk.scrollTo({left:(k+d)*trk.clientWidth,behavior:'smooth'})}
  if(pv)pv.addEventListener('click',function(){go(-1)});if(nx)nx.addEventListener('click',function(){go(1)});
  addEventListener('resize',upd);upd();
  [].forEach.call(car.querySelectorAll('.ab-sl'),function(f){var snd=f.querySelector('.ab-snd'),v=f.querySelector('video');
   if(snd&&v)snd.addEventListener('click',function(){v.muted=!v.muted;snd.textContent=v.muted?'🔇':'🔊';snd.setAttribute('aria-label',v.muted?'Nyalakan suara':'Matikan suara')})});
 });
 var vs=[].slice.call(document.querySelectorAll('.ab video'));
 if(vs.length&&'IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting&&e.intersectionRatio>=.55){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{threshold:[0,.55,1]});
  vs.forEach(function(v){io.observe(v)});
 }
})();
