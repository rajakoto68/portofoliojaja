// Ubah data pribadimu di sini
const CFG={name:'M Raja Siyo',ig:'https://www.instagram.com/jafrikoto_/',wa:'https://wa.me/6288708759325'};
document.title='Portofolio '+CFG.name;
document.querySelectorAll('[data-name]').forEach(e=>e.textContent=CFG.name);
document.querySelectorAll('[data-link]').forEach(a=>{a.href=CFG[a.dataset.link];a.target='_blank';a.rel='noopener'});
// bunga matahari (foto assets/bunga.webp)
document.querySelectorAll('.flw').forEach(f=>f.innerHTML='<span class="bl"><img src="assets/bunga.webp" alt=""></span>');
// nama raksasa muat lebar layar
const big=document.getElementById('big'),bn=document.getElementById('bigname');
function fit(){const m=innerWidth<700,w=CFG.name.split(' ');if(m&&w.length>1)bn.innerHTML=w.slice(0,-1).join(' ')+'<br>'+w[w.length-1];else bn.textContent=CFG.name;big.style.fontSize='100px';const tw=bn.getBoundingClientRect().width||1;big.style.fontSize=Math.min(innerWidth*(m?1.02:1.06)/tw*100,innerHeight*(m?.19:.36))+'px'}
fit();addEventListener('resize',fit);document.fonts&&document.fonts.ready.then(fit);
// paralaks mouse di hero
const hero=document.getElementById('home'),abt=document.getElementById('about');let tx=0,ty=0,cx=0,cy=0;
addEventListener('pointermove',e=>{tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1});
// animasi scroll: set --s (progres pin) dan --v (progres lewat layar)
const cl=x=>Math.min(1,Math.max(0,x)),secs=[...document.querySelectorAll('[data-sc]')].map(el=>({el,s:0,v:0}));
if(matchMedia('(prefers-reduced-motion:reduce)').matches){secs.forEach(o=>{o.el.style.setProperty('--s',0);o.el.style.setProperty('--v',.5)})}
else{
 // loop animasi hanya jalan saat ada gerakan (scroll / mouse / easing belum selesai), lalu tidur -> ringan
 let run=false;const E=.0005;
 const put=(el,k,v)=>{const c=el._c||(el._c={});if(c[k]!==v){c[k]=v;el.style.setProperty(k,v)}};
 const wake=()=>{if(!run){run=true;requestAnimationFrame(tick)}};
 function tick(){
  const vh=innerHeight;let moving=false;
  cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
  if(Math.abs(tx-cx)>E||Math.abs(ty-cy)>E)moving=true;
  const mx=cx.toFixed(3),my=cy.toFixed(3);
  put(hero,'--mx',mx);put(hero,'--my',my);put(abt,'--mx',mx);put(abt,'--my',my);
  secs.forEach(o=>{const r=o.el.getBoundingClientRect();if(r.bottom<-300||r.top>vh+300)return;
   const ts=cl(-r.top/Math.max(r.height-vh,vh*.8)),tv=cl((vh-r.top)/(vh+r.height));
   o.s+=(ts-o.s)*.15;o.v+=(tv-o.v)*.15;
   if(Math.abs(ts-o.s)>E||Math.abs(tv-o.v)>E)moving=true;
   put(o.el,'--s',o.s.toFixed(4));put(o.el,'--v',o.v.toFixed(4))});
  if(moving)requestAnimationFrame(tick);else run=false;
 }
 addEventListener('scroll',wake,{passive:true});addEventListener('pointermove',wake,{passive:true});addEventListener('resize',wake);
 wake();
}
// filter proyek
const pb=document.querySelectorAll('.pills button');
pb.forEach(b=>b.onclick=()=>{pb.forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.grid .c').forEach(c=>c.classList.toggle('off',b.dataset.f!=='all'&&c.dataset.t!==b.dataset.f))});
// musik (diputar saat tombol diklik)
const au=new Audio('assets/shape-of-my-heart.mp3'),mb=document.getElementById('mus');au.loop=false;au.volume=.45;window.au=au;
const mlb=mb.querySelector('.lb');au.onplay=()=>{mb.classList.add('on');mb.setAttribute('aria-label','Jeda musik');if(mlb)mlb.textContent='Jeda musik'};au.onpause=()=>{mb.classList.remove('on');mb.setAttribute('aria-label','Putar musik');if(mlb)mlb.textContent='Putar musik'};
mb.onclick=()=>au.paused?au.play():au.pause();
// efek suara klik: sfx-klik untuk semua klik, sfx-aksi untuk tombol utama (Hubungi, Ayo terhubung, Lihat proyek, filter)
const sfx=(src,vol)=>{const pool=[0,1,2,3].map(()=>{const a=new Audio(src);a.preload='auto';a.volume=vol;return a});let i=0;return()=>{const a=pool[i++%pool.length];a.currentTime=0;a.play().catch(()=>{})}};
const playKlik=sfx('assets/sfx-klik.mp3',.7),playAksi=sfx('assets/sfx-aksi.mp3',.7);
document.addEventListener('click',e=>{if(e.target.closest('#mus'))return;e.target.closest('.btn,.cta,.pills button,.sw')?playAksi():playKlik()});

// navbar: menu HP, klik ke bagian, penanda aktif, sembunyi saat scroll turun (laptop)
const nav=document.getElementById('nav');
const mbt=nav.querySelector('.more'),links=[...nav.querySelectorAll('.mn a')],ind=nav.querySelector('.ind');
const setOpen=o=>{nav.classList.toggle('open',o);mbt.setAttribute('aria-expanded',o);mbt.setAttribute('aria-label',o?'Tutup menu':'Buka menu');document.documentElement.classList.toggle('nav-open',o)};
const closeMenu=()=>setOpen(false);
mbt.onclick=()=>setOpen(!nav.classList.contains('open'));
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
addEventListener('resize',()=>{if(innerWidth>1100)closeMenu()});
let keep=0;
const goTo=sel=>{const t=document.querySelector(sel);if(!t)return;const r=t.getBoundingClientRect();let y=scrollY+r.top;if(t.classList.contains('pin'))y+=(r.height-innerHeight)*.55;keep=performance.now()+1500;nav.classList.remove('hd');scrollTo({top:y,behavior:'smooth'})};
links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();closeMenu();goTo(a.getAttribute('href'))}));

const own={home:'home',about:'about',tentang:'about',alat:'about',journey:'journey',prestasi:'prestasi',proyek:'proyek',layanan:'layanan',lagu:'lagu',contact:'contact'};
let lastY=scrollY;
function spy(){let cur='home';for(const id in own){const e=document.getElementById(id);if(e&&e.getBoundingClientRect().top<=innerHeight*.45)cur=own[id]}
 links.forEach(a=>{const on=a.getAttribute('href')==='#'+cur;a.classList.toggle('on',on);on?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current');a.parentElement.classList.toggle('on',on)});
 const act=nav.querySelector('.mn a.on');
 if(act&&ind&&act.offsetWidth){const li=act.parentElement;ind.style.setProperty('--ix',(li.offsetLeft+10)+'px');ind.style.setProperty('--iw',(li.offsetWidth-20)+'px');ind.classList.add('s')}else if(ind)ind.classList.remove('s');
 const y=scrollY;nav.classList.toggle('sm',y>40);
 const dy=y-lastY;if(Math.abs(dy)>6){if(y>260&&dy>0&&performance.now()>keep&&!nav.classList.contains('open'))nav.classList.add('hd');else if(dy<0)nav.classList.remove('hd');lastY=y}
 if(y<=40)nav.classList.remove('hd');
 const mx=document.documentElement.scrollHeight-innerHeight;nav.style.setProperty('--p',mx>0?Math.min(1,y/mx).toFixed(4):0)}
addEventListener('scroll',spy,{passive:true});addEventListener('resize',spy);spy();document.fonts&&document.fonts.ready.then(spy);
// angka prestasi menghitung naik
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,n=+el.dataset.n,t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1600);el.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString('id-ID');if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
document.querySelectorAll('[data-n]').forEach(e=>{e.textContent='0';io.observe(e)});

// ===== ganti wujud di hero: blob cair mengikuti mouse (pegas) + gelombang cair saat klik 2x =====
(function(){
const ph=document.querySelector('.ph'),img=document.getElementById('heroImg'),cv=document.getElementById('morph'),btn=document.getElementById('sw');
if(!ph||!img||!cv||!btn)return;
const SRC=['assets/hero.webp','assets/hero-2.webp'],LBL=['Ganti wujud','Kembali'];
const pics=SRC.map(s=>{const i=new Image();i.src=s;return i}),ready=()=>pics.every(i=>i.complete&&i.naturalWidth);
const ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let mode=0,state=0,gen=0,W=0,H=0,dpr=1,px=0,py=0,active=false,touchDown=false;// state: 0 diam, 1 blob ikut mouse, 2 gelombang ganti wujud
function size(){dpr=Math.min(devicePixelRatio||1,1.25);W=cv.offsetWidth;H=cv.offsetHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
size();addEventListener('resize',()=>{if(!state)size()});addEventListener('load',()=>{if(!state)size()});
const es=t=>.5-Math.cos(Math.PI*t)/2,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
function blob(cx,cy,rx,ry,rot,t,wob){
 const N=12,P=[],c=Math.cos(rot),s=Math.sin(rot);
 for(let i=0;i<N;i++){const a=i/N*Math.PI*2,k=1+wob*(Math.sin(t*2.1+i*1.7)+Math.sin(t*3.3+i*2.9))*.3,x=Math.cos(a)*rx*k,y=Math.sin(a)*ry*k;P.push([cx+x*c-y*s,cy+x*s+y*c])}
 const p=new Path2D(),m0=mid(P[0],P[1]);p.moveTo(m0[0],m0[1]);
 for(let i=1;i<=N;i++){const a=P[i%N],m=mid(a,P[(i+1)%N]);p.quadraticCurveTo(a[0],a[1],m[0],m[1])}
 p.closePath();return p;
}
function grad(x0,x1){const g=ctx.createLinearGradient(x0,0,x1===x0?x0+1:x1,0);g.addColorStop(0,'#ffd21a');g.addColorStop(.55,'#fff1a0');g.addColorStop(1,'#4a97ff');return g}
// garis tepi bercahaya tanpa shadowBlur (jauh lebih ringan)
function halo(p,x0,x1,lw){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 ctx.strokeStyle='rgba(255,196,0,.2)';ctx.lineWidth=lw*3;ctx.stroke(p);
 ctx.strokeStyle='rgba(255,208,30,.5)';ctx.lineWidth=lw*1.8;ctx.stroke(p);
 ctx.strokeStyle=grad(x0,x1);ctx.lineWidth=lw;ctx.stroke(p);ctx.restore()}
function begin(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.drawImage(pics[mode],0,0,W,H)}
function inside(R,target){ctx.save();ctx.clip(R);ctx.clearRect(0,0,W,H);ctx.drawImage(target,0,0,W,H);ctx.restore()}
function stop(){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);img.style.visibility='';state=0}
function toCanvas(){const r=cv.getBoundingClientRect();return[Math.min(W,Math.max(0,(px-r.left)/r.width*W)),Math.min(H,Math.max(0,(py-r.top)/r.height*H))]}
// ---- blob mengikuti mouse: lahir di titik mouse masuk, mengejar mouse dengan pegas, memanjang searah gerak, mengecil saat mouse pergi
const L={x:0,y:0,vx:0,vy:0,r:0,rot:0,hist:[],drops:[]};
function startLens(){
 if(reduce||!ready()||state)return;state=1;const g0=++gen,p0=toCanvas();
 L.x=p0[0];L.y=p0[1];L.vx=L.vy=0;L.r=0;L.hist=[];L.drops=[];img.style.visibility='hidden';let last=performance.now();
 (function f(now){if(g0!==gen)return;
  const dt=Math.min(.033,(now-last)/1000)||.016,t=now/1000;last=now;const tg=toCanvas();
  L.vx+=((tg[0]-L.x)*70-L.vx*12)*dt;L.vy+=((tg[1]-L.y)*70-L.vy*12)*dt;L.x+=L.vx*dt;L.y+=L.vy*dt;
  const sp=Math.hypot(L.vx,L.vy),st=Math.min(1,sp/(W*3));
  L.r+=((active?W*.12:0)-L.r)*(1-Math.exp(-dt*(active?8:6)));
  if(sp>W*.25){let d=Math.atan2(L.vy,L.vx)-L.rot;d=Math.atan2(Math.sin(d),Math.cos(d));L.rot+=d*Math.min(1,dt*14)}
  L.hist.unshift([L.x,L.y]);if(L.hist.length>24)L.hist.pop();
  begin();
  if(L.r>1.5){const U=new Path2D();
   for(let i=0;i<7;i++){const h=L.hist[Math.min(L.hist.length-1,i*3)],s=L.r*(1-i*.1);U.addPath(blob(h[0],h[1],s*(1+.55*st),s*(1-.25*st),L.rot,t+i*.5,.3))}
   halo(U,L.x-W*.2,L.x+W*.2,W*.012);inside(U,pics[1-mode])}
  if(sp>W*.9&&Math.random()<dt*30)L.drops.push({x:L.x,y:L.y,vx:L.vx*.25+(Math.random()-.5)*W*.3,vy:L.vy*.25+(Math.random()-.5)*W*.3,l:1,s:.4+Math.random()*.8});
  L.drops=L.drops.filter(d=>{d.l-=dt*1.8;if(d.l<=0)return false;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vx*=.92;d.vy*=.92;ctx.fillStyle='rgba(255,208,20,'+(.9*d.l).toFixed(2)+')';ctx.beginPath();ctx.arc(d.x,d.y,W*.012*d.s*d.l,0,7);ctx.fill();return true});
  if(!active&&L.r<1.5&&!L.drops.length){stop();return}
  requestAnimationFrame(f)})(last);
}
function setActive(n){if(n===active)return;active=n;if(n&&!state)startLens()}
function near(x,y){const r=cv.getBoundingClientRect(),m=60;return x>r.left-m&&x<r.right+m&&y>r.top-m&&y<r.bottom+m&&scrollY<innerHeight*.5}
addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(e.pointerType==='touch'&&!touchDown)return;setActive(near(px,py))});
ph.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;touchDown=true;px=e.clientX;py=e.clientY;setActive(true)});
['pointerup','pointercancel'].forEach(n=>addEventListener(n,e=>{if(e.pointerType!=='touch'||!touchDown)return;touchDown=false;setTimeout(()=>{if(!touchDown)setActive(false)},700)}));
document.documentElement.addEventListener('pointerleave',()=>setActive(false));
addEventListener('scroll',()=>{if(active&&scrollY>=innerHeight*.5)setActive(false)},{passive:true});
// ---- ganti total: gelombang cair turun (ke wujud 2) atau naik (kembali)
function morph(){
 if(state===2||!ready())return;const nx=1-mode,down=nx===1;
 const done=()=>{mode=nx;img.src=SRC[mode];btn.setAttribute('aria-pressed',!!mode);btn.lastChild.textContent=LBL[mode]};
 if(reduce){done();return}
 gen++;state=2;img.style.visibility='hidden';
 const T=1600,t0=performance.now(),drops=Array.from({length:12},()=>({x:Math.random()*W,o:Math.random(),s:.5+Math.random()*.8}));
 [img,cv].forEach(el=>el.animate([{scale:1},{scale:1.03,offset:.45},{scale:1}],{duration:T,easing:'ease-in-out'}));
 (function f(now){const p=Math.min(1,(now-t0)/T),u=es(p),t=now/1000,amp=H*.012+H*.05*Math.sin(Math.PI*p),lo=-amp*2.4-10,hi=H+amp*2.4+10,fy=down?lo+(hi-lo)*u:hi-(hi-lo)*u;
  const fr=x=>fy+amp*(Math.sin(x/W*5.2+t*7)*.6+Math.sin(x/W*11.5-t*5)*.4)+(x/W-.5)*H*.1*Math.sin(t*2.5);
  begin();
  const R=new Path2D(),F=new Path2D();
  R.moveTo(-30,down?-30:H+30);R.lineTo(W+30,down?-30:H+30);F.moveTo(W+30,fr(W+30));
  for(let x=W+30;x>=-30;x-=12){const y=fr(x);R.lineTo(x,y);F.lineTo(x,y)}R.closePath();
  inside(R,pics[nx]);
  halo(F,0,W,W*.012);ctx.save();ctx.strokeStyle='rgba(255,252,220,.95)';ctx.lineWidth=2;ctx.stroke(F);ctx.restore();
  const life=Math.min(1,p*8,(1-p)*8);
  drops.forEach(d=>{const k=(p*1.8+d.o)%1,ax=d.x+Math.sin(t*3+d.o*9)*W*.02,ay=fr(ax)+(down?1:-1)*k*H*.1,r=W*.017*d.s*(1-k)*life;if(r<.8)return;ctx.fillStyle='rgba(255,208,20,'+(.95*(1-k)).toFixed(2)+')';ctx.beginPath();ctx.arc(ax,ay,r,0,7);ctx.fill()});
  if(p<1)requestAnimationFrame(f);
  else{done();img.style.visibility='';(img.decode?img.decode():Promise.resolve()).catch(()=>{}).then(()=>requestAnimationFrame(()=>{stop();if(active)startLens()}))}})(t0);
}
btn.addEventListener('click',e=>{e.stopPropagation();morph()});
// klik 2x pada gambar -> ganti total (dan sebaliknya); di HP ketuk 2x
let lc=0;
ph.addEventListener('mousedown',e=>{if(e.detail>1)e.preventDefault()});
ph.addEventListener('click',()=>{const now=performance.now();if(now-lc<400){lc=0;morph()}else lc=now});
img.draggable=false;
})();

// mode pagi / malam
(()=>{const b=document.getElementById('tg'),r=document.documentElement;if(!b)return;
const cur=()=>r.getAttribute('data-theme')==='dark'?'dark':'light';
const upd=()=>{const d=cur()==='dark';b.setAttribute('aria-label',d?'Ganti ke mode pagi':'Ganti ke mode malam');b.title=d?'Mode pagi':'Mode malam';const tl=b.querySelector('.lb');if(tl)tl.textContent=d?'Mode pagi':'Mode malam';
 const m=document.querySelector('meta[name=theme-color]')||document.head.appendChild(Object.assign(document.createElement('meta'),{name:'theme-color'}));m.content=d?'#0e0d13':'#efede6'};
upd();
b.addEventListener('click',()=>{const n=cur()==='dark'?'light':'dark';r.classList.add('tt');r.setAttribute('data-theme',n);
 try{localStorage.setItem('tema',n)}catch(e){}upd();clearTimeout(b._t);b._t=setTimeout(()=>r.classList.remove('tt'),600)});
})();
