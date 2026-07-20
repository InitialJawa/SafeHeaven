import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../stores';
import { LiveTicker } from '../components/LiveTicker';
import { SignalBadge } from '../components/SignalBadge';
import { TickerLogo } from '../components/TickerLogo';
import { PhysicalWallet } from '../components/PhysicalWallet';
import { AnimatedTierCard } from '../components/AnimatedTierCard';
import { AssetTreemap } from '../components/AssetTreemap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { 
  Wallet, 
  LineChart, 
  ShieldAlert, 
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
  CheckCircle,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    tickers, 
    portfolioConfig, 
    tier, 
    stockPicks, 
    alerts, 
    fetchInitialData 
  } = useAppStore();

  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [activeCurrency, setActiveCurrency] = useState<'IDR' | 'USD' | 'EUR'>('IDR');
  const [rebalancing, setRebalancing] = useState(false);
  const [growthData, setGrowthData] = useState<any[]>([]);

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
  }, [portfolioConfig?.capital]);

  useEffect(() => {
    setActiveAlertsCount(alerts.filter(a => a.status === 'unread').length);
  }, [alerts]);

  const markAsRead = (id: string) => {
    useAppStore.setState((state) => ({
      alerts: state.alerts.map((a) => a.id === id ? { ...a, status: 'read' as const } : a)
    }));
    toast.success('Notifikasi ditandai sebagai dibaca.');
  };

  const handleQuickRebalance = () => {
    setRebalancing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Mengalkulasi deviasi bobot portofolio...',
        success: () => {
          setRebalancing(false);
          return 'Portofolio berhasil direbalancing ke alokasi optimal!';
        },
        error: 'Gagal melakukan rebalancing.'
      }
    );
  };

  // Portfolio allocation donut chart
  const pieData = [
    { name: 'Saham', value: portfolioConfig?.allocationSaham || 60, color: '#ccff00' },
    { name: 'Emas', value: portfolioConfig?.allocationEmas || 20, color: '#00f0ff' },
    { name: 'Cash IDR', value: portfolioConfig?.allocationCash || 10, color: '#a855f7' },
    { name: 'USD Cash', value: portfolioConfig?.allocationUSD || 10, color: '#6366f1' }
  ];

  // Capital performance chart data (historic balance simulation)
  const capital = portfolioConfig?.capital || 500000000;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // Tier Badge styling
  const getTierBadge = (t: string) => {
    switch (t) {
      case 'Platinum':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">Platinum VIP</span>;
      case 'Emas':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">Emas Premium</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 border border-slate-500/30 text-slate-300">Regular Tier</span>;
    }
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Live ticker tape across the top */}
      <LiveTicker />

      <div className="px-6 space-y-6">
        {/* Header Title with premium design */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ccff00] rounded-full animate-pulse"></span>
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Market Cockpit</h1>
            </div>
            <p className="text-xs text-[#9f9bac] mt-1 font-sans">Pusat komando finansial dan intelijen kuantitatif cerdas Anda.</p>
          </div>
          <div className="text-xs text-[#686477] font-mono bg-[#111018] border border-[#1b1926] px-3.5 py-1.5 rounded-xl">
            Hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* TOP ROW: Visual Cards and Currency Switchers (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Bento Column 1: SafeHeaven Signature Credit Card Widget (8 Cols) */}
          <div className="card card-elevated p-6 lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual Glassmorphic Card (Left side, 7 cols) */}
            <div className="md:col-span-7 select-none">
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

            {/* Quick Actions (Right side, 5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-[#9f9bac] tracking-wider font-sans">Quick Cockpit Actions</h4>
                <p className="text-[10px] text-[#686477] mt-0.5">Aksi transfer cepat dan rebalancing bursa instan.</p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="action-quick-transfer"
                  onClick={() => {
                    toast.info('Modul Transfer diaktifkan. Pilih instrumen bursa tujuan.');
                    setLocation('/portfolio');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group"
                >
                  <Send className="w-4 h-4 text-[#ccff00] mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Kirim Dana</span>
                </button>

                <button
                  id="action-quick-rebalance"
                  onClick={handleQuickRebalance}
                  disabled={rebalancing}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group disabled:opacity-55"
                >
                  <RefreshCw className={`w-4 h-4 text-[#00f0ff] mb-1.5 group-hover:rotate-180 transition-all ${rebalancing ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-bold">Rebalance</span>
                </button>

                <button
                  id="action-card-alerts"
                  onClick={() => {
                    setLocation('/alerts');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group"
                >
                  <Bell className="w-4 h-4 text-pink-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Alerts</span>
                </button>

                <button
                  id="action-card-compare"
                  onClick={() => setLocation('/compare')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group"
                >
                  <Sliders className="w-4 h-4 text-orange-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Bandingkan</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bento Column 2: Multi-Currency Multi-Accounts (4 Cols) */}
          <div className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase text-[#9f9bac] tracking-wider">Multi-Currency Accounts</h4>
              <p className="text-[10px] text-[#686477]">Daftar saldo berdasarkan denominasi bursa dunia.</p>
            </div>

            {/* Currency list */}
            <div className="space-y-2.5">
              {/* Account 1: IDR */}
              <div 
                onClick={() => setActiveCurrency('IDR')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeCurrency === 'IDR' ? 'bg-[#ccff00]/5 border-[#ccff00]/30' : 'bg-[#111018]/50 border-transparent hover:border-[#1b1926]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-xs font-bold text-red-400">IDR</div>
                  <div>
                    <p className="text-[10px] text-[#686477] uppercase font-bold leading-none">Rupiah Indonesia</p>
                    <p className="text-xs font-extrabold text-white mt-1">Rp Account</p>
                  </div>
                </div>
                <p className="text-xs font-extrabold font-mono text-white">{formatIDR(capital)}</p>
              </div>

              {/* Account 2: USD */}
              <div 
                onClick={() => setActiveCurrency('USD')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeCurrency === 'USD' ? 'bg-[#ccff00]/5 border-[#ccff00]/30' : 'bg-[#111018]/50 border-transparent hover:border-[#1b1926]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">USD</div>
                  <div>
                    <p className="text-[10px] text-[#686477] uppercase font-bold leading-none">US Dollar</p>
                    <p className="text-xs font-extrabold text-white mt-1">US$ Offshore</p>
                  </div>
                </div>
                <p className="text-xs font-extrabold font-mono text-white">{formatUSD(capital / 15000)}</p>
              </div>

              {/* Account 3: EUR */}
              <div 
                onClick={() => setActiveCurrency('EUR')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  activeCurrency === 'EUR' ? 'bg-[#ccff00]/5 border-[#ccff00]/30' : 'bg-[#111018]/50 border-transparent hover:border-[#1b1926]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">EUR</div>
                  <div>
                    <p className="text-[10px] text-[#686477] uppercase font-bold leading-none">Eurozone</p>
                    <p className="text-xs font-extrabold text-white mt-1">€ European</p>
                  </div>
                </div>
                <p className="text-xs font-extrabold font-mono text-white">€ {Math.round(capital / 16200).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

        </div>

        {/* SECOND ROW: Stat Mini Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat 1 */}
          <div className="card p-5 flex items-center justify-between bg-[#0b0a10]/40">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#686477] tracking-wider uppercase font-sans">Saham Ter-Scoring</span>
              <h2 className="text-lg font-bold font-mono text-white">
                {tickers.length} / 45
              </h2>
              <span className="text-[9px] text-[#9f9bac] font-sans">Sinyal fundamental diperbarui live</span>
            </div>
            <div className="w-9 h-9 bg-[#ccff00]/10 border border-[#ccff00]/25 rounded-xl flex items-center justify-center text-[#ccff00]">
              <LineChart className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="card p-5 flex items-center justify-between bg-[#0b0a10]/40">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#686477] tracking-wider uppercase font-sans">Alert Sistem Aktif</span>
              <h2 className="text-lg font-bold font-mono text-[#ff3366] glow-text-lime">
                {activeAlertsCount}
              </h2>
              <span className="text-[9px] text-[#9f9bac] font-sans">Notifikasi kualitatif ON</span>
            </div>
            <div className="w-9 h-9 bg-[#ff3366]/10 border border-[#ff3366]/25 rounded-xl flex items-center justify-center text-[#ff3366]">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col justify-end -mx-3">
            <AnimatedTierCard />
          </div>
        </div>

        {/* THIRD ROW: Chart and Allocation Allocation (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Historic Capital Performance Chart (8 Cols) */}
          <div className="card card-elevated p-6 lg:col-span-8 flex flex-col space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">Kurva Pertumbuhan Portofolio</h3>
              <p className="text-[11px] text-[#686477] font-sans">Hasil akumulasi strategis SafeHeaven kumulatif semester ini.</p>
            </div>

            <div className="w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ccff00" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ccff00" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#494554" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#494554" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `Rp ${(val / 1000000)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0a10', borderColor: '#1b1926', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#ccff00', fontSize: '11px' }}
                    formatter={(val: number) => [formatIDR(val), 'Dana Aktif']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#ccff00" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Treemap Chart (4 Cols) */}
          <AssetTreemap capital={capital} />

        </div>

        {/* FOURTH ROW: High-fidelity transaction log (Top Picks) */}
        <div className="card card-elevated p-6 flex flex-col">
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
                {stockPicks.slice(0, 5).map((pick, i) => {
                  const colors = ['bg-[#ccff00]/10 text-[#ccff00]', 'bg-[#00f0ff]/10 text-[#00f0ff]', 'bg-purple-500/10 text-purple-400', 'bg-pink-500/10 text-pink-400', 'bg-orange-500/10 text-orange-400'];
                  return (
                    <tr key={pick.symbol} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <TickerLogo symbol={pick.symbol} sizeClassName="w-8 h-8" />
                          <span className="font-extrabold font-mono text-white text-sm">{pick.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#9f9bac] font-medium max-w-[180px] truncate">{pick.name}</td>
                      <td className="py-3.5 text-center font-extrabold font-mono text-white text-sm">{pick.score}</td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FIFTH ROW: Alert Notification ledger */}
        <div className="card card-elevated p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-[#ccff00]" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">Riwayat Amunisi Sinyal Alarm</h3>
                <p className="text-[11px] text-[#686477] font-sans">Log alarm harga, target deviasi aset, dan analisis fundamental real-time.</p>
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

      </div>
    </div>
  );
};
