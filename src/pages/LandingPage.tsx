/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { TickerLogo } from '../components/TickerLogo';
import { SafeHavenLogo } from '../components/SafeHavenLogo';
import { 
  ShieldCheck, 
  TrendingUp, 
  Bot, 
  BarChart3, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Zap, 
  Star, 
  Activity, 
  Layers,
  Lock,
  LineChart,
  Command,
  Play,
  X,
  Sparkles,
  ArrowUpRight,
  Sliders,
  Check,
  Compass,
  Calendar,
  Bookmark,
  LayoutGrid,
  Settings as SettingsIcon,
  Globe,
  ChevronRight,
  CornerDownLeft,
  Mail,
  Loader2
} from 'lucide-react';
import { useAppStore } from '../stores';

export const LandingPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { loginDemoUser } = useAppStore();

  // Interactive Modals & States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [vipPassOpen, setVipPassOpen] = useState(false);

  // Search & Demo State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMockTab, setSelectedMockTab] = useState<'overview' | 'recap' | 'sectors'>('overview');
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authStep, setAuthStep] = useState<'input' | 'loading' | 'sent'>('input');

  // Interactive Stock List for Search Modal & Preview
  const allStocks = [
    { symbol: 'BBCA.JK', name: 'Bank Central Asia Tbk', sector: 'Financials', price: 10150, change: '+1.5%', score: 94, aiSignal: 'BULLISH', exchange: 'IDX' },
    { symbol: 'BBRI.JK', name: 'Bank Rakyat Indonesia Tbk', sector: 'Financials', price: 5200, change: '-0.5%', score: 88, aiSignal: 'ACCUMULATE', exchange: 'IDX' },
    { symbol: 'BMRI.JK', name: 'Bank Mandiri (Persero) Tbk', sector: 'Financials', price: 6450, change: '+1.2%', score: 91, aiSignal: 'STRONG BUY', exchange: 'IDX' },
    { symbol: 'TLKM.JK', name: 'Telkom Indonesia Tbk', sector: 'Telecom', price: 2950, change: '+2.1%', score: 82, aiSignal: 'UNDERVALUED', exchange: 'IDX' },
    { symbol: 'AMMN.JK', name: 'Amman Mineral Internasional', sector: 'Mining', price: 11800, change: '+3.8%', score: 86, aiSignal: 'MOMENTUM', exchange: 'IDX' },
    { symbol: 'ASII.JK', name: 'Astra International Tbk', sector: 'Automotive', price: 4650, change: '+0.8%', score: 79, aiSignal: 'DIVIDEND', exchange: 'IDX' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 128.5, change: '+4.2%', score: 96, aiSignal: 'STRONG BUY', exchange: 'NASDAQ' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Automotive', price: 218.2, change: '-1.4%', score: 75, aiSignal: 'NEUTRAL', exchange: 'NASDAQ' },
  ];

  const filteredStocks = allStocks.filter(
    s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Global Keyboard Shortcuts (Press T for trial, K / '/' for Search, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(activeTag)) {
        if (e.key === 'Escape') {
          setSearchModalOpen(false);
          setTourModalOpen(false);
          setAuthModalOpen(false);
          setVipPassOpen(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setTourModalOpen(false);
        setAuthModalOpen(false);
        setVipPassOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key.toLowerCase() === 'k' || e.key === '/') {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setAuthModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDemoStart = () => {
    loginDemoUser();
    setLocation('/dashboard');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setAuthStep('loading');
    setTimeout(() => {
      setAuthStep('sent');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0a10] text-[#e0deea] font-sans antialiased selection:bg-[#ccff00] selection:text-black relative overflow-x-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#ccff00]/10 via-[#00f0ff]/5 to-transparent blur-[120px] pointer-events-none rounded-full -z-10" />
      <div className="absolute top-[600px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#00f5a0]/5 via-transparent to-transparent blur-[150px] pointer-events-none rounded-full -z-10" />

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b0a10]/80 border-b border-[#1b1926]/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <SafeHavenLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
                SAFEHAVEN <span className="text-[10px] text-[#ccff00] bg-[#ccff00]/10 px-1.5 py-0.2 rounded border border-[#ccff00]/30 font-sans font-semibold">IDX PRO</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#9f9bac]">
            <a href="#features" className="hover:text-white transition-colors">Fitur Unggulan</a>
            <a href="#cockpit" className="hover:text-white transition-colors">Terminal Cockpit</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>Command Bar</span>
              <span className="bg-[#181622] text-[10px] text-[#ccff00] px-1.5 py-0.5 rounded border border-[#2a273a] font-mono">⌘K</span>
            </button>
            <button 
              onClick={() => setVipPassOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>VIP Access</span>
              <span className="bg-[#ccff00]/20 text-[#ccff00] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase">New</span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-xs font-medium text-[#9f9bac] hover:text-white px-3 py-2 transition-colors hidden sm:inline-block"
            >
              Masuk
            </Link>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 text-xs font-semibold text-black bg-[#ccff00] hover:bg-[#b8e600] px-4 py-2 rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)]"
            >
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
              <span>Mulai Trial Free</span>
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center flex flex-col items-center relative">
        
        {/* Watch Guided Tour Button */}
        <button
          onClick={() => setTourModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#14121e] hover:bg-[#1a1828] text-xs font-medium text-[#b0adc0] hover:text-white px-4 py-1.5 rounded-full border border-[#262335] transition-all mb-8 shadow-inner group"
        >
          <span className="w-4 h-4 rounded-full bg-[#ccff00]/20 text-[#ccff00] flex items-center justify-center text-[10px]">
            <Play className="w-2.5 h-2.5 fill-[#ccff00] ml-0.5" />
          </span>
          <span>Tonton Video Tur Cockpit</span>
          <ArrowRight className="w-3 h-3 text-[#7a768d] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mb-6">
          Investasi Saham IHSG <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-[#e8e6f2] to-[#9f9bac] bg-clip-text text-transparent">
            Lebih Presisi & Cerdas.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-[#8e8a9f] max-w-xl mb-6 leading-relaxed font-normal">
          Platform analitik & quant intelligence pasar saham Indonesia (IHSG). Gabungan skor fundamental, radar teknikal, dan kecerdasan buatan Gemini AI.
        </p>

        {/* Keyboard Shortcut Hint */}
        <div className="flex items-center gap-2 text-xs text-[#736f84] font-mono mb-12 bg-[#12101b] px-3.5 py-1.5 rounded-full border border-[#1e1c2b]">
          <span>Tekan</span>
          <kbd className="bg-[#1d1b2a] text-[#ccff00] px-2 py-0.5 rounded text-[11px] border border-[#2d2a40] font-bold">T</kbd>
          <span>kapan saja untuk mulai trial</span>
          <span className="text-[#3c384e]">|</span>
          <kbd className="bg-[#1d1b2a] text-[#00f0ff] px-2 py-0.5 rounded text-[11px] border border-[#2d2a40] font-bold">⌘K</kbd>
          <span>untuk cari saham</span>
        </div>

        {/* HERO LAPTOP MOCKUP FRAME */}
        <div className="w-full max-w-5xl mx-auto relative group">
          
          {/* Outer Frame Glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#ccff00]/20 via-[#00f0ff]/10 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Laptop Body Container */}
          <div className="relative bg-[#110f1a] border border-[#252236] rounded-2xl p-2 sm:p-3 shadow-2xl overflow-hidden backdrop-blur-2xl">
            
            {/* Laptop Header Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0d0c13] rounded-t-xl border-b border-[#1f1d2d] mb-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[11px] font-mono text-[#6c687e] ml-2 hidden sm:inline">safehaven.app/cockpit</span>
              </div>

              {/* Mock Nav Tabs */}
              <div className="flex items-center gap-1 bg-[#151322] p-1 rounded-lg border border-[#222033]">
                <button 
                  onClick={() => setSelectedMockTab('overview')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${selectedMockTab === 'overview' ? 'bg-[#211e32] text-white shadow-sm' : 'text-[#7d7990] hover:text-white'}`}
                >
                  Regime & Charts
                </button>
                <button 
                  onClick={() => setSelectedMockTab('recap')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${selectedMockTab === 'recap' ? 'bg-[#211e32] text-white shadow-sm' : 'text-[#7d7990] hover:text-white'}`}
                >
                  Daily AI Recap
                </button>
                <button 
                  onClick={() => setSelectedMockTab('sectors')}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${selectedMockTab === 'sectors' ? 'bg-[#211e32] text-white shadow-sm' : 'text-[#7d7990] hover:text-white'}`}
                >
                  Sektoral Heatmap
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded border border-[#00f5a0]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse" />
                  IHSG LIVE
                </span>
              </div>
            </div>

            {/* Laptop Display Content */}
            <div className="bg-[#0b0a10] rounded-b-xl border border-[#1a1827] p-4 sm:p-6 text-left min-h-[380px] sm:min-h-[460px] flex flex-col justify-between">
              
              {selectedMockTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Left Column: Index Chart & Stats */}
                  <div className="md:col-span-7 bg-[#12101b] rounded-xl p-4 border border-[#1f1d2e] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#78748c] uppercase tracking-wider">Pasar Utama Indonesia</span>
                          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                            IHSG Index <span className="text-xs text-[#00f5a0] font-normal">+0.84% (7,320.15)</span>
                          </h3>
                        </div>
                        <span className="bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#ccff00]/30 font-bold">
                          REGIME: BULLISH EXPANSION
                        </span>
                      </div>

                      {/* Mock Chart Area */}
                      <div className="h-36 w-full my-3 relative flex items-end gap-1.5 px-1 pb-1 border-b border-[#201d30]">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ccff00]/10 to-transparent pointer-events-none rounded-lg" />
                        <svg className="w-full h-full text-[#ccff00] overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                          <path 
                            d="M 0,80 Q 50,70 100,50 T 200,45 T 300,20 T 400,10 L 400,100 L 0,100 Z" 
                            fill="rgba(204, 255, 0, 0.08)" 
                          />
                          <path 
                            d="M 0,80 Q 50,70 100,50 T 200,45 T 300,20 T 400,10" 
                            fill="none" 
                            stroke="#ccff00" 
                            strokeWidth="2.5" 
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs border-t border-[#1a1827]">
                      <div className="bg-[#171524] p-2 rounded border border-[#232034]">
                        <span className="text-[10px] text-[#7d7990] block font-mono">Net Foreign Flow</span>
                        <span className="text-[#00f5a0] font-bold font-mono">+Rp 842.5 M</span>
                      </div>
                      <div className="bg-[#171524] p-2 rounded border border-[#232034]">
                        <span className="text-[10px] text-[#7d7990] block font-mono">Market Turnover</span>
                        <span className="text-white font-bold font-mono">Rp 12.4 T</span>
                      </div>
                      <div className="bg-[#171524] p-2 rounded border border-[#232034]">
                        <span className="text-[10px] text-[#7d7990] block font-mono">Top Quant Pick</span>
                        <span className="text-[#ccff00] font-bold font-mono">BBCA (Score 94)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Insights & Stock Watchlist */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="bg-[#12101b] rounded-xl p-3.5 border border-[#1f1d2e]">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-white">
                        <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>Gemini AI Market Intelligence</span>
                      </div>
                      <p className="text-[11px] text-[#9b97ac] leading-relaxed">
                        "Arus modal asing (foreign flow) terkonsentrasi kuat pada perbankan Big Cap (BBCA, BMRI) pasca rilis laporan keuangan Q2 dengan pertumbuhan laba rekor."
                      </p>
                    </div>

                    {/* Stock List Items */}
                    <div className="bg-[#12101b] rounded-xl p-3 border border-[#1f1d2e] space-y-2">
                      <span className="text-[10px] font-mono text-[#736f84] uppercase tracking-wider block">Top Stocks Ranking</span>
                      {allStocks.slice(0, 3).map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between p-2 rounded bg-[#181625] border border-[#252237]">
                          <div className="flex items-center gap-2">
                            <TickerLogo symbol={stock.symbol} sizeClassName="w-6 h-6" />
                            <div>
                              <div className="text-xs font-bold text-white font-mono">{stock.symbol}</div>
                              <div className="text-[10px] text-[#7d7990]">{stock.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold font-mono text-[#00f5a0]">{stock.change}</div>
                            <div className="text-[10px] text-[#ccff00] font-mono">Skor: {stock.score}/100</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedMockTab === 'recap' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#13111d] p-3.5 rounded-xl border border-[#201e2f]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Laporan Eksekutif Harian Gemini AI</h4>
                        <span className="text-[10px] text-[#7a768d] font-mono">Diperbarui sore ini | Sinyal Pasar Otomatis</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#00f5a0] bg-[#00f5a0]/10 px-2.5 py-1 rounded-full border border-[#00f5a0]/30">
                      Rekomendasi: Net Overweight
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#12101b] p-3.5 rounded-xl border border-[#1f1d2e] space-y-1.5">
                      <span className="text-[10px] font-mono text-[#ccff00] font-bold uppercase">Sektor Perbankan</span>
                      <p className="text-xs text-[#a19db2] leading-relaxed">
                        Top Pick: BBCA & BMRI. Pertumbuhan DPK solid dengan credit cost terjaga rendah di bawah 1.1%.
                      </p>
                    </div>
                    <div className="bg-[#12101b] p-3.5 rounded-xl border border-[#1f1d2e] space-y-1.5">
                      <span className="text-[10px] font-mono text-[#00f0ff] font-bold uppercase">Komoditas & Mineral</span>
                      <p className="text-xs text-[#a19db2] leading-relaxed">
                        Top Pick: AMMN. Penguatan harga tembaga memberikan dorongan margin operasi +18% YoY.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedMockTab === 'sectors' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Financials', perf: '+1.85%', stocks: 'BBCA, BBRI, BMRI', color: 'text-[#00f5a0]' },
                    { name: 'Basic Materials', perf: '+2.40%', stocks: 'AMMN, ANTM, INCO', color: 'text-[#00f5a0]' },
                    { name: 'Telecommunications', perf: '+0.95%', stocks: 'TLKM, ISAT, EXCL', color: 'text-[#00f5a0]' },
                    { name: 'Consumer Cyclical', perf: '-0.42%', stocks: 'ASII, ACES', color: 'text-[#ff5f56]' },
                    { name: 'Infrastructure', perf: '+1.10%', stocks: 'JSMR, TOWR', color: 'text-[#00f5a0]' },
                    { name: 'Healthcare', perf: '-0.15%', stocks: 'KLBF, MIKA', color: 'text-[#ff5f56]' },
                    { name: 'Energy', perf: '+0.60%', stocks: 'ADRO, PTBA', color: 'text-[#00f5a0]' },
                    { name: 'Technology', perf: '+3.10%', stocks: 'GOTO, BUKA', color: 'text-[#00f5a0]' },
                  ].map((sec) => (
                    <div key={sec.name} className="bg-[#13111e] p-3 rounded-xl border border-[#211f32] text-left space-y-1">
                      <span className="text-[10px] font-mono text-[#7a768d] uppercase">{sec.name}</span>
                      <div className={`text-sm font-bold font-mono ${sec.color}`}>{sec.perf}</div>
                      <div className="text-[10px] text-[#5d596e] truncate font-mono">{sec.stocks}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Interactive Trigger Bar */}
              <div className="mt-4 pt-3 border-t border-[#1a1827] flex items-center justify-between text-xs text-[#736f84]">
                <div className="flex items-center gap-2">
                  <Command className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>Tekan <kbd className="text-white font-mono bg-[#1a1827] px-1.5 py-0.5 rounded border border-[#2a273c]">Space</kbd> atau klik tombol untuk langsung uji coba</span>
                </div>
                <button
                  onClick={handleDemoStart}
                  className="bg-[#ccff00] text-black font-bold px-3.5 py-1.5 rounded-lg hover:bg-[#b8e600] transition-colors flex items-center gap-1.5"
                >
                  <span>Buka Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* FEATURE HIGHLIGHTS & ARCHITECTURE */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#181624]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono text-[#ccff00] uppercase tracking-widest bg-[#ccff00]/10 px-3 py-1 rounded-full border border-[#ccff00]/20">
            Arsitektur Kuantitatif
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-3">
            Dioptimalkan untuk Keputusan Investor Modern
          </h2>
          <p className="text-xs sm:text-sm text-[#8a869a]">
            Kecepatan analisis institusional yang intuitif, dirancang tanpa clutter, langsung ke insight utama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#12101b] border border-[#201d30] rounded-2xl p-6 hover:border-[#ccff00]/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gemini AI Stock Advisor</h3>
            <p className="text-xs text-[#8e8a9e] leading-relaxed">
              Analisis fundamental mendalam otomatis, ringkasan laporan keuangan kuartalan, dan estimasi fair value berbasis AI.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#12101b] border border-[#201d30] rounded-2xl p-6 hover:border-[#00f0ff]/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Quant Multi-Factor Scoring</h3>
            <p className="text-xs text-[#8e8a9e] leading-relaxed">
              Skor saham 0-100 mengkombinasikan faktor Value, Quality, Momentum, Growth, dan Volatilitas secara matematis.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#12101b] border border-[#201d30] rounded-2xl p-6 hover:border-[#00f5a0]/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-[#00f5a0]/10 text-[#00f5a0] border border-[#00f5a0]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Rebalancing & Risk</h3>
            <p className="text-xs text-[#8e8a9e] leading-relaxed">
              Manajemen risiko portofolio terukur, penyesuaian alokasi aset berkala, dan penguji skenario krisis (stress testing).
            </p>
          </div>

        </div>
      </section>

      {/* FLOATING CURSOR DOCK BAR ("Clues at your cursor") */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <div className="bg-[#12101c]/90 border border-[#232035] rounded-full p-2 max-w-lg mx-auto shadow-2xl backdrop-blur-xl flex items-center justify-between gap-1">
          <Link href="/dashboard" className="p-2.5 rounded-full hover:bg-[#201d32] text-[#9a96ab] hover:text-white transition-all group relative" title="Dashboard">
            <Compass className="w-4 h-4" />
          </Link>
          <Link href="/stock-analysis" className="p-2.5 rounded-full hover:bg-[#201d32] text-[#9a96ab] hover:text-white transition-all group relative" title="Screener">
            <Search className="w-4 h-4" />
          </Link>
          <Link href="/portfolio" className="p-2.5 rounded-full hover:bg-[#201d32] text-[#9a96ab] hover:text-white transition-all group relative" title="Portfolio">
            <LineChart className="w-4 h-4" />
          </Link>
          <Link href="/alerts" className="p-2.5 rounded-full hover:bg-[#201d32] text-[#9a96ab] hover:text-white transition-all group relative" title="Alerts">
            <Zap className="w-4 h-4" />
          </Link>
          <Link href="/settings" className="p-2.5 rounded-full hover:bg-[#201d32] text-[#9a96ab] hover:text-white transition-all group relative" title="Settings">
            <SettingsIcon className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => setSearchModalOpen(true)}
            className="bg-[#ccff00] text-black p-2.5 rounded-full hover:bg-[#b8e600] transition-transform hover:scale-105 flex items-center justify-center ml-2"
            title="Search Securities (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        <span className="text-[11px] text-[#6b677a] font-mono mt-3 block">
          Pusat Kendali Navigasi Cepat (Tekan <kbd className="text-white bg-[#191726] px-1 py-0.5 rounded border border-[#26233a]">⌘K</kbd> untuk pencarian emiten)
        </span>
      </section>

      {/* PRICING & ACCESS SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#181624]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono text-[#00f0ff] uppercase tracking-widest bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20">
            VIP & Professional Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 mb-3">
            Pilih Lisensi Terminal Anda
          </h2>
          <p className="text-xs sm:text-sm text-[#8a869a]">
            Dapatkan akses penuh ke sistem analisa kuantitatif tanpa hambatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Trial / Retail Tier */}
          <div className="bg-[#12101b] border border-[#211e32] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#8a869a] uppercase">Free Trial Mode</span>
                <span className="text-[10px] text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded border border-[#00f5a0]/30 font-mono">
                  Instan
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono mb-2">Rp 0 <span className="text-xs text-[#8a869a] font-normal">/ 14 Hari</span></div>
              <p className="text-xs text-[#8a869a] mb-6">Cocok untuk mencoba fitur dasar cockpit dan riset saham pilihan.</p>

              <ul className="space-y-3 text-xs text-[#c0bdd0] mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00f5a0]" />
                  <span>Akses Skor Saham IHSG</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00f5a0]" />
                  <span>Watchlist & Portfolio Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00f5a0]" />
                  <span>Interactive Technical Charts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleDemoStart}
              className="w-full py-3 rounded-xl bg-[#1b1928] hover:bg-[#252238] text-white text-xs font-bold transition-all border border-[#2d2a42]"
            >
              Coba Mode Demo Instan
            </button>
          </div>

          {/* Pro VIP Tier */}
          <div className="bg-[#12101b] border-2 border-[#ccff00]/60 rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_0_40px_rgba(204,255,0,0.1)]">
            <div className="absolute -top-3.5 right-6 bg-[#ccff00] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-mono">
              Rekomendasi Utama
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#ccff00] uppercase font-bold">SafeHaven Pro Terminal</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono mb-2">Rp 199.000 <span className="text-xs text-[#8a869a] font-normal">/ bulan</span></div>
              <p className="text-xs text-[#8a869a] mb-6">Akses tanpa batas ke seluruh kemampuan Gemini AI & Rebalance Engine.</p>

              <ul className="space-y-3 text-xs text-[#c0bdd0] mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ccff00]" />
                  <span>Gemini AI Uncapped Market Advisor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ccff00]" />
                  <span>Automated Rebalancing Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ccff00]" />
                  <span>Live Foreign Flow & Seasonality Radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ccff00]" />
                  <span>Notifikasi WhatsApp / Email Real-time</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              Aktifkan VIP Pro Access
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#181624] py-12 px-4 sm:px-6 bg-[#08070d] text-xs text-[#736f83]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <SafeHavenLogo className="w-6 h-6" />
            <span className="font-mono text-white font-bold">SafeHaven Analytics</span>
          </div>

          <div className="flex items-center gap-6 text-[#8e8a9d]">
            <a href="#features" className="hover:text-white transition-colors">Fitur</a>
            <a href="#pricing" className="hover:text-white transition-colors">Harga</a>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <button onClick={() => setSearchModalOpen(true)} className="hover:text-white transition-colors">Command Bar</button>
          </div>

          <p className="font-mono text-[11px]">© {new Date().getFullYear()} SafeHaven System. Hak Cipta Dilindungi.</p>
        </div>
      </footer>

      {/* ------------------- MODAL 1: COMMAND SEARCH (⌘K) ------------------- */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
          <div className="bg-[#12101c] border border-[#27243c] w-full max-w-xl rounded-2xl p-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3 px-3 py-2 bg-[#181627] rounded-xl border border-[#2b2842] mb-3">
              <Search className="w-4 h-4 text-[#ccff00]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari emiten IHSG atau AS (e.g. BBCA, BBRI, NVDA)..."
                className="bg-transparent text-xs text-white placeholder-[#6c687e] outline-none w-full font-mono"
                autoFocus
              />
              <button 
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded text-[#716d82] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              <span className="text-[10px] font-mono text-[#6c687e] uppercase px-2 mb-1 block">Hasil Pencarian Saham</span>
              {filteredStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    setSearchModalOpen(false);
                    setLocation(`/ticker/${stock.symbol}`);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1a182a] border border-transparent hover:border-[#2a2742] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <TickerLogo symbol={stock.symbol} sizeClassName="w-6 h-6" />
                    <div>
                      <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                        <span>{stock.symbol}</span>
                        <span className="text-[9px] text-[#6c687e] bg-[#1a1828] px-1.5 py-0.2 rounded border border-[#2a273e] font-sans">
                          {stock.exchange}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7d7990]">{stock.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-white">Rp {stock.price.toLocaleString()}</div>
                    <div className="text-[10px] text-[#00f5a0] font-mono">{stock.change} | Skor {stock.score}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-[#1e1c2e] flex items-center justify-between text-[11px] text-[#6b677a] font-mono">
              <span>Gunakan tombol <kbd className="text-white bg-[#1b1928] px-1 rounded">↑</kbd> <kbd className="text-white bg-[#1b1928] px-1 rounded">↓</kbd> untuk navigasi</span>
              <span>Tekan <kbd className="text-white bg-[#1b1928] px-1 rounded">ESC</kbd> untuk tutup</span>
            </div>

          </div>
        </div>
      )}

      {/* ------------------- MODAL 2: GUIDED TOUR VIDEO PREVIEW ------------------- */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12101c] border border-[#27243c] w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#ccff00]" />
                <h3 className="text-sm font-bold text-white font-mono">Tur Interaktif Cockpit SafeHaven</h3>
              </div>
              <button onClick={() => setTourModalOpen(false)} className="text-[#716d82] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-[#0b0a10] rounded-xl border border-[#221f35] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] mb-4 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                <Play className="w-8 h-8 fill-[#ccff00] ml-1" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Simulasi Cockpit Live</h4>
              <p className="text-xs text-[#8e8a9f] max-w-md mb-6">
                Pelajari cara membaca skor kuantitatif saham, radar rezim makro pasar, dan eksekusi rebalancing otomatis.
              </p>
              <button
                onClick={() => {
                  setTourModalOpen(false);
                  handleDemoStart();
                }}
                className="bg-[#ccff00] text-black font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#b8e600] transition-all"
              >
                Mulai Tur Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- MODAL 3: START TRIAL & AUTH SIGNUP ------------------- */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12101c] border border-[#2a2740] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center">
            
            <button 
              onClick={() => {
                setAuthModalOpen(false);
                setAuthStep('input');
              }} 
              className="absolute top-4 right-4 text-[#716d82] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {authStep === 'input' && (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Selamat Datang di SafeHaven</h3>
                <p className="text-xs text-[#8e8a9f] mb-6">Masukkan email Anda untuk mengaktifkan akses VIP Trial 14 hari.</p>

                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#736f84] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className="w-full bg-[#181627] border border-[#2b2842] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#6c687e] outline-none focus:border-[#ccff00] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                  >
                    Dapatkan Link Akses VIP
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-[#1f1d30] flex items-center justify-between text-xs text-[#736f84]">
                  <span>Atau coba tanpa daftar:</span>
                  <button
                    onClick={() => {
                      setAuthModalOpen(false);
                      handleDemoStart();
                    }}
                    className="text-[#00f0ff] hover:underline font-bold"
                  >
                    Masuk Mode Demo →
                  </button>
                </div>
              </>
            )}

            {authStep === 'loading' && (
              <div className="py-8">
                <Loader2 className="w-8 h-8 text-[#ccff00] animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#9b97ac] font-mono">Menyiapkan kredensial VIP Anda...</p>
              </div>
            )}

            {authStep === 'sent' && (
              <div className="py-4">
                <CheckCircle2 className="w-12 h-12 text-[#00f5a0] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Cek Inbox Email Anda</h3>
                <p className="text-xs text-[#8e8a9f] mb-6">
                  Kami telah mengirimkan instruksi aktivasi ke <span className="text-white font-bold">{authEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setAuthModalOpen(false);
                    handleDemoStart();
                  }}
                  className="bg-[#1c1a2c] text-white text-xs font-bold px-5 py-2.5 rounded-xl border border-[#2b2842] hover:bg-[#252238] transition-all"
                >
                  Lanjut ke Dashboard Demo
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ------------------- MODAL 4: VIP PASS CARD PREVIEW ------------------- */}
      {vipPassOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12101c] border border-[#2a2740] w-full max-w-sm rounded-2xl p-6 shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
            <button onClick={() => setVipPassOpen(false)} className="absolute top-4 right-4 text-[#716d82] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {/* Pass Card Component */}
            <div className="w-full aspect-[1/1.5] bg-gradient-to-b from-[#1c192c] via-[#12101d] to-[#08070e] rounded-2xl border border-[#332f4e] p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl my-2 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between text-left">
                <SafeHavenLogo className="w-8 h-8" />
                <span className="text-[10px] font-mono text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/30">
                  VIP PASS #084
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#736f84] uppercase tracking-widest block mb-1">Pass Access Level</span>
                <h4 className="text-xl font-extrabold text-white font-mono tracking-tight">SafeHaven Institutional</h4>
              </div>

              <div className="text-left pt-4 border-t border-[#232038]">
                <div className="text-[10px] text-[#736f84] font-mono">Pemegang Akses:</div>
                <div className="text-xs font-bold text-white font-mono">{authEmail || 'Investor VIP'}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setVipPassOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full mt-4 bg-[#ccff00] text-black font-bold text-xs py-2.5 rounded-xl hover:bg-[#b8e600] transition-all"
            >
              Klaim Access Pass Anda
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
