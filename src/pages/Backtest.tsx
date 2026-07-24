/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { BacktestResult } from '../types';
import { Play, Download, Percent, ShieldCheck, Activity, BarChart2, Calendar, CheckCircle2, Loader2, Database, Sparkles } from 'lucide-react';
import { BacktestEquityChart } from '../components/BacktestEquityChart';

interface BacktestStep {
  id: number;
  label: string;
  sublabel: string;
  progress: number;
  status: 'idle' | 'running' | 'completed';
}

export const Backtest: React.FC = () => {
  const { strategies, universes } = useAppStore();
  const [template, setTemplate] = useState(strategies[0]?.id || 'strat-1');
  const [strategyProfile, setStrategyProfile] = useState<string>('auto');
  const [universe, setUniverse] = useState(universes[0]?.name || 'All Saham');
  const [capital, setCapital] = useState(500000000);
  const [topN, setTopN] = useState(10);
  const [rebalanceDays, setRebalanceDays] = useState(14);
  const [mode, setMode] = useState<'Buy & Hold' | 'Periodic' | 'Threshold' | 'Dynamic'>('Dynamic');
  const [threshold, setThreshold] = useState(5);
  const [startDate, setStartDate] = useState('2021-01-04');
  const [endDate, setEndDate] = useState('2026-07-20');
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Menginisialisasi parameter portofolio...');
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');
  const [steps, setSteps] = useState<BacktestStep[]>([
    { id: 1, label: 'Inisialisasi Portofolio', sublabel: 'Mengatur parameter modal & bobot strategi...', progress: 0, status: 'idle' },
    { id: 2, label: 'Koneksi Data Emiten', sublabel: 'Mengambil data historis pergerakan harga saham...', progress: 0, status: 'idle' },
    { id: 3, label: 'Sinkronisasi Benchmark', sublabel: 'Menyelaraskan data IHSG (^JKSE) & Emas (GC=F)...', progress: 0, status: 'idle' },
    { id: 4, label: 'Kalkulasi & Rebalancing', sublabel: 'Menghitung sinyal transaksi & metrik Sharpe...', progress: 0, status: 'idle' }
  ]);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    setLoadingText('Menginisialisasi parameter portofolio...');

    const initialSteps: BacktestStep[] = [
      { id: 1, label: 'Inisialisasi Portofolio', sublabel: 'Mengatur parameter modal & bobot strategi...', progress: 0, status: 'running' },
      { id: 2, label: 'Koneksi Data Emiten', sublabel: 'Mengambil data historis pergerakan harga saham...', progress: 0, status: 'idle' },
      { id: 3, label: 'Sinkronisasi Benchmark', sublabel: 'Menyelaraskan data IHSG (^JKSE) & Emas (GC=F)...', progress: 0, status: 'idle' },
      { id: 4, label: 'Kalkulasi & Rebalancing', sublabel: 'Menghitung sinyal transaksi & metrik Sharpe...', progress: 0, status: 'idle' }
    ];
    setSteps(initialSteps);

    let activeStepIdx = 0;
    const currentStepProgresses = [0, 0, 0, 0];

    const interval = setInterval(() => {
      if (activeStepIdx < 4) {
        let stepProgress = currentStepProgresses[activeStepIdx];
        
        let increment = 0;
        if (activeStepIdx === 0) increment = Math.floor(Math.random() * 15) + 10; // fast
        else if (activeStepIdx === 1) increment = Math.floor(Math.random() * 8) + 6; // medium
        else if (activeStepIdx === 2) increment = Math.floor(Math.random() * 6) + 4; // medium-slow
        else if (activeStepIdx === 3) increment = Math.floor(Math.random() * 3) + 1; // slow

        stepProgress += increment;

        if (activeStepIdx === 3) {
          if (stepProgress > 95) stepProgress = 95; // Wait at 95% for actual fetch
        } else {
          if (stepProgress >= 100) {
            stepProgress = 100;
          }
        }

        currentStepProgresses[activeStepIdx] = stepProgress;

        // Map progresses back to steps
        setSteps(prev => prev.map((s, idx) => {
          let status: 'idle' | 'running' | 'completed' = 'idle';
          if (idx < activeStepIdx) status = 'completed';
          else if (idx === activeStepIdx) {
            status = stepProgress === 100 ? 'completed' : 'running';
          } else if (idx === activeStepIdx + 1 && stepProgress === 100) {
            status = 'running';
          }
          
          return {
            ...s,
            progress: idx === activeStepIdx ? stepProgress : (idx < activeStepIdx ? 100 : 0),
            status
          };
        }));

        // Overall progress is average of all 4 steps
        const overall = Math.round((currentStepProgresses[0] + currentStepProgresses[1] + currentStepProgresses[2] + currentStepProgresses[3]) / 4);
        setProgress(overall);

        // Update active loading texts to make it match the step labels
        if (activeStepIdx === 0) {
          setLoadingText('Menginisialisasi parameter portofolio...');
        } else if (activeStepIdx === 1) {
          setLoadingText('Koneksi data emiten: Mengambil 250+ baris data harga saham...');
        } else if (activeStepIdx === 2) {
          setLoadingText('Menyelaraskan data benchmark IHSG (^JKSE) & Emas (GC=F)...');
        } else if (activeStepIdx === 3) {
          setLoadingText('Mensimulasikan sinyal rebalancing & menghitung metrik Sharpe...');
        }

        // Advance index
        if (stepProgress === 100 && activeStepIdx < 3) {
          activeStepIdx++;
        }
      }
    }, 60);

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/backtest/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          strategyProfile,
          universe,
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
        clearInterval(interval);
        
        // Fast-forward all steps to completed instantly
        setSteps([
          { id: 1, label: 'Inisialisasi Portofolio', sublabel: 'Mengatur parameter modal & bobot strategi...', progress: 100, status: 'completed' },
          { id: 2, label: 'Koneksi Data Emiten', sublabel: 'Mengambil data historis pergerakan harga saham...', progress: 100, status: 'completed' },
          { id: 3, label: 'Sinkronisasi Benchmark', sublabel: 'Menyelaraskan data IHSG (^JKSE) & Emas (GC=F)...', progress: 100, status: 'completed' },
          { id: 4, label: 'Kalkulasi & Rebalancing', sublabel: 'Menghitung sinyal transaksi & metrik Sharpe...', progress: 100, status: 'completed' }
        ]);
        setProgress(100);
        setLoadingText('Simulasi selesai! Menyiapkan grafik...');
        setTimeout(() => {
          setResult(data);
          setLoading(false);
        }, 500);
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Error running backtest:', err);
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
        <div className="card card-elevated p-4 lg:col-span-3 h-fit bg-[#0b0a10]/45">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-3.5">Konsol Konfigurasi</h3>
          
          <form onSubmit={runBacktest} className="space-y-3.5 text-xs font-sans font-medium">
            {/* Profil Strategi Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Profil Strategi Backtest</label>
              <select
                id="backtest-strategy-profile-select"
                value={strategyProfile}
                onChange={(e) => setStrategyProfile(e.target.value)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
              >
                <option value="auto" className="bg-[#12111f]">Auto (Ikut Regime IHSG)</option>
                <option value="aggressive_momentum" className="bg-[#12111f]">Aggressive Momentum (Otoriter)</option>
                <option value="defensive_value" className="bg-[#12111f]">Defensive Value (Konservatif)</option>
                <option value="custom" className="bg-[#12111f]">Custom (Template Manual)</option>
              </select>
            </div>

            {/* Template Dropdown */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Template Kuantitatif</label>
                {strategyProfile !== 'custom' && (
                  <span className="text-[8px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    DIKUNCI
                  </span>
                )}
              </div>
              <select
                id="backtest-template-select"
                value={template}
                disabled={strategyProfile !== 'custom'}
                onChange={(e) => setTemplate(e.target.value)}
                className={`w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold ${
                  strategyProfile !== 'custom' ? 'opacity-40 cursor-not-allowed bg-black/40' : ''
                }`}
              >
                {strategies.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#12111f]">{s.name}</option>
                ))}
              </select>
            </div>

            {/* Universe Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Filter Universe</label>
              <select
                id="backtest-universe-select"
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
              >
                {universes.map(u => (
                  <option key={u.id} value={u.name} className="bg-[#12111f]">{u.name}</option>
                ))}
              </select>
            </div>

            {/* Capital Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Alokasi Modal Awal (Rp)</label>
              <input
                id="backtest-capital-input"
                type="number"
                value={capital}
                onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-extrabold"
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
            
            {mode === 'Dynamic' && (
              <div className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 p-3 rounded-xl mb-1">
                <strong>Multi-Tier Rotation Aktif:</strong> Merotasi otomatis ke Saham, Emas, IDR/USD.
              </div>
            )}

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
        <div className="lg:col-span-9 space-y-6">
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
            <div className="card card-elevated p-8 sm:p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px] bg-[#0b0a10]/45 justify-items-center relative overflow-hidden">
              {/* Premium Glow Accents */}
              <div className="absolute w-80 h-80 rounded-full bg-[#ccff00]/5 blur-[100px] pointer-events-none -top-20 -left-20" />
              <div className="absolute w-80 h-80 rounded-full bg-[#00f5a0]/5 blur-[100px] pointer-events-none -bottom-20 -right-20" />

              {/* Progress Circle SVG */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#111018"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#ccff00"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)}
                    className="transition-all duration-300 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">{progress}%</span>
                  <span className="text-[8px] text-[#686477] font-bold uppercase tracking-widest mt-0.5">Total Progress</span>
                </div>
              </div>

              <h4 className="text-xs font-black text-[#ccff00] font-sans uppercase tracking-widest min-h-[16px] transition-all px-4 leading-relaxed max-w-md">
                {loadingText}
              </h4>
              <p className="text-[10px] text-[#686477] mt-1 font-sans font-medium">
                Sistem menguji alokasi taktis portofolio secara dinamis berdasarkan data historis...
              </p>

              {/* Step by Step Progress Indicators */}
              <div className="w-full max-w-xl mt-8 space-y-3">
                {steps.map((s) => {
                  const isCompleted = s.status === 'completed';
                  const isRunning = s.status === 'running';
                  return (
                    <div 
                      key={s.id} 
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-[#00f5a0]/5 border-[#00f5a0]/20' 
                          : isRunning 
                            ? 'bg-[#ccff00]/5 border-[#ccff00]/20 shadow-[0_0_15px_rgba(204,255,0,0.03)]' 
                            : 'bg-[#111018]/30 border-[#1b1926]/20 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/25' 
                            : isRunning 
                              ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25 animate-pulse' 
                              : 'bg-white/5 text-[#4b5563] border border-white/5'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : s.id === 1 ? (
                            <ShieldCheck className="w-4 h-4 text-[#686477]" />
                          ) : s.id === 2 ? (
                            <Database className="w-4 h-4 text-[#686477]" />
                          ) : s.id === 3 ? (
                            <Sparkles className="w-4 h-4 text-[#686477]" />
                          ) : (
                            <BarChart2 className="w-4 h-4 text-[#686477]" />
                          )}
                        </div>
                        <div>
                          <h5 className={`text-xs font-extrabold font-sans transition-all ${
                            isCompleted ? 'text-[#00f5a0]' : isRunning ? 'text-[#ccff00]' : 'text-white/60'
                          }`}>
                            {s.label}
                          </h5>
                          <p className="text-[9px] text-[#686477] mt-0.5 font-sans font-medium line-clamp-1">
                            {s.sublabel}
                          </p>
                        </div>
                      </div>
                      
                      {/* Individual step progress meter */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full transition-all duration-300 ${isCompleted ? 'bg-[#00f5a0]' : 'bg-[#ccff00]'}`}
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono font-bold w-12 text-right ${
                          isCompleted ? 'text-[#00f5a0]' : isRunning ? 'text-[#ccff00]' : 'text-[#4b5563]'
                        }`}>
                          {isCompleted ? '100%' : isRunning ? `${s.progress}%` : 'Menunggu'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            result && (
              <div className="space-y-6 animate-fadeIn">
                {/* Tabs */}
                <div className="flex border-b border-[#1b1926]">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-4 text-xs font-bold font-sans uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'overview' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'}`}>
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('logs')}
                    className={`pb-3 px-4 text-xs font-bold font-sans uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'logs' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'}`}>
                    Trade Logs
                  </button>
                </div>

                {activeTab === 'overview' ? (
                  <>
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

                      <div className="w-full font-mono text-[10px]">
                        <BacktestEquityChart data={result.equityCurve} height={380} />
                      </div>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* Total Return */}
                      <div className="card card-elevated p-4 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/45">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Total Return</span>
                        <h3 className="text-base font-extrabold font-mono text-[#00f5a0]">{result.metrics.totalReturn}%</h3>
                      </div>
                      {/* CAGR */}
                      <div className="card card-elevated p-4 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/45">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">CAGR</span>
                        <h3 className="text-base font-extrabold font-mono text-[#00f5a0]">{result.metrics.cagr}%</h3>
                      </div>
                      {/* Dividen */}
                      <div className="card card-elevated p-4 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/45">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Total Dividen</span>
                        <h3 className="text-base font-extrabold font-mono text-[#ccff00]">{result.metrics.totalDividend ? `Rp ${(result.metrics.totalDividend / 1000000).toFixed(2)}M` : '-'}</h3>
                      </div>
                      {/* Max Drawdown */}
                      <div className="card card-elevated p-4 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/45">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Max Drawdown</span>
                        <h3 className="text-base font-extrabold font-mono text-[#ff3366]">{result.metrics.maxDrawdown}%</h3>
                      </div>
                      {/* Sharpe */}
                      <div className="card card-elevated p-4 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/45">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Sharpe Ratio</span>
                        <h3 className="text-base font-extrabold font-mono text-[#00f0ff]">{result.metrics.sharpeRatio}</h3>
                      </div>
                      {/* Volatility */}
                      <div className="card card-elevated p-4 flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 bg-[#0b0a10]/45">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Volatilitas</span>
                        <h3 className="text-base font-extrabold font-mono text-white">{result.metrics.volatility}%</h3>
                      </div>
                    </div>
                  </>
                ) : (
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
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  t.action === 'Beli' ? 'bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/20' : 
                                  t.action === 'Dividen' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20' : 
                                  'bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/20'
                                }`}>
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
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
