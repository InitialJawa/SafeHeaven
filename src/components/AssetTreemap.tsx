import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Landmark, ShieldAlert, Award, PieChart, Coins, LineChart, DollarSign } from 'lucide-react';
import { useAppStore } from '../stores';

interface AssetTreemapProps {
  capital?: number;
  style?: React.CSSProperties;
}

interface TreemapCardProps {
  name: string;
  percentage: number;
  change: string;
  bgColor: string;
  textColor: string;
  shadowColor: string;
  icon: React.ReactNode;
  subtitle: string;
}

const TreemapCard: React.FC<TreemapCardProps> = ({
  name,
  percentage,
  change,
  bgColor,
  textColor,
  shadowColor,
  icon,
  subtitle
}) => {
  // Determine layout archetype based on percentage
  const isLarge = percentage >= 35;
  const isMedium = percentage >= 15 && percentage < 35;
  const isSmall = percentage > 0 && percentage < 15;
  const isZero = percentage === 0;

  // Adaptive backgrounds for the icon container
  const iconBg = textColor.includes('text-black') ? 'bg-black/10' : 'bg-white/10';

  if (isZero) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ 
          boxShadow: `0 4px 10px ${shadowColor}` 
        }}
        className={`w-full h-full ${bgColor} ${textColor} p-1.5 px-2 rounded-xl flex items-center justify-between cursor-pointer relative overflow-hidden min-h-0`}
      >
        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.08) 100%)'}}></div>
        
        {/* Left: Icon & Name */}
        <div className="flex items-center gap-1 min-w-0 z-10">
          <div className={`w-4 h-4 rounded bg-black/10 flex items-center justify-center shrink-0 [&_svg]:w-2.5 [&_svg]:h-2.5 text-[8px]`}>
            {icon}
          </div>
          <span className="text-[8px] font-extrabold tracking-wider uppercase font-sans truncate">{name}</span>
        </div>

        {/* Right: Percentage */}
        <div className="flex items-center gap-1 z-10 shrink-0">
          <span className="text-xs font-black tracking-tight leading-none font-sans">
            0%
          </span>
        </div>
      </motion.div>
    );
  }

  if (isSmall) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ 
          boxShadow: `0 6px 12px ${shadowColor}` 
        }}
        className={`w-full h-full ${bgColor} ${textColor} p-2 rounded-2xl flex flex-col justify-between cursor-pointer relative overflow-hidden min-h-0`}
      >
        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
        
        {/* Header */}
        <div className="flex justify-between items-center z-10 gap-1 w-full shrink-0">
          <div className="flex items-center gap-1 min-w-0">
            <div className={`w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0 [&_svg]:w-2.5 [&_svg]:h-2.5 text-[8px]`}>
              {icon}
            </div>
            <span className="text-[8px] font-extrabold tracking-wider uppercase font-sans truncate leading-none">{name}</span>
          </div>
          <span className="px-1 py-0.2 text-[7px] font-bold rounded bg-black/15 text-current shrink-0 truncate max-w-[40px]">
            {change}
          </span>
        </div>

        {/* Value and Subtitle */}
        <div className="mt-auto relative z-10 flex items-baseline justify-between w-full min-w-0 gap-1">
          <span className="text-xs md:text-sm font-black tracking-tighter leading-none font-sans shrink-0">
            {percentage}%
          </span>
          <span className="text-[7px] font-mono opacity-60 truncate leading-none uppercase tracking-wide">
            {subtitle}
          </span>
        </div>
      </motion.div>
    );
  }

  if (isMedium) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ 
          boxShadow: `0 8px 16px ${shadowColor}` 
        }}
        className={`w-full h-full ${bgColor} ${textColor} p-3 rounded-2xl flex flex-col justify-between cursor-pointer relative overflow-hidden min-h-0`}
      >
        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
        
        {/* Top: Header */}
        <div className="flex justify-between items-start relative z-10 gap-1.5 shrink-0 w-full">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`w-5 h-5 rounded-md ${iconBg} flex items-center justify-center shrink-0 [&_svg]:w-3 [&_svg]:h-3 text-[10px] font-bold`}>
              {icon}
            </div>
            <span className="text-[9px] font-bold tracking-widest uppercase font-sans truncate">{name}</span>
          </div>
          <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-black/15 text-current shrink-0 truncate max-w-[45px]">
            {change}
          </span>
        </div>

        {/* Bottom: Value */}
        <div className="mt-auto relative z-10">
          <div className="text-xl font-black tracking-tighter leading-none font-sans">
            {percentage}%
          </div>
          <p className="text-[8px] font-extrabold opacity-75 font-mono uppercase tracking-wider mt-0.5 truncate">
            {subtitle}
          </p>
        </div>
      </motion.div>
    );
  }

  // Large Layout (percentage >= 35)
  return (
    <motion.div 
      style={{ 
        boxShadow: `0 10px 20px ${shadowColor}` 
      }} 
      whileHover={{ scale: 1.02, y: -2 }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }} 
      className={`w-full h-full ${bgColor} ${textColor} p-4 rounded-3xl flex flex-col justify-between cursor-pointer min-w-0 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
      
      <div className="flex items-center justify-between w-full opacity-90 shrink-0 relative z-10 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-lg ${iconBg} flex items-center justify-center shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5 text-xs font-bold`}>
            {icon}
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase font-sans truncate">{name}</span>
        </div>
        <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold rounded-lg bg-black/10 text-current border border-black/5 shrink-0">
          {change}
        </span>
      </div>
      
      <div className="space-y-0.5 mt-auto relative z-10">
        <div className="text-3xl md:text-4xl font-black tracking-tighter leading-none font-sans">
          {percentage}%
        </div>
        <p className="text-[9px] md:text-xs font-extrabold opacity-75 font-mono tracking-wider uppercase truncate">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export const AssetTreemap: React.FC<AssetTreemapProps> = ({ capital = 500000000, style }) => {
  const { portfolioConfig, marketRegime } = useAppStore();

  const activeCapital = portfolioConfig?.capital || capital;
  
  // Format to IDR
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
  };

  // Convert to USD equivalent
  const formatUSDVal = (val: number) => {
    const usdEquivalent = val / 15000; // standard mock exchange rate used in dashboard
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usdEquivalent);
  };

  // 5 Asset classes to match the 5 blocks in the user's sample image

  // Dynamic regime based on Multi-Tier Rotation (Saham AVOID, Emas REKOMENDASI if bear, else vice-versa)
  const isEmasRegime = marketRegime === 'bear';

  const assets = {
    emas: {
      name: 'EMAS',
      percentage: isEmasRegime ? 70 : 20,
      val: activeCapital * (isEmasRegime ? 70 : 20) / 100,
      change: isEmasRegime ? '+8.50%' : '+1.50%',
      bgColor: 'bg-[#ffc145]',
      textColor: 'text-black',
      shadowColor: 'rgba(255,193,69,0.15)',
      icon: <DollarSign />
    },
    usd: {
      name: 'USD CASH',
      percentage: isEmasRegime ? 15 : 10,
      val: activeCapital * (isEmasRegime ? 15 : 10) / 100,
      change: '+0.25%',
      bgColor: 'bg-[#5c5e66]',
      textColor: 'text-white',
      shadowColor: 'rgba(0,0,0,0.15)',
      icon: <span className="font-bold">$</span>
    },
    idr: {
      name: 'CASH IDR',
      percentage: isEmasRegime ? 15 : 10,
      val: activeCapital * (isEmasRegime ? 15 : 10) / 100,
      change: '0.00%',
      bgColor: 'bg-[#a100ff]',
      textColor: 'text-white',
      shadowColor: 'rgba(161,0,255,0.15)',
      icon: <Landmark />
    },
    saham: {
      name: 'SAHAM',
      percentage: isEmasRegime ? 0 : 60,
      val: activeCapital * (isEmasRegime ? 0 : 60) / 100,
      change: isEmasRegime ? '-2.4%' : '+4.82%',
      bgColor: 'bg-[#1ae88e]',
      textColor: 'text-black',
      shadowColor: 'rgba(26,232,142,0.15)',
      icon: <LineChart />
    },
    hedging: {
      name: 'HEDGING',
      percentage: 0, 
      val: 0,
      change: '+12.4%',
      bgColor: 'bg-[#ff5e3a]',
      textColor: 'text-white',
      shadowColor: 'rgba(255,94,58,0.15)',
      icon: <ShieldAlert />
    }
  };

  // Calculate dynamic flex factors based on asset allocations
  const pctEmas = assets.emas.percentage;
  const pctUsd = assets.usd.percentage;
  const pctIdr = assets.idr.percentage;
  const pctSaham = assets.saham.percentage;
  const pctHedging = assets.hedging.percentage;

  // Define small minimum boundaries so that sizes scale more dramatically with the percentages
  const minVal = 8; // small minimum weight to ensure card remains visible but small
  
  const weightEmas = Math.max(pctEmas, minVal);
  const weightUsd = Math.max(pctUsd, minVal);
  const weightIdr = Math.max(pctIdr, minVal);
  const weightSaham = Math.max(pctSaham, minVal);
  const weightHedging = Math.max(pctHedging, minVal - 2); // Hedging is usually 0%, make it even smaller (6)

  // Total height weights for rows
  const topRowFlex = weightEmas + weightUsd + weightIdr;
  const bottomRowFlex = weightSaham + weightHedging;

  // Horizontal distribution inside top row
  const emasFlex = weightEmas;
  const cashColFlex = weightUsd + weightIdr;

  // Vertical distribution in Cash column
  const usdFlex = weightUsd;
  const idrFlex = weightIdr;

  // Horizontal distribution inside bottom row
  const sahamFlex = weightSaham;
  const hedgingFlex = weightHedging;

  return (
    <div id="asset-treemap-container" style={style} className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between h-full min-h-[420px]">
      
      {/* Header section matching 'Income' title styling from the sample image */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#686477] tracking-widest uppercase font-sans">
            Alokasi Aset (Dinamis)
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight leading-none font-sans text-shadow-glow mt-1">
            {portfolioConfig?.strategyName || 'IMAM NASRULLOH'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold text-[#1ae88e] flex items-center gap-0.5 bg-[#1ae88e]/10 px-1.5 py-0.5 rounded">
              ↑ 4.82% Bula Ini
            </span>
            <span className="text-[9px] text-[#686477] font-mono tracking-wider uppercase font-extrabold">
              Autopilot Rebalance Aktif
            </span>
          </div>
        </div>
        
        {/* Decorative dynamic badge */}
        <div className="w-8 h-8 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477]">
          <PieChart className="w-4 h-4" />
        </div>
      </div>

      {/* High-fidelity Treemap Grid structure (custom-designed grid mimicking the user's sample image) */}
      <div className="flex flex-col gap-3 flex-1 h-[290px] min-h-0">
        
        {/* Top Row: Emas on left, USD and IDR on right */}
        <div style={{ flex: `${topRowFlex} ${topRowFlex} 0%` }} className="flex gap-3 min-h-0">
          <div style={{ flex: `${emasFlex} ${emasFlex} 0%` }} className="min-w-0 min-h-0 h-full w-full">
            <TreemapCard
              name={assets.emas.name}
              percentage={pctEmas}
              change={assets.emas.change}
              bgColor={assets.emas.bgColor}
              textColor={assets.emas.textColor}
              shadowColor={assets.emas.shadowColor}
              icon={assets.emas.icon}
              subtitle={isEmasRegime ? 'OVERWEIGHT' : 'UNDERWEIGHT (HOLD)'}
            />
          </div>

          {/* Right Column: USD & IDR */}
          <div style={{ flex: `${cashColFlex} ${cashColFlex} 0%` }} className="flex flex-col gap-3 min-w-0 min-h-0 h-full">
            <div style={{ flex: `${usdFlex} ${usdFlex} 0%` }} className="min-w-0 min-h-0 w-full">
              <TreemapCard
                name={assets.usd.name}
                percentage={pctUsd}
                change={assets.usd.change}
                bgColor={assets.usd.bgColor}
                textColor={assets.usd.textColor}
                shadowColor={assets.usd.shadowColor}
                icon={assets.usd.icon}
                subtitle="NEUTRAL"
              />
            </div>

            <div style={{ flex: `${idrFlex} ${idrFlex} 0%` }} className="min-w-0 min-h-0 w-full">
              <TreemapCard
                name={assets.idr.name}
                percentage={pctIdr}
                change={assets.idr.change}
                bgColor={assets.idr.bgColor}
                textColor={assets.idr.textColor}
                shadowColor={assets.idr.shadowColor}
                icon={assets.idr.icon}
                subtitle="NEUTRAL"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Row: Saham and Hedging */}
        <div style={{ flex: `${bottomRowFlex} ${bottomRowFlex} 0%` }} className="flex gap-3 min-h-0">
          <div style={{ flex: `${sahamFlex} ${sahamFlex} 0%` }} className="min-w-0 min-h-0 h-full w-full">
            <TreemapCard
              name={assets.saham.name}
              percentage={pctSaham}
              change={assets.saham.change}
              bgColor={assets.saham.bgColor}
              textColor={assets.saham.textColor}
              shadowColor={assets.saham.shadowColor}
              icon={assets.saham.icon}
              subtitle={isEmasRegime ? 'UNDERWEIGHT (AVOID)' : 'OVERWEIGHT (REKOMENDASI)'}
            />
          </div>

          <div style={{ flex: `${hedgingFlex} ${hedgingFlex} 0%` }} className="min-w-0 min-h-0 h-full w-full">
            <TreemapCard
              name={assets.hedging.name}
              percentage={pctHedging}
              change={assets.hedging.change}
              bgColor={assets.hedging.bgColor}
              textColor={assets.hedging.textColor}
              shadowColor={assets.hedging.shadowColor}
              icon={assets.hedging.icon}
              subtitle="PROTECTED (OFF)"
            />
          </div>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-[#1b1926]/40 flex flex-col items-center">
        <p className="text-[#686477] text-[8px] font-mono uppercase tracking-[0.1em] text-center mb-1">
          Proporsi aset diatur otomatis secara dinamis oleh sinyal Multi-Tier Rotation.
        </p>
        <div className="flex items-center gap-2 text-[8px] text-[#686477] font-mono uppercase tracking-[0.1em]">
          SafeHeaven Tactic Model v1.4
          <span className="inline-block w-0.5 h-0.5 bg-[#686477] rounded-full"></span>
          <span className="flex items-center gap-1 text-[#1ae88e]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ae88e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1ae88e]"></span>
            </span>
            Live data update
          </span>
        </div>
      </div>

    </div>
  );
};
