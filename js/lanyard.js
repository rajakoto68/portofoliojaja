/* Bet nama bertali: jatuh sendiri saat section About terlihat, lalu bisa ditarik
   ke segala arah dengan mouse / jari. Fisika: tali verlet elastis + kartu kaku. */
(()=>{
const stage=document.getElementById('lyd'),badge=document.getElementById('lybadge');
if(!stage||!badge)return;
const about=document.getElementById('about'),hint=document.getElementById('lyhint');
const pH=document.getElementById('sH');
const pA=document.getElementById('sA'),pA2=document.getElementById('sA2'),pB=document.getElementById('sB'),pB2=document.getElementById('sB2');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const PIVOT=13,G=.62,DAMP=.987,ITER=14;
// indeks titik: 0 pin kiri, 1-2 tali kiri, 3 sambungan J, 4-5 tali kanan, 6 pin kanan, 7 cincin klip C, 8 dasar kartu Q
const N=9,P=[],cons=[];
let W=300,H=480,cx=0,aY=0,bl=0,br=0,bb=0,jY=30,cyOff=36;
let running=false,dropped=false,dragging=false,still=0,last=0,acc=0,vis=false;
let mouse={x:0,y:0},grabT=.2,hinted=false;
const inv=[0,1,1,.8,1,1,0,.5,.35];

const mk=(x,y)=>({x,y,px:x,py:y});
const link=(a,b,k)=>{const dx=P[a].x-P[b].x,dy=P[a].y-P[b].y;cons.push({a,b,len:Math.hypot(dx,dy),k})};

function layout(){
  W=badge.offsetWidth;H=badge.offsetHeight-PIVOT*W/300;
  jY=Math.round(W*.2);cyOff=Math.round(W*.1);aY=8;       // tali pendek: menggantung dari batang kecil di atas bet
  stage.style.height=Math.round(aY+jY+cyOff+H+W*.2)+'px'; // tinggi area mengikuti ukuran bet
  const s=stage.getBoundingClientRect(),ab=about.getBoundingClientRect();
  cx=s.width/2;
  const vw=document.documentElement.clientWidth;
  bl=Math.max(-s.left,ab.left-s.left)+2;br=Math.min(vw-s.left,ab.right-s.left)-2;   // kartu tetap di dalam section
  bb=s.height+10;
  if(pH){const sp=SP();pH.setAttribute('x',(cx-sp-12).toFixed(1));pH.setAttribute('y',aY-5);pH.setAttribute('width',(sp*2+24).toFixed(1));pH.setAttribute('height',10)}
}
function rest(){                              // posisi diam menggantung
  P.length=0;cons.length=0;
  const sp=SP(),jy=jY+aY,cy=jy+cyOff;
  P[0]=mk(cx-sp,aY);P[6]=mk(cx+sp,aY);P[3]=mk(cx,jy);
  for(let i=1;i<=2;i++){const t=i/3;P[i]=mk(cx-sp*(1-t),aY+(jy-aY)*t);P[6-i]=mk(cx+sp*(1-t),aY+(jy-aY)*t)}
  P[7]=mk(cx,cy);P[8]=mk(cx,cy+H);
  buildCons();
}
function fold(){                              // posisi awal: kartu terbalik, tersembunyi di atas section
  rest();
  const top=aY+6;
  P[3].x=P[3].px=cx;P[3].y=P[3].py=top+4;
  for(let i=1;i<=2;i++){P[i].y=P[i].py=top+2;P[6-i].y=P[6-i].py=top+2;P[i].x=P[i].px=cx-sp2(i);P[6-i].x=P[6-i].px=cx+sp2(i)}
  P[7].x=P[7].px=cx;P[7].y=P[7].py=top-30;
  P[8].x=P[8].px=cx+H*.6;P[8].y=P[8].py=top-30-H*.8;   // miring supaya pasti berayun turun
  P[8].px-=4;                      // sedikit dorongan supaya berputar saat jatuh
}
const SP=()=>Math.max(30,W*.17),sp2=i=>SP()*(1-i/3);
function buildCons(){
  link(0,1,.38);link(1,2,.38);link(2,3,.38);link(6,5,.38);link(5,4,.38);link(4,3,.38);
  link(3,7,.5);link(7,8,1);
  // beri sedikit kelonggaran supaya bisa ditarik ke bawah (elastis)
  cons.forEach(c=>{if(c.k<1)c.len*=1.02});
}
function step(){
  for(let i=0;i<N;i++){
    if(!inv[i])continue;
    const p=P[i];let vx=(p.x-p.px)*DAMP,vy=(p.y-p.py)*DAMP;
    const m=Math.hypot(vx,vy);if(m>46){vx*=46/m;vy*=46/m}
    p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+G;
  }
  if(!dragging&&P[8].y>P[7].y+H*.2){        // redaman putaran: kecepatan relatif Q terhadap C dikurangi
    const C=P[7],Q=P[8],rvx=(Q.x-Q.px)-(C.x-C.px),rvy=(Q.y-Q.py)-(C.y-C.py),k=.035;
    Q.px+=rvx*k;Q.py+=rvy*k;
  }
  for(let it=0;it<ITER;it++){
    if(dragging){
      const C=P[7],Q=P[8],gx=C.x+(Q.x-C.x)*grabT,gy=C.y+(Q.y-C.y)*grabT;
      const dx=mouse.x-gx,dy=mouse.y-gy,f=.22;
      C.x+=dx*(1-grabT)*f*2;C.y+=dy*(1-grabT)*f*2;Q.x+=dx*grabT*f*2;Q.y+=dy*grabT*f*2;
    }
    for(const c of cons){
      const a=P[c.a],b=P[c.b];let dx=b.x-a.x,dy=b.y-a.y;const d=Math.hypot(dx,dy)||1e-4;
      const w=inv[c.a]+inv[c.b];if(!w)continue;
      const df=(d-c.len)/d*c.k/w;
      a.x+=dx*df*inv[c.a];a.y+=dy*df*inv[c.a];b.x-=dx*df*inv[c.b];b.y-=dy*df*inv[c.b];
    }
    for(const i of [3,7,8]){                  // batas gerak (inelastis: kecepatan ikut dimatikan)
      const p=P[i],m=i===3?20:W*.5;
      if(p.y>aY+24){
        const nx=Math.min(br-m,Math.max(bl+m,p.x));
        if(nx!==p.x){p.x=nx;p.px=nx}
      }
      if(p.y>bb){p.y=bb;p.py=bb}
    }
    for(const i of [1,2,4,5]){P[i].x=Math.min(br,Math.max(bl,P[i].x))}
  }
}
const mid=(a,b)=>[(a.x+b.x)/2,(a.y+b.y)/2];
function pathOf(ix){
  const pts=ix.map(i=>P[i]);let d=`M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for(let i=1;i<pts.length-1;i++){const m=mid(pts[i],pts[i+1]);d+=`Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`}
  const e=pts[pts.length-1];return d+`L${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}
function render(){
  const C=P[7],Q=P[8],th=Math.atan2(-(Q.x-C.x),(Q.y-C.y));
  const pv=PIVOT*W/300;badge.style.transformOrigin=`${W/2}px ${pv}px`;
  badge.style.transform=`translate(${(C.x-W/2).toFixed(2)}px,${(C.y-pv).toFixed(2)}px) rotate(${th.toFixed(4)}rad)`;
  badge.style.setProperty('--tilt',(th*57.3*2).toFixed(1));
  badge.style.setProperty('--gl',Math.min(1,Math.abs(C.x-C.px)/6+Math.abs(th)*2).toFixed(2));
  const dA=pathOf([0,1,2,3,7]),dB=pathOf([6,5,4,3,7]);
  pA.setAttribute('d',dA);pA2.setAttribute('d',dA);pB.setAttribute('d',dB);pB2.setAttribute('d',dB);
}
function energy(){let e=0;for(const i of [3,7,8]){e+=Math.abs(P[i].x-P[i].px)+Math.abs(P[i].y-P[i].py)}return e}
let stuck=0;
function loop(t){
  if(!running)return;
  const dt=Math.min(64,t-(last||t));last=t;acc+=dt;
  let n=0;while(acc>=16.67&&n<4){step();acc-=16.67;n++}
  if(n===4)acc=0;
  render();
  // jaring pengaman: kartu terbalik & diam -> dorong supaya jatuh ke posisi menggantung
  if(!dragging&&P[8].y<P[7].y-H*.5&&energy()<.6){if(++stuck>20){P[8].px-=(P[8].x>=P[7].x?-1:1)*-6;P[8].px+=0;stuck=0}}else stuck=0;
  if(!dragging&&energy()<.05&&P[8].y>P[7].y){if(++still>70){running=false;last=0;return}}else still=0;
  requestAnimationFrame(loop);
}
function wake(){if(!running&&vis&&dropped){running=true;still=0;last=0;requestAnimationFrame(loop)}}

function toStage(e){const s=stage.getBoundingClientRect();return{x:e.clientX-s.left,y:e.clientY-s.top}}
badge.addEventListener('pointerdown',e=>{
  if(!dropped||e.button>0)return;
  const m=toStage(e),C=P[7],Q=P[8],ax=Q.x-C.x,ay=Q.y-C.y,L=Math.hypot(ax,ay)||1;
  grabT=Math.min(1,Math.max(0,((m.x-C.x)*ax+(m.y-C.y)*ay)/(L*L)));
  mouse=m;dragging=true;badge.classList.add('drag');badge.setPointerCapture(e.pointerId);
  if(hint){hint.classList.remove('on');hinted=true}
  try{playKlik()}catch(_){}
  wake();e.preventDefault();
});
badge.addEventListener('pointermove',e=>{if(dragging){mouse=toStage(e);wake()}});
const release=e=>{if(!dragging)return;dragging=false;badge.classList.remove('drag');try{badge.releasePointerCapture(e.pointerId)}catch(_){}wake()};
badge.addEventListener('pointerup',release);badge.addEventListener('pointercancel',release);
badge.addEventListener('lostpointercapture',release);
badge.addEventListener('dragstart',e=>e.preventDefault());
badge.addEventListener('keydown',e=>{      // aksesibilitas: dorong dengan tombol panah
  const k={ArrowLeft:[-9,0],ArrowRight:[9,0],ArrowDown:[0,6],ArrowUp:[0,-6]}[e.key];
  if(!k)return;P[8].px-=k[0];P[8].py-=k[1];P[7].px-=k[0]*.5;P[7].py-=k[1]*.5;wake();e.preventDefault();
});
badge.tabIndex=0;

function init(){
  layout();
  if(reduce||dropped){rest();dropped=true;badge.classList.add('on');render();return}
  fold();render();
}
function drop(){
  if(dropped)return;dropped=true;badge.classList.add('on');wake();
  setTimeout(()=>{if(!hinted&&hint)hint.classList.add('on')},2600);
}
let rz,lastW=innerWidth;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{
  if(innerWidth===lastW){layout();wake();return}   // HP: bar alamat naik-turun hanya ubah tinggi, jangan reset
  lastW=innerWidth;const was=dropped;layout();rest();if(was)badge.classList.add('on');render();wake()},150)});
document.fonts&&document.fonts.ready.then(()=>{layout();if(!dropped)fold();render()});
init();
new IntersectionObserver(es=>es.forEach(e=>{
  vis=e.isIntersecting;
  if(vis){ if(!dropped&&e.intersectionRatio>=.3){drop()} else if(dropped){wake()} }
}),{threshold:[0,.3]}).observe(stage);
})();
