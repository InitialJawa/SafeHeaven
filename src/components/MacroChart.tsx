import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType, CandlestickSeries, LineSeries, HistogramSeries, createSeriesMarkers } from 'lightweight-charts';
import { Activity, DollarSign, Coins, SlidersHorizontal, Maximize2 } from 'lucide-react';
import { IndicatorModal } from './IndicatorModal';
import { calculateIndicators, INDICATORS_REGISTRY } from '../lib/indicators';

interface MacroChartProps {
  initialType?: 'ihsg' | 'usd' | 'gold';
}

export const MacroChart: React.FC<MacroChartProps> = ({ initialType = 'ihsg' }) => {
  const [, setLocation] = useLocation();
  const [type, setType] = useState(initialType);
  const [range, setRange] = useState('3m');
  const [loading, setLoading] = useState(false);
  const [candles, setCandles] = useState<any[]>([]);

  // Active Technical Indicators
  const [activeIndicatorIds, setActiveIndicatorIds] = useState<string[]>(['sma5', 'sma20', 'rsi']);
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const seriesMapRef = useRef<Record<string, ISeriesApi<any>>>({});
  const markersPrimitiveRef = useRef<any>(null);

  // Fetch Macro Candle Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = window.location.origin;
        const res = await window.appFetch(`${base}/api/market/macro?type=${type}&range=max`);
        if (res.ok) {
          const data = await res.json();
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
  }, [type]);

  // Initialize Lightweight Chart Engine
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
          vertLines: { color: 'rgba(43, 41, 54, 0.3)' },
          horzLines: { color: 'rgba(43, 41, 54, 0.3)' },
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

  // Update Candle & Indicator Data
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

      // Candlesticks
      const candleData = validCandles.map((c: any) => ({
        time: c.time,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));
      candlestickSeriesRef.current.setData(candleData);

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

      // Scale margins
      const activeSubPanels = ['rsi', 'stoch', 'macd', 'cci', 'willr', 'roc', 'atr', 'obv', 'mfi', 'cvd', 'percent_b', 'rs_line', 'luxalgoOsc', 'vumanchu', 'adx'].filter((id) =>
        activeIndicatorIds.includes(id)
      );
      const panelCount = activeSubPanels.length;

      let mainBottomMargin = 0.08;
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

  const typeConfig = {
    ihsg: { title: 'IHSG (Indeks Saham Composite)', desc: 'Indeks Utama Bursa Efek Indonesia' },
    usd: { title: 'Kurs USD / IDR', desc: 'Rupiah terhadap Dolar Amerika Serikat' },
    gold: { title: 'Harga Emas Antam (IDR/Gram)', desc: 'Komoditas Emas Batangan Fisik' },
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <IndicatorModal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        activeIndicatorIds={activeIndicatorIds}
        onToggleIndicator={toggleIndicator}
        onClearAll={clearAllIndicators}
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-3 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight font-sans mb-0.5 flex items-center gap-2">
            {typeConfig[type].title}
          </h3>
          <p className="text-[11px] text-[#686477] font-sans">{typeConfig[type].desc}</p>
        </div>

        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5 w-full lg:w-auto">
          {/* Asset Switcher */}
          <div className="flex gap-1 bg-[#111018]/80 p-1 rounded-lg border border-[#1b1926] shrink-0">
            <button
              onClick={() => setType('ihsg')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                type === 'ihsg' ? 'bg-[#1b1926] text-[#ccff00]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'
              }`}
            >
              <Activity className="w-3 h-3" /> IHSG
            </button>
            <button
              onClick={() => setType('usd')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                type === 'usd' ? 'bg-[#1b1926] text-[#00f0ff]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'
              }`}
            >
              <DollarSign className="w-3 h-3" /> USD
            </button>
            <button
              onClick={() => setType('gold')}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                type === 'gold' ? 'bg-[#1b1926] text-[#ff9100]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'
              }`}
            >
              <Coins className="w-3 h-3" /> GOLD
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 max-w-full">
            {/* Indicator Modal Trigger Button */}
            <button
              onClick={() => setIsIndicatorModalOpen(true)}
              className="px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold text-white bg-[#111018]/80 hover:bg-[#1b1926] border border-[#1b1926] hover:border-[#ccff00]/40 rounded-lg transition-colors cursor-pointer select-none"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#ccff00]" />
              <span>Indikator</span>
              <span className="bg-[#ccff00] text-black px-1.5 py-0.2 rounded-md text-[10px] font-extrabold">
                {activeIndicatorIds.length}
              </span>
            </button>

            {/* Timeframe Range Selector */}
            <div className="flex flex-wrap gap-1 bg-[#111018]/80 border border-[#1b1926] p-1 rounded-lg shrink-0 overflow-x-auto max-w-full">
              {['1m', '3m', '6m', '1y', '3y', '5y', 'max'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md transition-colors cursor-pointer shrink-0 ${
                    range === r ? 'bg-[#1b1926] text-white border border-[#2a273b]' : 'text-[#686477] hover:text-white hover:bg-[#1b1926]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>


          </div>
        </div>
      </div>

      <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#1b1926]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#686477] bg-[#0b0a10]/80 z-10 animate-pulse rounded-lg">
            LOADING DATA...
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0 rounded-lg overflow-hidden" />

        <button
          onClick={() => setLocation(`/full-chart/${type.toUpperCase()}`)}
          title="Buka Halaman Full Chart Workspace"
          className="absolute bottom-3 right-3 z-30 p-2 bg-[#111018]/90 hover:bg-[#1b1926] border border-[#2a273b] hover:border-[#ccff00] text-white rounded-xl shadow-2xl transition-all cursor-pointer flex items-center justify-center group"
        >
          <Maximize2 className="w-4 h-4 text-[#ccff00] group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
