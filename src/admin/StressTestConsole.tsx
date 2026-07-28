/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { 
  ShieldAlert, 
  TrendingDown, 
  Activity, 
  TrendingUp, 
  Zap, 
  SlidersHorizontal, 
  Play, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

interface StressTestConsoleProps {
  addLog: (msg: string) => void;
}

export const StressTestConsole: React.FC<StressTestConsoleProps> = ({ addLog }) => {
  const { fetchInitialData } = useAppStore();

  // Custom stress sliders
  const [customEquity, setCustomEquity] = useState(-10);
  const [customGold, setCustomGold] = useState(12);
  const [customUSD, setCustomUSD] = useState(6);

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

  return (
    <div className="space-y-6">
      {/* Black Swan & Crisis Stress Test Suite */}
      <div className="card card-elevated p-6 space-y-5 bg-[#0b0a10]/45 border border-[#1b1926]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">Modul Simulasi Krisis Pasar & Black Swan</h3>
            <p className="text-[11px] text-[#686477] mt-0.5 font-sans">
              Injeksi kejutan makro ekonomi untuk menguji ketahanan portofolio dan respon Crash Shield.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-1 bg-[#111018] border border-[#1b1926] text-[#ccff00] rounded-lg">
            STRESS TEST SUITE
          </span>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Preset 1: Black Swan Crash */}
          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl flex flex-col justify-between space-y-3 hover:border-red-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#ff3366] uppercase font-mono">Skenario #1</span>
                <TrendingDown className="w-4 h-4 text-[#ff3366]" />
              </div>
              <h4 className="text-xs font-extrabold text-white mt-1">Black Swan Crisis (-15%)</h4>
              <p className="text-[10px] text-[#9f9bac] mt-0.5">Kejatuhan bursa massal. Uji batas pertahanan Crash Shield & rotasi otomatis.</p>
            </div>
            <button
              onClick={() => triggerPost('trigger-crash', null, 'Injeksi Black Swan Crisis (-15%) berhasil dikirim ke seluruh tab!')}
              className="w-full py-2 bg-[#ff3366] hover:bg-[#ff5588] text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#ff3366]/10"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Trigger Black Swan
            </button>
          </div>

          {/* Preset 2: Moderate Correction */}
          <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3 hover:border-[#ccff00]/30 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#00f0ff] uppercase font-mono">Skenario #2</span>
                <Activity className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <h4 className="text-xs font-extrabold text-white mt-1">Koreksi Pasar Sedang (-6%)</h4>
              <p className="text-[10px] text-[#9f9bac] mt-0.5">Penurunan wajar siklus pasar. Uji kestabilan skor kuantitatif saham.</p>
            </div>
            <button
              onClick={() => triggerPost('trigger-stress', { scenario: 'correction' }, 'Koreksi pasar (-6%) diinjeksikan.')}
              className="w-full py-2 bg-[#00f0ff] hover:bg-cyan-300 text-black text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" /> Trigger Koreksi -6%
            </button>
          </div>

          {/* Preset 3: Commodity Rally */}
          <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3 hover:border-amber-500/30 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase font-mono">Skenario #3</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-xs font-extrabold text-white mt-1">Rali Komoditas & Emas (+15%)</h4>
              <p className="text-[10px] text-[#9f9bac] mt-0.5">Lonjakan harga emas & saham pertambangan, perbankan terkoreksi.</p>
            </div>
            <button
              onClick={() => triggerPost('trigger-stress', { scenario: 'gold_rally' }, 'Rali Komoditas & Emas diinjeksikan!')}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" /> Trigger Emas +15%
            </button>
          </div>

          {/* Preset 4: High Inflation & Rate Hike */}
          <div className="p-4 bg-[#111018]/80 border border-[#1b1926] rounded-xl flex flex-col justify-between space-y-3 hover:border-purple-500/30 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-purple-400 uppercase font-mono">Skenario #4</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-xs font-extrabold text-white mt-1">Kenaikan Suku Bunga & USD</h4>
              <p className="text-[10px] text-[#9f9bac] mt-0.5">Depresiasi Rupiah. USD Cash & Emas outperform saham domestik.</p>
            </div>
            <button
              onClick={() => triggerPost('trigger-stress', { scenario: 'inflation' }, 'Skenario inflasi tinggi diinjeksikan!')}
              className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" /> Trigger Inflation Shock
            </button>
          </div>

        </div>

        {/* Custom Parametric Sliders */}
        <div className="pt-4 border-t border-[#1b1926] space-y-4">
          <h4 className="text-xs font-extrabold text-white font-sans flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ccff00]" /> Parameter Stress Test Kustom
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            {/* Equity Shift Slider */}
            <div className="bg-[#111018] p-3 rounded-xl border border-[#1b1926] space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9f9bac]">Guncangan Saham</span>
                <span className={`font-mono font-bold ${customEquity < 0 ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
                  {customEquity}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="20"
                value={customEquity}
                onChange={(e) => setCustomEquity(Number(e.target.value))}
                className="w-full accent-[#ccff00] cursor-pointer"
              />
            </div>

            {/* Gold Shift Slider */}
            <div className="bg-[#111018] p-3 rounded-xl border border-[#1b1926] space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9f9bac]">Apresiasi Emas</span>
                <span className={`font-mono font-bold ${customGold < 0 ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
                  +{customGold}%
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="30"
                value={customGold}
                onChange={(e) => setCustomGold(Number(e.target.value))}
                className="w-full accent-[#00f0ff] cursor-pointer"
              />
            </div>

            {/* USD Shift Slider */}
            <div className="bg-[#111018] p-3 rounded-xl border border-[#1b1926] space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9f9bac]">Kurs USD/IDR</span>
                <span className={`font-mono font-bold ${customUSD < 0 ? 'text-[#ff3366]' : 'text-[#00f5a0]'}`}>
                  +{customUSD}%
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="20"
                value={customUSD}
                onChange={(e) => setCustomUSD(Number(e.target.value))}
                className="w-full accent-[#a855f7] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => triggerPost('trigger-stress', {
              scenario: 'custom',
              customEquity,
              customGold,
              customUSD
            }, `Stress test kustom diinjeksikan: Saham ${customEquity}%, Emas +${customGold}%, USD +${customUSD}%`)}
            className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#ccff00]/10"
          >
            <Zap className="w-4 h-4 fill-current" /> Jalankan Stress Test Kustom
          </button>
        </div>
      </div>
    </div>
  );
};
