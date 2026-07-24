import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { TickerLogo } from '../components/TickerLogo';
import { Strategy } from '../types';
import { Plus, Trash2, Shield, Check, Sliders, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export const Compare: React.FC = () => {
  const [, setLocation] = useLocation();
  const { strategies, portfolioConfig, updatePortfolioConfig, tickers } = useAppStore();

  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${window.location.origin}/api/market/analysis-matrix`)
      .then(res => res.json())
      .then(result => {
        if (result.data) setStocks(result.data);
        else if (Array.isArray(result)) setStocks(result);
      })
      .catch(err => console.error('Failed to load matrix for compare:', err));
  }, []);

  // Active column strategy IDs
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(() => {
    if (strategies && strategies.length > 0) {
      const activeId = portfolioConfig?.strategyTemplate || strategies[0].id;
      const otherIds = strategies.map(s => s.id).filter(id => id !== activeId);
      return [activeId, ...otherIds].slice(0, 3);
    }
    return ['strat-1', 'strat-2'];
  });

  // Calculate top tickers for a strategy based on its factor weights using real matrix data
  const getTopTickersForStrategy = (strat: Strategy) => {
    const list = stocks.length > 0 ? stocks : tickers;
    if (!list || list.length === 0) {
      return [
        { symbol: 'BBCA', score: 88 },
        { symbol: 'BBRI', score: 85 },
        { symbol: 'TLKM', score: 79 },
        { symbol: 'ASII', score: 65 }
      ];
    }

    return list
      .map((t: any) => {
        const qScore = t.quality || 50;
        const mScore = t.moment || t.momentum || 50;
        const vScore = t.value || 50;
        const gScore = t.growth || 50;
        const dScore = t.dividen || 0;

        const totalWeight = (strat.weightQuality + strat.weightMomentum + strat.weightValue + strat.weightGrowth + strat.weightDividend) || 100;
        const weightedScore = parseFloat(
          ((qScore * strat.weightQuality +
           mScore * strat.weightMomentum +
           vScore * strat.weightValue +
           gScore * strat.weightGrowth +
           dScore * strat.weightDividend) / totalWeight).toFixed(1)
        );

        return {
          symbol: t.symbol,
          name: t.name,
          score: weightedScore
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  };

  const addComparisonColumn = () => {
    // Find a strategy not currently selected
    const unselected = strategies.find(s => !selectedStrategyIds.includes(s.id));
    if (unselected) {
      setSelectedStrategyIds([...selectedStrategyIds, unselected.id]);
    } else if (strategies.length > 0) {
      // If all are selected, duplicate the first available strategy
      setSelectedStrategyIds([...selectedStrategyIds, strategies[0].id]);
    }
  };

  const removeColumn = (index: number) => {
    if (selectedStrategyIds.length <= 1) return;
    setSelectedStrategyIds(selectedStrategyIds.filter((_, i) => i !== index));
  };

  const changeColumnStrategy = (index: number, newStratId: string) => {
    const updated = [...selectedStrategyIds];
    updated[index] = newStratId;
    setSelectedStrategyIds(updated);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const capital = portfolioConfig?.capital || 500000000;

  const getSimulatedPerformance = (strat: Strategy) => {
    const sahamReturn = 0.15 + (strat.weightQuality / 100 * 0.05) + (strat.weightGrowth / 100 * 0.10);
    const emasReturn = 0.08;
    const cashReturn = 0.04;
    const usdReturn = 0.05;
    
    const weightedReturn = (
      (strat.allocationSaham / 100 * sahamReturn) +
      (strat.allocationEmas / 100 * emasReturn) +
      (strat.allocationCash / 100 * cashReturn) +
      (strat.allocationUSD / 100 * usdReturn)
    );
    
    const baseYield = 0.01;
    const extraYield = (strat.weightDividend / 100) * 0.08;
    const expectedYield = (strat.allocationSaham / 100) * (baseYield + extraYield);
    
    return {
      returnPct: weightedReturn * 100,
      returnValue: capital * weightedReturn,
      dividendValue: capital * expectedYield
    };
  };

  return (
    <div id="compare-portfolio-view" className="px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Bandingkan Portofolio</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
              Membaca dan membandingkan strategi yang dibuat pada tab Strategy Builder secara paralel.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation('/strategies')}
            className="px-3.5 py-2.5 bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white text-xs font-bold rounded-xl border border-[#1b1926] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#ccff00]" /> Strategy Builder
          </button>

          <button
            id="add-comparison-col-btn"
            onClick={addComparisonColumn}
            className="px-4 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> Tambah Komparasi
          </button>
        </div>
      </div>

      {/* Grid containing comparison columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {selectedStrategyIds.map((stratId, idx) => {
          const strat = strategies.find(s => s.id === stratId);
          if (!strat) return null;
          
          const isActive = portfolioConfig?.strategyTemplate === strat.id;
          const topTickers = getTopTickersForStrategy(strat);
          const perf = getSimulatedPerformance(strat);

          return (
            <div key={`${strat.id}-${idx}`} className="card card-elevated p-0 flex flex-col justify-between overflow-hidden relative bg-[#0b0a10]/45 border-[#1b1926] shadow-xl group">
              {/* Delete / Remove Column Button */}
              {selectedStrategyIds.length > 1 && (
                <button
                  id={`remove-col-btn-${idx}`}
                  onClick={() => removeColumn(idx)}
                  className="absolute top-4 right-4 text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-[#111018] rounded-lg transition-colors cursor-pointer z-10"
                  title="Hapus kolom komparasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Header with Selector */}
              <div className="p-5 border-b border-[#1b1926] bg-[#111018]/40">
                <div className="flex items-center gap-2 mb-3 pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#686477] font-sans">Formula Komparasi #{idx + 1}</span>
                  {isActive && (
                    <span className="px-2 py-0.5 bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-[9px] font-bold uppercase rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span> Aktif
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <select
                    value={stratId}
                    onChange={(e) => changeColumnStrategy(idx, e.target.value)}
                    className="w-full bg-[#1b1926] border border-[#2a273b] text-white text-sm font-bold font-sans rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-[#ccff00]/50 transition-colors pr-8 cursor-pointer"
                  >
                    {strategies.map(s => (
                      <option key={s.id} value={s.id}>{s.name} {portfolioConfig?.strategyTemplate === s.id ? '(Aktif)' : ''}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#686477]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <p className="text-[11px] text-[#9f9bac] font-sans mt-2 line-clamp-2">{strat.description}</p>
              </div>

              <div className="p-5 space-y-5 flex-1">
                {/* Hero Metrics (1Y Proyeksi) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#9f9bac] text-[10px] mb-1">
                      <TrendingUp className="w-3 h-3 text-[#ccff00]" />
                      <span className="uppercase tracking-wide font-bold">Est. Return</span>
                    </div>
                    <span className="font-mono text-[#ccff00] font-extrabold text-xl">+{perf.returnPct.toFixed(2)}%</span>
                    <span className="font-mono text-white text-[11px] block mt-0.5">+{formatIDR(perf.returnValue)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#9f9bac] text-[10px] mb-1">
                      <DollarSign className="w-3 h-3 text-[#00f5a0]" />
                      <span className="uppercase tracking-wide font-bold">Proyeksi Div</span>
                    </div>
                    <span className="font-mono text-white font-extrabold text-xl">{formatIDR(perf.dividendValue)}</span>
                    <span className="font-mono text-[#686477] text-[11px] block mt-0.5">Per Tahun</span>
                  </div>
                </div>

                {/* Stacked Asset Allocation */}
                <div className="space-y-2 pt-4 border-t border-[#1b1926]">
                  <div className="flex justify-between items-center text-[10px] font-sans">
                    <span className="font-bold uppercase tracking-wider text-[#686477]">Alokasi Portofolio</span>
                    <span className="text-[#686477] font-mono">100%</span>
                  </div>
                  
                  <div className="w-full bg-[#111018] h-2 rounded-full overflow-hidden flex border border-[#1b1926]">
                    <div style={{ width: `${strat.allocationSaham}%` }} className="h-full bg-[#ccff00] transition-all" title={`Saham: ${strat.allocationSaham}%`}></div>
                    <div style={{ width: `${strat.allocationEmas}%` }} className="h-full bg-[#00f0ff] transition-all" title={`Emas: ${strat.allocationEmas}%`}></div>
                    <div style={{ width: `${strat.allocationCash}%` }} className="h-full bg-[#a855f7] transition-all" title={`Kas IDR: ${strat.allocationCash}%`}></div>
                    <div style={{ width: `${strat.allocationUSD}%` }} className="h-full bg-[#6366f1] transition-all" title={`USD Cash: ${strat.allocationUSD}%`}></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-[#9f9bac] pt-1">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span>
                      <span className="truncate">SHM:{strat.allocationSaham}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                      <span className="truncate">EMS:{strat.allocationEmas}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>
                      <span className="truncate">KAS:{strat.allocationCash}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span>
                      <span className="truncate">USD:{strat.allocationUSD}%</span>
                    </div>
                  </div>
                </div>

                {/* Factor Scoring Weights breakdown */}
                <div className="space-y-2 pt-4 border-t border-[#1b1926]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#686477] font-sans">Bobot Faktor Scoring</span>
                  <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                    <div className="bg-[#111018]/80 border border-[#1b1926] p-1.5 rounded-lg">
                      <div className="text-[8px] text-[#686477] uppercase font-sans">Qual</div>
                      <div className="text-[10px] font-extrabold text-[#ccff00] mt-0.5">{strat.weightQuality}%</div>
                    </div>
                    <div className="bg-[#111018]/80 border border-[#1b1926] p-1.5 rounded-lg">
                      <div className="text-[8px] text-[#686477] uppercase font-sans">Mom</div>
                      <div className="text-[10px] font-extrabold text-[#00f0ff] mt-0.5">{strat.weightMomentum}%</div>
                    </div>
                    <div className="bg-[#111018]/80 border border-[#1b1926] p-1.5 rounded-lg">
                      <div className="text-[8px] text-[#686477] uppercase font-sans">Val</div>
                      <div className="text-[10px] font-extrabold text-[#00f5a0] mt-0.5">{strat.weightValue}%</div>
                    </div>
                    <div className="bg-[#111018]/80 border border-[#1b1926] p-1.5 rounded-lg">
                      <div className="text-[8px] text-[#686477] uppercase font-sans">Grow</div>
                      <div className="text-[10px] font-extrabold text-white mt-0.5">{strat.weightGrowth}%</div>
                    </div>
                    <div className="bg-[#111018]/80 border border-[#1b1926] p-1.5 rounded-lg">
                      <div className="text-[8px] text-[#686477] uppercase font-sans">Div</div>
                      <div className="text-[10px] font-extrabold text-[#9f9bac] mt-0.5">{strat.weightDividend}%</div>
                    </div>
                  </div>
                </div>

                {/* Constituent Stock Picks */}
                <div className="space-y-2 pt-4 border-t border-[#1b1926]">
                  <div className="flex justify-between items-center text-[10px] font-sans">
                    <span className="font-bold uppercase tracking-wider text-[#686477]">Top 4 Konstituen</span>
                    <span className="text-[#686477] font-mono">Skor</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {topTickers.map((t) => (
                      <div 
                        key={t.symbol} 
                        className="bg-[#111018]/60 border border-[#1b1926] rounded-lg px-2 py-1.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          <TickerLogo symbol={t.symbol} sizeClassName="w-4 h-4" className="!rounded-md" />
                          <span className="font-mono font-extrabold text-white text-[10px]">{t.symbol}</span>
                        </div>
                        <span className="text-[#00f5a0] font-mono font-extrabold text-[10px]">{typeof t.score === 'number' ? t.score.toFixed(1) : t.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="px-5 py-4 bg-[#111018]/40 border-t border-[#1b1926] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#686477]">
                  <span>Crash: <strong className="text-[#f59e0b]">{strat.crashThreshold}%</strong></span>
                  <span>|</span>
                  <span>SL: <strong className="text-[#ff3366]">{strat.stopLoss}%</strong></span>
                </div>

                {isActive ? (
                  <span className="text-[11px] text-[#ccff00] font-bold flex items-center gap-1 font-sans">
                    <Check className="w-3.5 h-3.5" /> Aktif
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      updatePortfolioConfig({
                        strategyTemplate: strat.id,
                        strategyName: strat.name,
                        allocationSaham: strat.allocationSaham,
                        allocationEmas: strat.allocationEmas,
                        allocationCash: strat.allocationCash,
                        allocationUSD: strat.allocationUSD,
                        crashThreshold: strat.crashThreshold,
                        stopLoss: strat.stopLoss
                      });
                      toast.success(`Strategi ${strat.name} diaktifkan`);
                    }}
                    className="px-3 py-1.5 bg-[#ccff00]/10 hover:bg-[#ccff00] text-[#ccff00] hover:text-black text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                  >
                    Terapkan
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {/* Big plus placeholder column */}
        <div 
          onClick={addComparisonColumn}
          className="border-2 border-dashed border-[#1b1926] hover:border-[#ccff00]/40 rounded-2xl cursor-pointer p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all min-h-[350px] bg-[#0b0a10]/15 group hover:bg-[#ccff00]/[0.01] active:scale-98 select-none"
        >
          <div className="w-12 h-12 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] group-hover:border-[#ccff00]/30 group-hover:text-[#ccff00] transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white font-sans group-hover:text-[#ccff00] transition-colors">Tambah Slot Komparasi</h3>
            <p className="text-[11px] text-[#686477] max-w-xs mt-1 font-sans">
              Klik di sini untuk menambah kolom komparasi strategi lain yang telah dibuat di Strategy Builder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

