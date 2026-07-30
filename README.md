<div align="center">

  <!-- Animated Header Banner -->
  <a href="#">
    <img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=800&size=32&pause=1200&color=CCFF00&center=true&vCenter=true&random=false&width=700&height=80&lines=%F0%9F%9B%A1%EF%B8%8F+SafeHaven+IHSG+Analytics;%F0%9F%93%88+Quant+6-Factor+Scoring+%26+Backtest;%F0%9F%A4%96+Powered+by+Google+Gemini+AI;%F0%9F%92%B3+Saweria+Payment+Gateway+Integration" alt="SafeHaven Header Typing" />
  </a>

  <h3><strong>SafeHaven - Indonesian Stock Market (IDX / IHSG) Intelligence Platform</strong></h3>

  <p align="center">
    Platform analytics pasar saham Indonesia tingkat lanjut berbasis data real-time, analisis kuantitatif 6 dimensi, AI Advisor (Google Gemini), penguji strategi kuantitatif, dan manajemen portofolio terpadu.
  </p>

  <br />

  <!-- Shields Badges -->
  <p align="center">
    <a href="#-teknologi--arsitektur">
      <img src="https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
    </a>
    <a href="#-teknologi--arsitektur">
      <img src="https://img.shields.io/badge/Backend-Express.js_%7C_Node.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Node" />
    </a>
    <a href="#-teknologi--arsitektur">
      <img src="https://img.shields.io/badge/AI_Engine-Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" />
    </a>
    <a href="#-teknologi--arsitektur">
      <img src="https://img.shields.io/badge/Database-SQLite_%2B_Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="SQLite & Firebase" />
    </a>
    <a href="#-gateway-pembayaran-saweria">
      <img src="https://img.shields.io/badge/Payment-Saweria_Gateway-00F0FF?style=for-the-badge&logo=fastapi&logoColor=black" alt="Saweria" />
    </a>
  </p>

  <br />

  <!-- Visual Divider -->
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="SafeHaven Divider" />

</div>

<br />

## 🌟 Fitur Unggulan

### 📊 1. Real-Time Market Intelligence & Ticker Detail
* **Indikator Market Regime**: Deteksi tren IHSG secara otomatis (*Bullish, Bearish, Neutral, Crisis Mode*).
* **Scoring Kuantitatif 6 Faktor**: Evaluasi komprehensif saham berdasarkan faktor *Quality, Growth, Value, Momentum, Volume,* dan *Dividend*.
* **Interactive TradingView & Technical Charts**: Tampilan grafik lilin (*candlestick*), Moving Averages (MA20/50/200), RSI, MACD, dan Volume.
* **Integrasi Data Yahoo Finance**: Widget konsensus target harga analis, Seasonality (heatmap kinerja bulanan), Laporan Keuangan (Revenue/Net Income), dan alokasi dividen TTM.

### 🤖 2. Gemini AI Stock & Portfolio Advisor
* **Analisis Otomatis Saham**: Memberikan *reasoning* kuantitatif dan rekomendasi aksi (*BUY/HOLD/SELL*) berbasis berita dan indikator fundamental.
* **Smart Portfolio Rebalancer**: Rekomendasi alokasi ulang aset portofolio untuk mengoptimalkan *risk-adjusted return*.
* **Keamanan API Key**: Semua permintaan AI diproses secara aman di *server-side* (`/api/ai/*`) tanpa mengumbar API key ke browser.

### 🧪 3. Quantitative Backtest & Rebalance Lab
* **Pengujian Strategi**: Uji performa historis strategi *Warren Buffett (Value)*, *Momentum Alpha*, *Dividend Quality*, dan *High Growth*.
* **Multi-Asset Allocation**: Kelola alokasi Saham, Emas, Cash, dan USD dengan kalkulasi rasio risiko secara real-time.
* **Crash Shield & Circuit Breaker**: Mekanisme pengereman risiko otomatis saat pasar mengalami penurunan ekstrem.

### 💳 4. Saweria Payment Gateway & VIP Pro Access
* **Integrasi Saweria Direct Checkout**: Pengguna dapat memilih Paket **Pro (Rp 30.000/bln)** atau **Premium VIP (Rp 20.800/bln)** dan langsung diarahkan ke merchant Saweria.
* **Manajemen Pembayaran dari Admin Console**: Administrator dapat mengonfigurasi URL Saweria, nama merchant, serta mengaktifkan status **VIP / Platinum** pengguna secara manual dari panel admin.

### 🛡️ 5. Admin Operations & Mission Control (`/admin`)
* **Payment Console**: Pengaturan gateway Saweria, preview struktur harga, dan aktivasi role user.
* **Overview & System Metrics**: Pemantauan kesehatan server, kuota AI, dan log aktivitas.
* **Stress & Crisis Simulator**: Simulasi skenario krisis pasar IHSG (*Crash 2008, COVID Panic, Fed Rate Hike*).
* **Broadcast Console**: Pengiriman pengumuman & sinyal pasar ke seluruh member.
* **User Management & Database Console**: Pengelolaan hak akses member dan sinkronisasi SQLite / Firestore.

---

## 🏗️ Struktur Proyek

Directory project telah dirapikan dan disesuaikan dengan konvensi proyek:

```
├── public/                 # Favicon dan logo visual SafeHaven
├── scripts/                # Automasi, perbaikan, dan patch terorganisir
│   ├── checks/             # Validation & health checks
│   ├── debug/              # Debugging utilities
│   ├── fixes/              # Hotfixes & bug fixes
│   ├── maintenance/        # Database & system maintenance
│   ├── patches/            # Patch scripts & UI enhancements
│   └── _archive/           # Legacy scripts
├── src/
│   ├── admin/              # Panel Kontrol Admin (Payment, Risk, Users, Rebalance, etc.)
│   ├── components/         # Komponen UI Reusable (Widgets, Charts, Modals, Navbar)
│   ├── lib/                # Konfigurasi Firebase, Utility, & Helpers
│   ├── pages/              # Halaman Utama (Dashboard, TickerDetail, Portfolio, Premium, Admin)
│   ├── routes/             # App Layout & Protected Routes
│   ├── stores/             # State Management Terpusat (Zustand)
│   └── types.ts            # Definisi Interface & Type TypeScript
├── .env.example            # Template Environment Variables
├── firebase-blueprint.json # Schema Blueprint Firebase Firestore
├── firestore.rules         # Aturan Keamanan Database Firestore
├── safehaven.db            # Database SQLite Lokal
├── server.ts               # Express Backend API, Data Proxies, & AI Services
├── tsconfig.json           # Konfigurasi TypeScript
├── vite.config.ts          # Konfigurasi Build Vite & Dev Server (Port 3000)
└── README.md               # Dokumentasi Proyek
```

---

## ⚡ Panduan Instalasi & Memulai

### 1. Prasyarat
- **Node.js**: v18.x atau versi terbaru
- **npm**: v9.x atau versi terbaru

### 2. Cloning & Install Dependencies
```bash
# Clone repository
git clone https://github.com/YourRepo/SafeHaven.git
cd SafeHaven

# Install dependensi
npm install
```

### 3. Konfigurasi Environment Variable
Salin `.env.example` ke `.env` jika memerlukan konfigurasi khusus:
```bash
cp .env.example .env
```
Isi variabel yang diperlukan seperti `GEMINI_API_KEY`.

### 4. Jalankan Development Server
```bash
npm run dev
```
Aplikasi akan berjalan di: **`http://localhost:3000`**

### 5. Build untuk Produksi
```bash
# Compile TypeScript & bundle server
npm run build

# Jalankan server produksi
npm start
```

---

## 💳 Pengaturan Saweria Payment di Admin Console

1. Masuk ke halaman **Admin Console** via menu navigasi atau URL `/admin`.
2. Jika diperlukan, masukkan PIN Admin (default: `888888`).
3. Pilih tab **Saweria & Payment**.
4. Masukkan **URL Link Saweria Admin** (contoh: `https://saweria.co/SafeHavenAdmin`).
5. Klik **Simpan Pengaturan Saweria**.
6. Saat pengguna menekan tombol *Get it Now* di halaman **Premium**, mereka akan langsung diarahkan ke link Saweria tersebut.
7. Setelah pengguna mentransfer via Saweria, Admin dapat meng-upgrade akun pengguna menjadi **VIP / Advisor** di section *Aktivasi Manual VIP / Platinum*.

---

## 🔏 Lisensi & Hak Cipta

Diproduksi & Dikembangkan oleh **SafeHaven Development Team**.  
Seluruh konten, algoritma scoring, dan materi analisis pasar ditujukan untuk tujuan edukasi dan keputusan investasi berbasis riset kuantitatif.

<br />

<div align="center">
  <sub>Built with ❤️ for Indonesian Retail Investors & Traders.</sub>
</div>
