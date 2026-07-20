import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { SignalBadge } from '../components/SignalBadge';
import { TickerLogo } from '../components/TickerLogo';
import { ArrowLeft, Bot, Brain, TrendingUp, Info, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

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
}

interface ScoreBreakdown {
  symbol: string;
  score: number;
  dimensions: ScoreDimension[];
}

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const TickerDetail: React.FC<{ params: TickerParams }> = ({ params }) => {
  const symbol = params.symbol.toUpperCase();
  const [, setLocation] = useLocation();

  const [details, setDetails] = useState<TickerDetails | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [range, setRange] = useState<'1m' | '3m' | '6m'>('3m');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Canvas ref for candlestick chart
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

        // 3. Fetch chart candles
        const candlesRes = await fetch(`${base}/api/ticker/${symbol}/chart?range=${range}`);
        const candlesData = candlesRes.ok ? await candlesRes.json() : [];

        setDetails(detailsData);
        setScores(scoreData);
        setCandles(candlesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol, range]);

  // Canvas Candlestick Drawing Hook
  useEffect(() => {
    if (!canvasRef.current || candles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear background to SafeHeaven's deep violet-black
    ctx.fillStyle = '#060509';
    ctx.fillRect(0, 0, width, height);

    // Padding bounds
    const paddingLeft = 55;
    const paddingRight = 15;
    const paddingTop = 25;
    const paddingBottom = 25;
    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // Calculate Min & Max price bounds
    const prices = candles.flatMap(c => [c.high, c.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;

    // Add 5% buffer on top and bottom of price chart
    const yMax = maxPrice + priceRange * 0.05;
    const yMin = Math.max(0, minPrice - priceRange * 0.05);
    const yRange = yMax - yMin;

    // Draw grid horizontal lines & pricing labels
    ctx.strokeStyle = '#1b1926';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#686477';
    ctx.font = '9px JetBrains Mono';
    ctx.textAlign = 'right';

    const gridLinesCount = 5;
    for (let i = 0; i < gridLinesCount; i++) {
      const yFraction = i / (gridLinesCount - 1);
      const y = paddingTop + plotHeight * yFraction;
      const priceLabel = yMax - yFraction * yRange;

      // Line
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      // Price Label
      ctx.fillText(Math.round(priceLabel).toLocaleString('id-ID'), paddingLeft - 8, y + 3);
    }

    // Candle horizontal spacing
    const candleCount = candles.length;
    const candleWidth = (plotWidth / candleCount) * 0.7;
    const colSpacing = plotWidth / candleCount;

    // Helper: Map price to Y coordinate
    const getPriceY = (price: number) => {
      return paddingTop + plotHeight * (1 - (price - yMin) / yRange);
    };

    // Calculate Simple Moving Average (SMA 5) array for rendering line
    const smaValues: number[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < 4) {
        smaValues.push(candles[i].close);
      } else {
        const sum = candles[i].close + candles[i-1].close + candles[i-2].close + candles[i-3].close + candles[i-4].close;
        smaValues.push(sum / 5);
      }
    }

    // Draw Volume Bars (Faded at bottom)
    const maxVol = Math.max(...candles.map(c => c.volume));
    candles.forEach((c, idx) => {
      const x = paddingLeft + idx * colSpacing + colSpacing / 2;
      const volHeight = (c.volume / maxVol) * (plotHeight * 0.25); // Limit volume height to 25% of chart
      const volY = height - paddingBottom - volHeight;

      ctx.fillStyle = c.close >= c.open ? 'rgba(0, 245, 160, 0.08)' : 'rgba(255, 51, 102, 0.08)';
      ctx.fillRect(x - candleWidth / 2, volY, candleWidth, volHeight);
    });

    // Draw Candles (Candlestick wicks & bodies)
    candles.forEach((c, idx) => {
      const x = paddingLeft + idx * colSpacing + colSpacing / 2;
      const yOpen = getPriceY(c.open);
      const yClose = getPriceY(c.close);
      const yHigh = getPriceY(c.high);
      const yLow = getPriceY(c.low);

      const bullish = c.close >= c.open;
      const themeColor = bullish ? '#00f5a0' : '#ff3366'; // Electric Cyan / Rose

      // Draw wick line
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Draw body block
      ctx.fillStyle = themeColor;
      const rectHeight = Math.max(2, Math.abs(yClose - yOpen));
      const rectY = Math.min(yOpen, yClose);
      ctx.fillRect(x - candleWidth / 2, rectY, candleWidth, rectHeight);
    });

    // Draw SMA 5 Trend Line with SafeHeaven Neon Lime (#ccff00)
    ctx.strokeStyle = '#ccff00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    candles.forEach((c, idx) => {
      const x = paddingLeft + idx * colSpacing + colSpacing / 2;
      const y = getPriceY(smaValues[idx]);
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw date markers at start, middle, and end
    ctx.fillStyle = '#686477';
    ctx.textAlign = 'center';
    
    const labelIndexes = [0, Math.floor(candleCount / 2), candleCount - 1];
    labelIndexes.forEach((idx) => {
      if (idx >= 0 && idx < candleCount) {
        const x = paddingLeft + idx * colSpacing + colSpacing / 2;
        ctx.fillText(candles[idx].date, x, height - 8);
      }
    });

  }, [candles]);

  const handleAskGemini = async () => {
    setAiLoading(true);
    setAiAnalysis('');
    
    const prompt = `Analisis saham ${symbol} (${details?.name || ''}). Skor kualitatif fundamental saat ini bernilai ${details?.score || 0} dari 100 dengan status rating model '${details?.signal || 'Tahan'}'. Berikan evaluasi terperinci dari sisi teknikal dan fundamental, risiko, dan rekomendasi portfolio.`;

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
      setAiAnalysis('Gagal menghubungkan model analitik.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="w-8 h-8 border-3 border-[#ccff00]/30 border-t-[#ccff00] rounded-full animate-spin"></span>
        <p className="text-xs text-[#9f9bac] mt-4 font-sans uppercase tracking-wider">Membuat Laporan Kuantitatif {symbol}...</p>
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
    <div id="ticker-detail-view" className="px-6 space-y-6">
      {/* Navigation and Name Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          id="ticker-back-btn"
          onClick={() => setLocation('/')}
          className="flex items-center gap-1.5 text-xs text-[#9f9bac] hover:text-white bg-transparent border-0 cursor-pointer p-0 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Cockpit
        </button>

        <div className="flex items-center gap-3">
          <TickerLogo symbol={details.symbol} sizeClassName="w-11 h-11" />
          <div className="text-left">
            <div className="flex items-center gap-2 justify-start">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">{details.symbol}</h1>
              <span className="text-xs text-[#9f9bac] font-sans font-semibold">({details.name})</span>
            </div>
            <div className="flex items-center gap-3 mt-1 justify-start font-mono text-xs">
              <span className="text-white font-extrabold text-sm">Rp {details.price.toLocaleString('id-ID')}</span>
              <span className={details.changePercent >= 0 ? 'text-[#00f5a0] font-bold' : 'text-[#ff3366] font-bold'}>
                {details.changePercent >= 0 ? '+' : ''}{details.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-4 py-2.5 text-right flex items-center gap-3">
            <div>
              <span className="text-[9px] text-[#686477] uppercase font-bold tracking-wider font-sans block leading-none">Scoring Model</span>
              <span className="text-sm font-extrabold font-mono text-white mt-1 block leading-none">{details.score} <span className="text-xs text-[#686477]">/ 100</span></span>
            </div>
            <SignalBadge signal={details.signal} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Candlestick Chart Area */}
        <div className="card card-elevated p-6 lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">Grafik Perdagangan Historis (Candlestick)</h3>
              <p className="text-[11px] text-[#686477] font-sans">Rerata Pergerakan SMA 5 (<span className="text-[#ccff00]">kuning</span>) dan Batasan Volume (<span className="text-[#686477]">pudar</span>).</p>
            </div>

            {/* Range picker buttons */}
            <div className="flex gap-1 text-[10px]">
              {(['1m', '3m', '6m'] as const).map((r) => (
                <button
                  key={r}
                  id={`chart-range-btn-${r}`}
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 rounded-lg border font-extrabold transition-all cursor-pointer ${
                    range === r 
                      ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                      : 'bg-[#111018] border-[#1b1926] text-[#686477] hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full h-72 border border-[#1b1926] rounded-xl overflow-hidden bg-[#060509] relative shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </div>

        {/* Scoring Breakdown Factors */}
        <div className="card card-elevated p-6 lg:col-span-4 space-y-4 h-fit bg-[#0b0a10]/45">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">Bobot Komponen Fundamental</h3>
            <p className="text-[11px] text-[#686477] font-sans">Kalkulasi 5 dimensi pilar SafeHeaven.</p>
          </div>

          {scores && (
            <div className="space-y-4">
              {scores.dimensions.map((dim, index) => {
                const colors = ['bg-[#ccff00]', 'bg-[#00f0ff]', 'bg-[#a855f7]', 'bg-pink-400', 'bg-orange-400'];
                return (
                  <div key={dim.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-[#9f9bac] font-medium">{dim.name} Score</span>
                      <span className="font-mono text-white font-extrabold">{dim.value} / 100</span>
                    </div>
                    {/* custom progress bar */}
                    <div className="w-full bg-[#111018] h-1.5 rounded-full overflow-hidden border border-[#1b1926]">
                      <div 
                        className={`h-full ${colors[index % colors.length]}`}
                        style={{ width: `${dim.value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Gemini AI Stock Advisory Terminal */}
      <div className="card card-elevated p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b1926]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 animate-pulse">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">Tanya SafeHeaven AI (Asisten Kuantitatif)</h3>
              <p className="text-[11px] text-[#686477] font-sans">Model Gemini 3.5 Flash server-side menganalisis fundamental kualitatif secara real-time.</p>
            </div>
          </div>
          <button
            id="ask-gemini-analysis-btn"
            onClick={handleAskGemini}
            disabled={aiLoading}
            className="px-4 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:bg-white/5 disabled:text-[#686477] transition-all shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
          >
            {aiLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Memilah Laporan Sinyal...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 fill-current" /> Dapatkan Analisis Kuantitatif AI
              </>
            )}
          </button>
        </div>

        {/* Advisory stream viewport */}
        {aiAnalysis ? (
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl p-5 text-xs text-[#9f9bac] leading-relaxed whitespace-pre-wrap font-sans font-medium">
            {aiAnalysis}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#686477] flex items-center justify-center gap-2 font-sans font-medium">
            <Info className="w-4 h-4 text-[#ccff00]" /> Klik tombol di atas untuk memerintahkan model asisten AI menyusun laporan taktis kualitatif.
          </div>
        )}
      </div>
    </div>
  );
};
