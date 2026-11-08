// ====== GANTI NOMOR WHATSAPP DI SINI (format 62, tanpa + / 0 di depan) ======
window.NOMOR_WA='6288708759325';
// ============================================================================
(function(){
 var s=document.getElementById('layanan');if(!s)return;
 function wa(t){return 'https://wa.me/'+window.NOMOR_WA+'?text='+encodeURIComponent(t)}
 s.querySelectorAll('[data-svc]').forEach(function(a){
  var v=a.dataset.svc;
  a.href=wa('Halo Siyo, aku tertarik dengan layanan '+v+'. Boleh konsultasi dulu?');
  a.target='_blank';a.rel='noopener';
 });
 var g=s.querySelector('.ly-g');if(g)[].forEach.call(g.children,function(c,i){c.style.setProperty('--d',(i%4)*.08+'s')});
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){s.classList.add('in');io.disconnect()}})},{threshold:.08});io.observe(s)}else s.classList.add('in');
 // tombol WhatsApp lain di web ikut pakai nomor yang sama
 document.querySelectorAll('[data-link="wa"]').forEach(function(a){a.href=wa('Halo Siyo, aku lihat portofoliomu dan mau tanya-tanya.')});
})();
