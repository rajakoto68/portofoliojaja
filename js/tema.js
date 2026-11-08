// tombol mode pagi/malam untuk halaman "Menikmati Alam" (pilihan tersimpan & dipakai semua halaman)
(function(){
  var b=document.getElementById('alTg');if(!b)return;
  var r=document.documentElement;
  b.addEventListener('click',function(){
    var d=r.getAttribute('data-theme')==='dark'?'light':'dark';
    r.setAttribute('data-theme',d);
    try{localStorage.setItem('tema',d)}catch(e){}
  });
})();
