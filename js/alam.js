// hobi-alam: progres scroll hero, parallax polaroid, panel melebar, muncul saat scroll
(function(){
 var de=document.documentElement;de.classList.add('js');
 var calm=matchMedia('(prefers-reduced-motion:reduce)').matches,hero=document.getElementById('hero'),dst=document.querySelector('.al-dst'),
  pls=[].slice.call(document.querySelectorAll('.pl')),lis=[].slice.call(document.querySelectorAll('.lst li')),tick=false,px=[].slice.call(document.querySelectorAll('[data-px]'));
 function cl(v){return Math.min(1,Math.max(0,v))}
 function upd(){tick=false;var vh=innerHeight;
  if(hero){var r=hero.getBoundingClientRect();var d=r.height-vh;hero.style.setProperty('--p',(calm||d<=0)?1:cl(-r.top/d).toFixed(4))}
  de.style.setProperty('--sp',cl(scrollY/Math.max(1,de.scrollHeight-vh)).toFixed(4));
  if(!calm)px.forEach(function(e){var b=e.getBoundingClientRect();e.style.translate='0 '+(((b.top+b.height/2-vh/2)/vh)*-36).toFixed(1)+'px'});
  if(dst&&!calm){var d=dst.getBoundingClientRect(),s=cl((vh-d.top)/(vh+d.height))-.5;
   pls.forEach(function(p){p.style.setProperty('--t',(s*-4*(+p.dataset.k||50)).toFixed(1)+'px')})}
 }
 function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
 addEventListener('scroll',req,{passive:true});addEventListener('resize',req);upd();
 pls.forEach(function(p,i){p.addEventListener('mouseenter',function(){lis.forEach(function(l,j){l.classList.toggle('on',i===j)})})});
 var ps=[].slice.call(document.querySelectorAll('.pn article'));
 ps.forEach(function(a){function on(){ps.forEach(function(b){b.classList.toggle('on',b===a)})}a.addEventListener('mouseenter',on);a.addEventListener('focus',on);a.addEventListener('click',on)});
 var rv=[].slice.call(document.querySelectorAll('.rv'));
 if('IntersectionObserver' in window&&!calm){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});rv.forEach(function(el){io.observe(el)})}
 else rv.forEach(function(el){el.classList.add('in')});
})();
