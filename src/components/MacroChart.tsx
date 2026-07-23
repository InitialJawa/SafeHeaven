import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, CrosshairMode, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { Activity, DollarSign, Coins, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

interface MacroChartProps {
  initialType?: 'ihsg' | 'usd' | 'gold';
}

export const MacroChart: React.FC<MacroChartProps> = ({ initialType = 'ihsg' }) => {
  const [type, setType] = useState(initialType);
  const [range, setRange] = useState('3m');
  const [loading, setLoading] = useState(false);
  
  // Indicators states
  const [showMA, setShowMA] = useState(true);
  const [showSMA20, setShowSMA20] = useState(false);
  const [showEMA10, setShowEMA10] = useState(false);
  const [showEMA50, setShowEMA50] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showDonchian, setShowDonchian] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  // Line Series refs
  const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema10SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const donchianUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const donchianLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  
  const [candles, setCandles] = useState<any[]>([]);

  // Click outside handling for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await fetch(`${base}/api/market/macro?type=${type}&range=${range}`);
        if (res.ok) {
          const data = await res.json();
          // Filter valid data
          const validData = data.filter((d: any) => d.time && d.close !== undefined);
          setCandles(validData);
        }
      } catch (err) {
        console.error('Error fetching macro data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, range]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#686477',
        },
        grid: {
          vertLines: { color: '#1b1926', style: LineStyle.Dashed },
          horzLines: { color: '#1b1926', style: LineStyle.Dashed },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: '#1b1926',
        },
        timeScale: {
          borderColor: '#1b1926',
          timeVisible: true,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addSeries(
        // @ts-ignore
        CandlestickSeries, 
        {
          upColor: '#00e676',
          downColor: '#ff1744',
          borderVisible: false,
          wickUpColor: '#00e676',
          wickDownColor: '#ff1744',
        }
      );
      candlestickSeriesRef.current = candlestickSeries;

      const maSeries = chart.addSeries(
        // @ts-ignore
        LineSeries, 
        {
          color: '#ccff00',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        }
      );
      maSeriesRef.current = maSeries;
      
      const sma20Series = chart.addSeries(
        // @ts-ignore
        LineSeries, 
        {
          color: '#00b0ff',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        }
      );
      sma20SeriesRef.current = sma20Series;
      
      const ema10Series = chart.addSeries(
        // @ts-ignore
        LineSeries, 
        {
          color: '#ff9100',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        }
      );
      ema10SeriesRef.current = ema10Series;

      const ema50Series = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#e040fb',
          lineWidth: 2,
          crosshairMarkerVisible: false,
        }
      );
      ema50SeriesRef.current = ema50Series;

      const bbUpperSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#00f5a0',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          crosshairMarkerVisible: false,
        }
      );
      bbUpperSeriesRef.current = bbUpperSeries;

      const bbLowerSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#00f5a0',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          crosshairMarkerVisible: false,
        }
      );
      bbLowerSeriesRef.current = bbLowerSeries;

      const donchianUpperSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#ff007f',
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          crosshairMarkerVisible: false,
        }
      );
      donchianUpperSeriesRef.current = donchianUpperSeries;

      const donchianLowerSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#ff007f',
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          crosshairMarkerVisible: false,
        }
      );
      donchianLowerSeriesRef.current = donchianLowerSeries;
    }

    if (
      candles.length > 0 && 
      candlestickSeriesRef.current && 
      maSeriesRef.current && 
      sma20SeriesRef.current && 
      ema10SeriesRef.current &&
      ema50SeriesRef.current &&
      bbUpperSeriesRef.current &&
      bbLowerSeriesRef.current &&
      donchianUpperSeriesRef.current &&
      donchianLowerSeriesRef.current
    ) {
      candlestickSeriesRef.current.setData(candles);
      
      // Calculate 5-period SMA
      const maData = [];
      const period = 5;
      for (let i = 0; i < candles.length; i++) {
        if (i < period - 1) continue;
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].close;
        }
        maData.push({ time: candles[i].time, value: sum / period });
      }
      maSeriesRef.current.setData(maData);
      maSeriesRef.current.applyOptions({ visible: showMA });
      
      // Calculate 20-period SMA
      const sma20Data = [];
      const period20 = 20;
      for (let i = 0; i < candles.length; i++) {
        if (i < period20 - 1) continue;
        let sum = 0;
        for (let j = 0; j < period20; j++) {
          sum += candles[i - j].close;
        }
        sma20Data.push({ time: candles[i].time, value: sum / period20 });
      }
      sma20SeriesRef.current.setData(sma20Data);
      sma20SeriesRef.current.applyOptions({ visible: showSMA20 });
      
      // Calculate 10-period EMA
      const ema10Data = [];
      const period10 = 10;
      let k = 2 / (period10 + 1);
      let ema = candles.length > 0 ? candles[0].close : 0;
      for (let i = 0; i < candles.length; i++) {
        if (i === 0) {
          ema = candles[i].close;
        } else {
          ema = (candles[i].close - ema) * k + ema;
        }
        if (i >= period10 - 1) {
          ema10Data.push({ time: candles[i].time, value: ema });
        }
      }
      ema10SeriesRef.current.setData(ema10Data);
      ema10SeriesRef.current.applyOptions({ visible: showEMA10 });

      // Calculate 50-period EMA
      const ema50Data = [];
      const period50 = 50;
      let k50 = 2 / (period50 + 1);
      let ema50 = candles.length > 0 ? candles[0].close : 0;
      for (let i = 0; i < candles.length; i++) {
        if (i === 0) {
          ema50 = candles[i].close;
        } else {
          ema50 = (candles[i].close - ema50) * k50 + ema50;
        }
        if (i >= period50 - 1) {
          ema50Data.push({ time: candles[i].time, value: ema50 });
        }
      }
      ema50SeriesRef.current.setData(ema50Data);
      ema50SeriesRef.current.applyOptions({ visible: showEMA50 });

      // Calculate Bollinger Bands
      const bbUpperData = [];
      const bbLowerData = [];
      const periodBB = 20;
      for (let i = 0; i < candles.length; i++) {
        if (i < periodBB - 1) continue;
        let sum = 0;
        for (let j = 0; j < periodBB; j++) {
          sum += candles[i - j].close;
        }
        const mean = sum / periodBB;

        let varianceSum = 0;
        for (let j = 0; j < periodBB; j++) {
          const diff = candles[i - j].close - mean;
          varianceSum += diff * diff;
        }
        const stdDev = Math.sqrt(varianceSum / periodBB);

        bbUpperData.push({ time: candles[i].time, value: mean + 2 * stdDev });
        bbLowerData.push({ time: candles[i].time, value: mean - 2 * stdDev });
      }
      bbUpperSeriesRef.current.setData(bbUpperData);
      bbLowerSeriesRef.current.setData(bbLowerData);
      bbUpperSeriesRef.current.applyOptions({ visible: showBB });
      bbLowerSeriesRef.current.applyOptions({ visible: showBB });

      // Calculate Donchian Channels
      const donchianUpperData = [];
      const donchianLowerData = [];
      const periodDonchian = 20;
      for (let i = 0; i < candles.length; i++) {
        if (i < periodDonchian - 1) continue;
        let maxHigh = candles[i].high !== undefined ? candles[i].high : candles[i].close;
        let minLow = candles[i].low !== undefined ? candles[i].low : candles[i].close;
        for (let j = 0; j < periodDonchian; j++) {
          const c = candles[i - j];
          const h = c.high !== undefined ? c.high : c.close;
          const l = c.low !== undefined ? c.low : c.close;
          if (h > maxHigh) maxHigh = h;
          if (l < minLow) minLow = l;
        }
        donchianUpperData.push({ time: candles[i].time, value: maxHigh });
        donchianLowerData.push({ time: candles[i].time, value: minLow });
      }
      donchianUpperSeriesRef.current.setData(donchianUpperData);
      donchianLowerSeriesRef.current.setData(donchianLowerData);
      donchianUpperSeriesRef.current.applyOptions({ visible: showDonchian });
      donchianLowerSeriesRef.current.applyOptions({ visible: showDonchian });

      chartRef.current.timeScale().fitContent();
      chartRef.current.priceScale('right').applyOptions({ autoScale: true });
    }
  }, [candles, showMA, showSMA20, showEMA10, showEMA50, showBB, showDonchian]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        maSeriesRef.current = null;
        sma20SeriesRef.current = null;
        ema10SeriesRef.current = null;
        ema50SeriesRef.current = null;
        bbUpperSeriesRef.current = null;
        bbLowerSeriesRef.current = null;
        donchianUpperSeriesRef.current = null;
        donchianLowerSeriesRef.current = null;
      }
    };
  }, []);

  const handleResize = () => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const typeConfig = {
    ihsg: { title: 'IHSG (Indeks Harga Saham Gabungan)', desc: 'Pergerakan historis indeks utama' },
    usd: { title: 'USD/IDR', desc: 'Pergerakan nilai tukar Rupiah terhadap Dolar' },
    gold: { title: 'Harga Emas Spot', desc: 'Pergerakan harga emas dunia (XAU)' },
  };

  const activeIndicatorsCount = [showMA, showSMA20, showEMA10, showEMA50, showBB, showDonchian].filter(Boolean).length;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-1">{typeConfig[type as keyof typeof typeConfig].title}</h3>
          <p className="text-[11px] text-[#686477] font-sans">{typeConfig[type as keyof typeof typeConfig].desc}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {/* Asset Switcher */}
          <div className="flex gap-1 bg-[#111018]/80 p-1 rounded-lg border border-[#1b1926]">
            <button
              onClick={() => setType('ihsg')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md transition-colors ${type === 'ihsg' ? 'bg-[#1b1926] text-[#ccff00]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'}`}
            >
              <Activity className="w-3 h-3" /> IHSG
            </button>
            <button
              onClick={() => setType('usd')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md transition-colors ${type === 'usd' ? 'bg-[#1b1926] text-[#00f0ff]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'}`}
            >
              <DollarSign className="w-3 h-3" /> USD
            </button>
            <button
              onClick={() => setType('gold')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md transition-colors ${type === 'gold' ? 'bg-[#1b1926] text-[#ff9100]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'}`}
            >
              <Coins className="w-3 h-3" /> GOLD
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Dropdown Indicator Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold text-white bg-[#111018]/80 border border-[#1b1926] hover:border-[#ccff00]/40 rounded-lg transition-colors cursor-pointer select-none"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#ccff00]" />
                <span>Indikator ({activeIndicatorsCount})</span>
                <ChevronDown className="w-3 h-3 text-[#686477]" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-[#0f0e15] border border-[#1b1926] rounded-xl shadow-2xl p-2 z-50 space-y-0.5">
                  <div className="px-2 py-1 text-[9px] font-bold text-[#686477] uppercase tracking-wider font-mono border-b border-[#1b1926]/50 mb-1">
                    Pilih Indikator Tren
                  </div>
                  
                  {/* SMA 5 */}
                  <button
                    onClick={() => setShowMA(!showMA)}
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ccff00]" />
                      <span className="text-[10px] font-bold text-white">SMA 5 (Moving Average 5-Hari)</span>
                    </div>
                    {showMA && <Check className="w-3 h-3 text-[#ccff00]" />}
                  </button>

                  {/* SMA 20 */}
                  <button
                    onClick={() => setShowSMA20(!showSMA20)}
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff]" />
                      <span className="text-[10px] font-bold text-white">SMA 20 (Moving Average 20-Hari)</span>
                    </div>
                    {showSMA20 && <Check className="w-3 h-3 text-[#00b0ff]" />}
                  </button>

                  {/* EMA 10 */}
                  <button
                    onClick={() => setShowEMA10(!showEMA10)}
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff9100]" />
                      <span className="text-[10px] font-bold text-white">EMA 10 (Exponential 10-Hari)</span>
                    </div>
                    {showEMA10 && <Check className="w-3 h-3 text-[#ff9100]" />}
                  </button>

                  {/* EMA 50 */}
                  <button
                    onClick={() => setShowEMA50(!showEMA50)}
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e040fb]" />
                      <span className="text-[10px] font-bold text-white">EMA 50 (Sinyal Tren Mayor)</span>
                    </div>
                    {showEMA50 && <Check className="w-3 h-3 text-[#e040fb]" />}
                  </button>

                  {/* Bollinger Bands */}
                  <button
                    onClick={() => setShowBB(!showBB)}
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded bg-[#00f5a0]" />
                      <span className="text-[10px] font-bold text-white">Bollinger Bands (20, 2)</span>
                    </div>
                    {showBB && <Check className="w-3 h-3 text-[#00f5a0]" />}
                  </button>

                  {/* Donchian Channel */}
                  <button
                    onClick={() => setShowDonchian(!showDonchian)}
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded bg-[#ff007f]" />
                      <span className="text-[10px] font-bold text-white">Donchian Channels (20)</span>
                    </div>
                    {showDonchian && <Check className="w-3 h-3 text-[#ff007f]" />}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-1 bg-[#111018]/80 border border-[#1b1926] p-1 rounded-lg">
              {['1m', '3m', '6m', '1y', '5y'].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-colors cursor-pointer ${range === r ? 'bg-[#1b1926] text-white' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-full min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#686477] bg-[#0b0a10]/80 z-10 animate-pulse rounded-lg">
            LOADING DATA...
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0 rounded-lg overflow-hidden" />
      </div>
    </div>
  );
};
