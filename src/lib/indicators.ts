export interface IndicatorDef {
  id: string;
  name: string;
  category: 'overlay' | 'channels' | 'momentum' | 'volume';
  subcategory: string;
  description: string;
  overlay: boolean; // true = drawn on main chart, false = sub-panel
  defaultColor: string;
}

export const INDICATOR_CATEGORIES = [
  { id: 'all', name: 'Semua Indikator' },
  { id: 'active', name: 'Indikator Aktif' },
  { id: 'overlay', name: 'Trend & Moving Average' },
  { id: 'channels', name: 'Saluran & Volatilitas' },
  { id: 'momentum', name: 'Momentum & Oscillator' },
  { id: 'volume', name: 'Volume & Flow' },
] as const;

export const INDICATORS_REGISTRY: IndicatorDef[] = [
  // Moving Averages & Trend Overlays
  {
    id: 'sma5',
    name: 'SMA 5 (Short Trend)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Simple Moving Average 5 periode untuk mengidentifikasi momentum jangka sangat pendek.',
    overlay: true,
    defaultColor: '#ccff00',
  },
  {
    id: 'sma20',
    name: 'SMA 20 (Medium Trend)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Simple Moving Average 20 periode, standar emas garis tren acuan bulanan.',
    overlay: true,
    defaultColor: '#00f0ff',
  },
  {
    id: 'sma50',
    name: 'SMA 50 (Intermediate Trend)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Simple Moving Average 50 periode untuk mengukur tren menengah 2 bulan.',
    overlay: true,
    defaultColor: '#3b82f6',
  },
  {
    id: 'sma200',
    name: 'SMA 200 (Long Term Trend)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Batas sakral tren Bullish vs Bearish jangka panjang investor institusi.',
    overlay: true,
    defaultColor: '#eab308',
  },
  {
    id: 'ema10',
    name: 'EMA 10 (Fast Trend)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Exponential Moving Average 10 periode yang sangat responsif terhadap aksi harga.',
    overlay: true,
    defaultColor: '#ff007f',
  },
  {
    id: 'ema20',
    name: 'EMA 20 (Exponential 20)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'EMA 20 periode memberi bobot lebih tinggi pada data harga terkini.',
    overlay: true,
    defaultColor: '#00f5a0',
  },
  {
    id: 'ema50',
    name: 'EMA 50 (Exponential 50)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Garis eksponensial tren menengah untuk sinyal perlintasan (Cross Over).',
    overlay: true,
    defaultColor: '#a855f7',
  },
  {
    id: 'ema200',
    name: 'EMA 200 (Exponential 200)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Eksponensial 200 periode penentu support/resistance jangka panjang.',
    overlay: true,
    defaultColor: '#f97316',
  },
  {
    id: 'wma20',
    name: 'WMA 20 (Weighted Average)',
    category: 'overlay',
    subcategory: 'Moving Average',
    description: 'Weighted Moving Average dengan bobot linier mengutamakan candle terbaru.',
    overlay: true,
    defaultColor: '#14b8a6',
  },
  {
    id: 'vwap',
    name: 'VWAP (Volume Weighted Average)',
    category: 'overlay',
    subcategory: 'Volume Overlay',
    description: 'Harga rata-rata tertimbang volume transaksi harian yang dipakai trader institusi.',
    overlay: true,
    defaultColor: '#ec4899',
  },
  {
    id: 'supertrend',
    name: 'Supertrend (10, 3)',
    category: 'overlay',
    subcategory: 'Trend Follower',
    description: 'Indikator tren berbasis ATR yang memberikan sinyal Arah Beli (Hijau) & Jual (Merah).',
    overlay: true,
    defaultColor: '#10b981',
  },
  {
    id: 'psar',
    name: 'Parabolic SAR (0.02, 0.2)',
    category: 'overlay',
    subcategory: 'Trend Follower',
    description: 'Spot titik pemberhentian dan pembalikan tren (Stop and Reverse).',
    overlay: true,
    defaultColor: '#6366f1',
  },
  {
    id: 'luxalgo',
    name: 'LuxAlgo Suite (Signal + Osc + Auto S/R)',
    category: 'overlay',
    subcategory: 'Smart Suite',
    description: 'Multi-indicator suite: Signal Beli/Jual, hybrid RSI+Stoch oscillator, dan garis otomatis Support/Resistance.',
    overlay: true,
    defaultColor: '#ccff00',
  },
  {
    id: 'ichimoku',
    name: 'Ichimoku Cloud (Tenkan, Kijun, Span)',
    category: 'channels',
    subcategory: 'Trend & Cloud',
    description: 'Awan Ichimoku Kinko Hyo: Tenkan-sen, Kijun-sen, Senkou Span A/B & Chikou Span.',
    overlay: true,
    defaultColor: '#a855f7',
  },
  {
    id: 'avwap',
    name: 'Anchored VWAP (AVWAP)',
    category: 'overlay',
    subcategory: 'Volume Overlay',
    description: 'Volume Weighted Average Price berjangkar dari titik pivot/swing terendah historis.',
    overlay: true,
    defaultColor: '#ec4899',
  },
  {
    id: 'vpvr',
    name: 'Volume Profile / VPVR (POC)',
    category: 'volume',
    subcategory: 'Volume Profile',
    description: 'Profil volume transaksi pada tiap tingkat harga dengan indikator Point of Control (POC).',
    overlay: true,
    defaultColor: '#ff9100',
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Retracement (Auto Swing)',
    category: 'overlay',
    subcategory: 'Key Levels',
    description: 'Tingkat Fibonacci Retracement otomatis (0%, 23.6%, 38.2%, 50%, 61.8%, 78.6%, 100%).',
    overlay: true,
    defaultColor: '#eab308',
  },
  {
    id: 'fvg',
    name: 'Fair Value Gap & Order Block (ICT)',
    category: 'overlay',
    subcategory: 'Smart Money Concepts',
    description: 'Deteksi imbalance harga (FVG) dan area Order Block institusional.',
    overlay: true,
    defaultColor: '#f43f5e',
  },

  // Channels & Volatility
  {
    id: 'bb',
    name: 'Bollinger Bands (20, 2)',
    category: 'channels',
    subcategory: 'Volatility Channel',
    description: 'Pita volatilitas berbasis standar deviasi untuk mendeteksi breakout atau kondisi jenuh.',
    overlay: true,
    defaultColor: '#3b82f6',
  },
  {
    id: 'donchian',
    name: 'Donchian Channel (20)',
    category: 'channels',
    subcategory: 'Volatility Channel',
    description: 'Saluran harga tertinggi & terendah 20 periode untuk strategi trend breakout.',
    overlay: true,
    defaultColor: '#eab308',
  },
  {
    id: 'keltner',
    name: 'Keltner Channel (20, 2)',
    category: 'channels',
    subcategory: 'Volatility Channel',
    description: 'Saluran volatilitas berbasis EMA dan ATR untuk identifikasi batas kisaran abnormal.',
    overlay: true,
    defaultColor: '#06b6d4',
  },
  {
    id: 'atr',
    name: 'ATR (Average True Range 14)',
    category: 'channels',
    subcategory: 'Volatility Metric',
    description: 'Mengukur tingkat volatilitas pasar riil tanpa memperhitungkan arah pergerakan.',
    overlay: false,
    defaultColor: '#f43f5e',
  },

  // Oscillators & Momentum
  {
    id: 'vumanchu',
    name: 'VuManChu WaveTrend & MFI',
    category: 'momentum',
    subcategory: 'Oscillator',
    description: 'WaveTrend (WT1 & WT2) + Money Flow oscillator untuk mendeteksi siklus dan pembalikan tren.',
    overlay: false,
    defaultColor: '#00f0ff',
  },
  {
    id: 'adx',
    name: 'ADX & DMI Index (14)',
    category: 'momentum',
    subcategory: 'Trend Strength',
    description: 'Average Directional Index dengan +DI dan -DI untuk mengukur kekuatan tren.',
    overlay: false,
    defaultColor: '#38bdf8',
  },
  {
    id: 'percent_b',
    name: 'Bollinger %B Oscillator',
    category: 'momentum',
    subcategory: 'Oscillator',
    description: 'Posisi harga relatif terhadap pita Bollinger (0 - 1) untuk deteksi overbought/oversold.',
    overlay: false,
    defaultColor: '#06b6d4',
  },
  {
    id: 'rs_line',
    name: 'Relative Strength Line (vs Baseline)',
    category: 'momentum',
    subcategory: 'Relative Performance',
    description: 'Mengukur performa relatif pergerakan saham dibandingkan harga awal/indeks.',
    overlay: false,
    defaultColor: '#14b8a6',
  },
  {
    id: 'rsi',
    name: 'RSI (Relative Strength Index 14)',
    category: 'momentum',
    subcategory: 'Oscillator',
    description: 'Oscillator momentum 0-100 untuk mengukur kondisi Overbought (>70) & Oversold (<30).',
    overlay: false,
    defaultColor: '#a855f7',
  },
  {
    id: 'stoch',
    name: 'Stochastic Oscillator (14, 3, 3)',
    category: 'momentum',
    subcategory: 'Oscillator',
    description: 'Oscillator %K & %D pembanding harga penutupan dengan range harga historis.',
    overlay: false,
    defaultColor: '#38bdf8',
  },
  {
    id: 'macd',
    name: 'MACD (12, 26, 9)',
    category: 'momentum',
    subcategory: 'Trend Momentum',
    description: 'Moving Average Convergence Divergence dengan Histogram & Signal Line.',
    overlay: false,
    defaultColor: '#00f0ff',
  },
  {
    id: 'cci',
    name: 'CCI (Commodity Channel Index 20)',
    category: 'momentum',
    subcategory: 'Oscillator',
    description: 'Mengukur deviasi harga rata-rata relatif terhadap rata-rata statistiknya.',
    overlay: false,
    defaultColor: '#f59e0b',
  },
  {
    id: 'willr',
    name: 'Williams %R (14)',
    category: 'momentum',
    subcategory: 'Oscillator',
    description: 'Oscillator momentum terbalik (-100 hingga 0) penanda tingkat kejenuhan harga.',
    overlay: false,
    defaultColor: '#8b5cf6',
  },
  {
    id: 'roc',
    name: 'Rate of Change (ROC 12)',
    category: 'momentum',
    subcategory: 'Momentum',
    description: 'Persentase perubahan harga terkini dibandingkan harga N periode sebelumnya.',
    overlay: false,
    defaultColor: '#ec4899',
  },

  // Volume & Flow
  {
    id: 'cvd',
    name: 'Cumulative Volume Delta (CVD)',
    category: 'volume',
    subcategory: 'Volume Flow',
    description: 'Akumulasi perbedaan volume beli vs volume jual (diestimasi dari pergerakan candle).',
    overlay: false,
    defaultColor: '#10b981',
  },
  {
    id: 'volume',
    name: 'Volume Bars',
    category: 'volume',
    subcategory: 'Volume',
    description: 'Histogram jumlah lembar/lot saham yang ditransaksikan dalam tiap periode.',
    overlay: false,
    defaultColor: '#00e676',
  },
  {
    id: 'volma',
    name: 'Volume MA (20)',
    category: 'volume',
    subcategory: 'Volume Overlay',
    description: 'Garis rata-rata pergerakan volume 20 periode sebagai garis acuan likuiditas.',
    overlay: false,
    defaultColor: '#facc15',
  },
  {
    id: 'obv',
    name: 'On-Balance Volume (OBV)',
    category: 'volume',
    subcategory: 'Volume Flow',
    description: 'Akumulasi kumulatif volume transaksi berdasarkan arah penutupan harga.',
    overlay: false,
    defaultColor: '#10b981',
  },
  {
    id: 'mfi',
    name: 'Money Flow Index (MFI 14)',
    category: 'volume',
    subcategory: 'Volume Oscillator',
    description: 'RSI versi tertimbang volume untuk mendeteksi arus masuk/keluar modal (Money Flow).',
    overlay: false,
    defaultColor: '#00f0ff',
  },
];

// Helper to calculate indicator data streams
export function calculateIndicators(candles: any[], activeIds: string[]) {
  if (!candles || candles.length === 0) return {};

  const closes = candles.map(c => Number(c.close || 0));
  const highs = candles.map(c => Number(c.high || c.close || 0));
  const lows = candles.map(c => Number(c.low || c.close || 0));
  const volumes = candles.map(c => Number(c.volume || 0));

  const result: Record<string, any> = {};

  // Helpers
  const calcSMA = (period: number) => {
    return candles.map((c, i) => {
      if (i < period - 1) return null;
      const slice = closes.slice(i - period + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / period;
      return { time: c.time, value: avg };
    }).filter(Boolean);
  };

  const calcEMA = (period: number) => {
    const k = 2 / (period + 1);
    let prevEMA = closes[0];
    return candles.map((c, i) => {
      if (i === 0) {
        prevEMA = closes[0];
        return { time: c.time, value: prevEMA };
      }
      const currentEMA = (closes[i] * k) + (prevEMA * (1 - k));
      prevEMA = currentEMA;
      return { time: c.time, value: currentEMA };
    });
  };

  const calcWMA = (period: number) => {
    const denominator = (period * (period + 1)) / 2;
    return candles.map((c, i) => {
      if (i < period - 1) return null;
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += closes[i - period + 1 + j] * (j + 1);
      }
      return { time: c.time, value: sum / denominator };
    }).filter(Boolean);
  };

  // 1. SMAs
  if (activeIds.includes('sma5')) result['sma5'] = calcSMA(5);
  if (activeIds.includes('sma20')) result['sma20'] = calcSMA(20);
  if (activeIds.includes('sma50')) result['sma50'] = calcSMA(50);
  if (activeIds.includes('sma200')) result['sma200'] = calcSMA(200);

  // 2. EMAs
  if (activeIds.includes('ema10')) result['ema10'] = calcEMA(10);
  if (activeIds.includes('ema20')) result['ema20'] = calcEMA(20);
  if (activeIds.includes('ema50')) result['ema50'] = calcEMA(50);
  if (activeIds.includes('ema200')) result['ema200'] = calcEMA(200);

  // 3. WMA 20
  if (activeIds.includes('wma20')) result['wma20'] = calcWMA(20);

  // 4. VWAP
  if (activeIds.includes('vwap')) {
    let cumTPV = 0;
    let cumVol = 0;
    result['vwap'] = candles.map(c => {
      const tp = (Number(c.high) + Number(c.low) + Number(c.close)) / 3;
      const vol = Number(c.volume || 1);
      cumTPV += tp * vol;
      cumVol += vol;
      return { time: c.time, value: cumVol > 0 ? cumTPV / cumVol : tp };
    });
  }

  // 5. Parabolic SAR
  if (activeIds.includes('psar')) {
    const afStep = 0.02;
    const afMax = 0.2;
    let isBull = true;
    let sar = lows[0];
    let ep = highs[0];
    let af = afStep;
    const psarData: any[] = [];

    for (let i = 0; i < candles.length; i++) {
      psarData.push({ time: candles[i].time, value: sar });
      if (isBull) {
        if (highs[i] > ep) {
          ep = highs[i];
          af = Math.min(af + afStep, afMax);
        }
        if (lows[i] < sar) {
          isBull = false;
          sar = ep;
          ep = lows[i];
          af = afStep;
        } else {
          sar = sar + af * (ep - sar);
          if (i > 0) sar = Math.min(sar, lows[i - 1], lows[Math.max(0, i - 2)]);
        }
      } else {
        if (lows[i] < ep) {
          ep = lows[i];
          af = Math.min(af + afStep, afMax);
        }
        if (highs[i] > sar) {
          isBull = true;
          sar = ep;
          ep = highs[i];
          af = afStep;
        } else {
          sar = sar + af * (ep - sar);
          if (i > 0) sar = Math.max(sar, highs[i - 1], highs[Math.max(0, i - 2)]);
        }
      }
    }
    result['psar'] = psarData;
  }

  // 6. Supertrend (10, 3)
  if (activeIds.includes('supertrend')) {
    const period = 10;
    const multiplier = 3;
    const trs = candles.map((c, i) => {
      if (i === 0) return highs[i] - lows[i];
      return Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      );
    });

    let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const supertrendData: any[] = [];
    let prevUpper = 0;
    let prevLower = 0;
    let prevTrend = 1;

    for (let i = 0; i < candles.length; i++) {
      if (i >= period) {
        atr = (atr * (period - 1) + trs[i]) / period;
      }
      const hl2 = (highs[i] + lows[i]) / 2;
      let upperBand = hl2 + multiplier * atr;
      let lowerBand = hl2 - multiplier * atr;

      if (i > 0) {
        if (lowerBand > prevLower || closes[i - 1] < prevLower) {
          // keep
        } else {
          lowerBand = prevLower;
        }
        if (upperBand < prevUpper || closes[i - 1] > prevUpper) {
          // keep
        } else {
          upperBand = prevUpper;
        }
      }

      let currentTrend = prevTrend;
      if (prevTrend === 1) {
        if (closes[i] < lowerBand) currentTrend = -1;
      } else {
        if (closes[i] > upperBand) currentTrend = 1;
      }

      const stVal = currentTrend === 1 ? lowerBand : upperBand;
      supertrendData.push({ time: candles[i].time, value: stVal });

      prevUpper = upperBand;
      prevLower = lowerBand;
      prevTrend = currentTrend;
    }
    result['supertrend'] = supertrendData;
  }

  // 7. Bollinger Bands (20, 2)
  if (activeIds.includes('bb')) {
    const upper: any[] = [];
    const lower: any[] = [];
    candles.forEach((c, i) => {
      if (i < 19) return;
      const slice = closes.slice(i - 19, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / 20;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 20;
      const stdDev = Math.sqrt(variance);
      upper.push({ time: c.time, value: mean + (stdDev * 2) });
      lower.push({ time: c.time, value: mean - (stdDev * 2) });
    });
    result['bbUpper'] = upper;
    result['bbLower'] = lower;
  }

  // 8. Donchian Channel (20)
  if (activeIds.includes('donchian')) {
    const upper: any[] = [];
    const lower: any[] = [];
    candles.forEach((c, i) => {
      if (i < 19) return;
      const highSlice = highs.slice(i - 19, i + 1);
      const lowSlice = lows.slice(i - 19, i + 1);
      upper.push({ time: c.time, value: Math.max(...highSlice) });
      lower.push({ time: c.time, value: Math.min(...lowSlice) });
    });
    result['donchianUpper'] = upper;
    result['donchianLower'] = lower;
  }

  // 9. Keltner Channel (20, 2)
  if (activeIds.includes('keltner')) {
    const ema20 = calcEMA(20);
    const trs = candles.map((c, i) => {
      if (i === 0) return highs[i] - lows[i];
      return Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      );
    });

    const upper: any[] = [];
    const lower: any[] = [];
    let atr = trs.slice(0, 10).reduce((a, b) => a + b, 0) / 10;

    candles.forEach((c, i) => {
      if (i >= 10) atr = (atr * 9 + trs[i]) / 10;
      const middle = ema20[i]?.value || closes[i];
      upper.push({ time: c.time, value: middle + 2 * atr });
      lower.push({ time: c.time, value: middle - 2 * atr });
    });
    result['keltnerUpper'] = upper;
    result['keltnerLower'] = lower;
  }

  // 10. ATR (14)
  if (activeIds.includes('atr')) {
    const trs = candles.map((c, i) => {
      if (i === 0) return highs[i] - lows[i];
      return Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      );
    });
    const atrData: any[] = [];
    let atr = trs.slice(0, 14).reduce((a, b) => a + b, 0) / 14;
    candles.forEach((c, i) => {
      if (i < 13) return;
      if (i >= 14) atr = (atr * 13 + trs[i]) / 14;
      atrData.push({ time: c.time, value: atr });
    });
    result['atr'] = atrData;
  }

  // 11. RSI (14)
  if (activeIds.includes('rsi')) {
    const rsiData: any[] = [];
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= 14 && i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    let avgGain = gains / 14;
    let avgLoss = losses / 14;

    for (let i = 14; i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      const gain = diff >= 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;
      avgGain = (avgGain * 13 + gain) / 14;
      avgLoss = (avgLoss * 13 + loss) / 14;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      rsiData.push({ time: candles[i].time, value: rsi });
    }
    result['rsi'] = rsiData;
  }

  // 12. Stochastic Oscillator (14, 3, 3)
  if (activeIds.includes('stoch')) {
    const rawK: any[] = [];
    candles.forEach((c, i) => {
      if (i < 13) return;
      const high14 = Math.max(...highs.slice(i - 13, i + 1));
      const low14 = Math.min(...lows.slice(i - 13, i + 1));
      const diff = high14 - low14;
      const k = diff === 0 ? 50 : ((closes[i] - low14) / diff) * 100;
      rawK.push({ time: c.time, val: k });
    });

    const stochK: any[] = [];
    const stochD: any[] = [];

    rawK.forEach((rk, idx) => {
      if (idx < 2) return;
      const kSmooth = (rawK[idx].val + rawK[idx - 1].val + rawK[idx - 2].val) / 3;
      stochK.push({ time: rk.time, value: kSmooth });
    });

    stochK.forEach((sk, idx) => {
      if (idx < 2) return;
      const dSmooth = (stochK[idx].value + stochK[idx - 1].value + stochK[idx - 2].value) / 3;
      stochD.push({ time: sk.time, value: dSmooth });
    });

    result['stochK'] = stochK;
    result['stochD'] = stochD;
  }

  // 13. MACD (12, 26, 9)
  if (activeIds.includes('macd')) {
    const ema12 = calcEMA(12);
    const ema26 = calcEMA(26);
    const macdLineData: any[] = [];

    candles.forEach((c, i) => {
      const e12 = ema12[i]?.value;
      const e26 = ema26[i]?.value;
      if (e12 !== undefined && e26 !== undefined) {
        macdLineData.push({ time: c.time, value: e12 - e26 });
      }
    });

    const macdValues = macdLineData.map(d => d.value);
    const k = 2 / (9 + 1);
    let prevSignal = macdValues[0] || 0;
    const macdSignalData: any[] = [];
    const macdHistData: any[] = [];

    macdLineData.forEach((d, i) => {
      const val = d.value;
      const signal = i === 0 ? val : (val * k) + (prevSignal * (1 - k));
      prevSignal = signal;
      macdSignalData.push({ time: d.time, value: signal });
      const hist = val - signal;
      macdHistData.push({
        time: d.time,
        value: hist,
        color: hist >= 0 ? 'rgba(0, 230, 118, 0.6)' : 'rgba(255, 23, 68, 0.6)',
      });
    });

    result['macdLine'] = macdLineData;
    result['macdSignal'] = macdSignalData;
    result['macdHist'] = macdHistData;
  }

  // 14. CCI (Commodity Channel Index 20)
  if (activeIds.includes('cci')) {
    const tpList = candles.map(c => (Number(c.high) + Number(c.low) + Number(c.close)) / 3);
    const cciData: any[] = [];

    candles.forEach((c, i) => {
      if (i < 19) return;
      const tpSlice = tpList.slice(i - 19, i + 1);
      const smaTP = tpSlice.reduce((a, b) => a + b, 0) / 20;
      const meanDev = tpSlice.reduce((a, b) => a + Math.abs(b - smaTP), 0) / 20;
      const cci = meanDev === 0 ? 0 : (tpList[i] - smaTP) / (0.015 * meanDev);
      cciData.push({ time: c.time, value: cci });
    });
    result['cci'] = cciData;
  }

  // 15. Williams %R (14)
  if (activeIds.includes('willr')) {
    const willrData: any[] = [];
    candles.forEach((c, i) => {
      if (i < 13) return;
      const high14 = Math.max(...highs.slice(i - 13, i + 1));
      const low14 = Math.min(...lows.slice(i - 13, i + 1));
      const diff = high14 - low14;
      const wr = diff === 0 ? -50 : ((high14 - closes[i]) / diff) * -100;
      willrData.push({ time: c.time, value: wr });
    });
    result['willr'] = willrData;
  }

  // 16. Rate of Change (ROC 12)
  if (activeIds.includes('roc')) {
    const rocData: any[] = [];
    candles.forEach((c, i) => {
      if (i < 12) return;
      const prevClose = closes[i - 12];
      const roc = prevClose === 0 ? 0 : ((closes[i] - prevClose) / prevClose) * 100;
      rocData.push({ time: c.time, value: roc });
    });
    result['roc'] = rocData;
  }

  // 17. Volume Bars
  if (activeIds.includes('volume')) {
    result['volume'] = candles.map((c: any) => ({
      time: c.time,
      value: Number(c.volume || 0),
      color: Number(c.close) >= Number(c.open) ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 23, 68, 0.4)',
    }));
  }

  // 18. Volume MA (20)
  if (activeIds.includes('volma')) {
    result['volma'] = candles.map((c, i) => {
      if (i < 19) return null;
      const slice = volumes.slice(i - 19, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / 20;
      return { time: c.time, value: avg };
    }).filter(Boolean);
  }

  // 19. On-Balance Volume (OBV)
  if (activeIds.includes('obv')) {
    const obvData: any[] = [];
    let currentOBV = 0;
    candles.forEach((c, i) => {
      if (i === 0) {
        obvData.push({ time: c.time, value: 0 });
        return;
      }
      if (closes[i] > closes[i - 1]) currentOBV += volumes[i];
      else if (closes[i] < closes[i - 1]) currentOBV -= volumes[i];
      obvData.push({ time: c.time, value: currentOBV });
    });
    result['obv'] = obvData;
  }

  // 20. Money Flow Index (MFI 14)
  if (activeIds.includes('mfi')) {
    const tpList = candles.map(c => (Number(c.high) + Number(c.low) + Number(c.close)) / 3);
    const mfiData: any[] = [];

    for (let i = 14; i < candles.length; i++) {
      let posFlow = 0;
      let negFlow = 0;

      for (let j = i - 13; j <= i; j++) {
        const rawMF = tpList[j] * volumes[j];
        if (tpList[j] >= tpList[j - 1]) posFlow += rawMF;
        else negFlow += rawMF;
      }

      const mr = negFlow === 0 ? 100 : posFlow / negFlow;
      const mfi = 100 - (100 / (1 + mr));
      mfiData.push({ time: candles[i].time, value: mfi });
    }
    result['mfi'] = mfiData;
  }

  // 21. LuxAlgo Suite (Signal + Osc + Auto S/R)
  if (activeIds.includes('luxalgo')) {
    const ema10 = calcEMA(10);
    const ema50 = calcEMA(50);

    const rsiData: number[] = [];
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= 14 && i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    let avgG = gains / 14;
    let avgL = losses / 14;
    for (let i = 0; i < closes.length; i++) {
      if (i < 14) {
        rsiData.push(50);
        continue;
      }
      const diff = closes[i] - closes[i - 1];
      const gain = diff >= 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;
      avgG = (avgG * 13 + gain) / 14;
      avgL = (avgL * 13 + loss) / 14;
      const rs = avgL === 0 ? 100 : avgG / avgL;
      rsiData.push(100 - (100 / (1 + rs)));
    }

    const stochKData: number[] = [];
    candles.forEach((_, i) => {
      if (i < 13) {
        stochKData.push(50);
        return;
      }
      const h14 = Math.max(...highs.slice(i - 13, i + 1));
      const l14 = Math.min(...lows.slice(i - 13, i + 1));
      const diff = h14 - l14;
      stochKData.push(diff === 0 ? 50 : ((closes[i] - l14) / diff) * 100);
    });

    const osc: any[] = [];
    const buyMarkers: any[] = [];
    const sellMarkers: any[] = [];

    for (let i = 0; i < candles.length; i++) {
      const rVal = rsiData[i] || 50;
      const sVal = stochKData[i] || 50;
      const comboOsc = (rVal + sVal) / 2;
      osc.push({ time: candles[i].time, value: comboOsc });

      if (i > 0 && ema10[i] && ema50[i] && ema10[i - 1] && ema50[i - 1]) {
        const e10Now = ema10[i].value;
        const e50Now = ema50[i].value;
        const e10Prev = ema10[i - 1].value;
        const e50Prev = ema50[i - 1].value;

        if (e10Prev <= e50Prev && e10Now > e50Now && rVal > 50) {
          buyMarkers.push({
            time: candles[i].time,
            position: 'belowBar',
            color: '#00e676',
            shape: 'arrowUp',
            text: 'BUY',
          });
        }
        if (e10Prev >= e50Prev && e10Now < e50Now && rVal < 50) {
          sellMarkers.push({
            time: candles[i].time,
            position: 'aboveBar',
            color: '#ff1744',
            shape: 'arrowDown',
            text: 'SELL',
          });
        }
      }
    }

    const periodSR = Math.min(30, candles.length);
    const recentHighs = highs.slice(-periodSR);
    const recentLows = lows.slice(-periodSR);
    const srUpper = Math.max(...recentHighs);
    const srLower = Math.min(...recentLows);

    result['luxalgoOsc'] = osc;
    result['luxalgoMarkers'] = [...buyMarkers, ...sellMarkers];
    result['luxalgoSRUpper'] = candles.map((c) => ({ time: c.time, value: srUpper }));
    result['luxalgoSRLower'] = candles.map((c) => ({ time: c.time, value: srLower }));
  }

  // 22. VuManChu WaveTrend & MFI
  if (activeIds.includes('vumanchu')) {
    const ap = candles.map((c) => (Number(c.high) + Number(c.low) + Number(c.close)) / 3);

    const k10 = 2 / 11;
    let prevESA = ap[0];
    const esa = ap.map((val, i) => {
      if (i === 0) return val;
      prevESA = val * k10 + prevESA * (1 - k10);
      return prevESA;
    });

    let prevD = 0;
    const dArr = ap.map((val, i) => {
      const diff = Math.abs(val - esa[i]);
      if (i === 0) {
        prevD = diff;
        return diff;
      }
      prevD = diff * k10 + prevD * (1 - k10);
      return prevD;
    });

    const ci = ap.map((val, i) => {
      const dVal = dArr[i];
      return dVal === 0 ? 0 : (val - esa[i]) / (0.015 * dVal);
    });

    const k21 = 2 / 22;
    let prevWT1 = ci[0];
    const wt1Arr = ci.map((val, i) => {
      if (i === 0) return val;
      prevWT1 = val * k21 + prevWT1 * (1 - k21);
      return prevWT1;
    });

    const wt1Data: any[] = [];
    const wt2Data: any[] = [];
    wt1Arr.forEach((w1, i) => {
      wt1Data.push({ time: candles[i].time, value: w1 });
      if (i < 3) {
        wt2Data.push({ time: candles[i].time, value: w1 });
      } else {
        const sma4 = (wt1Arr[i] + wt1Arr[i - 1] + wt1Arr[i - 2] + wt1Arr[i - 3]) / 4;
        wt2Data.push({ time: candles[i].time, value: sma4 });
      }
    });

    result['vumanchuWT1'] = wt1Data;
    result['vumanchuWT2'] = wt2Data;
  }

  // 23. Volume Profile / VPVR (POC)
  if (activeIds.includes('vpvr')) {
    const maxP = Math.max(...highs);
    const minP = Math.min(...lows);
    const priceRange = maxP - minP;
    const step = Math.max(1, Math.round(priceRange / 50));

    const buckets: Record<number, number> = {};
    candles.forEach((_, idx) => {
      const h = highs[idx];
      const l = lows[idx];
      const vol = volumes[idx] || 1;
      const steps = Math.max(1, Math.ceil((h - l) / step));
      const volPerStep = vol / steps;

      for (let p = l; p <= h; p += step) {
        const bucket = Math.round(p / step) * step;
        buckets[bucket] = (buckets[bucket] || 0) + volPerStep;
      }
    });

    let pocPrice = (maxP + minP) / 2;
    let maxVol = 0;
    Object.entries(buckets).forEach(([priceStr, vol]) => {
      if (vol > maxVol) {
        maxVol = vol;
        pocPrice = Number(priceStr);
      }
    });

    result['vpvrPoc'] = candles.map((c) => ({ time: c.time, value: pocPrice }));
  }

  // 24. Ichimoku Cloud (Tenkan, Kijun, Span)
  if (activeIds.includes('ichimoku')) {
    const calcMid = (period: number, idx: number) => {
      if (idx < period - 1) return (highs[idx] + lows[idx]) / 2;
      const hSlice = highs.slice(idx - period + 1, idx + 1);
      const lSlice = lows.slice(idx - period + 1, idx + 1);
      return (Math.max(...hSlice) + Math.min(...lSlice)) / 2;
    };

    const tenkanData: any[] = [];
    const kijunData: any[] = [];
    const spanAData: any[] = [];
    const spanBData: any[] = [];
    const chikouData: any[] = [];

    candles.forEach((c, i) => {
      const tenkan = calcMid(9, i);
      const kijun = calcMid(26, i);
      const spanA = (tenkan + kijun) / 2;
      const spanB = calcMid(52, i);

      tenkanData.push({ time: c.time, value: tenkan });
      kijunData.push({ time: c.time, value: kijun });
      spanAData.push({ time: c.time, value: spanA });
      spanBData.push({ time: c.time, value: spanB });
      chikouData.push({ time: c.time, value: closes[i] });
    });

    result['ichimokuTenkan'] = tenkanData;
    result['ichimokuKijun'] = kijunData;
    result['ichimokuSpanA'] = spanAData;
    result['ichimokuSpanB'] = spanBData;
    result['ichimokuChikou'] = chikouData;
  }

  // 25. Anchored VWAP
  if (activeIds.includes('avwap')) {
    let minIdx = 0;
    let minL = lows[0];
    lows.forEach((l, idx) => {
      if (l < minL) {
        minL = l;
        minIdx = idx;
      }
    });

    let cumPV = 0;
    let cumV = 0;
    const avwapData: any[] = [];

    candles.forEach((c, i) => {
      if (i >= minIdx) {
        const tp = (highs[i] + lows[i] + closes[i]) / 3;
        const vol = volumes[i] || 1;
        cumPV += tp * vol;
        cumV += vol;
        avwapData.push({ time: c.time, value: cumPV / cumV });
      }
    });

    result['avwap'] = avwapData;
  }

  // 26. ADX & DMI Index (14)
  if (activeIds.includes('adx')) {
    const period = 14;
    const plusDM: number[] = [];
    const minusDM: number[] = [];
    const tr: number[] = [];

    for (let i = 0; i < candles.length; i++) {
      if (i === 0) {
        plusDM.push(0);
        minusDM.push(0);
        tr.push(highs[0] - lows[0]);
        continue;
      }
      const upMove = highs[i] - highs[i - 1];
      const downMove = lows[i - 1] - lows[i];

      plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
      minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);

      const trueRange = Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      );
      tr.push(trueRange);
    }

    const smooth = (arr: number[]) => {
      const smoothed: number[] = [];
      let sum = arr.slice(0, period).reduce((a, b) => a + b, 0);
      smoothed.push(sum);
      for (let i = period; i < arr.length; i++) {
        sum = sum - sum / period + arr[i];
        smoothed.push(sum);
      }
      return smoothed;
    };

    const str = smooth(tr);
    const sPlusDM = smooth(plusDM);
    const sMinusDM = smooth(minusDM);

    const plusDIData: any[] = [];
    const minusDIData: any[] = [];
    const dxList: number[] = [];

    for (let i = 0; i < str.length; i++) {
      const candleIdx = i + period - 1;
      const trVal = str[i];
      const pDI = trVal === 0 ? 0 : (sPlusDM[i] / trVal) * 100;
      const mDI = trVal === 0 ? 0 : (sMinusDM[i] / trVal) * 100;

      plusDIData.push({ time: candles[candleIdx].time, value: pDI });
      minusDIData.push({ time: candles[candleIdx].time, value: mDI });

      const diSum = pDI + mDI;
      const dx = diSum === 0 ? 0 : (Math.abs(pDI - mDI) / diSum) * 100;
      dxList.push(dx);
    }

    const adxData: any[] = [];
    let adxVal = dxList.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = 0; i < dxList.length; i++) {
      const candleIdx = i + period - 1;
      if (i < period) {
        adxData.push({ time: candles[candleIdx].time, value: adxVal });
      } else {
        adxVal = (adxVal * (period - 1) + dxList[i]) / period;
        adxData.push({ time: candles[candleIdx].time, value: adxVal });
      }
    }

    result['adx'] = adxData;
    result['plusDI'] = plusDIData;
    result['minusDI'] = minusDIData;
  }

  // 27. Fibonacci Retracement
  if (activeIds.includes('fibonacci')) {
    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);
    const diff = maxHigh - minLow;

    const levels = [
      { key: 'fib0', val: maxHigh },
      { key: 'fib236', val: maxHigh - diff * 0.236 },
      { key: 'fib382', val: maxHigh - diff * 0.382 },
      { key: 'fib500', val: maxHigh - diff * 0.500 },
      { key: 'fib618', val: maxHigh - diff * 0.618 },
      { key: 'fib786', val: maxHigh - diff * 0.786 },
      { key: 'fib1000', val: minLow },
    ];

    levels.forEach((l) => {
      result[l.key] = candles.map((c) => ({ time: c.time, value: l.val }));
    });
  }

  // 28. Cumulative Volume Delta (CVD)
  if (activeIds.includes('cvd')) {
    let cumDelta = 0;
    const cvdData: any[] = [];
    candles.forEach((c, i) => {
      const vol = Number(c.volume || 1);
      const delta = closes[i] >= (c.open || closes[i]) ? vol : -vol;
      cumDelta += delta;
      cvdData.push({ time: c.time, value: cumDelta });
    });
    result['cvd'] = cvdData;
  }

  // 29. Fair Value Gap & Order Block (ICT)
  if (activeIds.includes('fvg')) {
    const fvgUpperData: any[] = [];
    const fvgLowerData: any[] = [];

    for (let i = 2; i < candles.length; i++) {
      const c1High = highs[i - 2];
      const c3Low = lows[i];

      const c1Low = lows[i - 2];
      const c3High = highs[i];

      if (c3Low > c1High) {
        fvgUpperData.push({ time: candles[i].time, value: c3Low });
        fvgLowerData.push({ time: candles[i].time, value: c1High });
      } else if (c3High < c1Low) {
        fvgUpperData.push({ time: candles[i].time, value: c1Low });
        fvgLowerData.push({ time: candles[i].time, value: c3High });
      }
    }

    result['fvgUpper'] = fvgUpperData;
    result['fvgLower'] = fvgLowerData;
  }

  // 30. Bollinger %B Oscillator
  if (activeIds.includes('percent_b')) {
    const pbData: any[] = [];
    candles.forEach((c, i) => {
      if (i < 19) return;
      const slice = closes.slice(i - 19, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / 20;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 20;
      const stdDev = Math.sqrt(variance);
      const upper = mean + 2 * stdDev;
      const lower = mean - 2 * stdDev;
      const pb = upper === lower ? 0.5 : (closes[i] - lower) / (upper - lower);
      pbData.push({ time: c.time, value: pb });
    });
    result['percentB'] = pbData;
  }

  // 31. Relative Strength Line (vs Baseline)
  if (activeIds.includes('rs_line')) {
    const baseClose = closes[0] || 1;
    const rsData = candles.map((c, i) => {
      const relVal = (closes[i] / baseClose) * 100;
      return { time: c.time, value: relVal };
    });
    result['rsLine'] = rsData;
  }

  Object.keys(result).forEach(key => {
    if (Array.isArray(result[key])) {
      result[key] = result[key].filter(d => d && d.time && Number.isFinite(d.value));
    }
  });

  return result;
}
