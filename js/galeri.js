/* Galeri polaroid: muncul saat di-scroll, melayang pelan hanya saat terlihat, penampil besar dengan panah/keyboard/geser.
   Ringan: hanya IntersectionObserver, tanpa handler scroll. */
(function () {
  const sec = document.getElementById('proyek');
  if (!sec) return;
  const grid = sec.querySelector('.gp-grid');
  const items = [...grid.querySelectorAll('.gp-i')];
  const N = items.length;
  const html = document.documentElement;
  sec.classList.add('gp-js');

  /* gambar muncul halus setelah dimuat */
  items.forEach((el) => {
    const im = el.querySelector('img');
    const ok = () => im.classList.add('ld');
    if (im.complete && im.naturalWidth) ok(); else { im.addEventListener('load', ok); im.addEventListener('error', ok); }
  });

  /* muncul berurutan saat masuk layar */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
    /* animasi melayang & kilau hanya jalan saat section terlihat */
    new IntersectionObserver((es) => es.forEach((e) => sec.classList.toggle('gp-live', e.isIntersecting)), { rootMargin: '80px' }).observe(sec);
  } else {
    items.forEach((el) => el.classList.add('in'));
    sec.classList.add('gp-live');
  }

  /* ---------- penampil besar ---------- */
  const box = document.createElement('div');
  box.className = 'glb';
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Penampil galeri');
  box.innerHTML = '<div class="glb-bg"></div><button type="button" class="glb-x" aria-label="Tutup">&#10005;</button>' +
    '<button type="button" class="glb-p" aria-label="Sebelumnya">&#8592;</button><button type="button" class="glb-n" aria-label="Berikutnya">&#8594;</button>' +
    '<div class="glb-box"><div class="glb-med"></div><div class="glb-cap"></div></div>';
  document.body.appendChild(box);
  const med = box.querySelector('.glb-med'), cap = box.querySelector('.glb-cap');
  let cur = 0, last = null;

  function show(i) {
    cur = (i + N) % N;
    const c = items[cur], th = c.querySelector('img');
    med.innerHTML = '';
    let el;
    if (c.dataset.video) {
      el = document.createElement('video');
      el.poster = c.dataset.poster || th.currentSrc; el.controls = true; el.playsInline = true; el.preload = 'metadata'; el.src = c.dataset.video;
    } else {
      el = document.createElement('img'); el.alt = c.dataset.cap; el.decoding = 'async';
      el.src = th.currentSrc || th.src;                 /* tampil langsung dari thumbnail */
      if (c.dataset.full) { const big = new Image(); big.onload = () => { if (cur === i || items[cur] === c) el.src = big.src; }; big.src = c.dataset.full; }
    }
    med.appendChild(el);
    cap.innerHTML = '<b></b><small></small>';
    cap.firstChild.textContent = c.dataset.cap;
    cap.lastChild.textContent = (cur + 1) + ' / ' + N;
  }
  function open(i) {
    last = document.activeElement; show(i);
    box.classList.add('on'); html.style.overflow = 'hidden';
    box.querySelector('.glb-x').focus({ preventScroll: true });
  }
  function close() {
    const v = med.querySelector('video'); if (v) v.pause();
    box.classList.remove('on'); html.style.overflow = '';
    if (last) last.focus({ preventScroll: true });
  }
  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  box.querySelector('.glb-x').addEventListener('click', close);
  box.querySelector('.glb-bg').addEventListener('click', close);
  box.querySelector('.glb-p').addEventListener('click', () => show(cur - 1));
  box.querySelector('.glb-n').addEventListener('click', () => show(cur + 1));
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
  });
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
