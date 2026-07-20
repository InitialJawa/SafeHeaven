import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../stores';
import { SignalBadge } from '../components/SignalBadge';
import { TickerLogo } from '../components/TickerLogo';
import { Wallet, Settings, Award, TrendingUp, Compass, ArrowRight, Eye, CheckCircle } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    portfolioConfig, 
    stockPicks, 
    tier, 
    tierProgress, 
    fetchInitialData 
  } = useAppStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

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
    { name: 'Saham', pct: portfolioConfig.allocationSaham, color: 'bg-[#ccff00]', text: 'text-[#ccff00]' },
    { name: 'Emas Batangan', pct: portfolioConfig.allocationEmas, color: 'bg-[#00f0ff]', text: 'text-[#00f0ff]' },
    { name: 'Cash IDR', pct: portfolioConfig.allocationCash, color: 'bg-[#a855f7]', text: 'text-[#a855f7]' },
    { name: 'USD Currency', pct: portfolioConfig.allocationUSD, color: 'bg-[#6366f1]', text: 'text-[#6366f1]' }
  ];

  return (
    <div id="portfolio-view" className="px-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">{portfolioConfig.strategyName}</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
              Universe: <span className="text-[#ccff00] font-bold">{portfolioConfig.universe}</span> • Top N Target: <span className="text-white font-bold">{portfolioConfig.topN} Saham Utama</span>
            </p>
          </div>
        </div>
        <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-5 py-3.5 text-right min-w-[200px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#686477]">Total Capital Allocation</span>
          <h2 className="text-xl font-bold font-mono text-[#ccff00] mt-0.5">{formatIDR(capital)}</h2>
        </div>
      </div>

      {/* 4 AllocationCards Horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {allocations.map((item) => {
          const absoluteVal = (capital * item.pct) / 100;
          return (
            <div key={item.name} className="card card-elevated p-5 space-y-3 bg-[#0b0a10]/45">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9f9bac] font-sans font-semibold">{item.name}</span>
                <span className={`text-xs font-extrabold font-mono ${item.text}`}>{item.pct}%</span>
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

      {/* Stock Picks and Tier grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table of active Stock Picks */}
        <div className="card card-elevated p-6 lg:col-span-8 flex flex-col">
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
                        <div className="flex items-center gap-3">
                          <TickerLogo symbol={pick.symbol} sizeClassName="w-8 h-8" />
                          <span className="font-extrabold font-mono text-white text-sm">{pick.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#9f9bac] font-medium max-w-[150px] truncate">{pick.name}</td>
                      <td className="py-3.5 text-center font-extrabold font-mono text-white">{pick.score}</td>
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

        {/* Tier Status card */}
        <div className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between bg-[#0b0a10]/45">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-[#ccff00]" />
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">Checkpoint Premium</h3>
            </div>
            <p className="text-[11px] text-[#9f9bac] leading-relaxed font-sans mb-4">
              Status akun Anda meningkat selaras dengan pertambahan alokasi modal dan konsistensi diversifikasi aset.
            </p>

            <div className="bg-[#111018] border border-[#1b1926] rounded-xl p-4 space-y-3.5 shadow-inner">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-[#686477]">Tier Sekarang</span>
                <span className="text-[#ccff00] font-bold">{tier}</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-[#686477]">Target Berikutnya</span>
                <span className="text-[#00f0ff] font-bold">Tier {tierProgress.current === 4 ? 'Apex VIP' : 'Platinum'}</span>
              </div>

              {/* Tier Progress visual dots */}
              <div className="flex items-center space-x-1.5 py-1">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div 
                    key={idx}
                    className={`flex-1 h-2 rounded-full border border-black/30 transition-colors ${idx <= tierProgress.current ? 'bg-[#ccff00]' : 'bg-[#1b1926]'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1b1926] mt-4 text-[11px] text-[#686477] leading-relaxed font-sans flex items-start gap-2">
            <span className="text-[#ccff00] font-bold shrink-0">Syarat:</span>
            <span>{tierProgress.req}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
