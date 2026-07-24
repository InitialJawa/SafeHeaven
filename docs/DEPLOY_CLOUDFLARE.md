# Panduan Deploy SafeHaven ke Cloudflare

> ⚠️ **Catatan Penting Full-Stack**:
> SafeHaven adalah aplikasi **Full-Stack** (React + Node.js Express backend).
> Jika Anda hanya melakukan deploy folder statis `dist/` ke **Cloudflare Pages**, frontend akan terbuka tetapi semua endpoint `/api/*` akan bernilai **404 Not Found** karena Cloudflare Pages statis tidak menjalankan runtime Node.js `server.ts`.
>
> **Rekomendasi**:
> 1. Deploy backend Express ke **Docker / Railway / Render / Cloud Run / VPS** (menggunakan `Dockerfile` di root proyek).
> 2. Jika tetap memakai Cloudflare Pages untuk Frontend, arahkan proxy `/api/*` ke URL backend melalui `dist/_redirects` (lihat `docs/DEPLOYMENT.md`).

## Cara Deploy Static Assets ke Cloudflare Pages

1. **Pastikan Login ke Wrangler**:
   ```bash
   npx wrangler login
   ```

2. **Build dan Deploy**:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

## Konfigurasi `wrangler.toml`
```toml
name = "safehaven"
compatibility_date = "2026-07-24"
pages_build_output_dir = "./dist"

[assets]
directory = "./dist"

[vars]
NODE_ENV = "production"
```


