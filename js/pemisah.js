/* Pemisah gelombang: animasi hanya jalan saat pemisah terlihat di layar. */
(function () {
  const els = [...document.querySelectorAll('.wv')];
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('live')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('live', e.isIntersecting)), { rootMargin: '120px' });
  els.forEach((e) => io.observe(e));
})();
