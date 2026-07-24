# Panduan Deploy SafeHaven Full-Stack

SafeHaven adalah aplikasi **Full-Stack** (React Frontend + Node.js Express Backend di `server.ts`). Aplikasi ini membutuhkan runtime Node.js untuk menjalankan API backend `/api/*` (seperti data IHSG, Yahoo Finance proxy, scoring AI Gemini, SQLite database, dsb).

---

## Mengapa Cloudflare Pages Mengembalikan Error 404 untuk `/api/*`?

**Cloudflare Pages (`npx wrangler pages deploy dist`) secara default hanya melayani file statis** (HTML, JS, CSS) dari folder `dist/`. Cloudflare Pages **TIDAK** menjalankan server Node.js `server.ts` / `dist/server.cjs`. 

Oleh karena itu:
- Tampilan halaman React dapat terbuka, tetapi
- Semua panggilan API ke `/api/market/snapshot`, `/api/portfolio/*`, `/api/live-tickers`, dll. gagal dengan status **404 Not Found**.

---

## Solusi Deploy yang Direkomendasikan

### Opsi 1: Container / Node.js Host (Sangat Direkomendasikan)
Deploy menggunakan **Dockerfile** yang telah disediakan ke salah satu platform hosting Node.js (seperti Railway, Render, Google Cloud Run, VPS, Koolify, dll.):

1. **Atur Environment Variables di Platform Hosting**:
   - `GEMINI_API_KEY`: Key Gemini API untuk scoring & AI advisory.
   - `CLOUDFLARE_ACCOUNT_ID`: Account ID Cloudflare D1 Anda.
   - `CLOUDFLARE_D1_DATABASE_ID`: Database ID D1 Anda.
   - `CLOUDFLARE_API_TOKEN`: API Token Cloudflare D1 dengan izin D1 Edit.

2. **Jalankan via Docker**:
   ```bash
   docker build -t safehaven .
   docker run -p 3000:3000 \
     -e GEMINI_API_KEY="your_gemini_key" \
     -e CLOUDFLARE_ACCOUNT_ID="your_account_id" \
     -e CLOUDFLARE_D1_DATABASE_ID="your_db_id" \
     -e CLOUDFLARE_API_TOKEN="your_token" \
     safehaven
   ```
   Atau langsung sambungkan repository GitHub Anda ke **Railway**, **Render**, atau **Cloud Run**. Platform hosting akan otomatis menjalankan `Dockerfile` / `package.json` (`npm run build` & `npm start`). Server Node.js akan melayani seluruh endpoint `/api/*` sekaligus menyajikan tampilan frontend React secara seamless, serta terhubung langsung ke **Cloudflare D1 Database**.

---

### Opsi 2: Menggunakan Cloudflare Pages (Frontend) + Dedicated Node.js Backend

Jika Anda tetap ingin menggunakan Cloudflare Pages untuk Frontend:
1. Deploy Backend Express (`dist/server.cjs` via `npm start`) ke VPS / Railway / Render / Cloud Run (misal di URL `https://api.safeheaven.quantbit.pro`).
2. Di Cloudflare Pages, tambahkan file `_redirects` di folder `dist/` atau atur routing proxy `/api/*` ke URL backend Anda.

Contoh file `dist/_redirects`:
```
/api/* https://api.safeheaven.quantbit.pro/api/:splat 200
/* /index.html 200
```

---

## Cara Menjalankan Server Production Secara Lokal / VPS

1. **Build project**:
   ```bash
   npm run build
   ```

2. **Jalankan server production**:
   ```bash
   npm start
   ```
   Server akan berjalan di `http://0.0.0.0:3000` dan melayani API `/api/*` sekaligus asset frontend secara lengkap.
