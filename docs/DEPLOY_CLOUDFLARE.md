# Panduan Deploy SafeHaven ke Cloudflare

SafeHaven dapat dideploy ke **Cloudflare Pages** menggunakan konfigurasi modern `pages_build_output_dir`.

## Cara Deploy ke Cloudflare Pages

1. **Pastikan Login ke Wrangler**:
   ```bash
   npx wrangler login
   ```

2. **Build dan Deploy**:
   ```bash
   npm run deploy
   ```
   Atau manual:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

## Konfigurasi `wrangler.toml`
Pastikan `wrangler.toml` menggunakan `pages_build_output_dir = "./dist"` tanpa konfigurasi legacy `[site]` yang mencari `workers-site/index.js`:
```toml
name = "safehaven"
compatibility_date = "2026-07-24"
pages_build_output_dir = "./dist"

[vars]
NODE_ENV = "production"
```

