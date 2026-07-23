/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores';
import { TickerLogo } from '../components/TickerLogo';
import { Shield, ShieldAlert, CheckCircle, Flame, RefreshCcw, Skull } from 'lucide-react';
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

export const Risk: React.FC = () => {
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRiskSettings = async () => {
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/risk/settings`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching risk settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskSettings();
  }, []);

  const handleAction = async (action: 'bypass' | 'reset') => {
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/risk/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        toast.success(action === 'bypass' ? 'Stop Loss berhasil di-bypass sementara!' : 'Crash Shield berhasil di-reset!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
        <p className="text-xs text-[#9f9bac] mt-4 font-sans uppercase tracking-wider font-extrabold">Memuat Evaluasi Proteksi Risiko...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div id="risk-view" className="px-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Risk Control & Protection</h1>
          <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Sistem mitigasi penarikan dana ekstrem, proteksi stop-loss, dan pemantauan Multi-Tier Rotation.</p>
        </div>
      </div>

      {/* Control row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Stop Loss State */}
        <div className={`card card-elevated p-6 flex items-center justify-between border-l-2 bg-[#0b0a10]/45 ${data.stopLossTriggered ? 'border-l-[#ff3366] shadow-lg shadow-[#ff3366]/5' : 'border-l-[#ccff00] shadow-lg shadow-[#ccff00]/5'}`}>
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Sinyal Rotasi & Trigger</span>
            <h2 className="text-lg font-extrabold text-white font-sans">
              {data.stopLossTriggered ? 'STOP LOSS AKTIF' : 'Sistem Aman'}
            </h2>
            <p className="text-[10px] text-[#9f9bac] font-sans font-medium">Deteksi deviasi negatif bursa.</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.stopLossTriggered ? 'bg-[#ff3366]/15 text-[#ff3366]' : 'bg-[#ccff00]/15 text-[#ccff00]'}`}>
            {data.stopLossTriggered ? <Flame className="w-5 h-5 animate-bounce" /> : <CheckCircle className="w-5 h-5" />}
          </div>
        </div>

        {/* Card 2: Crash Shield */}
        <div className={`card card-elevated p-6 flex items-center justify-between border-l-2 bg-[#0b0a10]/45 ${data.crashShieldActive ? 'border-l-[#f59e0b] shadow-lg shadow-[#f59e0b]/5' : 'border-l-[#ccff00] shadow-lg shadow-[#ccff00]/5'}`}>
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Multi-Tier Shield</span>
            <h2 className="text-lg font-extrabold text-white font-sans">
              {data.crashShieldActive ? 'SHIELD PROTECT ON' : 'Deaktif / Normal'}
            </h2>
            <p className="text-[10px] text-[#9f9bac] font-sans font-medium">Langkah hedging otomatis emas.</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.crashShieldActive ? 'bg-[#f59e0b]/15 text-[#f59e0b]' : 'bg-[#ccff00]/15 text-[#ccff00]'}`}>
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Dynamic Buffer */}
        <div className="card card-elevated p-6 flex items-center justify-between border-l-2 border-l-[#00f0ff] bg-[#0b0a10]/45 shadow-lg shadow-[#00f0ff]/5">
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Dynamic Drawdown Buffer</span>
            <h2 className="text-lg font-extrabold font-mono text-white">
              {data.dynamicBufferPercent}%
            </h2>
            <p className="text-[10px] text-[#9f9bac] font-sans font-medium">Toleransi deviasi momentum.</p>
          </div>
          <div className="w-12 h-12 bg-[#00f0ff]/15 rounded-xl flex items-center justify-center text-[#00f0ff]">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Trigger control actions */}
      <div className="flex gap-3">
        {data.stopLossTriggered && (
          <button
            id="bypass-stoploss-btn"
            onClick={() => handleAction('bypass')}
            className="px-4.5 py-3 bg-[#ff3366] hover:bg-[#ff5588] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ff3366]/20 active:scale-95"
          >
            <Skull className="w-4 h-4" /> Bypass Stop Loss Sementara
          </button>
        )}
        {data.crashShieldActive && (
          <button
            id="reset-shield-btn"
            onClick={() => handleAction('reset')}
            className="px-4.5 py-3 bg-[#f59e0b] hover:bg-[#f6b02f] text-[#000] text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#f59e0b]/20 active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" /> Reset Crash Shield (Mulai Ulang)
          </button>
        )}
      </div>

      {/* Table: Asset levels risk checking */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45">
        <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-4">Tingkat Proteksi Konstituen & Triggered Alerts (Watchlist Rotasi)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#1b1926] text-[#686477]">
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Harga Beli</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Harga Bursa Live</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-center">Batas Stop Loss</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Return Saat Ini</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Status Risiko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1926] font-mono">
              {data.assets.map((asset) => {
                const isWarn = asset.status === 'Warning';
                const isTrig = asset.status === 'Triggered';
                return (
                  <tr key={asset.symbol} className={`hover:bg-[#111018]/40 transition-colors ${isTrig ? 'bg-[#ff3366]/5' : ''}`}>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <TickerLogo symbol={asset.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                        <span className="font-extrabold text-white">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#9f9bac]">Rp {asset.buyPrice.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-white font-semibold">Rp {asset.currentPrice.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-center text-[#ff3366] font-extrabold">{asset.stopLossLevel}%</td>
                    <td className={`py-3.5 text-right font-extrabold ${asset.currentReturn >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                      {asset.currentReturn >= 0 ? '+' : ''}{asset.currentReturn.toFixed(2)}%
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        isTrig ? 'bg-[#ff3366]/10 text-[#ff3366] border-[#ff3366]/25' :
                        isWarn ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/25' :
                        'bg-[#00f5a0]/10 text-[#00f5a0] border-[#00f5a0]/25'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
