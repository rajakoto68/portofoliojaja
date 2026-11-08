// teks label wujud di bagian About mengikuti progres scroll (--s dihitung di main.js)
(function(){
 const pin=document.querySelector('.ab4-pin'),chip=document.getElementById('ab4chip');
 if(!pin||!chip)return;
 let last='',vis=true,run=false;
 function f(){
  const s=parseFloat(getComputedStyle(pin).getPropertyValue('--s'))||0,m=Math.min(1,Math.max(0,(s-.12)/.34));
  const t=m<=0.02?'Wujud petualang':m>=.98?'Wujud asli':'Mengubah wujud '+Math.round(m*100)+'%';
  if(t!==last){chip.textContent=t;last=t}
  if(vis)requestAnimationFrame(f);else run=false
 }
 // hanya dihitung saat bagian About terlihat di layar
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!run){run=true;requestAnimationFrame(f)}}).observe(pin);
 run=true;f();
})();

// "Tiga hal yang aku suka": muncul sekali saat masuk layar + penanda kartu aktif di HP (ringan, pakai rAF)
(function(){
 const s=document.getElementById('tentang');if(!s)return;
 const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if('IntersectionObserver' in window&&!calm){
  s.classList.add('rv');
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){s.classList.add('in');io.disconnect()}},{threshold:.2});
  io.observe(s);
 }
 const g=s.querySelector('.lk-g'),items=[...g.children],dots=[...s.querySelectorAll('.lk-dots button')];
 if(!items.length||dots.length!==items.length)return;
 s.classList.add('js-dots');
 let cur=-1,tick=false;
 function mark(){
  tick=false;
  const mid=g.scrollLeft+g.clientWidth/2;let best=0,d=1e9;
  items.forEach((li,i)=>{const x=Math.abs(li.offsetLeft+li.offsetWidth/2-mid);if(x<d){d=x;best=i}});
  if(best===cur)return;cur=best;
  items.forEach((li,i)=>li.classList.toggle('on',i===best));
  dots.forEach((b,i)=>b.setAttribute('aria-current',i===best));
 }
 g.addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(mark)}},{passive:true});
 addEventListener('resize',mark);
 dots.forEach((b,i)=>b.addEventListener('click',()=>{const li=items[i];g.scrollTo({left:li.offsetLeft+li.offsetWidth/2-g.clientWidth/2,behavior:calm?'auto':'smooth'})}));
 mark();
})();

// "Skill yang sudah kukuasai": baris muncul sekali saat masuk layar
(function(){
 const s=document.getElementById('alat');
 if(!s||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 s.classList.add('rv');
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){s.classList.add('in');io.disconnect()}},{threshold:.15});
 io.observe(s);
})();

// gelombang di atas bagian Skill: naik sekali saat mulai masuk layar
(function(){
 const w=document.querySelector('.skl-wv');
 if(!w||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 w.classList.add('rv');
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){w.classList.add('on');io.disconnect()}},{threshold:0,rootMargin:'0px 0px -4% 0px'});
 io.observe(w);
})();
