import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { TickerLogo } from '../components/TickerLogo';
import { ArrowLeft, Bot, Brain, Info, Layers, LineChart, Activity, PieChart, LayoutDashboard, TrendingUp, Download, ChevronDown, SlidersHorizontal, Check, Newspaper, Maximize2, Minimize2, X, Bell } from 'lucide-react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries, ColorType, LineStyle, createSeriesMarkers } from 'lightweight-charts';
import { toast } from 'sonner';
import { downloadPDF } from '../lib/pdfUtils';
import { IndicatorModal } from '../components/IndicatorModal';
import { calculateIndicators, INDICATORS_REGISTRY } from '../lib/indicators';
import { Skeleton, SkeletonCard, SkeletonChart, SkeletonText } from '../components/Skeleton';
import { useAppStore } from '../stores';
import { 
  WidgetKinerja, 
  WidgetMusiman, 
  WidgetFinancials, 
  WidgetDividen, 
  WidgetGauges,
  WidgetNews,
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

  const priceAlerts = useAppStore(state => state.priceAlerts);
  const addPriceAlert = useAppStore(state => state.addPriceAlert);
  const deletePriceAlert = useAppStore(state => state.deletePriceAlert);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');

  const [details, setDetails] = useState<TickerDetails | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [fundamentals, setFundamentals] = useState<FundamentalData | null>(null);
  const [sectorData, setSectorData] = useState<SectorData | null>(null);
  const [range, setRange] = useState<'1m' | '3m' | '6m' | '1y' | '3y' | '5y' | 'max'>('3m');
  const [interval, setInterval] = useState<'1d' | '1wk' | '1mo'>('1d');
  
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'financials' | 'ai' | 'news'>('overview');

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
  const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const volMASeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const seriesMapRef = useRef<Record<string, ISeriesApi<any>>>({});
  const markersPrimitiveRef = useRef<any>(null);

  const [activeIndicatorIds, setActiveIndicatorIds] = useState<string[]>(['sma5', 'sma20', 'rsi']);
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isIntervalDropdownOpen, setIsIntervalDropdownOpen] = useState(false);
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const intervalDropdownRef = useRef<HTMLDivElement>(null);
  const rangeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (intervalDropdownRef.current && !intervalDropdownRef.current.contains(e.target as Node)) {
        setIsIntervalDropdownOpen(false);
      }
      if (rangeDropdownRef.current && !rangeDropdownRef.current.contains(e.target as Node)) {
        setIsRangeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleIndicator = (id: string) => {
    setActiveIndicatorIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearAllIndicators = () => {
    setActiveIndicatorIds([]);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => {
      const next = !prev;
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);



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
        const candlesRes = await fetch(`${base}/api/ticker/${symbol}/chart?range=max&interval=${interval}`);
        const candlesData = candlesRes.ok ? await candlesRes.json() : [];
        setCandles(candlesData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCandles();

    let intervalId: any;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [symbol, interval]);

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

    // RSI (14) Series
    const rsiSeries = chart.addSeries(LineSeries, {
      color: '#a855f7', // Purple
      lineWidth: 2,
      priceScaleId: 'rsi',
      crosshairMarkerVisible: true,
    });
    rsiSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.72, bottom: 0.02 },
      borderVisible: false,
    });
    rsiSeries.createPriceLine({
      price: 70,
      color: '#ff3366',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: '70 OB',
    });
    rsiSeries.createPriceLine({
      price: 30,
      color: '#00f5a0',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: '30 OS',
    });
    rsiSeriesRef.current = rsiSeries;

    // MACD (12, 26, 9) Series
    const macdHistSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: 'macd',
    });
    macdHistSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.75, bottom: 0.02 },
      borderVisible: false,
    });
    macdHistSeriesRef.current = macdHistSeries;

    const macdLineSeries = chart.addSeries(LineSeries, {
      color: '#00f0ff', // Cyan
      lineWidth: 2,
      priceScaleId: 'macd',
      crosshairMarkerVisible: false,
    });
    macdLineSeriesRef.current = macdLineSeries;

    const macdSignalSeries = chart.addSeries(LineSeries, {
      color: '#ff9100', // Orange
      lineWidth: 1,
      priceScaleId: 'macd',
      crosshairMarkerVisible: false,
    });
    macdSignalSeriesRef.current = macdSignalSeries;

    // Volume MA (20) Series
    const volMASeries = chart.addSeries(LineSeries, {
      color: '#facc15', // Yellow
      lineWidth: 1,
      priceScaleId: '', // Same overlay scale as Volume
      crosshairMarkerVisible: false,
    });
    volMASeriesRef.current = volMASeries;

    // VWAP Series (Main Price Chart)
    const vwapSeries = chart.addSeries(LineSeries, {
      color: '#e11d48', // Crimson/Rose
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    vwapSeriesRef.current = vwapSeries;

    return () => {
      if (markersPrimitiveRef.current) {
        try { markersPrimitiveRef.current.detach(); } catch {}
        markersPrimitiveRef.current = null;
      }
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
      rsiSeriesRef.current = null;
      macdLineSeriesRef.current = null;
      macdSignalSeriesRef.current = null;
      macdHistSeriesRef.current = null;
      volMASeriesRef.current = null;
      vwapSeriesRef.current = null;
    };
  }, [loading]); // Run when loading state changes and container becomes available

  // Update chart data & dynamic indicators
  useEffect(() => {
    if (candles.length === 0 || !chartRef.current) return;

    const validCandles = candles.filter((c: any) => 
      c && c.time && 
      Number.isFinite(Number(c.open)) && 
      Number.isFinite(Number(c.high)) && 
      Number.isFinite(Number(c.low)) && 
      Number.isFinite(Number(c.close))
    );

    if (validCandles.length === 0) return;

    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(
        validCandles.map((c) => ({
          time: c.time,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }))
      );
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(
        validCandles.map((c) => ({
          time: c.time,
          value: Number.isFinite(c.value) ? c.value : 0,
          color: c.color || (c.close >= c.open ? "rgba(0, 230, 118, 0.4)" : "rgba(255, 23, 68, 0.4)") || (c.close >= c.open ? "rgba(0, 230, 118, 0.4)" : "rgba(255, 23, 68, 0.4)"),
        }))
      );
      volumeSeriesRef.current.applyOptions({ visible: true });
    }

    // Compute indicators
    const calc = calculateIndicators(validCandles, activeIndicatorIds);
    const chart = chartRef.current;

    const getSeries = (key: string, createFn: () => ISeriesApi<any>) => {
      if (!seriesMapRef.current[key]) {
        seriesMapRef.current[key] = createFn();
      }
      return seriesMapRef.current[key];
    };

    const getColor = (id: string, fallback = '#ccff00') => {
      const def = INDICATORS_REGISTRY.find((i) => i.id === id);
      return def ? def.defaultColor : fallback;
    };

    const activeKeys = new Set<string>();

    // Single Line Overlays
    const lineOverlays = ['sma5', 'sma20', 'sma50', 'sma200', 'ema10', 'ema20', 'ema50', 'ema200', 'wma20', 'vwap', 'psar', 'supertrend', 'avwap', 'vpvrPoc'];
    lineOverlays.forEach((id) => {
      const calcKey = id === 'vpvrPoc' ? 'vpvrPoc' : id;
      if (activeIndicatorIds.includes(id === 'vpvrPoc' ? 'vpvr' : id) && calc[calcKey]) {
        activeKeys.add(calcKey);
        const s = getSeries(calcKey, () =>
          chart.addSeries(LineSeries, {
            color: getColor(id === 'vpvrPoc' ? 'vpvr' : id),
            lineWidth: id === 'psar' ? 1 : 2,
            crosshairMarkerVisible: id !== 'psar',
          })
        );
        s.setData(calc[calcKey]);
        s.applyOptions({ visible: true });
      }
    });

    // LuxAlgo Markers & Auto S/R
    if (activeIndicatorIds.includes('luxalgo')) {
      if (candlestickSeriesRef.current && calc.luxalgoMarkers) {
        if (!markersPrimitiveRef.current) {
          markersPrimitiveRef.current = createSeriesMarkers(candlestickSeriesRef.current, calc.luxalgoMarkers);
        } else {
          markersPrimitiveRef.current.setMarkers(calc.luxalgoMarkers);
        }
      }
      if (calc.luxalgoSRUpper) {
        activeKeys.add('luxalgoSRUpper');
        const sU = getSeries('luxalgoSRUpper', () =>
          chart.addSeries(LineSeries, { color: '#ff1744', lineWidth: 1, lineStyle: LineStyle.Dashed, crosshairMarkerVisible: false })
        );
        sU.setData(calc.luxalgoSRUpper);
        sU.applyOptions({ visible: true });
      }
      if (calc.luxalgoSRLower) {
        activeKeys.add('luxalgoSRLower');
        const sL = getSeries('luxalgoSRLower', () =>
          chart.addSeries(LineSeries, { color: '#00e676', lineWidth: 1, lineStyle: LineStyle.Dashed, crosshairMarkerVisible: false })
        );
        sL.setData(calc.luxalgoSRLower);
        sL.applyOptions({ visible: true });
      }
      if (calc.luxalgoOsc) {
        activeKeys.add('luxalgoOsc');
        const sO = getSeries('luxalgoOsc', () =>
          chart.addSeries(LineSeries, { color: '#ccff00', lineWidth: 2, priceScaleId: 'luxalgoOsc' })
        );
        sO.setData(calc.luxalgoOsc);
        sO.applyOptions({ visible: true });
      }
    } else {
      if (markersPrimitiveRef.current) {
        markersPrimitiveRef.current.setMarkers([]);
      }
    }

    // Ichimoku Cloud
    if (activeIndicatorIds.includes('ichimoku')) {
      const ichiKeys = [
        { k: 'ichimokuTenkan', col: '#00f0ff' },
        { k: 'ichimokuKijun', col: '#ff1744' },
        { k: 'ichimokuSpanA', col: '#00e676' },
        { k: 'ichimokuSpanB', col: '#a855f7' },
        { k: 'ichimokuChikou', col: '#facc15' },
      ];
      ichiKeys.forEach(({ k, col }) => {
        if (calc[k]) {
          activeKeys.add(k);
          const s = getSeries(k, () =>
            chart.addSeries(LineSeries, { color: col, lineWidth: 1, crosshairMarkerVisible: false })
          );
          s.setData(calc[k]);
          s.applyOptions({ visible: true });
        }
      });
    }

    // Fibonacci Retracement
    if (activeIndicatorIds.includes('fibonacci')) {
      const fibKeys = ['fib0', 'fib236', 'fib382', 'fib500', 'fib618', 'fib786', 'fib1000'];
      fibKeys.forEach((fk) => {
        if (calc[fk]) {
          activeKeys.add(fk);
          const s = getSeries(fk, () =>
            chart.addSeries(LineSeries, { color: '#eab308', lineWidth: 1, lineStyle: LineStyle.Dotted, crosshairMarkerVisible: false })
          );
          s.setData(calc[fk]);
          s.applyOptions({ visible: true });
        }
      });
    }

    // Fair Value Gap (FVG)
    if (activeIndicatorIds.includes('fvg')) {
      if (calc.fvgUpper && calc.fvgLower) {
        activeKeys.add('fvgUpper');
        activeKeys.add('fvgLower');
        const sUp = getSeries('fvgUpper', () =>
          chart.addSeries(LineSeries, { color: '#f43f5e', lineWidth: 1, lineStyle: LineStyle.Dashed, crosshairMarkerVisible: false })
        );
        const sLow = getSeries('fvgLower', () =>
          chart.addSeries(LineSeries, { color: '#00e676', lineWidth: 1, lineStyle: LineStyle.Dashed, crosshairMarkerVisible: false })
        );
        sUp.setData(calc.fvgUpper);
        sLow.setData(calc.fvgLower);
        sUp.applyOptions({ visible: true });
        sLow.applyOptions({ visible: true });
      }
    }

    // Dual Channels
    const dualChannels = [
      { id: 'bb', keys: ['bbUpper', 'bbLower'], color: '#3b82f6' },
      { id: 'donchian', keys: ['donchianUpper', 'donchianLower'], color: '#eab308' },
      { id: 'keltner', keys: ['keltnerUpper', 'keltnerLower'], color: '#06b6d4' },
    ];
    dualChannels.forEach((chan) => {
      if (activeIndicatorIds.includes(chan.id)) {
        chan.keys.forEach((k) => {
          if (calc[k]) {
            activeKeys.add(k);
            const s = getSeries(k, () =>
              chart.addSeries(LineSeries, { color: chan.color, lineWidth: 1, crosshairMarkerVisible: false })
            );
            s.setData(calc[k]);
            s.applyOptions({ visible: true });
          }
        });
      }
    });

    // Oscillators (Single Line Subpanels)
    const subPanels = ['rsi', 'cci', 'willr', 'roc', 'atr', 'obv', 'mfi', 'cvd', 'percent_b', 'rs_line'];
    subPanels.forEach((id) => {
      const calcKey = id === 'percent_b' ? 'percentB' : id === 'rs_line' ? 'rsLine' : id;
      if (activeIndicatorIds.includes(id) && calc[calcKey]) {
        activeKeys.add(calcKey);
        const s = getSeries(calcKey, () =>
          chart.addSeries(LineSeries, { color: getColor(id), lineWidth: 2, priceScaleId: id })
        );
        s.setData(calc[calcKey]);
        s.applyOptions({ visible: true });
      }
    });

    // VuManChu WaveTrend
    if (activeIndicatorIds.includes('vumanchu') && calc.vumanchuWT1 && calc.vumanchuWT2) {
      activeKeys.add('vumanchuWT1');
      activeKeys.add('vumanchuWT2');
      const sWT1 = getSeries('vumanchuWT1', () =>
        chart.addSeries(LineSeries, { color: '#00f0ff', lineWidth: 2, priceScaleId: 'vumanchu' })
      );
      const sWT2 = getSeries('vumanchuWT2', () =>
        chart.addSeries(LineSeries, { color: '#ff007f', lineWidth: 1, priceScaleId: 'vumanchu' })
      );
      sWT1.setData(calc.vumanchuWT1);
      sWT2.setData(calc.vumanchuWT2);
      sWT1.applyOptions({ visible: true });
      sWT2.applyOptions({ visible: true });
    }

    // ADX & DMI
    if (activeIndicatorIds.includes('adx') && calc.adx && calc.plusDI && calc.minusDI) {
      activeKeys.add('adx');
      activeKeys.add('plusDI');
      activeKeys.add('minusDI');
      const sADX = getSeries('adx', () =>
        chart.addSeries(LineSeries, { color: '#38bdf8', lineWidth: 2, priceScaleId: 'adx' })
      );
      const sPDI = getSeries('plusDI', () =>
        chart.addSeries(LineSeries, { color: '#00e676', lineWidth: 1, priceScaleId: 'adx' })
      );
      const sMDI = getSeries('minusDI', () =>
        chart.addSeries(LineSeries, { color: '#ff1744', lineWidth: 1, priceScaleId: 'adx' })
      );
      sADX.setData(calc.adx);
      sPDI.setData(calc.plusDI);
      sMDI.setData(calc.minusDI);
      sADX.applyOptions({ visible: true });
      sPDI.applyOptions({ visible: true });
      sMDI.applyOptions({ visible: true });
    }

    // Stochastic
    if (activeIndicatorIds.includes('stoch') && calc.stochK && calc.stochD) {
      activeKeys.add('stochK');
      activeKeys.add('stochD');
      const sK = getSeries('stochK', () =>
        chart.addSeries(LineSeries, { color: '#38bdf8', lineWidth: 2, priceScaleId: 'stoch' })
      );
      const sD = getSeries('stochD', () =>
        chart.addSeries(LineSeries, { color: '#f43f5e', lineWidth: 1, priceScaleId: 'stoch' })
      );
      sK.setData(calc.stochK);
      sD.setData(calc.stochD);
      sK.applyOptions({ visible: true });
      sD.applyOptions({ visible: true });
    }

    // MACD
    if (activeIndicatorIds.includes('macd') && calc.macdLine && calc.macdSignal && calc.macdHist) {
      activeKeys.add('macdLine');
      activeKeys.add('macdSignal');
      activeKeys.add('macdHist');
      const sHist = getSeries('macdHist', () => chart.addSeries(HistogramSeries, { priceScaleId: 'macd' }));
      const sLine = getSeries('macdLine', () =>
        chart.addSeries(LineSeries, { color: '#00f0ff', lineWidth: 2, priceScaleId: 'macd', crosshairMarkerVisible: false })
      );
      const sSig = getSeries('macdSignal', () =>
        chart.addSeries(LineSeries, { color: '#ff9100', lineWidth: 1, priceScaleId: 'macd', crosshairMarkerVisible: false })
      );
      sHist.setData(calc.macdHist);
      sLine.setData(calc.macdLine);
      sSig.setData(calc.macdSignal);
      sHist.applyOptions({ visible: true });
      sLine.applyOptions({ visible: true });
      sSig.applyOptions({ visible: true });
    }

    // Hide inactive series
    Object.keys(seriesMapRef.current).forEach((key) => {
      if (!activeKeys.has(key)) {
        seriesMapRef.current[key]?.applyOptions({ visible: false });
      }
    });

    // Dynamic scale margins to prevent overlap
    const activeSubPanels = ['rsi', 'stoch', 'macd', 'cci', 'willr', 'roc', 'atr', 'obv', 'mfi', 'cvd', 'percent_b', 'rs_line', 'luxalgoOsc', 'vumanchu', 'adx'].filter((id) =>
      activeIndicatorIds.includes(id)
    );
    const panelCount = activeSubPanels.length;

    let mainBottomMargin = 0.20;
    if (panelCount > 0) {
      const totalHeight = Math.min(0.25 * panelCount, 0.50);
      mainBottomMargin = totalHeight + 0.04;

      const singleHeight = totalHeight / panelCount;
      activeSubPanels.forEach((panelId, idx) => {
        const topMargin = 1 - totalHeight + idx * singleHeight + 0.02;
        const bottomMargin = 1 - (topMargin + singleHeight - 0.03);

        chart.priceScale(panelId).applyOptions({
          scaleMargins: {
            top: Math.max(0.05, topMargin),
            bottom: Math.max(0.02, bottomMargin),
          },
          borderVisible: false,
        });
      });
    }

    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.05, bottom: mainBottomMargin },
      autoScale: true,
    });

    if (candles.length > 0) {
      const total = candles.length;
      let limit = 65;
      if (range === '1m') limit = 22;
      else if (range === '3m') limit = 65;
      else if (range === '6m') limit = 130;
      else if (range === '1y') limit = 260;
      else if (range === '3y') limit = 780;
      else if (range === '5y') limit = 1300;
      else if (range === 'max') limit = total;

      chart.timeScale().setVisibleLogicalRange({
        from: Math.max(0, total - limit),
        to: total - 1
      });
    }
  }, [candles, activeIndicatorIds, loading, range]);

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
      <div className="px-4 lg:px-6 space-y-6 pb-20 animate-in fade-in duration-300">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-16 w-full md:w-72 rounded-xl" />
        </div>

        {/* Chart & Watchlist Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <SkeletonChart height="h-[450px]" />
          </div>
          <div className="lg:col-span-4">
            <SkeletonCard className="h-[450px] flex flex-col justify-between" />
          </div>
        </div>

        {/* Tabs Bar Skeleton */}
        <div className="flex items-center gap-2 border-b border-[#1b1926] pb-3 pt-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-9 w-32 rounded-xl" />
          ))}
        </div>

        {/* Tab Content Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkeletonCard className="h-[300px]" />
          <SkeletonCard className="h-[300px]" />
        </div>
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

  return (
    <div id="ticker-detail-view" className="px-4 lg:px-6 space-y-6 pb-20">
      <IndicatorModal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        activeIndicatorIds={activeIndicatorIds}
        onToggleIndicator={toggleIndicator}
        onClearAll={clearAllIndicators}
      />

      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111018] border border-[#221f30] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsAlertModalOpen(false)}
              className="absolute top-4 right-4 text-[#9f9bac] hover:text-white bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Set Price Alert ({symbol})</h3>
                <p className="text-xs text-[#9f9bac]">Dapatkan notifikasi realtime saat harga menyentuh target.</p>
              </div>
            </div>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold text-[#9f9bac] block mb-1">Harga Saat Ini</label>
                <div className="text-base font-mono font-bold text-white bg-[#181622] px-3 py-2 rounded-xl border border-[#2a273b]">
                  Rp {details.price.toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#9f9bac] block mb-1">Kondisi Trigger</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlertCondition('above')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      alertCondition === 'above' 
                        ? 'bg-[#00f5a0]/10 border-[#00f5a0] text-[#00f5a0]' 
                        : 'bg-[#181622] border-[#2a273b] text-[#9f9bac]'
                    }`}
                  >
                    Naik Di Atas (&gt;=)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertCondition('below')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      alertCondition === 'below' 
                        ? 'bg-[#ff3366]/10 border-[#ff3366] text-[#ff3366]' 
                        : 'bg-[#181622] border-[#2a273b] text-[#9f9bac]'
                    }`}
                  >
                    Turun Di Bawah (&lt;=)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#9f9bac] block mb-1">Target Harga (Rp)</label>
                <input
                  type="number"
                  value={targetPriceInput}
                  onChange={(e) => setTargetPriceInput(e.target.value)}
                  placeholder={`Contoh: ${details.price}`}
                  className="w-full bg-[#181622] border border-[#2a273b] rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#ccff00]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#9f9bac] hover:text-white bg-transparent border border-[#2a273b] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  const val = parseFloat(targetPriceInput);
                  if (isNaN(val) || val <= 0) {
                    toast.error('Masukkan target harga yang valid.');
                    return;
                  }
                  await addPriceAlert({
                    symbol,
                    targetPrice: val,
                    condition: alertCondition
                  });
                  setTargetPriceInput('');
                  setIsAlertModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#ccff00] hover:bg-[#b3e600] text-black transition-colors cursor-pointer"
              >
                Simpan Alert
              </button>
            </div>
          </div>
        </div>
      )}
      
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
        <div className="card card-elevated p-3.5 sm:p-5 lg:col-span-8 flex flex-col space-y-4 relative min-h-[450px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 z-10 pb-2 border-b border-[#1b1926]/40">
            <div className="flex items-center gap-3">
              <TickerLogo symbol={details.symbol} sizeClassName="w-8 h-8" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                    <span className="font-mono text-[#ccff00] font-extrabold text-base">{details.symbol}</span>
                    <span className="text-[#9f9bac] font-normal text-xs truncate max-w-[150px] sm:max-w-[250px]">{details.name}</span>
                </h3>
                <p className="text-[11px] text-[#686477] font-sans mt-0.5 flex items-center gap-2">
                  <span>Rp {details.price.toLocaleString('id-ID')}</span>
                  <span className={`font-mono font-bold ${details.changePercent >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                    ({details.changePercent >= 0 ? '+' : ''}{details.changePercent.toFixed(2)}%)
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                {/* Modal Indicator Catalog Trigger */}
                <button
                  onClick={() => setIsIndicatorModalOpen(true)}
                  className="px-4 py-2 flex items-center gap-2 text-[11px] font-bold text-white bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 rounded-xl transition-colors cursor-pointer select-none h-[36px]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span className="font-mono tracking-wide">INDIKATOR</span>
                  <span className="bg-[#ccff00] text-black px-1.5 py-0.5 rounded-md text-[10px] font-extrabold leading-none">
                    {activeIndicatorIds.length}
                  </span>
                </button>

                {/* Set Price Alert Button */}
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-4 py-2 flex items-center gap-2 text-[11px] font-bold text-white bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 rounded-xl transition-colors cursor-pointer select-none h-[36px]"
                >
                  <Bell className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span className="font-mono tracking-wide">SET ALERT</span>
                  {priceAlerts.filter(a => a.symbol === symbol && a.status === 'active').length > 0 && (
                    <span className="bg-[#ccff00] text-black px-1.5 py-0.5 rounded-md text-[10px] font-extrabold leading-none">
                      {priceAlerts.filter(a => a.symbol === symbol && a.status === 'active').length}
                    </span>
                  )}
                </button>

                {/* Time Controls Group */}
                <div className="flex items-center gap-2">
                  {/* Interval Picker Dropdown */}
                  <div className="relative" ref={intervalDropdownRef}>
                    <button
                      onClick={() => setIsIntervalDropdownOpen(!isIntervalDropdownOpen)}
                      className="flex items-center justify-between w-[100px] bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] hover:border-[#ccff00]/50 text-white text-[11px] font-bold font-mono rounded-xl pl-3 pr-2 h-[36px] transition-all cursor-pointer"
                    >
                      <span>
                        {{
                          '1m': '1 Menit',
                          '5m': '5 Menit',
                          '15m': '15 Menit',
                          '60m': '1 Jam',
                          '1d': '1 Hari',
                          '1wk': '1 Minggu',
                          '1mo': '1 Bulan'
                        }[interval]}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#8e8a9d] transition-transform ${isIntervalDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isIntervalDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-32 bg-[#111018] border border-[#2a273b] rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in duration-150">
                        {([
                          { value: '1d', label: '1 Hari' },
                          { value: '1wk', label: '1 Minggu' },
                          { value: '1mo', label: '1 Bulan' }
                        ] as const).map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setInterval(opt.value);
                              setIsIntervalDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                              interval === opt.value
                                ? 'bg-[#ccff00] text-black shadow-sm'
                                : 'text-[#8e8a9d] hover:bg-[#1b1926] hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Range Picker Dropdown */}
                  <div className="relative" ref={rangeDropdownRef}>
                    <button
                      onClick={() => setIsRangeDropdownOpen(!isRangeDropdownOpen)}
                      className="flex items-center justify-between w-[140px] bg-[#111018] hover:bg-[#1b1926] border border-[#1b1926] hover:border-[#ccff00]/50 text-white text-[11px] font-bold font-mono rounded-xl pl-3 pr-2 h-[36px] transition-all cursor-pointer"
                    >
                      <span>
                        {{
                          '1m': '1 Bulan (1M)',
                          '3m': '3 Bulan (3M)',
                          '6m': '6 Bulan (6M)',
                          '1y': '1 Tahun (1Y)',
                          '3y': '3 Tahun (3Y)',
                          '5y': '5 Tahun (5Y)',
                          'max': 'Maksimal (MAX)'
                        }[range]}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#8e8a9d] transition-transform ${isRangeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isRangeDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-40 bg-[#111018] border border-[#2a273b] rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in duration-150">
                        {([
                          { value: '1m', label: '1 Bulan (1M)' },
                          { value: '3m', label: '3 Bulan (3M)' },
                          { value: '6m', label: '6 Bulan (6M)' },
                          { value: '1y', label: '1 Tahun (1Y)' },
                          { value: '3y', label: '3 Tahun (3Y)' },
                          { value: '5y', label: '5 Tahun (5Y)' },
                          { value: 'max', label: 'Maksimal (MAX)' }
                        ] as const).map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setRange(opt.value);
                              setIsRangeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                              range === opt.value
                                ? 'bg-[#ccff00] text-black shadow-sm'
                                : 'text-[#8e8a9d] hover:bg-[#1b1926] hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

            </div>
          </div>
          
          {/* Canvas Wrapper */}
          <div className="w-full relative flex-1 rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#1b1926] min-h-[380px] sm:min-h-[450px]">
            <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
            
            {candles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/80 z-20">
                    <span className="w-6 h-6 border-2 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
                </div>
            )}

            {/* Floating Fullscreen Button at Bottom Right */}
            <button
              onClick={() => setLocation(`/full-chart/${symbol}`)}
              title="Buka Halaman Full Chart Workspace"
              className="absolute bottom-3 right-3 z-30 p-2 bg-[#111018]/90 hover:bg-[#1b1926] border border-[#2a273b] hover:border-[#ccff00] text-white rounded-xl shadow-2xl transition-all cursor-pointer flex items-center justify-center group"
            >
              <Maximize2 className="w-4 h-4 text-[#ccff00] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Detail Ringkasan Pasar & Statistik Key Widget (Yahoo Finance) */}
            <WidgetWatchlistDetail symbol={details.symbol || symbol} showDropdown={false} />

            {/* Active Price Alerts for this Ticker */}
            <div className="card card-elevated p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#ccff00]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Alert Harga Aktif</h4>
                </div>
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="text-[10px] font-bold text-[#ccff00] hover:underline bg-transparent border-0 cursor-pointer"
                >
                  + Set Baru
                </button>
              </div>

              {priceAlerts.filter(a => a.symbol === symbol && a.status === 'active').length === 0 ? (
                <p className="text-xs text-[#686477] py-2 text-center">Belum ada alert harga aktif untuk {symbol}.</p>
              ) : (
                <div className="space-y-2">
                  {priceAlerts.filter(a => a.symbol === symbol && a.status === 'active').map(alert => (
                    <div key={alert.id} className="flex items-center justify-between bg-[#181622] border border-[#2a273b] p-3 rounded-xl">
                      <div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <span>{alert.condition === 'above' ? '>= (Naik)' : '<= (Turun)'}</span>
                          <span className="text-[#ccff00]">Rp {alert.targetPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <span className="text-[10px] text-[#686477] mt-0.5 block">Dibuat: {new Date(alert.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <button
                        onClick={() => deletePriceAlert(alert.id)}
                        className="text-xs text-[#ff3366] hover:text-white bg-transparent border-0 cursor-pointer p-1"
                        title="Hapus Alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>

      {/* 3. Interactive Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1b1926] pb-3 pt-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'ai'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10 font-black'
              : 'bg-[#111018] text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Analisis AI</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'news'
              ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10 font-black'
              : 'bg-[#111018] text-[#9f9bac] hover:text-white hover:bg-[#1b1926]'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Berita & Sentimen</span>
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

      {/* TAB 5: BERITA & SENTIMEN */}
      {activeTab === 'news' && (
        <WidgetNews symbol={symbol} />
      )}
    </div>
  );
};
