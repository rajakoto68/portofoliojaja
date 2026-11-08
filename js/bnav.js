// navbar bawah HP: penanda aktif, scroll halus, menu "Lainnya"
(function(){
 var bn=document.getElementById('bn');if(!bn)return;
 var bs=document.getElementById('bs'),bd=document.getElementById('bsBd'),mb=document.getElementById('bnMore');
 var links=[].slice.call(document.querySelectorAll('#bn a,#bs .bs-g a'));
 var own={home:'home',about:'about',tentang:'about',alat:'about',journey:'journey',prestasi:'prestasi',proyek:'proyek',layanan:'layanan',lagu:'lagu',contact:'contact'};
 var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,t;
 function setSheet(o){
  clearTimeout(t);mb.setAttribute('aria-expanded',o);
  if(o){bs.hidden=false;bd.hidden=false;void bs.offsetWidth;bs.classList.add('in');bd.classList.add('in')}
  else{bs.classList.remove('in');bd.classList.remove('in');t=setTimeout(function(){bs.hidden=true;bd.hidden=true},rm?0:350)}
 }
 mb.addEventListener('click',function(){setSheet(bs.hidden)});
 bd.addEventListener('click',function(){setSheet(false)});
 addEventListener('keydown',function(e){if(e.key==='Escape'&&!bs.hidden)setSheet(false)});
 links.forEach(function(a){a.addEventListener('click',function(e){
  e.preventDefault();var el=document.querySelector(a.getAttribute('href'));if(!el)return;
  if(!bs.hidden)setSheet(false);
  var r=el.getBoundingClientRect(),y=scrollY+r.top;
  if(el.classList.contains('pin'))y+=(r.height-innerHeight)*.55;
  scrollTo({top:y,behavior:rm?'auto':'smooth'});
 })});
 function spy(){
  var cur='home';
  for(var id in own){var e=document.getElementById(id);if(e&&e.getBoundingClientRect().top<=innerHeight*.45)cur=own[id]}
  var inMore=false;
  links.forEach(function(a){var on=a.getAttribute('data-s')===cur;a.classList.toggle('on',on);if(on){a.setAttribute('aria-current','location');if(a.closest('#bs'))inMore=true}else a.removeAttribute('aria-current')});
  mb.classList.toggle('on',inMore);
 }
 addEventListener('scroll',spy,{passive:true});addEventListener('resize',spy);spy();
 // tombol mode malam & musik: teruskan ke tombol asli di navbar atas, lalu sinkronkan tampilannya
 var tg=document.getElementById('tg'),mus=document.getElementById('mus'),bt=document.getElementById('bsTg'),bm=document.getElementById('bsMus');
 function sync(){
  var dark=document.documentElement.getAttribute('data-theme')==='dark';
  bt.classList.toggle('on',dark);bt.querySelector('span').textContent=dark?'Mode pagi':'Mode malam';
  var p=mus&&mus.classList.contains('on');
  bm.classList.toggle('on',p);bm.querySelector('span').textContent=p?'Jeda musik':'Putar musik';
 }
 if(tg)bt.addEventListener('click',function(){tg.click();setTimeout(sync,30)});
 if(mus)bm.addEventListener('click',function(){mus.click();setTimeout(sync,30)});
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 if(mus)new MutationObserver(sync).observe(mus,{attributes:true,attributeFilter:['class']});
 sync();
})();
