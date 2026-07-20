/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { BacktestResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Download, Percent, ShieldCheck, Activity, BarChart2, Calendar } from 'lucide-react';

export const Backtest: React.FC = () => {
  const { strategies } = useAppStore();
  const [template, setTemplate] = useState(strategies[0]?.id || 'strat-1');
  const [capital, setCapital] = useState(500000000);
  const [topN, setTopN] = useState(10);
  const [rebalanceDays, setRebalanceDays] = useState(14);
  const [mode, setMode] = useState<'Buy & Hold' | 'Periodic' | 'Threshold' | 'Dynamic'>('Dynamic');
  const [threshold, setThreshold] = useState(5);
  const [startDate, setStartDate] = useState('2025-07-20');
  const [endDate, setEndDate] = useState('2026-07-20');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/backtest/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capital,
          topN,
          rebalanceDays,
          mode,
          thresholdPercent: threshold,
          startDate,
          endDate
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Error running backtest:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = 'Tanggal,Ticker,Aksi,Harga,Jumlah,Total\n';
    const rows = result.tradeMarkers.map(t => `${t.date},${t.ticker},${t.action},${t.price},${t.amount},${t.total}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backtest_trades_${Date.now()}.csv`;
    link.click();
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div id="backtest-view" className="px-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Strategic Backtest</h1>
          <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Simulasikan kinerja historis alokasi taktis untuk menguji durabilitas momentum.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input Configuration Form */}
        <div className="card card-elevated p-6 lg:col-span-4 h-fit bg-[#0b0a10]/45">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-4">Konsol Konfigurasi</h3>
          
          <form onSubmit={runBacktest} className="space-y-4.5 text-xs font-sans font-medium">
            {/* Template Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Pilih Model Strategi</label>
              <select
                id="backtest-template-select"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
              >
                {strategies.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#12111f]">{s.name}</option>
                ))}
              </select>
            </div>

            {/* Capital Input */}
            <div className="space-y-2">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Alokasi Modal Awal (Rp)</label>
              <input
                id="backtest-capital-input"
                type="number"
                value={capital}
                onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
              />
            </div>

            {/* Top N Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Jumlah Top N Saham</label>
                <span className="font-mono text-[#ccff00] font-extrabold">{topN} Saham</span>
              </div>
              <input
                id="backtest-topn-slider"
                type="range"
                min="1"
                max="50"
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>

            {/* Rebalance Days */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Interval Penyeimbangan</label>
                <span className="font-mono text-[#ccff00] font-extrabold">{rebalanceDays} Hari</span>
              </div>
              <input
                id="backtest-rebalance-slider"
                type="range"
                min="5"
                max="90"
                value={rebalanceDays}
                onChange={(e) => setRebalanceDays(parseInt(e.target.value))}
                className="w-full accent-[#ccff00]"
              />
            </div>

            {/* Mode Radios */}
            <div className="space-y-2">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] block">Mode Rebalancing</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Buy & Hold', 'Periodic', 'Threshold', 'Dynamic'] as const).map((m) => (
                  <button
                    key={m}
                    id={`backtest-mode-btn-${m.replace(/\s+/g, '')}`}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-2 py-2.5 border rounded-xl font-extrabold transition-all text-[11px] cursor-pointer ${
                      mode === m 
                        ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                        : 'bg-[#111018]/60 border border-[#1b1926] text-[#686477] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Threshold % */}
            {(mode === 'Threshold' || mode === 'Dynamic') && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Threshold Deviasi (%)</label>
                  <span className="font-mono text-[#00f0ff] font-extrabold">±{threshold}%</span>
                </div>
                <input
                  id="backtest-threshold-slider"
                  type="range"
                  min="1"
                  max="20"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full accent-[#00f0ff]"
                />
              </div>
            )}

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#686477]" /> Start Date
                </label>
                <input
                  id="backtest-startdate-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#686477]" /> End Date
                </label>
                <input
                  id="backtest-enddate-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold text-xs"
                />
              </div>
            </div>

            {/* Trigger Button */}
            <button
              id="run-backtest-trigger-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] disabled:bg-white/5 disabled:text-[#4b5563] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Mensimulasi Sinyal...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current stroke-[2.5px]" /> Jalankan Backtest
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results view column */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !loading ? (
            <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-[#0b0a10]/45">
              <div className="w-12 h-12 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Menunggu Simulasi</h3>
              <p className="text-[11px] text-[#686477] max-w-xs mt-1 font-sans font-medium">
                Gunakan panel konfigurasi kiri untuk menghitung dan me-render grafik performa aset historis.
              </p>
            </div>
          ) : loading ? (
            <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-[#0b0a10]/45">
              <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
              <h4 className="text-xs font-extrabold text-white mt-4 font-sans uppercase tracking-wider">Menghitung Matrix Sharpe & Drawdown</h4>
              <p className="text-[10px] text-[#686477] mt-1 font-sans font-medium">Menganalisis 250+ baris data pasar historis...</p>
            </div>
          ) : (
            result && (
              <div className="space-y-6 animate-fadeIn">
                {/* Visual line graph */}
                <div className="card card-elevated p-6 bg-[#0b0a10]/45">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight font-sans">Kurva Ekuitas (Equity Curve)</h3>
                      <p className="text-[11px] text-[#686477] font-sans mt-0.5">Hasil taktis model SafeHeaven vs Buy & Hold standar.</p>
                    </div>
                    <button
                      id="export-backtest-csv-btn"
                      onClick={exportCSV}
                      className="text-[10px] bg-[#111018]/60 hover:bg-[#ccff00]/10 text-[#ccff00] border border-[#1b1926] px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5px]" /> Export CSV
                    </button>
                  </div>

                  <div className="w-full h-64 font-mono text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.equityCurve}>
                        <defs>
                          <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1b1926" />
                        <XAxis dataKey="date" stroke="#686477" />
                        <YAxis 
                          stroke="#686477" 
                          tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0c0b12', borderColor: '#1b1926', borderRadius: '12px' }}
                          labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                          formatter={(value: any) => [formatIDR(value), '']}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Plus Jakarta Sans', fontWeight: 'bold' }} />
                        <Area type="monotone" dataKey="value" name="SafeHeaven Taktis" stroke="#ccff00" fill="url(#colorStrategy)" strokeWidth={2} />
                        <Area type="monotone" dataKey="ihsg" name="IHSG" stroke="#00f0ff" fill="transparent" strokeWidth={2} />
                        <Area type="monotone" dataKey="gold" name="Emas" stroke="#ffcc00" fill="transparent" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Total Return */}
                  <div className="card card-elevated p-4 text-center space-y-1 bg-[#0b0a10]/45">
                    <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Total Return</span>
                    <h3 className="text-base font-extrabold font-mono text-[#00f5a0]">{result.metrics.totalReturn}%</h3>
                  </div>
                  {/* CAGR */}
                  <div className="card card-elevated p-4 text-center space-y-1 bg-[#0b0a10]/45">
                    <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">CAGR</span>
                    <h3 className="text-base font-extrabold font-mono text-[#00f5a0]">{result.metrics.cagr}%</h3>
                  </div>
                  {/* Max Drawdown */}
                  <div className="card card-elevated p-4 text-center space-y-1 bg-[#0b0a10]/45">
                    <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Max Drawdown</span>
                    <h3 className="text-base font-extrabold font-mono text-[#ff3366]">{result.metrics.maxDrawdown}%</h3>
                  </div>
                  {/* Sharpe */}
                  <div className="card card-elevated p-4 text-center space-y-1 bg-[#0b0a10]/45">
                    <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Sharpe Ratio</span>
                    <h3 className="text-base font-extrabold font-mono text-[#00f0ff]">{result.metrics.sharpeRatio}</h3>
                  </div>
                  {/* Volatility */}
                  <div className="card card-elevated p-4 text-center space-y-1 col-span-2 sm:col-span-1 bg-[#0b0a10]/45">
                    <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Volatilitas</span>
                    <h3 className="text-base font-extrabold font-mono text-white">{result.metrics.volatility}%</h3>
                  </div>
                </div>

                {/* Trade logs */}
                <div className="card card-elevated p-6 bg-[#0b0a10]/45">
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-4">Log Transaksi Rebalancing</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#1b1926] text-[#686477]">
                          <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Tanggal</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Aksi</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Harga</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Jumlah Lembar</th>
                          <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Total Transaksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b1926] font-mono">
                        {result.tradeMarkers.map((t) => (
                          <tr key={t.id} className="hover:bg-[#111018]/40 transition-colors">
                            <td className="py-3.5 text-[#9f9bac] font-medium">{t.date}</td>
                            <td className="py-3.5 text-white font-extrabold">{t.ticker}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.action === 'Beli' ? 'bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/20' : 'bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/20'}`}>
                                {t.action}
                              </span>
                            </td>
                            <td className="py-3.5 text-white font-semibold">Rp {t.price.toLocaleString('id-ID')}</td>
                            <td className="py-3.5 text-[#9f9bac]">{t.amount.toLocaleString('id-ID')}</td>
                            <td className="py-3.5 text-white font-bold text-right">{formatIDR(t.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
