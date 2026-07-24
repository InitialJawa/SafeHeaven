/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { 
  Play, 
  ShieldAlert, 
  AlertTriangle, 
  Send, 
  Terminal, 
  Zap, 
  RefreshCw, 
  SlidersHorizontal, 
  Layers, 
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Activity,
  CheckCircle2,
  Database,
  Search,
  Code,
  AlertCircle,
  Server,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';

export const Admin: React.FC = () => {
  const { portfolioConfig, fetchInitialData } = useAppStore();
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState<'Score' | 'Price' | 'Crash' | 'Rebalance'>('Crash');
  
  // Custom stress sliders
  const [customEquity, setCustomEquity] = useState(-10);
  const [customGold, setCustomGold] = useState(12);
  const [customUSD, setCustomUSD] = useState(6);

  // Database Console State
  const [dbStats, setDbStats] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [activeTable, setActiveTable] = useState<'price_history' | 'fundamentals_historical' | 'custom'>('price_history');
  const [sqlQuery, setSqlQuery] = useState('SELECT ticker, count(*) as total_records FROM price_history GROUP BY ticker ORDER BY total_records DESC LIMIT 15;');
  const [tickerFilter, setTickerFilter] = useState('RAJA');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Admin session initialized. Ready for stress test & rebalance triggers.`,
    `[${new Date().toLocaleTimeString()}] Active Portfolio Strategy: ${portfolioConfig?.strategyName || 'Warren Buffett'} | Target Allocation: ${portfolioConfig?.allocationSaham || 60}% Saham`
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 40));
  };

  const fetchDbStats = async () => {
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/db/stats`);
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch (err) {
      console.error('Gagal mengambil statistik database:', err);
    }
  };

  useEffect(() => {
    fetchDbStats();
  }, []);

  const runSqlQuery = async (customQuery?: string) => {
    setDbLoading(true);
    setQueryError(null);
    setQueryResult(null);
    
    let queryToRun = customQuery || sqlQuery;
    
    // Construct query if using table preset
    if (!customQuery && activeTable !== 'custom') {
      if (activeTable === 'price_history') {
        queryToRun = tickerFilter.trim() 
          ? `SELECT * FROM price_history WHERE ticker = '${tickerFilter.toUpperCase().trim()}' ORDER BY date DESC LIMIT 20;`
          : `SELECT * FROM price_history ORDER BY date DESC LIMIT 20;`;
      } else {
        queryToRun = tickerFilter.trim()
          ? `SELECT * FROM fundamentals_historical WHERE ticker = '${tickerFilter.toUpperCase().trim()}' ORDER BY report_date DESC LIMIT 10;`
          : `SELECT * FROM fundamentals_historical ORDER BY report_date DESC LIMIT 10;`;
      }
    }

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/db/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: queryToRun })
      });
      
      const data = await res.json();
      if (data.success) {
        setQueryResult(data);
        addLog(`SQL Query executed: "${queryToRun.substring(0, 45)}..."`);
      } else {
        setQueryError(data.error || 'Terjadi kesalahan eksekusi query.');
      }
    } catch (err: any) {
      setQueryError(err.message || 'Kesalahan koneksi ke server.');
    } finally {
      setDbLoading(false);
    }
  };

  const triggerPost = async (endpoint: string, body?: any, successMsg?: string) => {
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      if (res.ok) {
        const json = await res.json();
        addLog(`SUCCESS [${endpoint}]: ${json.message || 'Action executed'}`);
        if (successMsg) toast.success(successMsg);
        await fetchInitialData();
      } else {
        toast.error('Trigger gagal diproses oleh server.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan jaringan.');
    }
  };

  const handleSendManualAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertText.trim()) return;

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/admin/add-manual-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertText, type: alertType })
      });

      if (res.ok) {
        addLog(`Broadcast Notification: [${alertType}] "${alertText}"`);
        toast.success('Pesan broadcast disebarkan ke seluruh tab!');
        setAlertText('');
        await fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin-workspace" className="px-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              Admin & Market Stress Console
            </h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
              Laboratorium pengujian krisis pasar (Stress Test), simulasi rebalancing, dan broadcast sinyal real-time.
            </p>
          </div>
        </div>

        {/* Global Reset Button */}
        <button
          onClick={() => triggerPost('reset-simulation', null, 'Seluruh parameter bursa & portofolio dipulihkan ke normal!')}
          className="px-4 py-2.5 bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white border border-[#1b1926] text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#ccff00]" /> Reset Kondisi Normal
        </button>
      </div>

      {/* Active State Status Banner */}
      {portfolioConfig?.activeStressScenario && (
        <div className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ff3366] shrink-0 animate-bounce" />
            <div>
              <div className="text-xs font-extrabold text-[#ff3366] uppercase font-mono tracking-wider">
                Status Skenario Aktif
              </div>
              <p className="text-xs text-white font-bold font-sans mt-0.5">
                {portfolioConfig.activeStressScenario}
              </p>
            </div>
          </div>
          <button
            onClick={() => triggerPost('trigger-rebalance', null, 'Rebalancing dieksekusi! Alokasi dinormalisasi kembali.')}
            className="px-3.5 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer"
          >
            Eksekusi Rebalance Sekarang
          </button>
        </div>
      )}

      {/* Main Grid: 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN (8 cols): Stress Test Suite & Rebalance Lab */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Section 1: Black Swan & Crisis Stress Test Suite */}
          <div className="card card-elevated p-6 space-y-5 bg-[#0b0a10]/45">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#ff3366]" /> Modul Simulasi Krisis Pasar & Black Swan
                </h3>
                <p className="text-[11px] text-[#686477] mt-0.5 font-sans">
                  Injeksi kejutan makro ekonomi untuk menguji ketahanan portofolio dan respon Crash Shield.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-1 bg-[#111018] border border-[#1b1926] text-[#ccff00] rounded-lg">
                STRESS TEST SUITE
              </span>
            </div>

            {/* Quick Scenario Preset Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Preset 1: Black Swan Crash */}
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl flex flex-col justify-between space-y-3 hover:border-red-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#ff3366] uppercase font-mono">Skenario #1</span>
                    <TrendingDown className="w-4 h-4 text-[#ff3366]" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white mt-1">Black Swan Crisis (-15%)</h4>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5">Kejatuhan bursa massal. Uji batas pertahanan Crash Shield & rotasi otomatis.</p>
                </div>
                <button
                  onClick={() => triggerPost('trigger-crash', null, 'Injeksi Black Swan Crisis (-15%) berhasil dikirim ke seluruh tab!')}
                  className="w-full py-2 bg-[#ff3366] hover:bg-[#ff5588] text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#ff3366]/10"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Trigger Black Swan
                </button>
              </div>

              {/* Preset 2: Moderate Correction */}
              <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3 hover:border-[#ccff00]/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#00f0ff] uppercase font-mono">Skenario #2</span>
                    <Activity className="w-4 h-4 text-[#00f0ff]" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white mt-1">Koreksi Pasar Sedang (-6%)</h4>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5">Penurunan wajar siklus pasar. Uji kestabilan skor kuantitatif saham.</p>
                </div>
                <button
                  onClick={() => triggerPost('trigger-stress', { scenario: 'correction' }, 'Koreksi pasar (-6%) diinjeksikan.')}
                  className="w-full py-2 bg-[#00f0ff] hover:bg-cyan-300 text-black text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" /> Trigger Koreksi -6%
                </button>
              </div>

              {/* Preset 3: Commodity Rally */}
              <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3 hover:border-amber-500/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase font-mono">Skenario #3</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white mt-1">Rali Komoditas & Emas (+15%)</h4>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5">Lonjakan harga emas & saham pertambangan, perbankan terkoreksi.</p>
                </div>
                <button
                  onClick={() => triggerPost('trigger-stress', { scenario: 'gold_rally' }, 'Rali Komoditas & Emas diinjeksikan!')}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" /> Trigger Emas +15%
                </button>
              </div>

              {/* Preset 4: High Inflation & Rate Hike */}
              <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3 hover:border-purple-500/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-purple-400 uppercase font-mono">Skenario #4</span>
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white mt-1">Kenaikan Suku Bunga & USD</h4>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5">Depresiasi Rupiah. USD Cash & Emas outperform saham domestik.</p>
                </div>
                <button
                  onClick={() => triggerPost('trigger-stress', { scenario: 'inflation' }, 'Skenario inflasi tinggi diinjeksikan!')}
                  className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" /> Trigger Inflation Shock
                </button>
              </div>

            </div>

            {/* Custom Parametric Sliders */}
            <div className="pt-4 border-t border-[#1b1926] space-y-4">
              <h4 className="text-xs font-extrabold text-white font-sans flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ccff00]" /> Parameter Stress Test Kustom
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                {/* Equity Shift Slider */}
                <div className="bg-[#111018] p-3 rounded-xl border border-[#1b1926] space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9f9bac]">Guncangan Saham</span>
                    <span className={`font-mono font-bold ${customEquity < 0 ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
                      {customEquity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="20"
                    value={customEquity}
                    onChange={(e) => setCustomEquity(Number(e.target.value))}
                    className="w-full accent-[#ccff00] cursor-pointer"
                  />
                </div>

                {/* Gold Shift Slider */}
                <div className="bg-[#111018] p-3 rounded-xl border border-[#1b1926] space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9f9bac]">Apresiasi Emas</span>
                    <span className={`font-mono font-bold ${customGold < 0 ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
                      +{customGold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="30"
                    value={customGold}
                    onChange={(e) => setCustomGold(Number(e.target.value))}
                    className="w-full accent-[#00f0ff] cursor-pointer"
                  />
                </div>

                {/* USD Shift Slider */}
                <div className="bg-[#111018] p-3 rounded-xl border border-[#1b1926] space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#9f9bac]">Kurs USD/IDR</span>
                    <span className={`font-mono font-bold ${customUSD < 0 ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
                      +{customUSD}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="20"
                    value={customUSD}
                    onChange={(e) => setCustomUSD(Number(e.target.value))}
                    className="w-full accent-[#a855f7] cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => triggerPost('trigger-stress', {
                  scenario: 'custom',
                  customEquity,
                  customGold,
                  customUSD
                }, `Stress test kustom diinjeksikan: Saham ${customEquity}%, Emas +${customGold}%, USD +${customUSD}%`)}
                className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#ccff00]/10"
              >
                <Zap className="w-4 h-4 fill-current" /> Jalankan Stress Test Kustom
              </button>
            </div>
          </div>

          {/* Section 2: Rebalancing Engine & Asset Drift Lab */}
          <div className="card card-elevated p-6 space-y-5 bg-[#0b0a10]/45">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ccff00]" /> Laboratorium Rebalancing & Drift Simulasi
                </h3>
                <p className="text-[11px] text-[#686477] mt-0.5 font-sans">
                  Uji efektivitas algoritma rebalancing otomatis dalam menyeimbangkan alokasi portofolio ke formula sasaran.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Force Rebalance Action */}
              <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-white">Eksekusi Rebalancing Otomatis</h4>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5">
                    Kalkulasi ulang pembobotan konstituen, trimming saham berlebih, dan kembalikan porsi modal ke formula aktif.
                  </p>
                </div>
                <button
                  onClick={() => triggerPost('trigger-rebalance', null, 'Rebalancing portofolio sukses dieksekusi!')}
                  className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rebalance Ke Target Formula
                </button>
              </div>

              {/* Drift Simulator Action */}
              <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-white">Simulasi Deviasi Porsi (Asset Drift)</h4>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5">
                    Kondisikan porsi Saham melonjak ke 75% akibat reli, sehingga pengguna bisa menguji tombol Rebalance di tab Overview.
                  </p>
                </div>
                <button
                  onClick={() => triggerPost('trigger-drift', null, 'Simulasi Deviasi Alokasi (+15% Saham) diinjeksikan!')}
                  className="w-full py-2.5 bg-[#1b1926] hover:bg-[#282538] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border border-[#2d2a3e] flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-[#00f0ff]" /> Injeksi Asset Drift (+15% Saham)
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): Broadcast Notifikasi & Terminal Audit Logs */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Quick Trigger Basics */}
          <div className="card card-elevated p-6 bg-[#0b0a10]/45 space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono text-[#ccff00]">
              Quick Market Triggers
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => triggerPost('trigger-scoring', null, 'Scoring LQ45 diperbarui secara dinamis!')}
                className="w-full p-3 bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] rounded-xl text-left flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer"
              >
                <span>Re-Scoring Faktor Kuantitatif</span>
                <Play className="w-3 h-3 text-[#ccff00] fill-current" />
              </button>

              <button
                onClick={() => triggerPost('trigger-prices', null, 'Volatilitas bursa live diinjeksikan!')}
                className="w-full p-3 bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] rounded-xl text-left flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer"
              >
                <span>Injeksi Volatilitas Harga Real-time</span>
                <Play className="w-3 h-3 text-[#00f0ff] fill-current" />
              </button>
            </div>
          </div>

          {/* Broadcast Notification Sender */}
          <div className="card card-elevated p-6 bg-[#0b0a10]/45 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
              <Send className="w-4 h-4 text-[#ccff00]" /> Broadcast Sinyal Ke Seluruh Tab
            </h3>

            <form onSubmit={handleSendManualAlert} className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[#9f9bac] font-extrabold uppercase text-[10px]">Kategori Alert</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as any)}
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#ccff00]/40"
                >
                  <option value="Crash" className="bg-[#111018]">Crash / Market Crisis</option>
                  <option value="Rebalance" className="bg-[#111018]">Rebalance Warning</option>
                  <option value="Score" className="bg-[#111018]">Score Update</option>
                  <option value="Price" className="bg-[#111018]">Price Watchdog</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[#9f9bac] font-extrabold uppercase text-[10px]">Isi Pesan Sistem</label>
                  <span className="text-[10px] text-[#686477]">Template Cepat</span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={alertText}
                  onChange={(e) => setAlertText(e.target.value)}
                  placeholder="Tuliskan berita bursa atau pemicu darurat untuk ditayangkan di notifikasi..."
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl p-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs"
                />
                
                {/* Broadcast Preset Quick Chips */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {[
                    { label: 'Volatilitas Perbankan', text: 'Peringatan Volatilitas Sektor Perbankan: IHSG tertekan oleh aksi net-foreign sell pada emiten Big Cap.' },
                    { label: 'Rebalance Bulanan', text: 'Sinyal Rebalancing Bulanan: Disarankan melakukan pemutakhiran portofolio mengikuti skor kuantitatif terbaru.' },
                    { label: 'Crash Shield Level 1', text: 'Crash Shield Level 1 Dipicu: Portofolio otomatis dialokasikan lebih tinggi ke Kas & Emas untuk perlindungan aset.' }
                  ].map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => setAlertText(tpl.text)}
                      className="px-2 py-1 text-[10px] font-sans font-medium rounded-lg bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white border border-[#1b1926] transition-all cursor-pointer"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Publikasikan Notifikasi
              </button>
            </form>
          </div>

          {/* Audit Terminal Log Feed */}
          <div className="card card-elevated p-6 bg-[#0b0a10]/45 flex flex-col justify-between h-[300px]">
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight font-sans flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" /> Audit Log Transmisi Live
              </h3>
              <p className="text-[10px] text-[#686477]">Audit jejak pemicu internal server & rilis sinyal.</p>
            </div>

            <div className="flex-1 bg-[#060509] border border-[#1b1926] rounded-xl p-3 mt-3 overflow-y-auto font-mono text-[9px] text-[#ccff00] space-y-1.5 select-all">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed font-semibold">
                  <span className="text-[#686477]">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SQLite Database Console & Explorer Panel */}
      <div className="card card-elevated p-6 space-y-6 bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl flex items-center justify-center text-[#ccff00]">
              <Database className="w-5 h-5 glow-text-lime" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-sans">
                Local SQLite Database Console & Explorer
              </h2>
              <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
                Akses performa tinggi ke arsip data historis Bursa Efek Indonesia (IDX) sebesar 208MB+ langsung dari local storage.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchDbStats();
              toast.success('Statistik database diperbarui!');
            }}
            className="px-3 py-1.5 bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] rounded-lg text-xs font-bold text-[#9f9bac] hover:text-white flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Segarkan Status
          </button>
        </div>

        {/* Database Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
            <HardDrive className="w-8 h-8 text-[#ccff00]/80 shrink-0" />
            <div>
              <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">File Database</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">safehaven.db</div>
              <div className="text-[10px] text-[#9f9bac] mt-0.5">Ukuran: {dbStats?.sizeMb || '208.0'} MB</div>
            </div>
          </div>

          <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
            <Server className="w-8 h-8 text-[#00f0ff]/80 shrink-0" />
            <div>
              <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">Koneksi Mesin</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">LibSQL Native Client</div>
              <div className="text-[10px] text-[#1bfb7c] font-bold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#1bfb7c] rounded-full animate-pulse"></span> TERKONEKSI (Local)
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">Histori Harga (BEI)</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                {dbStats?.counts?.price_history ? Number(dbStats.counts.price_history).toLocaleString('id-ID') : '425.291'}
              </div>
              <div className="text-[10px] text-[#9f9bac] mt-0.5">Baris Data Terarsip</div>
            </div>
          </div>

          <div className="p-4 bg-[#111018]/50 border border-[#1b1926] rounded-xl flex items-center gap-3">
            <SlidersHorizontal className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider">Fundamental Emiten</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                {dbStats?.counts?.fundamentals_historical ? Number(dbStats.counts.fundamentals_historical).toLocaleString('id-ID') : '12.482'}
              </div>
              <div className="text-[10px] text-[#9f9bac] mt-0.5">Laporan Keuangan Emiten</div>
            </div>
          </div>
        </div>

        {/* Console Controls */}
        <div className="border border-[#1b1926] rounded-xl bg-[#0e0d15] overflow-hidden">
          <div className="flex border-b border-[#1b1926] bg-[#111018] overflow-x-auto text-xs font-bold">
            <button
              onClick={() => {
                setActiveTable('price_history');
                setQueryResult(null);
                setQueryError(null);
              }}
              className={`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 ${activeTable === 'price_history' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}`}
            >
              <Database className="w-3.5 h-3.5 text-[#ccff00]" /> price_history (Arsip Harga)
            </button>
            <button
              onClick={() => {
                setActiveTable('fundamentals_historical');
                setQueryResult(null);
                setQueryError(null);
              }}
              className={`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 ${activeTable === 'fundamentals_historical' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" /> fundamentals_historical (Fundamental)
            </button>
            <button
              onClick={() => {
                setActiveTable('custom');
                setQueryResult(null);
                setQueryError(null);
                setSqlQuery('SELECT ticker, count(*) as total_records FROM price_history GROUP BY ticker ORDER BY total_records DESC LIMIT 15;');
              }}
              className={`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 ${activeTable === 'custom' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}`}
            >
              <Code className="w-3.5 h-3.5 text-[#00f0ff]" /> Custom SQL Query (Read-only)
            </button>
          </div>

          <div className="p-5 space-y-4">
            {activeTable !== 'custom' ? (
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-end gap-3 text-xs">
                  <div className="flex-1 space-y-1">
                    <label className="text-[#9f9bac] font-extrabold uppercase text-[10px]">Filter Kode Saham (Ticker)</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#686477] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={tickerFilter}
                        onChange={(e) => setTickerFilter(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode emiten (misal: RAJA, ADRO, BBRI)..."
                        className="w-full bg-[#111018] border border-[#1b1926] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#686477] focus:outline-none focus:border-[#ccff00]/40 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => runSqlQuery()}
                    disabled={dbLoading}
                    className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {dbLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Query Records
                  </button>
                </div>

                {/* Quick Ticker Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-[#686477] font-extrabold uppercase">Pilihan Emiten Cepat:</span>
                  {['RAJA', 'BBRI', 'BMRI', 'ADRO', 'TLKM', 'ASII', 'GOTO', 'ICBP'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTickerFilter(t);
                        runSqlQuery(`SELECT * FROM ${activeTable === 'price_history' ? 'price_history' : 'fundamentals_historical'} WHERE ticker = '${t}' ORDER BY ${activeTable === 'price_history' ? 'date' : 'report_date'} DESC LIMIT 20;`);
                      }}
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        tickerFilter === t 
                          ? 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/40' 
                          : 'bg-[#111018] text-[#9f9bac] border-[#1b1926] hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[#9f9bac] font-extrabold uppercase text-[10px] flex items-center justify-between">
                    <span>Instruksi SQL</span>
                    <span className="text-sky-400 font-mono font-bold">SELECT / PRAGMA / EXPLAIN</span>
                  </label>
                  <textarea
                    rows={3}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="w-full bg-[#111018] border border-[#1b1926] rounded-xl p-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-mono"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <div className="text-[#686477] flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>Hanya mendukung query SELECT read-only untuk melindungi data.</span>
                  </div>
                  <button
                    onClick={() => runSqlQuery()}
                    disabled={dbLoading}
                    className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {dbLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Eksekusi Custom SQL
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {queryError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold uppercase tracking-wide text-[9px]">Query Error</div>
                  <p className="mt-0.5">{queryError}</p>
                </div>
              </div>
            )}

            {/* Results Table Section */}
            {queryResult && (
              <div className="space-y-2 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex justify-between items-center text-[10px] text-[#686477]">
                  <span>Query menghasilkan {queryResult.rows?.length || 0} baris data</span>
                  <span className="font-mono text-[#ccff00]">Success</span>
                </div>

                <div className="overflow-x-auto border border-[#1b1926] rounded-xl max-h-[350px]">
                  <table className="w-full text-[11px] text-[#9f9bac] font-sans text-left border-collapse">
                    <thead className="bg-[#111018] text-white font-bold border-b border-[#1b1926] sticky top-0">
                      <tr>
                        {queryResult.columns?.map((col: string) => (
                          <th key={col} className="px-4 py-2.5 font-mono text-[10px] border-r border-[#1b1926] last:border-r-0">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b1926]/40">
                      {queryResult.rows?.length === 0 ? (
                        <tr>
                          <td colSpan={queryResult.columns?.length || 1} className="px-4 py-8 text-center text-[#686477] font-semibold">
                            Tidak ada baris data yang cocok atau dikembalikan.
                          </td>
                        </tr>
                      ) : (
                        queryResult.rows?.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-[#111018]/30 odd:bg-[#0b0a10]/20 font-medium">
                            {queryResult.columns?.map((col: string) => {
                              const val = row[col];
                              return (
                                <td key={col} className="px-4 py-2 font-mono border-r border-[#1b1926]/30 last:border-r-0">
                                  {val === null || val === undefined ? (
                                    <span className="text-[#686477] italic">null</span>
                                  ) : typeof val === 'number' ? (
                                    <span className="text-white font-bold">{val.toLocaleString('id-ID')}</span>
                                  ) : (
                                    String(val)
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
