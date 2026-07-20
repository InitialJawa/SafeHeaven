/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Play, ShieldAlert, AlertTriangle, Send, Terminal, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const Admin: React.FC = () => {
  const { fetchInitialData } = useAppStore();
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState<'Score' | 'Price' | 'Crash'>('Price');
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Admin session initialized.`,
    `[${new Date().toLocaleTimeString()}] WebSocket broadcast channel active.`
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
  };

  const triggerAction = async (endpoint: string, successMsg: string) => {
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/admin/${endpoint}`, { method: 'POST' });
      if (res.ok) {
        addLog(`Triggered: ${endpoint}`);
        toast.success(successMsg);
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menjalankan trigger!');
    }
  };

  const handleSendManualAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertText.trim()) return;

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/admin/add-manual-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertText, type: alertType })
      });

      if (res.ok) {
        addLog(`Manual Alert broadcasted: [${alertType}] ${alertText}`);
        toast.success('Pesan manual berhasil dipublikasikan!');
        setAlertText('');
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin-workspace" className="px-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Admin Simulator Console</h1>
          <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Panel kendali pusat simulasi volatilitas pasar, re-scoring model, dan audit transmisi log.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Actions panel */}
        <div className="card card-elevated p-6 lg:col-span-4 space-y-5 h-fit bg-[#0b0a10]/45">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ccff00]" /> Stimulator Pemicu Sistem
          </h3>

          <div className="space-y-4 text-xs font-sans font-medium">
            {/* Button 1: Re-Scoring */}
            <div className="p-4 bg-[#111018]/60 border border-[#1b1926] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-white">Re-Scoring Saham</h4>
                <p className="text-[10px] text-[#686477] mt-0.5">Perbarui kalkulasi fundamental LQ45.</p>
              </div>
              <button
                id="admin-trigger-scoring"
                onClick={() => triggerAction('trigger-scoring', 'Scoring berhasil diperbarui secara dinamis!')}
                className="px-3.5 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black rounded-lg font-extrabold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-[#ccff00]/5"
              >
                <Play className="w-3 h-3 fill-current" /> Run
              </button>
            </div>

            {/* Button 2: Price fluctuation */}
            <div className="p-4 bg-[#111018]/60 border border-[#1b1926] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-white">Fluktuasi Harga Saham</h4>
                <p className="text-[10px] text-[#686477] mt-0.5">Ubah volatilitas harga sekuritas secara paksa.</p>
              </div>
              <button
                id="admin-trigger-prices"
                onClick={() => triggerAction('trigger-prices', 'Volatilitas bursa live diinjeksikan!')}
                className="px-3.5 py-2 bg-[#00f0ff] hover:bg-cyan-400 text-black rounded-lg font-extrabold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-[#00f0ff]/5"
              >
                <Play className="w-3 h-3 fill-current" /> Run
              </button>
            </div>

            {/* Button 3: Market crash */}
            <div className="p-4 bg-red-950/15 border border-red-900/35 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-[#ff3366]">Trigger Skenario Crash</h4>
                <p className="text-[10px] text-red-500/80 mt-0.5">Kondisikan bursa jatuh untuk tes Crash Shield.</p>
              </div>
              <button
                id="admin-trigger-crash"
                onClick={() => triggerAction('trigger-crash', 'Peringatan Krisis Terbuka: Skenario Pasar Crash!')}
                className="px-3.5 py-2 bg-[#ff3366] hover:bg-[#ff5588] text-white rounded-lg font-extrabold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-[#ff3366]/5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Crash
              </button>
            </div>
          </div>
        </div>

        {/* Manual broadcast alert */}
        <div className="card card-elevated p-6 lg:col-span-4 h-fit bg-[#0b0a10]/45">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
            <Send className="w-4 h-4 text-[#ccff00]" /> Broadcast Notifikasi Manual
          </h3>

          <form onSubmit={handleSendManualAlert} className="space-y-4 text-xs font-sans mt-4">
            <div className="space-y-2">
              <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Tipe Notifikasi</label>
              <select
                id="admin-alert-type-select"
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as any)}
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
              >
                <option value="Score" className="bg-[#12111f]">Score Update</option>
                <option value="Price" className="bg-[#12111f]">Price Watchdog</option>
                <option value="Crash" className="bg-[#12111f]">Crash / Market Crisis</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Isi Pesan Alarm</label>
              <textarea
                id="admin-alert-message-textarea"
                rows={3}
                required
                value={alertText}
                onChange={(e) => setAlertText(e.target.value)}
                placeholder="Tuliskan berita bursa atau pesan darurat di sini..."
                className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs font-medium"
              />
            </div>

            <button
              id="admin-send-alert-btn"
              type="submit"
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
            >
              <Send className="w-4 h-4 stroke-[2.5px]" /> Kirim Broadcast
            </button>
          </form>
        </div>

        {/* Terminal logs */}
        <div className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between h-[360px] bg-[#0b0a10]/45">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00f0ff]" /> Audit Log Transmisi Live
            </h3>
            <p className="text-[11px] text-[#686477] font-sans">Monitor sinyal & respons pemicu internal server.</p>
          </div>

          <div className="flex-1 bg-[#060509] border border-[#1b1926] rounded-xl p-3.5 mt-4 overflow-y-auto font-mono text-[10px] text-[#ccff00] space-y-1.5 select-all">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed font-semibold">
                <span className="text-[#686477] font-normal">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
