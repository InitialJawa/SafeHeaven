import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../stores';
import { LiveTicker } from '../components/LiveTicker';
import { SignalBadge } from '../components/SignalBadge';
import { TickerLogo } from '../components/TickerLogo';
import { PhysicalWallet } from '../components/PhysicalWallet';
import { AssetTreemap } from '../components/AssetTreemap';
import { PortfolioGrowthChart } from '../components/PortfolioGrowthChart';
import { PortfolioSummaryWidget } from '../components/PortfolioSummaryWidget';
import { 
  Wallet, 
  LineChart, 
  ShieldAlert, 
  AlertTriangle,
  Award, 
  ArrowUpRight, 
  Check, 
  Eye, 
  Send, 
  RefreshCw, 
  Plus, 
  Sliders, 
  TrendingUp, 
  Landmark,
  Shield,
  CheckCircle,
  Bell,
  Activity,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
  Gauge,
  LayoutList,
  ChevronRight,
  Filter,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

import { WidgetConfigModal, WidgetId, DEFAULT_ORDER } from '../components/WidgetConfigModal';
import { Skeleton } from '../components/Skeleton';
import { 
  WidgetKinerja, 
  WidgetMusiman, 
  WidgetGauges,
  WidgetWatchlistDetail 
} from '../components/TickerAnalysisWidgets';

export const Dashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    tickers, 
    portfolioConfig, 
    tier, 
    stockPicks, 
    alerts, 
    fetchInitialData,
    isLoadingData,
    marketRegime
  } = useAppStore();

  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [activeCurrency, setActiveCurrency] = useState<'IDR' | 'USD' | 'EUR'>('IDR');
  const [rebalancing, setRebalancing] = useState(false);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [ihsgViewTab, setIhsgViewTab] = useState<'speedometer' | 'performance' | 'all'>('all');

  const isEmasRegime = marketRegime === 'bear';
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() => {
    const saved = localStorage.getItem('dashboard_widget_order_v2');
    let order = DEFAULT_ORDER;
    if (saved) {
      try {
        let parsed: WidgetId[] = JSON.parse(saved);
        // Ensure watchlist_detail is removed if it came from old defaults
        parsed = parsed.filter(id => id !== 'watchlist_detail');
        const missing = DEFAULT_ORDER.filter(id => !parsed.includes(id));
        order = missing.length > 0 ? [...parsed, ...missing] : parsed;
      } catch {
        order = DEFAULT_ORDER;
      }
    } else {
      order = DEFAULT_ORDER.filter(id => id !== 'watchlist_detail');
    }
    // Ensure rotation is placed immediately after wallet so it sits next to Kartu Manajemen Dana (lg:col-span-4 beside lg:col-span-8)
    const walletIdx = order.indexOf('wallet');
    const rotationIdx = order.indexOf('rotation');
    if (walletIdx !== -1 && rotationIdx !== -1 && rotationIdx !== walletIdx + 1) {
      const filtered: WidgetId[] = order.filter(id => id !== 'rotation');
      const wIdx = filtered.indexOf('wallet');
      filtered.splice(wIdx + 1, 0, 'rotation');
      order = filtered;
    }
    localStorage.setItem('dashboard_widget_order_v2', JSON.stringify(order));
    return order;
  });

  const handleSaveWidgetOrder = (newOrder: WidgetId[]) => {
    const filteredOrder = newOrder.filter(id => id !== 'watchlist_detail');
    setWidgetOrder(filteredOrder);
    localStorage.setItem('dashboard_widget_order_v2', JSON.stringify(filteredOrder));
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGrowth = async () => {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/portfolio/growth?capital=${portfolioConfig?.capital || 500000000}`);
        if (res.ok) {
            const json = await res.json();
            setGrowthData(json);
        }
    };
    if (portfolioConfig?.capital) {
        fetchGrowth();
    }
  }, [portfolioConfig?.capital, portfolioConfig?.strategyTemplate, portfolioConfig?.universe]);

  useEffect(() => {
    setActiveAlertsCount(alerts.filter(a => a.status === 'unread').length);
  }, [alerts]);

  const markAsRead = (id: string) => {
    useAppStore.setState((state) => ({
      alerts: state.alerts.map((a) => a.id === id ? { ...a, status: 'read' as const } : a)
    }));
    toast.success('Notifikasi ditandai sebagai dibaca.');
  };

  const handleQuickRebalance = async () => {
    setRebalancing(true);
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/admin/trigger-rebalance`, { method: 'POST' });
      if (res.ok) {
        toast.success('Portofolio berhasil direbalancing ke alokasi optimal!');
        await fetchInitialData();
      } else {
        toast.error('Gagal melakukan rebalancing.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal terhubung ke server.');
    } finally {
      setRebalancing(false);
    }
  };

  const capital = portfolioConfig?.capital || 500000000;

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Live ticker tape across the top */}
      <LiveTicker />

      <div className="px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Header Title with premium design */}
        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 sm:h-6 bg-[#ccff00] rounded-full animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans">Market Cockpit</h1>
            </div>
            <p className="text-[11px] sm:text-xs text-[#9f9bac] mt-0.5 sm:mt-1 font-sans">Pusat komando finansial dan intelijen kuantitatif cerdas Anda.</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="text-xs text-[#686477] font-mono bg-[#111018] border border-[#1b1926] px-3.5 py-1.5 rounded-xl hidden md:block">
              Hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <button
              onClick={() => setIsWidgetModalOpen(true)}
              title="Tambah Widget"
              className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#ccff00] hover:bg-[#ddff33] text-black text-[10px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(204,255,0,0.15)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Widget</span>
            </button>
            <button
              onClick={() => setIsWidgetModalOpen(true)}
              title="Susun Widget"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#1b1926] hover:bg-[#252233] border border-[#2a273b] text-[#9f9bac] hover:text-white text-[10px] sm:text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Susun</span>
            </button>
          </div>
        </div>



        {/* Active Market Stress / Simulator Banner */}
        {portfolioConfig?.activeStressScenario && (
          <div className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-[#ff3366]/5 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ff3366] shrink-0 animate-bounce" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#ff3366] uppercase font-mono tracking-wider">
                    SIMULASI STRESS TEST AKTIF
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#ff3366]/20 text-[#ff3366] font-mono">
                    {portfolioConfig.stressImpactPct !== undefined && portfolioConfig.stressImpactPct !== 0 ? `${portfolioConfig.stressImpactPct}% Impact` : 'Asset Drift'}
                  </span>
                </div>
                <p className="text-xs text-white font-bold font-sans mt-0.5">
                  {portfolioConfig.activeStressScenario}
                </p>
              </div>
            </div>

            <button
              onClick={handleQuickRebalance}
              disabled={rebalancing}
              className="px-4 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 shadow-md shadow-[#ccff00]/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rebalancing ? 'animate-spin' : ''}`} />
              {rebalancing ? 'Merebalancing...' : 'Eksekusi Rebalance'}
            </button>
          </div>
        )}

        {/* WIDGET GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-col lg:grid animate-in fade-in duration-200">
          {isLoadingData ? (
            <>
              <Skeleton className="lg:col-span-8 h-[380px] rounded-3xl" />
              <Skeleton className="lg:col-span-4 h-[380px] rounded-3xl" />
              <Skeleton className="lg:col-span-8 h-[420px] rounded-3xl" />
              <Skeleton className="lg:col-span-4 h-[420px] rounded-3xl" />
            </>
          ) : (
            <>
              {/* Portfolio Summary */}
              {widgetOrder.includes('summary') && (
                <div style={{ order: widgetOrder.indexOf('summary') }} className="lg:col-span-12">
                  <PortfolioSummaryWidget />
                </div>
              )}

              {/* Wallet & Quick Actions */}
              {widgetOrder.includes('wallet') && (
                <div style={{ order: widgetOrder.indexOf('wallet') }} className="card card-elevated p-3.5 sm:p-5 lg:p-6 lg:col-span-8 flex flex-col justify-between bg-[#0b0a10]/45 border border-[#1b1926] space-y-3 sm:space-y-4">
                  <div className="flex flex-row justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-[#9f9bac] tracking-wider font-sans">Kartu Manajemen Dana & Quick Actions</h4>
                      <p className="text-[10px] text-[#686477] mt-0.5">Akses saldo aktif, transfer cepat, dan kontrol kokpit portofolio utama.</p>
                    </div>
                    <div className="pt-1 text-[9px] text-[#686477] flex items-center gap-2">
                       <span className="font-mono">Pusat Pintar</span>
                       <span className="font-mono text-[#ccff00]">Autopilot ON</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-center my-auto">
                    <div className="select-none flex justify-center md:col-span-7 lg:col-span-8">
                      <PhysicalWallet 
                        capital={capital}
                        strategyName={portfolioConfig?.strategyName || 'IMAM NASRULLOH'}
                        onTopUp={() => {
                          toast.success('Pintu Deposit Instan siap di Settings Workbench.');
                          setLocation('/settings');
                        }}
                        onTransfer={() => {
                          toast.info('Modul Transfer diaktifkan. Pilih instrumen bursa tujuan.');
                          setLocation('/portfolio');
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 md:col-span-5 lg:col-span-4 w-full">
                      <button
                        id="action-quick-screener"
                        onClick={() => {
                          toast.success('Modul Screener AI & Saring Saham dibuka.');
                          setLocation('/universe');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all cursor-pointer group w-full"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center shrink-0">
                            <Filter className="w-4 h-4 text-[#ccff00] group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="text-xs font-bold text-white block truncate">Screener AI</span>
                            <span className="text-[10px] text-[#686477] block truncate">Saring Saham</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#686477] group-hover:text-[#ccff00] group-hover:translate-x-0.5 transition-all shrink-0 ml-1 hidden sm:block" />
                      </button>

                      <button
                        id="action-quick-backtest"
                        onClick={() => {
                          toast.success('Modul Backtest Strategy dibuka.');
                          setLocation('/backtest');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all cursor-pointer group w-full"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center shrink-0">
                            <LineChart className="w-4 h-4 text-[#00f0ff] group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="text-xs font-bold text-white block truncate">Backtest Strategy</span>
                            <span className="text-[10px] text-[#686477] block truncate">Simulasi historis & alpha</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#686477] group-hover:text-[#ccff00] group-hover:translate-x-0.5 transition-all shrink-0 ml-1 hidden sm:block" />
                      </button>

                      <button
                        id="action-card-alerts"
                        onClick={() => {
                          setLocation('/alerts');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all cursor-pointer group w-full"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                            <Bell className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="text-xs font-bold text-white block truncate">Alerts</span>
                            <span className="text-[10px] text-[#686477] block truncate">Sinyal & notifikasi</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#686477] group-hover:text-[#ccff00] group-hover:translate-x-0.5 transition-all shrink-0 ml-1 hidden sm:block" />
                      </button>

                      <button
                        id="action-card-compare"
                        onClick={() => setLocation('/compare')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all cursor-pointer group w-full"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                            <Sliders className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="text-xs font-bold text-white block truncate">Bandingkan</span>
                            <span className="text-[10px] text-[#686477] block truncate">Komparasi kinerja</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#686477] group-hover:text-[#ccff00] group-hover:translate-x-0.5 transition-all shrink-0 ml-1 hidden sm:block" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Historic Capital Performance Chart */}
              {widgetOrder.includes('performance') && (
                <div style={{ order: widgetOrder.indexOf('performance') }} className="card card-elevated p-3.5 sm:p-5 lg:p-6 lg:col-span-8 flex flex-col h-full">
                  <PortfolioGrowthChart initialCapital={capital} />
                </div>
              )}

              {/* Allocation Treemap Chart */}
              {widgetOrder.includes('treemap') && (
                <AssetTreemap style={{ order: widgetOrder.indexOf('treemap') }} capital={capital} />
              )}

              {/* Multi-Tier Rotation */}
              {widgetOrder.includes('rotation') && (
                <div style={{ order: widgetOrder.indexOf('rotation') }} className="card card-elevated p-3.5 sm:p-5 lg:p-6 lg:col-span-4 flex flex-col justify-between space-y-3 sm:space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-[#00f0ff]" />
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Multi-Tier Rotation System</h4>
                      </div>
                      <p className="text-[10px] text-[#686477] mt-0.5">Rotasi aset dinamis & jaring pengaman risiko.</p>
                    </div>
                    <button
                      onClick={() => setLocation('/optimize')}
                      className="text-[10px] font-extrabold text-[#ccff00] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Walk Forward <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 my-auto">
                    {/* Item 1: Saham */}
                    {isEmasRegime ? (
                      <div className="p-3 rounded-xl bg-[#111018]/80 border border-[#1bfb7c]/20 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-2.5">
                           <div className="w-7 h-7 rounded-lg bg-[#1bfb7c]/10 flex items-center justify-center text-[#1bfb7c]">
                              <LineChart className="w-3.5 h-3.5" />
                           </div>
                           <div>
                             <p className="text-[10px] text-[#1bfb7c] uppercase font-extrabold leading-none">Saham</p>
                             <p className="text-xs font-bold text-white mt-1">Fase Koreksi</p>
                           </div>
                        </div>
                        <span className="text-[9px] font-bold text-[#1bfb7c] bg-[#1bfb7c]/10 px-2 py-0.5 rounded">AVOID</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#1bfb7c]/10 border border-[#1bfb7c]/30 shadow-[0_0_15px_rgba(27,251,124,0.15)] flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-center gap-2.5 relative z-10">
                           <div className="w-7 h-7 rounded-lg bg-[#1bfb7c]/20 flex items-center justify-center text-[#1bfb7c]">
                              <LineChart className="w-3.5 h-3.5" />
                           </div>
                           <div>
                             <p className="text-[10px] text-[#1bfb7c] uppercase font-extrabold leading-none">Saham</p>
                             <p className="text-xs font-bold text-white mt-1">Uptrend Kuat (Bullish)</p>
                           </div>
                        </div>
                        <span className="text-[9px] font-bold text-black bg-[#1bfb7c] px-2 py-0.5 rounded">REKOMENDASI</span>
                      </div>
                    )}

                    {/* Item 2: Emas */}
                    {isEmasRegime ? (
                      <div className="p-3 rounded-xl bg-[#ffbe3b]/10 border border-[#ffbe3b]/30 shadow-[0_0_15px_rgba(255,190,59,0.15)] flex items-center justify-between relative overflow-hidden">
                        <div className="flex items-center gap-2.5 relative z-10">
                           <div className="w-7 h-7 rounded-lg bg-[#ffbe3b]/20 flex items-center justify-center text-[#ffbe3b]">
                              <Award className="w-3.5 h-3.5" />
                           </div>
                           <div>
                             <p className="text-[10px] text-[#ffbe3b] uppercase font-extrabold leading-none">Emas</p>
                             <p className="text-xs font-bold text-white mt-1">Uptrend Kuat</p>
                           </div>
                        </div>
                        <span className="text-[9px] font-bold text-black bg-[#ffbe3b] px-2 py-0.5 rounded">REKOMENDASI</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#111018]/80 border border-[#ffbe3b]/20 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-2.5">
                           <div className="w-7 h-7 rounded-lg bg-[#ffbe3b]/10 flex items-center justify-center text-[#ffbe3b]">
                              <Award className="w-3.5 h-3.5" />
                           </div>
                           <div>
                             <p className="text-[10px] text-[#ffbe3b] uppercase font-extrabold leading-none">Emas</p>
                             <p className="text-xs font-bold text-white mt-1">Konsolidasi</p>
                           </div>
                        </div>
                        <span className="text-[9px] font-bold text-[#ffbe3b] bg-[#ffbe3b]/10 px-2 py-0.5 rounded">HOLD</span>
                      </div>
                    )}

                    {/* Item 3: Cash USD & IDR */}
                    <div className="p-3 rounded-xl bg-[#111018]/80 border border-[#9d1df2]/30 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#9d1df2]/10 flex items-center justify-center text-[#9d1df2]">
                          <Landmark className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#9d1df2] uppercase font-bold">Likuiditas Cash</p>
                          <p className="text-xs font-bold text-white mt-0.5">IDR & USD Buffer</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-2 py-0.5 rounded">NEUTRAL</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1b1926] flex items-center justify-between text-[9px] text-[#686477]">
                    <span>Alokasi otomatis mengikuti makro</span>
                    <span className="text-[#ccff00] font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setLocation('/settings')}><CheckCircle className="w-3 h-3"/> Active Strategy</span>
                  </div>
                </div>
              )}

              {/* Sinyal Pilihan Teratas (Top Picks) */}
              {widgetOrder.includes('picks') && (
                <div style={{ order: widgetOrder.indexOf('picks') }} className="card card-elevated p-6 flex flex-col lg:col-span-12">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight font-sans">Sinyal Pilihan Teratas (Top Picks / Ledger)</h3>
                      <p className="text-[11px] text-[#686477] font-sans">Saringan rebalancing bursa instan SafeHeaven berdasarkan skor kuantitatif tertinggi.</p>
                    </div>
                    <button 
                      id="view-all-picks-btn"
                      onClick={() => setLocation('/portfolio')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Semua Ticker <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#1b1926] text-[#686477]">
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px]">Instrumen</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px]">Perusahaan</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px] text-center">Skor Kuantitasi</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px]">Sinyal SafeHeaven</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px] text-right">Rencana Taktis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b1926]">
                        {stockPicks.slice(0, 5).map((pick) => (
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
                              className="py-3.5 text-[#9f9bac] font-medium max-w-[180px] truncate cursor-pointer hover:text-white transition-colors"
                              onClick={() => setLocation(`/ticker/${pick.symbol}`)}
                            >
                              {pick.name}
                            </td>
                            <td className="py-3.5 text-center font-extrabold font-mono text-white text-sm">{typeof pick.score === 'number' ? pick.score.toFixed(1) : pick.score}</td>
                            <td className="py-3.5"><SignalBadge signal={pick.signal} /></td>
                            <td className="py-3.5 text-right">
                              <button
                                id={`action-view-${pick.symbol}`}
                                onClick={() => setLocation(`/ticker/${pick.symbol}`)}
                                className="px-3 py-1.5 text-[10px] bg-[#111018] hover:bg-[#ccff00] border border-[#1b1926] hover:border-transparent rounded-xl text-[#9f9bac] hover:text-black font-bold transition-all cursor-pointer flex items-center gap-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5" /> Analisis AI
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Alert Notification Ledger */}
              {widgetOrder.includes('alerts') && (
                <div style={{ order: widgetOrder.indexOf('alerts') }} className="card card-elevated p-6 lg:col-span-12">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4.5 h-4.5 text-[#ccff00]" />
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight font-sans">Riwayat Rotasi & Sinyal Alarm</h3>
                        <p className="text-[11px] text-[#686477] font-sans">Log pergerakan rotasi dinamis, alarm harga, dan aksi jaring pengaman.</p>
                      </div>
                    </div>
                    {alerts.filter(a => a.status === 'unread').length > 0 && (
                      <button
                        id="dashboard-mark-all-btn"
                        onClick={() => {
                          useAppStore.setState((state) => ({
                            alerts: state.alerts.map((a) => ({ ...a, status: 'read' as const }))
                          }));
                          toast.success('Semua pemberitahuan ditandai dibaca.');
                        }}
                        className="text-[10px] text-[#ccff00] hover:text-[#ddff33] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Tandai semua dibaca <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#1b1926] text-[#686477]">
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px]">Sinyal Live</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px]">Kategori</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px]">Pesan Taktis</th>
                          <th className="pb-3.5 font-bold uppercase tracking-wider text-[9px] text-right">Status Sesi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b1926]">
                        {alerts.slice(0, 5).map((alert) => (
                          <tr key={alert.id} className={`hover:bg-white/[0.01] transition-colors ${alert.status === 'unread' ? 'bg-[#ccff00]/[0.02]' : ''}`}>
                            <td className="py-3.5 font-mono text-[#9f9bac] text-[11px]">
                              {new Date(alert.time).toLocaleTimeString('id-ID')}
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                                alert.type === 'Score' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/25' :
                                alert.type === 'Price' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                                'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                              }`}>
                                {alert.type}
                              </span>
                            </td>
                            <td className="py-3.5 text-white max-w-sm truncate">{alert.message}</td>
                            <td className="py-3.5 text-right">
                              {alert.status === 'unread' ? (
                                <button
                                  id={`dashboard-read-btn-${alert.id}`}
                                  onClick={() => markAsRead(alert.id)}
                                  className="px-3 py-1.5 text-[10px] bg-[#ccff00]/10 hover:bg-[#ccff00] text-[#ccff00] hover:text-black border border-[#ccff00]/25 hover:border-transparent font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  Selesai Dibaca
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#686477] font-mono flex items-center justify-end gap-1 font-bold">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#00f5a0]" /> Terverifikasi
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RSI Indicator Widget */}
              {widgetOrder.includes('rsi') && (
                <div style={{ order: widgetOrder.indexOf('rsi') }} className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">RSI Indicator</h4>
                      </div>
                      <p className="text-[10px] text-[#686477] mt-1">Relative Strength Index (14 Hari)</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 my-auto">
                    <div className="flex justify-center items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#1b1926" strokeWidth="10" fill="none" />
                          <circle cx="50" cy="50" r="40" stroke="url(#rsiGradient)" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset="100.48" className="transition-all duration-1000 ease-out" />
                          <defs>
                            <linearGradient id="rsiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#00f0ff" />
                              <stop offset="100%" stopColor="#9d1df2" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">60</span>
                          <span className="text-[9px] font-bold text-[#686477] uppercase">Netral</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-[#111018] border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] block mb-1">Overbought</span>
                        <span className="text-xs font-bold text-rose-400">&gt; 70</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#111018] border border-[#1b1926]">
                        <span className="text-[10px] text-[#686477] block mb-1">Oversold</span>
                        <span className="text-xs font-bold text-[#00f0ff]">&lt; 30</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sector Weighting Widget */}
              {widgetOrder.includes('sector') && (
                <div style={{ order: widgetOrder.indexOf('sector') }} className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Sector Weighting</h4>
                      </div>
                      <p className="text-[10px] text-[#686477] mt-1">Distribusi Sektor Portofolio</p>
                    </div>
                  </div>
                  <div className="space-y-4 my-auto">
                    <div className="space-y-3">
                      {[
                        { name: 'Financials', weight: 45, color: 'bg-sky-400' },
                        { name: 'Consumer Goods', weight: 25, color: 'bg-[#ccff00]' },
                        { name: 'Infrastructure', weight: 20, color: 'bg-amber-400' },
                        { name: 'Technology', weight: 10, color: 'bg-purple-400' },
                      ].map((sector) => (
                        <div key={sector.name} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-[#e1e1e1]">{sector.name}</span>
                            <span className="text-white">{sector.weight}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#111018] rounded-full overflow-hidden">
                            <div className={`h-full ${sector.color} rounded-full`} style={{ width: `${sector.weight}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#1b1926] flex items-center justify-between text-[9px] text-[#686477]">
                    <span>Dikalibrasi ulang 2 jam lalu</span>
                  </div>
                </div>
              )}

              {/* MACD Momentum Tracker Widget */}
              {widgetOrder.includes('macd') && (
                <div style={{ order: widgetOrder.indexOf('macd') }} className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#ccff00]" />
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">MACD Momentum</h4>
                      </div>
                      <p className="text-[10px] text-[#686477] mt-1">Konvergensi & Divergensi (12, 26, 9)</p>
                    </div>
                    <span className="text-[9px] font-extrabold text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded font-mono">BULLISH CROSS</span>
                  </div>
                  <div className="space-y-3 my-auto">
                    <div className="p-3 rounded-xl bg-[#111018] border border-[#1b1926] space-y-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#9f9bac]">MACD Line:</span>
                        <span className="text-[#ccff00] font-mono">+1.42</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#9f9bac]">Signal Line:</span>
                        <span className="text-sky-400 font-mono">+0.85</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#9f9bac]">Histogram:</span>
                        <span className="text-[#1bfb7c] font-mono">+0.57</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#111018] rounded-full overflow-hidden flex">
                      <div className="h-full bg-rose-500 w-1/3"></div>
                      <div className="h-full bg-[#ccff00] w-2/3"></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#1b1926] flex items-center justify-between text-[9px] text-[#686477]">
                    <span>Momentum Tren Naik</span>
                    <span className="text-[#ccff00] font-bold font-mono">+2.4% Est. Vol</span>
                  </div>
                </div>
              )}

              {/* Volatility Index Widget */}
              {widgetOrder.includes('volatility') && (
                <div style={{ order: widgetOrder.indexOf('volatility') }} className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Market Volatility</h4>
                      </div>
                      <p className="text-[10px] text-[#686477] mt-1">Indeks Risiko & Volatilitas (VIX Equiv.)</p>
                    </div>
                    <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded font-mono">RENDAH - TERKONTROL</span>
                  </div>
                  <div className="space-y-3 my-auto">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#111018] border border-[#1b1926]">
                      <div>
                        <span className="text-[10px] text-[#686477] uppercase font-bold block">Skor Volatilitas</span>
                        <span className="text-2xl font-extrabold text-white font-mono">14.8 <span className="text-xs font-normal text-[#686477]">/ 100</span></span>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-[#1bfb7c]/10 text-[#1bfb7c] text-xs font-bold font-mono">
                        -1.2 pts
                      </div>
                    </div>
                    <p className="text-[10px] text-[#9f9bac] leading-relaxed">
                      Pasar berada dalam kondisi stabil. Jaring pengaman otomatis beroperasi dengan batas slippage minimal.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1b1926] flex items-center justify-between text-[9px] text-[#686477]">
                    <span>Risk Management Engine</span>
                    <span className="text-cyan-400 font-bold">Optimal</span>
                  </div>
                </div>
              )}

              {/* Watchlist & Key Stats Widget */}
              {widgetOrder.includes('watchlist_detail') && (
                <div style={{ order: widgetOrder.indexOf('watchlist_detail') }} className="lg:col-span-4">
                  <WidgetWatchlistDetail defaultSymbol="IHSG" />
                </div>
              )}

              {/* IHSG Custom Market Cockpit Widget */}
              {widgetOrder.includes('ihsg_analysis') && (
                <div style={{ order: widgetOrder.indexOf('ihsg_analysis') }} className="lg:col-span-12 space-y-4 bg-[#0b0a10]/60 border border-[#1b1926] p-5 rounded-2xl shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b1926] pb-3 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-[#ccff00] rounded-full"></span>
                        <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Analisis IHSG Terpadu (Yahoo Finance Live)</h4>
                      </div>
                      <p className="text-[11px] text-[#9f9bac] mt-0.5">Umpan real-time & indikator konsensus bursa (^JKSE)</p>
                    </div>

                    {/* View Switcher Tabs */}
                    <div className="bg-[#111018] p-1 rounded-xl border border-[#1b1926] flex items-center gap-1 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setIhsgViewTab('speedometer')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          ihsgViewTab === 'speedometer'
                            ? 'bg-[#ccff00] text-black font-extrabold shadow-sm'
                            : 'text-[#9f9bac] hover:text-white'
                        }`}
                      >
                        <Gauge className="w-3.5 h-3.5" />
                        <span>Speedometer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIhsgViewTab('performance')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          ihsgViewTab === 'performance'
                            ? 'bg-[#ccff00] text-black font-extrabold shadow-sm'
                            : 'text-[#9f9bac] hover:text-white'
                        }`}
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Kinerja & Musiman</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIhsgViewTab('all')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          ihsgViewTab === 'all'
                            ? 'bg-[#ccff00] text-black font-extrabold shadow-sm'
                            : 'text-[#9f9bac] hover:text-white'
                        }`}
                      >
                        <LayoutList className="w-3.5 h-3.5" />
                        <span>Semua</span>
                      </button>
                    </div>
                  </div>
                  
                  {(ihsgViewTab === 'speedometer' || ihsgViewTab === 'all') && (
                    <WidgetGauges symbol="IHSG" />
                  )}
                  
                  {(ihsgViewTab === 'performance' || ihsgViewTab === 'all') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <WidgetKinerja symbol="IHSG" />
                      <WidgetMusiman symbol="IHSG" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <WidgetConfigModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          currentOrder={widgetOrder}
          onSave={handleSaveWidgetOrder}
        />
      </div>
    </div>
  );
};

