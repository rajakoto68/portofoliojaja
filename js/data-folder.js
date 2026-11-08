/* =========================================================
   DATA DUA FOLDER (bagian Prestasi di index.html)
   Edit file ini saja untuk menambah / mengubah isi folder.

   Setiap item punya:
     foto  : lokasi gambar (taruh di img/prestasi/ atau img/proyek/)
     judul : tulisan besar di bawah foto
     tag   : tulisan kecil di bawah judul (boleh dikosongkan)
     link  : (opsional, khusus proyek) alamat website proyekmu.
             Kalau diisi, kartu akan membuka website itu.
             Kalau kosong, foto akan dibuka besar di jendela viewer.
   ========================================================= */
window.FOLDER_DATA = {

  /* ---------- FOLDER 1 : PRESTASI ---------- */
  prestasi: {
    nama: 'Prestasi',
    satuan: 'sertifikat',
    judul: 'Prestasi<em>yang pernah kuraih</em>',
    items: [
      { foto: 'img/prestasi/sertifikat-01.jpg', judul: 'Prestasi Pertama', tag: 'Certificate / 01' },
      { foto: 'img/prestasi/sertifikat-02.jpg', judul: 'Prestasi Kedua',   tag: 'Certificate / 02' },
      { foto: 'img/prestasi/sertifikat-03.jpg', judul: 'Prestasi Ketiga',  tag: 'Certificate / 03' }
    ]
  },

  // ---------- FOLDER 2 : PROYEK WEBSITE (isi sendiri) ----------
  // Contoh item (hapus tanda // di depannya untuk memakainya):
  //   { foto: 'img/proyek/kasir.jpg', judul: 'Aplikasi Kasir', tag: 'PHP + MySQL', link: 'https://contoh.com' },
  proyek: {
    nama: 'Proyek Website',
    satuan: 'proyek',
    judul: 'Website<em>yang pernah kubuat</em>',
        items: [
      { foto: 'img/proyek/mimo-co.webp',        judul: 'Mimo Co',                      tag: 'Pesan Es Krim Online',      link: 'https://mimocoo.page.gd/?i=2#home' },
      { foto: 'img/proyek/mom4g.webp',          judul: 'Dapur Mom4G',                  tag: 'Toko Keripik & Camilan',    link: 'https://mom4gwebsite.page.gd/' },
      { foto: 'img/proyek/warung-teras.webp',   judul: 'Warung Teras Dian Barokah',    tag: 'Website Warung Makan',      link: 'https://warungterasbarokah.github.io/warungteras/' },
      { foto: 'img/proyek/fbs-unimed.webp',     judul: 'Web Layanan FBS UNIMED',       tag: 'Peminjaman Ruang & Gedung', link: 'https://unimedfbs1.page.gd/fbs/index.html' },
      { foto: 'img/proyek/rideradian.webp',     judul: 'Rideradian Motor',             tag: 'Motor Listrik & Helm',      link: 'https://rajakoto68.github.io/motor/' },
      { foto: 'img/proyek/konsumsi-rapat.webp', judul: 'Konsumsi Rapat Kantor Wali Kota', tag: 'Sistem Informasi',       link: 'https://rajakoto68.github.io/rasamanado/' }
    ]
  }
};
