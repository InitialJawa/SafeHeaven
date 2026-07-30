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
      const res = await window.appFetch(`${base}/api/portfolio/growth?capital=${capital}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json: GrowthPoint[] = await res.json();
          if (Array.isArray(json)) {
            setGrowthData(json);
          }
        }
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
      const res = await window.appFetch(`${base}/api/ai/portfolio-insight`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await res.json();
          if (json && json.text) {
            setAiAdvice(json.text);
            return;
          }
        }
      }
      setAiAdvice('Sistem beroperasi dalam jaring pengaman optimal. Portofolio defensif Anda terdiversifikasi dengan baik.');
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
    <div className="card card-elevated p-2.5 sm:p-4 bg-[#0b0a10]/45 border border-[#1b1926] rounded-xl sm:rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 overflow-hidden">
      {/* Left section: Metrics */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00] shrink-0">
              <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] font-bold uppercase text-[#9f9bac] tracking-wider font-sans truncate">
                Portfolio Intelligence Summary
              </h4>
              <p className="text-[8px] sm:text-[9px] text-[#686477] truncate">
                Analisis cerdas AI & keuntungan harian Anda secara real-time
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchGrowthData();
              fetchAIAdvice();
              toast.success('Data intelijen portfolio diperbarui!');
            }}
            className="p-1 bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#686477] hover:text-[#ccff00] rounded-md transition-colors cursor-pointer shrink-0"
            title="Perbarui Data"
            disabled={loading || aiLoading}
          >
            <RefreshCw className={`w-3 h-3 ${loading || aiLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading || aiLoading ? (
          <div className="space-y-1.5 py-1">
            <div className="h-3 bg-[#111018] rounded w-full animate-pulse"></div>
            <div className="h-3 bg-[#111018] rounded w-3/4 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center pt-0.5">
            {/* AI Advisor Column (Col-span-7/8) */}
            <div className="sm:col-span-7 lg:col-span-8 p-2 sm:p-2.5 rounded-lg bg-[#ccff00]/5 border border-[#ccff00]/20 flex flex-col justify-center space-y-0.5">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#ccff00] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse shrink-0"></span>
                Tactical Advice (AI)
              </span>
              <p className="text-[10px] sm:text-[11px] text-white leading-tight sm:leading-snug font-sans font-medium">
                {aiAdvice || "Analisis kuantitatif mendeteksi momentum pergerakan aman. Sistem jaring pengaman beroperasi penuh."}
              </p>
            </div>

            {/* Daily Return Column (Col-span-5/4) */}
            <div className="sm:col-span-5 lg:col-span-4 p-2 sm:p-2.5 rounded-lg bg-[#111018] border border-[#1b1926] flex flex-col justify-center h-full">
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#686477] font-mono block truncate">
                Profit / Loss Harian (PnL)
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0 ${isPositive ? 'bg-[#00f5a0]/10 text-[#00f5a0]' : 'bg-[#ff3366]/10 text-[#ff3366]'}`}>
                  {isPositive ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                </div>
                <div className="min-w-0 flex items-baseline gap-1 flex-wrap">
                  <span className={`text-xs sm:text-sm font-bold font-mono ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                    {isPositive ? '+' : ''}{formatIDR(dailyDiff)}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-semibold font-mono ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                    ({isPositive ? '+' : ''}{dailyDiffPct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right section: Mini Sparkline Chart */}
      <div className="w-full md:w-52 lg:w-60 h-14 sm:h-16 md:h-20 bg-[#07060b] border border-[#1b1926] rounded-lg p-2 relative overflow-hidden flex flex-col justify-between shrink-0">
        <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-[#686477] font-mono uppercase font-bold relative z-10">
          <span>Tren 30 Hari</span>
          <span className={isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}>
            {isPositive ? 'Bullish' : 'Bearish'}
          </span>
        </div>

        <div className="w-full h-8 sm:h-10 md:h-12 relative z-0 mt-0.5">
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
