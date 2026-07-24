import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { 
  Newspaper, 
  Search, 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock, 
  Flame, 
  Tag, 
  ThumbsUp, 
  ArrowRight,
  Filter,
  BarChart2,
  Briefcase,
  Plus,
  X,
  Sparkles,
  Check,
  LayoutGrid,
  List
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { useAppStore } from '../stores';
import { toast } from 'sonner';

interface NewsArticle {
  title: string;
  publisher: string;
  link: string;
  timeAgo: string;
  imageUrl?: string;
  category?: string;
}

export type NewsMode = 'general' | 'ihsg' | 'my_tickers';

const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80';

const getArticleSentiment = (title: string) => {
  const lower = title.toLowerCase();
  const positiveKeywords = ['laba', 'naik', 'rebound', 'cuan', 'tumbuh', 'rekor', 'untung', 'beli', 'net buy', 'dividen', 'menguat', 'target', 'positif', 'surplus'];
  const negativeKeywords = ['turun', 'melemahan', 'rugi', 'net sell', 'beban', 'tertekan', 'koreksi', 'anjlok', 'melemah', 'risiko', 'defisit'];
  
  if (positiveKeywords.some(kw => lower.includes(kw))) {
    return { label: 'Positif / Bullish', color: 'bg-[#00f5a0]/90 text-black border-[#00f5a0]', icon: TrendingUp };
  }
  if (negativeKeywords.some(kw => lower.includes(kw))) {
    return { label: 'Waspada / Bearish', color: 'bg-[#ff3366]/90 text-white border-[#ff3366]', icon: TrendingDown };
  }
  return { label: 'Netral', color: 'bg-black/60 text-[#00f0ff] border-[#00f0ff]/40', icon: Activity };
};

const GENERAL_TOPICS = [
  { symbol: 'saham bursa indonesia', name: 'Pasar Modal IDX' },
  { symbol: 'saham perbankan indonesia', name: 'Sektor Perbankan' },
  { symbol: 'saham energi tambang indonesia', name: 'Energi & Tambang' },
  { symbol: 'saham teknologi konsumen indonesia', name: 'Teknologi & Konsumer' },
  { symbol: 'dividen emiten saham indonesia', name: 'Dividen & Laba' },
];

const IHSG_TOPICS = [
  { symbol: 'IHSG', name: 'Indeks Utama IHSG' },
  { symbol: 'bank indonesia suku bunga', name: 'Suku Bunga & BI' },
  { symbol: 'aliran dana asing saham indonesia', name: 'Dana Asing (Net Buy/Sell)' },
  { symbol: 'danantara bumn bursa', name: 'Danantara & BUMN' },
  { symbol: 'rupiah makro ekonomi indonesia', name: 'Rupiah & Makro' },
];

export const MarketNews: React.FC = () => {
  const [, setLocation] = useLocation();
  const { stockPicks } = useAppStore();

  // News Mode State: 'general' | 'ihsg' | 'my_tickers'
  const [newsMode, setNewsMode] = useState<NewsMode>('general');

  // Active Symbol or Search Query
  const [activeSymbol, setActiveSymbol] = useState('saham bursa indonesia');
  const [customSearch, setCustomSearch] = useState('');
  
  // User's My Tickers State (defaults to stockPicks symbols + local storage)
  const [myTickers, setMyTickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('user_my_news_tickers_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const storeSymbols = stockPicks.map(s => s.symbol.toUpperCase());
    return storeSymbols.length > 0 ? storeSymbols : ['BBCA', 'BBRI', 'TLKM', 'ASII', 'GOTO'];
  });

  const [activeMyTicker, setActiveMyTicker] = useState<string>('ALL');
  const [newTickerInput, setNewTickerInput] = useState('');
  const [showAddTickerInput, setShowAddTickerInput] = useState(false);

  // Sync myTickers to localStorage
  useEffect(() => {
    localStorage.setItem('user_my_news_tickers_v1', JSON.stringify(myTickers));
  }, [myTickers]);

  // News Feed State
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'positive' | 'financial' | 'macro'>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'compact'>('grid');

  const fetchNews = async (symbolToFetch: string, isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/news?symbol=${encodeURIComponent(symbolToFetch)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news)) {
          setNews(data.news);
        } else {
          setNews([]);
        }
      }
    } catch (err) {
      console.error('Error fetching market news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Trigger fetch when newsMode or activeSymbol / activeMyTicker changes
  useEffect(() => {
    let queryToFetch = activeSymbol;

    if (newsMode === 'general') {
      queryToFetch = activeSymbol || 'saham bursa indonesia';
    } else if (newsMode === 'ihsg') {
      queryToFetch = activeSymbol || 'IHSG';
    } else if (newsMode === 'my_tickers') {
      if (activeMyTicker === 'ALL') {
        // Fetch news for the top ticker or combined tickers query
        queryToFetch = myTickers.length > 0 ? myTickers[0] : 'BBCA';
      } else {
        queryToFetch = activeMyTicker;
      }
    }

    fetchNews(queryToFetch);
  }, [newsMode, activeSymbol, activeMyTicker]);

  // Handle Mode Switch
  const handleModeChange = (mode: NewsMode) => {
    setNewsMode(mode);
    setCustomSearch('');
    if (mode === 'general') {
      setActiveSymbol('saham bursa indonesia');
    } else if (mode === 'ihsg') {
      setActiveSymbol('IHSG');
    } else if (mode === 'my_tickers') {
      setActiveMyTicker('ALL');
      if (myTickers.length > 0) {
        setActiveSymbol(myTickers[0]);
      }
    }
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearch.trim()) {
      const cleaned = customSearch.trim().toUpperCase();
      setActiveSymbol(cleaned);
      if (newsMode === 'my_tickers') {
        if (!myTickers.includes(cleaned)) {
          setMyTickers(prev => [...prev, cleaned]);
        }
        setActiveMyTicker(cleaned);
      }
    }
  };

  const handleAddMyTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newTickerInput.trim().toUpperCase();
    if (!cleaned) return;

    if (myTickers.includes(cleaned)) {
      toast.info(`Ticker ${cleaned} sudah ada di Saham Saya.`);
    } else {
      setMyTickers(prev => [...prev, cleaned]);
      toast.success(`Ticker ${cleaned} berhasil ditambahkan ke Saham Saya!`);
    }
    setActiveMyTicker(cleaned);
    setNewTickerInput('');
    setShowAddTickerInput(false);
  };

  const handleRemoveMyTicker = (tickerToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = myTickers.filter(t => t !== tickerToRemove);
    setMyTickers(updated);
    if (activeMyTicker === tickerToRemove) {
      setActiveMyTicker('ALL');
    }
    toast.success(`Ticker ${tickerToRemove} dihapus dari Saham Saya.`);
  };

  const positiveKeywords = ['laba', 'naik', 'rebound', 'cuan', 'tumbuh', 'rekor', 'untung', 'beli', 'net buy', 'dividen', 'menguat', 'target', 'positif', 'surplus'];
  const negativeKeywords = ['turun', 'melemahan', 'rugi', 'net sell', 'beban', 'tertekan', 'koreksi', 'anjlok', 'melemah', 'risiko', 'defisit'];

  const sentimentStats = useMemo(() => {
    if (!news.length) return { positivePct: 75, sentimentText: 'Sangat Positif (Bullish)', sentimentColor: 'text-[#00f5a0]' };
    let posCount = 0;
    let negCount = 0;
    news.forEach(item => {
      const lower = item.title.toLowerCase();
      if (positiveKeywords.some(kw => lower.includes(kw))) posCount++;
      if (negativeKeywords.some(kw => lower.includes(kw))) negCount++;
    });

    const total = news.length;
    const posPct = Math.round(((posCount + (total - negCount)) / (total * 2)) * 100) || 75;
    
    let sentimentText = 'Netral / Stabil';
    let sentimentColor = 'text-amber-400';
    if (posPct >= 70) {
      sentimentText = 'Sangat Positif (Bullish)';
      sentimentColor = 'text-[#00f5a0]';
    } else if (posPct >= 55) {
      sentimentText = 'Cenderung Positif';
      sentimentColor = 'text-[#ccff00]';
    } else if (posPct <= 40) {
      sentimentText = 'Sentimen Waspada (Bearish)';
      sentimentColor = 'text-[#ff3366]';
    }

    return { positivePct: posPct, sentimentText, sentimentColor, posCount, negCount };
  }, [news]);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
                            item.publisher.toLowerCase().includes(filterQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (category === 'positive') {
        return positiveKeywords.some(kw => item.title.toLowerCase().includes(kw));
      } else if (category === 'financial') {
        const finKw = ['laba', 'kinerja', 'keuangan', 'pendapatan', 'dividen', 'saham', 'target', 'lot', 'harga', 'rups'];
        return finKw.some(kw => item.title.toLowerCase().includes(kw));
      } else if (category === 'macro') {
        const macroKw = ['bi', 'suku bunga', 'ihsg', 'bursa', 'ekonomi', 'danantara', 'asing', 'rebound', 'pasar', 'makro'];
        return macroKw.some(kw => item.title.toLowerCase().includes(kw));
      }
      return true;
    });
  }, [news, filterQuery, category]);

  const heroArticle = filteredNews[0] || news[0];

  // Helper title text for current scope
  const getScopeTitle = () => {
    if (newsMode === 'general') return 'General Market News (Berita Pasar Umum)';
    if (newsMode === 'ihsg') return 'Analisis IHSG & Makro Ekonomi';
    if (newsMode === 'my_tickers') {
      return activeMyTicker === 'ALL' 
        ? `Berita Saham Saya (${myTickers.join(', ')})`
        : `Berita Saham Saya (${activeMyTicker})`;
    }
    return activeSymbol;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300 font-sans">
      {/* 1. Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b1926] pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl text-[#ccff00]">
              <Newspaper className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2">
              Berita & Sentimen Pasar (Market News)
              <span className="px-2.5 py-0.5 bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 rounded-full text-xs font-mono">
                LIVE RSS
              </span>
            </h1>
          </div>
          <p className="text-xs text-[#9f9bac] font-sans">
            Agregasi berita real-time dari Google News RSS, Bisnis.com, CNBC Indonesia, Bloomberg Technoz, dan portal keuangan terpercaya.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const activeQ = newsMode === 'my_tickers' && activeMyTicker !== 'ALL' ? activeMyTicker : activeSymbol;
              fetchNews(activeQ, true);
            }}
            disabled={refreshing}
            className="px-4 py-2 bg-[#171524] hover:bg-[#201c33] text-white font-bold rounded-xl border border-[#262338] hover:border-[#ccff00]/40 transition-all flex items-center gap-2 text-xs cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-[#ccff00] ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sintesis Berita Terkini</span>
          </button>
        </div>
      </div>

      {/* 2. UNIFIED 1-LAYER FILTER & NAVIGATION PANEL */}
      <div className="card card-elevated p-3.5 md:p-4 bg-[#0b0a10] border border-[#1b1926] rounded-2xl shadow-xl space-y-3">
        {/* Row 1: Mode Segmented Switcher + AI Sentiment Badge + Search Input */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-[#111018] border border-[#1b1926] rounded-xl shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleModeChange('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                newsMode === 'general'
                  ? 'bg-[#ccff00] text-black font-extrabold shadow-md shadow-[#ccff00]/10'
                  : 'text-[#9f9bac] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>General Market</span>
            </button>

            <button
              onClick={() => handleModeChange('ihsg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                newsMode === 'ihsg'
                  ? 'bg-[#00f0ff] text-black font-extrabold shadow-md shadow-[#00f0ff]/10'
                  : 'text-[#9f9bac] hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>IHSG Analysis</span>
            </button>

            <button
              onClick={() => handleModeChange('my_tickers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                newsMode === 'my_tickers'
                  ? 'bg-[#00f5a0] text-black font-extrabold shadow-md shadow-[#00f5a0]/10'
                  : 'text-[#9f9bac] hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>My Tickers ({myTickers.length})</span>
            </button>
          </div>

          {/* Compact AI Sentiment Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111018] border border-[#1b1926] rounded-xl shrink-0 self-start lg:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
            <span className="text-[10px] text-[#9f9bac] font-bold uppercase tracking-wider font-mono">
              Sentimen AI:
            </span>
            <span className={`text-xs font-extrabold font-mono flex items-center gap-1 ${sentimentStats.sentimentColor}`}>
              {sentimentStats.sentimentText} ({sentimentStats.positivePct}%)
            </span>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleCustomSearchSubmit} className="relative min-w-[220px] flex-1 lg:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#686477]" />
            <input
              type="text"
              value={customSearch}
              onChange={e => setCustomSearch(e.target.value)}
              placeholder="Cari berita / ticker..."
              className="w-full bg-[#111018] border border-[#1b1926] focus:border-[#ccff00]/50 rounded-xl pl-8 pr-14 py-1.5 text-xs text-white placeholder-[#686477] outline-none transition-all font-sans"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[#ccff00] text-black font-black rounded-lg text-[10px] cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Row 2: Contextual Sub-Topics / Tickers + Category Pill Filters */}
        <div className="pt-2.5 border-t border-[#1b1926]/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Sub-Topics / Tickers */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
            {newsMode === 'general' && (
              <>
                <span className="text-[10px] text-[#686477] font-bold uppercase font-mono tracking-wider shrink-0 mr-1">Topik:</span>
                {GENERAL_TOPICS.map(item => (
                  <button
                    key={item.symbol}
                    onClick={() => {
                      setActiveSymbol(item.symbol);
                      setCustomSearch('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeSymbol === item.symbol
                        ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 font-extrabold'
                        : 'bg-[#111018] text-[#9f9bac] border border-[#1b1926] hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </>
            )}

            {newsMode === 'ihsg' && (
              <>
                <span className="text-[10px] text-[#00f0ff] font-bold uppercase font-mono tracking-wider shrink-0 mr-1">Makro:</span>
                {IHSG_TOPICS.map(item => (
                  <button
                    key={item.symbol}
                    onClick={() => {
                      setActiveSymbol(item.symbol);
                      setCustomSearch('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeSymbol === item.symbol
                        ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40 font-extrabold'
                        : 'bg-[#111018] text-[#9f9bac] border border-[#1b1926] hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </>
            )}

            {newsMode === 'my_tickers' && (
              <>
                <button
                  onClick={() => {
                    setActiveMyTicker('ALL');
                    if (myTickers.length > 0) setActiveSymbol(myTickers[0]);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                    activeMyTicker === 'ALL'
                      ? 'bg-[#00f5a0]/15 text-[#00f5a0] border border-[#00f5a0]/40'
                      : 'bg-[#111018] text-[#9f9bac] border border-[#1b1926] hover:text-white'
                  }`}
                >
                  Semua ({myTickers.length})
                </button>

                {myTickers.map(sym => {
                  const active = activeMyTicker === sym;
                  return (
                    <div
                      key={sym}
                      onClick={() => {
                        setActiveMyTicker(sym);
                        setActiveSymbol(sym);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 border ${
                        active
                          ? 'bg-[#00f5a0]/15 text-[#00f5a0] border-[#00f5a0]/40 font-extrabold'
                          : 'bg-[#111018] text-[#9f9bac] border-[#1b1926] hover:text-white'
                      }`}
                    >
                      <span>{sym}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveMyTicker(sym, e)}
                        title={`Hapus ${sym}`}
                        className="hover:bg-red-500/20 p-0.5 rounded transition-colors text-[#686477] hover:text-red-400"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={() => setShowAddTickerInput(!showAddTickerInput)}
                  className="px-2 py-0.5 bg-[#00f5a0]/10 hover:bg-[#00f5a0]/20 text-[#00f5a0] border border-[#00f5a0]/30 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Sub-Category Filter Badges + View Layout Switcher */}
          <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 bg-[#111018] p-1 border border-[#1b1926] rounded-xl">
              {[
                { id: 'all', label: 'Semua Berita' },
                { id: 'positive', label: 'Positif' },
                { id: 'financial', label: 'Kinerja/Laba' },
                { id: 'macro', label: 'Makro' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    category === cat.id
                      ? 'bg-[#1b1926] text-white border-[#ccff00]/50 font-extrabold'
                      : 'bg-transparent text-[#686477] border-transparent hover:text-[#9f9bac]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Layout Mode Switcher (Grid with Images vs Compact List) */}
            <div className="flex items-center gap-1 bg-[#111018] p-1 border border-[#1b1926] rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                title="Tampilan Kartu Visual dengan Gambar"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewLayout === 'grid' 
                    ? 'bg-[#ccff00] text-black font-extrabold shadow-md shadow-[#ccff00]/10' 
                    : 'text-[#686477] hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Kartu Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('compact')}
                title="Tampilan Daftar Ringkas"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewLayout === 'compact' 
                    ? 'bg-[#ccff00] text-black font-extrabold shadow-md shadow-[#ccff00]/10' 
                    : 'text-[#686477] hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Daftar Ringkas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Ticker Input Drawer inline if opened */}
        {newsMode === 'my_tickers' && showAddTickerInput && (
          <form onSubmit={handleAddMyTicker} className="flex items-center gap-2 pt-2 border-t border-[#1b1926]/50 animate-in fade-in duration-200">
            <input
              type="text"
              value={newTickerInput}
              onChange={e => setNewTickerInput(e.target.value)}
              placeholder="Ketik kode saham (contoh: PGAS, AMMN, BBNI)..."
              className="bg-[#111018] border border-[#00f5a0]/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#686477] focus:outline-none focus:border-[#00f5a0] font-mono uppercase tracking-wider flex-1 max-w-sm"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#00f5a0] hover:bg-[#00d88d] text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all"
            >
              Simpan Ticker
            </button>
            <button
              type="button"
              onClick={() => setShowAddTickerInput(false)}
              className="p-1 text-[#686477] hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* 6. MAIN HERO / FEATURED ARTICLE WITH IMAGE */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      ) : heroArticle ? (
        <div className="card card-elevated bg-[#0b0a10] border border-[#262238] hover:border-[#ccff00]/40 rounded-3xl overflow-hidden transition-all shadow-2xl group">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image Column */}
            <div className="lg:col-span-5 h-64 lg:h-auto relative overflow-hidden bg-[#171524]">
              <img 
                src={heroArticle.imageUrl || DEFAULT_FALLBACK_IMG} 
                alt={heroArticle.title}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMG; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a10] via-transparent to-black/40" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[#ccff00] border border-[#ccff00]/40 rounded-full text-[10px] font-extrabold uppercase tracking-wider font-mono shadow-md">
                  {heroArticle.category || 'Berita Utama'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-white border border-white/20 rounded-lg text-xs font-bold font-sans">
                  {heroArticle.publisher}
                </span>
                <span className="text-xs text-white/90 font-mono bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                  {heroArticle.timeAgo}
                </span>
              </div>
            </div>

            {/* Right Text Content Column */}
            <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 rounded-md text-[10px] font-bold font-mono">
                    BERITA UTAMA HARIAN
                  </span>
                  {(() => {
                    const sent = getArticleSentiment(heroArticle.title);
                    const SentIcon = sent.icon;
                    return (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 border ${sent.color}`}>
                        <SentIcon className="w-3 h-3" />
                        {sent.label}
                      </span>
                    );
                  })()}
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#ccff00] transition-colors leading-snug font-sans">
                  {heroArticle.title}
                </h3>
                
                <p className="text-xs md:text-sm text-[#9f9bac] leading-relaxed font-sans line-clamp-2">
                  Sintesis berita pasar terkini mengenai {heroArticle.title}. Dapatkan perspektif komprehensif dari {heroArticle.publisher} untuk analisis investasi Anda.
                </p>
              </div>

              <div className="pt-4 border-t border-[#1b1926] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#686477] font-mono">
                  <Globe className="w-4 h-4 text-[#00f0ff]" />
                  <span>Sumber Resmi {heroArticle.publisher}</span>
                </div>

                <a
                  href={heroArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/10 shrink-0 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <span>Baca Selengkapnya</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 7. NEWS CARDS GRID WITH VISUAL IMAGES */}
      {!loading && filteredNews.length === 0 ? (
        <div className="p-12 text-center card card-elevated bg-[#0b0a10]/40 border border-[#1b1926] rounded-2xl">
          <Newspaper className="w-10 h-10 text-[#686477] mx-auto mb-3 opacity-50" />
          <p className="text-sm font-bold text-white font-sans">Tidak ada berita yang cocok untuk filter ini.</p>
          <p className="text-xs text-[#686477] mt-1 font-sans">Coba ubah kata kunci pencarian atau pilih mode berita/topik saham di atas.</p>
        </div>
      ) : !loading && viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((article, idx) => {
            const sent = getArticleSentiment(article.title);
            const SentIcon = sent.icon;

            return (
              <div 
                key={idx} 
                className="card card-elevated bg-[#0b0a10] border border-[#1b1926] hover:border-[#ccff00]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-lg hover:shadow-2xl hover:shadow-[#ccff00]/5"
              >
                <div>
                  {/* Top Image */}
                  <div className="h-44 w-full relative overflow-hidden bg-[#171524]">
                    <img 
                      src={article.imageUrl || DEFAULT_FALLBACK_IMG} 
                      alt={article.title}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMG; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a10] via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-20">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[#ccff00] border border-[#ccff00]/30 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider">
                        {article.category || 'Pasar Modal'}
                      </span>

                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md flex items-center gap-1 border backdrop-blur-md shadow-sm ${sent.color}`}>
                        <SentIcon className="w-2.5 h-2.5" />
                        {sent.label}
                      </span>
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] z-20">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-bold rounded-md border border-white/10">
                        {article.publisher}
                      </span>
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[#9f9bac] font-mono rounded-md border border-white/10 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#00f0ff]" />
                        {article.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Article Title & Info */}
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#ccff00] transition-colors leading-relaxed line-clamp-3 font-sans">
                      {article.title}
                    </h4>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-4 pb-4 pt-2 border-t border-[#1b1926]/60 flex items-center justify-between">
                  <span className="text-[10px] text-[#686477] font-mono flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5 text-[#ccff00]" />
                    IDX News
                  </span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Baca Berita</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading && viewLayout === 'compact' ? (
        <div className="space-y-3">
          {filteredNews.map((article, idx) => {
            const sent = getArticleSentiment(article.title);
            const SentIcon = sent.icon;

            return (
              <div 
                key={idx} 
                className="card card-elevated p-4 bg-[#0b0a10]/80 border border-[#1b1926] hover:border-[#ccff00]/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                  <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-[#171524] relative border border-[#262238]">
                    <img 
                      src={article.imageUrl || DEFAULT_FALLBACK_IMG} 
                      alt={article.title}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMG; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-[#171524] text-[#9f9bac] border border-[#262338] rounded-md text-[10px] font-bold font-sans">
                        {article.publisher}
                      </span>
                      <span className="text-[10px] text-[#686477] font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {article.timeAgo}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded flex items-center gap-1 border ${sent.color}`}>
                        <SentIcon className="w-2.5 h-2.5" />
                        {sent.label}
                      </span>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-[#ccff00] transition-colors truncate font-sans">
                      {article.title}
                    </h4>
                  </div>
                </div>

                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#171524] hover:bg-[#ccff00] text-[#ccff00] hover:text-black font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 border border-[#262338] hover:border-[#ccff00]"
                >
                  <span>Baca</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

