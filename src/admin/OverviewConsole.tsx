/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Database, 
  Send, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Server, 
  Radio, 
  ArrowRight,
  RefreshCw,
  Terminal,
  Cpu,
  BarChart3,
  TrendingUp,
  Sliders,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface OverviewConsoleProps {
  setActiveTab: (tab: 'overview' | 'stress' | 'risk' | 'rebalance' | 'broadcast' | 'users' | 'database' | 'audit') => void;
  addLog: (msg: string) => void;
  auditLogs: string[];
}

export const OverviewConsole: React.FC<OverviewConsoleProps> = ({ setActiveTab, addLog, auditLogs }) => {
  const { marketRegime, users, clients } = useAppStore();
  const [dbStats, setDbStats] = useState<{ size?: string; totalRows?: number; latencyMs?: number }>({
    size: '12.4 MB',
    totalRows: 14850,
    latencyMs: 12
  });
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [systemUptime, setSystemUptime] = useState('99.98%');
  const [lastCheckTime, setLastCheckTime] = useState<string>(new Date().toLocaleTimeString());

  // Quick Action Handler
  const handleQuickAction = async (actionName: string, endpoint: string, bodyObj?: any) => {
    setLoadingAction(actionName);
    addLog(`Exec: Initiating Quick Action [${actionName}]...`);
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyObj ? JSON.stringify(bodyObj) : JSON.stringify({ triggeredBy: 'OverviewQuickAction' })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Aksi "${actionName}" sukses dieksekusi!`);
        addLog(`SUCCESS: Quick Action [${actionName}] executed successfully.`);
      } else {
        toast.error(`Aksi "${actionName}" gagal: ${data.message || 'Error HTTP'}`);
        addLog(`ERROR: Quick Action [${actionName}] failed: ${data.message}`);
      }
    } catch (err: any) {
      toast.error(`Koneksi error saat mengeksekusi ${actionName}`);
      addLog(`CRITICAL: Network error during [${actionName}] execution.`);
    } finally {
      setLoadingAction(null);
    }
  };

  const totalUsers = users?.length || 3;
  const vipAdvisors = users?.filter(u => u.role === 'advisor' || u.role === 'admin')?.length || 1;

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. System Health Telemetry Bar */}
      <div className="bg-[#111018] border border-[#1b1926] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ccff00]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">SYSTEM MISSION CONTROL</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25">
                OPERATIONAL
              </span>
            </div>
            <p className="text-[11px] text-[#9f9bac]">Seluruh microservices, proxy API, dan SQLite db berjalan normal.</p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b0a10] border border-[#1b1926] rounded-xl text-[#9f9bac]">
            <Server className="w-3.5 h-3.5 text-[#686477]" />
            <span>API Proxy: <strong className="text-white">12ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b0a10] border border-[#1b1926] rounded-xl text-[#9f9bac]">
            <Radio className="w-3.5 h-3.5 text-[#686477]" />
            <span>WS Stream: <strong className="text-white">ACTIVE</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b0a10] border border-[#1b1926] rounded-xl text-[#9f9bac]">
            <Cpu className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Uptime: <strong className="text-white">{systemUptime}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Key Operational Metrics (4 Executive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Users & VIPs */}
        <div className="bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/30 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9f9bac]">Pengguna & Member VIP</span>
            <div className="w-8 h-8 rounded-xl bg-[#1b1926] text-[#ccff00] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{totalUsers}</span>
            <span className="text-xs text-[#ccff00] font-mono font-bold">({vipAdvisors} VIP Tier)</span>
          </div>
          <p className="mt-1 text-[11px] text-[#686477]">Manajemen peran akun, custom claims & klaim VIP.</p>
          <button 
            onClick={() => setActiveTab('users')}
            className="mt-4 w-full py-1.5 px-3 bg-[#0b0a10] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white text-xs font-bold font-mono rounded-lg border border-[#1b1926] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Buka User Console</span>
            <ArrowRight className="w-3 h-3 text-[#ccff00]" />
          </button>
        </div>

        {/* Card 2: Risk Engine & Regime */}
        <div className="bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/30 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9f9bac]">Risk Engine & Regime</span>
            <div className="w-8 h-8 rounded-xl bg-[#1b1926] text-[#ccff00] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono capitalize">{marketRegime}</span>
            <span className="text-xs text-[#9f9bac] font-mono">MaxDD 15%</span>
          </div>
          <p className="mt-1 text-[11px] text-[#686477]">Guardrail risiko kuantitatif & batas stop loss otomatis.</p>
          <button 
            onClick={() => setActiveTab('risk')}
            className="mt-4 w-full py-1.5 px-3 bg-[#0b0a10] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white text-xs font-bold font-mono rounded-lg border border-[#1b1926] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Pengaturan Risiko</span>
            <ArrowRight className="w-3 h-3 text-[#ccff00]" />
          </button>
        </div>

        {/* Card 3: Database Storage */}
        <div className="bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/30 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9f9bac]">Database & Storage</span>
            <div className="w-8 h-8 rounded-xl bg-[#1b1926] text-[#ccff00] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{dbStats.size}</span>
            <span className="text-xs text-[#9f9bac] font-mono">{dbStats.totalRows?.toLocaleString()} baris</span>
          </div>
          <p className="mt-1 text-[11px] text-[#686477]">SQLite DB + Firestore Sync. Latensi {dbStats.latencyMs}ms.</p>
          <button 
            onClick={() => setActiveTab('database')}
            className="mt-4 w-full py-1.5 px-3 bg-[#0b0a10] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white text-xs font-bold font-mono rounded-lg border border-[#1b1926] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Database Console</span>
            <ArrowRight className="w-3 h-3 text-[#ccff00]" />
          </button>
        </div>

        {/* Card 4: Signal & Broadcast Engine */}
        <div className="bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/30 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9f9bac]">Signal Broadcast</span>
            <div className="w-8 h-8 rounded-xl bg-[#1b1926] text-[#ccff00] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">100%</span>
            <span className="text-xs text-[#ccff00] font-mono font-bold">Delivery Rate</span>
          </div>
          <p className="mt-1 text-[11px] text-[#686477]">Sinyal trading AI & notifikasi push VIP aktif.</p>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className="mt-4 w-full py-1.5 px-3 bg-[#0b0a10] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white text-xs font-bold font-mono rounded-lg border border-[#1b1926] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Kirim Broadcast</span>
            <ArrowRight className="w-3 h-3 text-[#ccff00]" />
          </button>
        </div>

      </div>

      {/* 3. Operational Command Center Matrix (Quick Shortcuts) & Mini Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Action Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-[#111018] border border-[#1b1926] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1b1926] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ccff00]" />
              <h3 className="text-sm font-extrabold text-white tracking-wide">Pusat Aksi Operasional Cepat</h3>
            </div>
            <span className="text-[10px] font-mono text-[#686477] uppercase">Emergency & Routine Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Action 1: Trigger Stress Test */}
            <div className="p-4 bg-[#0b0a10] border border-[#1b1926] hover:border-[#ff3366]/40 rounded-xl transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#ff3366]" />
                  Simulasi Krisis Pasar (-15%)
                </span>
                <span className="text-[9px] font-mono bg-[#ff3366]/15 text-[#ff3366] px-2 py-0.5 rounded font-bold">CRASH SHIELD</span>
              </div>
              <p className="text-[11px] text-[#9f9bac]">Injeksi kejatuhan bursa massal untuk menguji Crash Shield & auto-rotation.</p>
              <button
                onClick={() => handleQuickAction('Simulasi Crash -15%', 'trigger-crash', { dropPercent: -15 })}
                disabled={loadingAction === 'Simulasi Crash -15%'}
                className="w-full mt-2 py-2 px-3 bg-[#ff3366]/10 hover:bg-[#ff3366] text-[#ff3366] hover:text-white border border-[#ff3366]/25 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingAction === 'Simulasi Crash -15%' ? 'Menjalankan...' : 'Jalankan Black Swan Test'}
              </button>
            </div>

            {/* Action 2: Trigger Global Rebalance */}
            <div className="p-4 bg-[#0b0a10] border border-[#1b1926] hover:border-[#ccff00]/30 rounded-xl transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#ccff00]" />
                  Rebalance Portofolio Global
                </span>
                <span className="text-[9px] font-mono bg-[#1b1926] text-[#9f9bac] px-2 py-0.5 rounded font-bold">QUANT ENGINE</span>
              </div>
              <p className="text-[11px] text-[#9f9bac]">Hitung ulang bobot alokasi saham berdasarkan matriks Sharpe & rasio risiko.</p>
              <button
                onClick={() => handleQuickAction('Rebalance Global', 'trigger-rebalance')}
                disabled={loadingAction === 'Rebalance Global'}
                className="w-full mt-2 py-2 px-3 bg-[#1b1926] hover:bg-[#ccff00] text-white hover:text-black border border-[#1b1926] hover:border-[#ccff00] text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingAction === 'Rebalance Global' ? 'Memproses...' : 'Jalankan Rebalance Now'}
              </button>
            </div>

            {/* Action 3: Trigger Price Sync */}
            <div className="p-4 bg-[#0b0a10] border border-[#1b1926] hover:border-[#ccff00]/30 rounded-xl transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#ccff00]" />
                  Sinkronisasi Harga Market
                </span>
                <span className="text-[9px] font-mono bg-[#1b1926] text-[#9f9bac] px-2 py-0.5 rounded font-bold">DATA FEED</span>
              </div>
              <p className="text-[11px] text-[#9f9bac]">Tarik data harga ticker real-time untuk memperbarui valuasi portofolio.</p>
              <button
                onClick={() => handleQuickAction('Sync Harga Market', 'trigger-prices')}
                disabled={loadingAction === 'Sync Harga Market'}
                className="w-full mt-2 py-2 px-3 bg-[#1b1926] hover:bg-[#ccff00] text-white hover:text-black border border-[#1b1926] hover:border-[#ccff00] text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingAction === 'Sync Harga Market' ? 'Memperbarui...' : 'Sinkronkan Ticker IDX'}
              </button>
            </div>

            {/* Action 4: Trigger AI Scoring recalculation */}
            <div className="p-4 bg-[#0b0a10] border border-[#1b1926] hover:border-[#ccff00]/30 rounded-xl transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#ccff00]" />
                  Kalkulasi Ulang Skor Saham AI
                </span>
                <span className="text-[9px] font-mono bg-[#1b1926] text-[#9f9bac] px-2 py-0.5 rounded font-bold">GEMINI QUANT</span>
              </div>
              <p className="text-[11px] text-[#9f9bac]">Perbarui skor fundamental, teknikal, dan sinyal beli/jual seluruh emiten.</p>
              <button
                onClick={() => handleQuickAction('Recalculate AI Scores', 'trigger-scoring')}
                disabled={loadingAction === 'Recalculate AI Scores'}
                className="w-full mt-2 py-2 px-3 bg-[#1b1926] hover:bg-[#ccff00] text-white hover:text-black border border-[#1b1926] hover:border-[#ccff00] text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingAction === 'Recalculate AI Scores' ? 'Menghitung...' : 'Jalankan Recalculation'}
              </button>
            </div>

          </div>
        </div>

        {/* Live Security & Audit Feed (1 col) */}
        <div className="bg-[#111018] border border-[#1b1926] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b1926] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ccff00]" />
                <h3 className="text-sm font-extrabold text-white tracking-wide">Live Audit Stream</h3>
              </div>
              <span className="text-[10px] font-mono bg-[#1b1926] text-[#9f9bac] px-2 py-0.5 rounded font-bold">REALTIME</span>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-[#0b0a10] border border-[#1b1926] rounded-xl p-3 h-52 overflow-y-auto font-mono text-[11px] text-[#9f9bac] space-y-1.5 scrollbar-thin">
              {auditLogs.length === 0 ? (
                <div className="text-[#686477] italic py-8 text-center">Belum ada riwayat aktivitas terminal.</div>
              ) : (
                auditLogs.map((log, idx) => (
                  <div key={idx} className="leading-tight border-b border-[#1b1926]/50 pb-1 last:border-none">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('audit')}
            className="w-full py-2.5 px-4 bg-[#1b1926] hover:bg-[#252233] text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#1b1926]"
          >
            <span>Buka Audit Terminal Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ccff00]" />
          </button>
        </div>

      </div>

    </div>
  );
};
