/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { TickerLogo } from '../components/TickerLogo';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp, Award, Calendar, Layers, ShieldCheck, DollarSign } from 'lucide-react';
import { RegimeTreemap } from '../components/RegimeTreemap';

interface AnalyticsData {
  scoredToday: number;
  scoreDate: string;
  marketRegime: string;
  sectorAverages: { sector: string; score: number }[];
  topGainers: { symbol: string; name: string; price: number; changePercent: number; score: number }[];
  topLosers: { symbol: string; name: string; price: number; changePercent: number; score: number }[];
  marketStats: {
    marketCap: string;
    usdIdr: string;
    goldPrice: string;
  };
  regimeDistribution: { name: string; value: number }[];
}

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [ihsgData, setIhsgData] = useState<any[]>([]);
  const [ihsgRange, setIhsgRange] = useState('1M');
  const [marketIndex, setMarketIndex] = useState('LQ45');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/analytics/dashboard?index=${marketIndex}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [marketIndex]);

  useEffect(() => {
    const fetchIhsg = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/market/ihsg?range=${ihsgRange}`);
        if(res.ok) {
            const data = await res.json();
            setIhsgData(data);
        }
      } catch (err) {
        console.error('Error fetching IHSG data:', err);
      }
    };
    fetchIhsg();
  }, [ihsgRange]);

  const scoreDistData = [
    { range: '0-20', count: 1 },
    { range: '20-39', count: 3 },
    { range: '40-59', count: 8 },
    { range: '60-79', count: 18 },
    { range: '80-100', count: 12 },
  ];

  const COLORS = ['#ccff00', '#00f0ff', '#a855f7', '#ff3366'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
        <p className="text-xs text-[#9f9bac] mt-4 font-sans uppercase tracking-wider">Menghubungkan Mesin Analitik...</p>
      </div>
    );
  }

  if (!data) return null;

  // Calculate EMA
  const calculateEMA = (data: any[], period: number) => {
    if (!data || data.length === 0) return [];
    const k = 2 / (period + 1);
    let ema = [data[0].value];
    for (let i = 1; i < data.length; i++) {
      ema.push((data[i].value - ema[i - 1]) * k + ema[i - 1]);
    }
    return data.map((d, i) => ({ ...d, ema: ema[i] }));
  };

  const ihsgWithEma = calculateEMA(ihsgData, 20);

  return (
    <div id="analytics-view" className="px-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Market Analytics & Regime</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Distribusi skor spasial fundamental bursa saham LQ45 secara real-time.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-4.5 py-2 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#ccff00]" />
            <div className="text-left">
              <div className="text-[9px] uppercase text-[#686477] font-bold font-sans">Market Regime</div>
              <div className="text-xs text-white font-extrabold font-sans">{data.marketRegime}</div>
            </div>
          </div>
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-4.5 py-2 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#00f0ff]" />
            <div className="text-left">
              <div className="text-[9px] uppercase text-[#686477] font-bold font-sans">Score Update</div>
              <div className="text-xs text-white font-extrabold font-mono">{data.scoreDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card card-elevated p-5 flex items-center justify-between bg-[#0b0a10]/45">
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Kapitalisasi Pasar</span>
            <h3 className="text-sm font-extrabold text-white font-mono">{data.marketStats.marketCap}</h3>
          </div>
          <div className="text-[#00f5a0] text-xs font-bold font-mono">+0.4% d/d</div>
        </div>
        <div className="card card-elevated p-5 flex items-center justify-between bg-[#0b0a10]/45">
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Nilai Tukar USD/IDR</span>
            <h3 className="text-sm font-extrabold text-white font-mono">{data.marketStats.usdIdr}</h3>
          </div>
          <div className="text-[#ff3366] text-xs font-bold font-mono">+0.12% d/d</div>
        </div>
        <div className="card card-elevated p-5 flex items-center justify-between bg-[#0b0a10]/45">
          <div className="space-y-1">
            <span className="text-[10px] text-[#686477] font-bold uppercase tracking-wider font-sans">Harga Emas Spot</span>
            <h3 className="text-sm font-extrabold text-white font-mono">{data.marketStats.goldPrice}</h3>
          </div>
          <div className="text-[#00f5a0] text-xs font-bold font-mono">+0.85% d/d</div>
        </div>
      </div>

      {/* Score and Sector charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* IHSG Price Chart */}
        <div className="card card-elevated p-6 lg:col-span-9 flex flex-col bg-[#0b0a10]/45">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-1">IHSG (Indeks Harga Saham Gabungan)</h3>
              <p className="text-[11px] text-[#686477] font-sans">Pergerakan harga historis dan real-time.</p>
            </div>
            <div className="flex gap-1 bg-[#111018] p-1 rounded-lg">
              {['1D', '1M', '3M', '1Y', '5Y', '10Y', 'Life'].map(range => (
                <button
                  key={range}
                  onClick={() => setIhsgRange(range)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${ihsgRange === range ? 'bg-[#1b1926] text-white' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-64 font-mono text-[9px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ihsgWithEma}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b1926" />
                <XAxis dataKey="date" stroke="#686477" />
                <YAxis stroke="#686477" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0b12', borderColor: '#1b1926', borderRadius: '12px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#ccff00' }}
                />
                <Area type="monotone" dataKey="value" stroke="#ccff00" fillOpacity={1} fill="url(#colorValue)" />
                <Line type="monotone" dataKey="ema" stroke="#00f0ff" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regime Distribution */}
        <RegimeTreemap distribution={data.regimeDistribution} />
      </div>

      {/* Top Gainers / Losers tables side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Gainers */}
        <div className="card card-elevated p-6 bg-[#0b0a10]/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#00f5a0] tracking-tight font-sans flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5" /> Top Gainers ({marketIndex})
            </h3>
            <div className="flex gap-1 bg-[#111018] p-1 rounded-lg">
              {['LQ45', 'IDX30', 'IDX80'].map(index => (
                <button
                  key={index}
                  onClick={() => setMarketIndex(index)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${marketIndex === index ? 'bg-[#1b1926] text-white' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'}`}
                >
                  {index}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#1b1926] text-[#686477]">
                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                  <th className="pb-3 font-bold text-center uppercase tracking-wider text-[10px]">Score</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Harga</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926] font-mono">
                {data.topGainers.map((t) => (
                  <tr key={t.symbol} className="hover:bg-[#111018]/40 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <TickerLogo symbol={t.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                        <span className="font-extrabold text-white">{t.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-[#ccff00] font-extrabold">{t.score}</td>
                    <td className="py-3.5 text-right text-white">Rp {t.price.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-right text-[#00f5a0] font-extrabold">+{t.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Losers */}
        <div className="card card-elevated p-6 bg-[#0b0a10]/45">
          <h3 className="text-sm font-bold text-[#ff3366] tracking-tight font-sans mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 rotate-180" /> Top Losers ({marketIndex})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#1b1926] text-[#686477]">
                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Ticker</th>
                  <th className="pb-3 font-bold text-center uppercase tracking-wider text-[10px]">Score</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Harga</th>
                  <th className="pb-3 font-bold text-right uppercase tracking-wider text-[10px]">Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1926] font-mono">
                {data.topLosers.map((t) => (
                  <tr key={t.symbol} className="hover:bg-[#111018]/40 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <TickerLogo symbol={t.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                        <span className="font-extrabold text-white">{t.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-[#00f0ff] font-extrabold">{t.score}</td>
                    <td className="py-3.5 text-right text-white">Rp {t.price.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 text-right text-[#ff3366] font-extrabold">{t.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
