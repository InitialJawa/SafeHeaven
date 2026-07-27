/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '../stores';
import { Lock, Crown, ArrowRight, UserCheck, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';

export const AuthGuardView: React.FC<{ featureName?: string }> = ({ featureName = 'Fitur Ini' }) => {
  const [, setLocation] = useLocation();
  const { loginDemoUser } = useAppStore();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#0b0a10] border border-[#1b1926] rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-14 h-14 rounded-2xl bg-[#111018] border border-[#ccff00]/30 flex items-center justify-center mx-auto mb-5 text-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.15)]">
          <Lock className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111018] border border-[#ccff00]/20 text-[#ccff00] text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AKSES TERKUNCI</span>
        </div>

        <h2 className="text-xl font-extrabold text-white font-sans tracking-tight mb-2">
          {featureName} Memerlukan Login
        </h2>
        <p className="text-xs text-[#9f9bac] leading-relaxed mb-6 max-w-sm mx-auto">
          Fitur <strong className="text-white">{featureName}</strong> memerlukan akun terdaftar. Mode Demo publik hanya dapat mengakses Market Cockpit, IHSG Chart, Market Analytics, Stock Analysis, dan Market News.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setLocation('/login')}
            className="w-full bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold text-xs py-3.5 px-5 rounded-xl transition-all shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Masuk / Buat Akun Baru</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLocation('/dashboard')}
            className="w-full bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-[#ccff00]" />
            <span>Kembali ke Market Cockpit (Publik)</span>
          </button>

          <button
            onClick={() => setLocation('/landing')}
            className="w-full text-xs text-[#686477] hover:text-white transition-colors py-2 cursor-pointer"
          >
            Kembali ke Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export const PremiumGuardView: React.FC<{ featureName?: string }> = ({ featureName = 'Quant Lab Engine' }) => {
  const [, setLocation] = useLocation();
  const { user, loginDemoUser, upgradeDemoToPremium } = useAppStore();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#0b0a10] border border-[#ccff00]/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ccff00]/20 via-[#111018] to-[#00f0ff]/10 border border-[#ccff00]/40 flex items-center justify-center mx-auto mb-5 text-[#ccff00] shadow-[0_0_25px_rgba(204,255,0,0.2)]">
          <Crown className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-[10px] font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_10px_rgba(204,255,0,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MEMBER PREMIUM ONLY</span>
        </div>

        <h2 className="text-xl font-extrabold text-white font-sans tracking-tight mb-2">
          {featureName} - Khusus Member Premium
        </h2>
        <p className="text-xs text-[#9f9bac] leading-relaxed mb-6 max-w-sm mx-auto">
          Modul kuantitatif ini (Backtest Strategi & Walk Forward Optimizer) khusus diaktifkan untuk akun berstatus Member Premium / Tier Platinum.
        </p>

        <div className="space-y-3">
          {user ? (
            <button
              onClick={upgradeDemoToPremium}
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold text-xs py-3.5 px-5 rounded-xl transition-all shadow-lg shadow-[#ccff00]/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Akun ke Member Premium</span>
            </button>
          ) : (
            <button
              onClick={() => loginDemoUser(true)}
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold text-xs py-3.5 px-5 rounded-xl transition-all shadow-lg shadow-[#ccff00]/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Coba dengan Akun Demo Premium</span>
            </button>
          )}

          <button
            onClick={() => setLocation('/')}
            className="w-full bg-[#171522] hover:bg-[#201d2f] border border-[#2d2943] text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-[#ccff00]" />
            <span>Kembali ke Market Cockpit (Public)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
