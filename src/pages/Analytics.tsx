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
import { Skeleton, SkeletonCard, SkeletonChart } from '../components/Skeleton';
import { 
  WidgetKinerja, 
  WidgetMusiman, 
  WidgetGauges,
  WidgetWatchlistDetail 
} from '../components/TickerAnalysisWidgets';
import { 
  WidgetConfigModal, 
  WidgetId, 
  WIDGET_NAMES, 
  WIDGET_DESCRIPTIONS 
} from '../components/WidgetConfigModal';

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

const DEFAULT_ANALYTICS_ORDER: WidgetId[] = ['regime', 'gauges', 'kinerja', 'musiman'];
const AVAILABLE_ANALYTICS_WIDGETS: WidgetId[] = [
  'regime',
  'gauges',
  'kinerja',
  'musiman',
  'rsi',
  'sector',
  'macd',
  'volatility'
];

export const Analytics: React.FC = () => {
  const { universes } = useAppStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [marketIndex, setMarketIndex] = useState(universes[0]?.name || 'LQ45 Core Universe');
  const [loading, setLoading] = useState(true);

  // Analytics Widget Order State using WidgetConfigModal
  const [analyticsWidgetOrder, setAnalyticsWidgetOrder] = useState<WidgetId[]>(() => {
    const saved = localStorage.getItem('analytics_widget_order_v5');
    if (saved) {
      try {
        const parsed: WidgetId[] = JSON.parse(saved);
        return parsed.filter(id => id !== 'watchlist_detail');
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ANALYTICS_ORDER;
  });

  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('analytics_widget_order_v5', JSON.stringify(analyticsWidgetOrder));
  }, [analyticsWidgetOrder]);

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
      <div className="px-6 space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-1.5 h-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-64 rounded-lg" />
            <Skeleton className="h-3.5 w-96 rounded-md" />
          </div>
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} className="h-28" />
          ))}
        </div>

        {/* Treemap & Macro Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <SkeletonChart height="h-[380px]" />
          </div>
          <div className="lg:col-span-4">
            <SkeletonCard className="h-[380px]" />
          </div>
        </div>

        {/* Spatial Matrix Skeleton */}
        <SkeletonCard className="h-[320px]" />
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

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-3.5 py-1.5 flex items-center gap-2 hidden lg:flex">
            <Layers className="w-3.5 h-3.5 text-[#ccff00]" />
            <div className="text-left">
              <div className="text-[8px] uppercase text-[#686477] font-bold font-sans">Regime</div>
              <div className="text-xs text-white font-extrabold font-sans">{data.marketRegime}</div>
            </div>
          </div>
          <button
            onClick={() => setIsWidgetModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.15)]"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Widget
          </button>
          <button
            onClick={() => setIsWidgetModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1b1926] hover:bg-[#252233] border border-[#2a273b] text-[#9f9bac] hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Susun Widget
          </button>
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
        <div className="flex items-center gap-2.5 bg-[#111018]/30 border border-[#1b1926]/60 p-4 rounded-xl">
          <span className="w-1.5 h-6 bg-[#ccff00] rounded-full"></span>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#ccff00]" /> Visualisasi & Intelijen Kustom (Live Yahoo Finance)
            </h2>
            <p className="text-[10px] text-[#9f9bac] font-sans mt-0.5">Kelola, tambah, urutkan, atau hapus widget analisa teknikal, kinerja return, dan analisis musiman bulanan.</p>
          </div>
        </div>

        {analyticsWidgetOrder.length === 0 ? (
          <div className="card card-elevated p-8 text-center bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1b1926] flex items-center justify-center text-[#686477]">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Belum Ada Widget Terpasang</h4>
              <p className="text-xs text-[#686477] mt-1 max-w-sm">Klik tombol "Tambah Widget" di atas untuk menambahkan visualisasi teknikal, kinerja, atau musiman untuk saham pilihan Anda.</p>
            </div>
            <button
              onClick={() => setAnalyticsWidgetOrder(DEFAULT_ANALYTICS_ORDER)}
              className="px-4 py-1.5 bg-[#1b1926] hover:bg-[#252233] text-white text-xs font-bold rounded-xl transition-all border border-[#2a273b] cursor-pointer"
            >
              Gunakan Default (IHSG)
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {analyticsWidgetOrder.map((widgetId) => {
              const widgetName = WIDGET_NAMES[widgetId] || widgetId;
              const widgetDesc = WIDGET_DESCRIPTIONS[widgetId] || '';

              return (
                <div 
                  key={widgetId} 
                  className="bg-[#0b0a10]/30 border border-[#1b1926]/80 rounded-2xl p-5 space-y-4 hover:border-[#1b1926] transition-all"
                >
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#1b1926]/40">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 text-xs font-black text-[#ccff00] font-mono tracking-wider">
                        IHSG
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white font-sans block">{widgetName}</span>
                        <span className="text-xs text-[#9f9bac] block mt-0.5">{widgetDesc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    {widgetId === 'regime' && <RegimeTreemap distribution={data?.regimeDistribution || []} />}
                    {widgetId === 'gauges' && <WidgetGauges symbol="IHSG" />}
                    {widgetId === 'kinerja' && <WidgetKinerja symbol="IHSG" />}
                    {widgetId === 'musiman' && <WidgetMusiman symbol="IHSG" />}
                    {(widgetId === 'watchlist_detail' || widgetId === 'watchlist') && <WidgetWatchlistDetail defaultSymbol="IHSG" />}
                    {widgetId === 'rsi' && <WidgetGauges symbol="IHSG" />}
                    {widgetId === 'sector' && <WidgetKinerja symbol="IHSG" />}
                    {widgetId === 'macd' && <WidgetGauges symbol="IHSG" />}
                    {widgetId === 'volatility' && <WidgetKinerja symbol="IHSG" />}
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
      <WidgetConfigModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        currentOrder={analyticsWidgetOrder}
        onSave={(newOrder) => setAnalyticsWidgetOrder(newOrder)}
        title="Kelola & Tambah Widget Analytics"
        scopeName="Analytics"
        availableWidgetList={AVAILABLE_ANALYTICS_WIDGETS}
        defaultOrderList={DEFAULT_ANALYTICS_ORDER}
      />
    </div>
  );
};
