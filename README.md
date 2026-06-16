# Catatan Diskusi Idadiyah

Aplikasi catatan sederhana yang dapat dideploy ke GitHub dan Cloudflare Pages.

## Struktur
- `catatan-diskusi.html` — UI utama dan penyimpanan lokal sementara.
- `functions/api/ai.js` — worker proxy untuk permintaan Mistral.
- `functions/api/neon.js` — endpoint status Neon placeholder.

## Cloudflare Pages
1. Buat repo GitHub dari folder ini.
2. Hubungkan repo ke Cloudflare Pages.
3. Pastikan Pages menggunakan "Root" folder repo dan tidak memerlukan build step untuk file HTML statis.
4. Cloudflare Pages mendeteksi `functions/` secara otomatis untuk route serverless.

## Environment Variables
Tambahkan di Cloudflare Pages:
- `MISTRAL_API_KEY` — API key Mistral untuk worker AI.
- `NEON_DATABASE_URL` — connection string Neon untuk penggunaan database nanti.

## Endpoint yang tersedia
- `/api/ai` — menerima POST JSON dengan `prompt`, `history`, dan `model`.
- `/api/neon` — menampilkan apakah `NEON_DATABASE_URL` sudah dikonfigurasi.

## Notes
- Saat ini UI masih menggunakan `localStorage` untuk menyimpan catatan.
- Untuk menyimpan catatan ke Neon, buat endpoint worker baru dan panggil dari frontend.
- `WORKER_BASE_URL` di `catatan-diskusi.html` sudah diset ke `/api`.
