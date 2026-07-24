# Panduan Deploy SafeHaven ke Cloudflare

SafeHaven dapat dideploy ke **Cloudflare Pages** (untuk frontend SPA) atau **Cloudflare Workers** (full-stack dengan Express/Node adapter).

## Opsi 1: Cloudflare Pages (Frontend SPA + API Client)

Jika Anda ingin mendeploy SafeHaven sebagai Static Single Page Application (SPA) yang terhubung ke server eksternal atau mode client-side:

1. **Build Command**:
   ```bash
   npm run build
   ```
2. **Output Directory**: 
   `dist`
3. **Pengaturan di Cloudflare Dashboard**:
   - Hubungkan repository GitHub Anda ke Cloudflare Pages.
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Tambahkan Environment Variables (misal: `GEMINI_API_KEY`) di menu Settings > Environment Variables.

---

## Opsi 2: Cloudflare Workers / Pages Functions (Full-Stack Express)

Jika Anda ingin menjalankan backend Express dan API Yahoo Finance & Gemini secara native di Cloudflare Workers:

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
2. Login ke Cloudflare:
   ```bash
   wrangler login
   ```
3. Deploy menggunakan Wrangler:
   ```bash
   npm run build
   wrangler deploy
   ```
