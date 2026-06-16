# Catatan Diskusi Idadiyah

Aplikasi catatan diskusi yang dapat dideploy ke GitHub dan Cloudflare Pages dengan backend Neon.

## Struktur
- `index.html` — UI utama, sinkronisasi lokal dan backend Neon.
- `functions/api/ai.js` — worker proxy untuk permintaan Mistral.
- `functions/api/neon.js` — checker status Neon.
- `functions/api/notes/index.js` — endpoint backend untuk daftar dan simpan catatan.
- `functions/api/notes/[id].js` — endpoint backend untuk ambil, perbarui, dan hapus catatan.
- `sql/neon_schema.sql` — skema tabel Neon PostgreSQL.
- `package.json` — dependency runtime worker `@neondatabase/serverless`.

## Cloudflare Pages
1. Buat repo GitHub dari folder ini.
2. Hubungkan repo ke Cloudflare Pages.
3. Pastikan Pages menggunakan "Root" folder repo dan tidak memerlukan build step untuk file HTML statis.
4. Cloudflare Pages mendeteksi `functions/` secara otomatis untuk route serverless.

## Environment Variables
Tambahkan di Cloudflare Pages:
- `MISTRAL_API_KEY` — API key Mistral untuk worker AI.
- `NEON_DATABASE_URL` — connection string Neon untuk database Neon.

## Endpoint yang tersedia
- `/api/ai` — POST JSON dengan `prompt`, `history`, dan `model`.
- `/api/neon` — GET status konfigurasi Neon.
- `/api/notes` — GET daftar catatan, POST buat/ubah catatan.
- `/api/notes/:id` — GET satu catatan, PUT perbarui, DELETE hapus.

## Setup Neon
1. Buat database Neon dan salin `DATABASE_URL`.
2. Set `NEON_DATABASE_URL` di Cloudflare Pages.
3. Jalankan `sql/neon_schema.sql` di database Neon.

## Deploy
- `npm install` untuk menginstall dependency worker.
- Pastikan `functions/` terdapat di repo dan environment variables aktif.
- Kunjungi halaman Cloudflare Pages, mulai publish.

## Notes
- `index.html` menggunakan localStorage sebagai fallback.
- Jika Neon aktif, frontend akan sinkron ke `/api/notes`.
- Worker backend siap dipanggil dari frontend tanpa menyimpan API key ke browser.
