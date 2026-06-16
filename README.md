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
3. Pastikan Pages menggunakan "Root" folder repo.
4. Cloudflare Pages mendeteksi `functions/` secara otomatis dan akan menjalankan file di `functions/api/` sebagai route.
5. Jangan lupa set environment variables di Pages: `MISTRAL_API_KEY` dan `NEON_DATABASE_URL`.

## Environment Variables
Tambahkan di Cloudflare Pages secrets:
- `MISTRAL_API_KEY` — API key Mistral untuk worker AI.
- `NEON_DATABASE_URL` — connection string Neon PostgreSQL, misalnya:
  `postgresql://user:password@<host>:5432/<database>?sslmode=require`

## Endpoint yang tersedia
- `/api/ai` — POST JSON dengan `prompt`, `history`, dan `model`.
- `/api/neon` — GET status konfigurasi Neon.
- `/api/notes` — GET daftar catatan, POST buat/ubah catatan.
- `/api/notes/:id` — GET satu catatan, PUT perbarui, DELETE hapus.

## Setup Neon

1. Buat database Neon dan salin `DATABASE_URL`.
2. Jalankan `sql/neon_schema.sql` di database Neon untuk membuat tabel `notes`.
3. Set `NEON_DATABASE_URL` di Cloudflare Pages.
4. Deploy Pages dan worker akan otomatis tersedia pada route `/api/...`.

## Local testing
- Jalankan `npm install` dalam folder repo.
- Jika ingin, gunakan `npx wrangler pages dev .` untuk menjalankan Pages lokal.

## Deploy
1. Commit semua file ke GitHub termasuk `package.json`, `package-lock.json`, dan `.github/workflows/pages-deploy.yml`.
2. Pastikan repo sudah berada di branch `main`.
3. Buat GitHub Secrets di repo:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Setelah itu, GitHub Actions akan otomatis menjalankan workflow `Deploy to Cloudflare Pages` setiap kali push ke branch `main`.
5. Set environment variables di Cloudflare Pages: `MISTRAL_API_KEY` dan `NEON_DATABASE_URL`.
6. Pages akan langsung serve HTML statis dan worker function di route `/api/`.

## Notes
- `index.html` menggunakan localStorage sebagai fallback.
- Jika Neon aktif, frontend akan sinkron ke `/api/notes`.
- Worker backend siap dipanggil dari frontend tanpa menyimpan API key ke browser.
