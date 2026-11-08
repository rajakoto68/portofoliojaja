# Menyambungkan chatbot ke Gemini

Chatbot tetap jalan tanpa ini (pakai jawaban bawaan soal Raja). Ikuti langkah ini kalau mau
dia bisa jawab pertanyaan umum (presiden, pelajaran, coding, dll).

## 1. Ambil API key Gemini (gratis)
1. Buka https://aistudio.google.com/apikey lalu login akun Google.
2. Klik **Create API key**, salin key-nya. **Jangan ditaruh di file website.**

## 2. Buat Worker di Cloudflare (gratis)
1. Daftar/login di https://dash.cloudflare.com
2. Menu **Workers & Pages** -> **Create** -> **Create Worker** -> beri nama (mis. `donat-chat`) -> **Deploy**.
3. Klik **Edit code**, hapus isinya, tempel seluruh isi `worker.js`, lalu **Deploy**.
4. Buka **Settings -> Variables and Secrets**, tambahkan:
   - `GEMINI_API_KEY` (tipe **Secret**) = key dari langkah 1
   - `ALLOWED_ORIGIN` (tipe Text) = alamat websitemu, mis. `https://namaweb.vercel.app`
     (boleh beberapa, pisahkan koma; saat tes lokal tambahkan `http://localhost:8765`)
   - opsional `GEMINI_MODEL` = nama model Gemini yang mau dipakai (default `gemini-flash-latest`)
   - opsional `USE_SEARCH` = `0` kalau tidak mau Gemini mencari info terbaru di Google
5. Salin URL worker, bentuknya `https://donat-chat.NAMAKAMU.workers.dev`

## 3. Pasang URL di website
Buka `js/chatbot.js`, cari bagian `aiUrl` di `DATA`, lalu isi:

    aiUrl: 'https://donat-chat.NAMAKAMU.workers.dev'

Upload ulang website. Selesai.

## Catatan
- Tombol saran (Nama asli, Sekolah, dst.) tetap dijawab instan oleh bot bawaan, tidak memakai kuota AI.
- Kalau AI error / kuota habis, bot otomatis kembali ke jawaban bawaan.
- Kuota gratis Gemini terbatas. Kalau websitemu ramai, cek batasnya di Google AI Studio.
- Data Raja ada di dua tempat: `DATA` di `js/chatbot.js` dan teks `SYSTEM` di `worker.js`. Kalau ada yang berubah (harga, dll), ubah di keduanya.

## Mode gratis tanpa key (sudah aktif bawaan)
Selama `aiUrl` kosong, bot memakai layanan gratis Pollinations (tanpa akun/key):
- Pertanyaan soal Raja dijawab bawaan (instan). Pertanyaan lain dikirim ke AI gratis.
- Batasan: model kecil, TIDAK bisa cari info terbaru (jabatan/berita bisa salah), dan tiap pengunjung
  hanya bisa 1 pertanyaan AI per 30 detik. Layanan ini juga tanpa jaminan stabil.
- Kalau gagal, bot kembali ke jawaban bawaan. Matikan dengan `aiGratis: false` di `js/chatbot.js`.
- Kalau `aiUrl` (Gemini) sudah diisi, mode Gemini yang dipakai dan mode gratis ini tidak aktif.
