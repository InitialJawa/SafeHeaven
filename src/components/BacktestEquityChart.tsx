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

interface BacktestEquityChartProps {
  data: any[];
  height?: number;
  showIhsg?: boolean;
  showGold?: boolean;
  showTaktis?: boolean;
}

export const BacktestEquityChart: React.FC<BacktestEquityChartProps> = ({ 
  data, 
  height = 480,
  showIhsg = true,
  showGold = true,
  showTaktis = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const ihsgSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const goldSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [hoverData, setHoverData] = useState<{
    time: string;
    value: number;
    ihsg: number;
    gold: number;
  } | null>(null);

  const formatShortIDR = (val: number) => {
    if (!val) return 'Rp 0';
    if (Math.abs(val) >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(2)}B`;
    }
    return `Rp ${(val / 1000000).toFixed(1)}M`;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#9f9bac',
          fontFamily: 'Plus Jakarta Sans',
        },
        grid: {
          vertLines: { color: 'rgba(27, 25, 38, 0.4)' },
          horzLines: { color: 'rgba(27, 25, 38, 0.4)' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#686477',
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
            top: 0.12,
            bottom: 0.08,
          },
        },
        timeScale: {
          borderColor: '#1b1926',
          timeVisible: false,
          secondsVisible: false,
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
        width: chartContainerRef.current.clientWidth,
        height,
      });

      chartRef.current = chart;

      const areaSeries = chart.addSeries(
        // @ts-ignore
        AreaSeries, 
        {
          lineColor: '#ccff00',
          topColor: 'rgba(204, 255, 0, 0.35)',
          bottomColor: 'rgba(204, 255, 0, 0.02)',
          lineWidth: 2,
          priceFormat: {
            type: 'custom',
            formatter: (price: number) => formatShortIDR(price),
          },
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 5,
          crosshairMarkerBorderColor: '#ccff00',
          crosshairMarkerBackgroundColor: '#060509',
          visible: showTaktis,
        }
      );
      areaSeriesRef.current = areaSeries;

      const ihsgSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#00f0ff',
          lineWidth: 2,
          priceFormat: {
            type: 'custom',
            formatter: (price: number) => formatShortIDR(price),
          },
          crosshairMarkerVisible: true,
          visible: showIhsg,
        }
      );
      ihsgSeriesRef.current = ihsgSeries;

      const goldSeries = chart.addSeries(
        // @ts-ignore
        LineSeries,
        {
          color: '#ffcc00',
          lineWidth: 2,
          priceFormat: {
            type: 'custom',
            formatter: (price: number) => formatShortIDR(price),
          },
          crosshairMarkerVisible: true,
          visible: showGold,
        }
      );
      goldSeriesRef.current = goldSeries;

      chart.subscribeCrosshairMove((param) => {
        if (param.time && param.seriesData.size > 0) {
          const areaPoint = param.seriesData.get(areaSeries) as { value: number };
          const ihsgPoint = param.seriesData.get(ihsgSeries) as { value: number };
          const goldPoint = param.seriesData.get(goldSeries) as { value: number };
          
          if (areaPoint || ihsgPoint || goldPoint) {
            setHoverData({
              time: param.time as string,
              value: areaPoint?.value || 0,
              ihsg: ihsgPoint?.value || 0,
              gold: goldPoint?.value || 0,
            });
          }
        } else {
          setHoverData(null);
        }
      });
    }

    if (data && data.length > 0 && areaSeriesRef.current && ihsgSeriesRef.current && goldSeriesRef.current) {
      const areaData = data.map(item => ({ time: item.date, value: item.value }));
      const ihsgData = data.map(item => ({ time: item.date, value: item.ihsg }));
      const goldData = data.map(item => ({ time: item.date, value: item.gold }));

      areaSeriesRef.current.setData(areaData);
      ihsgSeriesRef.current.setData(ihsgData);
      goldSeriesRef.current.setData(goldData);

      chartRef.current?.timeScale().fitContent();
    }

  }, [data]);

  // Handle height / options changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({ height });
    }
  }, [height]);

  useEffect(() => {
    if (areaSeriesRef.current) areaSeriesRef.current.applyOptions({ visible: showTaktis });
    if (ihsgSeriesRef.current) ihsgSeriesRef.current.applyOptions({ visible: showIhsg });
    if (goldSeriesRef.current) goldSeriesRef.current.applyOptions({ visible: showGold });
  }, [showTaktis, showIhsg, showGold]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: entry.contentRect.width,
          });
        }
      }
    });

    resizeObserver.observe(chartContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Tooltip Legend Overlay */}
      {hoverData ? (
        <div className="absolute top-2 left-2 z-10 bg-[#0c0b12]/90 border border-[#1b1926] p-3 rounded-xl shadow-lg pointer-events-none text-xs font-mono backdrop-blur-sm min-w-[220px]">
          <div className="text-[#9f9bac] font-sans font-bold mb-2 pb-2 border-b border-[#1b1926]/50 flex justify-between">
            <span>Date</span>
            <span className="text-white">{hoverData.time}</span>
          </div>
          <div className="space-y-1.5">
            {showTaktis && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#ccff00] font-sans font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span>
                  SafeHeaven Taktis
                </span>
                <span className="text-white font-extrabold">{formatIDR(hoverData.value)}</span>
              </div>
            )}
            {showIhsg && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#00f0ff] font-sans font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span>
                  IHSG
                </span>
                <span className="text-white font-extrabold">{formatIDR(hoverData.ihsg)}</span>
              </div>
            )}
            {showGold && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#ffcc00] font-sans font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffcc00]"></span>
                  Emas
                </span>
                <span className="text-white font-extrabold">{formatIDR(hoverData.gold)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-2 left-2 z-10 bg-[#0c0b12]/70 border border-[#1b1926] p-2 px-3 rounded-lg pointer-events-none flex gap-4 text-[10px] font-sans font-bold">
          {showTaktis && (
            <div className="flex items-center gap-1.5 text-[#ccff00]">
              <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span> SafeHaven Taktis
            </div>
          )}
          {showIhsg && (
            <div className="flex items-center gap-1.5 text-[#00f0ff]">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span> IHSG
            </div>
          )}
          {showGold && (
            <div className="flex items-center gap-1.5 text-[#ffcc00]">
              <span className="w-2 h-2 rounded-full bg-[#ffcc00]"></span> Emas
            </div>
          )}
        </div>
      )}
      
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
