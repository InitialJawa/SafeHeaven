import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries, ColorType, LineStyle, createSeriesMarkers } from 'lightweight-charts';
import { ArrowLeft, SlidersHorizontal, Check, LineChart, Activity, Search, ChevronDown, RefreshCw, BarChart2 } from 'lucide-react';
import { TickerLogo } from '../components/TickerLogo';
import { SignalBadge } from '../components/SignalBadge';
import { IndicatorModal } from '../components/IndicatorModal';
import { calculateIndicators, INDICATORS_REGISTRY } from '../lib/indicators';
import { useAppStore } from '../stores';

interface FullChartProps {
  params?: {
    symbol?: string;
  };
}

const POPULAR_SYMBOLS = [
  { symbol: 'BBCA', name: 'Bank Central Asia' },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia' },
  { symbol: 'BMRI', name: 'Bank Mandiri' },
  { symbol: 'TLKM', name: 'Telkom Indonesia' },
  { symbol: 'ASII', name: 'Astra International' },
  { symbol: 'AMMN', name: 'Amman Mineral' },
  { symbol: 'BBNI', name: 'Bank Negara Indonesia' },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia' },
  { symbol: 'UNTR', name: 'United Tractors' },
  { symbol: 'ICBP', name: 'Indofood CBP' },
  { symbol: 'IHSG', name: 'Indeks Harga Saham Gabungan' },
  { symbol: 'USD', name: 'US Dollar / IDR' },
  { symbol: 'GOLD', name: 'Harga Emas Antam' },
];

export const FullChart: React.FC<FullChartProps> = ({ params }) => {
  const [, setLocation] = useLocation();
  const { tickers } = useAppStore();
  const symbol = (params?.symbol || 'BBCA').toUpperCase();
  const isMacroType = ['IHSG', 'USD', 'GOLD'].includes(symbol);

  const [range, setRange] = useState<'1m' | '3m' | '6m' | '1y' | '3y' | '5y' | 'max'>('1y');
  const [interval, setInterval] = useState<'1d' | '1wk' | '1mo'>('1d');
  const [details, setDetails] = useState<any>(null);
  const [candles, setCandles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = useState<boolean>(false);
  const [isIntervalDropdownOpen, setIsIntervalDropdownOpen] = useState<boolean>(false);
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState<boolean>(false);

  // Active Technical Indicators State
  const [activeIndicatorIds, setActiveIndicatorIds] = useState<string[]>(['sma5', 'sma20', 'rsi', 'volume', 'volma']);
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState<boolean>(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const seriesMapRef = useRef<Record<string, ISeriesApi<any>>>({});
  const markersPrimitiveRef = useRef<any>(null);

  const symbolDropdownRef = useRef<HTMLDivElement>(null);
  const intervalDropdownRef = useRef<HTMLDivElement>(null);
  const rangeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (symbolDropdownRef.current && !symbolDropdownRef.current.contains(e.target as Node)) {
        setIsSymbolDropdownOpen(false);
      }
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

  // Fetch Ticker Details or Macro Info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const base = window.location.origin;
        if (isMacroType) {
          const type = symbol.toLowerCase();
          const titles: Record<string, string> = {
            ihsg: 'IHSG (Indeks Harga Saham Gabungan)',
            usd: 'Kurs USD / IDR',
            gold: 'Harga Emas Antam (Gram/IDR)',
          };
          setDetails({
            symbol: symbol,
            name: titles[type] || symbol,
            price: 0,
            changePercent: 0,
            signal: 'NEUTRAL',
          });
        } else {
          const res = await window.appFetch(`${base}/api/ticker/${symbol}`);
          if (res.ok) {
            const data = await res.json();
            setDetails(data);
          }
        }
      } catch (err) {
        console.error('Error fetching symbol details:', err);
      }
    };
    fetchInfo();
  }, [symbol, isMacroType]);

  // Fetch Candle Data
  const loadCandles = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const base = window.location.origin;
      let url = `${base}/api/ticker/${symbol}/chart?range=max&interval=${interval}`;
      if (isMacroType) {
        url = `${base}/api/market/macro?type=${symbol.toLowerCase()}&range=max&interval=${interval}`;
      }
      const res = await window.appFetch(url);
      if (res.ok) {
        const data = await res.json();
        const validData = (Array.isArray(data) ? data : []).filter((d: any) => d.time && d.close !== undefined);
        setCandles(validData);

        if (isMacroType && validData.length > 0) {
          const last = validData[validData.length - 1];
          const prev = validData.length > 1 ? validData[validData.length - 2] : last;
          const changePct = prev.close ? ((last.close - prev.close) / prev.close) * 100 : 0;
          setDetails((prevDetails: any) => ({
            ...prevDetails,
            price: last.close,
            changePercent: changePct,
          }));
        }
      } else if (!isBackground) {
        setCandles([]);
      }
    } catch (err) {
      console.error('Error loading candles:', err);
      if (!isBackground) setCandles([]);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadCandles();

    // Real-time polling
    let intervalId: any;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [symbol, interval]);

  // Initialize Lightweight Charts Engine
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: ColorType.Solid, color: '#0a0a0f' },
          textColor: '#686477',
        },
        grid: {
          vertLines: { color: 'rgba(43, 41, 54, 0.4)' },
          horzLines: { color: 'rgba(43, 41, 54, 0.4)' },
        },
        timeScale: {
          timeVisible: true,
          borderColor: '#1b1926',
        },
        rightPriceScale: {
          borderColor: '#1b1926',
        },
        crosshair: {
          mode: 0,
        },
      });

      chartRef.current = chart;

      // Primary Candlestick Series
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#00e676',
        downColor: '#ff1744',
        borderVisible: false,
        wickUpColor: '#00e676',
        wickDownColor: '#ff1744',
      });
      candlestickSeriesRef.current = candlestickSeries;
    }

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic Indicator Renderer Effect
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return;

    if (candles.length > 0) {
      const validCandles = candles.filter((c: any) => 
        c && c.time && 
        Number.isFinite(Number(c.open)) && 
        Number.isFinite(Number(c.high)) && 
        Number.isFinite(Number(c.low)) && 
        Number.isFinite(Number(c.close))
      );

      if (validCandles.length === 0) return;

      // 1. Candlestick Data
      const candleData = validCandles.map((c: any) => ({
        time: c.time,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));
      candlestickSeriesRef.current.setData(candleData);

      // 2. Compute All Active Indicators Data
      const calc = calculateIndicators(validCandles, activeIndicatorIds);

      // Helper to retrieve or create series safely
      const chart = chartRef.current;
      const getSeries = (key: string, createFn: () => ISeriesApi<any>) => {
        if (!seriesMapRef.current[key]) {
          seriesMapRef.current[key] = createFn();
        }
        return seriesMapRef.current[key];
      };

      // Helper to map color from registry
      const getColor = (id: string, fallback = '#ccff00') => {
        const def = INDICATORS_REGISTRY.find((i) => i.id === id);
        return def ? def.defaultColor : fallback;
      };

      // 3. Render Lines / Histograms for Active Indicators
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

      // Dual Line Channels
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
                chart.addSeries(LineSeries, {
                  color: chan.color,
                  lineWidth: 1,
                  crosshairMarkerVisible: false,
                })
              );
              s.setData(calc[k]);
              s.applyOptions({ visible: true });
            }
          });
        }
      });

      // Sub-Panel Oscillators
      const subPanels = ['rsi', 'cci', 'willr', 'roc', 'atr', 'obv', 'mfi', 'cvd', 'percent_b', 'rs_line'];
      subPanels.forEach((id) => {
        const calcKey = id === 'percent_b' ? 'percentB' : id === 'rs_line' ? 'rsLine' : id;
        if (activeIndicatorIds.includes(id) && calc[calcKey]) {
          activeKeys.add(calcKey);
          const s = getSeries(calcKey, () =>
            chart.addSeries(LineSeries, {
              color: getColor(id),
              lineWidth: 2,
              priceScaleId: id,
            })
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

      // Stochastic (%K and %D)
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

      // MACD (Line, Signal, Histogram)
      if (activeIndicatorIds.includes('macd') && calc.macdLine && calc.macdSignal && calc.macdHist) {
        activeKeys.add('macdLine');
        activeKeys.add('macdSignal');
        activeKeys.add('macdHist');
        const sHist = getSeries('macdHist', () =>
          chart.addSeries(HistogramSeries, { priceScaleId: 'macd' })
        );
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

      // Volume & Volume MA
      if (activeIndicatorIds.includes('volume') && calc.volume) {
        activeKeys.add('volume');
        const vSeries = getSeries('volume', () => {
          const s = chart.addSeries(HistogramSeries, {
            color: '#00e676',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
          });
          s.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
          return s;
        });
        vSeries.setData(calc.volume);
        vSeries.applyOptions({ visible: true });
      }

      if (activeIndicatorIds.includes('volma') && calc.volma) {
        activeKeys.add('volma');
        const vmSeries = getSeries('volma', () =>
          chart.addSeries(LineSeries, {
            color: '#facc15',
            lineWidth: 1,
            priceScaleId: '',
            crosshairMarkerVisible: false,
          })
        );
        vmSeries.setData(calc.volma);
        vmSeries.applyOptions({ visible: activeIndicatorIds.includes('volume') });
      }

      // Hide all non-active series
      Object.keys(seriesMapRef.current).forEach((key) => {
        if (!activeKeys.has(key)) {
          seriesMapRef.current[key]?.applyOptions({ visible: false });
        }
      });

      // 4. Calculate Sub-Panel Layout Scale Margins
      const activeSubPanelIds = ['rsi', 'stoch', 'macd', 'cci', 'willr', 'roc', 'atr', 'obv', 'mfi', 'cvd', 'percent_b', 'rs_line', 'luxalgoOsc', 'vumanchu', 'adx'].filter((id) =>
        activeIndicatorIds.includes(id)
      );
      const isVolActive = activeIndicatorIds.includes('volume');
      const panelCount = activeSubPanelIds.length;

      let mainBottomMargin = isVolActive ? 0.20 : 0.10;

      if (panelCount > 0) {
        const totalPanelHeight = Math.min(0.24 * panelCount, 0.55);
        mainBottomMargin = totalPanelHeight + (isVolActive ? 0.08 : 0);

        const singlePanelHeight = totalPanelHeight / panelCount;
        activeSubPanelIds.forEach((panelId, idx) => {
          const topMargin = 1 - totalPanelHeight + idx * singlePanelHeight + 0.02;
          const bottomMargin = 1 - (topMargin + singlePanelHeight - 0.03);

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
        scaleMargins: { top: 0.05, bottom: Math.min(0.70, mainBottomMargin) },
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
    }
  }, [candles, activeIndicatorIds, loading, range]);

  const toggleIndicator = (id: string) => {
    setActiveIndicatorIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearAllIndicators = () => {
    setActiveIndicatorIds([]);
  };

  const allSymbols = useMemo(() => {
    const map = new Map<string, { symbol: string; name: string }>();
    POPULAR_SYMBOLS.forEach((s) => map.set(s.symbol, s));
    tickers.forEach((t) => {
      if (!map.has(t.symbol)) {
        map.set(t.symbol, { symbol: t.symbol, name: t.name || t.symbol });
      }
    });
    return Array.from(map.values());
  }, [tickers]);

  const filteredSymbols = allSymbols.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-[1920px] mx-auto p-2 sm:p-4 gap-3 bg-[#0b0a10]">
      {/* Indicator Selection Catalog Modal */}
      <IndicatorModal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        activeIndicatorIds={activeIndicatorIds}
        onToggleIndicator={toggleIndicator}
        onClearAll={clearAllIndicators}
      />

      {/* Top Navigation & Controls Toolbar */}
      <div className="relative z-30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-[#111018] border border-[#1b1926] px-3 py-2.5 rounded-2xl shadow-lg shrink-0">
        
        {/* Left: Back Button & Symbol Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (isMacroType) {
                setLocation('/');
              } else {
                setLocation(`/ticker/${symbol}`);
              }
            }}
            className="p-2 bg-[#1b1926] hover:bg-[#252235] text-white rounded-xl transition-all border border-[#2a273b] hover:border-[#ccff00]/40 flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4 text-[#ccff00]" />
            <span className="hidden sm:inline font-mono">Kembali</span>
          </button>

          {/* Symbol Selector Dropdown */}
          <div className="relative" ref={symbolDropdownRef}>
            <button
              onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
              className="px-3 py-1.5 bg-[#1b1926]/90 hover:bg-[#252235] border border-[#2a273b] hover:border-[#ccff00]/50 rounded-xl text-white flex items-center gap-2.5 transition-all cursor-pointer select-none"
            >
              <TickerLogo symbol={symbol} sizeClassName="w-6 h-6" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-sm text-[#ccff00]">{symbol}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8e8a9d] transition-transform ${isSymbolDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {details?.name && (
                  <p className="text-[10px] text-[#8e8a9d] truncate max-w-[120px] sm:max-w-[180px]">{details.name}</p>
                )}
              </div>
            </button>

            {/* Symbol Dropdown Menu */}
            {isSymbolDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#111018] border border-[#2a273b] rounded-2xl shadow-2xl z-50 p-2 space-y-2 animate-in fade-in duration-150">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8e8a9d]" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Cari emiten atau indeks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b0a10] border border-[#2a273b] focus:border-[#ccff00] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#686477] outline-none font-mono"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 no-scrollbar">
                  {filteredSymbols.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => {
                        setIsSymbolDropdownOpen(false);
                        setLocation(`/full-chart/${item.symbol}`);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                        item.symbol === symbol
                          ? 'bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] font-bold'
                          : 'hover:bg-[#1b1926] text-white hover:text-[#ccff00]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <TickerLogo symbol={item.symbol} sizeClassName="w-5 h-5" />
                        <div>
                          <p className="font-mono font-bold text-xs">{item.symbol}</p>
                          <p className="text-[10px] text-[#8e8a9d] truncate max-w-[150px]">{item.name}</p>
                        </div>
                      </div>
                      {item.symbol === symbol && <Check className="w-3.5 h-3.5 text-[#ccff00]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price & Signal Display */}
          {details && (
            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-[#2a273b]">
              <div>
                <span className="font-mono text-base font-extrabold text-white">
                  Rp {details.price ? details.price.toLocaleString('id-ID') : '-'}
                </span>
                <span className={`ml-2 font-mono text-xs font-bold ${details.changePercent >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                  {details.changePercent >= 0 ? '+' : ''}{details.changePercent ? details.changePercent.toFixed(2) : '0.00'}%
                </span>
              </div>
              {details.signal && <SignalBadge signal={details.signal} />}
            </div>
          )}
        </div>

        {/* Right Controls: Range & Indicator Switcher */}
        <div className="flex flex-nowrap items-center gap-2 shrink-0">
          
          {/* Technical Indicator Catalog Modal Trigger */}
          <button
            onClick={() => setIsIndicatorModalOpen(true)}
            className="px-4 py-2 flex items-center gap-2 text-[11px] font-bold text-white bg-[#1b1926] hover:bg-[#252235] border border-[#2a273b] hover:border-[#ccff00]/50 rounded-xl transition-all cursor-pointer select-none"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ccff00]" />
            <span className="font-mono tracking-wide">INDIKATOR</span>
            <span className="bg-[#ccff00] text-black px-1.5 py-0.5 rounded-md text-[10px] font-extrabold leading-none">
              {activeIndicatorIds.length}
            </span>
          </button>

          {/* Time Controls Group */}
          <div className="flex items-center gap-2">
            {/* Interval Picker Dropdown */}
            <div className="relative" ref={intervalDropdownRef}>
              <button
                onClick={() => setIsIntervalDropdownOpen(!isIntervalDropdownOpen)}
                className="flex items-center justify-between w-[100px] bg-[#1b1926] hover:bg-[#252235] border border-[#2a273b] hover:border-[#ccff00]/50 text-white text-[11px] font-bold font-mono rounded-xl pl-3 pr-2 py-2 transition-all"
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
                <div className="absolute top-full right-0 mt-2 w-32 bg-[#111018] border border-[#1b1926] rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in duration-150">
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-mono font-bold transition-all ${
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
                className="flex items-center justify-between w-[140px] bg-[#1b1926] hover:bg-[#252235] border border-[#2a273b] hover:border-[#ccff00]/50 text-white text-[11px] font-bold font-mono rounded-xl pl-3 pr-2 py-2 transition-all"
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
                <div className="absolute top-full right-0 mt-2 w-40 bg-[#111018] border border-[#1b1926] rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in duration-150">
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-mono font-bold transition-all ${
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

          {/* Reload Data Button */}
          <button
            onClick={() => loadCandles(false)}
            className="p-2.5 bg-[#1b1926] hover:bg-[#252235] text-white rounded-xl border border-[#2a273b] hover:border-[#ccff00]/40 transition-all cursor-pointer flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 text-[#8e8a9d] hover:text-white ${loading ? 'animate-spin text-[#ccff00]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Full-Height Chart Display Workspace */}
      <div className="flex-1 w-full relative rounded-2xl overflow-hidden bg-[#0a0a0f] border border-[#1b1926] shadow-2xl min-h-0 flex flex-col">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[#686477] bg-[#0b0a10]/80 z-20 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
              <span>MEMUAT DATA GRAFIK INTERAKTIF...</span>
            </div>
          </div>
        )}

        {/* Lightweight Charts Render Target */}
        <div ref={chartContainerRef} className="w-full h-full relative" />

        {/* Empty state safeguard */}
        {!loading && candles.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-[#8e8a9d] z-10">
            <LineChart className="w-10 h-10 text-[#2a273b] mb-2" />
            <p className="font-mono text-xs font-bold text-white">Data chart tidak tersedia</p>
            <p className="text-[11px] text-[#686477] mt-1">Coba ganti pilihan timeframe range di atas.</p>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      {lastCandle && (
        <div className="bg-[#111018] border border-[#1b1926] rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8e8a9d] shrink-0 font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#ccff00]" />
              {symbol} ({range.toUpperCase()})
            </span>
            <span>OPEN: <strong className="text-white">{Number(lastCandle.open).toLocaleString('id-ID')}</strong></span>
            <span>HIGH: <strong className="text-[#00f5a0]">{Number(lastCandle.high).toLocaleString('id-ID')}</strong></span>
            <span>LOW: <strong className="text-[#ff3366]">{Number(lastCandle.low).toLocaleString('id-ID')}</strong></span>
            <span>CLOSE: <strong className="text-white">{Number(lastCandle.close).toLocaleString('id-ID')}</strong></span>
            {lastCandle.volume && (
              <span>VOL: <strong className="text-[#00f0ff]">{Number(lastCandle.volume).toLocaleString('id-ID')}</strong></span>
            )}
          </div>

          <div className="text-[10px] text-[#686477] hidden md:block">
            Standard TradingView Engine • {activeIndicatorIds.length} Indikator Aktif
          </div>
        </div>
      )}
    </div>
  );
};
