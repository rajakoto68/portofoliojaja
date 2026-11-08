/* Dua folder (Prestasi & Proyek Website) → ruang polaroid.
   Isi folder diatur di js/data-folder.js */
(function () {
  const sec = document.getElementById('prestasi');
  const DATA = window.FOLDER_DATA;
  if (!sec || !DATA) return;

  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const home = document.getElementById('fdrHome');
  const room = document.getElementById('fdrRoom');
  const pols = document.getElementById('fdrPols');
  const titleEl = document.getElementById('fdrTitle');
  const listEl = document.getElementById('fdrList');
  const metaEl = document.getElementById('fdrMeta');
  const backBtn = document.getElementById('fdrBack');
  const folderBtns = {};
  sec.querySelectorAll('[data-open]').forEach((b) => { folderBtns[b.dataset.open] = b; });

  /* animasi masuk: jalan saat bagian ini terlihat di layar */
  function playIntro() {
    home.classList.remove('go'); void home.offsetWidth; home.classList.add('go');
  }
  if (!RM && 'IntersectionObserver' in window) {
    home.classList.add('fdr-anim');
    const io = new IntersectionObserver((en) => {
      if (en.some((e) => e.isIntersecting)) { playIntro(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(home);
  }

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* posisi polaroid di layar lebar: x, y (%), lebar (%), miring (derajat), kedalaman parallax */
  const SLOTS = [
    { x: 4, y: 9, w: 24, r: -7, d: 16 },
    { x: 72, y: 7, w: 24, r: 6, d: 20 },
    { x: 34, y: 60, w: 26, r: -3, d: 12 },
    { x: 73, y: 46, w: 21, r: 8, d: 24 },
    { x: 4, y: 45, w: 19, r: 5, d: 26 },
    { x: 28, y: 4, w: 16, r: 4, d: 30 },
    { x: 57, y: 3, w: 14, r: -6, d: 28 },
    { x: 61, y: 62, w: 14, r: 7, d: 22 }
  ];

  /* susunan khusus 6 kartu: 2 di kiri, 2 di kanan, 2 di bawah tengah (judul tetap bebas) */
  const SLOTS6 = [
    { x: 4, y: 12, w: 18, r: -5, d: 16 },
    { x: 79, y: 6, w: 18, r: 5, d: 20 },
    { x: 6, y: 44, w: 17, r: 4, d: 26 },
    { x: 78, y: 42, w: 18, r: -4, d: 24 },
    { x: 29, y: 56, w: 19, r: -3, d: 12 },
    { x: 52, y: 57, w: 19, r: 3, d: 18 }
  ];

  /* ---------- kartu jumlah & gambar kecil di folder ---------- */
  Object.keys(folderBtns).forEach((k) => {
    const d = DATA[k], items = (d && d.items) || [], btn = folderBtns[k];
    const cnt = btn.querySelector('[data-count]');
    if (cnt) cnt.textContent = items.length ? pad(items.length) + ' ' + (d.satuan || 'item') : 'segera hadir';
    btn.querySelectorAll('.fdr-f-papers i').forEach((p, i) => {
      const it = items[i];
      if (it && it.foto) p.style.setProperty('--img', 'url("' + new URL(it.foto, document.baseURI).href + '")');
    });
  });

  /* ---------- viewer foto besar (memakai jendela sertifikat yang sudah ada) ---------- */
  const modal = document.getElementById('certificateModal');
  const mImg = document.getElementById('certificateViewerImage');
  const mTitle = document.getElementById('certificateViewerTitle');
  const mNum = document.getElementById('certificateViewerNumber');
  const mTop = modal && modal.querySelector('.certificate-viewer-top span:last-child');
  let key = null, items = [], view = [], vIdx = 0, lastCard = null;

  function showViewer(i) {
    if (!modal || !view.length) return;
    vIdx = (i + view.length) % view.length;
    const it = view[vIdx];
    mImg.src = it.foto; mImg.alt = it.judul || '';
    mTitle.textContent = it.judul || '';
    mNum.textContent = pad(vIdx + 1) + ' / ' + pad(view.length);
    if (mTop) mTop.textContent = key === 'prestasi' ? 'CERTIFICATE VIEWER' : 'PROJECT VIEWER';
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastCard) lastCard.focus({ preventScroll: true });
  }
  if (modal) {
    document.getElementById('certificateClose').addEventListener('click', closeViewer);
    document.getElementById('certificatePrev').addEventListener('click', () => showViewer(vIdx - 1));
    document.getElementById('certificateNext').addEventListener('click', () => showViewer(vIdx + 1));
    modal.addEventListener('click', (e) => { if (e.target.matches('[data-close-certificate]')) closeViewer(); });
  }

  /* ---------- bangun ruang polaroid ---------- */
  function build() {
    const d = DATA[key];
    items = (d.items || []).slice();
    view = items.filter((it) => it.foto);
    const empty = !items.length;
    const shown = empty ? [1, 2, 3, 4].map(() => ({ kosong: true, judul: 'Segera hadir', tag: 'Folder ini akan diisi' })) : items;

    room.style.setProperty('--ac', key === 'prestasi' ? '#c9d93e' : '#f7931e');
    titleEl.innerHTML = d.judul || esc(d.nama);
    metaEl.innerHTML = empty
      ? '<span><b>00</b> ' + esc(d.satuan || 'item') + '</span><span>Segera diisi</span>'
      : '<span><b>' + pad(items.length) + '</b> ' + esc(d.satuan || 'item') + '</span><span>' + (key === 'prestasi' ? 'Klik foto untuk memperbesar' : 'Klik kartu untuk kunjungi website') + '</span>';

    listEl.innerHTML = shown.map((it, i) =>
      '<button type="button" data-i="' + i + '"' + (it.kosong ? ' tabindex="-1"' : '') + '><span>' + pad(i + 1) + '</span>' + esc(it.judul) + '</button>').join('');

    pols.classList.remove('dim');
    pols.innerHTML = shown.map((it, i) => {
      const set = (!empty && items.length === 6) ? SLOTS6 : SLOTS, s = set[i % set.length], shift = Math.floor(i / set.length) * 3;
      const st = '--x:' + (s.x + shift) + '%;--y:' + (s.y + shift) + '%;--w:' + s.w + '%;--r:' + s.r + 'deg;--d:' + s.d + ';--i:' + i;
      const photo = it.kosong ? '<span class="fdr-ph">+</span>'
        : '<span class="fdr-ph"><img src="' + esc(it.foto) + '" alt="' + esc(it.judul) + '" loading="lazy" draggable="false"></span>';
      const cap = '<span class="fdr-cap"><b>' + esc(it.judul) + '</b>' + (it.tag ? '<small>' + esc(it.tag) + '</small>' : '') + (it.link ? '<span class="fdr-visit">Kunjungi website <i aria-hidden="true">↗</i></span>' : '') + '</span>';
      return '<figure class="fdr-pol" style="' + st + '" data-i="' + i + '"><button type="button" class="fdr-card' + (it.kosong ? ' kosong' : '') + '"' +
        (it.kosong ? ' tabindex="-1" aria-disabled="true"' : ' aria-label="' + esc(it.judul) + (it.link ? ' - kunjungi website' : '') + '"') + '>' + photo + cap + '</button></figure>';
    }).join('');
  }

  function activate(i) {
    const it = items[i];
    if (!it) return;
    if (it.link) { window.open(it.link, '_blank', 'noopener'); return; }
    if (it.foto) showViewer(view.indexOf(it));
  }

  pols.addEventListener('click', (e) => {
    const f = e.target.closest('.fdr-pol');
    if (!f) return;
    lastCard = f.querySelector('.fdr-card');
    activate(+f.dataset.i);
  });

  /* daftar kiri ↔ polaroid saling menyorot */
  function hl(i) {
    pols.querySelectorAll('.fdr-pol').forEach((p) => p.classList.toggle('hl', i != null && +p.dataset.i === i));
    pols.classList.toggle('dim', i != null);
    listEl.querySelectorAll('button').forEach((b) => b.classList.toggle('on', i != null && +b.dataset.i === i));
  }
  listEl.addEventListener('mouseover', (e) => { const b = e.target.closest('button'); if (b) hl(+b.dataset.i); });
  listEl.addEventListener('focusin', (e) => { const b = e.target.closest('button'); if (b) hl(+b.dataset.i); });
  listEl.addEventListener('mouseleave', () => hl(null));
  listEl.addEventListener('focusout', () => hl(null));
  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    lastCard = pols.querySelector('.fdr-pol[data-i="' + b.dataset.i + '"] .fdr-card');
    activate(+b.dataset.i);
  });
  pols.addEventListener('mouseover', (e) => {
    const f = e.target.closest('.fdr-pol');
    listEl.querySelectorAll('button').forEach((b) => b.classList.toggle('on', !!f && +b.dataset.i === +f.dataset.i));
  });
  pols.addEventListener('mouseleave', () => listEl.querySelectorAll('button').forEach((b) => b.classList.remove('on')));

  /* gerak halus mengikuti kursor (parallax) */
  room.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || RM) return;
    const r = room.getBoundingClientRect();
    pols.style.setProperty('--mx', (((e.clientX - r.left) / r.width) - .5) * 2);
    pols.style.setProperty('--my', (((e.clientY - r.top) / r.height) - .5) * 2);
  });
  room.addEventListener('pointerleave', () => { pols.style.setProperty('--mx', 0); pols.style.setProperty('--my', 0); });

  /* ---------- buka / tutup folder ---------- */
  function openFolder(k) {
    key = k;
    build();
    home.classList.add('out');
    setTimeout(() => {
      home.hidden = true; room.hidden = false;
      void room.offsetWidth;
      room.classList.add('in');
      sec.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
      backBtn.focus({ preventScroll: true });
    }, RM ? 0 : 380);
  }
  function closeFolder() {
    room.classList.remove('in');
    setTimeout(() => {
      room.hidden = true; home.hidden = false;
      void home.offsetWidth;
      home.classList.remove('out');
      if (home.classList.contains('fdr-anim')) playIntro();
      sec.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
      if (folderBtns[key]) folderBtns[key].focus({ preventScroll: true });
    }, RM ? 0 : 320);
  }
  Object.keys(folderBtns).forEach((k) => folderBtns[k].addEventListener('click', () => { if (k === 'proyek' && !document.getElementById('hbPage')) { location.href = 'hobi-ngoding.html#prestasi'; return; } openFolder(k); }));
  backBtn.addEventListener('click', closeFolder);

  document.addEventListener('keydown', (e) => {
    const open = modal && modal.classList.contains('is-open');
    if (open) {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowRight') showViewer(vIdx + 1);
      else if (e.key === 'ArrowLeft') showViewer(vIdx - 1);
    } else if (e.key === 'Escape' && !room.hidden) closeFolder();
  });
})();
