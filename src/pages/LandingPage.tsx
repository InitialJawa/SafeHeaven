/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { TickerLogo } from '../components/TickerLogo';
import { SafeHavenLogo } from '../components/SafeHavenLogo';
import { 
  ShieldCheck, 
  TrendingUp, 
  Bot, 
  BarChart3, 
  Sliders, 
  PieChart, 
  History, 
  Shield, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ArrowUpRight, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Activity, 
  Sparkles,
  Layers,
  Award,
  Lock,
  Globe,
  ExternalLink,
  ChevronRight,
  UserCheck,
  LineChart,
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '../stores';

export const LandingPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, loginDemoUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search preview state
  const [searchTicker, setSearchTicker] = useState('');
  const [selectedDemoTicker, setSelectedDemoTicker] = useState('BBCA.JK');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Demo stocks data (6 emiten for perfectly even 3x2 / 2x3 grid)
  const demoStocks = [
    {
      symbol: 'BBCA.JK',
      name: 'Bank Central Asia Tbk',
      sector: 'Financials',
      price: 10150,
      change: 1.5,
      score: 92,
      fairValue: 11200,
      aiSignal: 'BULLISH',
      summary: 'Kinerja laba bersih rekor tertinggi didorong efisiensi CASA 80%+ dan pertumbuhan kredit konsumer solid.'
    },
    {
      symbol: 'BBRI.JK',
      name: 'Bank Rakyat Indonesia Tbk',
      sector: 'Financials',
      price: 5200,
      change: -0.5,
      score: 88,
      fairValue: 5800,
      aiSignal: 'ACCUMULATE',
      summary: 'Margin bunga bersih (NIM) terjaga tinggi di segmen mikro Holding Ultra Mikro (UMi).'
    },
    {
      symbol: 'BMRI.JK',
      name: 'Bank Mandiri (Persero) Tbk',
      sector: 'Financials',
      price: 6450,
      change: 1.2,
      score: 90,
      fairValue: 7200,
      aiSignal: 'STRONG BUY',
      summary: 'Pertumbuhan digital Livin by Mandiri pesat serta ekspansi portofolio kredit korporasi & komersial yang agresif.'
    },
    {
      symbol: 'TLKM.JK',
      name: 'Telkom Indonesia Tbk',
      sector: 'Telecommunications',
      price: 2950,
      change: 2.1,
      score: 81,
      fairValue: 3600,
      aiSignal: 'UNDERVALUED',
      summary: 'Valuasi PBV berada di batas bawah historis 5 tahun, bisnis data & FMC terus berekspansi.'
    },
    {
      symbol: 'AMMN.JK',
      name: 'Amman Mineral Internasional Tbk',
      sector: 'Basic Materials',
      price: 11800,
      change: 3.8,
      score: 85,
      fairValue: 13500,
      aiSignal: 'STRONG MOMENTUM',
      summary: 'Peningkatan kapasitas smelter dan kenaikan harga tembaga global mendorong arus kas operasi.'
    },
    {
      symbol: 'ASII.JK',
      name: 'Astra International Tbk',
      sector: 'Consumer Discretionary',
      price: 4650,
      change: 0.8,
      score: 79,
      fairValue: 5400,
      aiSignal: 'DIVIDEND YIELD',
      summary: 'Dividend yield diperkirakan ~8-9%, ditopang pangsa pasar otomotif dan kontribusi anak usaha tambang.'
    }
  ];

  const currentDemo = demoStocks.find(s => s.symbol === selectedDemoTicker) || demoStocks[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicker) return;
    const clean = searchTicker.trim().toUpperCase();
    const formatted = clean.includes('.') ? clean : `${clean}.JK`;
    setLocation(`/ticker/${formatted}`);
  };

  const faqs = [
    {
      question: 'Apa itu SafeHaven dan bagaimana cara kerjanya?',
      answer: 'SafeHaven adalah platform analisis kecerdasan buatan (AI) & kuantitatif khusus pasar saham Indonesia (IDX / IHSG). Platform ini menggabungkan data keuangan resmi, grafik teknikal real-time, dan model AI Gemini untuk memberikan skor fundamental (0-100), estimasi Fair Value DCF, serta rekomendasi taktis secara otomatis.'
    },
    {
      question: 'Apakah SafeHaven cocok untuk investor pemula maupun berpengalaman?',
      answer: 'Sangat cocok. Pemula dapat mengandalkan Ringkasan AI Bahasa Indonesia dan Skor Fundamental untuk memahami kesehatan emiten tanpa perlu membaca laporan keuangan ratusan halaman. Investor berpengalaman dan trader quant dapat menggunakan Backtest Strategi, Walk-Forward Optimizer, serta Risk Cockpit.'
    },
    {
      question: 'Darimana data harga saham IDX dan laporan keuangan diambil?',
      answer: 'Data diambil dari penyedia data pasar terverifikasi secara real-time / near real-time, diintegrasikan langsung dengan mesin Yahoo Finance API serta database historis IHSG yang terus diperbarui secara otomatis.'
    },
    {
      question: 'Bagaimana AI SafeHaven menganalisis saham?',
      answer: 'Mesin AI kami didayagunakan oleh Google Gemini 2.5 yang dipadu dengan petunjuk analisis fundamental (DCF, PER/PBV Band, ROE, Solvabilitas) serta analisis teknikal (MA, RSI, MACD, Support/Resistance). AI memproses data makro dan kinerja emiten untuk menyajikan insight yang objektif tanpa bias emosional.'
    },
    {
      question: 'Apakah saya bisa menggunakan SafeHaven secara gratis?',
      answer: 'Ya! SafeHaven menyediakan paket Starter secara GRATIS selamanya dengan akses ke Market Cockpit, Analisis Ticker dasar, Chart Teknis, dan kuota analisis AI harian.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060509] text-white font-sans selection:bg-[#ccff00] selection:text-black">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0a090f]/95 backdrop-blur-md border-b border-[#1b1926]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
              <SafeHavenLogo className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(244,184,71,0.4)]" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-sans">
                SafeHaven<span className="text-[#F4B847]">.</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#686477] block font-mono tracking-widest font-bold -mt-1">
                IDX AI COCKPIT
              </span>
            </div>
          </Link>

          {/* Nav Links - Shown on Desktop LG (1024px+) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#9f9bac]">
            <a href="#fitur" className="hover:text-[#ccff00] transition-colors">Fitur Utama</a>
            <a href="#demo-ai" className="hover:text-[#ccff00] transition-colors">AI Intelligence</a>
            <Link href={user ? "/ai" : "/login"} className="hover:text-[#ccff00] transition-colors flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Manager</span>
            </Link>
            <a href="#screener" className="hover:text-[#ccff00] transition-colors">Live Market</a>
            <a href="#harga" className="hover:text-[#ccff00] transition-colors">Paket Harga</a>
            <a href="#faq" className="hover:text-[#ccff00] transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            <Link 
              href="/dashboard"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#171522] border border-[#2d2943] text-white rounded-xl text-[11px] sm:text-xs font-bold hover:bg-[#201d2f] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Market Cockpit</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ccff00]" />
            </Link>

            {user ? (
              <Link 
                href="/dashboard"
                className="hidden sm:flex px-3.5 py-2 bg-[#ccff00] text-black rounded-xl text-xs font-bold hover:bg-[#b8e600] transition-all items-center gap-1.5 shadow-[0_0_20px_rgba(204,255,0,0.2)] cursor-pointer"
              >
                <span>Console Saya</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button 
                  onClick={() => {
                    loginDemoUser(false);
                    setLocation('/dashboard');
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white hover:text-[#ccff00] transition-colors cursor-pointer hidden md:block"
                >
                  Demo
                </button>
                <Link 
                  href="/login"
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#ccff00] text-black rounded-xl text-[11px] sm:text-xs font-bold hover:bg-[#b8e600] transition-all flex items-center gap-1 shadow-[0_0_20px_rgba(204,255,0,0.2)] cursor-pointer"
                >
                  <span>Masuk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            {/* Mobile / Tablet Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#9f9bac] hover:text-white bg-[#111018] border border-[#1b1926] rounded-xl cursor-pointer transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#ccff00]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0b12] border-b border-[#1b1926] px-4 py-3 space-y-2.5 shadow-2xl">
            <nav className="flex flex-col space-y-1 text-xs font-semibold text-[#9f9bac]">
              <a 
                href="#fitur" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#171522] hover:text-[#ccff00] transition-all flex items-center justify-between"
              >
                <span>Fitur Utama</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#686477]" />
              </a>
              <a 
                href="#demo-ai" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#171522] hover:text-[#ccff00] transition-all flex items-center justify-between"
              >
                <span>AI Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#686477]" />
              </a>
              <Link 
                href={user ? "/ai" : "/login"} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#171522] hover:text-[#ccff00] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#ccff00]" />
                  <span>AI Manager Assistant</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#686477]" />
              </Link>
              <a 
                href="#screener" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#171522] hover:text-[#ccff00] transition-all flex items-center justify-between"
              >
                <span>Live Market & Screener</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#686477]" />
              </a>
              <a 
                href="#harga" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#171522] hover:text-[#ccff00] transition-all flex items-center justify-between"
              >
                <span>Paket Harga</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#686477]" />
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-[#171522] hover:text-[#ccff00] transition-all flex items-center justify-between"
              >
                <span>FAQ & Bantuan</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#686477]" />
              </a>
            </nav>

            <div className="pt-2.5 border-t border-[#1b1926] grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  loginDemoUser(false);
                  setLocation('/dashboard');
                }}
                className="w-full bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Coba Demo</span>
              </button>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#ccff00] text-black text-xs font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#ccff00]/10 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Masuk / Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION WITH CLEAN ERGONOMIC LAYOUT & 3D MOCKUP */}
      <section className="relative pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-32 overflow-hidden border-b border-[#1b1926]">
        {/* Glow ambient background gradients */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#ccff00]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#00f0ff]/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b192615_1px,transparent_1px),linear-gradient(to_bottom,#1b192615_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Hero Text, Badge, Search & CTAs */}
            <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8">
              
              {/* Compact Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111018] border border-[#ccff00]/30 text-[#ccff00] text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse shrink-0"></span>
                <span>⚡ IDX AI ANALYTICS & GEMINI COCKPIT</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight text-white leading-[1.1] font-sans">
                Best <span className="text-[#ccff00] drop-shadow-[0_0_20px_rgba(204,255,0,0.25)]">stock investing</span><br className="hidden lg:block" /> platform for your future.
              </h1>

              {/* Subtitle Description */}
              <p className="text-base sm:text-lg text-[#9f9bac] leading-relaxed max-w-2xl font-medium">
                SafeHaven menggabungkan analisis kuantitatif IHSG, Fair Value DCF, skor fundamental 0-100, dan kecerdasan AI Gemini untuk menjaga portofolio Anda tetap tumbuh secara konsisten.
              </p>

              {/* Hero Search Bar (Main User Interaction Point) */}
              <div className="pt-2">
                <form onSubmit={handleSearchSubmit} className="max-w-xl flex items-center bg-[#111018] border border-[#262436] focus-within:border-[#ccff00] rounded-2xl p-2 shadow-2xl transition-all">
                  <div className="pl-4 text-[#686477]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cari emiten IHSG (BBCA, BBRI, TLKM, AMMN)..."
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-3 text-sm sm:text-base text-white focus:outline-none placeholder:text-[#686477]"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#ccff00] text-black font-extrabold rounded-xl text-sm hover:bg-[#b8e600] transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                  >
                    <span>Analisis Ticker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Popular Ticker Quick Tags */}
                <div className="mt-4 flex items-center gap-2.5 text-xs text-[#686477] flex-wrap">
                  <span className="font-mono text-xs text-[#686477]">Populer:</span>
                  {['BBCA', 'BBRI', 'TLKM', 'AMMN', 'ASII', 'GOTO'].map((sym) => (
                    <button 
                      key={sym} 
                      type="button"
                      onClick={() => {
                        setSearchTicker(sym);
                        setLocation(`/ticker/${sym}.JK`);
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-[#ccff00] font-mono text-[11px] font-bold transition-all cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs & Social Proof Row */}
              <div className="pt-6 sm:pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1b1926]/40">
                
                {/* Secondary Action - Left */}
                <Link 
                  href="/dashboard"
                  className="px-5 py-3 bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <span>Live Market</span>
                  <ArrowUpRight className="w-4 h-4 text-[#ccff00]" />
                </Link>

                {/* Primary Action - Center */}
                <button
                  onClick={() => {
                    loginDemoUser(false);
                    setLocation('/dashboard');
                  }}
                  className="px-8 py-3.5 bg-[#ccff00] text-black font-extrabold text-sm sm:text-base rounded-xl hover:bg-[#b8e600] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(204,255,0,0.25)] w-full sm:w-auto transform hover:scale-105"
                >
                  <Zap className="w-5 h-5 fill-black" />
                  <span>Coba Cockpit Demo</span>
                </button>

                {/* Social Proof - Right */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                  <div className="flex -space-x-3 overflow-hidden shrink-0">
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#060509]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#060509]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#060509]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black text-white font-mono">168K+</div>
                    <div className="text-[10px] text-[#686477] font-medium leading-tight">Investor<br/>Aktif</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Floating Phone Mockup */}
            <div className="lg:col-span-5 relative flex justify-center items-center mt-12 lg:mt-0 py-8">
              
              {/* Background 3D Soft Glow */}
              <div className="absolute w-72 h-72 bg-[#ccff00]/10 rounded-full blur-[80px] pointer-events-none"></div>

              {/* 3D Tilted Phone Container */}
              <div className="relative group perspective-[1000px] w-full max-w-[320px]">
                
                {/* Secondary Background Phone (Angled behind) */}
                <div className="absolute top-6 left-10 w-full h-[500px] bg-[#0c0b12] border-2 border-[#262436] rounded-[38px] p-3 shadow-2xl opacity-40 [transform:rotateY(-25deg)_rotateX(20deg)_translateZ(-60px)] pointer-events-none hidden sm:block">
                  <div className="w-full h-full bg-[#111018] rounded-[30px] p-4 flex flex-col justify-between overflow-hidden opacity-50">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                      <span>9:41</span>
                      <div className="w-12 h-3 bg-black rounded-full"></div>
                    </div>
                    <div className="my-auto text-center">
                      <p className="text-[#ccff00] font-mono text-xs font-bold">Join building the future.</p>
                      <button className="mt-3 px-4 py-1.5 bg-[#ccff00] text-black text-[10px] font-black rounded-full">Sign in</button>
                    </div>
                  </div>
                </div>

                {/* Primary Floating 3D Phone Screen */}
                <div className="relative w-full h-[560px] bg-[#08070c] border-[3px] border-[#2d2a3e] rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(204,255,0,0.15)] [transform:rotateY(-18deg)_rotateX(14deg)_rotateZ(-2deg)] group-hover:[transform:rotateY(-4deg)_rotateX(4deg)_rotateZ(0deg)] transition-all duration-700 ease-out cursor-pointer">
                  
                  {/* Outer Bezel Gloss */}
                  <div className="absolute inset-0 rounded-[42px] border border-white/10 pointer-events-none"></div>

                  {/* Phone Speaker / Camera Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#1a1924]"></div>
                  </div>

                  {/* Phone Screen Canvas Content */}
                  <div className="w-full h-full bg-[#0d0c14] rounded-[34px] pt-7 px-3.5 pb-3 flex flex-col justify-between overflow-hidden border border-[#1f1d2b]">
                    
                    {/* Top App Header */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#686477] mb-2">
                        <span className="text-white font-bold">SafeHaven.</span>
                        <span className="text-[#ccff00] flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping"></span>
                          LIVE
                        </span>
                      </div>

                      {/* Balance / Portfolio Card */}
                      <div className="bg-[#151320] border border-[#262436] p-3 rounded-2xl shadow-inner">
                        <span className="text-[10px] text-[#8e8a9d] font-mono block">PORTFOLIO VALUE</span>
                        <div className="text-lg font-black text-white font-mono mt-0.5">
                          Rp 987.209.800 <span className="text-[10px] text-[#00f5a0] font-normal">+14.2%</span>
                        </div>

                        {/* Miniature Chart Graphic */}
                        <div className="mt-2 h-14 w-full relative">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                            <defs>
                              <linearGradient id="phoneGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ccff00" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#ccff00" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path 
                              d="M 0,30 Q 20,25 35,32 T 70,12 T 100,5 L 100,40 L 0,40 Z" 
                              fill="url(#phoneGlow)" 
                            />
                            <path 
                              d="M 0,30 Q 20,25 35,32 T 70,12 T 100,5" 
                              fill="none" 
                              stroke="#ccff00" 
                              strokeWidth="2.5" 
                            />
                            <circle cx="100" cy="5" r="3.5" fill="#ccff00" className="animate-pulse" />
                          </svg>
                        </div>
                      </div>

                      {/* Quick Ticker Chips */}
                      <div className="mt-3 space-y-1.5">
                        <div className="bg-[#151320]/80 border border-[#222030] p-2 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] text-[10px] font-mono font-bold">
                              B
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-white font-mono">BBCA.JK</div>
                              <div className="text-[9px] text-gray-400">Bank Central Asia</div>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="text-[11px] text-white font-bold">Rp 10.150</div>
                            <div className="text-[9px] text-[#00f5a0]">+1.5%</div>
                          </div>
                        </div>

                        <div className="bg-[#151320]/80 border border-[#222030] p-2 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] text-[10px] font-mono font-bold">
                              R
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-white font-mono">BBRI.JK</div>
                              <div className="text-[9px] text-gray-400">Bank Rakyat Indo</div>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="text-[11px] text-white font-bold">Rp 5.200</div>
                            <div className="text-[9px] text-[#00f5a0]">+2.1%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Pill in Phone */}
                    <div className="pt-2 border-t border-[#1f1d2b]">
                      <button className="w-full py-2.5 bg-[#ccff00] text-black font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Analisis AI Instant</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. TRUSTED PARTNER & FEATURE NUMBERS (01, 02, 03 CARDS) */}
      <section className="py-20 bg-[#0a090f] border-b border-[#1b1926] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
            <div className="md:col-span-7">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Your trusted partner of <br />
                <span className="text-[#ccff00]">stock market analytics</span>.
              </h2>
            </div>
            <div className="md:col-span-5 text-xs text-[#9f9bac] leading-relaxed">
              SafeHaven dirancang untuk memberikan transparansi penuh pada emiten IHSG, mempermudah kalkulasi Fair Value, dan meminimalisir risiko lewat sistem teruji secara kuantitatif.
            </div>
          </div>

          {/* 01, 02, 03 Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 01 */}
            <div className="p-6 bg-[#111018] border border-[#222030] rounded-2xl flex flex-col justify-between hover:border-[#ccff00]/40 transition-all">
              <div>
                <div className="text-2xl font-black text-white/40 font-mono mb-4">01.</div>
                <h3 className="text-lg font-bold text-white mb-2">Service for Any Level of Expertise.</h3>
                <p className="text-xs text-[#8e8a9d] leading-relaxed">
                  Dari penyaringan saham otomatis hingga ringkasan laporan keuangan berbahasa Indonesia yang mudah dipahami oleh pemula maupun pro.
                </p>
              </div>
            </div>

            {/* Card 02: HIGHLIGHTED NEON LIME CARD */}
            <div className="p-6 bg-[#ccff00] text-black rounded-2xl flex flex-col justify-between shadow-[0_0_35px_rgba(204,255,0,0.25)] transform hover:-translate-y-1 transition-all">
              <div>
                <div className="text-2xl font-black text-black/50 font-mono mb-4">02.</div>
                <h3 className="text-xl font-extrabold text-black mb-2">Industry best practices.</h3>
                <p className="text-xs text-black/80 font-medium leading-relaxed">
                  Engine DCF & Graham Valuation yang terkalibrasi khusus untuk histori inflasi dan pertumbuhan suku bunga di Indonesia.
                </p>
              </div>
              <Link 
                href="/full-chart/IHSG"
                className="mt-6 inline-flex items-center gap-1 text-xs font-black text-black hover:underline cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 03 */}
            <div className="p-6 bg-[#111018] border border-[#222030] rounded-2xl flex flex-col justify-between hover:border-[#00f0ff]/40 transition-all">
              <div>
                <div className="text-2xl font-black text-white/40 font-mono mb-4">03.</div>
                <h3 className="text-lg font-bold text-white mb-2">Protected by Risk Control.</h3>
                <p className="text-xs text-[#8e8a9d] leading-relaxed">
                  Matriks Value at Risk (VaR), Maximum Drawdown, dan diversifikasi sektor berbasis data kuantitatif terkini.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TRUSTED PLATFORM ANYTIME & ANYWHERE WITH SMOOTH CURVE GRAPH & FLOATING BADGES */}
      <section className="py-20 relative overflow-hidden border-b border-[#1b1926]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Smooth Curve Graph & Floating Cards */}
            <div className="lg:col-span-6 relative">
              <div className="p-6 sm:p-8 bg-[#111018] border border-[#262436] rounded-3xl relative overflow-hidden shadow-2xl">
                
                {/* Background grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b192620_1px,transparent_1px),linear-gradient(to_bottom,#1b192620_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none"></div>

                {/* Floating Badge Top-Left */}
                <div className="absolute top-6 left-6 z-20 bg-[#161420]/90 backdrop-blur border border-[#2c283d] px-4 py-2.5 rounded-2xl shadow-xl max-w-[200px]">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ccff00]">
                    <span>| Rp 4,528.000</span>
                  </div>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5 leading-tight">SafeHaven unifies and secures a growing ecosystem of specialized blocks.</p>
                </div>

                {/* Floating Badge Bottom-Right */}
                <div className="absolute bottom-24 right-6 z-20 bg-[#161420]/90 backdrop-blur border border-[#2c283d] px-4 py-2.5 rounded-2xl shadow-xl max-w-[200px]">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ccff00]">
                    <span>| 1,44,528 BTC</span>
                  </div>
                  <p className="text-[10px] text-[#9f9bac] mt-0.5 leading-tight">SafeHaven unifies and secures a growing ecosystem of specialized blocks.</p>
                </div>

                {/* Smooth Cubic Bezier SVG Curve Graphic */}
                <div className="relative h-64 my-10">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 320 140">
                    <defs>
                      <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ccff00" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ccff00" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path 
                      d="M 10,100 C 70,110 110,50 170,80 C 230,110 270,30 310,20 L 310,140 L 10,140 Z" 
                      fill="url(#curveGlow)" 
                    />
                    {/* Smooth curve line */}
                    <path 
                      d="M 10,100 C 70,110 110,50 170,80 C 230,110 270,30 310,20" 
                      fill="none" 
                      stroke="#ccff00" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    {/* Node 1 */}
                    <circle cx="85" cy="85" r="14" fill="#ccff00" className="animate-pulse shadow-lg cursor-pointer" />
                    <text x="81" y="89" fontSize="11" fontWeight="bold" fill="#000" fontFamily="monospace">B</text>

                    {/* Node 2 */}
                    <circle cx="170" cy="80" r="14" fill="#ccff00" className="shadow-lg cursor-pointer" />
                    <text x="165" y="84" fontSize="11" fontWeight="bold" fill="#000" fontFamily="monospace">L</text>
                  </svg>
                </div>

                {/* Bottom Card Inside Container */}
                <div className="relative z-10 p-4 bg-[#161420] border border-[#292639] rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[10px] text-[#9f9bac] font-mono block">Average Rate</span>
                    <div className="text-base font-black text-white font-mono mt-0.5">Rp 4,528 USD <span className="text-xs text-[#00f5a0] font-normal">+45.66%</span></div>
                  </div>
                  <span className="px-3 py-1 bg-[#ccff00] text-black font-mono font-black text-[11px] rounded-full shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                    02 May
                  </span>
                </div>

              </div>
            </div>

            {/* Right Column: Text & Rating */}
            <div className="lg:col-span-6">
              
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Trusted platform <br />
                <span className="text-[#ccff00]">anytime & anywhere</span>.
              </h2>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#ccff00] my-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#ccff00]" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-[#9f9bac] leading-relaxed">
                SafeHaven membantu menyatukan ekosistem data pasar modal Indonesia dari laporan keuangan hingga pergerakan harga historis ke dalam satu dasbor cerdas.
              </p>

              {/* Bullet Features */}
              <div className="mt-6 space-y-3 text-xs text-[#d8d5e5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                  <span>Real-time Sync dengan Yahoo Finance & Data IHSG</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                  <span>AI Assistant Gemini 2.5 dengan pemahaman konteks emiten lokal</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex items-center gap-4 flex-wrap">
                <Link 
                  href={user ? "/" : "/login"}
                  className="px-6 py-3 bg-[#ccff00] text-black font-extrabold text-xs rounded-xl hover:bg-[#b8e600] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a 
                  href="#faq"
                  className="text-xs font-bold text-white hover:text-[#ccff00] transition-colors"
                >
                  Ada pertanyaan?
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. LIVE MARKET PREVIEW STRIP (INTERACTIVE DEMO) */}
      <section id="screener" className="py-16 bg-[#0a090f] border-b border-[#1b1926]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono font-bold text-[#ccff00] tracking-widest uppercase mb-1">LIVE MARKET PREVIEW</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ringkasan Kinerja Saham Unggulan IHSG
              </h2>
            </div>
            <p className="text-xs text-[#9f9bac] max-w-md">
              Klik pada salah satu emiten di bawah untuk melihat cuplikan skor kuantitatif & insight AI SafeHaven secara interaktif.
            </p>
          </div>

          {/* Ticker Cards Grid (Even 3x2 / 2x3 grid with bank logos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoStocks.map((stock) => {
              const isSelected = selectedDemoTicker === stock.symbol;
              const isPositive = stock.change >= 0;
              return (
                <div 
                  key={stock.symbol}
                  onClick={() => setSelectedDemoTicker(stock.symbol)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#111018] border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.15)] ring-1 ring-[#ccff00]/30' 
                      : 'bg-[#0e0d14] border-[#1b1926] hover:border-[#262436] hover:bg-[#111018]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <TickerLogo symbol={stock.symbol} sizeClassName="w-9 h-9" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white font-mono">{stock.symbol.replace('.JK', '')}</span>
                        <span className={`text-xs font-mono font-bold ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                          {isPositive ? '+' : ''}{stock.change}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8e8a9d] truncate font-medium">{stock.name}</p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#1b1926] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#686477] block font-mono">HARGA</span>
                      <span className="text-white font-mono font-bold">Rp {stock.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#686477] block font-mono">SKOR AI</span>
                      <span className="px-2 py-0.5 rounded bg-[#ccff00]/10 text-[#ccff00] font-mono text-[11px] font-black border border-[#ccff00]/20">
                        {stock.score}/100
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Selected Stock Showcase Widget */}
          <div id="demo-ai" className="mt-8 p-6 bg-[#111018] border border-[#1b1926] rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <TickerLogo symbol={currentDemo.symbol} sizeClassName="w-12 h-12" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-white font-mono">{currentDemo.symbol}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] font-mono font-bold border border-[#ccff00]/20">
                        {currentDemo.aiSignal}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#d8d5e5]">{currentDemo.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-[#686477] font-mono">Sektor: {currentDemo.sector}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-[#1b1926]">
                  <div>
                    <span className="text-[10px] text-[#686477] font-mono block">Harga Terakhir</span>
                    <span className="text-lg font-bold text-white font-mono">Rp {currentDemo.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#686477] font-mono block">Fair Value DCF</span>
                    <span className="text-lg font-bold text-[#00f5a0] font-mono">Rp {currentDemo.fairValue.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#0a090f] p-5 rounded-xl border border-[#1b1926]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ccff00] mb-2">
                  <Bot className="w-4 h-4" />
                  <span>ANALISIS AI GEMINI REAL-TIME</span>
                </div>
                <p className="text-xs sm:text-sm text-[#e2dfeb] leading-relaxed italic">
                  "{currentDemo.summary}"
                </p>

                <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#1b1926] text-[#686477]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00f5a0]" />
                    <span>Laporan Keuangan Q2 Verifikasi Otomatis</span>
                  </span>
                  <Link 
                    href={`/ticker/${currentDemo.symbol}`}
                    className="text-[#ccff00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Grafik & Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. MODULAR FEATURE HIGHLIGHTS */}
      <section id="fitur" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-[#ccff00] tracking-widest uppercase mb-2">FITUR UNGGULAN SAFEHAVEN</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Semua Tools Analisis Saham yang Anda Butuhkan dalam Satu Tempat
            </h2>
            <p className="mt-3 text-sm text-[#9f9bac]">
              Dirancang khusus untuk memenuhi standar analisis fundamental, teknikal, dan kuantitatif pasar saham Indonesia (IHSG).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center text-[#ccff00] mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Stock Advisor & Screener</h3>
              <p className="text-xs text-[#9f9bac] leading-relaxed">
                Tanyakan apa saja seputar emiten IHSG kepada AI Companion kami. Dapatkan rangkuman katalis bisnis, laporan keuangan, dan estimasi risiko dalam bahasa Indonesia secara instan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] hover:border-[#00f0ff]/40 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-xl flex items-center justify-center text-[#00f0ff] mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Skor Fundamental & Valuation DCF</h3>
              <p className="text-xs text-[#9f9bac] leading-relaxed">
                Metrik skor fundamental 0-100 otomatis yang mengalkulasi Fair Value DCF, PER/PBV Band Historis, Margin Keuntungan, ROE, dan Solvabilitas emiten.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] hover:border-[#00f5a0]/40 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-[#00f5a0]/10 border border-[#00f5a0]/30 rounded-xl flex items-center justify-center text-[#00f5a0] mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive Technical Charting</h3>
              <p className="text-xs text-[#9f9bac] leading-relaxed">
                Grafik teknikal interaktif TradingView / Lightweight Charts dilengkapi indikator Moving Averages (EMA 20/50/200), RSI, MACD, dan pendeteksi Support/Resistance otomatis.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] hover:border-[#ff3366]/40 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-xl flex items-center justify-center text-[#ff3366] mb-5 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Backtest & Walk-Forward Optimizer</h3>
              <p className="text-xs text-[#9f9bac] leading-relaxed">
                Uji coba performa strategi trading kuantitatif pada data historis IHSG 5 tahun terakhir. Optimalkan parameter tanpa perlu menulis kodingan rumit.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center text-[#ccff00] mb-5 group-hover:scale-110 transition-transform">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Portfolio Risk Cockpit</h3>
              <p className="text-xs text-[#9f9bac] leading-relaxed">
                Lacak portofolio riil Anda, hitung Rasio Sharpe, Maximum Drawdown, Value at Risk (VaR), serta matriks korelasi antar emiten untuk meminimalkan risiko kerugian.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] hover:border-[#00f0ff]/40 rounded-2xl transition-all group">
              <div className="w-12 h-12 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-xl flex items-center justify-center text-[#00f0ff] mb-5 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Seasonality & Monthly Heatmap</h3>
              <p className="text-xs text-[#9f9bac] leading-relaxed">
                Visualisasikan kecenderungan kenaikan atau penurunan harga saham IDX berdasarkan bulan dan hari. Sangat ampuh untuk strategi Window Dressing & Dividend Season.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="harga" className="py-20 bg-[#0a090f] border-t border-b border-[#1b1926]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-[#ccff00] tracking-widest uppercase mb-2">PILIKAN PAKET BERSAING</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Investasi Terbaik untuk Portofolio Masa Depan Anda
            </h2>
            <p className="mt-3 text-sm text-[#9f9bac]">
              Pilih paket yang sesuai dengan kebutuhan analisis dan gaya investasi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Tier 1: Starter (Free) */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-[#686477] uppercase mb-1">STARTER</div>
                <h3 className="text-xl font-bold text-white">Free Forever</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-white font-mono">Rp 0</span>
                  <span className="text-xs text-[#686477]"> / bulan</span>
                </div>
                <ul className="space-y-3 text-xs text-[#9f9bac]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Akses Market Cockpit & Watchlist</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Grafik Teknis & Indikator Dasar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Skor Fundamental Saham 0-100</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>5 Query AI Gemini / hari</span>
                  </li>
                </ul>
              </div>
              <Link 
                href="/login"
                className="mt-8 w-full py-3 bg-[#1b1926] hover:bg-[#262436] text-white text-center rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Tier 2: Pro Trader (Popular) */}
            <div className="p-6 bg-[#111018] border-2 border-[#ccff00] rounded-2xl flex flex-col justify-between relative shadow-[0_0_30px_rgba(204,255,0,0.15)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#ccff00] text-black text-[10px] font-black rounded-full font-mono uppercase tracking-wider">
                PALING POPULER
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#ccff00] uppercase mb-1">PRO TRADER</div>
                <h3 className="text-xl font-bold text-white">Full Intelligence</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-white font-mono">Rp 149.000</span>
                  <span className="text-xs text-[#686477]"> / bulan</span>
                </div>
                <ul className="space-y-3 text-xs text-[#e2dfeb]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Semua fitur paket Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span><strong>Unlimited AI Gemini Query & Advisor</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Kalkulator Fair Value DCF & Graham Number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Backtest Strategi Kuantitatif 5 Tahun</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>Alert Harga & Katalis Real-time</span>
                  </li>
                </ul>
              </div>
              <Link 
                href="/login"
                className="mt-8 w-full py-3 bg-[#ccff00] text-black hover:bg-[#b8e600] text-center rounded-xl text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] cursor-pointer"
              >
                Mulai Pro 14 Hari Trial
              </Link>
            </div>

            {/* Tier 3: Institutional Quant */}
            <div className="p-6 bg-[#111018] border border-[#1b1926] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-[#00f0ff] uppercase mb-1">INSTITUTIONAL</div>
                <h3 className="text-xl font-bold text-white">Quant & API</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-white font-mono">Rp 499.000</span>
                  <span className="text-xs text-[#686477]"> / bulan</span>
                </div>
                <ul className="space-y-3 text-xs text-[#9f9bac]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>Semua fitur Pro Trader</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>Walk-Forward Strategy Optimizer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>API Export Data & Signal Webhooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>Prioritas Server & Support VIP</span>
                  </li>
                </ul>
              </div>
              <Link 
                href="/login"
                className="mt-8 w-full py-3 bg-[#1b1926] hover:bg-[#262436] text-white text-center rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hubungi Penjualan
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (SEO OPTIMIZED) */}
      <section id="faq" className="py-20 border-b border-[#1b1926]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-mono font-bold text-[#ccff00] tracking-widest uppercase mb-2">PERTANYAAN UMUM</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Pertanyaan Sering Diajukan (FAQ)</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-[#111018] border border-[#1b1926] rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 cursor-pointer hover:text-[#ccff00] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#ccff00] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#686477] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#9f9bac] leading-relaxed border-t border-[#1b1926]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 bg-gradient-to-b from-[#0a090f] to-[#060509] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="w-16 h-16 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl flex items-center justify-center text-[#ccff00] mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Siap Tingkatkan Keputusan Investasi Saham Anda?
          </h2>
          <p className="mt-3 text-sm text-[#9f9bac] max-w-xl mx-auto">
            Bergabunglah bersama ribuan investor Indonesia yang telah memanfaatkan analisis kecerdasan buatan & kuantitatif SafeHaven.
          </p>
          <div className="mt-8">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ccff00] text-black font-extrabold text-sm rounded-xl hover:bg-[#b8e600] transition-all shadow-[0_0_35px_rgba(204,255,0,0.3)] cursor-pointer"
            >
              <span>Mulai Buka SafeHaven Cockpit</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER WITH SEO SITE LINKS */}
      <footer className="bg-[#040306] border-t border-[#1b1926] py-12 text-xs text-[#686477]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 flex items-center justify-center">
                <SafeHavenLogo className="w-6 h-6 drop-shadow-[0_0_6px_rgba(244,184,71,0.4)]" />
              </div>
              <span className="text-base font-bold text-white">SafeHaven<span className="text-[#F4B847]">.</span></span>
            </div>
            <p className="text-[#9f9bac] text-xs leading-relaxed max-w-sm">
              SafeHaven adalah platform analisis pasar saham Indonesia (IDX/IHSG) berbasis AI, menyediakan skor fundamental, indikator teknikal, strategi kuantitatif, dan analisis portofolio.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 font-mono text-[11px] uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Market Cockpit</Link></li>
              <li><Link href="/full-chart/IHSG" className="hover:text-white transition-colors">IHSG Chart</Link></li>
              <li><Link href="/analytics" className="hover:text-white transition-colors">Market Analytics</Link></li>
              <li><Link href="/stock-analysis" className="hover:text-white transition-colors">Stock Analysis</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">Market News</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 font-mono text-[11px] uppercase tracking-wider">Quant & Portfolio</h4>
            <ul className="space-y-2">
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio Tracker</Link></li>
              <li><Link href="/backtest" className="hover:text-white transition-colors">Backtest Strategy</Link></li>
              <li><Link href="/universe" className="hover:text-white transition-colors">Universe Builder</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Risk Control (Admin)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 font-mono text-[11px] uppercase tracking-wider">Top Saham IDX</h4>
            <ul className="space-y-2 font-mono">
              <li><Link href="/ticker/BBCA.JK" className="hover:text-[#ccff00] transition-colors">BBCA (Bank BCA)</Link></li>
              <li><Link href="/ticker/BBRI.JK" className="hover:text-[#ccff00] transition-colors">BBRI (Bank BRI)</Link></li>
              <li><Link href="/ticker/TLKM.JK" className="hover:text-[#ccff00] transition-colors">TLKM (Telkom)</Link></li>
              <li><Link href="/ticker/AMMN.JK" className="hover:text-[#ccff00] transition-colors">AMMN (Amman Mineral)</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#1b1926]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SafeHaven System. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Disclaimer: Semua analisis dan konten bersifat edukasi dan sanad keputusan ada pada investor.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
