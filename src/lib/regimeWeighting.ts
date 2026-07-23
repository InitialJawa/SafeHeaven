// Dynamic weight switching berdasarkan kondisi market (regime) untuk QUANTBIT
// Regime ditentukan dari trend IHSG (composite index), bukan per-saham

interface MarketSnapshot {
  date: string;
  ihsgClose: number;
}

type MarketRegime = "bull" | "bear" | "neutral";

interface FactorWeights {
  quality: number;
  growth: number;
  value: number;
  momentum: number;
}

// ── STEP 1: Deteksi regime dari trend IHSG ─────────────────────────────
// Pendekatan: MA50 vs MA200 (golden/death cross) + return 20 hari untuk konfirmasi momentum jangka pendek
function detectMarketRegime(history: MarketSnapshot[]): MarketRegime {
  if (history.length < 200) return "neutral"; // data belum cukup, jangan tebak-tebak

  const closes = history.map((h) => h.ihsgClose);
  const ma = (period: number) => {
    const slice = closes.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  };

  const ma50 = ma(50);
  const ma200 = ma(200);
  const return20d = (closes[closes.length - 1] - closes[closes.length - 21]) / closes[closes.length - 21];

  const trendUp = ma50 > ma200;
  const momentumUp = return20d > 0.01; // >1% dalam 20 hari dianggap momentum positif
  const momentumDown = return20d < -0.03; // <-3% dianggap koreksi tajam

  if (trendUp && momentumUp) return "bull";
  if (!trendUp && momentumDown) return "bear";
  return "neutral";
}

// ── STEP 2: Mapping regime -> bobot faktor ──────────────────────────────
const REGIME_WEIGHTS: Record<MarketRegime, FactorWeights> = {
  bull: { quality: 0.2, growth: 0.2, value: 0.1, momentum: 0.5 },
  bear: { quality: 0.35, growth: 0.15, value: 0.35, momentum: 0.15 },
  neutral: { quality: 0.3, growth: 0.2, value: 0.25, momentum: 0.25 }, // default lo saat ini kira-kira di sini
};

function getWeightsForRegime(regime: MarketRegime): FactorWeights {
  return REGIME_WEIGHTS[regime];
}

// ── STEP 3: Opsi override manual oleh user (pilih strategi sendiri) ────
type StrategyProfile = "auto" | "aggressive_momentum" | "defensive_value";

function resolveWeights(
  profile: StrategyProfile,
  regime: MarketRegime
): FactorWeights {
  if (profile === "aggressive_momentum") return REGIME_WEIGHTS.bull;
  if (profile === "defensive_value") return REGIME_WEIGHTS.bear;
  return getWeightsForRegime(regime); // "auto" -> ikut regime terdeteksi
}

export {
  detectMarketRegime,
  getWeightsForRegime,
  resolveWeights,
  REGIME_WEIGHTS,
  type MarketRegime,
  type FactorWeights,
  type StrategyProfile,
  type MarketSnapshot,
};
