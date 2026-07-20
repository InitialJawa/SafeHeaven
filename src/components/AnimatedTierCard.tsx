import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../stores';

interface AnimatedTierCardProps {
  compact?: boolean;
  iconOnly?: boolean;
}

// Interactive 3D-like faceted gemstone and wing badges using premium vector shapes
const TierGemBadge: React.FC<{ tier: string; size?: number }> = ({ tier, size = 70 }) => {
  // Setup color palettes based on the user's XiaoHongShu rank card image
  const getColors = () => {
    switch (tier) {
      case 'Platinum': // Matches V5 style (Gold frame with purple diamond)
        return {
          frameOuter: 'url(#gold-grad)',
          frameInner: '#d97706',
          gemPrimary: '#c084fc',
          gemLight: '#f3e8ff',
          gemDark: '#701a75',
          gemAccent: '#e9d5ff',
          glow: 'rgba(217, 119, 6, 0.4)',
        };
      case 'Emas': // Matches V3 style (Gold frame with royal blue diamond)
        return {
          frameOuter: 'url(#bronze-grad)',
          frameInner: '#b45309',
          gemPrimary: '#3b82f6',
          gemLight: '#dbeafe',
          gemDark: '#1e3a8a',
          gemAccent: '#60a5fa',
          glow: 'rgba(245, 158, 11, 0.4)',
        };
      case 'Perak': // Matches V2 style (Silver frame with pinkish/purple diamond)
        return {
          frameOuter: 'url(#silver-grad)',
          frameInner: '#475569',
          gemPrimary: '#ec4899',
          gemLight: '#fce7f3',
          gemDark: '#831843',
          gemAccent: '#f472b6',
          glow: 'rgba(148, 163, 184, 0.4)',
        };
      default: // Matches V1 style (Teal/Mint frame with ice cyan diamond)
        return {
          frameOuter: 'url(#teal-grad)',
          frameInner: '#0f766e',
          gemPrimary: '#14b8a6',
          gemLight: '#ccfbf1',
          gemDark: '#115e59',
          gemAccent: '#2dd4bf',
          glow: 'rgba(20, 184, 166, 0.4)',
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      animate={{
        y: [0, -5, 0],
        rotate: [0, 2, -2, 0],
        filter: [
          `drop-shadow(0 4px 10px ${colors.glow})`,
          `drop-shadow(0 12px 25px ${colors.glow})`,
          `drop-shadow(0 4px 10px ${colors.glow})`
        ]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Bronze/Gold Warm Gradient */}
          <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Silver Gradient */}
          <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Teal/Mint Gradient */}
          <linearGradient id="teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ccfbf1" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>

        {/* Outer Laurel Wings (底衬 Winged Base from sample image) */}
        <g className="wings">
          {/* Left Wing */}
          <path
            d="M50 35 C35 32, 22 42, 18 55 C15 65, 20 78, 32 85 C30 75, 34 62, 42 55 C46 51, 50 48, 50 35 Z"
            fill={colors.frameOuter}
          />
          <path
            d="M48 45 C38 43, 28 50, 25 58 C23 65, 27 72, 34 76 C33 69, 36 61, 42 56 Z"
            fill={colors.frameInner}
            opacity="0.8"
          />

          {/* Right Wing */}
          <path
            d="M70 35 C85 32, 98 42, 102 55 C105 65, 100 78, 88 85 C90 75, 86 62, 78 55 C74 51, 70 48, 70 35 Z"
            fill={colors.frameOuter}
          />
          <path
            d="M72 45 C82 43, 92 50, 95 58 C97 65, 93 72, 86 76 C87 69, 84 61, 78 56 Z"
            fill={colors.frameInner}
            opacity="0.8"
          />

          {/* Wing Feathers / Accent Steps */}
          <path d="M12 52 L26 58 L18 64 Z" fill={colors.frameOuter} />
          <path d="M108 52 L94 58 L102 64 Z" fill={colors.frameOuter} />
        </g>

        {/* Golden Crown/Bracket Header (顶端皇冠) */}
        <path
          d="M45 28 L60 16 L75 28 L68 35 L52 35 Z"
          fill={colors.frameOuter}
        />
        <polygon points="54,32 60,22 66,32" fill={colors.frameInner} />

        {/* Outer Shield Ring / Base Support Frame (支撑底座) */}
        <polygon points="38,82 60,105 82,82 60,88" fill={colors.frameOuter} />
        <circle cx="60" cy="60" r="32" fill="#0c0a12" stroke={colors.frameOuter} strokeWidth="4" />
        <circle cx="60" cy="60" r="28" fill="#181524" stroke={colors.frameInner} strokeWidth="2" />

        {/* Gorgeous Faceted Gemstone (💎 Highly glossy 3D look diamond) */}
        <g className="gem">
          {/* Top-Left Facet */}
          <polygon points="60,34 40,50 60,60" fill={colors.gemPrimary} />
          {/* Top-Right Facet */}
          <polygon points="60,34 80,50 60,60" fill={colors.gemAccent} />
          {/* Bottom-Left Facet */}
          <polygon points="40,50 60,86 60,60" fill={colors.gemDark} />
          {/* Bottom-Right Facet */}
          <polygon points="80,50 60,86 60,60" fill={colors.gemPrimary} />

          {/* Top Crown Facet (Highlight) */}
          <polygon points="60,34 50,42 60,45" fill={colors.gemLight} opacity="0.9" />
          <polygon points="60,34 70,42 60,45" fill={colors.gemLight} opacity="0.6" />

          {/* Center Facet Core Star Reflection */}
          <polygon points="60,50 55,60 60,63" fill={colors.gemLight} opacity="0.9" />
          <polygon points="60,50 65,60 60,63" fill="#ffffff" />
        </g>

        {/* Sparkle Flares around the gem */}
        <g className="sparkles" opacity="0.8">
          <circle cx="34" cy="40" r="1.5" fill="#ffffff" />
          <circle cx="86" cy="40" r="1.5" fill="#ffffff" />
          <circle cx="60" cy="24" r="2" fill="#ffffff" />
        </g>
      </svg>

      {/* Dynamic Core Glow Ring behind badge */}
      <div 
        className="absolute w-12 h-12 rounded-full blur-xl -z-10 opacity-60 mix-blend-screen pointer-events-none"
        style={{ backgroundColor: colors.gemPrimary }}
      />
    </motion.div>
  );
};

export const AnimatedTierCard: React.FC<AnimatedTierCardProps> = ({ compact = false, iconOnly = false }) => {
  const { tier, tierProgress } = useAppStore();

  // Tier design matching the detailed, glassy layouts in the provided image
  const getTierLayoutConfig = (t: string) => {
    switch (t) {
      case 'Platinum':
        return {
          rankLabel: 'V5',
          title: 'Platinum VIP',
          bgGradient: 'from-[#2e1c4e]/90 via-[#120d24]/95 to-[#0b0615]/98',
          borderColor: 'border-[#ca8a04]/45', // Gold frame border style
          titleColor: 'text-[#eab308]',
          textColor: 'text-purple-200',
          barColor: 'bg-gradient-to-r from-[#d97706] to-[#c084fc]',
          currentPoints: '18.900',
          targetPoints: '20.000',
          benefitDesc: 'Pertahanan portofolio maksimum & Sinyal Prioritas',
          glowEffect: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]',
        };
      case 'Emas':
        return {
          rankLabel: 'V3',
          title: 'Emas Premium',
          bgGradient: 'from-[#3c2a18]/90 via-[#17120e]/95 to-[#0c0a08]/98',
          borderColor: 'border-[#f97316]/40', // Amber/Bronze frame border style
          titleColor: 'text-amber-400',
          textColor: 'text-amber-100/90',
          barColor: 'bg-gradient-to-r from-[#b45309] to-[#3b82f6]',
          currentPoints: '12.500',
          targetPoints: '15.000',
          benefitDesc: 'Keuntungan bursa VIP aktif & Autopilot On',
          glowEffect: 'shadow-[0_0_20px_rgba(249,115,22,0.12)]',
        };
      case 'Perak':
        return {
          rankLabel: 'V2',
          title: 'Perak Executive',
          bgGradient: 'from-[#1e2538]/90 via-[#0f121a]/95 to-[#08090d]/98',
          borderColor: 'border-[#94a3b8]/40', // Silver frame border style
          titleColor: 'text-slate-300',
          textColor: 'text-slate-100/90',
          barColor: 'bg-gradient-to-r from-[#475569] to-[#ec4899]',
          currentPoints: '4.800',
          targetPoints: '5.000',
          benefitDesc: 'Akses instan & Scoring bursa kualitatif',
          glowEffect: 'shadow-[0_0_15px_rgba(148,163,184,0.1)]',
        };
      default:
        return {
          rankLabel: 'V1',
          title: 'Perunggu Member',
          bgGradient: 'from-[#112423]/90 via-[#0a1313]/95 to-[#050909]/98',
          borderColor: 'border-[#14b8a6]/30', // Mint frame border style
          titleColor: 'text-teal-400',
          textColor: 'text-teal-100/90',
          barColor: 'bg-gradient-to-r from-[#0f766e] to-[#14b8a6]',
          currentPoints: '900',
          targetPoints: '1.000',
          benefitDesc: 'Layanan standar bursa aktif & Analitis dasar',
          glowEffect: 'shadow-none',
        };
    }
  };

  const layout = getTierLayoutConfig(tier);

  // Icon only mode for collapsed sidebar
  if (iconOnly) {
    return (
      <div className="flex flex-col items-center justify-center py-2" title={layout.title}>
        <TierGemBadge tier={tier} size={42} />
      </div>
    );
  }

  // Compact badge for small bars/headers
  if (compact) {
    return (
      <motion.div
        id="compact-tier-badge"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border ${layout.borderColor} bg-gradient-to-r ${layout.bgGradient} ${layout.glowEffect} backdrop-blur-md`}
      >
        <TierGemBadge tier={tier} size={26} />
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-extrabold tracking-wide uppercase font-sans text-white leading-none">
            {layout.title}
          </span>
        </div>
      </motion.div>
    );
  }

  // Calculate clean percentage progress
  const percentage = Math.min(100, Math.max(15, (tierProgress.current / Math.max(1, tierProgress.next)) * 100));

  return (
    <motion.div
      id="tier-interactive-card-styled"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="px-3"
    >
      <div className="text-[10px] font-extrabold text-[#686477] tracking-widest font-mono uppercase mb-2 px-1 flex items-center justify-between">
        <span>TIER PENGGUNA</span>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-1 text-[8px] text-[#ccff00]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
          VIP STATUS
        </motion.span>
      </div>

      {/* Styled Card (exactly mirroring the glossy layered design of the sample image) */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`relative p-4 rounded-2xl border-2 ${layout.borderColor} bg-gradient-to-r ${layout.bgGradient} overflow-visible ${layout.glowEffect} flex items-center justify-between gap-3 group`}
      >
        {/* Background highlight pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none rounded-2xl" />

        <div className="space-y-3 z-10 flex-1 pr-1">
          {/* Rank Number & Title row */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className={`text-sm font-extrabold tracking-wide ${layout.titleColor}`}>
                {layout.title}
              </span>
            </div>
            <p className="text-[9px] text-[#9f9bac] leading-snug max-w-[150px] font-medium">
              Target pertumbuhan mencapai {layout.targetPoints} Poin
            </p>
          </div>

          {/* high fidelity custom progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[8px] font-mono text-[#686477]">
              <span>Aktif: {layout.currentPoints} Pts</span>
              <span className="text-[#ccff00] font-bold">{Math.round(percentage)}%</span>
            </div>
            <div className="relative w-full h-2 bg-[#0c0a12] border border-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`h-full ${layout.barColor} rounded-full`}
              />
            </div>
            <p className="text-[8px] text-[#686477] leading-none pt-0.5 font-sans italic">
              {layout.benefitDesc}
            </p>
          </div>
        </div>

        {/* Big protruding, highly interactive SVG Rank badge aligned to the right */}
        <div className="relative shrink-0 -mr-1.5 -my-4 z-20">
          <TierGemBadge tier={tier} size={84} />
        </div>
      </motion.div>
    </motion.div>
  );
};
