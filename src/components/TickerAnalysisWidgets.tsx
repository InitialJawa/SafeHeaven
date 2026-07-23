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
  ExternalLink
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
  Cell 
} from 'recharts';

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
      <div className="card card-elevated p-6 animate-pulse bg-[#0b0a10]/45 border border-[#1b1926] h-[220px] flex flex-col justify-between">
        <div className="h-4 bg-[#1b1926] rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-14 bg-[#1b1926] rounded-xl"></div>
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
    <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] flex flex-col justify-between hover:border-[#ccff00]/20 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#ccff00]" />
            Kinerja {symbol === '^JKSE' || symbol === 'IHSG' ? 'IHSG' : symbol}
          </h3>
          {data.isFallback && (
            <span className="text-[8px] text-[#686477] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5">Simulated Feed</span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {periods.map((p, idx) => {
            const isPositive = p.value >= 0;
            return (
              <div key={idx} className="bg-[#111018]/60 p-3 rounded-xl border border-[#1b1926] flex flex-col justify-between">
                <span className="text-[10px] text-[#686477] font-bold font-sans">{p.label}</span>
                <div className="flex items-center gap-1 mt-1.5">
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-[#00f5a0]" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-[#ff3366]" />
                  )}
                  <span className={`text-xs font-bold font-mono ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
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
      <div className="card card-elevated p-6 animate-pulse bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col justify-between">
        <div className="h-4 bg-[#1b1926] rounded w-1/4"></div>
        <div className="h-[200px] bg-[#111018]/50 rounded-xl"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] flex flex-col justify-between hover:border-[#ccff00]/20 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#ccff00]" />
            Analisis Musiman {symbol === '^JKSE' || symbol === 'IHSG' ? 'IHSG' : symbol} (%)
          </h3>
          <span className="text-[10px] text-[#686477] font-mono">Bulan ke Bulan</span>
        </div>

        <div className="h-[220px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="month" 
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
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0b0a10', borderColor: '#1b1926', borderRadius: '12px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                itemStyle={{ fontSize: '11px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                iconSize={8} 
                wrapperStyle={{ fontSize: '10px', color: '#9f9bac' }}
              />
              <Line 
                name="2024" 
                type="monotone" 
                dataKey="2024" 
                stroke="#a855f7" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                name="2025" 
                type="monotone" 
                dataKey="2025" 
                stroke="#00f0ff" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                name="2026 (YTD)" 
                type="monotone" 
                dataKey="2026" 
                stroke="#ccff00" 
                strokeWidth={3} 
                dot={{ r: 3 }} 
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
      <div className="card card-elevated p-6 animate-pulse bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col justify-between">
        <div className="h-4 bg-[#1b1926] rounded w-1/3"></div>
        <div className="h-[200px] bg-[#111018]/50 rounded-xl"></div>
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
      <div className="card card-elevated p-6 animate-pulse bg-[#0b0a10]/45 border border-[#1b1926] h-[320px] flex flex-col justify-between">
        <div className="h-4 bg-[#1b1926] rounded w-1/3"></div>
        <div className="h-[200px] bg-[#111018]/50 rounded-xl"></div>
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
}

export const CanvasGauge: React.FC<CanvasGaugeProps> = ({ value }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentValRef = useRef<number>(50); // start at center (50)
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = 240;
    const height = 135;

    // Retina-ready scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height - 15;
    const radius = 80;
    const arcWidth = 12;

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
      ctx.font = 'bold 9px sans-serif';
      
      // JUAL
      ctx.fillStyle = '#ff3366';
      ctx.fillText('JUAL', cx - radius - 20, cy - 2);

      // NETRAL
      ctx.fillStyle = '#ffd200';
      ctx.fillText('NETRAL', cx, cy - radius - 15);

      // BELI
      ctx.fillStyle = '#00f5a0';
      ctx.fillText('BELI', cx + radius + 20, cy - 2);
      ctx.restore();

      // Draw subtle inner scale ticks around the main arc to give it that TradingView feel
      ctx.save();
      ctx.strokeStyle = '#38344e';
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= 12; i++) {
        const tickAngle = -Math.PI + (i / 12) * Math.PI;
        const startR = radius - 14;
        const endR = radius - 20;
        ctx.beginPath();
        ctx.moveTo(cx + startR * Math.cos(tickAngle), cy + startR * Math.sin(tickAngle));
        ctx.lineTo(cx + endR * Math.cos(tickAngle), cy + endR * Math.sin(tickAngle));
        ctx.stroke();
      }
      ctx.restore();

      // Calculate needle position based on animated value
      const needleAngle = -Math.PI + (currentValRef.current / 100) * Math.PI;
      const needleLength = radius - 10;
      const needleX = cx + needleLength * Math.cos(needleAngle);
      const needleY = cy + needleLength * Math.sin(needleAngle);

      // Draw beautiful dynamic needle glow (gradient/shadow)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(needleX, needleY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();
      ctx.restore();

      // Draw pivot center
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
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
  }, [value]);

  return (
    <div className="w-full flex justify-center py-2">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        <div className="card card-elevated p-6 animate-pulse bg-[#0b0a10]/45 border border-[#1b1926] h-[250px]"></div>
        <div className="card card-elevated p-6 animate-pulse bg-[#0b0a10]/45 border border-[#1b1926] h-[250px]"></div>
      </div>
    );
  }

  if (!data) return null;

  const isUpside = data.analyst.upsidePct >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {/* 1. Technical Rating Gauge */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] flex flex-col justify-between hover:border-[#ccff00]/20 transition-all">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center justify-center md:justify-start gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#ccff00]" />
            Analisa Teknikal
          </h3>
          <p className="text-[10px] text-[#686477] font-sans">Konsensus osilator & MA (Real-Time)</p>
        </div>

        <div className="my-3 flex flex-col items-center">
          <CanvasGauge value={data.technical.value} />
          <div className="text-center mt-1">
            <span className={`text-base font-extrabold px-4 py-1 bg-[#111018]/80 border border-[#1b1926] rounded-full font-sans tracking-wide ${
              data.technical.rating.includes('Kuat') 
                ? (data.technical.value >= 60 ? 'text-[#00f5a0] border-[#00f5a0]/20 shadow-[0_0_15px_rgba(0,245,160,0.05)]' : 'text-[#ff3366] border-[#ff3366]/20') 
                : 'text-amber-400 border-amber-400/20'
            }`}>
              {data.technical.rating}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Analyst Consensuse Rating Gauge */}
      <div className="card card-elevated p-6 bg-[#0b0a10]/45 border border-[#1b1926] flex flex-col justify-between hover:border-[#ccff00]/20 transition-all">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center justify-center md:justify-start gap-2 mb-1">
            <Target className="w-4 h-4 text-[#ccff00]" />
            Penilaian Analis
          </h3>
          <p className="text-[10px] text-[#686477] font-sans">Konsensus target 1 tahun bursa</p>
        </div>

        <div className="my-3 flex flex-col items-center">
          <CanvasGauge value={data.analyst.value} />
          
          <div className="text-center mt-1">
            <span className={`text-xs font-bold block mb-1.5 font-sans ${isUpside ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
              Target Harga 1 Thn: Rp {data.analyst.targetPrice.toLocaleString('id-ID')} ({isUpside ? '+' : ''}{data.analyst.upsidePct}%)
            </span>
            <span className={`text-sm font-extrabold px-4 py-1 bg-[#111018]/80 border border-[#1b1926] rounded-full font-sans tracking-wide ${
              data.analyst.rating.includes('Kuat') ? 'text-[#00f5a0] border-[#00f5a0]/20' : 'text-amber-400 border-amber-400/20'
            }`}>
              {data.analyst.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { WidgetWatchlistDetail } from './WidgetWatchlistDetail';

