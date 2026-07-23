/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { OptimizerResult } from '../types';
import { Settings, Play, Check, AlertTriangle, Cpu, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const Optimizer: React.FC = () => {
  const { strategies, updatePortfolioConfig } = useAppStore();
  
  const [template, setTemplate] = useState(strategies[0]?.id || 'strat-1');
  const [capital, setCapital] = useState(500000000);
  const [minTopN, setMinTopN] = useState(5);
  const [maxTopN, setMaxTopN] = useState(20);
  const [minRebDays, setMinRebDays] = useState(7);
  const [maxRebDays, setMaxRebDays] = useState(30);
  const [method, setMethod] = useState<'Walk-Forward' | 'Brute Force'>('Brute Force');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OptimizerResult[]>([]);

  const handleRunOptimization = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/optimize/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          capital,
          minTopN,
          maxTopN,
          minRebDays,
          maxRebDays,
          method
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
        toast.success('Optimasi kuantitatif selesai dihitung!');
      }
    } catch (err) {
      console.error('Error optimizing:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyBestParams = (topN: number) => {
    updatePortfolioConfig({ topN });
    toast.success(`Parameter Top N berhasil diupdate ke ${topN}!`);
  };

  return (
    <div id="optimizer-view" className="px-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Walk-Forward Optimizer</h1>
          <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Temukan parameter rebalancing optimal melalui pemindaian brute force historis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input Form Column */}
        <div className="card card-elevated p-6 lg:col-span-4 h-fit bg-[#0b0a10]/45">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#ccff00]" /> Console Optimasi
          </h3>
          
          <form onSubmit={handleRunOptimization} className="space-y-4.5 text-xs font-sans font-medium">
            {/* Template Select */}
            <div className="space-y-2">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Strategi Dasar</label>
              <select
                id="optimize-template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
              >
                {strategies.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#12111f]">{s.name}</option>
                ))}
              </select>
            </div>

            {/* Capital */}
            <div className="space-y-2">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Alokasi Capital (Rp)</label>
              <input
                id="optimize-capital"
                type="number"
                value={capital}
                onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
              />
            </div>

            {/* Min/Max Top N bounds */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Min Top N</label>
                <input
                  id="optimize-min-topn"
                  type="number"
                  min="1"
                  max="50"
                  value={minTopN}
                  onChange={(e) => setMinTopN(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Max Top N</label>
                <input
                  id="optimize-max-topn"
                  type="number"
                  min="1"
                  max="50"
                  value={maxTopN}
                  onChange={(e) => setMaxTopN(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
                />
              </div>
            </div>

            {/* Min/Max Rebalance Days bounds */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Min Reb. Days</label>
                <input
                  id="optimize-min-days"
                  type="number"
                  min="5"
                  max="90"
                  value={minRebDays}
                  onChange={(e) => setMinRebDays(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Max Reb. Days</label>
                <input
                  id="optimize-max-days"
                  type="number"
                  min="5"
                  max="90"
                  value={maxRebDays}
                  onChange={(e) => setMaxRebDays(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
                />
              </div>
            </div>

            {method === 'Walk-Forward' && (
              <div className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 p-3 rounded-xl">
                <strong>Multi-Tier Rotation Aktif:</strong> Optimasi ini mensimulasikan rotasi dinamis ke Emas/Cash saat momentum Saham (Top N) turun.
              </div>
            )}
            
            {/* Optimizer Search Method */}
            <div className="space-y-2">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] block">Metode Pencarian</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Walk-Forward', 'Brute Force'] as const).map((m) => (
                  <button
                    key={m}
                    id={`optimize-method-${m.replace(/\s+/g, '')}`}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`px-2 py-2.5 border rounded-xl font-extrabold transition-all text-[11px] cursor-pointer ${
                      method === m 
                        ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                        : 'bg-[#111018]/60 border border-[#1b1926] text-[#686477] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              id="optimize-trigger-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] disabled:bg-white/5 disabled:text-[#4b5563] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Memindai Ruang Sinyal...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current stroke-[2.5px]" /> Jalankan Optimasi
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Matrix Table Column */}
        <div className="lg:col-span-8">
          {results.length === 0 && !loading ? (
            <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-[#0b0a10]/45">
              <div className="w-12 h-12 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Menunggu Optimasi Parameter</h3>
              <p className="text-[11px] text-[#686477] max-w-xs mt-1 font-sans font-medium">
                SafeHeaven Optimizer akan mengevaluasi kombinasi grid matrix untuk menemukan Return & Sharpe Ratio superior.
              </p>
            </div>
          ) : loading ? (
            <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-[#0b0a10]/45">
              <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
              <h4 className="text-xs font-extrabold text-white mt-4 font-sans uppercase tracking-wider">Pemindaian Grid Matrix</h4>
              <p className="text-[10px] text-[#686477] mt-1 font-sans font-medium">Menganalisis 16 permutasi parameter Walk-Forward...</p>
            </div>
          ) : (
            <div className="card card-elevated p-6 space-y-4 animate-fadeIn bg-[#0b0a10]/45">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">Tabel Sebaran Optimasi (Grid Matrix)</h3>
                <p className="text-[11px] text-[#686477] font-sans mt-0.5">Kombinasi parameter paling optimal diberi penanda premium bintang emas.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#1b1926] text-[#686477]">
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Top N</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Interval (Days)</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Total Return</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Sharpe Ratio</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Max Drawdown</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b1926] font-mono">
                    {results.map((r, idx) => {
                      const isBest = idx === 0; // Assuming API returns sorted
                      return (
                        <tr 
                          key={`${r.topN}-${r.rebalanceDays}`} 
                          className={`hover:bg-[#111018]/40 transition-colors ${
                            isBest ? 'bg-[#ccff00]/5 border-l-2 border-l-[#ccff00]' : ''
                          }`}
                        >
                          <td className="py-3.5 pl-3 text-white font-extrabold">
                            {r.topN} {isBest && <span className="text-[#ccff00] font-sans ml-1 text-[10px] font-extrabold uppercase tracking-wider">★ Best</span>}
                          </td>
                          <td className="py-3.5 text-white font-semibold">{r.rebalanceDays} Hari</td>
                          <td className="py-3.5 text-[#00f5a0] font-extrabold">+{r.totalReturn}%</td>
                          <td className="py-3.5 text-[#00f0ff] font-extrabold">{r.sharpeRatio}</td>
                          <td className="py-3.5 text-[#ff3366] font-semibold">{r.maxDrawdown}%</td>
                          <td className="py-3.5 text-right pr-3">
                            {isBest ? (
                              <button
                                id={`optimize-apply-best-btn`}
                                onClick={() => applyBestParams(r.topN)}
                                className="px-3 py-1.5 text-[10px] bg-[#ccff00] hover:bg-[#ddff33] text-black rounded-xl font-extrabold transition-all flex items-center gap-1 cursor-pointer ml-auto active:scale-95"
                              >
                                <Check className="w-3 h-3 stroke-[3]" /> Apply Best
                              </button>
                            ) : (
                              <button
                                id={`optimize-apply-${r.topN}`}
                                onClick={() => applyBestParams(r.topN)}
                                className="px-3 py-1.5 text-[10px] bg-[#111018]/80 hover:bg-[#ccff00]/10 text-[#9f9bac] hover:text-[#ccff00] border border-[#1b1926] hover:border-[#ccff00]/30 rounded-xl transition-all cursor-pointer ml-auto font-extrabold"
                              >
                                Apply
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
