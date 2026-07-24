/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores';
import { TickerLogo } from '../components/TickerLogo';
import { Shield, ShieldAlert, CheckCircle, Flame, RefreshCcw, Skull, Calculator, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton, SkeletonCard } from '../components/Skeleton';

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

  // DCA Simulator state
  const [selectedDcaSymbol, setSelectedDcaSymbol] = useState('BBCA');
  const [currentLots, setCurrentLots] = useState(10);
  const [dcaLots, setDcaLots] = useState(5);

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
      <div className="px-6 space-y-6 pb-20 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <Skeleton className="w-1.5 h-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-64 rounded-lg" />
            <Skeleton className="h-3.5 w-80 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-44" />
        </div>

        <SkeletonCard className="h-80" />
      </div>
    );
  }

  if (!data) return null;

  const activeAsset = data.assets.find(a => a.symbol === selectedDcaSymbol) || data.assets[0];
  const oldAvg = activeAsset ? activeAsset.buyPrice : 10000;
  const curPrice = activeAsset ? activeAsset.currentPrice : 8900;
  const totalOldShares = currentLots * 100;
  const totalDcaShares = dcaLots * 100;
  const totalCostBefore = totalOldShares * oldAvg;
  const totalCostNew = totalDcaShares * curPrice;
  const newAvgPrice = (totalOldShares + totalDcaShares) > 0 ? Math.round((totalCostBefore + totalCostNew) / (totalOldShares + totalDcaShares)) : oldAvg;

  return (
    <div id="risk-view" className="px-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Risk Control & Protection</h1>
          <p className="text-xs text-[#9f9bac] font-sans mt-0.5">
            <strong className="text-white">Info Antar Tab:</strong> Saham <strong className="text-[#00f5a0]">"Akumulasi"</strong> fundamental kuat yang turun <span className="text-[#ff3366]">-10%</span> masuk ke <strong className="text-[#ccff00]">Risk Control (Triggered)</strong> sebagai peluang <strong className="text-[#ccff00]">Cicil Beli (DCA)</strong>.
          </p>
        </div>
      </div>

      {/* Control row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Stop Loss State */}
        <div className={`card card-elevated p-5 flex flex-col justify-between border-l-2 bg-[#0b0a10]/45 ${data.stopLossTriggered ? 'border-l-[#ff3366] shadow-lg shadow-[#ff3366]/5' : 'border-l-[#ccff00] shadow-lg shadow-[#ccff00]/5'}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Sinyal Rotasi & Trigger</span>
              <h2 className="text-base font-extrabold text-white font-sans">
                {data.stopLossTriggered ? 'STOP LOSS AKTIF' : 'Sistem Aman'}
              </h2>
              <p className="text-[10px] text-[#9f9bac] font-sans">Deteksi deviasi negatif bursa.</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.stopLossTriggered ? 'bg-[#ff3366]/15 text-[#ff3366]' : 'bg-[#ccff00]/15 text-[#ccff00]'}`}>
              {data.stopLossTriggered ? <Flame className="w-4 h-4 animate-bounce" /> : <CheckCircle className="w-4 h-4" />}
            </div>
          </div>
          {data.stopLossTriggered && (
            <div className="pt-3 mt-3 border-t border-[#1b1926]">
              <button
                id="bypass-stoploss-btn"
                onClick={() => handleAction('bypass')}
                className="w-full py-2 bg-[#ff3366] hover:bg-[#ff5588] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#ff3366]/15 active:scale-95"
              >
                <Skull className="w-3.5 h-3.5" /> Bypass Stop Loss Sementara
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Crash Shield */}
        <div className={`card card-elevated p-5 flex flex-col justify-between border-l-2 bg-[#0b0a10]/45 ${data.crashShieldActive ? 'border-l-[#f59e0b] shadow-lg shadow-[#f59e0b]/5' : 'border-l-[#ccff00] shadow-lg shadow-[#ccff00]/5'}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Multi-Tier Shield</span>
              <h2 className="text-base font-extrabold text-white font-sans">
                {data.crashShieldActive ? 'SHIELD PROTECT ON' : 'Deaktif / Normal'}
              </h2>
              <p className="text-[10px] text-[#9f9bac] font-sans">Langkah hedging otomatis emas.</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.crashShieldActive ? 'bg-[#f59e0b]/15 text-[#f59e0b]' : 'bg-[#ccff00]/15 text-[#ccff00]'}`}>
              <Shield className="w-4 h-4" />
            </div>
          </div>
          {data.crashShieldActive && (
            <div className="pt-3 mt-3 border-t border-[#1b1926]">
              <button
                id="reset-shield-btn"
                onClick={() => handleAction('reset')}
                className="w-full py-2 bg-[#f59e0b] hover:bg-[#f6b02f] text-[#000] text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#f59e0b]/15 active:scale-95"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Reset Crash Shield (Mulai Ulang)
              </button>
            </div>
          )}
        </div>

        {/* Card 3: Dynamic Buffer */}
        <div className="card card-elevated p-5 flex items-center justify-between border-l-2 border-l-[#00f0ff] bg-[#0b0a10]/45 shadow-lg shadow-[#00f0ff]/5">
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Dynamic Drawdown Buffer</span>
            <h2 className="text-base font-extrabold font-mono text-white">
              {data.dynamicBufferPercent}%
            </h2>
            <p className="text-[10px] text-[#9f9bac] font-sans">Toleransi deviasi momentum.</p>
          </div>
          <div className="w-10 h-10 bg-[#00f0ff]/15 rounded-xl flex items-center justify-center text-[#00f0ff] shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Interactive DCA (Dollar Cost Averaging) Simulator for Triggered Stocks */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#ccff00]" />
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">Simulator Cicil Beli (DCA / Averaging Down) untuk Saham Triggered</h3>
          </div>
          <span className="text-[10px] px-2.5 py-1 bg-[#ccff00]/10 text-[#ccff00] rounded-lg font-mono font-bold">Alat Bantu Pemula</span>
        </div>
        <p className="text-xs text-[#9f9bac] font-sans">
          Ketika saham fundamental bagus (<span className="text-[#00f5a0]">Akumulasi</span>) mengalami koreksi harga di bawah batas risiko, gunakan kalkulator ini untuk menghitung harga rata-rata baru jika Anda menambah kepemilikan di harga diskon.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Select Ticker */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider">Pilih Saham</label>
            <select
              value={selectedDcaSymbol}
              onChange={(e) => setSelectedDcaSymbol(e.target.value)}
              className="w-full bg-[#111018] border border-[#1b1926] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#ccff00]"
            >
              {data.assets.map((a) => (
                <option key={a.symbol} value={a.symbol}>{a.symbol} (Beli: Rp {a.buyPrice.toLocaleString()} | Live: Rp {a.currentPrice.toLocaleString()})</option>
              ))}
            </select>
          </div>

          {/* Current Lots */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider">Lot Saat Ini</label>
            <input
              type="number"
              min="1"
              value={currentLots}
              onChange={(e) => setCurrentLots(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-[#111018] border border-[#1b1926] text-white font-mono text-xs rounded-xl p-3 focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          {/* Additional Lots to DCA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider">Tambah Lot (DCA)</label>
            <input
              type="number"
              min="1"
              value={dcaLots}
              onChange={(e) => setDcaLots(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-[#111018] border border-[#1b1926] text-white font-mono text-xs rounded-xl p-3 focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          {/* Result Card */}
          <div className="bg-[#111018] border border-[#1b1926] rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[10px] text-[#686477] uppercase font-extrabold">Harga Rata-Rata Baru (DCA)</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#9f9bac] line-through font-mono">Rp {oldAvg.toLocaleString()}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ccff00]" />
              <span className="text-sm font-extrabold text-[#00f5a0] font-mono">Rp {newAvgPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
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
