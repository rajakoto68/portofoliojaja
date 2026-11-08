// Perantara aman antara website kamu dan Gemini API.
// API key disimpan di Cloudflare (secret), TIDAK pernah ada di website.
//
// Variabel yang perlu diset di Cloudflare:
//   GEMINI_API_KEY  (Secret)  -> key dari https://aistudio.google.com/apikey
//   ALLOWED_ORIGIN  (Text)    -> alamat websitemu, contoh: https://rajasiyo.vercel.app
//   GEMINI_MODEL    (Text, opsional) -> default "gemini-flash-latest"
//   USE_SEARCH      (Text, opsional) -> "1" = boleh cari info terbaru di Google (default 1)

const SYSTEM = `Kamu adalah "Donat", chatbot ramah di website portofolio milik M Raja Siyo (dipanggil Raja).
Gaya bicara: bahasa Indonesia santai tapi sopan, singkat (maksimal sekitar 4 kalimat), sesekali emoji.

FAKTA TENTANG RAJA (hanya ini yang kamu tahu tentang dia):
- Nama: M Raja Siyo, dipanggil Raja. Asal: Sumatera Utara.
- Sekolah: SMK Swasta Mandiri, jurusan RPL (Rekayasa Perangkat Lunak), kelas XII RPL 1.
- Lahir 31 Desember 2008. Anak ke-8.
- Hobi: gym, ngoding, jalan-jalan (naik gunung/alam).
- Skill: bikin website dan aplikasi. Menerima joki.
- Harga joki: landing page Rp100.000-200.000; aplikasi Rp300.000-500.000 (tergantung fitur).
- Kontak: WhatsApp 0887 0875 9325, Instagram @jafrikoto_, TikTok @jaxfri.

ATURAN:
- Untuk pertanyaan tentang Raja, jawab HANYA dari fakta di atas. Kalau tidak ada di fakta, bilang kamu tidak tahu dan sarankan tanya langsung lewat WhatsApp. Jangan mengarang data pribadi Raja.
- Untuk umur Raja, hitung dari tanggal lahir dan tanggal hari ini: __TODAY__.
- Untuk pertanyaan umum lain (pengetahuan, berita, pelajaran, coding, dll) kamu boleh menjawab seperti asisten AI biasa. Kalau soal terbaru, pakai info terkini yang tersedia dan jangan sok yakin kalau tidak pasti.
- Jangan membantu hal berbahaya atau ilegal. Jangan mengaku sebagai manusia.
- Kamu tidak bisa membuka link atau mengirim file; jangan berjanji melakukannya.`;

const MAX_MSG = 7, MAX_LEN = 400;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin) ? origin : '';
    const cors = {
      'Access-Control-Allow-Origin': okOrigin || 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: 'method' }, 405);
    if (!okOrigin) return json({ error: 'origin tidak diizinkan' }, 403);
    if (!env.GEMINI_API_KEY) return json({ error: 'key belum diset' }, 500);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'json' }, 400); }
    let msgs = Array.isArray(body.messages) ? body.messages.slice(-MAX_MSG) : [];
    msgs = msgs
      .filter(m => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim())
      .map(m => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_LEN) }] }));
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();   // Gemini wajib mulai dari user
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json({ error: 'pesan kosong' }, 400);

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
    const model = env.GEMINI_MODEL || 'gemini-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const payload = {
      systemInstruction: { parts: [{ text: SYSTEM.replace('__TODAY__', today) }] },
      contents: msgs,
      generationConfig: { maxOutputTokens: 500, temperature: 0.6 }
    };
    const call = (withSearch) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify(withSearch ? { ...payload, tools: [{ google_search: {} }] } : payload)
    });

    try {
      let r = await call(env.USE_SEARCH !== '0');
      if (!r.ok && env.USE_SEARCH !== '0') r = await call(false);   // kalau fitur search ditolak, coba tanpa
      if (!r.ok) return json({ error: 'gemini ' + r.status }, 502);
      const d = await r.json();
      const reply = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
      if (!reply) return json({ error: 'kosong' }, 502);
      return json({ reply });
    } catch (e) {
      return json({ error: 'gagal' }, 502);
    }
  }
};
