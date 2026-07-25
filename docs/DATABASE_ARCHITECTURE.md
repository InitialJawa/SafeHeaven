# Database & Data Persistence Architecture — SafeHaven

Dokumen ini menjelaskan arsitektur dual-database yang digunakan oleh platform **SafeHaven** (Indonesian Stock Market Analytics & Portfolio Intelligence Platform).

---

## 1. Dual Persistence Architecture Overview

SafeHaven menggunakan pendekatan **Dual Persistence Layer** untuk mengoptimalkan performa data kuantitatif bursa saham berskala besar sekaligus memberikan penyimpanan real-time untuk state user/interaksi aplikasi.

```
                    ┌────────────────────────────────────────────────────────┐
                    │                      SafeHaven                         │
                    └──────────────────────────┬─────────────────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │                                               │
                       ▼                                               ▼
         ┌───────────────────────────┐                   ┌───────────────────────────┐
         │     Cloudflare D1 /       │                   │  Google Firebase          │
         │     SQLite (Local)        │                   │  Firestore Database       │
         ├───────────────────────────┤                   ├───────────────────────────┤
         │ High-Frequency Analytical │                   │ Real-Time User State      │
         │ & Historical Market Data  │                   │ & Authentication          │
         └───────────────────────────┘                   └───────────────────────────┘
```

---

## 2. Platform Database Breakdown

### Layer A: Cloudflare D1 / SQLite (`safehaven.db`)
* **Tujuan**: Menyimpan data histori pasar & fundamental perusahaan berskala besar yang membutuhkan query SQL kompleks, agregasi cepat, serta sinkronisasi dengan Yahoo Finance API.
* **Auto-Sync Mechanism**:
  - **Price History & Dividends**: Ketika user membuka chart, backtest, atau tombol **Sync API**, server Express (`server.ts`) secara otomatis mengambil data dari Yahoo Finance API, memverifikasi kelengkapan tanggal, dan melakukan `INSERT OR IGNORE` otomatis ke dalam tabel `price_history` & `dividend_history`.
  - **Fundamental Historical Data**: Data laporan keuangan tahunan/kuartalan (seperti PE ratio, PBV, ROE, DER, Market Cap) dari tahun 2021 hingga terbaru disimpan di tabel `fundamentals_historical`.

#### Tabel Utama di Cloudflare D1 / SQLite:
1. `price_history` — Data histori harga harian (OHLCV & % perubahan) dari 2021-sekarang.
2. `fundamentals_historical` — Laporan keuangan & rasio fundamental histori.
3. `dividend_history` — Rekam jejak dividen dan yield histori.
4. `tickers` — Master list emiten bursa saham IHSG / IDX.
5. `daily_scores` — Skor kuantitatif harian (Value, Growth, Momentum, Quality).
6. `market_cache` — Cache indikator makro, IHSG regime, & rotasi Sektor.

---

### Layer B: Google Firebase Firestore (`ai-studio-safeheaven-...`)
* **Tujuan**: Menyimpan data user-specific, otentikasi (Google Auth), serta riwayat interaksi pengguna yang membutuhkan akses terdistribusi dan waktu-nyata.
* **Auto-Sync Mechanism**:
  - Tersinkronisasi secara langsung melalui **Firebase SDK Client (`firebase/firestore`)** dari React Frontend.
  - Memiliki mekanisme **Fallback / Local Caching** via `localStorage` apabila koneksi jaringan terganggu.

#### Koleksi Utama di Firebase Firestore:
1. `/users/{userId}/backtests/{backtestId}` — **[BARU]** Riwayat simulasi backtest yang dijalankan pengguna (dapat dilihat & dihapus di tab Backtest).
2. `/users/{userId}/watchlists/{watchlistId}` — Daftar pantauan saham kustom milik user.
3. `/portfolioConfigs` & `/portfolioSnapshots` — Pengaturan & rekam jejak portofolio investasi.
4. `/alerts` — Aturan dan log notifikasi alert harga/skor.
5. `/users` — Profil otentikasi pengguna.

---

## 3. Ringkasan Sinkronisasi Otomatis

| Kategori Data | Lokasi Database | Otomatis Tersimpan Saat Sync/Refresh? |
| :--- | :--- | :--- |
| **Harga Histori (2021 - Sekarang)** | Cloudflare D1 / SQLite (`price_history`) | **Ya** (Auto Sync dari Yahoo Finance API ke SQLite/D1) |
| **Fundamental Histori (2021 - Sekarang)** | Cloudflare D1 / SQLite (`fundamentals_historical`) | **Ya** (Auto Sync dari API saat update data saham) |
| **Riwayat Backtest & Simulation** | Firebase Firestore (`users/backtests`) | **Ya** (Otomatis tersimpan ke Firestore tiap simulasi) |
| **Watchlist & Portofolio User** | Firebase Firestore (`watchlists`, `portfolioConfigs`) | **Ya** (Real-time sync via Firestore Client SDK) |
