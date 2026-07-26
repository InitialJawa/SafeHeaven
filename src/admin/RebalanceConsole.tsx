/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../stores';
import { Layers, RefreshCw, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface RebalanceConsoleProps {
  addLog: (msg: string) => void;
}

export const RebalanceConsole: React.FC<RebalanceConsoleProps> = ({ addLog }) => {
  const { fetchInitialData } = useAppStore();

  const triggerPost = async (endpoint: string, body?: any, successMsg?: string) => {
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/admin/${endpoint}`, {
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

  return (
    <div className="card card-elevated p-6 space-y-5 bg-[#0b0a10]/45 border border-[#1b1926]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ccff00]" /> Laboratorium Rebalancing & Drift Simulasi
          </h3>
          <p className="text-[11px] text-[#686477] mt-0.5 font-sans">
            Uji efektivitas algoritma rebalancing otomatis dalam menyeimbangkan alokasi portofolio ke formula sasaran.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Force Rebalance Action */}
        <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <h4 className="text-xs font-extrabold text-white">Eksekusi Rebalancing Otomatis</h4>
            <p className="text-[10px] text-[#9f9bac] mt-0.5">
              Kalkulasi ulang pembobotan konstituen, trimming saham berlebih, dan kembalikan porsi modal ke formula aktif.
            </p>
          </div>
          <button
            onClick={() => triggerPost('trigger-rebalance', null, 'Rebalancing portofolio sukses dieksekusi!')}
            className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Rebalance Ke Target Formula
          </button>
        </div>

        {/* Drift Simulator Action */}
        <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <h4 className="text-xs font-extrabold text-white">Simulasi Deviasi Porsi (Asset Drift)</h4>
            <p className="text-[10px] text-[#9f9bac] mt-0.5">
              Kondisikan porsi Saham melonjak ke 75% akibat reli, sehingga pengguna bisa menguji tombol Rebalance di tab Overview.
            </p>
          </div>
          <button
            onClick={() => triggerPost('trigger-drift', null, 'Simulasi Deviasi Alokasi (+15% Saham) diinjeksikan!')}
            className="w-full py-2.5 bg-[#1b1926] hover:bg-[#282538] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border border-[#2d2a3e] flex items-center justify-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-[#00f0ff]" /> Injeksi Asset Drift (+15% Saham)
          </button>
        </div>

      </div>
    </div>
  );
};
