# SafeHaven - Financial & Stock Analytics Platform (IDX / IHSG)

SafeHaven adalah platform analisis saham dan intelijen pasar keuangan modern yang dirancang khusus untuk investor pasar modal Indonesia (IHSG / IDX). Platform ini menggabungkan data real-time, analisis teknikal & fundamental, visualisasi musiman, perbandingan sektor, serta analisis berbasis kecerdasan buatan (Gemini AI).

---

## 🚀 Fitur Utama

- **Analisis Ticker & Scoring Komprehensif**:
  - Breakdown 6 Dimensi Faktor: Quality, Growth, Value, Momentum, Volume, dan Dividend.
  - Perbandingan kinerja ticker dengan sektor industri dan IHSG.
  - Gauge Analisis Teknikal Real-time & Konsensus Target Harga Analis (Yahoo Finance).
- **Visualisasi & Intelijen Pasar Terpadu**:
  - **Laporan Keuangan**: Laba bersih, pendapatan, dan margin usaha tahunan.
  - **Alokasi Dividen TTM**: Payout ratio, imbal hasil (yield), ex-date, dan tanggal bayar.
  - **Analisis Musiman**: Historis pergerakan bulanan saham (% bulanan).
  - **Kinerja Historis**: 1M, 1B, 3B, 6B, YTD, 1T.
- **AI Stock & Portfolio Advisor**:
  - Ditenagai Google Gemini AI untuk memberikan wawasan kuantitatif, analisis risiko, dan rekomendasi portofolio.
- **Manajemen Portofolio & Watchlist**:
  - Catat posisi saham, estimasi profit/loss, alokasi aset, serta kalkulasi dividen otomatis.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons, Lightweight Charts.
- **Backend**: Express.js, Node.js (`server.ts`).
- **Database**: SQLite (`safehaven.db`).
- **AI & Data Feed**: `@google/genai` (Gemini API) & `yahoo-finance2`.

---

## 📦 Panduan Jalankan Aplikasi

1. **Install Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada `http://localhost:3000`.

3. **Build untuk Produksi**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔄 Petunjuk Migrasi Ke Firebase (Opsional)

Jika ingin memindahkan storage dari SQLite lokal ke Google Firebase (Firestore & Auth):
1. **Export Data SQLite**: Ekspor tabel `watchlist` dan `portfolio` menjadi format JSON.
2. **Setup Firebase Project**: Buat proyek di [Firebase Console](https://console.firebase.google.com/) dan aktifkan **Firestore Database** serta **Firebase Authentication**.
3. **Impor Data ke Firestore**: Jalankan script penyerapan data JSON ke koleksi `users/{userId}/portfolio` dan `users/{userId}/watchlist`.
