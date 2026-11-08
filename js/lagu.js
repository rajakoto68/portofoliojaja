/* =========================================================
   MY FAV SONG  →  grid cover + lirik berjalan + bar pemutar
   Data lagu ada di js/data-lagu.js
   ========================================================= */
(function(){
  const root=document.getElementById('lagu'),T=window.DATA_LAGU||[];
  if(!root||!T.length)return;
  const $=s=>root.querySelector(s);
  const stage=$('#mpStage'),starsEl=$('.mp-stars'),
        lp=$('#mpLyr .mp-lp'),lc=$('#mpLyr .mp-lc'),ln=$('#mpLyr .mp-ln'),
        mini=$('#mpMini'),tt=$('#mpT'),ta=$('#mpA'),
        bPrev=$('#mpPrev'),bPlay=$('#mpPlay'),bNext=$('#mpNext'),
        seek=$('#mpSeek'),tm=$('#mpTime'),cnt=$('#mpCount'),head=$('.mp-head');
  const A=window.au||new Audio();
  A.loop=false;A.preload='metadata';
  if(cnt)cnt.textContent='♫  '+T.length+' LAGU';

  const NOTE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>';
  const PL='<svg class="i-pl" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
        PA='<svg class="i-pa" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  const S=1.55,GU=.22,R=1.5,TMAX=104;   // R = tinggi/lebar kotak (rasio 2:3)
  const fmt=s=>isFinite(s)&&s>0?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
  const hue=i=>(i*47+212)%360;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- cover (kotak kosong berwarna kalau gambar belum ada) ---------- */
  function cover(i,withNote){
    const d=document.createElement('span');d.className='mp-cv';d.style.setProperty('--h',hue(i));
    if(withNote!==false)d.innerHTML=NOTE;
    if(T[i].cover){
      const im=new Image();im.alt='';im.decoding='async';
      im.onload=()=>im.classList.add('ok');im.onerror=()=>im.remove();
      im.src=T[i].cover;d.appendChild(im);
    }
    return d;
  }

  /* ---------- gelombang di belakang cover tengah ---------- */
  ['r1','r2','bx'].forEach(c=>{const r=document.createElement('span');r.className='mp-ring '+c;r.setAttribute('aria-hidden','true');stage.appendChild(r)});
  const burst=stage.querySelector('.mp-ring.bx');

  /* ---------- slot grid ---------- */
  const N=T.length;let kNeed=1;while(3*(2*kNeed+1)-1<N-1)kNeed++;let k=kNeed;
  const slotOf=new Array(N).fill(0);   // -1 = tengah
  slotOf[0]=-1;for(let i=1;i<N;i++)slotOf[i]=i-1;
  let sel=0;

  const tiles=T.map((tr,i)=>{
    const b=document.createElement('button');b.type='button';b.className='mp-tile';b.style.setProperty('--i',i);
    b.setAttribute('aria-label','Putar '+tr.judul+' - '+tr.artis);
    b.appendChild(cover(i));
    const lab=document.createElement('span');lab.className='mp-lab';lab.textContent=tr.judul;b.appendChild(lab);
    const hv=document.createElement('span');hv.className='mp-hov';hv.setAttribute('aria-hidden','true');
    hv.innerHTML=PL+PA;
    const hb=document.createElement('b');hb.textContent=tr.judul;const hs=document.createElement('small');hs.textContent=tr.artis;hv.append(hb,hs);
    b.appendChild(hv);
    b.onclick=()=>{if(i===sel){A.paused?play():A.pause()}else choose(i,true)};
    stage.appendChild(b);return b;
  });

  let slots=[];const ghosts=[];
  function layout(){
    const avail=Math.max(240,stage.clientWidth);
    k=avail>=560?Math.max(2,kNeed):kNeed;
    const coef=2*((S+1)/2+GU+(k-1)*(1+GU))+1;
    // tinggi yang dipakai elemen lain (judul, lirik, bar, padding) → ukur langsung supaya pas di semua layar
    const cs=getComputedStyle(root),pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
    const hh=head?head.offsetHeight+parseFloat(getComputedStyle(head).marginBottom):0;
    const ly=$('#mpLyr').offsetHeight,bh=$('#mpBar').offsetHeight;
    const reserve=pad+hh+ly+bh+14;
    const vertCoef=R*(S+2)+2*GU-.5;       // -.5 : lirik menumpuk setengah tile ke grid
    const t=Math.min(TMAX,avail/coef,Math.max(46,(innerHeight-reserve)/vertCoef));
    const dx=((S+1)/2+GU)*t,dy=(R*(S+1)/2+GU)*t,step=(1+GU)*t;
    stage.style.setProperty('--t',t.toFixed(1)+'px');
    root.style.setProperty('--t',t.toFixed(1)+'px');
    stage.style.height=((R*(S+2)+2*GU)*t).toFixed(1)+'px';
    slots=[];
    for(let r=-1;r<=1;r++)for(let c=-k;c<=k;c++){
      if(!r&&!c)continue;
      slots.push({x:c?Math.sign(c)*(dx+(Math.abs(c)-1)*step):0,y:r*dy});
    }
    slots.sort((a,b)=>(a.x*a.x+a.y*a.y)-(b.x*b.x+b.y*b.y)||Math.atan2(a.y,a.x)-Math.atan2(b.y,b.x));
    ghosts.forEach(g=>g.remove());ghosts.length=0;
    for(let s=N-1;s<slots.length;s++){
      const g=document.createElement('span');g.className='mp-tile mp-ghost';g.setAttribute('aria-hidden','true');g.style.setProperty('--i',s);
      g.style.setProperty('--x',slots[s].x.toFixed(1)+'px');g.style.setProperty('--y',slots[s].y.toFixed(1)+'px');
      const cv=document.createElement('span');cv.className='mp-cv';cv.innerHTML=NOTE;g.appendChild(cv);
      stage.appendChild(g);ghosts.push(g);
    }
    place();
  }
  function place(){
    tiles.forEach((b,i)=>{
      const c=slotOf[i]<0,s=slots[slotOf[i]]||{x:0,y:0};
      b.classList.toggle('mp-center',c);
      b.style.setProperty('--x',(c?0:s.x).toFixed(1)+'px');
      b.style.setProperty('--y',(c?0:s.y).toFixed(1)+'px');
      b.style.setProperty('--sc',c?S:1);
      b.style.zIndex=c?3:1;
    });
  }

  /* ---------- lirik ---------- */
  const cache={};
  function parse(i){
    const dur=A.duration||0,key=i+':'+(dur?1:0);
    if(cache[key])return cache[key];
    const raw=(T[i].lrc||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    const timed=[],plain=[];
    raw.forEach(line=>{
      if(/^\[(?!\d+:\d)[^\]]*\]$/.test(line))return;         // [ar:..] [Verse 1] [Chorus] dll
      const tags=[];let rest=line,m;
      while((m=/^\[(\d+):(\d+(?:[.:]\d+)?)\]/.exec(rest))){tags.push(+m[1]*60+parseFloat(m[2].replace(':','.')));rest=rest.slice(m[0].length)}
      rest=rest.trim();
      tags.length?tags.forEach(t=>timed.push({t,l:rest})):plain.push(rest);
    });
    let out=[];
    if(timed.length)out=timed.sort((a,b)=>a.t-b.t);
    else if(plain.length&&dur){            // tanpa waktu: dibagi rata menurut panjang baris (perkiraan)
      const w=plain.map(l=>Math.max(14,l.length)),tot=w.reduce((a,b)=>a+b,0),a0=dur*.06,span=dur*.88;let acc=0;
      out=plain.map((l,n)=>{const t=a0+acc/tot*span;acc+=w[n];return{t,l}});
    }
    if(plain.length&&!timed.length&&!dur)return [];            // tunggu durasi
    return cache[key]=out;
  }
  const clearCache=i=>{delete cache[i+':0'];delete cache[i+':1']};

  /* lirik berwaktu otomatis (LRCLIB). Hanya dipakai kalau kolom lrc di data-lagu.js masih kosong.
     Matikan dengan: window.LIRIK_OTOMATIS=false di data-lagu.js */
  function fetchLyrics(i){
    const tr=T[i];
    if(tr.lrc||tr._f||window.LIRIK_OTOMATIS===false||!tr.artis||/^artis$/i.test(tr.artis))return;
    tr._f=1;
    const key='lrc3:'+tr.judul+'|'+tr.artis;
    try{const c=localStorage.getItem(key);if(c){tr.lrc=c;clearCache(i);if(i===sel)lyr(true);return}}catch(e){}
    const q=new URLSearchParams({track_name:tr.judul.replace(/\s*[\(\[].*?[\)\]]/g,'').trim(),artist_name:tr.artis});
    fetch('https://lrclib.net/api/search?'+q.toString())
      .then(r=>r.ok?r.json():Promise.reject(r.status))
      .then(list=>{
        const d=A.duration||0;
        const best=(list||[]).filter(x=>x&&x.syncedLyrics)
          .sort((a,b)=>Math.abs((a.duration||0)-d)-Math.abs((b.duration||0)-d))[0];
        if(best){tr.lrc=best.syncedLyrics;clearCache(i);try{localStorage.setItem(key,tr.lrc)}catch(e){}}
        else tr._none=1;
        if(i===sel)lyr(true);
      })
      .catch(()=>{tr._f=0;tr._err=1;if(i===sel)lyr(true)});
  }

  let lastKey='',words=[],wOn=-1,t0=0,t1=0;
  const offs=()=>T[sel].offset||0;
  function setCur(txt,cls){
    lc.className=cls||'mp-lc';lc.textContent='';words=[];wOn=-1;
    if(cls&&cls.indexOf('kosong')>-1){lc.textContent=txt;return}
    txt.split(/\s+/).filter(Boolean).forEach((w,n,a)=>{
      const s=document.createElement('span');s.className='w';s.textContent=w+(n<a.length-1?' ':'');lc.appendChild(s);words.push(s);
    });
  }
  function lyr(force){
    const arr=parse(sel),time=(A.currentTime||0)+offs();
    let idx=-1;
    for(let n=0;n<arr.length;n++){if(arr[n].t<=time+.15)idx=n;else break}
    const tr=T[sel],st=!arr.length?(tr._none?'n':tr._err?'e':tr._f&&!tr.lrc?'l':'0'):'';
    const key=sel+':'+idx+':'+arr.length+':'+st;
    if(!force&&key===lastKey)return;lastKey=key;
    if(!arr.length){
      lp.textContent='';ln.textContent='';
      const msg=st==='l'?'Mencari lirik…':st==='n'||st==='e'?'Lirik belum tersedia':'Lirik belum ditambahkan';
      setCur(msg,'mp-lc kosong');
      replay();return;
    }
    const g=n=>arr[n]?(arr[n].l||'♪'):'';
    lp.textContent=idx>0?g(idx-1):'';
    setCur(idx<0?'♪':g(idx));
    ln.textContent=g(idx+1);
    t0=idx<0?0:arr[idx].t;t1=arr[idx+1]?arr[idx+1].t:(A.duration||t0+5);
    
    replay();prog();
  }
  /* nyalakan kata demi kata mengikuti posisi lagu */
  function prog(){
    if(!words.length)return;
    const time=(A.currentTime||0)+offs(),n=words.length;
    const span=Math.max(.8,Math.min(t1-t0,Math.max(1.4,n*.42)));
    const on=Math.min(n,Math.max(0,Math.floor((time-t0)/span*n)+1));
    if(on===wOn)return;wOn=on;
    for(let i=0;i<n;i++)words[i].classList.toggle('on',i<on);
  }
  function replay(){lc.style.animation='none';void lc.offsetWidth;lc.style.animation=''}

  /* ---------- pemilihan & pemutaran ---------- */
  let curSrc='',fTimer=0;
  function load(){const s=T[sel].src;if(curSrc!==s){curSrc=s;A.src=s;A.load()}}
  function info(){
    const tr=T[sel];
    tt.textContent=tr.judul;ta.textContent=tr.artis;
    mini.replaceChildren(cover(sel,false));
    seek.value=0;seek.style.setProperty('--p','0%');tm.textContent='0:00';
    if('mediaSession' in navigator){
      const art=tr.cover?[{src:tr.cover}]:[];
      try{navigator.mediaSession.metadata=new MediaMetadata({title:tr.judul,artist:tr.artis,artwork:art})}catch(e){}
    }
  }
  function choose(j,andPlay){
    j=(j+N)%N;
    if(j!==sel){
      const old=sel;slotOf[old]=slotOf[j];slotOf[j]=-1;sel=j;place();
      if(!reduce){                                  // efek: cover baru "mekar" + gelombang memancar
        const cv=tiles[j].querySelector('.mp-cv');cv.classList.remove('pop');void cv.offsetWidth;cv.classList.add('pop');
        burst.classList.remove('go');void burst.offsetWidth;burst.classList.add('go');
      }
    }
    load();info();lastKey='';lyr(true);
    clearTimeout(fTimer);fTimer=setTimeout(()=>fetchLyrics(sel),1800);
    if(andPlay)play();
  }
  function play(){load();const p=A.play();if(p&&p.catch)p.catch(()=>{})}
  const next=a=>choose(sel+1,a),prev=()=>{if(A.currentTime>3){A.currentTime=0}else choose(sel-1,true)};

  bPlay.onclick=()=>A.paused?play():A.pause();
  bNext.onclick=()=>next(true);
  bPrev.onclick=prev;
  A.addEventListener('ended',()=>next(true));
  let raf=0;
  function loop(){lyr();prog();raf=A.paused?0:requestAnimationFrame(loop)}
  const st=()=>{const pl=!A.paused;root.classList.toggle('playing',pl);if(pl&&!raf)raf=requestAnimationFrame(loop)};
  ['play','pause','playing','emptied'].forEach(e=>A.addEventListener(e,st));
  A.addEventListener('loadedmetadata',()=>{tm.textContent='0:00 / '+fmt(A.duration);lastKey='';fetchLyrics(sel);lyr(true)});
  A.addEventListener('timeupdate',()=>{
    const p=A.duration?A.currentTime/A.duration*1000:0;
    if(!seek.matches(':active'))seek.value=p;
    seek.style.setProperty('--p',(p/10).toFixed(2)+'%');
    tm.textContent=fmt(A.currentTime)+' / '+fmt(A.duration);
    if(!raf)lyr();
  });
  seek.oninput=()=>{if(A.duration){A.currentTime=seek.value/1000*A.duration;seek.style.setProperty('--p',(seek.value/10)+'%');lyr()}};
  if('mediaSession' in navigator){
    try{
      navigator.mediaSession.setActionHandler('play',play);
      navigator.mediaSession.setActionHandler('pause',()=>A.pause());
      navigator.mediaSession.setActionHandler('previoustrack',prev);
      navigator.mediaSession.setActionHandler('nexttrack',()=>next(true));
    }catch(e){}
  }

  /* ---------- bintang ---------- */
  const NS=window.innerWidth<700?70:120;
  for(let i=0;i<NS;i++){
    const s=document.createElement('i'),z=Math.random()<.14?3:Math.random()<.5?2:1.4;
    s.style.cssText='left:'+(Math.random()*100).toFixed(2)+'%;top:'+(Math.random()*100).toFixed(2)+'%;width:'+z+'px;height:'+z+'px;--d:'+(2.4+Math.random()*4.6).toFixed(1)+'s;--dl:-'+(Math.random()*6).toFixed(1)+'s';
    starsEl.insertBefore(s,starsEl.firstChild);
  }

  /* ---------- mulai ---------- */
  layout();info();lyr(true);
  curSrc=A.getAttribute('src')===T[0].src?T[0].src:'';load();
  let rz;addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(layout)});
  addEventListener('orientationchange',()=>setTimeout(layout,250));
  document.fonts&&document.fonts.ready.then(layout);
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){root.classList.add('in');setTimeout(()=>root.classList.add('ready'),2600);io.disconnect()}},{threshold:.25});
    io.observe(root);
  }else{root.classList.add('in','ready')}
})();
