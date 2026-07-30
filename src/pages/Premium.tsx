import React, { useState } from 'react';
import { Check, Crown, ArrowRight } from 'lucide-react';
import { useAppStore } from '../stores';
import { toast } from 'sonner';

export const Premium = () => {
  const { user, globalConfig } = useAppStore();
  const isPremium = user?.isPremium || user?.tier === 'Platinum' || user?.role === 'admin';

  // Available plans matching sample image structure
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');

  const handleSubscribe = (planName: string, price: string) => {
    const targetUrl = globalConfig?.saweriaUrl || 'https://saweria.co/SafeHavenAdmin';
    toast.info(`Mengarahkan ke gateway Saweria (${globalConfig?.saweriaMerchantName || 'SafeHaven'}) untuk ${planName} (${price})...`);
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0b0a10] text-white p-6 md:p-10 lg:p-16 flex flex-col items-center justify-start space-y-12">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-extrabold text-[#ccff00] tracking-wider uppercase">
          <Crown className="w-3.5 h-3.5" /> SAFEHAVEN PLATINUM
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Choose your Plan
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
          Discover the perfect plan tailored just for you to unlock AI quantitative analytics & IHSG rebalancing.
        </p>
      </div>

      {/* 3-Column Plan Cards Container (Matching Sample Layout with Project Color Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-md md:max-w-xl lg:max-w-6xl w-full mx-auto items-stretch">

        {/* CARD 1: FREE */}
        <div 
          onClick={() => setSelectedPlanId('free')}
          className={`bg-[#111018] rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between border transition-all duration-300 relative group cursor-pointer ${
            selectedPlanId === 'free' 
              ? 'border-gray-500 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
              : 'border-[#1b1926] hover:border-[#2a273a]'
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl md:text-2xl font-bold text-white">Free</h3>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-6">Billed monthly</p>

            <div className="flex flex-wrap items-baseline gap-1.5 mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white whitespace-nowrap">Rp 0</span>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">/ month</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 min-h-[36px]">
              Ideal for individual users exploring basic IHSG screening & market indicators.
            </p>

            <div className="border-t border-[#1b1926] my-6" />

            {/* Features List */}
            <ul className="space-y-4 mb-8 text-xs md:text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Access to simple features</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>1 user account</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>1 Portofolio & Watchlist</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Basic chat and support</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3.5 px-6 rounded-full bg-[#1b1926] hover:bg-[#252238] border border-[#27243c] text-white font-bold text-xs md:text-sm transition-all text-center"
          >
            {isPremium ? 'Paket Dasar' : 'Get it now'}
          </button>
        </div>

        {/* CARD 2: PRO (FEATURED CENTER CARD WITH ILLUMINATED GRADIENT GLOW) */}
        <div 
          onClick={() => setSelectedPlanId('pro')}
          className={`bg-[#111018] rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between border-2 transition-all duration-300 relative overflow-hidden group cursor-pointer ${
            selectedPlanId === 'pro'
              ? 'border-[#ccff00] shadow-[0_0_40px_rgba(204,255,0,0.2)] lg:-translate-y-2'
              : 'border-[#ccff00]/60 shadow-[0_0_25px_rgba(204,255,0,0.1)] lg:-translate-y-1 hover:border-[#ccff00]'
          }`}
        >
          {/* Top Radial Lime Glow in Card Header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.22),transparent_75%)] pointer-events-none" />

          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-1 relative z-10">
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                Pro
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00] text-[10px] font-black tracking-wider uppercase whitespace-nowrap shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                MOST POPULAR
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-6 relative z-10">Billed 3 Bulan (Rp 90.000)</p>

            <div className="flex flex-wrap items-baseline gap-1.5 mb-2 relative z-10">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white whitespace-nowrap">Rp 30.000</span>
              <span className="text-xs text-[#ccff00] font-bold whitespace-nowrap">/ month</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-6 min-h-[36px] relative z-10">
              Ideal for active traders seeking quantitative backtesting, AI rebalancing, and optimal risk management.
            </p>

            <div className="border-t border-[#ccff00]/20 my-6 relative z-10" />

            {/* Features List */}
            <ul className="space-y-4 mb-8 text-xs md:text-sm text-gray-200 relative z-10">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/20 border border-[#ccff00]/50 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-semibold text-white">Access to all features</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/20 border border-[#ccff00]/50 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Quant Lab Backtest Engine</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/20 border border-[#ccff00]/50 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>AI Portfolio Optimizer & Regime Radar</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/20 border border-[#ccff00]/50 flex items-center justify-center shrink-0 text-[#ccff00]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Priority Saweria fast-track support</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe('Pro (3 Bulan)', 'Rp 90.000');
            }}
            className="w-full py-3.5 px-6 rounded-full bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.98] text-black font-extrabold text-xs md:text-sm transition-all text-center shadow-[0_0_25px_rgba(204,255,0,0.35)] flex items-center justify-center gap-2 relative z-10"
          >
            Get it now <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* CARD 3: PREMIUM / VIP */}
        <div 
          onClick={() => setSelectedPlanId('premium')}
          className={`bg-[#111018] rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
            selectedPlanId === 'premium'
              ? 'border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.15)]'
              : 'border-[#1b1926] hover:border-[#00f0ff]/50'
          }`}
        >
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
              <h3 className="text-xl md:text-2xl font-bold text-white">Premium</h3>
              <span className="px-2.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-black tracking-wider uppercase whitespace-nowrap">
                BEST VALUE
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-6">Billed annually (Rp 250.000 / 12 bln)</p>

            <div className="flex flex-wrap items-baseline gap-1.5 mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white whitespace-nowrap">Rp 20.800</span>
              <span className="text-xs text-[#00f0ff] font-bold whitespace-nowrap">/ month</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 min-h-[36px]">
              Best choice for serious investors, traders, and institutional quantitative analysis.
            </p>

            <div className="border-t border-[#1b1926] my-6" />

            {/* Features List */}
            <ul className="space-y-4 mb-8 text-xs md:text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 text-[#00f0ff]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-semibold text-white">Access to all features</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 text-[#00f0ff]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Full Walk Forward & Monte Carlo Lab</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 text-[#00f0ff]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Unlimited custom strategy IDE & Vault</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 text-[#00f0ff]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Priority 24/7 VIP chat and support</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSubscribe('Premium (12 Bulan)', 'Rp 250.000');
            }}
            className="w-full py-3.5 px-6 rounded-full bg-[#1b1926] hover:bg-[#252238] border border-[#27243c] hover:border-[#00f0ff]/50 text-white font-bold text-xs md:text-sm transition-all text-center flex items-center justify-center gap-2"
          >
            Get it now <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

      </div>

    </div>
  );
};

