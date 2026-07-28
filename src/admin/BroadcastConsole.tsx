/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { Send, Play, Radio, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BroadcastConsoleProps {
  addLog: (msg: string) => void;
}

export const BroadcastConsole: React.FC<BroadcastConsoleProps> = ({ addLog }) => {
  const { fetchInitialData } = useAppStore();
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState<'Score' | 'Price' | 'Crash' | 'Rebalance'>('Crash');
  const [courierStatus, setCourierStatus] = useState<{ configured: boolean; eventId: string; tokenPreview: string | null } | null>(null);
  const [isTestingCourier, setIsTestingCourier] = useState(false);

  useEffect(() => {
    fetch('/api/admin/courier-status')
      .then((res) => res.json())
      .then((data) => setCourierStatus(data))
      .catch(() => setCourierStatus(null));
  }, []);

  const handleTestCourier = async () => {
    setIsTestingCourier(true);
    try {
      const res = await fetch('/api/admin/test-courier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Uji Coba Courier SafeHaven',
          message: 'Ini adalah notifikasi uji coba langsung dari Admin Broadcast Console SafeHaven.'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Notifikasi Courier berhasil terkirim!');
        addLog('Courier Dispatch SUCCESS: Test payload delivered.');
      } else {
        toast.error(`Gagal mengirim via Courier: ${data.message || data.result?.error || 'Periksa API Key Courier.'}`);
        addLog(`Courier Dispatch FAILED: ${data.message || data.result?.error}`);
      }
    } catch (err) {
      toast.error('Gagal terhubung ke server untuk pengujian Courier.');
    } finally {
      setIsTestingCourier(false);
    }
  };

  const triggerPost = async (endpoint: string, body?: any, successMsg?: string) => {
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      if (res.ok) {
        const json = await res.json();
        addLog(`SUCCESS [${endpoint}]: ${json.message || 'Action executed'}`);
        if (successMsg) toast.success(successMsg);
        await fetchInitialData();
      } else {
        toast.error('Trigger gagal diproses oleh server.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan jaringan.');
    }
  };

  const handleSendManualAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertText.trim()) return;

    try {
      const res = await fetch('/api/admin/add-manual-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertText, type: alertType })
      });

      if (res.ok) {
        addLog(`Broadcast Notification: [${alertType}] "${alertText}"`);
        toast.success('Pesan broadcast disebarkan ke seluruh tab pengguna!');
        setAlertText('');
        await fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Broadcast Notification Sender */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans">Broadcast Sinyal Ke Seluruh Tab</h3>

          {/* Courier Status Pill */}
          <div className="flex items-center gap-2">
            {courierStatus?.configured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/20">
                <CheckCircle2 className="w-3 h-3" /> Courier Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-3 h-3" /> Courier Key Missing
              </span>
            )}
          </div>
        </div>

        {/* Courier Info / Test Bar */}
        <div className="p-3 bg-[#111018] rounded-xl border border-[#1b1926] flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#00f0ff]" /> Integration: Courier.com
            </div>
            <div className="text-[10px] text-[#8e8a9f]">
              {courierStatus?.configured
                ? `Token configured (${courierStatus.tokenPreview}) • Event: ${courierStatus.eventId}`
                : 'COURIER_AUTH_TOKEN belum diisi di .env. Notifikasi tersimpan di UI internal.'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleTestCourier}
            disabled={isTestingCourier || !courierStatus?.configured}
            className="px-3 py-1.5 bg-[#1b1926] hover:bg-[#252235] text-xs text-[#00f0ff] font-bold rounded-lg border border-[#00f0ff]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            {isTestingCourier ? 'Mengirim...' : 'Test Courier'}
          </button>
        </div>

        <form onSubmit={handleSendManualAlert} className="space-y-3 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-[#9f9bac] font-extrabold uppercase text-[10px]">Kategori Alert</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as any)}
              className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#ccff00]/40"
            >
              <option value="Crash" className="bg-[#111018]">Crash / Market Crisis</option>
              <option value="Rebalance" className="bg-[#111018]">Rebalance Warning</option>
              <option value="Score" className="bg-[#111018]">Score Update</option>
              <option value="Price" className="bg-[#111018]">Price Watchdog</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[#9f9bac] font-extrabold uppercase text-[10px]">Isi Pesan Sistem</label>
              <span className="text-[10px] text-[#686477]">Template Cepat</span>
            </div>
            <textarea
              rows={3}
              required
              value={alertText}
              onChange={(e) => setAlertText(e.target.value)}
              placeholder="Tuliskan berita bursa atau pemicu darurat untuk ditayangkan di notifikasi..."
              className="w-full bg-[#111018] border border-[#1b1926] rounded-xl p-3 text-white focus:outline-none focus:border-[#ccff00]/40 text-xs"
            />
            
            {/* Broadcast Preset Quick Chips */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {[
                { label: 'Volatilitas Perbankan', text: 'Peringatan Volatilitas Sektor Perbankan: IHSG tertekan oleh aksi net-foreign sell pada emiten Big Cap.' },
                { label: 'Rebalance Bulanan', text: 'Sinyal Rebalancing Bulanan: Disarankan melakukan pemutakhiran portofolio mengikuti skor kuantitatif terbaru.' },
                { label: 'Crash Shield Level 1', text: 'Crash Shield Level 1 Dipicu: Portofolio otomatis dialokasikan lebih tinggi ke Kas & Emas untuk perlindungan aset.' }
              ].map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => setAlertText(tpl.text)}
                  className="px-2 py-1 text-[10px] font-sans font-medium rounded-lg bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white border border-[#1b1926] transition-all cursor-pointer"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#ccff00]/10 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Publikasikan Notifikasi
          </button>
        </form>
      </div>

      {/* Quick Market Triggers */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono text-[#ccff00]">
          Quick Market Triggers
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => triggerPost('trigger-scoring', null, 'Scoring LQ45 diperbarui secara dinamis!')}
            className="w-full p-3.5 bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] rounded-xl text-left flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer"
          >
            <div>
              <div>Re-Scoring Faktor Kuantitatif</div>
              <div className="text-[10px] text-[#686477] font-normal mt-0.5">Kalkulasi ulang skor fundamental & momentum saham</div>
            </div>
            <Play className="w-4 h-4 text-[#ccff00] fill-current shrink-0" />
          </button>

          <button
            onClick={() => triggerPost('trigger-prices', null, 'Volatilitas bursa live diinjeksikan!')}
            className="w-full p-3.5 bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] rounded-xl text-left flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer"
          >
            <div>
              <div>Injeksi Volatilitas Harga Real-time</div>
              <div className="text-[10px] text-[#686477] font-normal mt-0.5">Simulasi fluktuasi tick-by-tick bursa</div>
            </div>
            <Play className="w-4 h-4 text-[#00f0ff] fill-current shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
