import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { TickerLogo } from '../components/TickerLogo';
import { Strategy } from '../types';
import { Plus, Trash2, Shield, Check, Sliders, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export const Compare: React.FC = () => {
  const [, setLocation] = useLocation();
  const { strategies, portfolioConfig, updatePortfolioConfig, tickers } = useAppStore();

  // Active column strategy IDs
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(() => {
    if (strategies && strategies.length > 0) {
      const activeId = portfolioConfig?.strategyTemplate || strategies[0].id;
      const otherIds = strategies.map(s => s.id).filter(id => id !== activeId);
      return [activeId, ...otherIds].slice(0, 3);
    }
    return ['strat-1', 'strat-2'];
  });

  // Calculate top tickers for a strategy based on its factor weights
  const getTopTickersForStrategy = (strat: Strategy) => {
    if (!tickers || tickers.length === 0) {
      return [
        { symbol: 'BBCA', score: 88 },
        { symbol: 'BBRI', score: 85 },
        { symbol: 'TLKM', score: 79 },
        { symbol: 'ASII', score: 65 }
      ];
    }

    return tickers
      .map(t => {
        const qScore = t.quality || 50;
        const mScore = t.moment || 50;
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
          const strat = strategies.find(s => s.id === stratId) || strategies[0];
          if (!strat) return null;

          const isActive = portfolioConfig?.strategyTemplate === strat.id;
          const topTickers = getTopTickersForStrategy(strat);

          return (
            <div key={`${strat.id}-${idx}`} className="card card-elevated p-6 flex flex-col justify-between space-y-5 relative bg-[#0b0a10]/45">
              {/* Delete / Remove Column Button */}
              {selectedStrategyIds.length > 1 && (
                <button
                  id={`remove-col-btn-${idx}`}
                  onClick={() => removeColumn(idx)}
                  className="absolute top-5 right-5 text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer z-10"
                  title="Hapus kolom komparasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-4">
                {/* Column Strategy Selector Dropdown */}
                <div className="space-y-1 pr-7">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#ccff00] uppercase font-mono tracking-wider">
                      Formula Komparasi #{idx + 1}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span> Aktif
                      </span>
                    )}
                  </div>

                  {/* Selector dropdown from Strategy Builder */}
                  <select
                    value={strat.id}
                    onChange={(e) => changeColumnStrategy(idx, e.target.value)}
                    className="w-full bg-[#111018] border border-[#1b1926] text-white text-xs font-bold rounded-xl px-3 py-2 mt-1 focus:outline-none focus:border-[#ccff00]/50 cursor-pointer"
                  >
                    {strategies.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0c0b12] text-white font-sans">
                        {s.name} {portfolioConfig?.strategyTemplate === s.id ? '(Aktif)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description & Capital */}
                <div>
                  <p className="text-xs text-[#9f9bac] font-sans leading-relaxed line-clamp-2">{strat.description}</p>
                  <div className="mt-2 text-xs text-[#9f9bac] font-sans font-medium flex items-center justify-between bg-[#111018]/50 p-2.5 rounded-xl border border-[#1b1926]">
                    <span>Modal Acuan:</span>
                    <span className="font-mono text-white font-bold">{formatIDR(capital)}</span>
                  </div>
                </div>

                {/* Stacked Asset Allocation Horizontal Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-sans">
                    <span className="text-[#9f9bac] font-semibold">Alokasi Sasaran Makro</span>
                    <span className="text-[#686477] font-mono font-bold">100%</span>
                  </div>
                  
                  <div className="w-full h-3.5 rounded-lg overflow-hidden flex border border-[#1b1926] bg-[#111018]">
                    <div style={{ width: `${strat.allocationSaham}%` }} className="h-full bg-[#ccff00]" title={`Saham: ${strat.allocationSaham}%`}></div>
                    <div style={{ width: `${strat.allocationEmas}%` }} className="h-full bg-[#00f0ff]" title={`Emas: ${strat.allocationEmas}%`}></div>
                    <div style={{ width: `${strat.allocationCash}%` }} className="h-full bg-[#a855f7]" title={`Kas IDR: ${strat.allocationCash}%`}></div>
                    <div style={{ width: `${strat.allocationUSD}%` }} className="h-full bg-[#6366f1]" title={`USD Cash: ${strat.allocationUSD}%`}></div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-[#9f9bac] pt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span>
                      <span>Saham:{strat.allocationSaham}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                      <span>Emas:{strat.allocationEmas}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>
                      <span>Kas:{strat.allocationCash}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span>
                      <span>USD:{strat.allocationUSD}%</span>
                    </div>
                  </div>
                </div>

                {/* Factor Scoring Weights breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-[#1b1926]">
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
                <div className="space-y-2 pt-2 border-t border-[#1b1926]">
                  <div className="flex justify-between items-center text-[10px] font-sans">
                    <span className="font-bold uppercase tracking-wider text-[#686477]">Konstituen Unggulan Strategy</span>
                    <span className="text-[#686477] font-mono">Top 4</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {topTickers.map((t) => (
                      <div 
                        key={t.symbol} 
                        className="bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <TickerLogo symbol={t.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                          <div>
                            <span className="font-mono font-extrabold text-white block">{t.symbol}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-[#686477] text-[10px]">Skor:</span>
                          <span className="text-[#00f5a0] font-extrabold">{typeof t.score === 'number' ? t.score.toFixed(1) : t.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-[#1b1926] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#686477]">
                  <span>Crash: <strong className="text-[#f59e0b]">{strat.crashThreshold}%</strong></span>
                  <span>|</span>
                  <span>SL: <strong className="text-[#ff3366]">{strat.stopLoss}%</strong></span>
                </div>

                {isActive ? (
                  <span className="text-[11px] text-[#ccff00] font-bold flex items-center gap-1 font-sans">
                    <Check className="w-3.5 h-3.5" /> Sedang Digunakan
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
                      toast.success(`Strategi aktif berhasil diubah ke "${strat.name}"`);
                    }}
                    className="px-3 py-1.5 bg-[#1b1926] hover:bg-[#ccff00] hover:text-black text-[#9f9bac] text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    Aktifkan Formula <ArrowRight className="w-3 h-3" />
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

