import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../stores';
import { SignalBadge } from '../components/SignalBadge';
import { TickerLogo } from '../components/TickerLogo';
import { PortfolioGrowthChart } from '../components/PortfolioGrowthChart';
import { Wallet, Settings, TrendingUp, Compass, ArrowRight, Eye, CheckCircle, Award, Clock, Download, Coins, DollarSign, LineChart, Banknote } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { downloadPDF } from '../lib/pdfUtils';
import { Skeleton } from '../components/Skeleton';

export const Portfolio: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    portfolioConfig, 
    stockPicks, 
    strategies,
    tier, 
    tierProgress, 
    fetchInitialData,
    isLoadingData
  } = useAppStore();

  const [growthData, setGrowthData] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGrowthAndSignals = async () => {
        if (!portfolioConfig?.capital) return;
        
        try {
            const base = window.location.origin;
            
            const gRes = await window.appFetch(`${base}/api/portfolio/growth?capital=${portfolioConfig.capital}`);
            if (gRes.ok) setGrowthData(await gRes.json());
            
            const sRes = await window.appFetch(`${base}/api/portfolio/signals`);
            if (sRes.ok) setSignals(await sRes.json());
            
        } catch (e) {
            console.error(e);
        }
    };
    fetchGrowthAndSignals();
  }, [portfolioConfig?.capital, portfolioConfig?.universe, portfolioConfig?.strategyTemplate]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // 1. Empty State Guard
  if (!portfolioConfig) {
    return (
      <div id="portfolio-empty-state" className="flex flex-col items-center justify-center py-20 px-4 text-center select-none">
        <div className="w-16 h-16 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl flex items-center justify-center text-[#ccff00] mb-5 shadow-lg shadow-[#ccff00]/5 animate-pulse">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Belum Ada Portofolio Terbuka</h2>
        <p className="text-xs text-[#9f9bac] max-w-sm mt-2 leading-relaxed font-sans">
          Anda perlu mengkonfigurasi modal kerja awal, target alokasi strategis, dan universe saham terlebih dahulu di pengaturan.
        </p>
        <button
          id="go-to-settings-btn"
          onClick={() => setLocation('/settings')}
          className="mt-6 px-4.5 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
        >
          <Settings className="w-4 h-4" /> Buka Tab Pengaturan
        </button>
      </div>
    );
  }

  // Calculated absolute rupiah amounts for each allocation bucket
  const capital = portfolioConfig.capital;
  const allocations = [
    { name: 'Saham', pct: portfolioConfig.allocationSaham, color: 'bg-[#ccff00]', text: 'text-[#ccff00]', icon: LineChart },
    { name: 'Emas Batangan', pct: portfolioConfig.allocationEmas, color: 'bg-[#00f0ff]', text: 'text-[#00f0ff]', icon: Coins },
    { name: 'Cash IDR', pct: portfolioConfig.allocationCash, color: 'bg-[#a855f7]', text: 'text-[#a855f7]', icon: Wallet },
    { name: 'USD Currency', pct: portfolioConfig.allocationUSD, color: 'bg-[#6366f1]', text: 'text-[#6366f1]', icon: DollarSign }
  ];

  const getActiveStrategyTitle = () => {
    if (!portfolioConfig) return 'Auto Regime (IHSG)';
    const profile = portfolioConfig.strategyProfile || 'auto';
    if (profile === 'auto') return 'Auto Regime (Ikut Regime IHSG)';
    if (profile === 'aggressive_momentum' || profile === 'aggressive') return 'Aggressive Momentum (Otoriter)';
    if (profile === 'defensive_value' || profile === 'defensive') return 'Defensive Value (Konservatif)';
    const matchedStrat = strategies.find(s => s.id === portfolioConfig.strategyTemplate);
    return matchedStrat ? `${matchedStrat.name} (Custom)` : (portfolioConfig.strategyName || 'Custom Strategy');
  };

  return (
    <div id="portfolio-view" className="px-4 sm:px-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="w-1.5 h-7 sm:h-8 bg-[#ccff00] rounded-full shrink-0 mt-0.5 sm:mt-0"></span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white font-sans truncate">{getActiveStrategyTitle()}</h1>
              <span className="text-[10px] font-mono text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0">
                PROFIL: {portfolioConfig?.strategyProfile?.toUpperCase() || 'AUTO'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#9f9bac] font-sans mt-0.5">
              Universe: <span className="text-[#ccff00] font-bold">{portfolioConfig.universe}</span> • Top N Target: <span className="text-white font-bold">{portfolioConfig.topN} Saham Utama</span>
            </p>
          </div>
        </div>
        <button
            onClick={() => downloadPDF('portfolio-view', 'Portfolio_Summary')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1b1926] hover:bg-[#252233] border border-[#2a273b] text-[#9f9bac] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
        </button>
      </div>

      {isLoadingData ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-48 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Skeleton className="lg:col-span-8 h-64 rounded-3xl" />
            <Skeleton className="lg:col-span-4 h-64 rounded-3xl" />
          </div>
          <Skeleton className="w-full h-96 rounded-3xl" />
        </div>
      ) : (
        <>
          {/* Unified Portfolio Summary Card */}
          <div className="card card-elevated p-0 overflow-hidden bg-[#0b0a10]/45 border-[#1b1926]">
            {/* Top row: Total Modal & Proyeksi */}
            <div className="flex flex-col sm:flex-row border-b border-[#1b1926]">
              <div className="flex-1 p-5 border-b sm:border-b-0 sm:border-r border-[#1b1926] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#686477]">Total Modal Portofolio</span>
                  <h2 className="text-2xl font-bold font-mono text-[#00f0ff] mt-1">{formatIDR(capital)}</h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#00f0ff]/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#00f0ff]" />
                </div>
              </div>
              <div className="flex-1 p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#9f9bac]">Proyeksi Dividen Tahunan</span>
                  <h2 className="text-2xl font-bold font-mono text-[#ccff00] mt-1">{portfolioConfig.projectedAnnualDividend ? formatIDR(portfolioConfig.projectedAnnualDividend) : 'Rp 0'}</h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-[#ccff00]" />
                </div>
              </div>
            </div>
            
            {/* Bottom row: Allocations */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#1b1926]">
              {allocations.map((item, idx) => {
                const absoluteVal = (capital * item.pct) / 100;
                const Icon = item.icon;
                return (
                  <div key={item.name} className={`p-5 space-y-3 ${idx === 2 || idx === 3 ? 'border-t lg:border-t-0' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-[#111018] border border-[#1b1926] ${item.text}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-[#9f9bac] font-sans font-semibold">{item.name}</span>
                      <span className={`text-xs font-extrabold font-mono ml-auto ${item.text}`}>{item.pct}%</span>
                    </div>
                    <h3 className="text-base font-bold font-mono text-white">{formatIDR(absoluteVal)}</h3>
                    {/* Custom progress bar */}
                    <div className="w-full bg-[#111018] h-1.5 rounded-full overflow-hidden border border-[#1b1926]">
                      <div 
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

      {/* Custom Graphics & Signals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Performance Chart */}
        <div className="card card-elevated p-6 lg:col-span-8 flex flex-col">
          <PortfolioGrowthChart initialCapital={capital} height={240} />
        </div>

        {/* Latest Signals */}
        <div className="card card-elevated p-6 lg:col-span-4 flex flex-col h-96 overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">Daftar Sinyal Terbaru</h3>
              <p className="text-[11px] text-[#686477] font-sans">Rekomendasi taktis instan.</p>
            </div>
            <Clock className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="overflow-y-auto pr-1 space-y-3">
            {signals.map((sig) => (
              <div 
                key={sig.id} 
                className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-3.5 hover:bg-[#111018] hover:border-[#ccff00]/30 transition-colors cursor-pointer group"
                onClick={() => setLocation(`/ticker/${sig.symbol}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-xs group-hover:text-[#ccff00] transition-colors">{sig.symbol}</span>
                    <span className="text-[10px] text-[#686477] truncate max-w-[80px]">{sig.name}</span>
                  </div>
                  <SignalBadge signal={sig.signal} />
                </div>
                <p className="text-[10px] text-[#9f9bac] leading-relaxed mb-2">{sig.reason}</p>
                <span className="text-[9px] font-mono text-[#686477]">{new Date(sig.time).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Picks grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table of active Stock Picks */}
        <div className="card card-elevated p-6 lg:col-span-12 flex flex-col">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">Daftar Rekomendasi (Stock Picks / Asset List)</h3>
            <p className="text-[11px] text-[#686477] font-sans mb-4">Bobot alokasi dihitung proporsional dari total modal saham.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#1b1926] text-[#686477]">
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px]">Instrumen</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px]">Perusahaan</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px] text-center">Skor Kuantitasi</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px] text-center">Bobot</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px]">Alokasi Dana</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px]">Sinyal</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-[9px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926]">
                {stockPicks.map((pick, i) => {
                  const colors = ['bg-[#ccff00]/10 text-[#ccff00]', 'bg-[#00f0ff]/10 text-[#00f0ff]', 'bg-purple-500/10 text-purple-400', 'bg-pink-500/10 text-pink-400', 'bg-orange-500/10 text-orange-400'];
                  return (
                    <tr key={pick.symbol} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-3.5">
                        <div 
                          className="flex items-center gap-3 cursor-pointer group-hover:text-[#ccff00]" 
                          onClick={() => setLocation(`/ticker/${pick.symbol}`)}
                        >
                          <TickerLogo symbol={pick.symbol} sizeClassName="w-8 h-8" />
                          <span className="font-extrabold font-mono text-white text-sm transition-colors group-hover:text-[#ccff00]">{pick.symbol}</span>
                        </div>
                      </td>
                      <td 
                        className="py-3.5 text-[#9f9bac] font-medium max-w-[150px] truncate cursor-pointer hover:text-white transition-colors"
                        onClick={() => setLocation(`/ticker/${pick.symbol}`)}
                      >
                        {pick.name}
                      </td>
                      <td className="py-3.5 text-center font-extrabold font-mono text-white">{typeof pick.score === 'number' ? pick.score.toFixed(1) : pick.score}</td>
                      <td className="py-3.5 text-center font-mono text-[#ccff00] font-bold">{pick.weight}%</td>
                      <td className="py-3.5 font-mono text-[#00f5a0] font-extrabold">{formatIDR(pick.allocation)}</td>
                      <td className="py-3.5"><SignalBadge signal={pick.signal} /></td>
                      <td className="py-3.5 text-right">
                        <button
                          id={`portfolio-view-ticker-${pick.symbol}`}
                          onClick={() => setLocation(`/ticker/${pick.symbol}`)}
                          className="px-3 py-1.5 text-[10px] bg-[#111018] hover:bg-[#ccff00] border border-[#1b1926] hover:border-transparent rounded-xl text-[#9f9bac] hover:text-black font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Analisis
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Portfolio;
