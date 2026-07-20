/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Check, Trash2, Bell, ShieldAlert, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const Alerts: React.FC = () => {
  const { alerts } = useAppStore();
  const [filterType, setFilterType] = useState<'All' | 'Score' | 'Price' | 'Crash'>('All');

  const markAllRead = () => {
    useAppStore.setState((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, status: 'read' as const }))
    }));
    toast.success('Semua alert berhasil ditandai dibaca!');
  };

  const clearAllAlerts = () => {
    useAppStore.setState(() => ({ alerts: [] }));
    toast.info('Seluruh riwayat alert dikosongkan.');
  };

  const markAsReadSingle = (id: string) => {
    useAppStore.setState((state) => ({
      alerts: state.alerts.map((a) => a.id === id ? { ...a, status: 'read' as const } : a)
    }));
  };

  // Filter alerts based on active filter button
  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'All') return true;
    return a.type === filterType;
  });

  return (
    <div id="alerts-history-view" className="px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Triggered Alerts</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Semua pemberitahuan, sinyal kuantitatif, dan alarm proteksi otomatis bursa LQ45.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {alerts.filter(a => a.status === 'unread').length > 0 && (
            <button
              id="alerts-mark-read-all-btn"
              onClick={markAllRead}
              className="px-4 py-2.5 bg-[#111018]/60 hover:bg-[#ccff00]/10 border border-[#1b1926] text-[#ccff00] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5px]" /> Tandai Semua Dibaca
            </button>
          )}
          {alerts.length > 0 && (
            <button
              id="alerts-clear-all-btn"
              onClick={clearAllAlerts}
              className="px-4 py-2.5 bg-red-950/20 hover:bg-[#ff3366]/10 border border-red-900/30 text-[#ff3366] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Kosongkan Riwayat
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Buttons */}
      <div className="flex gap-2">
        {(['All', 'Score', 'Price', 'Crash'] as const).map((t) => (
          <button
            key={t}
            id={`filter-alerts-tab-${t}`}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-xl font-extrabold transition-all text-xs cursor-pointer ${
              filterType === t
                ? 'bg-[#ccff00]/10 border border-[#ccff00] text-[#ccff00]'
                : 'bg-[#111018]/60 border border-[#1b1926] text-[#686477] hover:text-white'
            }`}
          >
            {t === 'All' ? 'Semua Kategori' : t}
          </button>
        ))}
      </div>

      {/* List / Table */}
      {filteredAlerts.length === 0 ? (
        <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center bg-[#0b0a10]/45">
          <div className="w-12 h-12 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">Belum ada Alert</h3>
          <p className="text-[11px] text-[#686477] max-w-xs mt-1 font-sans font-medium">
            Sistem belum mendeteksi atau merekam pemicu alarm harga maupun kualitatif.
          </p>
        </div>
      ) : (
        <div className="card card-elevated p-6 bg-[#0b0a10]/45">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#1b1926] text-[#686477]">
                  <th className="pb-3.5 font-bold text-[10px] uppercase tracking-wider">Waktu Trigger</th>
                  <th className="pb-3.5 font-bold text-[10px] uppercase tracking-wider">Tipe Alert</th>
                  <th className="pb-3.5 font-bold text-[10px] uppercase tracking-wider">Detail Konten Sinyal</th>
                  <th className="pb-3.5 font-bold text-[10px] uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926]">
                {filteredAlerts.map((a) => {
                  const isUnread = a.status === 'unread';
                  return (
                    <tr key={a.id} className={`hover:bg-white/[0.01] transition-colors ${isUnread ? 'bg-[#111018]/30' : ''}`}>
                      <td className="py-3.5 font-mono text-[#9f9bac] font-medium text-[11px]">
                        {new Date(a.time).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                          a.type === 'Score' ? 'bg-cyan-950/40 text-[#00f0ff] border border-cyan-500/25' :
                          a.type === 'Price' ? 'bg-yellow-950/40 text-[#ccff00] border border-yellow-500/25' :
                          'bg-rose-950/40 text-[#ff3366] border border-rose-500/25'
                        }`}>
                          {a.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-white max-w-lg truncate font-medium">{a.message}</td>
                      <td className="py-3.5 text-right">
                        {isUnread ? (
                          <button
                            id={`alerts-mark-read-${a.id}`}
                            onClick={() => markAsReadSingle(a.id)}
                            className="px-3 py-1 text-[10px] bg-[#111018]/80 hover:bg-[#ccff00]/10 text-[#ccff00] border border-[#1b1926] hover:border-[#ccff00]/30 rounded-xl transition-all cursor-pointer font-bold"
                          >
                            Tandai dibaca
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#686477] font-mono font-bold uppercase tracking-wider">Dibaca</span>
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
  );
};
