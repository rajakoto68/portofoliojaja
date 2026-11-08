/* =========================================================
   DAFTAR LAGU  →  dipakai oleh js/lagu.js
   ---------------------------------------------------------
   Tiap lagu:
     judul  : judul lagu
     artis  : nama penyanyi
     src    : file mp3
     cover  : gambar cover (taruh file di assets/cover/ lalu isi namanya).
              Kalau file belum ada, otomatis tampil kotak kosong berwarna.
     lrc    : lirik berformat LRC (ada waktu), tempel di antara tanda ` `
              contoh:
                [00:12.50] baris lirik pertama
                [00:17.00] baris lirik kedua
              Kalau tanpa waktu (hanya teks), lirik dibagi rata sepanjang lagu
              (kurang pas, tapi tetap jalan).
     offset : (opsional) geser waktu lirik dalam detik. Lirik telat -> isi angka positif
              (mis. offset: 1.5), lirik kecepatan -> isi negatif (mis. offset: -1).
   LIRIK OTOMATIS: kalau kolom lrc dibiarkan kosong, website akan mencari lirik berwaktu
   di LRCLIB (butuh internet) lalu menyimpannya di browser. Lirik yang kamu tempel manual
   di kolom lrc selalu diutamakan. Matikan pencarian otomatis dengan baris di bawah.
   Ganti urutan / tambah lagu cukup dengan menambah objek baru.
   ========================================================= */
window.LIRIK_OTOMATIS = true;   // ganti false kalau tidak mau cari lirik otomatis
window.DATA_LAGU = [
  { judul: 'Shape of My Heart', artis: 'Sting',
    src: 'assets/shape-of-my-heart.mp3', cover: 'assets/cover/shape-of-my-heart.jpg', lrc: `` },

  { judul: 'Losing Us', artis: 'Raissa Anggiani',
    src: 'assets/lagu/raissa-losing-us.mp3', cover: 'assets/cover/raissa-losing-us.jpg', lrc: `` },

  { judul: 'Exile', artis: 'Taylor Swift',
    src: 'assets/lagu/taylor-exile.mp3', cover: 'assets/cover/taylor-exile.jpg', lrc: `` },

  { judul: 'About You', artis: 'The 1975',
    src: 'assets/lagu/the1975-about-you.mp3', cover: 'assets/cover/the1975-about-you.jpg', lrc: `` },

  { judul: 'Merry Christmas (I Miss You)', artis: 'Alex Crichton',
    src: 'assets/lagu/alex-merry-christmas.mp3', cover: 'assets/cover/alex-merry-christmas.jpg', lrc: `` },

  { judul: 'the cure', artis: 'Olivia Rodrigo',  /* lirik = teks tanpa waktu (dibagi rata sepanjang lagu) */
    src: 'assets/lagu/olivia-the-cure.mp3', cover: 'assets/cover/olivia-the-cure.jpg', lrc: `I see the sadness in your eyes
You don't have to tell me why
Whenever everything goes wrong
I'll be right here to keep you strong
You can let your feelings show
You don't have to face it all alone
Whenever you need someone
I'll be the one you can run to
I'll be there when you need me
I'll be everything you need
When the world is bringing you down
I'll never let you hit the ground
You can always count on me
I'll be there for you to see
No matter what you're going through
I'll be the one who cares for you
When all the colors fade away
I'll bring the sunshine to your day
And when you feel like giving up
I'll remind you you're enough
You don't have to hide your tears
I'll stay beside you through the years
Whatever happens, wherever you go
I'll be right here, I hope you know
I'll be there when you need me
I'll be everything you need
When the world is bringing you down
I'll never let you hit the ground
You can always count on me
I'll be there for you to see
No matter what you're going through
I'll be the one who cares for you` },

  { judul: 'Settings', artis: 'Artis',
    src: 'assets/lagu/settings.mp3', cover: 'assets/cover/settings.jpg', lrc: `` }
];
