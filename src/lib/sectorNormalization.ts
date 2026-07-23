// Sector-relative scoring engine untuk QUANTBIT
// Mengganti absolute threshold scoring dengan cross-sectional percentile ranking per sektor

interface StockMetric {
  ticker: string;
  sector: string;
  pe: number | null;
  pbv: number | null;
  roe: number | null;
  growthYoY: number | null;
  rsi: number | null;
  // tambahkan metrik lain sesuai kebutuhan Q/G/V/M
}

interface SectorStats {
  mean: number;
  std: number;
  count: number;
}

// ── STEP 1: Hitung mean & std per sektor per metrik ──────────────────
function computeSectorStats(
  stocks: StockMetric[],
  metricKey: keyof Omit<StockMetric, "ticker" | "sector">
): Map<string, SectorStats> {
  const bySector = new Map<string, number[]>();

  for (const s of stocks) {
    const val = s[metricKey];
    if (val === null || !isFinite(val)) continue; // skip data kotor/outlier ekstrem
    if (!bySector.has(s.sector)) bySector.set(s.sector, []);
    bySector.get(s.sector)!.push(val);
  }

  const statsMap = new Map<string, SectorStats>();
  for (const [sector, values] of bySector) {
    const n = values.length;
    if (n < 3) {
      // sektor dengan sample terlalu kecil (misal cuma 1-2 saham) -> fallback ke market-wide nanti
      statsMap.set(sector, { mean: NaN, std: NaN, count: n });
      continue;
    }
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1); // sample std
    statsMap.set(sector, { mean, std: Math.sqrt(variance), count: n });
  }
  return statsMap;
}

// ── STEP 2: Z-score per saham relatif ke sektornya ────────────────────
function zScore(value: number | null, stats: SectorStats | undefined): number | null {
  if (value === null || !stats || !isFinite(stats.mean) || stats.std === 0) return null;
  return (value - stats.mean) / stats.std;
}

// ── STEP 3: Konversi z-score ke skor 0-100 pakai normal CDF approx ────
// (pakai approximasi error function, cukup akurat untuk scoring, no dependency)
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

function zToScore(z: number | null, invert = false): number {
  if (z === null) return 50; // netral kalau data tidak lengkap, jangan hukum saham krn data kosong
  const percentile = normalCDF(invert ? -z : z); // invert dipakai untuk metrik "lower is better" (PE, PBV)
  return Math.round(percentile * 100);
}

// ── STEP 4: Orkestrasi — hitung skor Value & Quality relatif sektor ───
interface ScoredStock {
  ticker: string;
  sector: string;
  valueScore: number;
  qualityScore: number;
}

function computeSectorRelativeScores(stocks: StockMetric[]): ScoredStock[] {
  const peStats = computeSectorStats(stocks, "pe");
  const pbvStats = computeSectorStats(stocks, "pbv");
  const roeStats = computeSectorStats(stocks, "roe");
  const growthYoYStats = computeSectorStats(stocks, "growthYoY");

  return stocks.map((s) => {
    // Value: PE & PBV rendah = bagus -> invert=true
    const peZ = zScore(s.pe, peStats.get(s.sector));
    const pbvZ = zScore(s.pbv, pbvStats.get(s.sector));
    const peScore = zToScore(peZ, true);
    const pbvScore = zToScore(pbvZ, true);
    const valueScore = Math.round((peScore + pbvScore) / 2);

    // Quality: ROE & growthYoY tinggi = bagus -> invert=false
    const roeZ = zScore(s.roe, roeStats.get(s.sector));
    const growthYoYZ = zScore(s.growthYoY, growthYoYStats.get(s.sector));
    const roeScore = zToScore(roeZ, false);
    const growthYoYScore = zToScore(growthYoYZ, false);
    const qualityScore = Math.round((roeScore + growthYoYScore) / 2);

    return { ticker: s.ticker, sector: s.sector, valueScore, qualityScore };
  });
}

export {
  computeSectorStats,
  zScore,
  zToScore,
  computeSectorRelativeScores,
  type StockMetric,
  type ScoredStock,
  type SectorStats,
};
