import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ExternalLink, 
  Newspaper, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  X,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { TickerLogo } from './TickerLogo';
import { Skeleton, SkeletonCard } from './Skeleton';

const POPULAR_TICKERS = [
  { symbol: 'IHSG', name: 'Indeks Harga Saham Gabungan (^JKSE)' },
  { symbol: 'BBCA', name: 'PT Bank Central Asia Tbk' },
  { symbol: 'BBRI', name: 'PT Bank Rakyat Indonesia Tbk' },
  { symbol: 'BMRI', name: 'PT Bank Mandiri (Persero) Tbk' },
  { symbol: 'TLKM', name: 'PT Telkom Indonesia Tbk' },
  { symbol: 'ASII', name: 'PT Astra International Tbk' },
  { symbol: 'BBNI', name: 'PT Bank Negara Indonesia Tbk' },
  { symbol: 'ADRO', name: 'PT Adaro Energy Indonesia Tbk' },
  { symbol: 'GOTO', name: 'PT GoTo Gojek Tokopedia Tbk' },
  { symbol: 'UNVR', name: 'PT Unilever Indonesia Tbk' },
  { symbol: 'KLBF', name: 'PT Kalbe Farma Tbk' }
];

const GET_INITIAL_TICKER_DATA = (sym: string) => {
  const clean = sym.toUpperCase().replace('.JK', '').replace('^JKSE', 'IHSG');
  if (clean === 'IHSG') {
    return {
      symbol: 'IHSG',
      fullSymbol: '^JKSE',
      name: 'PT Bursa Efek Indonesia (IHSG)',
      exchange: 'IDX',
      sector: 'Indeks Utama',
      subsector: 'Bursa Efek Indonesia',
      price: 6283.60,
      change: 32.40,
      changePercent: 0.52,
      currency: 'IDR',
      isMarketOpen: true,
      dayLow: 6196.43,
      dayHigh: 6310.20,
      fiftyTwoWeekLow: 5600.00,
      fiftyTwoWeekHigh: 7600.00,
      bid: 6280,
      bidSize: 12500000,
      ask: 6285,
      askSize: 14200000,
      volume: 18500000000,
      avgVolume30: 16200000000,
      marketCap: 11200000000000000,
      dividendYield: 2.85,
      peRatio: 14.20,
      eps: 442.50,
      floatShares: 85000000000,
      beta: 1.00,
      nextEarnings: 'Dalam 6 hari',
      news: [
        {
          title: 'IHSG Bertahan di Zona Hijau Terakselerasi Sentimen Positif Pasar',
          publisher: 'IDX News',
          link: 'https://www.idx.co.id',
          timeAgo: '1 jam lalu'
        },
        {
          title: 'Arus Modal Asing Masuk Sektor Perbankan Menguatkan Indeks',
          publisher: 'Market Insight',
          link: 'https://www.idx.co.id',
          timeAgo: '3 jam lalu'
        }
      ]
    };
  }
  return null;
};

interface WidgetWatchlistDetailProps {
  defaultSymbol?: string;
  symbol?: string;
  showDropdown?: boolean;
  onSymbolChange?: (symbol: string) => void;
}

export const WidgetWatchlistDetail: React.FC<WidgetWatchlistDetailProps> = ({ 
  defaultSymbol = 'IHSG',
  symbol,
  showDropdown = false,
  onSymbolChange 
}) => {
  const activeSymbol = symbol || defaultSymbol;
  const [selectedSymbol, setSelectedSymbol] = useState<string>(activeSymbol);
  const [data, setData] = useState<any | null>(() => GET_INITIAL_TICKER_DATA(activeSymbol));
  const [loading, setLoading] = useState(() => !GET_INITIAL_TICKER_DATA(activeSymbol));
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedSymbol(activeSymbol);
    const initial = GET_INITIAL_TICKER_DATA(activeSymbol);
    if (initial) {
      setData(initial);
      setLoading(false);
    }
  }, [activeSymbol]);

  useEffect(() => {
    fetchTickerData(selectedSymbol);
  }, [selectedSymbol]);

  const fetchTickerData = async (sym: string, retries = 1) => {
    // Only show skeleton if we have zero data for this symbol
    if (!data || data.symbol !== sym.toUpperCase().replace('.JK', '').replace('^JKSE', 'IHSG')) {
      setLoading(true);
    }
    let success = false;
    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/widgets/ticker-details?symbol=${encodeURIComponent(sym)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        success = true;
      }
    } catch (err: any) {
      if (retries > 0) {
        setTimeout(() => fetchTickerData(sym, retries - 1), 1000);
        return;
      }
      console.warn('Failed to fetch ticker details after retries:', err?.message || err);
    } finally {
      if (success || retries === 0) {
        setLoading(false);
      }
    }
  };

  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    setIsDropdownOpen(false);
    if (onSymbolChange) {
      onSymbolChange(sym);
    }
  };

  // Helper number formatters
  const formatPrice = (val?: number) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('id-ID').format(Math.round(val));
  };

  const formatLargeNum = (val?: number, isCap = false) => {
    if (val === undefined || val === null || isNaN(val)) return '-';
    const abs = Math.abs(val);
    
    if (abs >= 1e12) {
      return (val / 1e12).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' T';
    }
    if (abs >= 1e9) {
      return (val / 1e9).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (isCap ? ' T' : ' B');
    }
    if (abs >= 1e6) {
      return (val / 1e6).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' M';
    }
    return val.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  };

  const formatVolume = (val?: number) => {
    if (!val) return '0 M';
    if (val >= 1e6) {
      return (val / 1e6).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' M';
    }
    return val.toLocaleString('id-ID');
  };

  // Calculate range markers (%)
  const getRangePercent = (current: number, min: number, max: number) => {
    if (!min || !max || max <= min) return 50;
    const pct = ((current - min) / (max - min)) * 100;
    return Math.max(2, Math.min(98, pct));
  };

  if (loading) {
    return (
      <div className="card card-elevated p-6 bg-[#0b0a10]/80 border border-[#1b1926] rounded-2xl min-h-[480px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-[#1b1926]">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isPositive = data.change >= 0;
  const dayRangePct = getRangePercent(data.price, data.dayLow, data.dayHigh);
  const yearRangePct = getRangePercent(data.price, data.fiftyTwoWeekLow, data.fiftyTwoWeekHigh);
  const primaryNews = data.news && data.news.length > 0 ? data.news[0] : null;

  return (
    <div className="card card-elevated bg-[#0b0a10]/80 border border-[#1b1926] rounded-2xl p-4 sm:p-5 text-white font-sans space-y-4 shadow-xl relative overflow-hidden">
      
      {/* 1. Optional Header Toolbar */}
      {showDropdown && (
        <div className="flex items-center justify-between gap-2 border-b border-[#1b1926]/80 pb-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#ccff00] cursor-pointer transition-colors"
            >
              <span>Daftar Pantau</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Ticker selector dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#111018] border border-[#1b1926] rounded-xl shadow-2xl z-50 p-2 space-y-1 max-h-60 overflow-y-auto">
                <div className="text-[10px] uppercase font-mono text-[#686477] px-2 py-1">Pilih Saham / Indeks</div>
                {POPULAR_TICKERS.map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => handleSelectSymbol(t.symbol)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-all ${
                      selectedSymbol === t.symbol ? 'bg-[#ccff00]/10 text-[#ccff00] font-bold' : 'text-[#c2bed0] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-bold">{t.symbol}</span>
                    <span className="text-[10px] text-[#686477] truncate max-w-[120px]">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      

      {/* 3. Big Price & Realtime Change Header */}
      <div className="space-y-1 pt-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tight font-mono">
            {formatPrice(data.price)}
          </span>
          <span className="text-xs font-extrabold text-[#9f9bac] uppercase font-mono">IDR</span>
          
          <div className={`flex items-center gap-1 font-mono text-xs font-extrabold ml-1 ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
            <span>{isPositive ? '+' : ''}{formatPrice(data.change)}</span>
            <span>({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className={`w-2 h-2 rounded-full ${data.isMarketOpen ? 'bg-[#00f5a0] animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-[#9f9bac]">{data.isMarketOpen ? 'Pasar buka' : 'Pasar tutup'}</span>
        </div>
      </div>

      {/* 4. Bid / Ask Spread Chips */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div className="bg-[#131726]/80 border border-[#1d2338] px-3 py-1.5 rounded-lg flex items-center justify-center text-sky-300 font-medium">
          <span>{formatPrice(data.bid)} × {formatVolume(data.bidSize)}</span>
        </div>
        <div className="bg-[#24151f]/80 border border-[#3b1e2a] px-3 py-1.5 rounded-lg flex items-center justify-center text-rose-300 font-medium">
          <span>{formatPrice(data.ask)} × {formatVolume(data.askSize)}</span>
        </div>
      </div>

      {/* 5. Range Bars (Rentang Hari & Rentang 52 Minggu) */}
      <div className="space-y-3 pt-1 border-t border-[#1b1926]/60">
        
        {/* Rentang Hari */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-white font-bold">{formatPrice(data.dayLow)}</span>
            <span className="text-[10px] uppercase font-sans text-[#686477] font-bold tracking-wider">RENTANG HARI</span>
            <span className="text-white font-bold">{formatPrice(data.dayHigh)}</span>
          </div>
          
          <div className="relative h-1.5 w-full bg-[#1b1926] rounded-full overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full opacity-80"></div>
          </div>
          <div className="relative w-full h-3">
            <div 
              className="absolute -top-1 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${dayRangePct}%` }}
            >
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-white"></div>
            </div>
          </div>
        </div>

        {/* Rentang 52 Minggu */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-white font-bold">{formatPrice(data.fiftyTwoWeekLow)}</span>
            <span className="text-[10px] uppercase font-sans text-[#686477] font-bold tracking-wider">RENTANG 52 MINGGU</span>
            <span className="text-white font-bold">{formatPrice(data.fiftyTwoWeekHigh)}</span>
          </div>

          <div className="relative h-1.5 w-full bg-[#1b1926] rounded-full overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-rose-500 via-amber-400 to-[#00f5a0] rounded-full opacity-80"></div>
          </div>
          <div className="relative w-full h-3">
            <div 
              className="absolute -top-1 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${yearRangePct}%` }}
            >
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-white"></div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Latest News Card */}
      {primaryNews && (
        <div className="bg-[#13111c] border border-[#232035] rounded-xl p-3.5 space-y-1.5 hover:border-[#342e4f] transition-all">
          <div className="flex items-center gap-2 text-[11px] text-[#a39bb8]">
            <span className="font-bold text-[#b482ff]">Berita</span>
            <span>·</span>
            <span>{primaryNews.timeAgo}</span>
          </div>

          <a 
            href={primaryNews.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-white hover:text-[#ccff00] transition-colors leading-snug line-clamp-2 block"
          >
            {primaryNews.title}
          </a>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] text-[#686477] font-mono">{primaryNews.publisher}</span>
            <button 
              onClick={() => setShowNewsModal(true)}
              className="text-[10px] font-bold text-[#b482ff] hover:text-white transition-colors cursor-pointer flex items-center gap-0.5"
            >
              Peristiwa lainnya &gt;
            </button>
          </div>
        </div>
      )}

      {/* 7. Key Statistics List */}
      <div className="space-y-2.5 pt-2 border-t border-[#1b1926]/60">
        <h4 className="text-xs font-bold uppercase text-white font-sans tracking-wide">Statistik kunci</h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Laporan perolehan berikutnya</span>
            <span className="font-bold text-rose-400 font-mono">{data.nextEarnings}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Volume</span>
            <span className="font-bold text-white font-mono">{formatVolume(data.volume)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Volume Rata-rata (30)</span>
            <span className="font-bold text-white font-mono">{formatVolume(data.avgVolume30)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Kapitalisasi pasar</span>
            <span className="font-bold text-white font-mono">{formatLargeNum(data.marketCap, true)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Imbal hasil dividen (terindikasi)</span>
            <span className="font-bold text-white font-mono">{data.dividendYield.toFixed(2)}%</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Rasio Harga terhadap Perolehan (TTM)</span>
            <span className="font-bold text-white font-mono">{data.peRatio.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">EPS Dasar (TTM)</span>
            <span className="font-bold text-white font-mono">{data.eps.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-[#1b1926]/40">
            <span className="text-[#9f9bac]">Saham Mengambang</span>
            <span className="font-bold text-white font-mono">{formatLargeNum(data.floatShares)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-[#9f9bac]">Beta (1Y)</span>
            <span className="font-bold text-white font-mono">{data.beta.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111018] border border-[#2a273b] rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-[#1b1926]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-sans">Berita Terkini ({data.symbol})</h3>
              </div>
              <button 
                onClick={() => setShowNewsModal(false)}
                className="p-1 rounded-lg text-[#686477] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {data.news && data.news.length > 0 ? (
                data.news.map((n: any, idx: number) => (
                  <a
                    key={idx}
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 rounded-xl bg-[#181624] hover:bg-[#201d30] border border-[#252238] transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#9f9bac]">
                      <span className="font-bold text-[#b482ff]">{n.publisher}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {n.timeAgo}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#ccff00] transition-colors leading-snug">
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-[#ccff00] font-mono pt-1">
                      <span>Baca selengkapnya</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-xs text-[#686477] text-center py-6">Tidak ada berita tambahan untuk ticker ini.</p>
              )}
            </div>

            <div className="pt-2 border-t border-[#1b1926] text-right">
              <button
                onClick={() => setShowNewsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#1b1926] hover:bg-[#252233] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
