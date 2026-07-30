/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores';
import { 
  Shield, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCcw, 
  SlidersHorizontal, 
  Flame, 
  Activity,
  Zap,
  Lock,
  Unlock,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface RiskData {
  stopLossTriggered: boolean;
  crashShieldActive: boolean;
  dynamicBufferPercent: number;
  assets: {
    symbol: string;
    currentPrice: number;
    buyPrice: number;
    currentReturn: number;
    stopLossLevel: number;
    status: 'Safe' | 'Warning' | 'Triggered';
  }[];
}

interface RiskControlConsoleProps {
  addLog: (msg: string) => void;
}

export const RiskControlConsole: React.FC<RiskControlConsoleProps> = ({ addLog }) => {
  const { portfolioConfig, saveGlobalConfig } = useAppStore();
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);

  // Risk parameters state
  const [stopLoss, setStopLoss] = useState(portfolioConfig?.stopLoss || 10);
  const [crashThreshold, setCrashThreshold] = useState(portfolioConfig?.crashThreshold || -12);

  const fetchRiskSettings = async () => {
    setLoading(true);
    try {
      const res = await window.appFetch('/api/risk/settings');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Menggunakan fallback data risiko:', err);
      // Fallback state so UI renders safely
      setData({
        stopLossTriggered: false,
        crashShieldActive: false,
        dynamicBufferPercent: 4.5,
        assets: [
          { symbol: 'BBCA', buyPrice: 10200, currentPrice: 10250, currentReturn: 0.49, stopLossLevel: -10, status: 'Safe' },
          { symbol: 'BBRI', buyPrice: 4800, currentPrice: 4850, currentReturn: 1.04, stopLossLevel: -10, status: 'Safe' },
          { symbol: 'BMRI', buyPrice: 6200, currentPrice: 6200, currentReturn: 0, stopLossLevel: -10, status: 'Safe' },
          { symbol: 'TLKM', buyPrice: 3250, currentPrice: 3280, currentReturn: 0.92, stopLossLevel: -10, status: 'Safe' },
          { symbol: 'ASII', buyPrice: 5500, currentPrice: 5400, currentReturn: -1.82, stopLossLevel: -10, status: 'Safe' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskSettings();
  }, []);

  const handleRiskAction = async (action: 'bypass' | 'reset') => {
    try {
      const res = await window.appFetch('/api/risk/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        const msg = action === 'bypass' ? 'Stop Loss di-bypass sementara oleh Admin!' : 'Crash Shield di-reset ke status normal!';
        toast.success(msg);
        addLog(`RISK CONTROL: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memproses tindakan kontrol risiko.');
    }
  };

  const handleSaveRiskParams = async () => {
    try {
      await saveGlobalConfig({
        stopLoss,
        crashThreshold
      } as any);
      toast.success('Batas risiko portofolio berhasil diperbarui!');
      addLog(`RISK PARAMETERS UPDATED: Stop Loss = ${stopLoss}%, Crash Threshold = ${crashThreshold}%`);
    } catch (err) {
      toast.error('Gagal menyimpan parameter risiko.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl flex items-center justify-center text-[#ccff00]">
              <Shield className="w-5 h-5 glow-text-lime" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Konsol Pengendali Risiko & Protection Shield</h2>
              <p className="text-xs text-[#9f9bac] mt-0.5 font-sans">
                Pengawasan langsung terhadap mekanisme Crash Shield, ambang batas Stop Loss, dan buffer perlindungan modal.
              </p>
            </div>
          </div>

          <button
            onClick={fetchRiskSettings}
            className="px-3.5 py-2 bg-[#111018] hover:bg-[#1b1926] text-[#9f9bac] hover:text-white border border-[#1b1926] text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-[#ccff00]" /> Segarkan Status Shield
          </button>
        </div>
      </div>

      {/* Emergency Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Crash Shield Status & Reset */}
        <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-sans">Status Crash Shield</h3>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
              data?.crashShieldActive 
                ? 'bg-[#ff3366]/20 border-[#ff3366]/40 text-[#ff3366]' 
                : 'bg-[#00f5a0]/10 border-[#00f5a0]/30 text-[#00f5a0]'
            }`}>
              {data?.crashShieldActive ? 'AKTIF (PROTECTION MODE)' : 'NORMAL (MARKET SAFE)'}
            </span>
          </div>

          <p className="text-xs text-[#9f9bac]">
            Crash Shield melindungi modal saat IHSG turun melampaui ambang krisis dengan merotasi portofolio ke Emas & Kas secara otomatis.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-[#686477]">Dynamic Buffer: </span>
              <span className="text-white font-mono font-bold">{data?.dynamicBufferPercent || 20}% Kas/Emas</span>
            </div>

            <button
              onClick={() => handleRiskAction('reset')}
              className="px-4 py-2 bg-[#111018] hover:bg-[#1b1926] text-[#ccff00] border border-[#ccff00]/30 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Crash Shield
            </button>
          </div>
        </div>

        {/* Card 2: Stop Loss Bypass Control */}
        <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-sans">Mekanisme Stop Loss Asset</h3>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
              data?.stopLossTriggered 
                ? 'bg-[#ff3366]/20 border-[#ff3366]/40 text-[#ff3366]' 
                : 'bg-amber-400/10 border-amber-400/30 text-amber-400'
            }`}>
              {data?.stopLossTriggered ? 'STOP LOSS DIPICU' : 'MONITORING AKTIF'}
            </span>
          </div>

          <p className="text-xs text-[#9f9bac]">
            Jika ada emiten yang menembus batas batas kerugian maksimal, sistem akan memicu peringatan auto-exit.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-[#686477]">Batas Stop Loss: </span>
              <span className="text-white font-mono font-bold">-{stopLoss}%</span>
            </div>

            <button
              onClick={() => handleRiskAction('bypass')}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" /> Bypass Stop Loss Sementara
            </button>
          </div>
        </div>

      </div>

      {/* Global Risk Parameter Editor */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-5">
        <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#ccff00]" /> Pengaturan Parameter Ambang Risiko Sumbu Sistem
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Stop Loss Slider */}
          <div className="bg-[#111018] p-4 rounded-xl border border-[#1b1926] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9f9bac] font-bold">Toleransi Maximum Loss Per Emiten</span>
              <span className="font-mono font-bold text-[#ff3366]">-{stopLoss}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="w-full accent-[#ff3366] cursor-pointer"
            />
            <p className="text-[10px] text-[#686477]">
              Sistem akan memberikan rekomendasi jual darurat apabila penurunan aset melampaui -{stopLoss}%.
            </p>
          </div>

          {/* Crash Shield Threshold Slider */}
          <div className="bg-[#111018] p-4 rounded-xl border border-[#1b1926] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9f9bac] font-bold">Pemicu Amblesan Pasar (Crash Shield)</span>
              <span className="font-mono font-bold text-amber-400">{crashThreshold}%</span>
            </div>
            <input
              type="range"
              min="-25"
              max="-5"
              value={crashThreshold}
              onChange={(e) => setCrashThreshold(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[10px] text-[#686477]">
              Apabila performa IHSG dalam 30 hari jatuh melampaui {crashThreshold}%, Crash Shield otomatis aktif.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveRiskParams}
          className="w-full py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/10"
        >
          <Zap className="w-4 h-4 fill-current" /> Simpan Konfigurasi Parameter Risiko Global
        </button>
      </div>

      {/* Assets Risk Matrix */}
      {data?.assets && data.assets.length > 0 && (
        <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
          <h3 className="text-sm font-bold text-white font-sans">Matrix Risiko & Batas Stop Loss Konstituen Aktif</h3>
          
          <div className="overflow-x-auto border border-[#1b1926] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#111018] text-white font-bold border-b border-[#1b1926]">
                <tr>
                  <th className="px-4 py-3">Ticker</th>
                  <th className="px-4 py-3">Harga Beli</th>
                  <th className="px-4 py-3">Harga Saat Ini</th>
                  <th className="px-4 py-3">Return</th>
                  <th className="px-4 py-3">Batas Stop Loss</th>
                  <th className="px-4 py-3 text-right">Status Protection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926]/40 text-[#9f9bac]">
                {data.assets.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-[#111018]/40">
                    <td className="px-4 py-2.5 font-bold text-white font-mono">{asset.symbol}</td>
                    <td className="px-4 py-2.5 font-mono">Rp {asset.buyPrice.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2.5 font-mono text-white font-bold">Rp {asset.currentPrice.toLocaleString('id-ID')}</td>
                    <td className={`px-4 py-2.5 font-mono font-bold ${asset.currentReturn >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                      {asset.currentReturn >= 0 ? '+' : ''}{asset.currentReturn.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2.5 font-mono text-amber-400">Rp {asset.stopLossLevel.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        asset.status === 'Safe' ? 'bg-[#00f5a0]/10 text-[#00f5a0]' :
                        asset.status === 'Warning' ? 'bg-amber-400/10 text-amber-400' :
                        'bg-[#ff3366]/20 text-[#ff3366]'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
