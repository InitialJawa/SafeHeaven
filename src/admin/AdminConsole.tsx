/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { 
  Shield, 
  ShieldAlert, 
  Layers, 
  Send, 
  Users, 
  Database, 
  Terminal, 
  Activity, 
  Zap,
  Lock,
  LayoutDashboard,
  CreditCard
} from 'lucide-react';
import { OverviewConsole } from './OverviewConsole';
import { StressTestConsole } from './StressTestConsole';
import { RiskControlConsole } from './RiskControlConsole';
import { RebalanceConsole } from './RebalanceConsole';
import { BroadcastConsole } from './BroadcastConsole';
import { UserManagementConsole } from './UserManagementConsole';
import { DatabaseConsole } from './DatabaseConsole';
import { AuditTerminalConsole } from './AuditTerminalConsole';
import { PaymentConsole } from './PaymentConsole';

type AdminTab = 'overview' | 'stress' | 'risk' | 'rebalance' | 'broadcast' | 'payment' | 'users' | 'database' | 'audit';

export const AdminConsole: React.FC = () => {
  const { marketRegime } = useAppStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [auditLogs, setAuditLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System Mission Control initialized.`
  ]);

  const addLog = (msg: string) => {
    setAuditLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const clearLogs = () => {
    setAuditLogs([]);
  };

  // Optional keyboard shortcut listener (Keys 1-8 to switch tabs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keyMap: Record<string, AdminTab> = {
        '1': 'overview',
        '2': 'payment',
        '3': 'stress',
        '4': 'risk',
        '5': 'rebalance',
        '6': 'broadcast',
        '7': 'users',
        '8': 'database',
        '9': 'audit'
      };
      if (keyMap[e.key]) {
        setActiveTab(keyMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="px-6 space-y-6 pb-20 animate-in fade-in duration-300 font-sans">
      
      {/* Top Header Banner */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#ccff00]/10 border border-[#ccff00]/25 rounded-2xl flex items-center justify-center text-[#ccff00] shadow-lg shadow-[#ccff00]/10">
              <Lock className="w-5 h-5 glow-text-lime" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Operations & Mission Control</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00]">
                  PROTECTED
                </span>
              </div>
              <p className="text-xs text-[#9f9bac] mt-0.5">
                Pusat pengawasan sistem, krisis makro, risiko kuantitatif, broadcast sinyal VIP, dan manajemen database.
              </p>
            </div>
          </div>

          {/* Realtime Market Regime & System Pill */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-[#111018] border border-[#1b1926] rounded-xl flex items-center gap-2">
              <Activity className={`w-3.5 h-3.5 ${marketRegime === 'bullish' ? 'text-[#00f5a0]' : marketRegime === 'bearish' ? 'text-[#ff3366]' : 'text-[#00f0ff]'}`} />
              <div className="text-left text-xs">
                <div className="text-[9px] text-[#686477] uppercase font-bold">Market Regime</div>
                <div className="font-mono font-bold text-white capitalize">{marketRegime}</div>
              </div>
            </div>

            <div className="px-3.5 py-2 bg-[#111018] border border-[#1b1926] rounded-xl flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
              <div className="text-left text-xs">
                <div className="text-[9px] text-[#686477] uppercase font-bold">Quantum Engine</div>
                <div className="font-mono font-bold text-[#ccff00]">ACTIVE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mt-6 pt-5 border-t border-[#1b1926] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
            { id: 'payment', label: 'Saweria & Payment', icon: CreditCard, badge: 'Gateway' },
            { id: 'stress', label: 'Stress & Crisis', icon: ShieldAlert, badge: undefined },
            { id: 'risk', label: 'Risk Control', icon: Shield, badge: undefined },
            { id: 'rebalance', label: 'Rebalance Lab', icon: Layers, badge: undefined },
            { id: 'broadcast', label: 'Broadcast Signals', icon: Send, badge: undefined },
            { id: 'users', label: 'User & VIP Control', icon: Users, badge: undefined },
            { id: 'database', label: 'Database Console', icon: Database, badge: 'SQLite' },
            { id: 'audit', label: 'Audit Terminal', icon: Terminal, badge: undefined },
          ].map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-[#1b1926] text-[#ccff00] border-[#ccff00]/40 shadow-sm shadow-[#ccff00]/5'
                    : 'bg-[#111018]/60 text-[#9f9bac] border-[#1b1926] hover:bg-[#111018] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ccff00]' : 'text-[#686477]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    isActive ? 'bg-[#ccff00] text-black' : 'bg-[#1b1926] text-[#9f9bac]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                <span className="text-[9px] text-[#686477] font-mono ml-0.5 opacity-60">[{idx + 1}]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div className="transition-all duration-200">
        {activeTab === 'overview' && <OverviewConsole setActiveTab={setActiveTab} addLog={addLog} auditLogs={auditLogs} />}
        {activeTab === 'payment' && <PaymentConsole addLog={addLog} />}
        {activeTab === 'stress' && <StressTestConsole addLog={addLog} />}
        {activeTab === 'risk' && <RiskControlConsole addLog={addLog} />}
        {activeTab === 'rebalance' && <RebalanceConsole addLog={addLog} />}
        {activeTab === 'broadcast' && <BroadcastConsole addLog={addLog} />}
        {activeTab === 'users' && <UserManagementConsole addLog={addLog} />}
        {activeTab === 'database' && <DatabaseConsole addLog={addLog} />}
        {activeTab === 'audit' && <AuditTerminalConsole auditLogs={auditLogs} clearLogs={clearLogs} />}
      </div>

    </div>
  );
};

