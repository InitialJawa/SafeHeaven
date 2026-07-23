import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { SignalBadge } from '../components/SignalBadge';
import { TickerLogo } from '../components/TickerLogo';
import { ArrowLeft, Bot, Brain, Info, Layers, LineChart, Activity, PieChart, LayoutDashboard, TrendingUp, Download, ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries, ColorType, LineStyle } from 'lightweight-charts';
import { toast } from 'sonner';
import { downloadPDF } from '../lib/pdfUtils';
import { 
  WidgetKinerja, 
  WidgetMusiman, 
  WidgetFinancials, 
  WidgetDividen, 
  WidgetGauges,
  WidgetWatchlistDetail 
} from '../components/TickerAnalysisWidgets';

interface TickerParams {
  symbol: string;
}

interface TickerDetails {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  score: number;
  signal: 'Beli' | 'Akumulasi' | 'Tahan' | 'Hindari' | 'Jual';
}

interface ScoreDimension {
  name: string;
  value: number;
  subValue?: string;
  subLabel?: string;
}

interface ScoreBreakdown {
  symbol: string;
  score: number;
  dimensions: ScoreDimension[];
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  value: number;
  color: string;
}

interface FundamentalData {
  company: string;
  sector: string;
  pe: string;
  eps: string;
  roe: string;
  labaBersih: string;
}

interface SectorData {
  tickerChange: number;
  sectorChange: number;
  ihsgChange: number;
  sectorName: string;
}

export const TickerDetail: React.FC<{ params: TickerParams }> = ({ params }) => {
  const symbol = params.symbol.toUpperCase();
  const [, setLocation] = useLocation();

  const [details, setDetails] = useState<TickerDetails | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [fundamentals, setFundamentals] = useState<FundamentalData | null>(null);
  const [sectorData, setSectorData] = useState<SectorData | null>(null);
  const [range, setRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'financials' | 'ai'>('overview');

  // Lightweight Charts refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema10SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const donchianUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const donchianLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [showMA, setShowMA] = useState(true);
  const [showSMA20, setShowSMA20] = useState(false);
  const [showEMA10, setShowEMA10] = useState(false);
  const [showEMA50, setShowEMA50] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showDonchian, setShowDonchian] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        
        // 1. Fetch details
        const detailsRes = await fetch(`${base}/api/ticker/${symbol}`);
        const detailsData = detailsRes.ok ? await detailsRes.json() : null;
        
        // 2. Fetch score breakdown
        const scoreRes = await fetch(`${base}/api/ticker/${symbol}/score`);
        const scoreData = scoreRes.ok ? await scoreRes.json() : null;

        // 3. Fetch fundamentals
        const fundRes = await fetch(`${base}/api/ticker/${symbol}/fundamentals`);
        const fundData = fundRes.ok ? await fundRes.json() : null;

        // 4. Fetch sector comparison
        const secRes = await fetch(`${base}/api/ticker/${symbol}/sector`);
        const secData = secRes.ok ? await secRes.json() : null;

        setDetails(detailsData);
        setScores(scoreData);
        setFundamentals(fundData);
        setSectorData(secData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const base = window.location.origin;
        const candlesRes = await fetch(`${base}/api/ticker/${symbol}/chart?range=${range}`);
        const candlesData = candlesRes.ok ? await candlesRes.json() : [];
        setCandles(candlesData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCandles();
  }, [symbol, range]);

  // Initialize Lightweight Charts
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#686477',
      },
      grid: {
        vertLines: { color: 'rgba(43, 41, 54, 0.5)' },
        horzLines: { color: 'rgba(43, 41, 54, 0.5)' },
      },
      timeScale: {
        timeVisible: true,
        borderColor: 'rgba(43, 41, 54, 0.5)',
      },
      rightPriceScale: {
        borderColor: 'rgba(43, 41, 54, 0.5)',
      },
      crosshair: {
        mode: 0,
      }
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00e676',
      downColor: '#ff1744',
      borderVisible: false,
      wickUpColor: '#00e676',
      wickDownColor: '#ff1744',
    });
    candlestickSeriesRef.current = candlestickSeries;

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#00e676',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // highest point of the series will be at 80% of the chart
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;

    const maSeries = chart.addSeries(LineSeries, {
      color: '#ccff00',
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    maSeriesRef.current = maSeries;
    
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#00b0ff', // Light blue
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    sma20SeriesRef.current = sma20Series;
    
    const ema10Series = chart.addSeries(LineSeries, {
      color: '#ff9100', // Orange
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    ema10SeriesRef.current = ema10Series;

    const ema50Series = chart.addSeries(LineSeries, {
      color: '#e040fb', // Magenta/Purple
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    ema50SeriesRef.current = ema50Series;

    const bbUpperSeries = chart.addSeries(LineSeries, {
      color: '#00f5a0',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      crosshairMarkerVisible: false,
    });
    bbUpperSeriesRef.current = bbUpperSeries;

    const bbLowerSeries = chart.addSeries(LineSeries, {
      color: '#00f5a0',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      crosshairMarkerVisible: false,
    });
    bbLowerSeriesRef.current = bbLowerSeries;

    const donchianUpperSeries = chart.addSeries(LineSeries, {
      color: '#ff007f',
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
      crosshairMarkerVisible: false,
    });
    donchianUpperSeriesRef.current = donchianUpperSeries;

    const donchianLowerSeries = chart.addSeries(LineSeries, {
      color: '#ff007f',
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
      crosshairMarkerVisible: false,
    });
    donchianLowerSeriesRef.current = donchianLowerSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
      volumeSeriesRef.current = null;
      maSeriesRef.current = null;
      sma20SeriesRef.current = null;
      ema10SeriesRef.current = null;
      ema50SeriesRef.current = null;
      bbUpperSeriesRef.current = null;
      bbLowerSeriesRef.current = null;
      donchianUpperSeriesRef.current = null;
      donchianLowerSeriesRef.current = null;
    };
  }, [loading]); // Run when loading state changes and container becomes available

  // Update data
  useEffect(() => {
    if (candles.length === 0 || !chartRef.current) return;

    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(candles.map(c => ({
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close
      })));
    }
    
    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(candles.map(c => ({
        time: c.time,
        value: c.value,
        color: c.color
      })));
      volumeSeriesRef.current.applyOptions({ visible: showVolume });
    }

    if (
      maSeriesRef.current && 
      sma20SeriesRef.current && 
      ema10SeriesRef.current &&
      ema50SeriesRef.current &&
      bbUpperSeriesRef.current &&
      bbLowerSeriesRef.current &&
      donchianUpperSeriesRef.current &&
      donchianLowerSeriesRef.current
    ) {
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
    }

    chartRef.current.timeScale().fitContent();

  }, [candles, showMA, showSMA20, showEMA10, showEMA50, showBB, showDonchian, showVolume, loading]);

  const handleAskGemini = async () => {
    setAiLoading(true);
    setAiAnalysis('');
    
    const prompt = `Lakukan analisa singkat saham ${symbol} (${details?.name || ''}). Skor kualitatif fundamental saat ini bernilai ${details?.score || 0} dari 100 dengan status rating model '${details?.signal || 'Tahan'}'. Data fundamental: PE ${fundamentals?.pe}, EPS ${fundamentals?.eps}, ROE ${fundamentals?.roe}. Berikan evaluasi dari sisi teknikal, fundamental, dan rekomendasi. Harus sangat ringkas, padat, dan maksimal 3-4 poin (bullet-point pendek) saja.`;

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.text);
      } else {
        setAiAnalysis('Gagal menginisialisasi sambungan Gemini AI.');
      }
    } catch (err) {
      console.error(err);
      setAiAnalysis('Terjadi kesalahan sistem saat menghubungi model Gemini.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
        <p className="text-xs text-[#9f9bac] mt-4 font-sans uppercase tracking-wider">Memuat Analisis {symbol}...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="px-6 text-center py-20 font-sans">
        <h2 className="text-lg font-bold text-white">Ticker {symbol} Tidak Ditemukan</h2>
        <button onClick={() => setLocation('/')} className="mt-4 px-4 py-2 bg-[#ccff00] text-black rounded-xl text-xs font-bold">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const activeIndicatorsCount = [showMA, showSMA20, showEMA10, showEMA50, showBB, showDonchian, showVolume].filter(Boolean).length;

  return (
    <div id="ticker-detail-view" className="px-4 lg:px-6 space-y-6 pb-20">
      
      {/* Navigation and Name Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div className="flex items-center justify-between mb-4">
                <button
                id="ticker-back-btn"
                onClick={() => window.history.back()}
                className="flex items-center gap-1.5 text-xs text-[#9f9bac] hover:text-white bg-transparent border-0 cursor-pointer p-0 font-bold transition-colors"
                >
                <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                    onClick={() => downloadPDF('ticker-detail-view', `Analysis_${details.symbol}`)}
                    className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 bg-[#1b1926] hover:bg-[#252233] border border-[#2a273b] text-[#9f9bac] hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                    <Download className="w-3.5 h-3.5" /> PDF
                </button>
            </div>
            <div className="flex items-center gap-4">
                <TickerLogo symbol={details.symbol} sizeClassName="w-14 h-14" />
                <div className="text-left">
                    <div className="flex items-center gap-3 justify-start">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">{details.symbol}</h1>
                    <SignalBadge signal={details.signal} />
                    </div>
                    <span className="text-sm text-[#9f9bac] font-sans font-medium mt-1 block">{details.name}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-stretch gap-3">
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-5 py-4 text-right flex items-center justify-between md:justify-end gap-6 md:min-w-[300px] flex-1">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-[#686477] uppercase font-bold tracking-wider font-sans block leading-none mb-1.5">Harga Terakhir</span>
              <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-white">Rp {details.price.toLocaleString('id-ID')}</span>
                  <span className={`text-sm font-bold font-mono ${details.changePercent >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                      {details.changePercent >= 0 ? '+' : ''}{details.changePercent.toFixed(2)}%
                  </span>
              </div>
            </div>
          </div>
          <button
              onClick={() => downloadPDF('ticker-detail-view', `Analysis_${details.symbol}`)}
              className="hidden lg:flex flex-col items-center justify-center px-4 bg-[#ccff00] hover:bg-[#b3e600] text-black rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Download PDF"
          >
              <Download className="w-5 h-5 mb-1" />
              <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Candlestick Chart Area */}
        <div className="card card-elevated p-5 lg:col-span-8 flex flex-col space-y-4 relative min-h-[450px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-[#ccff00]" /> 
                  Grafik Perdagangan Historis
              </h3>
              <p className="text-[11px] text-[#686477] font-sans mt-0.5">Analisis teknikal interaktif dengan Lightweight Charts.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
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
                        Pilih Indikator Teknikal
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

                      {/* Volume */}
                      <button
                        onClick={() => setShowVolume(!showVolume)}
                        className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#111018] text-left transition-colors cursor-pointer border-t border-[#1b1926]/50 mt-1 pt-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded bg-[#9f9bac]" />
                          <span className="text-[10px] font-bold text-white">Volume Bar (Overlay)</span>
                        </div>
                        {showVolume && <Check className="w-3 h-3 text-[#ccff00]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Range picker buttons */}
                <div className="flex gap-1 border border-[#1b1926] bg-[#111018]/80 rounded-lg p-1">
                {(['1m', '3m', '6m', '1y'] as const).map((r) => (
                    <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-md font-extrabold text-[10px] transition-all cursor-pointer ${
                        range === r 
                        ? 'bg-[#ccff00] text-black shadow-sm' 
                        : 'text-[#686477] hover:text-white'
                    }`}
                    >
                    {r.toUpperCase()}
                    </button>
                ))}
                </div>
            </div>
          </div>
          
          {/* Canvas Wrapper */}
          <div className="flex-grow w-full h-[350px] relative rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#1b1926]">
            <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
            
            {candles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/80 z-20">
                    <span className="w-6 h-6 border-2 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
                </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Detail Ringkasan Pasar & Statistik Key Widget (Yahoo Finance) */}
            <WidgetWatchlistDetail symbol={details.symbol || symbol} showDropdown={false} />
        </div>
      </div>

      {/* 3. Interactive Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1b1926] pb-3 pt-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10 font-black'
              : 'bg-[#111018] text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Faktor & Sektor</span>
        </button>

        <button
          onClick={() => setActiveTab('technical')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'technical'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10 font-black'
              : 'bg-[#111018] text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>Teknikal & Kinerja</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'financials'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10 font-black'
              : 'bg-[#111018] text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Keuangan & Dividen</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10 font-black'
              : 'bg-[#111018] text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Analisis AI</span>
        </button>
      </div>

      {/* 4. Tab Panes Content */}

      {/* TAB 1: FAKTOR & SEKTOR */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Scoring Breakdown Factors */}
            <div className="card card-elevated p-6 bg-gradient-to-b from-[#111018] to-[#0b0a10] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ccff00]" />
                    Skor & Breakdown Faktor
                  </h3>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black font-mono text-white leading-none">
                    {typeof details?.score === 'number' ? details.score.toFixed(1) : details?.score || '-'}
                  </span>
                  <span className="text-[9px] text-[#686477] uppercase font-bold block">Skor Total</span>
                </div>
              </div>

              {scores && (
                <div className="space-y-4 mt-2">
                  {scores.dimensions.map((dim, index) => {
                    const colors = ['bg-[#ccff00]', 'bg-[#00f0ff]', 'bg-[#a855f7]', 'bg-pink-400', 'bg-emerald-400'];
                    const textColor = ['text-[#ccff00]', 'text-[#00f0ff]', 'text-[#a855f7]', 'text-pink-400', 'text-emerald-400'];
                    
                    let desc = "";
                    if (dim.name === 'Quality') desc = "Kesehatan finansial & profitabilitas.";
                    if (dim.name === 'Growth') desc = "Ekspansi harga & konsistensi pendapatan.";
                    if (dim.name === 'Value') desc = "Valuasi relatif murah dibanding sektor.";
                    if (dim.name === 'Momentum') desc = "Tren harga & kekuatan posisi MA50/200.";
                    if (dim.name === 'Volume') desc = "Likuiditas dan partisipasi pasar tinggi.";
                    if (dim.name === 'Dividend') desc = "Imbal hasil (yield) dividen tunai emiten.";

                    const valFormatted = typeof dim.value === 'number' ? dim.value.toFixed(1) : dim.value;

                    return (
                      <div key={dim.name} className="space-y-2">
                        <div className="flex justify-between items-end text-xs font-sans">
                          <div>
                            <span className="text-white font-bold block mb-0.5">{dim.name}</span>
                            <span className="text-[10px] text-[#686477] block">{desc}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`font-mono font-extrabold text-sm ${textColor[index % textColor.length]}`}>{valFormatted}</span>
                            {dim.subValue && (
                              <span className={`text-[9px] font-sans font-extrabold ${textColor[index % textColor.length]} opacity-80 mt-0.5`}>
                                {dim.subLabel && <span className="mr-1 text-[#686477]">{dim.subLabel}</span>}
                                {dim.subValue}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-[#1b1926] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index % colors.length]}`}
                            style={{ width: `${Math.min(100, Math.max(0, Number(dim.value) || 0))}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Perbandingan Sektor & Data Fundamental */}
            <div className="space-y-5">
              {sectorData && (
                <div className="card card-elevated p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2 mb-2">
                    <PieChart className="w-4 h-4 text-[#ccff00]" />
                    Perbandingan Sektor
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#111018] p-3 rounded-lg border border-[#1b1926]">
                      <span className="text-[9px] text-[#686477] uppercase font-bold block mb-1">{symbol}</span>
                      <span className={`text-sm font-bold font-mono ${sectorData.tickerChange >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                        {sectorData.tickerChange >= 0 ? '+' : ''}{sectorData.tickerChange}%
                      </span>
                    </div>
                    <div className="bg-[#111018] p-3 rounded-lg border border-[#1b1926]">
                      <span className="text-[9px] text-[#686477] uppercase font-bold block mb-1 truncate">Sektor {sectorData.sectorName}</span>
                      <span className={`text-sm font-bold font-mono ${sectorData.sectorChange >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                        {sectorData.sectorChange >= 0 ? '+' : ''}{sectorData.sectorChange}%
                      </span>
                    </div>
                    <div className="bg-[#111018] p-3 rounded-lg border border-[#1b1926]">
                      <span className="text-[9px] text-[#686477] uppercase font-bold block mb-1">IHSG</span>
                      <span className={`text-sm font-bold font-mono ${sectorData.ihsgChange >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                        {sectorData.ihsgChange >= 0 ? '+' : ''}{sectorData.ihsgChange}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-[#1b1926]">
                    {sectorData.tickerChange > sectorData.sectorChange ? (
                      <p className="text-xs text-[#00f5a0] font-sans flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Unggul {(sectorData.tickerChange - sectorData.sectorChange).toFixed(1)}% dari sektornya.
                      </p>
                    ) : (
                      <p className="text-xs text-[#ff3366] font-sans flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Tertinggal {Math.abs(sectorData.tickerChange - sectorData.sectorChange).toFixed(1)}% dari sektornya.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Data Fundamental Utama */}
              <div className="card card-elevated p-6">
                <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2 mb-4">
                  <LayoutDashboard className="w-4 h-4 text-[#ccff00]" />
                  Data Fundamental Utama
                </h3>
                
                {fundamentals ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-[#111018]/50 p-3 rounded-xl border border-[#1b1926]">
                      <span className="text-[10px] text-[#686477] font-bold block mb-0.5">P/E Ratio</span>
                      <span className="text-base font-mono text-white font-extrabold">{fundamentals.pe}x</span>
                    </div>
                    <div className="bg-[#111018]/50 p-3 rounded-xl border border-[#1b1926]">
                      <span className="text-[10px] text-[#686477] font-bold block mb-0.5">EPS</span>
                      <span className="text-base font-mono text-white font-extrabold">{fundamentals.eps}</span>
                    </div>
                    <div className="bg-[#111018]/50 p-3 rounded-xl border border-[#1b1926]">
                      <span className="text-[10px] text-[#686477] font-bold block mb-0.5">ROE</span>
                      <span className="text-base font-mono text-[#00f5a0] font-extrabold">{fundamentals.roe}%</span>
                    </div>
                    <div className="bg-[#111018]/50 p-3 rounded-xl border border-[#1b1926] col-span-2 sm:col-span-3 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-[#686477] font-bold block mb-0.5">Laba Bersih (Tahunan)</span>
                        <span className="text-base font-mono text-white font-extrabold">Rp {fundamentals.labaBersih}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#686477] font-bold block mb-0.5">Sektor Industri</span>
                        <span className="text-xs font-sans text-white font-bold px-2.5 py-1 bg-[#2b2936] rounded-full">{fundamentals.sector}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-[#686477]">Data tidak tersedia</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEKNIKAL & KINERJA */}
      {activeTab === 'technical' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <WidgetGauges symbol={symbol} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <WidgetKinerja symbol={symbol} />
            <WidgetMusiman symbol={symbol} />
          </div>
        </div>
      )}

      {/* TAB 3: KEUANGAN & DIVIDEN */}
      {activeTab === 'financials' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <WidgetFinancials symbol={symbol} />
            <WidgetDividen symbol={symbol} />
          </div>
        </div>
      )}

      {/* TAB 4: ANALISIS AI */}
      {activeTab === 'ai' && (
        <div className="animate-in fade-in duration-200">
          <div className="card card-elevated p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b1926] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">Analisis Kuantitatif AI</h3>
                  <p className="text-[10px] text-[#686477] font-sans mt-0.5">Gemini 3.5 Flash Model Analysis.</p>
                </div>
              </div>
              <button
                id="ask-gemini-analysis-btn"
                onClick={handleAskGemini}
                disabled={aiLoading}
                className="px-4 py-2 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:bg-white/5 disabled:text-[#686477] transition-all"
              >
                {aiLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" /> Mulai Analisis
                  </>
                )}
              </button>
            </div>
            
            {/* Advisory stream viewport */}
            <div className="flex-grow bg-[#111018]/50 border border-[#1b1926] rounded-xl p-5 overflow-y-auto min-h-[220px]">
              {aiAnalysis ? (
                <div className="text-[13px] text-[#c2bed0] leading-relaxed whitespace-pre-wrap font-sans">
                  {aiAnalysis}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 text-xs text-[#686477] gap-3 font-sans font-medium">
                  <Info className="w-6 h-6 text-[#1b1926]" /> 
                  <p className="max-w-[300px]">Klik tombol 'Mulai Analisis' di atas untuk memproses wawasan mendalam menggunakan model AI Gemini untuk {symbol}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
