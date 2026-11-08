/* Komputer 3D di bagian Coding — murni CSS 3D + JS, tanpa library */
(function () {
  const root = document.getElementById('pc3d');
  if (!root) return;
  const stage = root.querySelector('.pc3d-stage');
  const scene = root.querySelector('.pc3d-scene');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const H = 470;

  /* ---------- helper ---------- */
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
    return 'rgb(' + c(n >> 16) + ',' + c((n >> 8) & 255) + ',' + c(n & 255) + ')';
  }
  function box(o) {
    const el = document.createElement('div');
    el.className = 'bx';
    el.style.transform = 'translate3d(' + o.x + 'px,' + o.y + 'px,' + o.z + 'px)';
    const c = o.c || '#18181b', w = o.w, h = o.h, d = o.d;
    const defs = {
      f: [w, h, 0, 0, 'translateZ(' + d / 2 + 'px)', c],
      b: [w, h, 0, 0, 'rotateY(180deg) translateZ(' + d / 2 + 'px)', shade(c, .7)],
      r: [d, h, (w - d) / 2, 0, 'rotateY(90deg) translateZ(' + w / 2 + 'px)', shade(c, .8)],
      l: [d, h, (w - d) / 2, 0, 'rotateY(-90deg) translateZ(' + w / 2 + 'px)', shade(c, .62)],
      t: [w, d, 0, (h - d) / 2, 'rotateX(90deg) translateZ(' + h / 2 + 'px)', o.ct || shade(c, 1.4)],
      u: [w, d, 0, (h - d) / 2, 'rotateX(-90deg) translateZ(' + h / 2 + 'px)', shade(c, .5)]
    };
    const faces = {};
    for (const k in defs) {
      const a = defs[k], f = document.createElement('i');
      f.style.cssText = 'width:' + a[0] + 'px;height:' + a[1] + 'px;left:' + (a[2] - w / 2 + (k === 'r' || k === 'l' ? 0 : 0)) + 'px;top:' +
        (a[3] - h / 2) + 'px;transform:' + a[4] + ';background:' + a[5];
      el.appendChild(f);
      faces[k] = f;
    }
    // posisi wajah diukur dari pusat kotak
    faces.f.style.left = -w / 2 + 'px'; faces.f.style.top = -h / 2 + 'px';
    faces.b.style.left = -w / 2 + 'px'; faces.b.style.top = -h / 2 + 'px';
    faces.r.style.left = -d / 2 + 'px'; faces.r.style.top = -h / 2 + 'px';
    faces.l.style.left = -d / 2 + 'px'; faces.l.style.top = -h / 2 + 'px';
    faces.t.style.left = -w / 2 + 'px'; faces.t.style.top = -d / 2 + 'px';
    faces.u.style.left = -w / 2 + 'px'; faces.u.style.top = -d / 2 + 'px';
    el._f = faces;
    scene.appendChild(el);
    return el;
  }

  /* ---------- isi kode di layar ---------- */
  const FILES = {
    html: { name: 'index.html', lang: 'html', code: [
      '<!DOCTYPE html>', '<html lang="id">', '<head>', '  <title>Portofolio</title>',
      '  <link rel="stylesheet" href="style.css">', '</head>', '<body>', '  <h1 class="judul">Halo, aku Raja</h1>',
      '  <script src="app.js"></script>', '</body>'] },
    css: { name: 'style.css', lang: 'css', code: [
      '/* tampilan beranda */', '.hero {', '  display: grid;', '  place-items: center;', '  min-height: 100vh;',
      '  background: #0e0d13;', '}', '.btn:hover {', '  transform: translateY(-2px);', '}'] },
    js: { name: 'app.js', lang: 'js', code: [
      '// daftar proyek terbaru', 'const proyek = ["Kasir", "Portofolio"];', '', 'function sapa(nama) {',
      '  return `Halo, ${nama}!`;', '}', '', 'proyek.forEach((p) => {', '  console.log(sapa(p));', '});'] },
    php: { name: 'api.php', lang: 'php', code: [
      '<?php', '// ambil menu dari database', '$db = new mysqli("localhost", "root", "", "toko");',
      '$hasil = $db->query("SELECT * FROM menu");', '', 'while ($row = $hasil->fetch_assoc()) {',
      '  echo $row["nama"];', '}', '?>'] },
    py: { name: 'main.py', lang: 'py', code: [
      '# hitung proyek yang sudah jadi', 'data = {"web": 5, "kasir": 2}', '', 'for nama, jumlah in data.items():',
      '    print(f"{nama}: {jumlah}")', '', 'def total(d):', '    return sum(d.values())', '', 'print(total(data))'] },
    sql: { name: 'query.sql', lang: 'sql', code: [
      '-- menu yang masih ada stok', 'SELECT nama, harga', 'FROM menu', 'WHERE stok > 0', 'ORDER BY harga DESC',
      'LIMIT 10;'] }
  };
  const RULES = {
    html: [[/<!--[\s\S]*?-->/, 'cm'], [/"[^"]*"/, 'st'], [/<\/?[A-Za-z!][\w-]*/, 'tg'], [/\/?>/, 'tg'], [/[\w-]+(?==)/, 'at']],
    css: [[/\/\*[\s\S]*?\*\//, 'cm'], [/#[0-9a-fA-F]{3,8}\b/, 'nm'], [/[.#][A-Za-z][\w-]*/, 'tg'], [/[a-z-]+(?=\s*:\s)/, 'at'], [/-?\d+(?:\.\d+)?[a-z%]*/, 'nm'], [/\b[a-zA-Z]+(?=\()/, 'fn']],
    js: [[/\/\/.*/, 'cm'], [/"[^"]*"|`[^`]*`/, 'st'], [/\b(?:const|let|function|return|new|if)\b/, 'kw'], [/\b[a-zA-Z_]\w*(?=\()/, 'fn'], [/\b\d+\b/, 'nm']],
    php: [[/\/\/.*/, 'cm'], [/"[^"]*"/, 'st'], [/<\?php|\?>/, 'tg'], [/\$\w+/, 'vr'], [/\b(?:echo|while|new|function|return)\b/, 'kw'], [/\b[a-zA-Z_]\w*(?=\()/, 'fn']],
    py: [[/#.*/, 'cm'], [/f?"[^"]*"/, 'st'], [/\b(?:for|in|print|def|return|import)\b/, 'kw'], [/\b[a-zA-Z_]\w*(?=\()/, 'fn'], [/\b\d+\b/, 'nm']],
    sql: [[/--.*/, 'cm'], [/\b(?:SELECT|FROM|WHERE|ORDER BY|DESC|LIMIT)\b/, 'kw'], [/\b\d+\b/, 'nm']]
  };
  const RX = {};
  for (const k in RULES) RX[k] = new RegExp(RULES[k].map((r) => '(' + r[0].source + ')').join('|'), 'g');
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function hl(line, lang) {
    const re = RX[lang], rules = RULES[lang];
    re.lastIndex = 0;
    let out = '', last = 0, m;
    while ((m = re.exec(line))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += esc(line.slice(last, m.index));
      let gi = 1;
      while (gi <= rules.length && m[gi] === undefined) gi++;
      out += '<span class="' + rules[gi - 1][1] + '">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + esc(line.slice(last));
  }

  /* ---------- meja & perangkat ---------- */
  const desk = box({ w: 640, h: 16, d: 300, x: 0, y: 110, z: 0, c: '#1a1a1d', ct: '#26262a' });
  box({ w: 330, h: 2, d: 130, x: 10, y: 101, z: 68, c: '#2a2a2e', ct: '#323237' });
  const kb = box({ w: 200, h: 6, d: 58, x: -20, y: 97, z: 70, c: '#2c2c30' });
  kb._f.t.classList.add('keys');
  box({ w: 24, h: 8, d: 38, x: 130, y: 96, z: 72, c: '#2c2c30' });
  box({ w: 100, h: 5, d: 60, x: 0, y: 99.5, z: -40, c: '#141416' });
  box({ w: 14, h: 66, d: 10, x: 0, y: 68, z: -56, c: '#141416' });
  const mon = box({ w: 340, h: 206, d: 12, x: 0, y: -51, z: -50, c: '#0c0c0e' });
  const spL = box({ w: 46, h: 80, d: 46, x: -236, y: 62, z: -30, c: '#141416' });
  const spR = box({ w: 46, h: 80, d: 46, x: 204, y: 62, z: -30, c: '#141416' });
  const tw = box({ w: 84, h: 200, d: 84, x: 268, y: 2, z: -25, c: '#101012' });
  [spL, spR].forEach((s) => {
    s._f.f.innerHTML = '<div class="spk-a"></div><div class="spk-b"></div>';
  });
  tw._f.f.innerHTML = '<div class="fan" style="top:28px"></div><div class="fan" style="top:112px;animation-direction:reverse"></div>';

  // layar
  const tabs = Object.keys(FILES).map((k) => '<button type="button" data-k="' + k + '">' + FILES[k].name + '</button>').join('');
  const sideBars = [70, 52, 62, 40, 58, 46, 66, 36, 54].map((w, i) => '<i style="width:' + w + '%"' + (i === 3 || i === 6 ? ' class="sel"' : '') + '></i>').join('');
  mon._f.f.style.background = '#09090a';
  mon._f.f.innerHTML = '<div class="scr"><div class="scr-tabs">' + tabs + '</div><div class="scr-main"><div class="scr-side">' + sideBars +
    '</div><pre class="scr-code"></pre></div><div class="scr-bar"><span><b>●</b> server siap · localhost:5500</span><span class="scr-fn"></span></div></div>';
  const codeEl = mon._f.f.querySelector('.scr-code');
  const fnEl = mon._f.f.querySelector('.scr-fn');
  const tabEls = mon._f.f.querySelectorAll('.scr-tabs button');

  const CUBES = [
    { k: 'html', t: 'HTML', c: '#e8643a', x: -262, y: -150, z: 40, sd: 17, fd: 0, rz: 8 },
    { k: 'css', t: 'CSS', c: '#3b82f6', x: -118, y: -218, z: 10, sd: 21, fd: -1.2, rz: -10 },
    { k: 'php', t: 'PHP', c: '#777bb3', x: 112, y: -222, z: 20, sd: 19, fd: -2.4, rz: 12 },
    { k: 'js', t: 'JS', c: '#f7c600', x: 262, y: -160, z: 50, sd: 16, fd: -3.1, rz: -6 },
    { k: 'py', t: 'PY', c: '#3776ab', x: -336, y: -30, z: 70, sd: 23, fd: -0.7, rz: 10 },
    { k: 'sql', t: 'SQL', c: '#00758f', x: 344, y: -34, z: 60, sd: 20, fd: -1.9, rz: -12 }
  ];
  const cubeEls = {};
  const FT = ['translateZ(24px)', 'rotateY(180deg) translateZ(24px)', 'rotateY(90deg) translateZ(24px)', 'rotateY(-90deg) translateZ(24px)', 'rotateX(90deg) translateZ(24px)', 'rotateX(-90deg) translateZ(24px)'];
  CUBES.forEach((c) => {
    const cb = document.createElement('div'); cb.className = 'cb';
    cb.style.transform = 'translate3d(' + c.x + 'px,' + c.y + 'px,' + c.z + 'px)';
    const fl = document.createElement('div'); fl.className = 'cb-f'; fl.style.setProperty('--fd', c.fd + 's');
    const sp = document.createElement('div'); sp.className = 'cb-s';
    sp.style.setProperty('--sd', c.sd + 's'); sp.style.setProperty('--rz', c.rz + 'deg');
    cb.style.setProperty('--cc', c.c);
    sp.innerHTML = FT.map((t) => '<i class="cf" style="transform:' + t + '">' + c.t + '</i>').join('');
    sp.setAttribute('data-k', c.k);
    fl.appendChild(sp); cb.appendChild(fl); scene.appendChild(cb);
    cubeEls[c.k] = cb;
  });

  let cur = null, lastPick = 0;
  function setFile(k, byUser) {
    if (k === cur) { if (byUser) lastPick = performance.now(); return; }
    cur = k;
    if (byUser) lastPick = performance.now();
    const f = FILES[k];
    codeEl.innerHTML = f.code.map((l, i) => '<span class="ln" style="animation-delay:' + (i * 70) + 'ms">' + (hl(l, f.lang) || ' ') +
      (i === f.code.length - 1 ? '<span class="cur"></span>' : '') + '</span>').join('');
    fnEl.textContent = f.name;
    tabEls.forEach((t) => t.classList.toggle('on', t.dataset.k === k));
    for (const key in cubeEls) cubeEls[key].classList.toggle('act', key === k);
  }
  setFile('html');

  /* ---------- skala & responsif ---------- */
  let sc = 1;
  function fit() {
    const w = root.clientWidth || 800;
    const W = innerWidth < 640 ? 740 : 820;
    sc = Math.min(1.3, w / W);
    stage.style.height = (H * sc) + 'px';
    stage.style.perspective = (1500 * sc) + 'px';
  }
  fit();
  addEventListener('resize', fit);

  /* ---------- gerak: ikut kursor / geser / diam-bergoyang ---------- */
  let yaw = -16, pitch = -13, ty = -16, tp = -13;
  let hover = false, drag = false, moved = false, lastInt = 0;
  let sx = 0, sy = 0, bty = 0, btp = 0;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || drag) return;
    const r = stage.getBoundingClientRect();
    const nx = clamp((e.clientX - r.left) / r.width, 0, 1), ny = clamp((e.clientY - r.top) / r.height, 0, 1);
    hover = true; lastInt = performance.now();
    ty = (nx - .5) * 56; tp = -13 - (ny - .5) * 12;
  });
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hover = false; lastInt = performance.now() - 1500; } });
  stage.addEventListener('pointerdown', (e) => {
    drag = true; moved = false; sx = e.clientX; sy = e.clientY; bty = ty; btp = tp;
    stage.classList.add('dg');
    const mv = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      ty = clamp(bty + dx * .45, -85, 85);
      tp = clamp(btp - dy * .3, -38, 4);
      lastInt = performance.now();
    };
    const up = () => {
      drag = false; stage.classList.remove('dg');
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      lastInt = performance.now();
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });

  // klik kubus / tab untuk ganti bahasa (bukan saat habis menggeser)
  stage.addEventListener('click', (e) => {
    if (moved) { moved = false; return; }
    const t = e.target.closest('[data-k]');
    if (t) setFile(t.dataset.k, true);
  });

  /* ---------- loop animasi hanya saat terlihat ---------- */
  let vis = false, raf = 0;
  function tick(now) {
    if (!drag && !hover && !RM && now - lastInt > 2500) {
      ty = Math.sin(now / 2600) * 20 - 6;
      tp = -13 + Math.sin(now / 3300) * 2.5;
    }
    yaw += (ty - yaw) * .09;
    pitch += (tp - pitch) * .09;
    scene.style.transform = 'scale3d(' + sc + ',' + sc + ',' + sc + ') rotateX(' + pitch.toFixed(2) + 'deg) rotateY(' + yaw.toFixed(2) + 'deg)';
    raf = vis ? requestAnimationFrame(tick) : 0;
  }
  tick(performance.now());

  // ganti file otomatis tiap beberapa detik
  const order = Object.keys(FILES);
  if (!RM) setInterval(() => {
    if (!vis || performance.now() - lastPick < 14000) return;
    setFile(order[(order.indexOf(cur) + 1) % order.length], false);
  }, 5200);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => {
      vis = en[0].isIntersecting;
      if (vis) { root.classList.add('on'); if (!raf) raf = requestAnimationFrame(tick); }
    }, { threshold: .15 }).observe(root);
  } else { vis = true; root.classList.add('on'); raf = requestAnimationFrame(tick); }
})();
