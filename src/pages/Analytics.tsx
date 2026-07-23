/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores';
import { TickerLogo } from '../components/TickerLogo';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Filter, 
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Activity,
  RefreshCw,
  SlidersHorizontal,
  Settings2
} from 'lucide-react';
import { toast } from 'sonner';
import { RegimeTreemap } from '../components/RegimeTreemap';
import { MacroChart } from '../components/MacroChart';
import { 
  WidgetKinerja, 
  WidgetMusiman, 
  WidgetGauges,
  WidgetWatchlistDetail 
} from '../components/TickerAnalysisWidgets';

interface AnalyticsData {
  scoredToday: number;
  scoreDate: string;
  marketRegime: string;
  sectorAverages: { sector: string; score: number }[];
  topGainers: { symbol: string; name: string; price: number; changePercent: number; score: number }[];
  topLosers: { symbol: string; name: string; price: number; changePercent: number; score: number }[];
  marketStats: {
    marketCap: string;
    marketCapChange?: string;
    usdIdr: string;
    usdIdrChange?: string;
    goldPrice: string;
    goldPriceChange?: string;
    isLive?: boolean;
    lastUpdated?: string;
  };
  regimeDistribution: { name: string; value: number }[];
}

interface CustomWidgetConfig {
  id: string;
  symbol: string;
  type: 'regime' | 'gauges' | 'kinerja' | 'musiman' | 'watchlist_detail';
}

export const Analytics: React.FC = () => {
  const { universes } = useAppStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [marketIndex, setMarketIndex] = useState(universes[0]?.name || 'LQ45 Core Universe');
  const [loading, setLoading] = useState(true);

  // Custom Widgets State
  const [customWidgets, setCustomWidgets] = useState<CustomWidgetConfig[]>(() => {
    const saved = localStorage.getItem('custom_analytics_widgets_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'widget-ihsg-regime', symbol: 'IHSG', type: 'regime' },
      { id: 'widget-ihsg-gauges', symbol: 'IHSG', type: 'gauges' },
      { id: 'widget-ihsg-kinerja', symbol: 'IHSG', type: 'kinerja' },
      { id: 'widget-ihsg-musiman', symbol: 'IHSG', type: 'musiman' },
    ];
  });

  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [newWidgetSymbol, setNewWidgetSymbol] = useState('');
  const [newWidgetType, setNewWidgetType] = useState<'regime' | 'gauges' | 'kinerja' | 'musiman' | 'watchlist_detail'>('gauges');

  useEffect(() => {
    localStorage.setItem('custom_analytics_widgets_v3', JSON.stringify(customWidgets));
  }, [customWidgets]);

  const addCustomWidget = (symbol: string, type: 'regime' | 'gauges' | 'kinerja' | 'musiman' | 'watchlist_detail') => {
    const symClean = symbol.trim().toUpperCase();
    if (!symClean) {
      toast.error('Simbol ticker tidak boleh kosong');
      return;
    }

    const newWidget: CustomWidgetConfig = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      symbol: symClean,
      type
    };

    setCustomWidgets(prev => [...prev, newWidget]);
    setIsWidgetModalOpen(false);
    setNewWidgetSymbol('');
    toast.success(`Widget ${type.toUpperCase()} untuk ${symClean} berhasil ditambahkan!`);
  };

  const removeWidget = (id: string) => {
    setCustomWidgets(prev => prev.filter(w => w.id !== id));
    toast.success('Widget berhasil dihapus');
  };

  const moveWidgetUp = (index: number) => {
    if (index === 0) return;
    setCustomWidgets(prev => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
  };

  const moveWidgetDown = (index: number) => {
    setCustomWidgets(prev => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
  };

  const resetWidgetsToDefault = () => {
    setCustomWidgets([
      { id: 'widget-ihsg-regime', symbol: 'IHSG', type: 'regime' },
      { id: 'widget-ihsg-gauges', symbol: 'IHSG', type: 'gauges' },
      { id: 'widget-ihsg-kinerja', symbol: 'IHSG', type: 'kinerja' },
      { id: 'widget-ihsg-musiman', symbol: 'IHSG', type: 'musiman' },
    ]);
    toast.success('Widget di-reset ke standar IHSG');
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/analytics/dashboard?index=${marketIndex}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [marketIndex]);

  

  const scoreDistData = [
    { range: '0-20', count: 1 },
    { range: '20-39', count: 3 },
    { range: '40-59', count: 8 },
    { range: '60-79', count: 18 },
    { range: '80-100', count: 12 },
  ];

  const COLORS = ['#ccff00', '#00f0ff', '#a855f7', '#ff3366'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
        <p className="text-xs text-[#9f9bac] mt-4 font-sans uppercase tracking-wider">Menghubungkan Mesin Analitik...</p>
      </div>
    );
  }

  if (!data) return null;

  // Calculate EMA
  
  return (
    <div id="analytics-view" className="px-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Market Analytics & Regime</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Distribusi skor spasial fundamental bursa saham LQ45 secara real-time.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-4.5 py-2 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#ccff00]" />
            <div className="text-left">
              <div className="text-[9px] uppercase text-[#686477] font-bold font-sans">Market Regime</div>
              <div className="text-xs text-white font-extrabold font-sans">{data.marketRegime}</div>
            </div>
          </div>
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-4.5 py-2 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#00f0ff]" />
            <div className="text-left">
              <div className="text-[9px] uppercase text-[#686477] font-bold font-sans">Score Update</div>
              <div className="text-xs text-white font-extrabold font-mono">{data.scoreDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card card-elevated p-5 flex items-center justify-between bg-[#0b0a10]/45 border border-[#1b1926] hover:border-[#ccff00]/30 transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Kapitalisasi Pasar</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-ping"></span> Live API
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white font-mono">{data.marketStats.marketCap}</h3>
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold font-mono ${data.marketStats.marketCapChange?.startsWith('-') ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
              {data.marketStats.marketCapChange || '+0.40% d/d'}
            </div>
            <span className="text-[9px] text-[#686477] font-sans">BEI Live Feed</span>
          </div>
        </div>

        <div className="card card-elevated p-5 flex items-center justify-between bg-[#0b0a10]/45 border border-[#1b1926] hover:border-[#ccff00]/30 transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Nilai Tukar USD/IDR</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-ping"></span> Live API
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white font-mono">{data.marketStats.usdIdr}</h3>
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold font-mono ${data.marketStats.usdIdrChange?.startsWith('-') ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
              {data.marketStats.usdIdrChange || '+0.12% d/d'}
            </div>
            <span className="text-[9px] text-[#686477] font-sans">Kurs Real-Time</span>
          </div>
        </div>

        <div className="card card-elevated p-5 flex items-center justify-between bg-[#0b0a10]/45 border border-[#1b1926] hover:border-[#ccff00]/30 transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Harga Emas (Spot)</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                <span className="w-1 h-1 rounded-full bg-[#ccff00] animate-ping"></span> Live API
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white font-mono">{data.marketStats.goldPrice}</h3>
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold font-mono ${data.marketStats.goldPriceChange?.startsWith('-') ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
              {data.marketStats.goldPriceChange || '+0.85% d/d'}
            </div>
            <span className="text-[9px] text-[#686477] font-sans">Emas / Gram IDR</span>
          </div>
        </div>
      </div>

      {/* Score and Sector charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* IHSG Price Chart */}
        <div className="card card-elevated p-6 lg:col-span-8 flex flex-col bg-[#0b0a10]/45">
          <MacroChart />
        </div>

        {/* Watchlist & Key Stats Widget (Right next to chart) */}
        <div className="lg:col-span-4">
          <WidgetWatchlistDetail defaultSymbol="IHSG" />
        </div>
      </div>

      {/* Yahoo Finance Custom/Manageable Widgets */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111018]/30 border border-[#1b1926]/60 p-4 rounded-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-[#ccff00] rounded-full"></span>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#ccff00]" /> Visualisasi & Intelijen Kustom (Live Yahoo Finance)
              </h2>
              <p className="text-[10px] text-[#9f9bac] font-sans mt-0.5">Kelola, tambah, urutkan, atau hapus widget analisa teknikal, kinerja return, dan analisis musiman bulanan.</p>
            </div>
          </div>
          <button
            onClick={() => setIsWidgetModalOpen(true)}
            className="px-4 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-[#ccff00]/10 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Widget</span>
          </button>
        </div>

        {customWidgets.length === 0 ? (
          <div className="card card-elevated p-8 text-center bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1b1926] flex items-center justify-center text-[#686477]">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Belum Ada Widget Terpasang</h4>
              <p className="text-xs text-[#686477] mt-1 max-w-sm">Klik tombol "Tambah Widget" di atas untuk menambahkan visualisasi teknikal, kinerja, atau musiman untuk saham pilihan Anda.</p>
            </div>
            <button
              onClick={resetWidgetsToDefault}
              className="px-4 py-1.5 bg-[#1b1926] hover:bg-[#252233] text-white text-xs font-bold rounded-xl transition-all border border-[#2a273b] cursor-pointer"
            >
              Gunakan Default (IHSG)
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {customWidgets.map((widget, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === customWidgets.length - 1;

              let widgetName = '';
              let widgetDesc = '';
              if (widget.type === 'regime') {
                widgetName = 'Sebaran Durasi Regime Pasar (Regime Treemap)';
                widgetDesc = 'Persentase dominasi regime Bull, Bear, Normal, dan Volatile.';
              } else if (widget.type === 'gauges') {
                widgetName = 'Analisa Teknikal & Penilaian Analis';
                widgetDesc = 'Gauges osilator, rata-rata bergerak, dan target harga konsensus analis.';
              } else if (widget.type === 'kinerja') {
                widgetName = 'Kinerja Historis & Return (%)';
                widgetDesc = 'Tabel performa return periodik (1 minggu hingga 1 tahun terakhir).';
              } else if (widget.type === 'musiman') {
                widgetName = 'Analisis Musiman Bulanan';
                widgetDesc = 'Grafik garis performa return bulanan historis per tahun (2024 - 2026).';
              } else if (widget.type === 'watchlist_detail' || widget.type === 'watchlist') {
                widgetName = 'Daftar Pantau & Statistik Kunci (Yahoo Finance Live)';
                widgetDesc = 'Informasi harga real-time, rentang hari & 52-minggu, berita terkini, dan statistik kunci.';
              }

              return (
                <div 
                  key={widget.id} 
                  className="bg-[#0b0a10]/30 border border-[#1b1926]/80 rounded-2xl p-5 space-y-4 hover:border-[#1b1926] transition-all"
                >
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#1b1926]/40">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 text-xs font-black text-[#ccff00] font-mono tracking-wider">
                        {widget.symbol.toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-white font-sans block">{widgetName}</span>
                        <span className="text-[9px] text-[#686477] block mt-0.5">{widgetDesc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveWidgetUp(idx)}
                        disabled={isFirst}
                        className="p-1.5 rounded-lg bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white disabled:opacity-20 disabled:hover:bg-[#111018] disabled:hover:text-[#9f9bac] cursor-pointer transition-all border border-[#1b1926] disabled:cursor-not-allowed"
                        title="Pindah ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveWidgetDown(idx)}
                        disabled={isLast}
                        className="p-1.5 rounded-lg bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white disabled:opacity-20 disabled:hover:bg-[#111018] disabled:hover:text-[#9f9bac] cursor-pointer transition-all border border-[#1b1926] disabled:cursor-not-allowed"
                        title="Pindah ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeWidget(widget.id)}
                        className="p-1.5 rounded-lg bg-[#111018] hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 cursor-pointer transition-all"
                        title="Hapus Widget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    {widget.type === 'regime' && <RegimeTreemap distribution={data?.regimeDistribution || []} />}
                    {widget.type === 'gauges' && <WidgetGauges symbol={widget.symbol} />}
                    {widget.type === 'kinerja' && <WidgetKinerja symbol={widget.symbol} />}
                    {widget.type === 'musiman' && <WidgetMusiman symbol={widget.symbol} />}
                    {(widget.type === 'watchlist_detail' || widget.type === 'watchlist') && <WidgetWatchlistDetail defaultSymbol={widget.symbol} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dedicated Universe Selection Toolbar */}
      <div className="card card-elevated p-4 bg-[#0b0a10]/60 border border-[#1b1926] flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Semesta Saham (Universe Index)</h3>
              <span className="text-[9px] font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
                {marketIndex}
              </span>
            </div>
            <p className="text-[10px] text-[#686477] mt-0.5">Filter data analitik, pergerakan harga, serta daftar Top Gainers & Losers berdasarkan indeks pilihan.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {universes.map((u) => {
            const active = marketIndex === u.name;
            return (
              <button
                key={u.id}
                onClick={() => setMarketIndex(u.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold font-sans transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20 scale-[1.02]'
                    : 'bg-[#111018] text-[#9f9bac] border border-[#1b1926] hover:border-[#ccff00]/40 hover:text-white'
                }`}
              >
                {active && <Check className="w-3.5 h-3.5 text-black" />}
                <span>{u.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Gainers / Losers tables side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Gainers */}
        <div className="card card-elevated p-6 bg-[#0b0a10]/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#00f5a0] tracking-tight font-sans flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5" /> Top Gainers
            </h3>
            <span className="text-[10px] font-bold text-[#9f9bac] bg-[#111018] px-2.5 py-1 rounded-lg border border-[#1b1926]">
              {marketIndex}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#1b1926] text-[#686477]">
                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                  <th className="pb-3 font-bold text-center uppercase tracking-wider text-[10px]">Score</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Harga</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926] font-mono">
                {data.topGainers.map((t) => (
                  <tr key={t.symbol} className="hover:bg-[#111018]/40 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <TickerLogo symbol={t.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                        <span className="font-extrabold text-white">{t.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-[#ccff00] font-extrabold">{typeof t.score === 'number' ? t.score.toFixed(1) : t.score}</td>
                    <td className="py-3.5 text-right text-white">Rp {t.price.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-right text-[#00f5a0] font-extrabold">+{t.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Losers */}
        <div className="card card-elevated p-6 bg-[#0b0a10]/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#ff3366] tracking-tight font-sans flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 rotate-180" /> Top Losers
            </h3>
            <span className="text-[10px] font-bold text-[#9f9bac] bg-[#111018] px-2.5 py-1 rounded-lg border border-[#1b1926]">
              {marketIndex}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#1b1926] text-[#686477]">
                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                  <th className="pb-3 font-bold text-center uppercase tracking-wider text-[10px]">Score</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Harga</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926] font-mono">
                {data.topLosers.map((t) => (
                  <tr key={t.symbol} className="hover:bg-[#111018]/40 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <TickerLogo symbol={t.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                        <span className="font-extrabold text-white">{t.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-[#00f0ff] font-extrabold">{typeof t.score === 'number' ? t.score.toFixed(1) : t.score}</td>
                    <td className="py-3.5 text-right text-white">Rp {t.price.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-right text-[#ff3366] font-extrabold">{t.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Widget Configuration Modal */}
      {isWidgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0a10] border border-[#1b1926] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#1b1926] flex items-center justify-between bg-[#111018]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#ccff00]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Tambah Widget Analitik Kustom</h2>
                  <p className="text-[10px] text-[#9f9bac]">Pilih saham/indeks dan jenis visualisasi interaktif</p>
                </div>
              </div>
              <button 
                onClick={() => setIsWidgetModalOpen(false)} 
                className="text-[#686477] hover:text-white p-1 rounded-lg hover:bg-[#1b1926] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Symbol Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#686477] font-bold uppercase tracking-wider block">Ticker Saham / Indeks</label>
                <input
                  type="text"
                  placeholder="Contoh: BBCA, BBRI, ASII, IHSG..."
                  value={newWidgetSymbol}
                  onChange={(e) => setNewWidgetSymbol(e.target.value)}
                  className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686477] focus:outline-none focus:border-[#ccff00] font-mono tracking-wider"
                />
                
                {/* Suggestions */}
                <div className="pt-1">
                  <span className="text-[9px] text-[#686477] block mb-1">Rekomendasi Cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['IHSG', 'BBCA', 'BBRI', 'TLKM', 'ASII', 'BMRI', 'BBNI', 'GOTO', 'ADRO'].map(sym => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setNewWidgetSymbol(sym)}
                        className="px-2.5 py-1 bg-[#111018] hover:bg-[#1b1926] hover:border-[#ccff00]/40 border border-[#1b1926] rounded-lg text-[9px] font-mono font-bold text-[#9f9bac] hover:text-white transition-all cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Widget Type Selector */}
              <div className="space-y-2">
                <label className="text-[10px] text-[#686477] font-bold uppercase tracking-wider block">Jenis Widget Visualisasi</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      type: 'regime',
                      title: 'Sebaran Durasi Regime Pasar',
                      desc: 'Peta distribusi durasi regime pasar (Normal, Bull, Bear, Volatile).',
                      icon: <Layers className="w-4 h-4 text-[#00f5a0]" />
                    },
                    {
                      type: 'watchlist_detail',
                      title: 'Daftar Pantau & Statistik Kunci (Yahoo Finance Live)',
                      desc: 'Harga real-time, bid/ask, rentang 52-minggu, berita terkini ticker & statistik lengkap.',
                      icon: <Activity className="w-4 h-4 text-[#b482ff]" />
                    },
                    {
                      type: 'gauges',
                      title: 'Analisa Gauges (Teknikal & Analis)',
                      desc: 'Indikator konsensus osilator & MA dengan jarum dinamis (TradingView Style).',
                      icon: <Activity className="w-4 h-4 text-[#ccff00]" />
                    },
                    {
                      type: 'kinerja',
                      title: 'Kinerja Return Historis',
                      desc: 'Tabel ringkasan performa kenaikan/penurunan harga (1Mgg s/d 1Thn).',
                      icon: <TrendingUp className="w-4 h-4 text-[#00f5a0]" />
                    },
                    {
                      type: 'musiman',
                      title: 'Analisis Musiman Bulanan',
                      desc: 'Grafik garis performa return bulanan historis per tahun (2024 - 2026).',
                      icon: <Calendar className="w-4 h-4 text-[#00f0ff]" />
                    }
                  ].map(opt => {
                    const active = newWidgetType === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setNewWidgetType(opt.type as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex gap-3 items-start ${
                          active
                            ? 'bg-[#ccff00]/5 border-[#ccff00]'
                            : 'bg-[#111018] border-[#1b1926] hover:border-[#2a273b]'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${active ? 'bg-[#ccff00]/10' : 'bg-[#0b0a10]'} shrink-0`}>
                          {opt.icon}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${active ? 'text-white' : 'text-[#9f9bac]'}`}>
                            {opt.title}
                          </div>
                          <div className="text-[10px] text-[#686477] mt-0.5 leading-relaxed">
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-[#1b1926] flex items-center justify-between bg-[#111018]/30">
              <button
                type="button"
                onClick={resetWidgetsToDefault}
                className="px-3.5 py-2 text-[10px] font-bold text-[#ff3366] hover:text-white hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 cursor-pointer"
              >
                Reset ke Default
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWidgetModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#9f9bac] hover:text-white transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => addCustomWidget(newWidgetSymbol, newWidgetType)}
                  disabled={!newWidgetSymbol.trim()}
                  className="px-4 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Widget</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
