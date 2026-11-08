/* =========================================================
   CHATBOT DONAT — asisten kecil buat nanya-nanya soal Raja
   Cara kerja: bot ini jalan 100% di browser (tanpa server / API key).
   Semua data Raja ada di objek DATA di bawah, tinggal edit di sini.
   ========================================================= */
(function () {
  'use strict';
  if (window.__rjBot) return;
  window.__rjBot = true;

  /* ====================== DATA RAJA (EDIT DI SINI) ====================== */
  var DATA = {
    namaAsli: 'M Raja Siyo',          // kalau ada nama lengkap, ganti di sini
    panggilan: 'Raja',
    sekolah: 'SMK Swasta Mandiri',
    jurusan: 'RPL (Rekayasa Perangkat Lunak)',
    kelas: 'XII RPL 1',
    lahir: { tgl: 31, bln: 12, thn: 2008 },
    anakKe: 8,
    asal: 'Sumatera Utara',
    hobi: ['gym', 'ngoding', 'jalan-jalan'],
    skill: ['bikin website', 'bikin aplikasi'],
    hargaLanding: 'Rp100.000 – Rp200.000',
    hargaAplikasi: 'Rp300.000 – Rp500.000',
    wa: window.NOMOR_WA || '6288708759325',
    waTampil: '0887 0875 9325',
    ig: { teks: '@jafrikoto_', url: 'https://www.instagram.com/jafrikoto_/' },
    tiktok: { teks: '@jaxfri', url: 'https://www.tiktok.com/@jaxfri' },
    // ====== AI GEMINI (opsional) ======
    // Isi dengan URL Cloudflare Worker kamu (lihat folder cloudflare-worker/PANDUAN.md).
    // Kalau dikosongkan, bot tetap jalan pakai jawaban bawaan tentang Raja.
    aiUrl: window.RJ_AI_URL || '',
    // Mode GRATIS tanpa key (sementara): dipakai kalau aiUrl di atas kosong.
    // Pakai layanan Pollinations (model kecil, tanpa Google Search, jeda 30 detik antar pertanyaan AI).
    // Ganti jadi false kalau mau mematikan AI sama sekali.
    aiGratis: true,
    aiGratisUrl: window.RJ_AI_GRATIS_URL || 'https://text.pollinations.ai/'
  };
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  function umur() {
    var n = new Date(), L = DATA.lahir;
    var u = n.getFullYear() - L.thn;
    var ultah = new Date(n.getFullYear(), L.bln - 1, L.tgl);
    if (n < ultah) u--;
    return u;
  }
  function tglLahir() { var L = DATA.lahir; return L.tgl + ' ' + BULAN[L.bln - 1] + ' ' + L.thn; }
  function waUrl(t) { return 'https://wa.me/' + DATA.wa + '?text=' + encodeURIComponent(t); }
  function wa(label, pesan) { return { t: label, h: waUrl(pesan), ext: true, wa: true }; }
  var ADA_HOME = !!document.getElementById('layanan');
  var BASE = (function () {
    var s = document.currentScript; if (s && s.src) return s.src.replace(/js\/chatbot\.js.*$/, '');
    return '';
  })();

  /* ====================== JAWABAN PER TOPIK ====================== */
  var INTENTS = [
    { id: 'greet', k: [['halo', 3], ['hallo', 3], ['hai', 3], ['hi', 3], ['hello', 3], ['hay', 3], ['assalamualaikum', 3], ['salam', 2], ['selamat pagi', 3], ['selamat siang', 3], ['selamat sore', 3], ['selamat malam', 3], ['permisi', 3], ['woy', 2]],
      a: function () { return { t: 'Halo! 👋 Aku <b>Donat</b>, asistennya ' + DATA.panggilan + '. Tanya aja soal ' + DATA.panggilan + ': nama, sekolah, hobi, sampai harga joki website.' }; } },

    { id: 'bot', k: [['siapa kamu', 5], ['kamu siapa', 5], ['nama kamu', 5], ['namamu', 5], ['kamu bot', 4], ['kamu ai', 4], ['chatbot', 4], ['robot', 3], ['donat', 3], ['bot', 2], ['ai', 2]],
      a: function () { return { t: 'Aku <b>Donat</b> 🍩, chatbot kecil di portofolio ' + DATA.panggilan + '. Tugasku jawab pertanyaan seputar ' + DATA.panggilan + '. Aku belum bisa jawab hal di luar itu ya.' }; } },

    { id: 'intro', k: [['tentang raja', 4], ['kenalin', 3], ['perkenalan', 3], ['ceritakan', 3], ['cerita', 2], ['profil', 3], ['tentang', 2], ['about', 2], ['raja', 1]],
      a: function () {
        return { t: '<b>' + DATA.namaAsli + '</b>, umur ' + umur() + ' tahun, siswa kelas ' + DATA.kelas + ' di ' + DATA.sekolah + '. Hobinya ' + DATA.hobi.join(', ') + '. Jago ' + DATA.skill.join(' dan ') + ', dan terima joki juga.',
          act: [{ t: 'Lihat layanan joki', h: ADA_HOME ? '#layanan' : BASE + 'index.html#layanan', close: true }] };
      } },

    { id: 'nama', k: [['nama asli', 4], ['nama lengkap', 4], ['nama', 3], ['siapa raja', 3], ['siapa si raja', 3], ['siapa dia', 2], ['panggilan', 2], ['identitas', 2], ['siapa', 1]],
      a: function () { return { t: 'Nama aslinya <b>' + DATA.namaAsli + '</b>. Biasa dipanggil <b>' + DATA.panggilan + '</b>.' }; } },

    { id: 'sekolah', k: [['sekolah', 3], ['smk', 3], ['mandiri', 2], ['jurusan', 3], ['rpl', 3], ['rekayasa perangkat lunak', 3], ['kelas', 2], ['pendidikan', 2], ['sma', 1], ['belajar', 1]],
      a: function () { return { t: DATA.panggilan + ' bersekolah di <b>' + DATA.sekolah + '</b>, jurusan <b>' + DATA.jurusan + '</b>. Sekarang kelas <b>' + DATA.kelas + '</b>.' }; } },

    { id: 'lahir', k: [['tanggal lahir', 4], ['tgl lahir', 4], ['tahun lahir', 4], ['bulan lahir', 4], ['lahir', 3], ['kelahiran', 3], ['ulang tahun', 3], ['ultah', 3], ['birthday', 3]],
      a: function () { return { t: DATA.panggilan + ' lahir pada <b>' + tglLahir() + '</b>.' }; } },

    { id: 'umur', k: [['umur', 3], ['usia', 3], ['berapa tahun', 3], ['tua', 1]],
      a: function () { return { t: 'Umur ' + DATA.panggilan + ' sekarang <b>' + umur() + ' tahun</b>.' }; } },

    { id: 'anak', k: [['anak ke berapa', 4], ['anak keberapa', 4], ['anak ke', 4], ['anak nomor', 3], ['anak yang ke', 3], ['saudara', 3], ['bersaudara', 3], ['kakak', 2], ['adik', 2], ['urutan', 2]],
      a: function () { return { t: DATA.panggilan + ' adalah <b>anak ke-' + DATA.anakKe + '</b>.' }; } },

    { id: 'asal', k: [['asal', 3], ['tinggal', 3], ['domisili', 3], ['daerah', 3], ['alamat', 3], ['dari mana', 3], ['sumatera', 3], ['kota', 2]],
      a: function () { return { t: DATA.panggilan + ' berasal dari <b>' + DATA.asal + '</b>.' }; } },

    { id: 'hobi', k: [['hobi', 4], ['hobby', 4], ['kesukaan', 3], ['waktu luang', 3], ['suka', 2], ['kegiatan', 2], ['olahraga', 2], ['gym', 2], ['jalan jalan', 2], ['ngoding', 2]],
      a: function () {
        return { t: 'Hobi ' + DATA.panggilan + ' ada tiga: <b>gym</b> 💪, <b>ngoding</b> 💻, dan <b>jalan-jalan</b> ⛰️.',
          act: [
            { t: 'Gym', h: BASE + 'hobi-gym.html' },
            { t: 'Ngoding', h: BASE + 'hobi-ngoding.html' },
            { t: 'Jalan-jalan', h: BASE + 'hobi-alam.html' }
          ] };
      } },

    { id: 'skill', k: [['skill', 4], ['skil', 4], ['keahlian', 4], ['kemampuan', 3], ['bisa apa', 3], ['bahasa pemrograman', 3], ['jago', 2], ['bisa bikin', 2], ['stack', 2], ['bisa', 1], ['coding', 1], ['ngoding', 1]],
      a: function () {
        return { t: 'Skill ' + DATA.panggilan + ': <b>bikin website</b> dan <b>bikin aplikasi</b>. Dan kalau butuh, bisa juga dijokiin. Soal harga, tinggal tanya aku.',
          act: [{ t: 'Lihat proyek', h: ADA_HOME ? '#proyek' : BASE + 'index.html#proyek', close: true }] };
      } },

    { id: 'joki', k: [['joki', 4], ['jasa', 3], ['layanan', 3], ['freelance', 3], ['jasa pembuatan', 3], ['order', 2], ['pesan', 2], ['pesen', 2], ['hire', 2], ['bikin website', 2], ['buat website', 2], ['bikin aplikasi', 2], ['mau bikin', 2], ['landing page', 2], ['website', 1], ['aplikasi', 1], ['landing', 1]],
      a: function () {
        return { t: DATA.panggilan + ' terima <b>joki website & aplikasi</b>.<br>• Landing page: <b>' + DATA.hargaLanding + '</b><br>• Aplikasi: <b>' + DATA.hargaAplikasi + '</b> (tergantung fitur)<br>Mau pesan? Hubungi lewat WhatsApp ya.',
          act: [wa('Chat WhatsApp', 'Halo Raja, aku tertarik joki website/aplikasi. Boleh konsultasi dulu?')] };
      } },

    { id: 'harga', k: [['berapa harga', 4], ['harga', 4], ['biaya', 4], ['tarif', 4], ['bayar', 3], ['price', 3], ['pricing', 3], ['berapa duit', 3], ['berapaan', 3], ['ongkos', 3], ['murah', 2], ['mahal', 2], ['budget', 2], ['ribu', 2], ['landing page', 1], ['landing', 1], ['aplikasi', 1]],
      a: function () {
        return { t: 'Harga joki ' + DATA.panggilan + ':<br>• <b>Landing page</b>: ' + DATA.hargaLanding + '<br>• <b>Aplikasi</b>: ' + DATA.hargaAplikasi + '<br>Harga akhir tergantung fitur yang kamu mau. Chat dulu aja buat tanya-tanya.',
          act: [wa('Tanya harga via WhatsApp', 'Halo Raja, aku mau tanya harga joki. Kebutuhanku: ')] };
      } },

    { id: 'kontak', k: [['nomor wa', 4], ['no wa', 4], ['kontak', 4], ['hubungi', 4], ['whatsapp', 4], ['instagram', 4], ['tiktok', 4], ['wa', 3], ['nomor', 3], ['no hp', 3], ['nohp', 3], ['telepon', 3], ['telpon', 3], ['sosmed', 3], ['sosial media', 3], ['ig', 3], ['dm', 2], ['email', 2], ['hp', 1]],
      a: function () {
        return { t: 'Kontak ' + DATA.panggilan + ':<br>• WhatsApp: <b>' + DATA.waTampil + '</b><br>• Instagram: ' + DATA.ig.teks + '<br>• TikTok: ' + DATA.tiktok.teks,
          act: [wa('Chat WhatsApp', 'Halo Raja, aku nemu kontakmu dari website portofolio.'), { t: 'Instagram', h: DATA.ig.url, ext: true }, { t: 'TikTok', h: DATA.tiktok.url, ext: true }] };
      } },

    { id: 'thanks', k: [['makasih', 4], ['terima kasih', 4], ['terimakasih', 4], ['thanks', 4], ['thank', 4], ['mantap', 2], ['keren', 2], ['oke', 1], ['ok', 1]],
      a: function () { return { t: 'Sama-sama! 😄 Kalau masih ada yang mau ditanyain soal ' + DATA.panggilan + ', tanya aja.' }; } },

    { id: 'bye', k: [['dadah', 4], ['bye', 4], ['sampai jumpa', 4], ['sampai ketemu', 4], ['dah', 1]],
      a: function () { return { t: 'Dadah! 👋 Makasih udah mampir ke portofolio ' + DATA.panggilan + '.' }; } }
  ];

  var SARAN = [
    ['Nama asli', 'Siapa nama asli Raja?'],
    ['Sekolah', 'Raja sekolah di mana?'],
    ['Kelahiran', 'Raja lahir kapan?'],
    ['Anak ke berapa', 'Raja anak ke berapa?'],
    ['Hobi', 'Apa hobi Raja?'],
    ['Skill', 'Apa skill Raja?'],
    ['Harga joki', 'Berapa harga joki?'],
    ['Kontak', 'Nomor WA Raja?']
  ];

  /* ====================== MESIN PENCOCOK ====================== */
  function norm(s) {
    s = String(s || '').toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\b([a-z]{3,})(nya)\b/g, '$1')
      .replace(/\s+/g, ' ').trim();
    return s;
  }
  function lev1(a, b) { // true kalau jarak edit <= 1
    if (a === b) return true;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0, j = 0, d = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++d > 1) return false;
      if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
    }
    return d + (la - i) + (lb - j) <= 1;
  }
  function skor(it, teks, toks) {
    var tot = 0, pad = ' ' + teks + ' ';
    for (var i = 0; i < it.k.length; i++) {
      var kw = it.k[i][0], w = it.k[i][1];
      if (pad.indexOf(' ' + kw + ' ') > -1) { tot += w; continue; }
      if (kw.indexOf(' ') === -1 && kw.length >= 5) {
        for (var t = 0; t < toks.length; t++) { if (toks[t].length >= 5 && lev1(toks[t], kw)) { tot += w * 0.8; break; } }
      }
    }
    return tot;
  }
  function cari(q) {
    var teks = norm(q), toks = teks.split(' ');
    var hasil = [];
    if (teks === 'raja' || teks === 'si raja') return [INTENTS.filter(function (i) { return i.id === 'intro'; })[0]];
    INTENTS.forEach(function (it) { var s = skor(it, teks, toks); if (s >= 2) hasil.push({ it: it, s: s }); });
    if (!hasil.length) return [];
    hasil.sort(function (a, b) { return b.s - a.s; });
    var top = hasil[0];
    if (top.it.id === 'bot' && top.s >= 4) return [top.it];
    var pilih = hasil.filter(function (h) { return h.s >= top.s * 0.75; }).map(function (h) { return h.it; });
    if (pilih.length > 1) pilih = pilih.filter(function (i) { return i.id !== 'greet' && i.id !== 'thanks' && i.id !== 'intro'; }).length ? pilih.filter(function (i) { return i.id !== 'greet' && i.id !== 'thanks' && i.id !== 'intro'; }) : pilih;
    var ids = pilih.map(function (i) { return i.id; });
    if (ids.indexOf('harga') > -1) pilih = pilih.filter(function (i) { return i.id !== 'joki'; });
    return pilih.slice(0, 3);
  }

  /* ====================== TAMPILAN ====================== */
  var root = document.createElement('div');
  root.id = 'rjBot';
  root.className = 'rjb';
  root.innerHTML =
    '<section class="rjb-panel" id="rjbPanel" role="dialog" aria-label="Chat dengan Donat, asisten Raja" aria-hidden="true" hidden>' +
      '<header class="rjb-hd">' +
        '<span class="rjb-av"><img class="rjb-f1" src="' + BASE + 'assets/bot-diam.webp" alt="" width="44" height="44"><img class="rjb-f2" src="' + BASE + 'assets/bot-bicara.webp" alt="" width="44" height="44"></span>' +
        '<span class="rjb-tt"><b>Donat</b><small><i></i>Asisten ' + DATA.panggilan + '</small></span>' +
        '<button type="button" class="rjb-x" aria-label="Tutup chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</header>' +
      '<div class="rjb-ms" id="rjbMs" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="rjb-ch" id="rjbCh"></div>' +
      '<form class="rjb-fm" id="rjbFm" autocomplete="off">' +
        '<input id="rjbIn" type="text" maxlength="200" placeholder="Tanya soal ' + DATA.panggilan + '…" aria-label="Tulis pertanyaan">' +
        '<button type="submit" class="rjb-sd" aria-label="Kirim"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z"/></svg></button>' +
      '</form>' +
    '</section>' +
    '<p class="rjb-hint" id="rjbHint" hidden>Tanya aku soal ' + DATA.panggilan + '!</p>' +
    '<button type="button" class="rjb-fab" id="rjbFab" aria-label="Buka chat dengan Donat" aria-expanded="false" aria-controls="rjbPanel">' +
      '<img class="rjb-f1" src="' + BASE + 'assets/bot-diam.webp" alt="" width="84" height="83">' +
      '<img class="rjb-f2" src="' + BASE + 'assets/bot-bicara.webp" alt="" width="84" height="81">' +
    '</button>';
  document.body.appendChild(root);

  var panel = root.querySelector('#rjbPanel'), fab = root.querySelector('#rjbFab'),
      ms = root.querySelector('#rjbMs'), ch = root.querySelector('#rjbCh'),
      fm = root.querySelector('#rjbFm'), inp = root.querySelector('#rjbIn'),
      hint = root.querySelector('#rjbHint'), xbtn = root.querySelector('.rjb-x');
  var buka = false, sibuk = false, sapa = false, talkTimer = 0;

  SARAN.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'rjb-chip'; b.textContent = s[0];
    b.addEventListener('click', function () { kirim(s[1], true); });
    ch.appendChild(b);
  });

  function talk(on) { root.classList.toggle('rjb-talk', on); }
  function scrollBawah() { ms.scrollTop = ms.scrollHeight; }

  function tambah(who, html, isText) {
    var d = document.createElement('div');
    d.className = 'rjb-m rjb-' + who;
    var b = document.createElement('div'); b.className = 'rjb-b';
    if (isText) b.textContent = html; else b.innerHTML = html;
    d.appendChild(b); ms.appendChild(d); scrollBawah();
    return { row: d, bub: b };
  }
  function aksi(bub, act) {
    if (!act || !act.length) return;
    var w = document.createElement('div'); w.className = 'rjb-ac';
    act.forEach(function (a) {
      var l = document.createElement('a');
      l.className = 'rjb-ln' + (a.wa ? ' rjb-wa' : '');
      l.href = a.h; l.textContent = a.t;
      if (a.ext) { l.target = '_blank'; l.rel = 'noopener noreferrer'; }
      if (a.close) l.addEventListener('click', function () { tutup(); });
      w.appendChild(l);
    });
    bub.appendChild(w);
  }
  function jawab(q) {
    var hasil = cari(q);
    if (!hasil.length) {
      return [{ t: 'Hmm, aku belum paham pertanyaan itu 😅. Aku cuma bisa jawab soal ' + DATA.panggilan + ': nama, sekolah, kelahiran, hobi, skill, dan harga joki. Atau langsung chat ' + DATA.panggilan + ' aja.', act: [wa('Chat WhatsApp', 'Halo Raja, aku mau tanya sesuatu.')] }];
    }
    return hasil.map(function (i) { return i.a(); });
  }
  var hist = [];            // riwayat singkat untuk AI
  function simpan(role, text) { hist.push({ role: role, text: String(text).slice(0, 400) }); if (hist.length > 8) hist.shift(); }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }

  function selesai() {
    sibuk = false;
    talkTimer = setTimeout(function () { talk(false); }, 1600); // lalu kembali diam (gambar 4)
  }
  function tampilLokal(q, typing, delay) {
    var jaw = jawab(q);
    setTimeout(function () {
      if (typing) typing.row.remove();
      var i = 0;
      (function next() {
        var j = jaw[i++]; var m = tambah('b', j.t); aksi(m.bub, j.act); scrollBawah();
        simpan('model', plain(j.t));
        if (i < jaw.length) setTimeout(next, 650); else selesai();
      })();
    }, delay);
  }
  var aiTerakhir = 0;
  function sistem() {
    var L = DATA.lahir;
    return 'Kamu adalah "Donat", chatbot ramah di website portofolio milik ' + DATA.namaAsli + ' (dipanggil ' + DATA.panggilan + '). ' +
      'Jawab dalam bahasa Indonesia santai tapi sopan, singkat (maksimal 4 kalimat), boleh sesekali emoji.\n' +
      'FAKTA TENTANG ' + DATA.panggilan.toUpperCase() + ' (hanya ini yang kamu tahu tentangnya): nama ' + DATA.namaAsli + '; asal ' + DATA.asal +
      '; sekolah ' + DATA.sekolah + ', jurusan ' + DATA.jurusan + ', kelas ' + DATA.kelas + '; lahir ' + tglLahir() + ' (umur ' + umur() + ' tahun); anak ke-' + DATA.anakKe +
      '; hobi ' + DATA.hobi.join(', ') + '; skill ' + DATA.skill.join(' dan ') + ', menerima joki; harga joki landing page ' + DATA.hargaLanding +
      ', aplikasi ' + DATA.hargaAplikasi + ' (tergantung fitur); WhatsApp ' + DATA.waTampil + ', Instagram ' + DATA.ig.teks + ', TikTok ' + DATA.tiktok.teks + '.\n' +
      'ATURAN: Tentang ' + DATA.panggilan + ' jawab hanya dari fakta itu, jangan mengarang; kalau tidak ada, bilang tidak tahu dan sarankan tanya lewat WhatsApp. ' +
      'Pertanyaan umum lain boleh dijawab seperti asisten AI. Kamu tidak punya akses internet: untuk jabatan, berita, atau data yang bisa berubah, jawab sebisanya dan sebutkan bahwa infonya mungkin sudah berubah. ' +
      'Jangan membantu hal berbahaya atau ilegal. Jangan mengaku sebagai manusia.';
  }
  function panggilAI(ctl) {
    if (DATA.aiUrl) {      // mode Gemini lewat Worker
      return fetch(DATA.aiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: hist.slice(-7) }), signal: ctl ? ctl.signal : undefined
      }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
        .then(function (d) { return d && typeof d.reply === 'string' ? d.reply : ''; });
    }
    // mode gratis tanpa key
    var msgs = [{ role: 'system', content: sistem() }].concat(hist.slice(-7).map(function (m) {
      return { role: m.role === 'model' ? 'assistant' : 'user', content: m.text };
    }));
    aiTerakhir = Date.now();
    return fetch(DATA.aiGratisUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs }), signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      if (r.status === 402 || r.status === 429) { var e = new Error('limit'); e.limit = true; e.tunggu = parseInt(r.headers.get('Retry-After'), 10) || 30; throw e; }
      if (!r.ok) throw new Error('http ' + r.status);
      return r.text();
    });
  }
  function pesanJeda(detik) {
    return 'Aku lagi istirahat sebentar 😅 (AI gratisan ada jeda). Coba tanya lagi sekitar ' + detik + ' detik lagi ya. Pertanyaan soal ' + DATA.panggilan + ' tetap bisa langsung dijawab.';
  }
  function tanyaAI(q, typing) {
    if (!DATA.aiUrl) {
      var sisa = Math.ceil((31000 - (Date.now() - aiTerakhir)) / 1000);
      if (sisa > 0) { typing.row.remove(); tambah('b', pesanJeda(sisa)); selesai(); return; }
    }
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
    panggilAI(ctl).then(function (t) {
      clearTimeout(to);
      t = String(t || '').trim();
      if (!t) throw new Error('kosong');
      typing.row.remove();
      var m = tambah('b', t, true); m.bub.classList.add('rjb-pre');
      var h = cari(q)[0];   // topik kontak/harga: tetap tampilkan tombol WA
      if (h && (h.id === 'kontak' || h.id === 'harga' || h.id === 'joki')) aksi(m.bub, h.a().act);
      scrollBawah(); simpan('model', t); selesai();
    }).catch(function (e) {
      clearTimeout(to);
      if (e && e.limit) { typing.row.remove(); tambah('b', pesanJeda(e.tunggu)); selesai(); return; }
      aiTerakhir = 0;               // gagal bukan karena limit: jangan kunci pertanyaan berikutnya
      tampilLokal(q, typing, 300);   // AI gagal -> jawaban bawaan
    });
  }
  function kirim(q, lokal) {
    q = String(q || '').trim();
    if (!q || sibuk) return;
    sibuk = true; clearTimeout(talkTimer);
    tambah('u', q, true); simpan('user', q);
    inp.value = '';
    talk(true); // pertanyaan masuk: muka donat berubah (gambar 5)
    var typing = tambah('b', '<span class="rjb-dots"><i></i><i></i><i></i></span>');
    typing.row.classList.add('rjb-typing');
    var punyaAI = !!(DATA.aiUrl || DATA.aiGratis);
    // Mode Gemini: AI dulu. Mode gratis: jawaban bawaan dulu (hemat jatah AI), AI hanya kalau bawaan tidak paham.
    var pakaiAI = !lokal && punyaAI && (DATA.aiUrl || cari(q).length === 0);
    if (pakaiAI) tanyaAI(q, typing);
    else tampilLokal(q, typing, 550 + Math.min(q.length * 10, 600));
  }

  function bukaChat() {
    buka = true; hideHint();
    panel.hidden = false; panel.removeAttribute('aria-hidden');
    requestAnimationFrame(function () { root.classList.add('rjb-open'); });
    fab.setAttribute('aria-expanded', 'true');
    if (!sapa) {
      sapa = true;
      var m = tambah('b', 'Halo! Aku <b>Donat</b> 🍩, asistennya ' + DATA.panggilan + '. Mau tahu apa soal ' + DATA.panggilan + '? Pilih di bawah atau ketik sendiri.');
      m.row.classList.add('rjb-first');
    }
    setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) { } }, 250);
  }
  function tutup() {
    buka = false;
    root.classList.remove('rjb-open');
    fab.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    setTimeout(function () { if (!buka) panel.hidden = true; }, 260);
  }
  function hideHint() { hint.hidden = true; try { sessionStorage.setItem('rjbHint', '1'); } catch (e) { } }

  fab.addEventListener('click', function () { buka ? tutup() : bukaChat(); });
  xbtn.addEventListener('click', function () { tutup(); try { fab.focus({ preventScroll: true }); } catch (e) { } });
  hint.addEventListener('click', bukaChat);
  fm.addEventListener('submit', function (e) { e.preventDefault(); kirim(inp.value); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && buka) { tutup(); try { fab.focus({ preventScroll: true }); } catch (x) { } }
  });

  // bubble ajakan, sekali per sesi
  var sudah = false; try { sudah = sessionStorage.getItem('rjbHint') === '1'; } catch (e) { }
  if (!sudah) {
    setTimeout(function () {
      if (buka || document.documentElement.classList.contains('ldr')) return;
      hint.hidden = false;
      setTimeout(function () { if (!buka) hideHint(); }, 7000);
    }, 4500);
  }
})();
