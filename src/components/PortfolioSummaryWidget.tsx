import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  YAxis,
  XAxis
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Wallet,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface GrowthPoint {
  time: string;
  date: string;
  balance: number;
}

export const PortfolioSummaryWidget: React.FC = () => {
  const { portfolioConfig } = useAppStore();
  const [growthData, setGrowthData] = useState<GrowthPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(true);

  const capital = portfolioConfig?.capital || 500000000;

  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/portfolio/growth?capital=${capital}`);
      if (res.ok) {
        const json: GrowthPoint[] = await res.json();
        setGrowthData(json);
      }
    } catch (e) {
      console.error('Gagal mengambil data pertumbuhan portfolio:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIAdvice = async () => {
    setAiLoading(true);
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/ai/portfolio-insight`);
      if (res.ok) {
        const json = await res.json();
        setAiAdvice(json.text);
      }
    } catch (e) {
      console.error('Gagal mengambil AI insight:', e);
      setAiAdvice('Sistem beroperasi dalam jaring pengaman optimal. Portofolio defensif Anda terdiversifikasi dengan baik.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
    fetchAIAdvice();
  }, [capital]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  // Calculate stats based on 180 days simulated data
  const hasData = growthData.length >= 2;
  const currentTotal = hasData ? growthData[growthData.length - 1].balance : capital;
  const previousTotal = hasData ? growthData[growthData.length - 2].balance : capital;
  
  const dailyDiff = currentTotal - previousTotal;
  const dailyDiffPct = previousTotal > 0 ? (dailyDiff / previousTotal) * 100 : 0;
  const isPositive = dailyDiff >= 0;

  // Extract last 30 days for sparkline
  const sparklineData = hasData ? growthData.slice(-30) : [];

  return (
    <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
      {/* Left section: Metrics */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-[#9f9bac] tracking-wider font-sans">Portfolio Intelligence Summary</h4>
              <p className="text-[10px] text-[#686477]">Analisis cerdas AI & keuntungan harian Anda secara real-time</p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchGrowthData();
              fetchAIAdvice();
              toast.success('Data intelijen portfolio diperbarui!');
            }}
            className="p-1.5 bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#686477] hover:text-[#ccff00] rounded-lg transition-colors cursor-pointer"
            title="Perbarui Data"
            disabled={loading || aiLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || aiLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading || aiLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-4 bg-[#111018] rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-[#111018] rounded-md w-3/4 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* AI Advisor Column (Col-span-8) */}
            <div className="lg:col-span-8 p-3 rounded-xl bg-[#ccff00]/5 border border-[#ccff00]/15 relative overflow-hidden">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#ccff00] font-mono block">
                ✦ AI TACTICAL ADVICE (KECERDASAN BUATAN)
              </span>
              <p className="text-xs text-white leading-relaxed font-sans mt-1.5 font-medium">
                {aiAdvice || "Analisis kuantitatif mendeteksi momentum pergerakan aman. Sistem jaring pengaman beroperasi penuh."}
              </p>
            </div>

            {/* Daily Return Column (Col-span-4) */}
            <div className="lg:col-span-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#686477] font-mono block">
                Profit / Loss Harian (PnL)
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isPositive ? 'bg-[#00f5a0]/10 text-[#00f5a0]' : 'bg-[#ff3366]/10 text-[#ff3366]'}`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className={`text-base font-bold font-mono ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                    {isPositive ? '+' : ''}{formatIDR(dailyDiff)}
                  </span>
                  <span className={`text-xs font-semibold font-mono ml-2 ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                    ({isPositive ? '+' : ''}{dailyDiffPct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right section: Mini Sparkline Chart */}
      <div className="w-full md:w-64 h-24 bg-[#07060b] border border-[#1b1926] rounded-xl p-3 relative overflow-hidden flex flex-col justify-between shrink-0">
        <div className="flex items-center justify-between text-[9px] text-[#686477] font-mono uppercase font-bold relative z-10">
          <span>Tren 30 Hari Terakhir</span>
          <span className={isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}>
            {isPositive ? 'Bullish' : 'Bearish'}
          </span>
        </div>

        <div className="w-full h-14 relative z-0 mt-1">
          {loading ? (
            <div className="w-full h-full bg-[#111018] rounded animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="0%" 
                      stopColor={isPositive ? '#00f5a0' : '#ff3366'} 
                      stopOpacity={0.25} 
                    />
                    <stop 
                      offset="100%" 
                      stopColor={isPositive ? '#00f5a0' : '#ff3366'} 
                      stopOpacity={0.0} 
                    />
                  </linearGradient>
                </defs>
                <YAxis domain={['auto', 'auto']} hide />
                <XAxis dataKey="date" hide />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke={isPositive ? '#00f5a0' : '#ff3366'} 
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#sparklineGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
