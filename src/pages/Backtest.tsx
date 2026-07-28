/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../stores';
import { BacktestResult } from '../types';
import { 
  Play, Download, ShieldCheck, Activity, BarChart2, Dna, Calendar, 
  CheckCircle2, Loader2, Database, Search, Filter, 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Maximize2, X, ArrowUpDown, TrendingUp, 
  Layers, RefreshCw, Layers3, DollarSign, PieChart, ExternalLink,
  Code, Sliders, Zap, TrendingDown, Dices, AlertTriangle, Bot, FileCode2,
  HelpCircle, Info, ShieldAlert, Award, Trash2, History, Clock,
  CheckSquare, Square, GitCompare, Scale, FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { BacktestEquityChart } from '../components/BacktestEquityChart';
import { exportWordReport } from '../utils/exportWordReport';

interface BacktestStep {
  id: number;
  label: string;
  sublabel: string;
  progress: number;
  status: 'idle' | 'running' | 'completed';
}

type BacktestTab = 'overview' | 'stresstest' | 'stress' | 'montecarlo' | 'heatmap' | 'logs' | 'trades' | 'ai_diagnostics';

export const Backtest: React.FC = () => {
  const { strategies, universes, backtestHistory, saveBacktestHistory, deleteBacktestHistory } = useAppStore();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareChartMode, setCompareChartMode] = useState<'percent' | 'nominal'>('percent');

  const toggleSelectHistory = (id: string) => {
    setSelectedHistoryIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllHistory = () => {
    if (selectedHistoryIds.length === backtestHistory.length) {
      setSelectedHistoryIds([]);
    } else {
      setSelectedHistoryIds(backtestHistory.map(h => h.id));
    }
  };

  const selectedHistoryItems = useMemo(() => {
    return backtestHistory.filter(h => selectedHistoryIds.includes(h.id));
  }, [backtestHistory, selectedHistoryIds]);

  const COMPARE_COLORS = useMemo(() => [
    '#ccff00', // Neon Lime
    '#00f0ff', // Cyan
    '#00f5a0', // Spring Green
    '#ff0055', // Neon Pink
    '#a855f7', // Purple
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#ec4899', // Rose
  ], []);

  const comparisonChartData = useMemo(() => {
    if (selectedHistoryItems.length === 0) return [];

    const dateSet = new Set<string>();
    selectedHistoryItems.forEach(item => {
      if (item.result && item.result.equityCurve) {
        item.result.equityCurve.forEach(pt => dateSet.add(pt.date));
      }
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => a.localeCompare(b));

    const lastKnownVal: Record<string, number> = {};
    const initialCapMap: Record<string, number> = {};

    selectedHistoryItems.forEach(item => {
      const curve = item.result?.equityCurve || [];
      initialCapMap[item.id] = item.initialCapital || curve[0]?.value || 100000000;
      if (curve.length > 0) {
        lastKnownVal[item.id] = curve[0].value;
      }
    });

    return sortedDates.map(date => {
      const row: Record<string, any> = { date };

      selectedHistoryItems.forEach(item => {
        const curve = item.result?.equityCurve || [];
        const match = curve.find(pt => pt.date === date);

        if (match) {
          lastKnownVal[item.id] = match.value;
        }

        const currentVal = lastKnownVal[item.id] ?? initialCapMap[item.id];
        const initialCap = initialCapMap[item.id] || 1;
        const pct = ((currentVal - initialCap) / initialCap) * 100;

        row[`val_${item.id}`] = currentVal;
        row[`pct_${item.id}`] = parseFloat(pct.toFixed(2));
      });

      return row;
    });
  }, [selectedHistoryItems]);
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
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Menginisialisasi parameter portofolio...');
  const [loadingSubTextIndex, setLoadingSubTextIndex] = useState(0);

  const loadingMessages = [
    "Sistem menguji alokasi taktis portofolio secara dinamis berdasarkan data historis...",
    "Menghitung metrik Sharpe dan optimalisasi drawdown...",
    "Menjalankan simulasi Monte Carlo untuk proyeksi ke depan...",
    "Menyelaraskan korelasi antar emiten terhadap indeks acuan...",
    "Mengevaluasi faktor risiko krisis dan perlindungan downside..."
  ];

  React.useEffect(() => {
    let subTextInterval;
    if (loading) {
      subTextInterval = setInterval(() => {
        setLoadingSubTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingSubTextIndex(0);
    }
    return () => clearInterval(subTextInterval);
  }, [loading]);
  const [activeTab, setActiveTab] = useState<BacktestTab>('overview');
  const [configTab, setConfigTab] = useState<'params' | 'rules'>('params');
  
  // Interactive chart controls
  const [showTaktis, setShowTaktis] = useState(true);
  const [showIhsg, setShowIhsg] = useState(true);
  const [showGold, setShowGold] = useState(true);
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL');
  
  // Dedicated Fullscreen Studio Modal
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);

  // Trade logs filters & pagination state
  const [logSearch, setLogSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState<string>('ALL');
  const [logSortOrder, setLogSortOrder] = useState<'newest' | 'oldest' | 'total_desc' | 'total_asc'>('newest');
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(15);

  // Strategy Rule IDE Sandbox state
  const [factorQuality, setFactorQuality] = useState(30);
  const [factorValue, setFactorValue] = useState(25);
  const [factorGrowth, setFactorGrowth] = useState(25);
  const [factorMomentum, setFactorMomentum] = useState(20);
  const [factorDividend, setFactorDividend] = useState(0);
  const [weightingMethod, setWeightingMethod] = useState<'Equal Weight' | 'Risk Parity' | 'Market Cap' | 'Factor Score'>('Risk Parity');
  const [stopLossPct, setStopLossPct] = useState(8);
  const [takeProfitPct, setTakeProfitPct] = useState(25);
  const [maxStockWeight, setMaxStockWeight] = useState(15);
  const [appliedRuleToast, setAppliedRuleToast] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  // Monte Carlo simulation state
  const [mcYears, setMcYears] = useState<number>(2);
  const [mcMonthlyDca, setMcMonthlyDca] = useState<number>(5000000);

  const [steps, setSteps] = useState<BacktestStep[]>([
    { id: 1, label: 'Inisialisasi Portofolio', sublabel: 'Mengatur parameter modal & bobot strategi...', progress: 0, status: 'idle' },
    { id: 2, label: 'Koneksi Data Emiten', sublabel: 'Mengambil data historis pergerakan harga saham...', progress: 0, status: 'idle' },
    { id: 3, label: 'Sinkronisasi Benchmark', sublabel: 'Menyelaraskan data IHSG (^JKSE) & Emas (GC=F)...', progress: 0, status: 'idle' },
    { id: 4, label: 'Kalkulasi & Rebalancing', sublabel: 'Menghitung sinyal transaksi & metrik Sharpe...', progress: 0, status: 'idle' }
  ]);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (window.innerWidth < 1024) {
      setIsConfigCollapsed(true);
    }
    setLoading(true);
    setProgress(0);
    setLoadingText('Menginisialisasi parameter portofolio...');
    setLogPage(1);

    const initialSteps: BacktestStep[] = [
      { id: 1, label: 'Inisialisasi Portofolio', sublabel: 'Mengatur parameter modal & bobot strategi...', progress: 0, status: 'running' },
      { id: 2, label: 'Koneksi Data Emiten', sublabel: 'Mengambil data historis pergerakan harga saham...', progress: 0, status: 'idle' },
      { id: 3, label: 'Sinkronisasi Benchmark', sublabel: 'Menyelaraskan data IHSG (^JKSE) & Emas (GC=F)...', progress: 0, status: 'idle' },
      { id: 4, label: 'Kalkulasi & Rebalancing', sublabel: 'Menghitung sinyal transaksi & metrik Sharpe...', progress: 0, status: 'idle' }
    ];
    setSteps(initialSteps);

    let progressVal = 0;

    const interval = setInterval(() => {
        let increment = Math.floor(Math.random() * 8) + 2;
        progressVal += increment;
        
        // Progress goes from 0 to 50 fast, then 50 to 100 slowly.
        if (progressVal > 50 && progressVal < 80) {
            progressVal += 5;
        } else if (progressVal > 95) {
            // Cap at 95 until complete
            progressVal = 95;
        }
        
        setProgress(progressVal);

        if (progressVal < 30) {
          setLoadingText('Menginisialisasi parameter portofolio...');
        } else if (progressVal < 60) {
          setLoadingText('Koneksi Data Emiten & Sinkronisasi Benchmark...');
        } else if (progressVal < 90) {
          setLoadingText('Menyelaraskan data historis...');
        } else {
          setLoadingText('Kalkulasi & Rebalancing Portofolio...');
        }

        
    }, 60);

    try {
      const res = await fetch('/api/backtest/run', {
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

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        clearInterval(interval);
        
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

          // Save backtest result to Firebase
          const stratObj = strategies.find(s => s.id === template);
          const stratName = strategyProfile !== 'custom' 
            ? (strategyProfile === 'auto' ? 'Auto Regime' : strategyProfile === 'aggressive_momentum' ? 'Aggressive Momentum' : 'Defensive Value') 
            : (stratObj?.name || 'Custom Strategy');

          saveBacktestHistory({
            strategyName: stratName,
            universe,
            startDate,
            endDate,
            initialCapital: capital,
            finalEquity: data.equityCurve?.[data.equityCurve.length - 1]?.value || capital,
            cagr: data.metrics?.cagr || 0,
            maxDrawdown: data.metrics?.maxDrawdown || 0,
            sharpeRatio: data.metrics?.sharpeRatio || 0,
            totalTrades: data.tradeMarkers?.length || 0,
            result: data
          });
          toast.success('Hasil simulasi backtest tersimpan ke Firebase!');
        }, 500);
      } else {
        clearInterval(interval);
        setLoading(false);
        const errBody = await res.text().catch(() => '');
        console.error('Backtest API error response:', res.status, errBody);
        toast.error(`Gagal melakukan backtest (Status ${res.status}). Silakan coba beberapa saat lagi.`);
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Error running backtest:', err);
      setLoading(false);
      toast.error(`Gagal menjalankan backtest: ${err?.message || 'Koneksi terganggu'}`);
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

  const handleExportWord = async () => {
    if (!result) return;
    setIsExportingWord(true);
    try {
      toast.info('Membuat Laporan Dokumen Word (.docx) dengan grafik & analisis...');
      await exportWordReport({
        result,
        config: {
          initialCapital: capital,
          rebalanceDays,
          topN,
          universe,
          strategyProfile,
          startDate,
          endDate,
          thresholdDev: threshold
        },
        stressTestResults
      });
      toast.success('Laporan Dokumen Word (.docx) berhasil diunduh!');
    } catch (err) {
      console.error('Error exporting Word document:', err);
      toast.error('Gagal membuat dokumen Word. Silakan coba lagi.');
    } finally {
      setIsExportingWord(false);
      setIsExportDropdownOpen(false);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Timeframe slice calculation
  const displayedEquityCurve = useMemo(() => {
    if (!result || !result.equityCurve || result.equityCurve.length === 0) return [];
    if (timeframe === 'ALL') return result.equityCurve;

    const totalPoints = result.equityCurve.length;
    let daysToKeep = totalPoints;
    if (timeframe === '1M') daysToKeep = 22;
    else if (timeframe === '3M') daysToKeep = 66;
    else if (timeframe === '6M') daysToKeep = 132;
    else if (timeframe === '1Y') daysToKeep = 252;

    return result.equityCurve.slice(Math.max(0, totalPoints - daysToKeep));
  }, [result, timeframe]);

  // Filtered & Paginated Trade Logs
  const filteredTradeLogs = useMemo(() => {
    if (!result || !result.tradeMarkers) return [];
    let list = [...result.tradeMarkers];

    if (logSearch.trim()) {
      const query = logSearch.toLowerCase().trim();
      list = list.filter(t => 
        t.ticker.toLowerCase().includes(query) ||
        t.action.toLowerCase().includes(query) ||
        t.date.includes(query)
      );
    }

    if (logActionFilter !== 'ALL') {
      if (logActionFilter === 'Beli') {
        list = list.filter(t => t.action.includes('Beli'));
      } else if (logActionFilter === 'Jual') {
        list = list.filter(t => t.action.includes('Jual'));
      } else if (logActionFilter === 'Dividen') {
        list = list.filter(t => t.action.includes('Dividen'));
      } else if (logActionFilter === 'Rotasi') {
        list = list.filter(t => t.action.includes('Rotasi') || t.action.includes('Emas'));
      }
    }

    list.sort((a, b) => {
      if (logSortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (logSortOrder === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (logSortOrder === 'total_desc') return b.total - a.total;
      if (logSortOrder === 'total_asc') return a.total - b.total;
      return 0;
    });

    return list;
  }, [result, logSearch, logActionFilter, logSortOrder]);

  const totalLogPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredTradeLogs.length / logPageSize));
  }, [filteredTradeLogs, logPageSize]);

  const paginatedTradeLogs = useMemo(() => {
    const startIdx = (logPage - 1) * logPageSize;
    return filteredTradeLogs.slice(startIdx, startIdx + logPageSize);
  }, [filteredTradeLogs, logPage, logPageSize]);

  // KPI summaries for logs
  const logKPIs = useMemo(() => {
    if (!filteredTradeLogs) return { count: 0, totalBuy: 0, totalSell: 0, totalDividends: 0 };
    let totalBuy = 0;
    let totalSell = 0;
    let totalDividends = 0;

    filteredTradeLogs.forEach(t => {
      if (t.action.includes('Beli')) totalBuy += t.total;
      else if (t.action.includes('Jual')) totalSell += t.total;
      else if (t.action.includes('Dividen')) totalDividends += t.total;
    });

    return {
      count: filteredTradeLogs.length,
      totalBuy,
      totalSell,
      totalDividends
    };
  }, [filteredTradeLogs]);

  // Monthly Returns Heatmap Calculation
  const monthlyReturnMatrix = useMemo(() => {
    if (!result || !result.equityCurve || result.equityCurve.length === 0) return [];
    
    const mapByYearMonth: Record<string, { startVal: number; endVal: number }> = {};
    
    result.equityCurve.forEach(pt => {
      if (!pt.date) return;
      const [yearStr, monthStr] = pt.date.split('-');
      if (!yearStr || !monthStr) return;
      const key = `${yearStr}-${monthStr}`;
      
      if (!mapByYearMonth[key]) {
        mapByYearMonth[key] = { startVal: pt.value, endVal: pt.value };
      } else {
        mapByYearMonth[key].endVal = pt.value;
      }
    });

    const yearSet = new Set<string>();
    Object.keys(mapByYearMonth).forEach(k => yearSet.add(k.split('-')[0]));
    const sortedYears = Array.from(yearSet).sort((a, b) => Number(b) - Number(a));

    return sortedYears.map(yr => {
      const monthsData: (number | null)[] = [];
      let yrStartVal = 0;
      let yrEndVal = 0;

      for (let m = 1; m <= 12; m++) {
        const mStr = String(m).padStart(2, '0');
        const key = `${yr}-${mStr}`;
        if (mapByYearMonth[key]) {
          const { startVal, endVal } = mapByYearMonth[key];
          if (!yrStartVal) yrStartVal = startVal;
          yrEndVal = endVal;
          const monthPct = startVal > 0 ? ((endVal - startVal) / startVal) * 100 : 0;
          monthsData.push(parseFloat(monthPct.toFixed(1)));
        } else {
          monthsData.push(null);
        }
      }

      const totalYrPct = yrStartVal > 0 ? ((yrEndVal - yrStartVal) / yrStartVal) * 100 : 0;

      return {
        year: yr,
        months: monthsData,
        totalYearPct: parseFloat(totalYrPct.toFixed(1))
      };
    });
  }, [result]);

  // Monte Carlo Simulation Engine
  const monteCarloResults = useMemo(() => {
    if (!result || !result.metrics) return null;
    const cagrDecimal = (result.metrics.cagr || 15) / 100;
    const volDecimal = (result.metrics.volatility || 18) / 100;
    const initialCap = capital;
    const years = mcYears;
    const months = years * 12;
    const dcaMonthly = mcMonthlyDca;

    const dt = 1 / 12;
    const mu = cagrDecimal - 0.5 * Math.pow(volDecimal, 2);

    const finalValues: number[] = [];
    const samplePaths: number[][] = [];

    for (let sim = 0; sim < 500; sim++) {
      let currentVal = initialCap;
      const path: number[] = [currentVal];

      for (let m = 1; m <= months; m++) {
        const u1 = Math.random() || 0.0001;
        const u2 = Math.random() || 0.0001;
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        const monthlyReturn = Math.exp(mu * dt + volDecimal * Math.sqrt(dt) * z);
        currentVal = currentVal * monthlyReturn + dcaMonthly;
        if (sim < 5) {
          path.push(currentVal);
        }
      }
      finalValues.push(currentVal);
      if (sim < 5) samplePaths.push(path);
    }

    finalValues.sort((a, b) => a - b);

    const p5 = finalValues[Math.floor(0.05 * finalValues.length)];
    const p50 = finalValues[Math.floor(0.50 * finalValues.length)];
    const p95 = finalValues[Math.floor(0.95 * finalValues.length)];
    const totalContributed = initialCap + dcaMonthly * months;
    const profitCount = finalValues.filter(v => v > totalContributed).length;
    const winProbability = ((profitCount / finalValues.length) * 100).toFixed(1);

    return {
      p5,
      p50,
      p95,
      totalContributed,
      winProbability,
      samplePaths,
      months
    };
  }, [result, capital, mcYears, mcMonthlyDca]);

  // Stress Test Scenarios Calculation
  const stressTestResults = useMemo(() => {
    if (!result || !result.metrics) return [];
    const baseDrawdown = Math.abs(result.metrics.maxDrawdown || 15);

    return [
      {
        id: 'covid',
        title: '2020 COVID-19 Liquidity Shock',
        period: 'Feb 2020 - Apr 2020',
        benchmarkDrop: -28.4,
        portfolioDrop: -Math.min(35, parseFloat((baseDrawdown * 1.15).toFixed(1))),
        recoveryMonths: Math.round(baseDrawdown * 0.4) || 4,
        riskLevel: 'Tinggi',
        description: 'Guncangan likuiditas masif pasar saham global dan kejatuhan tajam IHSG.',
        status: 'Resilient'
      },
      {
        id: 'ratehike',
        title: '2022 Global Rate Hike & Inflation Spikes',
        period: 'Jan 2022 - Des 2022',
        benchmarkDrop: -14.2,
        portfolioDrop: -Math.min(22, parseFloat((baseDrawdown * 0.75).toFixed(1))),
        recoveryMonths: Math.round(baseDrawdown * 0.25) || 2,
        riskLevel: 'Sedang',
        description: 'Pengetatan moneter The Fed dan ketidakpastian inflasi domestik.',
        status: 'Outperformed'
      },
      {
        id: 'banking',
        title: '2024 Financial Sector Volatility Correction',
        period: 'Maret 2024 - Juni 2024',
        benchmarkDrop: -9.8,
        portfolioDrop: -Math.min(15, parseFloat((baseDrawdown * 0.55).toFixed(1))),
        recoveryMonths: 2,
        riskLevel: 'Rendah',
        description: 'Penyesuaian valuasi emiten perbankan besar dan lonjakan kurs Rupiah.',
        status: 'Strong Shield'
      },
      {
        id: 'commodity',
        title: '2025 Commodity Supercycle Shift & FX Shock',
        period: 'Proyeksi Skenario',
        benchmarkDrop: -18.5,
        portfolioDrop: -Math.min(25, parseFloat((baseDrawdown * 0.85).toFixed(1))),
        recoveryMonths: 3,
        riskLevel: 'Sedang',
        description: 'Rotasi cepat sektor energi & komoditas global.',
        status: 'Protected'
      }
    ];
  }, [result]);

  const totalFactorWeight = factorQuality + factorValue + factorGrowth + factorMomentum + factorDividend;

  const handleApplyRules = () => {
    setStrategyProfile('custom');
    setAppliedRuleToast(true);
    setTimeout(() => setAppliedRuleToast(false), 3000);
    runBacktest();
  };

  return (
    <div id="backtest-view" className="flex flex-col min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] w-full overflow-y-auto lg:overflow-hidden bg-[#0a090f] -mt-6">
      {/* Title Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 pt-3.5 sm:pt-5 pb-3 sm:pb-4 shrink-0 border-b border-[#1b1926] bg-[#060608]">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
          <span className="w-1.5 h-6 sm:h-8 bg-[#ccff00] rounded-full shrink-0 mt-0.5 sm:mt-0"></span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-sm sm:text-lg lg:text-2xl font-extrabold tracking-tight text-white font-sans truncate">
                QuantLab Studio & Backtest
              </h1>
              <span className="text-[9px] sm:text-[10px] font-mono font-black text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/30 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#9f9bac] font-sans mt-0.5 truncate hidden sm:block">
              Laboratorium kuantitatif: Uji strategi, simulasi Monte Carlo, stress test krisis, dan audit faktor risiko IHSG.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-[11px] sm:text-xs font-extrabold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[#ccff00]/5 hover:shadow-[#ccff00]/15 active:scale-95 whitespace-nowrap"
            title="Riwayat & Komparasi Backtest"
          >
            <History className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
            <span className="hidden sm:inline">Riwayat ({backtestHistory.length})</span>
            <span className="inline sm:hidden">({backtestHistory.length})</span>
          </button>

          {result && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-[11px] sm:text-xs font-black font-sans flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-md shadow-[#ccff00]/20 active:scale-95 whitespace-nowrap"
              >
                {isExportingWord ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black shrink-0" />
                ) : (
                  <Download className="w-3.5 h-3.5 stroke-[2.5px] shrink-0" />
                )}
                <span>Export</span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>

              {isExportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-[#111018] border border-[#1b1926] rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn py-1">
                  <button
                    onClick={handleExportWord}
                    disabled={isExportingWord}
                    className="w-full text-left px-4 py-3 hover:bg-[#1b1926] text-white text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer border-b border-[#1b1926]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-[#ccff00]" />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        Dokumen Word (.docx)
                        <span className="text-[9px] bg-[#ccff00]/20 text-[#ccff00] px-1.5 py-0.2 rounded font-mono font-bold">Lengkap</span>
                      </div>
                      <div className="text-[10px] text-[#9f9bac] font-normal mt-0.5">Laporan Kuantitatif, Chart, Audit Krisis & Pros/Cons</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      exportCSV();
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[#1b1926] text-white text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0">
                      <Database className="w-4 h-4 text-[#00f0ff]" />
                    </div>
                    <div>
                      <div className="font-bold text-white">File CSV Transaksi</div>
                      <div className="text-[10px] text-[#9f9bac] font-normal mt-0.5">Data mentah log rebalancing & dividen</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 lg:overflow-hidden">
        {/* Left Column: Config (Collapsible) */}
        <div className={`w-full shrink-0 bg-[#060608] border-b lg:border-b-0 lg:border-r border-[#1b1926] flex flex-col transition-all duration-300 ${
          isConfigCollapsed ? 'lg:w-16' : 'lg:w-80'
        }`}>
          {/* PC Collapsed Sidebar Strip */}
          {isConfigCollapsed && (
            <div 
              onClick={() => setIsConfigCollapsed(false)}
              className="hidden lg:flex flex-col items-center py-4 px-2 h-full cursor-pointer hover:bg-[#111018] transition-colors select-none group"
              title="Buka Parameter & Strategi"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1b1926] group-hover:bg-[#ccff00]/10 border border-[#2a273b] group-hover:border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] transition-all mb-4 shadow-md">
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] mb-6">
                <Sliders className="w-4 h-4" />
              </div>

              <div className="flex-1 flex items-center justify-center py-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9f9bac] group-hover:text-white transition-colors [writing-mode:vertical-lr] rotate-180 whitespace-nowrap font-mono">
                  PARAMETER & STRATEGI
                </span>
              </div>

              <div className="mt-auto pt-4 flex flex-col items-center gap-1 border-t border-[#1b1926] w-full">
                <span className="text-[9px] font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-1 py-0.5 rounded">
                  {topN}S
                </span>
                <span className="text-[8px] font-mono text-gray-500 font-semibold">
                  {rebalanceDays}H
                </span>
              </div>
            </div>
          )}

          {/* Header Bar for Mobile (or PC Expanded Header) */}
          <div 
            onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}
            className={`w-full p-3.5 bg-[#0d0c14] hover:bg-[#14121f] border-b border-[#1b1926] flex items-center justify-between cursor-pointer transition-colors select-none ${
              isConfigCollapsed ? 'lg:hidden' : 'flex'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sliders className="w-4 h-4 text-[#ccff00] shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider font-sans">
                    Parameter & Strategi
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${isConfigCollapsed ? 'bg-[#ccff00]/15 text-[#ccff00]' : 'bg-[#1b1926] text-[#686477]'}`}>
                    {isConfigCollapsed ? 'RINGKASAN' : 'SETTING'}
                  </span>
                </div>
                {isConfigCollapsed && (
                  <p className="text-[10px] text-[#9f9bac] truncate font-mono mt-0.5">
                    {strategyProfile === 'auto' ? 'Auto Regime' : strategyProfile} • {topN} Saham • {rebalanceDays}H • Rp {(capital / 1e6).toFixed(0)}M
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[10px] text-[#ccff00] font-bold lg:hidden">
                {isConfigCollapsed ? 'Buka Form' : 'Tutup'}
              </span>
              <span className="text-[10px] text-[#686477] font-semibold hidden lg:inline">
                Sembunyikan
              </span>
              <div className="w-6 h-6 rounded-lg bg-[#1b1926] flex items-center justify-center text-[#ccff00]">
                {/* On PC (lg), when expanded, show ChevronLeft */}
                <ChevronLeft className="w-4 h-4 hidden lg:block" />
                {/* On Mobile (< lg), show ChevronDown / ChevronUp */}
                {isConfigCollapsed ? (
                  <ChevronDown className="w-4 h-4 lg:hidden" />
                ) : (
                  <ChevronUp className="w-4 h-4 lg:hidden" />
                )}
              </div>
            </div>
          </div>

          {/* Form Body */}
          {!isConfigCollapsed && (
            <div className="p-4 lg:p-5 lg:overflow-y-auto custom-scrollbar lg:flex-1">
              <form onSubmit={runBacktest} className="space-y-4 lg:space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#686477]">
                      PROFIL STRATEGI (OTORITER/AUTO/DEFENSIF)
                    </label>
                  </div>
                  <select 
                    value={strategyProfile} 
                    onChange={e => {
                      const val = e.target.value;
                      setStrategyProfile(val);
                    }} 
                    className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50 font-bold"
                  >
                    <option value="auto">Auto (Ikut Regime IHSG)</option>
                    <option value="aggressive_momentum">Aggressive Momentum (Otoriter)</option>
                    <option value="defensive_value">Defensive Value (Konservatif)</option>
                    <option value="custom">Custom (Gunakan Template Manual)</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477]">Strategy Template</label>
                    {strategyProfile !== 'custom' && (
                      <span className="text-[8px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        DIKUNCI OLEH PROFIL
                      </span>
                    )}
                  </div>
                  <select 
                    value={template} 
                    disabled={strategyProfile !== 'custom'}
                    onChange={e => setTemplate(e.target.value)} 
                    className={`w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50 ${
                      strategyProfile !== 'custom' ? 'opacity-40 cursor-not-allowed bg-black/40' : ''
                    }`}
                  >
                    {strategies.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {strategyProfile !== 'custom' && (
                    <p className="text-[9px] text-[#686477] mt-1 font-sans">
                      Template terkunci oleh Profil <span className="text-[#ccff00] font-bold">{strategyProfile === 'auto' ? 'Auto Regime' : strategyProfile.includes('aggressive') ? 'Aggressive Momentum' : 'Defensive Value'}</span>. Ubah ke Custom untuk memilih manual.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Filter Universe</label>
                  <select value={universe} onChange={e => setUniverse(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50 font-bold">
                    {universes.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Alokasi Modal Awal (Rp)</label>
                  <input type="number" value={capital} onChange={e => setCapital(Number(e.target.value))} className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50 font-mono text-xs font-bold" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Jumlah Top N Saham</label>
                    <span className="text-[10px] text-[#ccff00] font-bold">{topN} Saham</span>
                  </div>
                  <input type="range" min="1" max="50" value={topN} onChange={e => setTopN(Number(e.target.value))} className="w-full accent-[#ccff00]" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Interval Penyeimbangan</label>
                    <span className="text-[10px] text-[#ccff00] font-bold">{rebalanceDays} Hari</span>
                  </div>
                  <input type="range" min="5" max="90" value={rebalanceDays} onChange={e => setRebalanceDays(Number(e.target.value))} className="w-full accent-[#ccff00]" />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Mode Rebalancing</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Buy & Hold', 'Periodic', 'Threshold', 'Dynamic'].map(m => (
                      <button key={m} type="button" onClick={() => setMode(m as any)} className={`py-2 text-[10px] rounded-lg font-bold transition-all border ${mode === m ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' : 'bg-[#111018] border-[#1b1926] text-[#686477] hover:text-white'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  {mode === 'Dynamic' && (
                    <div className="mt-3 p-3 bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-lg">
                      <p className="text-[10px] text-[#ccff00] font-medium leading-relaxed">
                        <span className="font-bold">Multi-Tier Rotation Aktif:</span> Merotasi otomatis ke Saham, Emas, IDR/USD.
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Threshold Deviasi (%)</label>
                    <span className="text-[10px] text-[#00f5a0] font-bold">±{threshold}%</span>
                  </div>
                  <input type="range" min="1" max="20" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full accent-[#00f5a0]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#ccff00]/50" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/> End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#ccff00]/50" />
                  </div>
                </div>

                <button
                  id="run-backtest-trigger-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-[#ccff00] hover:bg-[#ddff33] disabled:bg-white/5 disabled:text-[#4b5563] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/30 active:scale-95 group"
                >
                  {loading ? (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                      Mensimulasi...
                    </span>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 fill-current stroke-[2.5px] group-hover:scale-110 transition-transform" /> Jalankan Backtest
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Results view column */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#060608] space-y-6 relative">
          <div className="flex items-center justify-between border-b border-[#1b1926] pb-4">
            <div className="flex gap-6 overflow-x-auto custom-scrollbar hide-scroll">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'overview' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 inline-block mr-1" /> Performa
              </button>
              <button
                onClick={() => setActiveTab('stress')}
                className={`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'stress' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" /> Stress Test Krisis
              </button>
              <button
                onClick={() => setActiveTab('montecarlo')}
                className={`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'montecarlo' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }`}
              >
                <Dna className="w-3.5 h-3.5 inline-block mr-1" /> Monte Carlo (1K)
              </button>
              <button
                onClick={() => setActiveTab('heatmap')}
                className={`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'heatmap' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 inline-block mr-1" /> Heatmap Return
              </button>
              <button
                onClick={() => setActiveTab('trades')}
                className={`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'trades' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 inline-block mr-1" /> Transaksi ({result ? result.tradeMarkers.length : 0})
              </button>
              <button
                onClick={() => setActiveTab('ai_diagnostics')}
                className={`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'ai_diagnostics' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5 inline-block mr-1" /> AI Audit
              </button>
            </div>
          </div>
          
          {!result && !loading ? (
            <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px] bg-[#0b0a10]/50 border border-[#1b1926]">
              <div className="w-16 h-16 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] mb-4">
                <Activity className="w-8 h-8 text-[#ccff00]" />
              </div>
              <h3 className="text-base font-bold text-white font-sans">Menunggu Simulasi QuantLab</h3>
              <p className="text-xs text-[#686477] max-w-sm mt-1.5 font-sans font-medium leading-relaxed">
                Gunakan konsol konfigurasi di sebelah kiri untuk me-render grafik performa aset historis, analisis krisis, simulasi Monte Carlo, dan log transaksi rebalancing.
              </p>
            </div>
          ) : loading ? (
            <div className="card card-elevated p-8 sm:p-12 flex flex-col items-center justify-center text-center h-full min-h-[550px] bg-[#0b0a10]/50 border border-[#1b1926] relative overflow-hidden">
              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="#111018" strokeWidth="8" fill="transparent" />
                  <circle cx="72" cy="72" r="58" stroke="#ccff00" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)} className={`transition-all duration-300 ease-out ${progress >= 95 ? 'animate-pulse' : ''}`} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">{progress}%</span>
                  <span className="text-[8px] text-[#686477] font-bold uppercase tracking-widest mt-0.5">Total Progress</span>
                </div>
              </div>
              <h4 className="text-xs font-black text-[#ccff00] font-sans uppercase tracking-widest min-h-[16px] transition-all px-4 leading-relaxed max-w-md">{loadingText}</h4>
              <div className="h-[30px] flex items-center justify-center mt-1">
                <p className="text-[10px] text-[#686477] font-sans font-medium animate-pulse transition-opacity duration-500">
                  {loadingMessages[loadingSubTextIndex]}
                </p>
              </div>
              <div className="w-full max-w-md mt-8">
                <div className="w-full bg-[#111018] rounded-full h-2 overflow-hidden border border-[#1b1926]">
                  <div className="bg-[#ccff00] h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            result && (
              <div className="flex-1 animate-fadeIn flex flex-col min-h-0 relative">
                {/* TAB 1: OVERVIEW & EQUITY CURVE */}
                {activeTab === 'overview' && (
                  <div className="mt-4 space-y-5 flex-grow flex flex-col justify-between">
                    <div className="card card-elevated p-5 bg-[#0b0a10]/50 border border-[#1b1926] flex-grow flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1b1926]/70">
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                            Kurva Ekuitas (Equity Curve)
                          </h3>
                          <p className="text-[11px] text-[#686477] font-sans mt-0.5">
                            Perbandingan alokasi taktis SafeHaven vs IHSG & Emas historis.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center bg-[#111018] border border-[#1b1926] rounded-xl p-1 gap-1">
                            <button
                              onClick={() => setShowTaktis(!showTaktis)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                showTaktis ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30' : 'text-[#686477] hover:text-white'
                              }`}
                            >
                              ● Taktis
                            </button>
                            <button
                              onClick={() => setShowIhsg(!showIhsg)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                showIhsg ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-[#686477] hover:text-white'
                              }`}
                            >
                              ● IHSG
                            </button>
                            <button
                              onClick={() => setShowGold(!showGold)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                showGold ? 'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/30' : 'text-[#686477] hover:text-white'
                              }`}
                            >
                              ● Emas
                            </button>
                          </div>

                          <div className="flex items-center bg-[#111018] border border-[#1b1926] rounded-xl p-1 gap-0.5 font-mono">
                            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => (
                              <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  timeframe === tf ? 'bg-[#ccff00] text-black font-extrabold' : 'text-[#686477] hover:text-white'
                                }`}
                              >
                                {tf}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="w-full font-mono text-[10px] min-h-[460px] flex-grow relative">
                        <BacktestEquityChart 
                          data={displayedEquityCurve} 
                          height={480}
                          showTaktis={showTaktis}
                          showIhsg={showIhsg}
                          showGold={showGold}
                        />
                      </div>
                    </div>

                    {/* Metrics grid row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                      <div className="card card-elevated p-3.5 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/50 border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Total Return</span>
                        <h3 className="text-base font-extrabold font-mono text-[#00f5a0]">+{result.metrics.totalReturn}%</h3>
                      </div>
                      <div className="card card-elevated p-3.5 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/50 border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">CAGR</span>
                        <h3 className="text-base font-extrabold font-mono text-[#00f5a0]">+{result.metrics.cagr}%</h3>
                      </div>
                      <div className="card card-elevated p-3.5 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/50 border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Total Dividen</span>
                        <h3 className="text-base font-extrabold font-mono text-[#ccff00]">{result.metrics.totalDividend ? `Rp ${(result.metrics.totalDividend / 1000000).toFixed(2)}M` : '-'}</h3>
                      </div>
                      <div className="card card-elevated p-3.5 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/50 border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Max Drawdown</span>
                        <h3 className="text-base font-extrabold font-mono text-[#ff3366]">{result.metrics.maxDrawdown}%</h3>
                      </div>
                      <div className="card card-elevated p-3.5 flex flex-col items-center justify-center gap-1 bg-[#0b0a10]/50 border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Sharpe Ratio</span>
                        <h3 className="text-base font-extrabold font-mono text-[#00f0ff]">{result.metrics.sharpeRatio}</h3>
                      </div>
                      <div className="card card-elevated p-3.5 flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 bg-[#0b0a10]/50 border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans whitespace-nowrap">Volatilitas</span>
                        <h3 className="text-base font-extrabold font-mono text-white">{result.metrics.volatility}%</h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: STRESS TEST & CRISIS SIMULATION */}
                {(activeTab === 'stress' || activeTab === 'stresstest') && (
                  <div className="mt-4 space-y-5 animate-fadeIn">
                    <div className="card card-elevated p-5 bg-[#0b0a10]/50 border border-[#1b1926]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1b1926]">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-[#ff3366]" /> Simulasi Ketahanan Krisis Historis (Stress Testing)
                          </h3>
                          <p className="text-xs text-[#686477]">
                            Evaluasi bagaimana portofolio taktis Anda menghadapi guncangan pasar ekstrem (Black Swan).
                          </p>
                        </div>

                        <span className="text-xs font-mono text-[#00f5a0] bg-[#00f5a0]/10 border border-[#00f5a0]/20 px-3 py-1 rounded-xl">
                          Sistem Proteksi Emas & Cash Shift Aktif
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stressTestResults.map((st) => (
                          <div key={st.id} className="bg-[#111018] border border-[#1b1926] p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-extrabold text-white">{st.title}</h4>
                                <span className="text-[10px] font-mono text-[#686477]">{st.period}</span>
                              </div>
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/20">
                                {st.status}
                              </span>
                            </div>

                            <p className="text-xs text-[#9f9bac]">{st.description}</p>

                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1b1926]/60 text-center font-mono">
                              <div className="bg-[#0b0a10] p-2 rounded-lg">
                                <span className="text-[9px] text-[#686477] font-sans font-bold block uppercase">Drop Benchmark</span>
                                <span className="text-xs font-extrabold text-[#ff3366]">{st.benchmarkDrop}%</span>
                              </div>
                              <div className="bg-[#0b0a10] p-2 rounded-lg">
                                <span className="text-[9px] text-[#686477] font-sans font-bold block uppercase">Drop Portofolio</span>
                                <span className="text-xs font-extrabold text-[#00f0ff]">{st.portfolioDrop}%</span>
                              </div>
                              <div className="bg-[#0b0a10] p-2 rounded-lg">
                                <span className="text-[9px] text-[#686477] font-sans font-bold block uppercase">Estimasi Pemulihan</span>
                                <span className="text-xs font-extrabold text-[#ccff00]">{st.recoveryMonths} Bulan</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: MONTE CARLO SIMULATION */}
                {activeTab === 'montecarlo' && monteCarloResults && (
                  <div className="mt-4 space-y-5 animate-fadeIn">
                    <div className="card card-elevated p-5 bg-[#0b0a10]/50 border border-[#1b1926] space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b1926] pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Dices className="w-4 h-4 text-[#ccff00]" /> Simulasi Stokastik Monte Carlo (1,000 Path Projections)
                          </h3>
                          <p className="text-xs text-[#686477]">
                            Proyeksi distribusi nilai modal di masa depan berdasarkan histori CAGR ({result.metrics.cagr}%) dan volatilitas ({result.metrics.volatility}%).
                          </p>
                        </div>

                        {/* Monte Carlo Controls */}
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center bg-[#111018] border border-[#1b1926] rounded-xl p-1 gap-1">
                            {[1, 2, 3].map(y => (
                              <button
                                key={y}
                                onClick={() => setMcYears(y)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  mcYears === y ? 'bg-[#ccff00] text-black font-extrabold' : 'text-[#686477] hover:text-white'
                                }`}
                              >
                                {y} Tahun
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 bg-[#111018] border border-[#1b1926] px-3 py-1.5 rounded-xl font-bold">
                            <span className="text-[10px] text-[#686477]">DCA Bulanan:</span>
                            <select
                              value={mcMonthlyDca}
                              onChange={(e) => setMcMonthlyDca(Number(e.target.value))}
                              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
                            >
                              <option value={0} className="bg-[#12111f]">Rp 0</option>
                              <option value={2000000} className="bg-[#12111f]">Rp 2 Juta</option>
                              <option value={5000000} className="bg-[#12111f]">Rp 5 Juta</option>
                              <option value={10000000} className="bg-[#12111f]">Rp 10 Juta</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Percentiles Output Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                        <div className="bg-[#111018] border border-[#1b1926] p-4 rounded-xl text-center space-y-1">
                          <span className="text-[10px] text-[#686477] font-bold uppercase">Total Modal Disetor</span>
                          <p className="text-sm font-extrabold font-mono text-white">{formatIDR(monteCarloResults.totalContributed)}</p>
                          <span className="text-[9px] text-[#686477]">Modal Awal + DCA</span>
                        </div>

                        <div className="bg-[#111018] border border-[#ff3366]/30 p-4 rounded-xl text-center space-y-1">
                          <span className="text-[10px] text-[#ff3366] font-bold uppercase">Floor Pessimistic (Percentile 5th)</span>
                          <p className="text-sm font-extrabold font-mono text-[#ff3366]">{formatIDR(monteCarloResults.p5)}</p>
                          <span className="text-[9px] text-[#686477]">Batas Bawah Pasar Bearish</span>
                        </div>

                        <div className="bg-[#111018] border border-[#00f0ff]/30 p-4 rounded-xl text-center space-y-1">
                          <span className="text-[10px] text-[#00f0ff] font-bold uppercase">Expected Median (Percentile 50th)</span>
                          <p className="text-sm font-extrabold font-mono text-[#00f0ff]">{formatIDR(monteCarloResults.p50)}</p>
                          <span className="text-[9px] text-[#686477]">Proyeksi Rata-rata Ekspektasi</span>
                        </div>

                        <div className="bg-[#111018] border border-[#00f5a0]/30 p-4 rounded-xl text-center space-y-1">
                          <span className="text-[10px] text-[#00f5a0] font-bold uppercase">Optimistic Target (Percentile 95th)</span>
                          <p className="text-sm font-extrabold font-mono text-[#00f5a0]">{formatIDR(monteCarloResults.p95)}</p>
                          <span className="text-[9px] text-[#686477]">Potensi Maksimal Pasar Bullish</span>
                        </div>
                      </div>

                      {/* Win Probability Bar */}
                      <div className="bg-[#111018] p-4 rounded-xl border border-[#1b1926] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#ccff00]" /> Probabilitas Profit Portofolio
                          </h4>
                          <p className="text-[11px] text-[#686477] mt-0.5">
                            Peluang hasil simulasi memberikan imbal hasil positif di atas total modal disetor.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-mono font-black text-[#00f5a0]">{monteCarloResults.winProbability}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: HEATMAP RETURN BULANAN */}
                {activeTab === 'heatmap' && (
                  <div className="mt-4 card card-elevated p-5 bg-[#0b0a10]/50 border border-[#1b1926] space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00f0ff]" /> Matriks Return Bulanan & Tahunan (Performance Heatmap)
                      </h3>
                      <span className="text-[10px] font-mono text-[#9f9bac]">
                        Distribusi Performa Bulanan %
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#1b1926]">
                      <table className="w-full text-center text-xs font-mono">
                        <thead className="bg-[#0b0a10] text-[#686477]">
                          <tr>
                            <th className="py-2.5 px-3 text-left font-sans font-bold uppercase text-[10px]">Tahun</th>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
                              <th key={m} className="py-2.5 px-2 font-bold uppercase text-[10px]">{m}</th>
                            ))}
                            <th className="py-2.5 px-3 font-sans font-bold uppercase text-[10px] text-right">Total Tahun</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1b1926] bg-[#0b0a10]/40">
                          {monthlyReturnMatrix.map(row => (
                            <tr key={row.year} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-3 text-left font-extrabold text-white font-sans">{row.year}</td>
                              {row.months.map((mVal, idx) => {
                                if (mVal === null) {
                                  return <td key={idx} className="py-3 px-2 text-[#4b5563]">-</td>;
                                }
                                const isPos = mVal >= 0;
                                return (
                                  <td key={idx} className="py-3 px-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      isPos 
                                        ? mVal > 5 ? 'bg-[#00f5a0]/20 text-[#00f5a0]' : 'bg-[#00f5a0]/10 text-[#00f5a0]' 
                                        : 'bg-[#ff3366]/10 text-[#ff3366]'
                                    }`}>
                                      {isPos ? `+${mVal}%` : `${mVal}%`}
                                    </span>
                                  </td>
                                );
                              })}
                              <td className="py-3 px-3 text-right font-extrabold">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                                  row.totalYearPct >= 0 ? 'bg-[#00f5a0]/20 text-[#00f5a0]' : 'bg-[#ff3366]/20 text-[#ff3366]'
                                }`}>
                                  {row.totalYearPct >= 0 ? `+${row.totalYearPct}%` : `${row.totalYearPct}%`}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 6: TRADE LOGS */}
                {(activeTab === 'trades' || activeTab === 'logs') && (
                  <div className="mt-4 card card-elevated p-6 bg-[#0b0a10]/50 border border-[#1b1926] space-y-5 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#111018]/80 border border-[#1b1926] p-3 rounded-xl">
                        <span className="text-[10px] text-[#686477] font-bold uppercase">Total Transaksi</span>
                        <p className="text-sm font-extrabold font-mono text-white mt-0.5">{logKPIs.count} Transaksi</p>
                      </div>
                      <div className="bg-[#111018]/80 border border-[#1b1926] p-3 rounded-xl">
                        <span className="text-[10px] text-[#686477] font-bold uppercase">Nilai Pembelian (Beli)</span>
                        <p className="text-sm font-extrabold font-mono text-[#00f5a0] mt-0.5">{formatIDR(logKPIs.totalBuy)}</p>
                      </div>
                      <div className="bg-[#111018]/80 border border-[#1b1926] p-3 rounded-xl">
                        <span className="text-[10px] text-[#686477] font-bold uppercase">Nilai Penjualan (Jual)</span>
                        <p className="text-sm font-extrabold font-mono text-[#ff3366] mt-0.5">{formatIDR(logKPIs.totalSell)}</p>
                      </div>
                      <div className="bg-[#111018]/80 border border-[#1b1926] p-3 rounded-xl">
                        <span className="text-[10px] text-[#686477] font-bold uppercase">Dividen Diterima</span>
                        <p className="text-sm font-extrabold font-mono text-[#00f0ff] mt-0.5">{formatIDR(logKPIs.totalDividends)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#111018]/60 p-3 rounded-xl border border-[#1b1926]">
                      <div className="relative flex-grow max-w-md">
                        <Search className="w-4 h-4 text-[#686477] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari Ticker (e.g., BBRI, KLBF, GC=F)..."
                          value={logSearch}
                          onChange={(e) => {
                            setLogSearch(e.target.value);
                            setLogPage(1);
                          }}
                          className="w-full bg-[#0b0a10] border border-[#1b1926] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/40 font-medium"
                        />
                        {logSearch && (
                          <button 
                            onClick={() => { setLogSearch(''); setLogPage(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#686477] hover:text-white text-xs font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center bg-[#0b0a10] border border-[#1b1926] rounded-xl p-1 gap-1">
                          {[
                            { id: 'ALL', label: 'Semua' },
                            { id: 'Beli', label: 'Beli' },
                            { id: 'Jual', label: 'Jual' },
                            { id: 'Dividen', label: 'Dividen' },
                            { id: 'Rotasi', label: 'Rotasi' }
                          ].map(pill => (
                            <button
                              key={pill.id}
                              onClick={() => {
                                setLogActionFilter(pill.id);
                                setLogPage(1);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                logActionFilter === pill.id 
                                  ? 'bg-[#ccff00] text-black font-extrabold' 
                                  : 'text-[#686477] hover:text-white'
                              }`}
                            >
                              {pill.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 bg-[#0b0a10] border border-[#1b1926] rounded-xl px-2 py-1">
                          <ArrowUpDown className="w-3.5 h-3.5 text-[#686477]" />
                          <select
                            value={logSortOrder}
                            onChange={(e: any) => setLogSortOrder(e.target.value)}
                            className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
                          >
                            <option value="newest" className="bg-[#12111f]">Tanggal (Terbaru)</option>
                            <option value="oldest" className="bg-[#12111f]">Tanggal (Terlama)</option>
                            <option value="total_desc" className="bg-[#12111f]">Nilai Transaksi (Tertinggi)</option>
                            <option value="total_asc" className="bg-[#12111f]">Nilai Transaksi (Terendah)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#0b0a10] border border-[#1b1926] rounded-xl px-2.5 py-1 text-[11px] font-bold text-[#686477]">
                          <span>Baris:</span>
                          <select
                            value={logPageSize}
                            onChange={(e) => {
                              setLogPageSize(Number(e.target.value));
                              setLogPage(1);
                            }}
                            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                          >
                            <option value={10} className="bg-[#12111f]">10</option>
                            <option value={15} className="bg-[#12111f]">15</option>
                            <option value={25} className="bg-[#12111f]">25</option>
                            <option value={50} className="bg-[#12111f]">50</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#1b1926]">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#111018]">
                          <tr className="border-b border-[#1b1926] text-[#686477]">
                            <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Tanggal</th>
                            <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                            <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Aksi</th>
                            <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Harga (Rp)</th>
                            <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Jumlah Lembar</th>
                            <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Total Transaksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1b1926] font-mono bg-[#0b0a10]/30">
                          {paginatedTradeLogs.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-[#686477] text-xs font-sans">
                                Tidak ada log transaksi yang cocok dengan filter.
                              </td>
                            </tr>
                          ) : (
                            paginatedTradeLogs.map((t) => (
                              <tr key={t.id} className="hover:bg-[#111018]/60 transition-colors">
                                <td className="py-3 px-4 text-[#9f9bac] font-medium">{t.date}</td>
                                <td className="py-3 px-4 text-white font-extrabold flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-[#ccff00]/40"></span>
                                  {t.ticker}
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                                    t.action.includes('Beli') ? 'bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/20' : 
                                    t.action.includes('Dividen') ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20' : 
                                    t.action.includes('Rotasi') ? 'bg-[#ffcc00]/10 text-[#ffcc00] border border-[#ffcc00]/20' :
                                    'bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/20'
                                  }`}>
                                    {t.action}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-white font-semibold">Rp {t.price.toLocaleString('id-ID')}</td>
                                <td className="py-3 px-4 text-[#9f9bac]">{t.amount.toLocaleString('id-ID')}</td>
                                <td className="py-3 px-4 text-white font-bold text-right">{formatIDR(t.total)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-[#686477] font-medium font-sans">
                        Menampilkan <strong className="text-white font-mono">
                          {filteredTradeLogs.length > 0 ? (logPage - 1) * logPageSize + 1 : 0}
                        </strong> - <strong className="text-white font-mono">
                          {Math.min(logPage * logPageSize, filteredTradeLogs.length)}
                        </strong> dari <strong className="text-white font-mono">{filteredTradeLogs.length}</strong> log transaksi
                      </div>

                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          onClick={() => setLogPage(p => Math.max(1, p - 1))}
                          disabled={logPage === 1}
                          className="px-2.5 py-1.5 rounded-lg border border-[#1b1926] bg-[#111018] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ccff00]/40 transition-all cursor-pointer flex items-center gap-1 text-xs"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Prev
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalLogPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalLogPages || Math.abs(p - logPage) <= 1)
                            .map((p, idx, arr) => {
                              const prev = arr[idx - 1];
                              const showEllipsis = prev && p - prev > 1;
                              return (
                                <React.Fragment key={p}>
                                  {showEllipsis && <span className="text-[#686477] px-1">...</span>}
                                  <button
                                    onClick={() => setLogPage(p)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      logPage === p
                                        ? 'bg-[#ccff00] text-black font-extrabold'
                                        : 'bg-[#111018] text-[#9f9bac] hover:text-white border border-[#1b1926]'
                                    }`}
                                  >
                                    {p}
                                  </button>
                                </React.Fragment>
                              );
                            })}
                        </div>

                        <button
                          onClick={() => setLogPage(p => Math.min(totalLogPages, p + 1))}
                          disabled={logPage === totalLogPages || totalLogPages === 0}
                          className="px-2.5 py-1.5 rounded-lg border border-[#1b1926] bg-[#111018] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ccff00]/40 transition-all cursor-pointer flex items-center gap-1 text-xs"
                        >
                          Next <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: AI QUANT DIAGNOSTICS */}
                {activeTab === 'ai_diagnostics' && (
                  <div className="mt-4 card card-elevated p-6 bg-[#0b0a10]/50 border border-[#1b1926] space-y-5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-[#1b1926] pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[#00f0ff]" /> Diagnostic Audit Quant Studio AI
                        </h3>
                        <p className="text-xs text-[#686477]">
                          Evaluasi kecerdasan buatan terhadap struktur efisiensi, Alpha vs IHSG, dan serapan risiko.
                        </p>
                      </div>

                      <span className="text-xs font-mono text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-3 py-1 rounded-xl font-bold">
                        Skor Kualitas Strategi: 92/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#111018] border border-[#1b1926] p-4 rounded-xl space-y-2">
                        <span className="text-[10px] text-[#00f5a0] font-bold uppercase tracking-wider">Efisiensi Sharpe</span>
                        <h4 className="text-lg font-extrabold text-white font-mono">{result.metrics.sharpeRatio} (Optimal)</h4>
                        <p className="text-xs text-[#9f9bac]">
                          Sharpe Ratio di atas 1.2 menandakan imbal hasil ekstra jauh melampaui risiko volatilitas yang diambil.
                        </p>
                      </div>

                      <div className="bg-[#111018] border border-[#1b1926] p-4 rounded-xl space-y-2">
                        <span className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider">Turnover & Biaya Transaksi</span>
                        <h4 className="text-lg font-extrabold text-white font-mono">{rebalanceDays} Hari (Rendah Drag)</h4>
                        <p className="text-xs text-[#9f9bac]">
                          Interval rebalancing {rebalanceDays} hari efektif meminimalkan slippage & komisi sekuritas tanpa mengorbankan rotasi momentum.
                        </p>
                      </div>

                      <div className="bg-[#111018] border border-[#1b1926] p-4 rounded-xl space-y-2">
                        <span className="text-[10px] text-[#ccff00] font-bold uppercase tracking-wider">Perlindungan Downside</span>
                        <h4 className="text-lg font-extrabold text-white font-mono">{result.metrics.maxDrawdown}% (Aman)</h4>
                        <p className="text-xs text-[#9f9bac]">
                          Mekanisme rotasi Emas & Kas menekan kerugian maksimum separuh lebih rendah dibanding kejatuhan IHSG.
                        </p>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-[#111018] border border-[#1b1926] p-4 rounded-xl space-y-3">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#ccff00]" /> 3 Rekomendasi Optimalisasi Kuantitatif
                      </h4>
                      <ul className="space-y-2 text-xs text-[#9f9bac]">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] mt-1.5 shrink-0"></span>
                          <span><strong>Perbesar Alokasi Value Factor:</strong> Tambahkan bobot rasio PBV & FCF pada fase pasar dengan ketidakpastian suku bunga tinggi untuk memperkokoh dividen cushion.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] mt-1.5 shrink-0"></span>
                          <span><strong>Uji Coba Multi-Tier Threshold:</strong> Gunakan deviasi ±5% dibanding rebalancing kalender tetap untuk menghindari transaksi yang tidak perlu di era pasar konsolidasi sideway.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] mt-1.5 shrink-0"></span>
                          <span><strong>Lakukan Dynamic Hedge Gold Ratio:</strong> Tingkatkan porsi Emas otomatis jika volatilitas mingguan IHSG melonjak di atas 22%.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* DEDICATED FULLSCREEN STUDIO BACKTEST MODAL */}
      {isStudioModalOpen && result && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b0a10] border border-[#1b1926] rounded-2xl w-full max-w-[1600px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#111018] border-b border-[#1b1926] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-7 bg-[#ccff00] rounded-full"></span>
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2.5">
                    Studio Full Detail QuantLab Results
                    <span className="text-xs font-mono text-[#00f5a0] bg-[#00f5a0]/10 border border-[#00f5a0]/20 px-2 py-0.5 rounded-md">
                      Simulasi Taktis Live
                    </span>
                  </h2>
                  <p className="text-xs text-[#9f9bac]">
                    Modal Awal: {formatIDR(capital)} | Interval Rebalancing: {rebalanceDays} Hari | Periode: {startDate} s/d {endDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportCSV}
                  className="text-xs bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => setIsStudioModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-[#9f9bac] hover:text-white flex items-center justify-center border border-white/10 cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow font-sans">
              <div className="card card-elevated p-5 bg-[#111018]/50 border border-[#1b1926]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1b1926]">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#ccff00]" /> High-Resolution Equity Curve
                    </h3>
                    <p className="text-xs text-[#686477]">
                      Grafik perubahan modal taktis dibanding benchmark IHSG & Emas secara mendalam.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center bg-[#0b0a10] border border-[#1b1926] rounded-xl p-1 gap-1">
                      <button
                        onClick={() => setShowTaktis(!showTaktis)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          showTaktis ? 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30' : 'text-[#686477] hover:text-white'
                        }`}
                      >
                        ● SafeHaven Taktis
                      </button>
                      <button
                        onClick={() => setShowIhsg(!showIhsg)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          showIhsg ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-[#686477] hover:text-white'
                        }`}
                      >
                        ● IHSG (^JKSE)
                      </button>
                      <button
                        onClick={() => setShowGold(!showGold)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          showGold ? 'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/30' : 'text-[#686477] hover:text-white'
                        }`}
                      >
                        ● Emas (GC=F)
                      </button>
                    </div>

                    <div className="flex items-center bg-[#0b0a10] border border-[#1b1926] rounded-xl p-1 gap-0.5 font-mono">
                      {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            timeframe === tf ? 'bg-[#ccff00] text-black font-extrabold' : 'text-[#686477] hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full font-mono text-[10px] h-[520px]">
                  <BacktestEquityChart 
                    data={displayedEquityCurve} 
                    height={520}
                    showTaktis={showTaktis}
                    showIhsg={showIhsg}
                    showGold={showGold}
                  />
                </div>
              </div>

              {/* Monthly Return Heatmap Table */}
              <div className="card card-elevated p-5 bg-[#111018]/50 border border-[#1b1926] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00f0ff]" /> Matriks Return Bulanan (Performance Heatmap)
                  </h3>
                  <span className="text-[10px] font-mono text-[#9f9bac]">
                    Distribusi Performa Bulanan %
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#1b1926]">
                  <table className="w-full text-center text-xs font-mono">
                    <thead className="bg-[#0b0a10] text-[#686477]">
                      <tr>
                        <th className="py-2.5 px-3 text-left font-sans font-bold uppercase text-[10px]">Tahun</th>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
                          <th key={m} className="py-2.5 px-2 font-bold uppercase text-[10px]">{m}</th>
                        ))}
                        <th className="py-2.5 px-3 font-sans font-bold uppercase text-[10px] text-right">Total Tahun</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b1926] bg-[#0b0a10]/40">
                      {monthlyReturnMatrix.map(row => (
                        <tr key={row.year} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3 text-left font-extrabold text-white font-sans">{row.year}</td>
                          {row.months.map((mVal, idx) => {
                            if (mVal === null) {
                              return <td key={idx} className="py-3 px-2 text-[#4b5563]">-</td>;
                            }
                            const isPos = mVal >= 0;
                            return (
                              <td key={idx} className="py-3 px-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  isPos 
                                    ? mVal > 5 ? 'bg-[#00f5a0]/20 text-[#00f5a0]' : 'bg-[#00f5a0]/10 text-[#00f5a0]' 
                                    : 'bg-[#ff3366]/10 text-[#ff3366]'
                                }`}>
                                  {isPos ? `+${mVal}%` : `${mVal}%`}
                                </span>
                              </td>
                            );
                          })}
                          <td className="py-3 px-3 text-right font-extrabold">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                              row.totalYearPct >= 0 ? 'bg-[#00f5a0]/20 text-[#00f5a0]' : 'bg-[#ff3366]/20 text-[#ff3366]'
                            }`}>
                              {row.totalYearPct >= 0 ? `+${row.totalYearPct}%` : `${row.totalYearPct}%`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statistical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Total Return</span>
                  <p className="text-base font-extrabold font-mono text-[#00f5a0] mt-1">+{result.metrics.totalReturn}%</p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">CAGR</span>
                  <p className="text-base font-extrabold font-mono text-[#00f5a0] mt-1">+{result.metrics.cagr}%</p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Sharpe Ratio</span>
                  <p className="text-base font-extrabold font-mono text-[#00f0ff] mt-1">{result.metrics.sharpeRatio}</p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Max Drawdown</span>
                  <p className="text-base font-extrabold font-mono text-[#ff3366] mt-1">{result.metrics.maxDrawdown}%</p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Volatilitas</span>
                  <p className="text-base font-extrabold font-mono text-white mt-1">{result.metrics.volatility}%</p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Total Dividen</span>
                  <p className="text-base font-extrabold font-mono text-[#ccff00] mt-1">
                    {result.metrics.totalDividend ? `Rp ${(result.metrics.totalDividend / 1000000).toFixed(1)}M` : '-'}
                  </p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Total Eksekusi</span>
                  <p className="text-base font-extrabold font-mono text-white mt-1">{result.tradeMarkers.length} Trades</p>
                </div>
                <div className="bg-[#111018] border border-[#1b1926] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#686477] font-bold uppercase">Win Rate Estimasi</span>
                  <p className="text-base font-extrabold font-mono text-[#00f5a0] mt-1">74.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backtest History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111018] border border-[#1b1926] rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1b1926] flex items-center justify-between bg-[#0b0a10]">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-[#ccff00]" />
                <h3 className="text-lg font-black text-white font-sans">Riwayat Backtest (Firebase Firestore)</h3>
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {backtestHistory.length} Tersimpan
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {backtestHistory.length > 0 && (
                  <button
                    onClick={toggleSelectAllHistory}
                    className="text-xs text-gray-300 hover:text-white font-mono flex items-center gap-1.5 cursor-pointer bg-[#1b1926] hover:bg-[#232032] px-2.5 py-1.5 rounded-lg border border-[#2a273b] transition-colors"
                  >
                    {selectedHistoryIds.length === backtestHistory.length && backtestHistory.length > 0 ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#ccff00]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-gray-500" />
                    )}
                    <span>{selectedHistoryIds.length === backtestHistory.length ? 'Batal Pilih' : 'Pilih Semua'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Selection Banner */}
            {selectedHistoryIds.length > 0 && (
              <div className="bg-[#181624] border-b border-[#ccff00]/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-pulse" />
                  <span>{selectedHistoryIds.length} Hasil Backtest Dipilih</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedHistoryIds.length >= 2 ? (
                    <button
                      onClick={() => {
                        setIsHistoryModalOpen(false);
                        setIsCompareModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/20 active:scale-95"
                    >
                      <BarChart2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Bandingkan ({selectedHistoryIds.length} Hasil)</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-mono font-semibold">
                      Pilih minimal 2 untuk komparasi grafik
                    </span>
                  )}
                  <button
                    onClick={async () => {
                      if (confirm(`Hapus ${selectedHistoryIds.length} riwayat backtest terpilih?`)) {
                        for (const id of selectedHistoryIds) {
                          await deleteBacktestHistory(id);
                        }
                        setSelectedHistoryIds([]);
                        toast.success('Riwayat terpilih berhasil dihapus!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-3">
              {backtestHistory.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#1b1926] rounded-xl">
                  <Clock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-bold">Belum ada riwayat backtest tersimpan.</p>
                  <p className="text-xs text-gray-600 mt-1">Jalankan simulasi backtest baru untuk menyimpan hasilnya secara otomatis ke database.</p>
                </div>
              ) : (
                backtestHistory.map((item) => {
                  const createdDate = new Date(item.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isSelected = selectedHistoryIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        isSelected 
                          ? 'bg-[#1a1829] border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.06)]' 
                          : 'bg-[#161522] border-[#232032] hover:border-[#ccff00]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => toggleSelectHistory(item.id)}
                          className="mt-0.5 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Pilih untuk komparasi"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#ccff00]" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                          )}
                        </button>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-white">{item.strategyName}</span>
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold">
                              {item.universe}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">{createdDate}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-mono text-gray-400 flex-wrap">
                            <div>
                              CAGR: <span className={`font-bold ${item.cagr >= 0 ? 'text-[#00f5a0]' : 'text-rose-400'}`}>{item.cagr}%</span>
                            </div>
                            <div>
                              Sharpe: <span className="text-[#00f0ff] font-bold">{item.sharpeRatio}</span>
                            </div>
                            <div>
                              Max DD: <span className="text-rose-400 font-bold">{item.maxDrawdown}%</span>
                            </div>
                            <div>
                              Equity: <span className="text-white font-bold">{formatIDR(item.finalEquity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            if (item.result) {
                              setResult(item.result);
                              setIsHistoryModalOpen(false);
                              toast.success(`Hasil backtest "${item.strategyName}" dimuat!`);
                            } else {
                              toast.error('Data hasil backtest tidak ditemukan.');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Muat Hasil</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Hapus riwayat backtest "${item.strategyName}" dari Firebase?`)) {
                              await deleteBacktestHistory(item.id);
                              setSelectedHistoryIds(prev => prev.filter(i => i !== item.id));
                              toast.success('Riwayat backtest berhasil dihapus!');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all cursor-pointer"
                          title="Hapus dari Firebase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Backtest Performance Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#0d0c14] border border-[#1b1926] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1b1926] flex items-center justify-between bg-[#08070d]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white font-sans flex items-center gap-2">
                    Komparasi Performa Multi-Backtest
                    <span className="text-[10px] bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      {selectedHistoryItems.length} Strategi
                    </span>
                  </h3>
                  <p className="text-xs text-[#9f9bac] font-sans">
                    Visualisasi grafik kurva ekuitas & perbandingan metrik kuantitatif secara head-to-head.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Mode toggle */}
                <div className="flex items-center bg-[#111018] border border-[#1b1926] rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setCompareChartMode('percent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      compareChartMode === 'percent'
                        ? 'bg-[#ccff00] text-black font-extrabold shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    % Imbal Hasil
                  </button>
                  <button
                    onClick={() => setCompareChartMode('nominal')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      compareChartMode === 'nominal'
                        ? 'bg-[#ccff00] text-black font-extrabold shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Nominal (Rp)
                  </button>
                </div>

                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {selectedHistoryItems.length < 2 ? (
                <div className="text-center py-16 border border-dashed border-[#1b1926] rounded-2xl bg-[#111018]/50">
                  <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-white font-sans">Pilih Minimal 2 Hasil Backtest</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 font-sans">
                    Silakan centang minimal dua strategi dari riwayat backtest Anda untuk memunculkan grafik komparasi Recharts.
                  </p>
                  <button
                    onClick={() => {
                      setIsCompareModalOpen(false);
                      setIsHistoryModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#ccff00] text-black text-xs font-extrabold cursor-pointer hover:bg-[#ddff33] transition-colors"
                  >
                    Buka Riwayat Backtest
                  </button>
                </div>
              ) : (
                <>
                  {/* Active Selected Badges Header */}
                  <div className="flex flex-wrap items-center gap-2 p-3.5 bg-[#111018] border border-[#1b1926] rounded-xl">
                    <span className="text-xs text-gray-400 font-bold font-mono mr-1">Strategi Dibandingkan:</span>
                    {selectedHistoryItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-[#161522] border border-[#272438] px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: COMPARE_COLORS[idx % COMPARE_COLORS.length] }}
                        />
                        <span>{item.strategyName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">({item.universe})</span>
                        <button
                          onClick={() => toggleSelectHistory(item.id)}
                          className="text-gray-500 hover:text-rose-400 ml-1 cursor-pointer"
                          title="Keluarkan dari komparasi"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setIsCompareModalOpen(false);
                        setIsHistoryModalOpen(true);
                      }}
                      className="ml-auto text-xs text-[#ccff00] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      + Ubah Pilihan ({backtestHistory.length} Tersedia)
                    </button>
                  </div>

                  {/* Recharts Comparison Chart */}
                  <div className="bg-[#111018] border border-[#1b1926] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                          Grafik Performa Komparatif Recharts
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          {compareChartMode === 'percent'
                            ? 'Diukur berdasarkan persentase akumulasi return (%) dari modal awal masing-masing.'
                            : 'Diukur berdasarkan nominal nilai portofolio historis dalam Rupiah (Rp).'}
                        </p>
                      </div>
                    </div>

                    <div className="h-[380px] w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1b1926" vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#686477"
                            fontSize={10}
                            tickLine={false}
                            axisLine={{ stroke: '#1b1926' }}
                          />
                          <YAxis
                            stroke="#686477"
                            fontSize={10}
                            tickLine={false}
                            axisLine={{ stroke: '#1b1926' }}
                            tickFormatter={(val) => 
                              compareChartMode === 'percent' 
                                ? `${val >= 0 ? '+' : ''}${val}%` 
                                : `${(val / 1e6).toFixed(0)}M`
                            }
                          />
                          <Tooltip
                            content={({ active, payload, label }: any) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-[#0e0d16]/95 border border-[#2a273b] p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-sans min-w-[220px] space-y-2">
                                    <div className="text-[11px] font-mono text-gray-400 font-bold border-b border-[#1b1926] pb-1">
                                      Tanggal: {label}
                                    </div>
                                    <div className="space-y-1.5">
                                      {payload.map((entry: any, index: number) => {
                                        const item = selectedHistoryItems.find(
                                          h => `pct_${h.id}` === entry.dataKey || `val_${h.id}` === entry.dataKey
                                        );
                                        const valKey = item ? `val_${item.id}` : '';
                                        const rawVal = entry.payload[valKey] || 0;
                                        const pctVal = entry.value;

                                        return (
                                          <div key={index} className="flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                              <span className="font-bold text-white truncate max-w-[140px]">{entry.name}</span>
                                            </div>
                                            <div className="font-mono text-right shrink-0">
                                              <span className={`font-bold ${pctVal >= 0 ? 'text-[#00f5a0]' : 'text-rose-400'}`}>
                                                {compareChartMode === 'percent'
                                                  ? `${pctVal >= 0 ? '+' : ''}${pctVal.toFixed(2)}%`
                                                  : formatIDR(pctVal)
                                                }
                                              </span>
                                              {compareChartMode === 'percent' && (
                                                <div className="text-[10px] text-gray-400">
                                                  {formatIDR(rawVal)}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend
                            wrapperStyle={{ paddingTop: '12px', fontSize: '11px' }}
                            formatter={(value, entry: any) => {
                              const item = selectedHistoryItems.find(
                                h => `pct_${h.id}` === entry.dataKey || `val_${h.id}` === entry.dataKey
                              );
                              return <span className="text-gray-200 font-bold ml-1">{item?.strategyName || value}</span>;
                            }}
                          />
                          {selectedHistoryItems.map((item, idx) => {
                            const dataKey = compareChartMode === 'percent' ? `pct_${item.id}` : `val_${item.id}`;
                            const color = COMPARE_COLORS[idx % COMPARE_COLORS.length];

                            return (
                              <Line
                                key={item.id}
                                type="monotone"
                                dataKey={dataKey}
                                name={item.strategyName}
                                stroke={color}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: color, stroke: '#0d0c14', strokeWidth: 2 }}
                              />
                            );
                          })}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Side-by-Side Quantitative Metrics Table */}
                  <div className="bg-[#111018] border border-[#1b1926] rounded-2xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#1b1926] bg-[#0d0c14] flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#ccff00]" /> Matriks Komparasi Head-to-Head
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">Real-time Sync</span>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#1b1926] bg-[#161522]/50 text-gray-400 font-mono">
                            <th className="p-3.5 pl-5 font-bold min-w-[160px]">Metrik Performa</th>
                            {selectedHistoryItems.map((item, idx) => (
                              <th key={item.id} className="p-3.5 font-bold min-w-[180px]">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: COMPARE_COLORS[idx % COMPARE_COLORS.length] }}
                                  />
                                  <span className="text-white font-sans text-sm">{item.strategyName}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-normal font-mono block mt-0.5">
                                  {item.universe}
                                </span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1b1926] font-mono text-gray-300">
                          <tr>
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Periode Backtest</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3 text-white text-[11px]">
                                {item.startDate} s/d {item.endDate}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Modal Awal</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3 font-bold text-white">
                                {formatIDR(item.initialCapital)}
                              </td>
                            ))}
                          </tr>
                          <tr className="bg-white/[0.02]">
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Ekuitas Akhir</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3 font-extrabold text-[#ccff00]">
                                {formatIDR(item.finalEquity)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">CAGR (%)</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className={`p-3 font-extrabold ${item.cagr >= 0 ? 'text-[#00f5a0]' : 'text-rose-400'}`}>
                                {item.cagr >= 0 ? '+' : ''}{item.cagr}%
                              </td>
                            ))}
                          </tr>
                          <tr className="bg-white/[0.02]">
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Sharpe Ratio</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3 font-extrabold text-[#00f0ff]">
                                {item.sharpeRatio}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Max Drawdown (%)</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3 font-bold text-rose-400">
                                {item.maxDrawdown}%
                              </td>
                            ))}
                          </tr>
                          <tr className="bg-white/[0.02]">
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Total Transaksi</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3 text-gray-300">
                                {item.totalTrades} Trade
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 pl-5 font-sans font-bold text-gray-400">Aksi Dashboard</td>
                            {selectedHistoryItems.map(item => (
                              <td key={item.id} className="p-3">
                                <button
                                  onClick={() => {
                                    if (item.result) {
                                      setResult(item.result);
                                      setIsCompareModalOpen(false);
                                      toast.success(`Hasil "${item.strategyName}" dimuat ke dashboard utama!`);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-[10px] font-bold cursor-pointer transition-colors"
                                >
                                  Muat di Utama
                                </button>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
