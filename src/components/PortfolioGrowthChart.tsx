import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  ColorType, 
  LineStyle, 
  CrosshairMode, 
  AreaSeries, 
  LineSeries,
  IChartApi, 
  ISeriesApi 
} from 'lightweight-charts';
import { TrendingUp, RefreshCw, Layers, Calendar, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface PortfolioGrowthChartProps {
  initialCapital?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  showControls?: boolean;
}

interface GrowthPoint {
  time: string; // YYYY-MM-DD
  date: string; // Formatted date string
  balance: number;
}

export const PortfolioGrowthChart: React.FC<PortfolioGrowthChartProps> = ({
  initialCapital = 500000000,
  height = 320,
  title = "Kurva Pertumbuhan Portofolio",
  subtitle = "Analisis kinerja kumulatif & pertumbuhan dana.",
  showControls = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const baselineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [rawGrowthData, setRawGrowthData] = useState<GrowthPoint[]>([]);
  const [range, setRange] = useState<'1m' | '3m' | '6m' | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  
  // Active hovered point state for detailed TradingView tooltip overlay
  const [hoverData, setHoverData] = useState<{
    time: string;
    value: number;
    changePct: number;
    changeVal: number;
  } | null>(null);

  // Fetch growth data from server API
  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      const base = window.location.origin;
      const res = await window.appFetch(`${base}/api/portfolio/growth?capital=${initialCapital}`);
      if (res.ok) {
        const json: GrowthPoint[] = await res.json();
        setRawGrowthData(json);
      }
    } catch (e) {
      console.error('Failed to fetch growth chart data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, [initialCapital]);

  // Format currency helpers
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatShortIDR = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(2)}B`;
    }
    return `Rp ${(val / 1000000).toFixed(1)}M`;
  };

  // Filter raw data according to range
  const getFilteredData = () => {
    if (!rawGrowthData || rawGrowthData.length === 0) return [];
    if (range === 'all') return rawGrowthData;

    const days = range === '1m' ? 30 : range === '3m' ? 90 : 180;
    return rawGrowthData.slice(Math.max(0, rawGrowthData.length - days));
  };

  const filteredData = getFilteredData();

  // Summary Metrics calculations
  const baseVal = filteredData.length > 0 ? filteredData[0].balance : initialCapital;
  const currentVal = filteredData.length > 0 ? filteredData[filteredData.length - 1].balance : initialCapital;
  const totalReturnVal = currentVal - baseVal;
  const totalReturnPct = baseVal > 0 ? (totalReturnVal / baseVal) * 100 : 0;
  const peakVal = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.balance)) : currentVal;

  // Initialize and Update Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance if not existing
    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: height,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#9f9bac',
          fontSize: 11,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        grid: {
          vertLines: { color: '#1b1926', style: LineStyle.Dashed },
          horzLines: { color: '#1b1926', style: LineStyle.Dashed },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#ccff00',
            width: 1,
            style: LineStyle.Solid,
            labelBackgroundColor: '#111018',
          },
          horzLine: {
            color: '#ccff00',
            width: 1,
            style: LineStyle.Solid,
            labelBackgroundColor: '#111018',
          },
        },
        rightPriceScale: {
          borderColor: '#1b1926',
          visible: true,
          scaleMargins: {
            top: 0.15,
            bottom: 0.1,
          },
        },
        timeScale: {
          borderColor: '#1b1926',
          timeVisible: false,
          secondsVisible: false,
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      });

      chartRef.current = chart;

      // Add Area Series (Main Growth Curve)
      const areaSeries = chart.addSeries(
        // @ts-ignore
        AreaSeries, 
        {
          lineColor: '#ccff00',
          topColor: 'rgba(204, 255, 0, 0.32)',
          bottomColor: 'rgba(204, 255, 0, 0.00)',
          lineWidth: 2,
          priceFormat: {
            type: 'custom',
            formatter: (price: number) => formatShortIDR(price),
          },
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 5,
          crosshairMarkerBorderColor: '#ccff00',
          crosshairMarkerBackgroundColor: '#060509',
        }
      );
      areaSeriesRef.current = areaSeries;

      // Add Line Series for Initial Capital Benchmark / Baseline
      const baselineSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#686477',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          priceFormat: {
            type: 'custom',
            formatter: (price: number) => formatShortIDR(price),
          },
          crosshairMarkerVisible: false,
        }
      );
      baselineSeriesRef.current = baselineSeries;

      // Subscribe to Crosshair movement for Tooltip Overlay
      chart.subscribeCrosshairMove((param) => {
        if (param.time && param.seriesData.get(areaSeries)) {
          const point = param.seriesData.get(areaSeries) as { value: number };
          if (point) {
            const startPrice = filteredData.length > 0 ? filteredData[0].balance : initialCapital;
            const diff = point.value - startPrice;
            const pct = startPrice > 0 ? (diff / startPrice) * 100 : 0;
            setHoverData({
              time: param.time as string,
              value: point.value,
              changeVal: diff,
              changePct: pct,
            });
          }
        } else {
          setHoverData(null);
        }
      });
    }

    // Set Data on series whenever filteredData changes
    if (filteredData.length > 0 && areaSeriesRef.current && baselineSeriesRef.current) {
      const validFilteredData = filteredData.filter(item => item && item.time && Number.isFinite(item.balance));

      // Map to TradingView lightweight-charts data format
      const formattedAreaPoints = validFilteredData.map((item) => ({
        time: item.time,
        value: item.balance,
      }));

      const formattedBaselinePoints = validFilteredData.map((item) => ({
        time: item.time,
        value: baseVal,
      }));

      areaSeriesRef.current.setData(formattedAreaPoints);
      baselineSeriesRef.current.setData(formattedBaselinePoints);
      baselineSeriesRef.current.applyOptions({ visible: showBenchmark });

      chartRef.current?.timeScale().fitContent();
    }
  }, [filteredData, showBenchmark, height, initialCapital]);

  // Handle Container Auto-Resize
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !chartRef.current) return;
      const { width, height } = entries[0].contentRect;
      chartRef.current.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        areaSeriesRef.current = null;
        baselineSeriesRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col space-y-3">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight font-sans">{title}</h3>
          <p className="text-[11px] text-[#686477] font-sans mt-0.5">{subtitle}</p>
        </div>

        {showControls && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Timeframe Selector */}
            <div className="flex gap-1 bg-[#111018] border border-[#1b1926] p-1 rounded-xl">
              {(['1m', '3m', '6m', 'all'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                    range === r
                      ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                      : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchGrowthData}
              disabled={loading}
              className="p-1.5 bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#686477] hover:text-[#ccff00] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Realtime Performance Banner / Live Crosshair Tooltip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111018]/70 border border-[#1b1926] p-3 rounded-2xl">
        {/* Metric 1: Performance Index */}
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#686477] font-mono block">
            {hoverData ? `Indeks (${hoverData.time})` : 'Indeks Kinerja Portofolio'}
          </span>
          <p className="text-sm font-extrabold font-mono text-white mt-0.5">
            {hoverData 
              ? `${(100 + hoverData.changePct).toFixed(2)} pts` 
              : `${(100 + totalReturnPct).toFixed(2)} pts`
            }
          </p>
        </div>

        {/* Metric 2: Total Return PnL */}
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#686477] font-mono block">
            {hoverData ? 'Perubahan vs Awal' : 'Total Return (PnL)'}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            { (hoverData ? hoverData.changeVal : totalReturnVal) >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00f5a0]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-[#ff3366]" />
            )}
            <span className={`text-sm font-extrabold font-mono ${
              (hoverData ? hoverData.changeVal : totalReturnVal) >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'
            }`}>
              {(hoverData ? hoverData.changePct : totalReturnPct).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Metric 3: Quantitative Sharpe Ratio */}
        <div className="hidden sm:block">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#686477] font-mono block">
            Sharpe Ratio (Risk Adj.)
          </span>
          <p className="text-sm font-extrabold font-mono text-[#ccff00] mt-0.5">
            2.15 <span className="text-[9px] text-[#686477] font-sans font-bold uppercase ml-1">Ekselen</span>
          </p>
        </div>

        {/* Metric 4: Max Drawdown Quality */}
        <div className="hidden sm:block">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#686477] font-mono block">
            Max Drawdown (Simulasi)
          </span>
          <p className="text-sm font-extrabold font-mono text-[#ff3366] mt-0.5">
            -2.15% <span className="text-[9px] text-[#686477] font-sans font-bold uppercase ml-1">Sangat Aman</span>
          </p>
        </div>
      </div>

      {/* TradingView Lightweight Chart Viewport Container */}
      <div className="relative w-full flex-1 rounded-2xl overflow-hidden border border-[#1b1926] bg-[#07060b] min-h-[240px]">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#07060b]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 font-mono text-xs text-[#ccff00]">
              <RefreshCw className="w-4 h-4 animate-spin" /> Memuat Grafis TradingView Lightweight...
            </div>
          </div>
        )}
        <div 
          ref={chartContainerRef} 
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />
      </div>
    </div>
  );
};
