import React, { useEffect, useState, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  PieChart as PieIcon, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  Info,
  Clock,
  Target,
  BarChart2,
  Percent,
  ExternalLink,
  Newspaper,
  Globe,
  Search,
  RefreshCw,
  Filter,
  ThumbsUp,
  Flame,
  Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ReferenceLine
} from 'recharts';
import { Skeleton, SkeletonGauge, SkeletonChart } from './Skeleton';

interface WidgetKinerjaProps {
  symbol: string;
}

export const WidgetKinerja: React.FC<WidgetKinerjaProps> = ({ symbol }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/widgets/kinerja?symbol=${symbol}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching kinerja:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] h-[220px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-sm" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const periods = [
    { label: '1Mgg', value: data.w1 },
    { label: '1Bln', value: data.m1 },
    { label: '3Bln', value: data.m3 },
    { label: '6Bln', value: data.m6 },
    { label: 'YTD', value: data.ytd },
    { label: '1Thn', value: data.y1 },
  ];

  return (
    <div className="bg-[#0b0a10]/60 border border-[#1b1926] rounded-2xl p-4 flex flex-col justify-between hover:border-[#ccff00]/30 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white tracking-tight font-sans flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#ccff00]" />
            Kinerja {symbol === '^JKSE' || symbol === 'IHSG' ? 'IHSG' : symbol}
          </h3>
          {data.isFallback && (
            <span className="text-[8px] text-[#686477] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5">Simulated Feed</span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2.5">
          {periods.map((p, idx) => {
            const isPositive = p.value >= 0;
            return (
              <div key={idx} className="bg-[#111018] p-2.5 rounded-xl border border-[#1b1926] flex flex-col justify-between">
                <span className="text-[10px] text-[#686477] font-bold font-sans">{p.label}</span>
                <div className="flex items-center gap-1 mt-1">
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-[#00f5a0]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-[#ff3366]" />
                  )}
                  <span className={`text-[11px] font-bold font-mono ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                    {isPositive ? '+' : ''}{p.value.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


interface WidgetMusimanProps {
  symbol: string;
}

export const WidgetMusiman: React.FC<WidgetMusimanProps> = ({ symbol }) => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/widgets/musiman?symbol=${symbol}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching musiman:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-sm" />
        </div>
        <SkeletonChart height="h-[220px]" />
      </div>
    );
  }

  if (!data) return null;

  const formatXAxis = (tickItem: string) => {
    const w = parseInt(tickItem.replace('W', ''), 10);
    if (w === 1) return 'Jan';
    if (w === 5) return 'Feb';
    if (w === 9) return 'Mar';
    if (w === 13) return 'Q1';
    if (w === 18) return 'Apr';
    if (w === 22) return 'Mei';
    if (w === 26) return 'Q2';
    if (w === 31) return 'Jul';
    if (w === 35) return 'Agst';
    if (w === 39) return 'Q3';
    if (w === 44) return 'Nov';
    if (w === 48) return 'Des';
    if (w === 52) return 'Q4';
    return '';
  };

  return (
    <div className="bg-[#0b0a10]/60 border border-[#1b1926] rounded-2xl p-4 flex flex-col justify-between hover:border-[#ccff00]/30 transition-all">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white tracking-tight font-sans flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#ccff00]" />
            Analisis Musiman {symbol === '^JKSE' || symbol === 'IHSG' ? 'IHSG' : symbol} (%)
          </h3>
          <span className="text-[9px] text-[#686477] font-mono">Mingguan (Weekly) • Garis Quartal</span>
        </div>

        <div className="h-[185px] w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="week" 
                stroke="#686477" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                interval={0}
                tickFormatter={formatXAxis}
              />
              <YAxis 
                stroke="#686477" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0b0a10', borderColor: '#1b1926', borderRadius: '12px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                itemStyle={{ fontSize: '11px' }}
                formatter={(value: any) => [value !== null && value !== undefined ? `${value}%` : 'N/A']}
                labelFormatter={(label) => `Minggu ke-${label.replace('W', '')}`}
              />
              <Legend 
                verticalAlign="top" 
                height={30} 
                iconType="circle" 
                iconSize={7} 
                wrapperStyle={{ fontSize: '10px', color: '#9f9bac' }}
              />

              {/* Quarterly Thin Reference Lines */}
              <ReferenceLine x="W13" stroke="rgba(204, 255, 0, 0.35)" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Q1', fill: '#ccff00', fontSize: 9, position: 'top', fontWeight: 'bold' }} />
              <ReferenceLine x="W26" stroke="rgba(204, 255, 0, 0.35)" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Q2', fill: '#ccff00', fontSize: 9, position: 'top', fontWeight: 'bold' }} />
              <ReferenceLine x="W39" stroke="rgba(204, 255, 0, 0.35)" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Q3', fill: '#ccff00', fontSize: 9, position: 'top', fontWeight: 'bold' }} />
              <ReferenceLine x="W52" stroke="rgba(204, 255, 0, 0.35)" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Q4', fill: '#ccff00', fontSize: 9, position: 'top', fontWeight: 'bold' }} />

              <Line 
                name="2024" 
                type="monotone" 
                dataKey="2024" 
                stroke="#a855f7" 
                strokeWidth={1.5} 
                dot={false} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                name="2025" 
                type="monotone" 
                dataKey="2025" 
                stroke="#00f0ff" 
                strokeWidth={1.5} 
                dot={false} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                name="2026 (YTD)" 
                type="monotone" 
                dataKey="2026" 
                stroke="#ccff00" 
                strokeWidth={2.5} 
                dot={{ r: 2 }} 
                activeDot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


interface WidgetFinancialsProps {
  symbol: string;
}

export const WidgetFinancials: React.FC<WidgetFinancialsProps> = ({ symbol }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/widgets/financials?symbol=${symbol}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching financials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-48 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-sm" />
        </div>
        <SkeletonChart height="h-[220px]" />
      </div>
    );
  }

  if (!data || data.isIndex) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col items-center justify-center text-center">
        <Info className="w-8 h-8 text-[#686477] mb-2" />
        <p className="text-xs text-[#9f9bac] font-sans font-medium">Laporan keuangan hanya tersedia untuk Emiten Saham.</p>
        <p className="text-[10px] text-[#686477] mt-1 font-sans">Indeks pasar / makro asset tidak memiliki rincian laporan laba rugi.</p>
      </div>
    );
  }

  return (
    <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] flex flex-col justify-between hover:border-[#ccff00]/20 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#ccff00]" />
            Laporan Pemasukan (Tahunan)
          </h3>
          <span className="text-[9px] text-[#686477] font-mono">Nilai dlm Triliun IDR</span>
        </div>

        <div className="h-[220px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="year" 
                stroke="#686477" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#686477" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#13111c', borderColor: '#2a273b', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ color: '#ccff00', fontWeight: 'bold', fontSize: '11px' }}
                itemStyle={{ fontSize: '11px' }}
                formatter={(value: any) => [`Rp ${value} Triliun`, '']}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="rect" 
                iconSize={8} 
                wrapperStyle={{ fontSize: '10px', color: '#9f9bac' }}
              />
              <Bar name="Pendapatan (Revenue)" dataKey="revenue" fill="#ccff00" radius={[4, 4, 0, 0]} />
              <Bar name="Laba Bersih" dataKey="netIncome" fill="#00f0ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


interface WidgetDividenProps {
  symbol: string;
}

export const WidgetDividen: React.FC<WidgetDividenProps> = ({ symbol }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/widgets/dividen?symbol=${symbol}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching dividen:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center h-[220px]">
          <div className="flex justify-center items-center">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.isIndex) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col items-center justify-center text-center">
        <Percent className="w-8 h-8 text-[#686477] mb-2" />
        <p className="text-xs text-[#9f9bac] font-sans font-medium">Informasi Dividen hanya tersedia untuk Emiten Saham.</p>
        <p className="text-[10px] text-[#686477] mt-1 font-sans">Indeks pasar / makro asset tidak mendistribusikan dividen langsung.</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Rasio Pembayaran TTM', value: data.payoutRatio, color: '#ccff00' },
    { name: 'Laba Ditahan', value: Math.max(0, 100 - data.payoutRatio), color: '#272438' },
  ];

  return (
    <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] flex flex-col md:flex-row gap-6 hover:border-[#ccff00]/20 transition-all">
      {/* Chart Section */}
      <div className="flex flex-col justify-between items-center md:items-start flex-1 min-w-[150px]">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-[#ccff00]" />
            Alokasi Dividen TTM
          </h3>
          <p className="text-[10px] text-[#686477] font-sans">Rasio pembayaran & Laba ditahan</p>
        </div>
        
        <div className="w-[140px] h-[140px] relative my-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[10px] text-[#686477] font-bold uppercase font-mono">Payout TTM</span>
            <span className="text-base font-black font-mono text-white mt-0.5">{data.payoutRatio}%</span>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-3">
          <div className="bg-[#111018]/40 border border-[#1b1926] p-3 rounded-xl flex items-center justify-between">
            <span className="text-[10px] text-[#686477] font-bold font-sans">Imbal Hasil Dividen TTM</span>
            <span className="text-xs font-extrabold font-mono text-[#00f5a0]">{data.yield}%</span>
          </div>
          
          <div className="bg-[#111018]/40 border border-[#1b1926] p-3 rounded-xl flex items-center justify-between">
            <span className="text-[10px] text-[#686477] font-bold font-sans">Pembayaran Terakhir</span>
            <span className="text-xs font-extrabold font-mono text-white">{data.lastPayout}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#111018]/40 border border-[#1b1926] p-2.5 rounded-xl text-center">
              <span className="text-[8px] text-[#686477] font-bold uppercase block mb-1 font-sans">Tanggal Ex-Div</span>
              <span className="text-[10px] font-bold text-white font-mono block truncate">{data.exDate}</span>
            </div>
            
            <div className="bg-[#111018]/40 border border-[#1b1926] p-2.5 rounded-xl text-center">
              <span className="text-[8px] text-[#686477] font-bold uppercase block mb-1 font-sans">Tanggal Bayar</span>
              <span className="text-[10px] font-bold text-white font-mono block truncate">{data.payDate}</span>
            </div>
          </div>
        </div>

        <button className="w-full py-2.5 bg-[#181622] hover:bg-[#252233] border border-[#2d2a3d] hover:border-[#ccff00]/40 text-white hover:text-[#ccff00] text-xs font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md">
          <span>Info Lebih Lanjut</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>
    </div>
  );
};


interface CanvasGaugeProps {
  value: number; // 0 to 100
  width?: number;
  height?: number;
  radius?: number;
}

export const CanvasGauge: React.FC<CanvasGaugeProps> = ({ 
  value, 
  width = 210, 
  height = 115, 
  radius = 65 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentValRef = useRef<number>(50); // start at center (50)
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina-ready scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height - 12;
    const arcWidth = 10;

    const animate = () => {
      // Easing calculation for ultra-smooth spring needle movement
      const diff = value - currentValRef.current;
      currentValRef.current += diff * 0.1; // lerp speed

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw background track
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI, 0);
      ctx.strokeStyle = '#1b1926';
      ctx.lineWidth = arcWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Helper to draw a segment arc
      const drawSegment = (startAngle: number, endAngle: number, color: string) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = arcWidth;
        ctx.lineCap = 'butt';
        ctx.stroke();
      };

      // Draw color zones matching technical rating zones
      drawSegment(-Math.PI, -Math.PI * 0.75, '#ff3366'); // Jual Kuat (Red)
      drawSegment(-Math.PI * 0.75, -Math.PI * 0.5, '#ff9900'); // Jual (Orange)
      drawSegment(-Math.PI * 0.5, -Math.PI * 0.25, '#ffd200'); // Netral (Yellow)
      drawSegment(-Math.PI * 0.25, 0, '#00f5a0'); // Beli / Beli Kuat (Green)

      // Draw ticks/text markers (JUAL, NETRAL, BELI)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 8px sans-serif';
      
      // JUAL
      ctx.fillStyle = '#ff3366';
      ctx.fillText('JUAL', cx - radius - 15, cy - 2);

      // NETRAL
      ctx.fillStyle = '#ffd200';
      ctx.fillText('NETRAL', cx, cy - radius - 12);

      // BELI
      ctx.fillStyle = '#00f5a0';
      ctx.fillText('BELI', cx + radius + 15, cy - 2);
      ctx.restore();

      // Draw subtle inner scale ticks around the main arc to give it that TradingView feel
      ctx.save();
      ctx.strokeStyle = '#38344e';
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= 10; i++) {
        const tickAngle = -Math.PI + (i / 10) * Math.PI;
        const startR = radius - 11;
        const endR = radius - 16;
        ctx.beginPath();
        ctx.moveTo(cx + startR * Math.cos(tickAngle), cy + startR * Math.sin(tickAngle));
        ctx.lineTo(cx + endR * Math.cos(tickAngle), cy + endR * Math.sin(tickAngle));
        ctx.stroke();
      }
      ctx.restore();

      // Calculate needle position based on animated value
      const needleAngle = -Math.PI + (currentValRef.current / 100) * Math.PI;
      const needleLength = radius - 8;
      const needleX = cx + needleLength * Math.cos(needleAngle);
      const needleY = cy + needleLength * Math.sin(needleAngle);

      // Draw beautiful dynamic needle glow (gradient/shadow)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(needleX, needleY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();
      ctx.restore();

      // Draw pivot center
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0b0a10';
      ctx.fill();

      // Loop animation if not perfectly aligned
      if (Math.abs(diff) > 0.05) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, width, height, radius]);

  return (
    <div className="w-full flex justify-center py-1">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};


const formatRatingText = (rating: string) => {
  if (!rating) return 'Netral';
  const r = rating.trim();
  if (r === 'Pembelian Kuat' || r === 'Sangat Beli') return 'Beli Kuat';
  if (r === 'Pembelian') return 'Beli';
  if (r === 'Penjualan Kuat' || r === 'Sangat Jual') return 'Jual Kuat';
  if (r === 'Penjualan') return 'Jual';
  return r;
};

const getRatingBadgeClass = (rating: string) => {
  const r = (rating || '').toLowerCase();
  if (r.includes('pembelian kuat') || r.includes('beli kuat') || r.includes('sangat beli') || (r.includes('kuat') && (r.includes('pembelian') || r.includes('beli')))) {
    return 'text-[#00f5a0] border-[#00f5a0]/40 shadow-[0_0_12px_rgba(0,245,160,0.15)]';
  }
  if (r.includes('pembelian') || r.includes('beli') || r.includes('positif')) {
    return 'text-[#00f5a0] border-[#00f5a0]/30';
  }
  if (r.includes('penjualan kuat') || r.includes('jual kuat') || r.includes('sangat jual') || (r.includes('kuat') && (r.includes('penjualan') || r.includes('jual')))) {
    return 'text-[#ff3366] border-[#ff3366]/40 shadow-[0_0_12px_rgba(255,51,102,0.15)]';
  }
  if (r.includes('penjualan') || r.includes('jual') || r.includes('negatif')) {
    return 'text-[#ff3366] border-[#ff3366]/30';
  }
  return 'text-amber-400 border-amber-400/30';
};

interface WidgetGaugesProps {
  symbol: string;
}

export const WidgetGauges: React.FC<WidgetGaugesProps> = ({ symbol }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/widgets/gauges?symbol=${symbol}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching gauges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="bg-[#0b0a10]/60 border border-[#1b1926] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[180px]">
        <SkeletonGauge />
      </div>
    );
  }

  if (!data) return null;

  const isUpside = data.analyst.upsidePct >= 0;

  return (
    <div className="bg-[#0b0a10]/60 border border-[#1b1926] rounded-2xl p-4 hover:border-[#ccff00]/30 transition-all">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1b1926]">
        <h3 className="text-xs font-bold text-white tracking-tight font-sans flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#ccff00]" />
          Analisa Gauges (Teknikal & Analis) - {symbol === '^JKSE' || symbol === 'IHSG' ? 'IHSG' : symbol}
        </h3>
        <span className="text-[9px] text-[#686477] font-mono">Indikator Real-Time</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#1b1926]">
        {/* 1. Technical Rating Gauge */}
        <div className="flex flex-col items-center justify-between pb-3 md:pb-0 md:pr-3">
          <div className="text-center mb-0.5">
            <h4 className="text-xs font-bold text-white tracking-tight font-sans flex items-center justify-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#ccff00]" />
              Analisa Teknikal
            </h4>
            <p className="text-[10px] text-[#9f9bac] font-sans">Konsensus osilator & MA (Real-Time)</p>
          </div>

          <CanvasGauge value={data.technical.value} width={210} height={115} radius={65} />

          <div className="text-center mt-0.5">
            <span className="text-[11px] font-bold block mb-1 font-sans text-[#9f9bac]">
              RSI (14): {data.technical.rsi || 50} • {data.technical.maSignal || 'MA Bullish'}
            </span>
            <span className={`text-xs font-extrabold px-3.5 py-1 bg-[#111018] border rounded-full font-sans tracking-wide inline-block ${getRatingBadgeClass(data.technical.rating)}`}>
              {formatRatingText(data.technical.rating)}
            </span>
          </div>
        </div>

        {/* 2. Analyst Consensus Rating Gauge */}
        <div className="flex flex-col items-center justify-between pt-3 md:pt-0 md:pl-3">
          <div className="text-center mb-0.5">
            <h4 className="text-xs font-bold text-white tracking-tight font-sans flex items-center justify-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#ccff00]" />
              Penilaian Analis
            </h4>
            <p className="text-[10px] text-[#9f9bac] font-sans">Konsensus target 1 tahun bursa</p>
          </div>

          <CanvasGauge value={data.analyst.value} width={210} height={115} radius={65} />

          <div className="text-center mt-0.5">
            <span className="text-[11px] font-bold block mb-1 font-sans text-[#9f9bac]">
              Target Harga 1 Thn:{' '}
              <span className={isUpside ? 'text-[#00f5a0]' : 'text-[#ff3366]'}>
                Rp {data.analyst.targetPrice.toLocaleString('id-ID')} ({isUpside ? '+' : ''}{data.analyst.upsidePct}%)
              </span>
            </span>
            <span className={`text-xs font-extrabold px-3.5 py-1 bg-[#111018] border rounded-full font-sans tracking-wide inline-block ${getRatingBadgeClass(data.analyst.rating)}`}>
              {formatRatingText(data.analyst.rating)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface WidgetNewsProps {
  symbol: string;
}

interface NewsArticle {
  title: string;
  publisher: string;
  link: string;
  timeAgo: string;
}

export const WidgetNews: React.FC<WidgetNewsProps> = ({ symbol }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'positive' | 'financial' | 'macro'>('all');

  const fetchNewsData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/widgets/ticker-details?symbol=${encodeURIComponent(symbol)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news)) {
          setNews(data.news);
        }
      }
    } catch (err) {
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, [symbol]);

  const positiveKeywords = ['laba', 'naik', 'rebound', 'cuan', 'tumbuh', 'rekor', 'untung', 'beli', 'net buy', 'dividen', 'menguat', 'target', 'positif'];
  const negativeKeywords = ['turun', 'melemahan', 'rugi', 'net sell', 'beban', 'tertekan', 'koreksi', 'anjlok', 'melemah', 'risiko'];

  const sentimentStats = React.useMemo(() => {
    if (!news.length) return { positivePct: 75, sentimentText: 'Sangat Positif (Bullish)', sentimentColor: 'text-[#00f5a0]' };
    let posCount = 0;
    let negCount = 0;
    news.forEach(item => {
      const lower = item.title.toLowerCase();
      if (positiveKeywords.some(kw => lower.includes(kw))) posCount++;
      if (negativeKeywords.some(kw => lower.includes(kw))) negCount++;
    });

    const total = news.length;
    const posPct = Math.round(((posCount + (total - negCount)) / (total * 2)) * 100) || 75;
    
    let sentimentText = 'Netral / Stabil';
    let sentimentColor = 'text-amber-400';
    if (posPct >= 70) {
      sentimentText = 'Sangat Positif (Bullish)';
      sentimentColor = 'text-[#00f5a0]';
    } else if (posPct >= 55) {
      sentimentText = 'Cenderung Positif';
      sentimentColor = 'text-[#ccff00]';
    } else if (posPct <= 40) {
      sentimentText = 'Sentimen Waspada (Bearish)';
      sentimentColor = 'text-[#ff3366]';
    }

    return { positivePct: posPct, sentimentText, sentimentColor, posCount, negCount };
  }, [news]);

  const filteredNews = React.useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.publisher.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (category === 'positive') {
        return positiveKeywords.some(kw => item.title.toLowerCase().includes(kw));
      } else if (category === 'financial') {
        const finKw = ['laba', 'kinerja', 'keuangan', 'pendapatan', 'dividen', 'saham', 'target', 'lot', 'harga', 'rups'];
        return finKw.some(kw => item.title.toLowerCase().includes(kw));
      } else if (category === 'macro') {
        const macroKw = ['bi', 'suku bunga', 'ihsg', 'bursa', 'ekonomi', 'danantara', 'asing', 'rebound', 'pasar'];
        return macroKw.some(kw => item.title.toLowerCase().includes(kw));
      }
      return true;
    });
  }, [news, searchQuery, category]);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const primaryArticle = filteredNews[0] || news[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header Banner & Sentiment Metrics */}
      <div className="card card-elevated p-6 bg-gradient-to-r from-[#111018] via-[#141222] to-[#0b0a10] border border-[#1b1926] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl text-[#ccff00]">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight font-sans flex items-center gap-2">
                Berita Terkini & Intelijen Pasar ({symbol})
                <span className="px-2 py-0.5 bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 rounded-full text-[10px] font-mono">
                  LIVE RSS
                </span>
              </h2>
              <p className="text-xs text-[#9f9bac] font-sans">
                Sumber berita terverifikasi dari Google News RSS, Bisnis.com, CNBC Indonesia, Bloomberg & InvestorTrust
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10 bg-[#0b0a10]/80 p-3.5 border border-[#1b1926] rounded-xl self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#686477] uppercase tracking-wider font-mono">Indeks Sentimen AI</span>
            <span className={`text-sm font-black font-sans flex items-center gap-1.5 ${sentimentStats.sentimentColor}`}>
              {sentimentStats.positivePct >= 55 ? (
                <TrendingUp className="w-4 h-4" />
              ) : sentimentStats.positivePct <= 40 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              {sentimentStats.sentimentText} ({sentimentStats.positivePct}%)
            </span>
          </div>
          <button
            onClick={() => fetchNewsData(true)}
            disabled={refreshing}
            className="p-2.5 bg-[#171524] hover:bg-[#201c33] text-[#9f9bac] hover:text-[#ccff00] border border-[#262338] rounded-lg transition-all cursor-pointer"
            title="Sintesis Ulang Berita"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#ccff00]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Semua Berita', icon: Globe },
            { id: 'positive', label: 'Sentimen Positif', icon: ThumbsUp },
            { id: 'financial', label: 'Kinerja & Laba', icon: Flame },
            { id: 'macro', label: 'Makro & Sektor', icon: Tag }
          ].map(btn => {
            const Icon = btn.icon;
            const active = category === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setCategory(btn.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10 font-black'
                    : 'bg-[#111018] text-[#9f9bac] border border-[#1b1926] hover:text-white hover:bg-[#1b1926]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#686477]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci berita..."
            className="w-full bg-[#111018] border border-[#1b1926] focus:border-[#ccff00]/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#686477] outline-none transition-all font-sans"
          />
        </div>
      </div>

      {/* 3. Hero / Main Featured Headline */}
      {primaryArticle && (
        <div className="card card-elevated p-6 bg-[#0b0a10]/80 border border-[#262238] hover:border-[#ccff00]/30 rounded-2xl relative group transition-all">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 rounded-md text-[10px] font-bold font-sans">
                  BERITA UTAMA • {primaryArticle.publisher}
                </span>
                <span className="text-[11px] text-[#686477] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {primaryArticle.timeAgo}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white group-hover:text-[#ccff00] transition-colors leading-snug font-sans">
                {primaryArticle.title}
              </h3>
            </div>
            
            <a
              href={primaryArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/10 shrink-0 cursor-pointer"
            >
              <span>Buka Berita Lengkap</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* 4. Articles Grid */}
      {filteredNews.length === 0 ? (
        <div className="p-12 text-center card card-elevated bg-[#0b0a10]/40 border border-[#1b1926] rounded-2xl">
          <Newspaper className="w-10 h-10 text-[#686477] mx-auto mb-3 opacity-50" />
          <p className="text-sm font-bold text-white font-sans">Tidak ditemukan berita untuk kriteria ini.</p>
          <p className="text-xs text-[#686477] mt-1 font-sans">Coba ubah kata kunci atau filter kategori berita di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((article, idx) => (
            <div 
              key={idx} 
              className="card card-elevated p-5 bg-[#0b0a10]/60 border border-[#1b1926] hover:border-[#ccff00]/30 rounded-2xl flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-[#171524] text-[#9f9bac] border border-[#262338] rounded-md text-[10px] font-bold font-sans group-hover:text-[#ccff00] group-hover:border-[#ccff00]/20 transition-all">
                    {article.publisher}
                  </span>
                  <span className="text-[10px] text-[#686477] font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {article.timeAgo}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#ccff00] transition-colors leading-relaxed line-clamp-3 font-sans">
                  {article.title}
                </h4>
              </div>

              <div className="pt-4 mt-3 border-t border-[#1b1926]/80 flex items-center justify-between">
                <span className="text-[10px] text-[#686477] font-mono">Sumber Terverifikasi</span>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  <span>Baca</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { WidgetWatchlistDetail } from './WidgetWatchlistDetail';


