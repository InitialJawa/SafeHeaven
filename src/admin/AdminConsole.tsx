/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { StressTestConsole } from './StressTestConsole';
import { RiskControlConsole } from './RiskControlConsole';
import { RebalanceConsole } from './RebalanceConsole';
import { BroadcastConsole } from './BroadcastConsole';
import { UserManagementConsole } from './UserManagementConsole';
import { DatabaseConsole } from './DatabaseConsole';
import { AuditTerminalConsole } from './AuditTerminalConsole';

export const AdminConsole: React.FC = () => {
  const { marketRegime } = useAppStore();
  const [activeTab, setActiveTab] = useState<'stress' | 'risk' | 'rebalance' | 'broadcast' | 'users' | 'database' | 'audit'>('stress');
  const [auditLogs, setAuditLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System initialized in High-Frequency Quant mode.`
  ]);

  const addLog = (msg: string) => {
    setAuditLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const clearLogs = () => {
    setAuditLogs([]);
  };

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
                <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Console & Operational Control</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ccff00]/15 border border-[#ccff00]/30 text-[#ccff00]">
                  PROTECTED
                </span>
              </div>
              <p className="text-xs text-[#9f9bac] mt-0.5">
                Pusat kendali risiko, simulasi stres krisis, manajemen member VIP, dan observabilitas database lokal.
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
        <div className="mt-6 pt-5 border-t border-[#1b1926] flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'stress', label: 'Stress Test & Crisis', icon: ShieldAlert, color: 'text-[#ff3366]' },
            { id: 'risk', label: 'Risk Control Tab', icon: Shield, color: 'text-[#00f5a0]' },
            { id: 'rebalance', label: 'Rebalance Lab', icon: Layers, color: 'text-[#ccff00]' },
            { id: 'broadcast', label: 'Broadcast & Signals', icon: Send, color: 'text-[#00f0ff]' },
            { id: 'users', label: 'Member & VIP Control', icon: Users, color: 'text-amber-400' },
            { id: 'database', label: 'Database Console', icon: Database, color: 'text-purple-400' },
            { id: 'audit', label: 'Audit Terminal', icon: Terminal, color: 'text-emerald-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-[#1b1926] text-white border-[#ccff00]/40 shadow-md shadow-[#ccff00]/5'
                    : 'bg-[#111018]/60 text-[#9f9bac] border-[#1b1926] hover:bg-[#111018] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div className="transition-all duration-200">
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
