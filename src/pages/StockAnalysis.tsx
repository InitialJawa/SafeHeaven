/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TickerLogo } from '../components/TickerLogo';
import { useLocation } from 'wouter';
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  Table, 
  Grid, 
  Download, 
  Info, 
  Layers, 
  Activity, 
  TrendingUp, 
  Coins, 
  Shield, 
  HelpCircle,
  TrendingDown,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAppStore } from '../stores';
import { Skeleton } from '../components/Skeleton';

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  index: string;
  board: string;
  quality: number;
  growth: number;
  value: number;
  moment: number;
  dividen: number;
  divYield?: number;
  roe?: number;
  growthYoY?: number;
  pe?: number;
  pbv?: number;
  rsi?: number;
  ma50Diff?: number;
  delta: number;
  rotation: string;
  rotationT: number;
  rotationB: number;
}

// Memory Cache for instant sub-millisecond page transitions
let stockMatrixMemoryCache: StockData[] | null = null;
let stockMatrixLastSyncedTime: string = '';

export const StockAnalysis: React.FC = () => {
  const [, setLocation] = useLocation();
  const strategies = useAppStore(state => state.strategies);
  const universes = useAppStore(state => state.universes);
  const portfolioConfig = useAppStore(state => state.portfolioConfig);
  const updatePortfolioConfig = useAppStore(state => state.updatePortfolioConfig);
  const marketRegime = useAppStore(state => state.marketRegime);
  
  const [stocks, setStocks] = useState<StockData[]>(() => stockMatrixMemoryCache || []);
  const [loading, setLoading] = useState(!stockMatrixMemoryCache || stockMatrixMemoryCache.length === 0);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => stockMatrixLastSyncedTime);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Recent Searches state
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const handleStockClick = (symbol: string) => {
    let updated = [symbol, ...recentSearches.filter(s => s !== symbol)];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
    setLocation(`/ticker/${symbol.toLowerCase()}`);
  };

  const activeSelectValue = useMemo(() => {
    const profile = portfolioConfig?.strategyProfile || 'auto';
    if (profile === 'custom') {
      return `custom:${portfolioConfig?.strategyTemplate || 'strat-1'}`;
    }
    return profile;
  }, [portfolioConfig]);
  
  const [selectedIndex, setSelectedIndex] = useState<string>(portfolioConfig?.universe || 'SEMUA');
  const [selectedBoard, setSelectedBoard] = useState<string>('SEMUA');
  const [selectedSector, setSelectedSector] = useState<string>('SEMUA');
  const [sortBy, setSortBy] = useState<string>('totalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'MATRIX' | 'CARDS'>('MATRIX');

  // Pagination for heavy list performance (350+ items)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const fetchStocks = async (isManualSync = false) => {
    try {
      if (isManualSync) setIsSyncingApi(true);
      else if (!stockMatrixMemoryCache) setLoading(true);

      const endpoint = isManualSync ? '/api/market/analysis-matrix/sync' : '/api/market/analysis-matrix';
      const method = isManualSync ? 'POST' : 'GET';

      const res = await fetch(`${window.location.origin}${endpoint}`, { method });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || (Array.isArray(result) ? result : []);
        setStocks(data);
        stockMatrixMemoryCache = data;

        if (result.lastSyncedAt) {
          setLastSyncedTime(result.lastSyncedAt);
          stockMatrixLastSyncedTime = result.lastSyncedAt;
        }

        if (isManualSync) {
          toast.success('Data kuantitatif saham berhasil disinkronkan dari Yahoo Finance API!');
        }
      } else {
        toast.error('Gagal mengambil data analisis saham dari API.');
      }
    } catch (err) {
      console.error('Error fetching stock matrix:', err);
      toast.error('Gangguan koneksi saat mengambil data saham dari API.');
    } finally {
      setLoading(false);
      setIsSyncingApi(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Scoring configuration depending on active Strategy Profile / Template
  const scoringConfig = useMemo(() => {
    const profile = portfolioConfig?.strategyProfile || 'auto';
    const templateId = portfolioConfig?.strategyTemplate || 'strat-1';

    let weights = { quality: 0.3, growth: 0.2, value: 0.25, moment: 0.25, dividen: 0 };
    let label = 'Auto Regime (IHSG)';
    let tooltip = 'Strategi dinamis otomatis mengikuti rezim pasar IHSG.';
    let weightsDisplay = 'Q: 30% • G: 20% • V: 25% • M: 25% • D: 0%';

    if (profile === 'auto') {
      const reg = (marketRegime || 'neutral').toLowerCase();
      if (reg === 'bull') {
        weights = { quality: 0.2, growth: 0.2, value: 0.1, moment: 0.5, dividen: 0 };
        weightsDisplay = 'Q: 20% • G: 20% • V: 10% • M: 50% • D: 0%';
      } else if (reg === 'bear') {
        weights = { quality: 0.35, growth: 0.15, value: 0.35, moment: 0.15, dividen: 0 };
        weightsDisplay = 'Q: 35% • G: 15% • V: 35% • M: 15% • D: 0%';
      } else {
        weights = { quality: 0.3, growth: 0.2, value: 0.25, moment: 0.25, dividen: 0 };
        weightsDisplay = 'Q: 30% • G: 20% • V: 25% • M: 25% • D: 0%';
      }
      label = `Auto Regime (${reg.toUpperCase()})`;
      tooltip = `Bobot faktor disesuaikan secara otomatis berdasarkan rezim pasar IHSG saat ini (${reg.toUpperCase()}).`;
    } else if (profile === 'aggressive_momentum' || profile === 'aggressive') {
      weights = { quality: 0.2, growth: 0.2, value: 0.1, moment: 0.5, dividen: 0 };
      label = 'Aggressive Momentum';
      tooltip = 'Memprioritaskan tren momentum dan pertumbuhan saham secara agresif.';
      weightsDisplay = 'Q: 20% • G: 20% • V: 10% • M: 50% • D: 0%';
    } else if (profile === 'defensive_value' || profile === 'defensive') {
      weights = { quality: 0.35, growth: 0.15, value: 0.35, moment: 0.15, dividen: 0 };
      label = 'Defensive Value';
      tooltip = 'Memprioritaskan kriteria kualitas neraca dan valuasi murah terdiskon.';
      weightsDisplay = 'Q: 35% • G: 15% • V: 35% • M: 15% • D: 0%';
    } else {
      const strat = strategies.find(s => s.id === templateId) || strategies[0];
      if (strat) {
        const totalWeight = (strat.weightQuality + strat.weightGrowth + strat.weightValue + strat.weightMomentum + strat.weightDividend) || 100;
        weights = {
          quality: strat.weightQuality / totalWeight,
          growth: strat.weightGrowth / totalWeight,
          value: strat.weightValue / totalWeight,
          moment: strat.weightMomentum / totalWeight,
          dividen: strat.weightDividend / totalWeight
        };
        label = `${strat.name} (Custom)`;
        tooltip = strat.description;
        weightsDisplay = `Q: ${strat.weightQuality}% • G: ${strat.weightGrowth}% • V: ${strat.weightValue}% • M: ${strat.weightMomentum}% • D: ${strat.weightDividend}%`;
      }
    }

    return {
      label,
      tooltip,
      icon: Activity,
      iconColor: 'text-[#ccff00]',
      bgColor: 'bg-[#ccff00]/10 border-[#ccff00]/20 text-[#ccff00]',
      weights,
      weightsDisplay
    };
  }, [portfolioConfig, marketRegime, strategies]);

  // Compute list of unique sectors for filter option
  const sectorsList = useMemo(() => {
    const list = new Set(stocks.map(s => s.sector));
    return Array.from(list).sort();
  }, [stocks]);

  // Transform stocks: calculate dynamic Total Score and sort (O(N) optimized)
  const processedStocks = useMemo(() => {
    const weights = scoringConfig.weights;
    
    // 1. Calculate Score
    const scored = stocks.map(stock => {
      const totalScore = parseFloat((
        stock.quality * weights.quality +
        stock.growth * weights.growth +
        stock.value * weights.value +
        stock.moment * weights.moment +
        stock.dividen * weights.dividen
      ).toFixed(1));
      
      return {
        ...stock,
        totalScore
      };
    });

    // Assign composite rank using O(N) Map lookup (350x faster than findIndex)
    const byTotalScore = [...scored].sort((a, b) => b.totalScore - a.totalScore);
    const rankMap = new Map<string, number>();
    byTotalScore.forEach((ts, idx) => {
      rankMap.set(ts.symbol, idx + 1);
    });

    const ranked = scored.map(s => ({
      ...s,
      globalRank: rankMap.get(s.symbol) || 1
    }));

    // 2. Apply Filters
    const query = searchQuery.toLowerCase().trim();
    const selectedUniverse = universes.find(u => u.name === selectedIndex);

    let filtered = ranked.filter(stock => {
      // Search match
      if (query && !stock.symbol.toLowerCase().includes(query) &&
          !stock.name.toLowerCase().includes(query) &&
          !stock.sector.toLowerCase().includes(query)) {
        return false;
      }

      // Index Filter
      if (selectedIndex !== 'SEMUA') {
        const matchIndex = (selectedUniverse && selectedUniverse.tickers.includes(stock.symbol)) || stock.index === selectedIndex;
        if (!matchIndex) return false;
      }

      // Board Filter
      if (selectedBoard !== 'SEMUA' && stock.board !== selectedBoard) return false;

      // Sector Filter
      if (selectedSector !== 'SEMUA' && stock.sector !== selectedSector) return false;

      return true;
    });

    // 3. Apply Sort
    filtered.sort((a, b) => {
      let valA = a[sortBy as keyof typeof a];
      let valB = b[sortBy as keyof typeof b];

      if (typeof valA === 'number' && typeof valB === 'number') {
        if (valA !== valB) {
           return sortOrder === 'desc' ? valB - valA : valA - valB;
        }
      } else {
        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      }
      return a.symbol.localeCompare(b.symbol);
    });

    return filtered;

  }, [stocks, searchQuery, scoringConfig, selectedIndex, selectedBoard, selectedSector, sortBy, sortOrder, universes]);

  // Calculate Average Score of top 5 elements
  const topFiveAverage = useMemo(() => {
    if (processedStocks.length === 0) return 0;
    // Sort descending by totalScore first to get true top 5
    const sortedByScore = [...processedStocks].sort((a, b) => b.totalScore - a.totalScore);
    const top = sortedByScore.slice(0, 5);
    const sum = top.reduce((acc, curr) => acc + curr.totalScore, 0);
    return parseFloat((sum / Math.max(1, top.length)).toFixed(1));
  }, [processedStocks]);

  // Paginated elements for the view
  const paginatedStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedStocks.slice(startIndex, startIndex + itemsPerPage);
  }, [processedStocks, currentPage]);

  const totalPages = Math.ceil(processedStocks.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Export to CSV Function
  const exportToCSV = () => {
    if (processedStocks.length === 0) {
      toast.error('Tidak ada data saham untuk diekspor.');
      return;
    }

    const headers = ['RANK', 'SYMBOL', 'NAME', 'SECTOR', 'INDEX', 'BOARD', 'QUALITY', 'GROWTH', 'VALUE', 'MOMENTUM', 'DIVIDEND', 'ROTATION', 'TOTAL SCORE'];
    const csvRows = [headers.join(',')];

    processedStocks.forEach((s) => {
      const row = [
        `#${s.globalRank}`,
        s.symbol,
        `"${s.name.replace(/"/g, '""')}"`,
        s.sector,
        s.index,
        s.board,
        s.quality,
        s.growth,
        s.value,
        s.moment,
        s.dividen,
        s.rotation,
        s.totalScore
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SafeHaven_StockMatrix_${scoringConfig.label.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Eksport sukses! ${processedStocks.length} emiten diunduh.`);
  };

  // Helper to get sector rotation styles
  const getRotationBadge = (rotation: string, t: number, b: number) => {
    let style = 'bg-[#1b1926] text-gray-400 border-gray-800';
    let icon = '➔➔';
    
    switch (rotation) {
      case 'AKUMULASI':
        style = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
        icon = '▲▲';
        break;
      case 'VOLATIL':
        style = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
        icon = '▼▼';
        break;
      case 'KONSOLIDASI':
        style = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400';
        icon = '➔➔';
        break;
      case 'ROTASI KUAT':
        style = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
        icon = '▲▲';
        break;
      case 'KONSISTEN PEAK':
        style = 'bg-[#ccff00]/10 border-[#ccff00]/20 text-[#ccff00]';
        icon = '▲▲';
        break;
      case 'SPEKULATIF':
        style = 'bg-rose-500/10 border-rose-500/20 text-rose-400';
        icon = '▼▼';
        break;
    }

    return (
      <div className="flex flex-col items-start gap-1">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-extrabold ${style} tracking-wide`}>
          <span>{icon}</span> {rotation}
        </span>
        <span className="text-[9px] text-[#686477] font-mono font-bold pl-0.5">T: {t} | B: {b}</span>
      </div>
    );
  };

  const ActiveIcon = scoringConfig.icon;

  return (
    <div id="stock-analysis-view" className="px-4 sm:px-6 space-y-4">
      
      {/* STREAMLINED UNIFIED 1-ROW COMPACT HEADER & METRICS BAR */}
      <div className="card bg-[#0b0a10] border border-[#1b1926] rounded-xl p-2.5 md:p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-2.5 overflow-x-auto">
        {/* Title & Live Status */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#ccff00] rounded-full shrink-0"></span>
            <h1 className="text-base font-black text-white tracking-tight font-sans whitespace-nowrap">Stock Matrix</h1>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            {lastSyncedTime && (
              <span className="text-[9px] text-[#686477] font-mono">{lastSyncedTime}</span>
            )}
            <button
              onClick={() => fetchStocks(true)}
              disabled={isSyncingApi}
              className="p-1.5 rounded-lg bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] transition-all cursor-pointer disabled:opacity-50"
              title="Sinkronkan Live"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingApi ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Metrics & Strategy Controls in 1 horizontal strip */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-0.5">
          {/* Strategy Profile Dropdown */}
          <div className="bg-[#111018] border border-[#1b1926] rounded-lg px-2 py-1 flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] font-extrabold uppercase text-[#686477] font-mono hidden sm:inline">PROFIL:</span>
            <div className="relative inline-flex items-center">
              <select
                value={activeSelectValue}
                onChange={(e) => { 
                  const val = e.target.value;
                  setCurrentPage(1); 
                  if (val.startsWith('custom:')) {
                    const stratId = val.replace('custom:', '');
                    const strat = strategies.find(s => s.id === stratId);
                    if (strat && updatePortfolioConfig) {
                      updatePortfolioConfig({ 
                        strategyProfile: 'custom',
                        strategyTemplate: stratId, 
                        strategyName: strat.name 
                      });
                      toast.success(`Strategi: ${strat.name}`);
                    }
                  } else {
                    if (updatePortfolioConfig) {
                      const nameMap: Record<string, string> = {
                        auto: 'Auto Regime',
                        aggressive_momentum: 'Aggressive Momentum',
                        defensive_value: 'Defensive Value'
                      };
                      updatePortfolioConfig({
                        strategyProfile: val as any,
                        strategyName: nameMap[val] || 'Auto Regime'
                      });
                      toast.success(`Profil: ${nameMap[val] || val}`);
                    }
                  }
                }}
                className="bg-[#1b1926] hover:bg-[#232032] border border-[#2d2940] focus:border-[#ccff00] text-[11px] font-bold text-[#ccff00] rounded pl-2 pr-5 py-0.5 appearance-none cursor-pointer focus:outline-none transition-all truncate max-w-[140px]"
              >
                <optgroup label="PROFIL DINAMIS" className="bg-[#111018] text-amber-400 font-bold">
                  <option value="auto" className="bg-[#111018] text-white">Auto Regime (IHSG)</option>
                  <option value="aggressive_momentum" className="bg-[#111018] text-white">Aggressive Momentum</option>
                  <option value="defensive_value" className="bg-[#111018] text-white">Defensive Value</option>
                </optgroup>
                <optgroup label="TEMPLATE KUSTOM" className="bg-[#111018] text-[#ccff00] font-bold">
                  {strategies.map((strat) => (
                    <option key={strat.id} value={`custom:${strat.id}`} className="bg-[#111018] text-white">
                      {strat.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-3 h-3 text-[#ccff00] absolute right-1.5 pointer-events-none" />
            </div>
          </div>

          {/* Factor Weights Display */}
          <div className="bg-[#111018] border border-[#1b1926] rounded-lg px-2.5 py-1 flex items-center gap-1.5 shrink-0" title="Bobot Faktor Scoring">
            <span className="text-[9px] font-extrabold uppercase text-[#686477] font-mono hidden sm:inline">BOBOT:</span>
            <span className="text-[11px] font-extrabold text-[#00f0ff] font-mono whitespace-nowrap">
              {scoringConfig.weightsDisplay}
            </span>
          </div>

          {/* Top 5 Average */}
          <div className="bg-[#111018] border border-[#1b1926] rounded-lg px-2.5 py-1 flex items-center gap-1.5 shrink-0" title="Rata-rata Top 5 Skor">
            <span className="text-[9px] font-extrabold uppercase text-[#686477] font-mono hidden sm:inline">TOP 5:</span>
            <span className="text-xs font-black text-[#ccff00] font-mono">{topFiveAverage}</span>
            <span className="text-[9px] text-[#686477] font-bold">/100</span>
          </div>

          {/* Desktop Sync Button */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {lastSyncedTime && (
              <span className="text-[9px] text-[#686477] font-mono">{lastSyncedTime}</span>
            )}
            <button
              onClick={() => fetchStocks(true)}
              disabled={isSyncingApi}
              className="px-2.5 py-1 rounded-lg bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingApi ? 'animate-spin' : ''}`} />
              <span>{isSyncingApi ? 'Sync...' : 'Sync Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-LAYER FILTERS & SEARCH CONTROL BAR */}
      <div className="bg-[#0b0a10]/60 border border-[#1b1926] p-2.5 rounded-xl space-y-2.5">
        {/* Single Layer Row: Search Input + Index + Board + Sector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#686477]" />
            <input
              type="text"
              placeholder="Cari emiten ticker..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#111018]/80 border border-[#1b1926] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg font-sans font-medium focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00]/10 transition-all placeholder:text-[#686477]"
            />
          </div>

          {/* Filter Dropdowns aligned in 1 layer */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 shrink-0">
            {/* Index Filter */}
            <div className="relative flex items-center">
              <select
                value={selectedIndex}
                onChange={(e) => { 
                  const universeId = e.target.value;
                  setSelectedIndex(universeId); 
                  setCurrentPage(1);
                  if (portfolioConfig && updatePortfolioConfig && universeId !== 'SEMUA') {
                    updatePortfolioConfig({ universe: universeId });
                  }
                }}
                className="w-full sm:w-auto bg-[#111018]/90 border border-[#1b1926] hover:border-[#38334a] text-white text-[11px] px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#ccff00] font-sans font-bold cursor-pointer truncate max-w-[130px]"
                title="Filter Index"
              >
                <option value="SEMUA">Semua Index</option>
                {universes.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Board Filter */}
            <div className="relative flex items-center">
              <select
                value={selectedBoard}
                onChange={(e) => { setSelectedBoard(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-auto bg-[#111018]/90 border border-[#1b1926] hover:border-[#38334a] text-white text-[11px] px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#ccff00] font-sans font-bold cursor-pointer truncate max-w-[120px]"
                title="Filter Board"
              >
                <option value="SEMUA">Semua Board</option>
                <option value="BOARD UTAMA">Utama</option>
                <option value="BOARD PENGEMBANGAN">Pengembangan</option>
              </select>
            </div>

            {/* Sector Filter */}
            <div className="relative flex items-center">
              <select
                value={selectedSector}
                onChange={(e) => { setSelectedSector(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-auto bg-[#111018]/90 border border-[#1b1926] hover:border-[#38334a] text-white text-[11px] px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#ccff00] font-sans font-bold cursor-pointer truncate max-w-[130px]"
                title="Filter Sektor"
              >
                <option value="SEMUA">Semua Sektor</option>
                {sectorsList.map(sect => (
                  <option key={sect} value={sect}>{sect}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recent Searches (compact badge row if any exists) */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#1b1926]/40 text-[10px]">
            <span className="text-[#686477] font-mono font-bold shrink-0">Recent:</span>
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {recentSearches.map(symbol => (
                <button
                  key={symbol}
                  onClick={() => handleStockClick(symbol)}
                  className="px-1.5 py-0.5 rounded bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-mono text-[9px] font-bold text-[#9f9bac] hover:text-[#ccff00] transition-colors cursor-pointer shrink-0"
                >
                  {symbol}
                </button>
              ))}
              <button
                onClick={() => {
                  setRecentSearches([]);
                  localStorage.removeItem('recent_searches');
                }}
                className="text-[9px] font-bold text-rose-500/70 hover:text-rose-500 transition-colors ml-1 shrink-0"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* View Options & Download Sub-bar */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#1b1926]/60">
          <div className="text-[11px] font-sans text-[#686477]">
            Menampilkan <span className="text-white font-mono font-bold">{processedStocks.length}</span> emiten
            {sortBy && (
              <span className="ml-2 px-2 py-0.5 rounded bg-[#111018] border border-[#1b1926] text-[10px] text-[#ccff00] font-mono">
                Urut: <strong className="uppercase">{sortBy}</strong> ({sortOrder === 'desc' ? 'Tinggi → Rendah' : 'Rendah → Tinggi'})
              </span>
            )}
          </div>

          {/* Toggle view and download */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#111018] p-1 rounded-xl border border-[#1b1926]">
              <button
                onClick={() => setViewMode('MATRIX')}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${viewMode === 'MATRIX' ? 'bg-[#1b1926] text-[#ccff00]' : 'text-[#686477] hover:text-white'}`}
                title="Matrix View"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${viewMode === 'CARDS' ? 'bg-[#1b1926] text-[#ccff00]' : 'text-[#686477] hover:text-white'}`}
                title="Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={exportToCSV}
              className="bg-transparent hover:bg-white/5 text-xs text-white border border-[#1b1926] hover:border-[#38334a] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#686477]" />
              <span className="font-sans">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Ticker Results (Table or Cards Grid) */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {viewMode === 'MATRIX' ? (
              <div className="card card-elevated p-6 space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-48 rounded-xl" />
                ))}
              </div>
            )}
          </motion.div>
        ) : processedStocks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card card-elevated py-16 text-center text-[#9f9bac] bg-[#0b0a10]/45 flex flex-col items-center justify-center"
          >
            <Info className="w-8 h-8 text-[#686477] mb-2" />
            <p className="text-xs font-sans font-bold uppercase tracking-wider text-white">Tidak ada emiten ditemukan</p>
            <p className="text-[11px] text-[#686477] font-sans mt-1">Coba sesuaikan filter pencarian atau index Anda.</p>
          </motion.div>
        ) : viewMode === 'MATRIX' ? (
          <motion.div
            key="matrix-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-x-auto border border-[#1b1926] rounded-xl bg-[#0b0a10]/45"
          >
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-[#1b1926] bg-[#0c0b12]/50 text-[#686477] select-none">
                  <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider font-mono text-center w-16">
                    <button
                      onClick={() => handleSort('totalScore')}
                      className={`inline-flex items-center justify-center gap-1 font-mono hover:text-white transition-colors cursor-pointer w-full py-1 ${
                        sortBy === 'totalScore' ? 'text-[#ccff00] font-extrabold' : ''
                      }`}
                      title="Klik untuk mengurutkan berdasarkan Rank / Total Score"
                    >
                      <span>RANK</span>
                      {sortBy === 'totalScore' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-4 font-bold text-[10px] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('symbol')}
                      className={`inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-1 ${
                        sortBy === 'symbol' ? 'text-[#ccff00] font-extrabold' : ''
                      }`}
                      title="Klik untuk mengurutkan berdasarkan Ticker Emiten"
                    >
                      <span>Emiten Saham</span>
                      {sortBy === 'symbol' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider text-center">
                    <button
                      onClick={() => handleSort('quality')}
                      className={`inline-flex items-center justify-center gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
                        sortBy === 'quality' 
                          ? 'text-[#ccff00] bg-[#ccff00]/15 border border-[#ccff00]/40 font-black shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                          : 'hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title="Klik untuk Mengurutkan berdasarkan Skor Quality"
                    >
                      <span>QUALITY</span>
                      {sortBy === 'quality' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider text-center">
                    <button
                      onClick={() => handleSort('growth')}
                      className={`inline-flex items-center justify-center gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
                        sortBy === 'growth' 
                          ? 'text-[#ccff00] bg-[#ccff00]/15 border border-[#ccff00]/40 font-black shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                          : 'hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title="Klik untuk Mengurutkan berdasarkan Skor Growth"
                    >
                      <span>GROWTH</span>
                      {sortBy === 'growth' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider text-center">
                    <button
                      onClick={() => handleSort('value')}
                      className={`inline-flex items-center justify-center gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
                        sortBy === 'value' 
                          ? 'text-[#ccff00] bg-[#ccff00]/15 border border-[#ccff00]/40 font-black shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                          : 'hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title="Klik untuk Mengurutkan berdasarkan Skor Value"
                    >
                      <span>VALUE</span>
                      {sortBy === 'value' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider text-center">
                    <button
                      onClick={() => handleSort('moment')}
                      className={`inline-flex items-center justify-center gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
                        sortBy === 'moment' 
                          ? 'text-[#ccff00] bg-[#ccff00]/15 border border-[#ccff00]/40 font-black shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                          : 'hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title="Klik untuk Mengurutkan berdasarkan Skor Moment"
                    >
                      <span>MOMENT</span>
                      {sortBy === 'moment' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-3 font-bold text-[10px] uppercase tracking-wider text-center">
                    <button
                      onClick={() => handleSort('dividen')}
                      className={`inline-flex items-center justify-center gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
                        sortBy === 'dividen' 
                          ? 'text-[#ccff00] bg-[#ccff00]/15 border border-[#ccff00]/40 font-black shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                          : 'hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title="Klik untuk Mengurutkan berdasarkan Skor Dividen"
                    >
                      <span>DIVIDEN</span>
                      {sortBy === 'dividen' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-4 font-bold text-[10px] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('sector')}
                      className={`inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-1 ${
                        sortBy === 'sector' ? 'text-[#ccff00] font-extrabold' : ''
                      }`}
                      title="Klik untuk mengurutkan berdasarkan Sektor"
                    >
                      <span>Rotasi Sektor</span>
                      {sortBy === 'sector' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>

                  <th className="py-3 px-4 font-bold text-[10px] uppercase tracking-wider text-right pr-6">
                    <button
                      onClick={() => handleSort('totalScore')}
                      className={`inline-flex items-center justify-end gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-lg ${
                        sortBy === 'totalScore' 
                          ? 'text-[#ccff00] bg-[#ccff00]/15 border border-[#ccff00]/40 font-black shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                          : 'hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title="Klik untuk Mengurutkan berdasarkan Total Score"
                    >
                      <span>TOTAL SCORE</span>
                      {sortBy === 'totalScore' ? (
                        sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#ccff00]" /> : <ArrowDown className="w-3 h-3 text-[#ccff00]" />
                      ) : (
                        <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926]/70">
                {paginatedStocks.map((stock, i) => {
                  const globalRank = stock.globalRank;
                  const isDeltaPos = stock.delta >= 0;

                  return (
                    <tr 
                      key={stock.symbol}
                      onClick={() => handleStockClick(stock.symbol)}
                      className="hover:bg-[#111018]/65 transition-colors duration-150 cursor-pointer group"
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-4 text-center font-mono font-extrabold text-[#686477]">
                        #{globalRank}
                      </td>

                      {/* Emiten Saham Logo & Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <TickerLogo symbol={stock.symbol} sizeClassName="w-8 h-8" className="!rounded-xl border border-[#1b1926] group-hover:border-[#ccff00]/40 transition-colors" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-sm text-white">{stock.symbol}</span>
                              <span className="text-[9px] text-[#686477] font-extrabold font-sans uppercase">
                                ({stock.index} • {stock.board})
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-[#9f9bac] truncate max-w-[140px] font-sans font-medium">{stock.name}</span>
                              {/* Delta score badge */}
                              <span className={`text-[8px] font-mono font-extrabold px-1 rounded ${isDeltaPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                                {isDeltaPos ? '+' : ''}{stock.delta}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Metrics columns */}
                      <td className={`py-4 px-4 text-center font-mono font-bold transition-colors ${sortBy === 'quality' ? 'bg-[#ccff00]/5 text-[#ccff00] font-black' : 'text-[#9f9bac] group-hover:text-white'}`}>
                        <div className="flex flex-col items-center">
                          <span>{stock.quality.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className={`py-4 px-4 text-center font-mono font-bold transition-colors ${sortBy === 'growth' ? 'bg-[#ccff00]/5 text-[#ccff00] font-black' : 'text-[#9f9bac] group-hover:text-white'}`}>
                        <div className="flex flex-col items-center">
                          <span>{stock.growth.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className={`py-4 px-4 text-center font-mono font-bold transition-colors ${sortBy === 'value' ? 'bg-[#ccff00]/5 text-[#ccff00] font-black' : 'text-[#9f9bac] group-hover:text-white'}`}>
                        <div className="flex flex-col items-center">
                          <span>{stock.value.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className={`py-4 px-4 text-center font-mono font-bold transition-colors ${sortBy === 'moment' ? 'bg-[#ccff00]/5 text-[#ccff00] font-black' : 'text-[#9f9bac] group-hover:text-white'}`}>
                        <div className="flex flex-col items-center">
                          <span>{stock.moment.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className={`py-4 px-4 text-center font-mono font-bold transition-colors ${sortBy === 'dividen' ? 'bg-[#ccff00]/5 text-[#ccff00] font-black' : 'text-[#9f9bac] group-hover:text-white'}`}>
                        {stock.dividen > 0 ? (
                          <div className="flex flex-col items-center">
                            <span>{stock.dividen.toFixed(1)}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Sector & Rotation badge */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#9f9bac] font-sans font-semibold mb-1 truncate max-w-[120px]">{stock.sector}</span>
                          {getRotationBadge(stock.rotation, stock.rotationT, stock.rotationB)}
                        </div>
                      </td>

                      {/* Total Score Column */}
                      <td className="py-4 px-4 text-right pr-6">
                        <span className="text-sm font-extrabold text-[#ccff00] font-sans tracking-tight">
                          {stock.totalScore.toFixed(1)}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        ) : (
          /* Grid of beautiful Cards */
          <motion.div
            key="cards-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {paginatedStocks.map((stock, i) => {
              const globalRank = stock.globalRank;
              const isDeltaPos = stock.delta >= 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock.symbol)}
                  className="card card-elevated bg-[#0b0a10]/45 p-5 flex flex-col justify-between space-y-4 hover:border-[#ccff00]/30 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <TickerLogo symbol={stock.symbol} sizeClassName="w-10 h-10" className="!rounded-xl border border-[#1b1926]" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-base text-white">{stock.symbol}</span>
                          <span className="text-[8px] font-mono font-extrabold px-1 py-0.2 rounded text-emerald-400 bg-emerald-500/10">
                            {stock.index}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#686477] font-mono font-bold tracking-tight uppercase leading-none mt-1">
                          {stock.board}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-xs font-extrabold text-[#686477] font-mono" title="Rank (Berdasarkan Total Score)">#{globalRank}</span>
                      <span className={`text-[9px] font-mono font-extrabold mt-1 px-1.5 py-0.5 rounded ${isDeltaPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {isDeltaPos ? '▲ +' : '▼ '}{stock.delta}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#9f9bac] leading-tight font-sans font-medium line-clamp-1">
                    {stock.name}
                  </p>

                  <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-[#1b1926]">
                    {[
                      { id: 'quality', l: 'QLTY', v: stock.quality },
                      { id: 'growth', l: 'GRW', v: stock.growth },
                      { id: 'value', l: 'VAL', v: stock.value },
                      { id: 'moment', l: 'MOM', v: stock.moment },
                      { id: 'dividen', l: 'DIV', v: stock.dividen }
                    ].map(stat => {
                      const isActive = sortBy === stat.id;
                      return (
                        <button
                          key={stat.l}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSort(stat.id);
                          }}
                          className={`text-center flex flex-col items-center py-1 px-0.5 rounded-lg transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#ccff00]/15 border border-[#ccff00]/40 shadow-[0_0_8px_rgba(204,255,0,0.15)]' 
                              : 'hover:bg-white/5 border border-transparent'
                          }`}
                          title={`Klik untuk mengurutkan berdasarkan ${stat.l}`}
                        >
                          <span className={`text-[8px] font-bold font-mono block mb-0.5 ${isActive ? 'text-[#ccff00]' : 'text-[#686477]'}`}>{stat.l}</span>
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#ccff00] font-black' : 'text-white'}`}>{stat.v > 0 ? stat.v.toFixed(0) : '-'}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1b1926]/70">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#686477] font-mono uppercase font-semibold">ROTASI</span>
                      <span className="text-[10px] font-extrabold text-[#00f0ff] font-sans mt-0.5">{stock.rotation}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#686477] font-mono uppercase font-semibold">TOTAL SCORE</span>
                      <div className="text-base font-extrabold text-[#ccff00] font-sans mt-0.5">
                        {stock.totalScore.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#0b0a10]/20 p-4 border border-[#1b1926] rounded-xl font-mono text-xs">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 border border-[#1b1926] text-[#9f9bac] hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            SEBELUMNYA
          </button>
          
          <span className="text-[#686477] font-semibold">
            HALAMAN <span className="text-white font-extrabold">{currentPage}</span> DARI <span className="text-white font-extrabold">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 border border-[#1b1926] text-[#9f9bac] hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            BERIKUTNYA
          </button>
        </div>
      )}

    </div>
  );
};
