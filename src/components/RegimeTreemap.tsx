import React from 'react';
import { motion } from 'motion/react';
import { Layers, Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface RegimeItem {
  name: string;
  value: number;
}

interface RegimeTreemapProps {
  distribution: RegimeItem[];
}

interface RegimeCardProps {
  name: string;
  percentage: number;
  bgColor: string;
  textColor: string;
  glowColor: string;
  icon: React.ReactNode;
  badgeBg?: string;
  badgeText?: string;
  isDominant?: boolean;
}

const RegimeCard: React.FC<RegimeCardProps> = ({
  name,
  percentage,
  bgColor,
  textColor,
  glowColor,
  icon,
  badgeBg = 'bg-black/10',
  badgeText = 'text-black/80',
  isDominant = false
}) => {
  const isLarge = percentage >= 35;
  const isMedium = percentage >= 15 && percentage < 35;
  const isSmall = percentage > 0 && percentage < 15;
  const isZero = percentage === 0;

  const iconBg = textColor.includes('text-black') ? 'bg-black/10' : 'bg-white/10';

  if (isZero) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ 
          boxShadow: `0 4px 10px ${glowColor}` 
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
          boxShadow: `0 6px 12px ${glowColor}` 
        }}
        className={`w-full h-full ${bgColor} ${textColor} p-1.5 px-2 rounded-xl flex items-center justify-between cursor-pointer relative overflow-hidden min-h-0`}
      >
        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
        
        {/* Left: Icon & Name */}
        <div className="flex items-center gap-1 min-w-0 z-10">
          <div className={`w-4 h-4 rounded bg-white/10 flex items-center justify-center shrink-0 [&_svg]:w-2.5 [&_svg]:h-2.5 text-[8px]`}>
            {icon}
          </div>
          <span className="text-[8px] font-extrabold tracking-widest uppercase font-sans truncate leading-none">{name}</span>
        </div>

        {/* Right: Percentage */}
        <div className="flex items-center gap-1 z-10 shrink-0">
          <span className="text-xs font-black tracking-tighter leading-none font-sans">
            {percentage}%
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
          boxShadow: `0 8px 16px ${glowColor}` 
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
        </div>

        {/* Bottom: Value */}
        <div className="mt-auto relative z-10">
          <div className="text-lg md:text-xl font-black tracking-tighter leading-none font-sans">
            {percentage}%
          </div>
          {isDominant && (
            <span className="inline-block px-1 py-0.2 text-[7px] font-bold rounded bg-black/15 text-current mt-1">
              DOMINAN
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // Large Layout (percentage >= 35)
  return (
    <motion.div 
      style={{ 
        boxShadow: `0 10px 20px ${glowColor}` 
      }} 
      whileHover={{ scale: 1.02, y: -2 }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }} 
      className={`w-full h-full ${bgColor} ${textColor} p-4 rounded-3xl flex flex-col justify-between cursor-pointer min-w-0 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
      
      <div className="flex items-center justify-between w-full opacity-90 shrink-0 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-lg ${iconBg} flex items-center justify-center shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5 text-xs font-bold`}>
            {icon}
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase font-sans truncate">{name}</span>
        </div>
      </div>
      
      <div className="space-y-0.5 mt-auto relative z-10">
        <div className="text-3xl md:text-4xl font-black tracking-tighter leading-none font-sans">
          {percentage}%
        </div>
        {isDominant && (
          <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold rounded-lg ${badgeBg} ${badgeText} border border-black/5 mt-1`}>
            DOMINAN
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const RegimeTreemap: React.FC<RegimeTreemapProps> = ({ distribution }) => {
  // Map design color schemes to names
  const getRegimeStyle = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('normal') || norm.includes('sideways')) {
      return {
        bgColor: 'bg-[#1ae88e]', // Neon Green
        textColor: 'text-black',
        icon: <Activity />,
        glowColor: 'rgba(26, 232, 142, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else if (norm.includes('bull')) {
      return {
        bgColor: 'bg-[#00f0ff]', // Cyan
        textColor: 'text-black',
        icon: <TrendingUp />,
        glowColor: 'rgba(0, 240, 255, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else if (norm.includes('volatile')) {
      return {
        bgColor: 'bg-[#ff5e3a]', // Sunset Orange
        textColor: 'text-black',
        icon: <RefreshCw />,
        glowColor: 'rgba(255, 94, 58, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else { // Bear
      return {
        bgColor: 'bg-[#a100ff]', // Electric Violet
        textColor: 'text-white',
        icon: <TrendingDown />,
        glowColor: 'rgba(161, 0, 255, 0.15)',
        badgeBg: 'bg-white/20',
        badgeText: 'text-white/90',
      };
    }
  };

  // Sort distribution descending so the highest is always the prominent one on the left
  const sortedDistribution = [...distribution].sort((a, b) => b.value - a.value);

  // Split into left (largest item) and right (remaining items)
  const leftItem = sortedDistribution[0];
  const rightItems = sortedDistribution.slice(1);

  // Calculate dynamic flex factors based on values
  const leftColFlex = Math.max(leftItem?.value || 40, 35);
  const rightColFlex = Math.max(100 - leftColFlex, 35);

  return (
    <div id="regime-treemap-card" className="card card-elevated p-6 lg:col-span-3 flex flex-col justify-between h-full min-h-[420px] bg-[#0b0a10]/45">
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#686477] tracking-widest uppercase font-sans">
            Sebaran Durasi
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight leading-none font-mono text-shadow-glow">
            Regime Pasar
          </h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477]">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      {/* Grid Layout copying the exact pattern of the sample image */}
      <div className="flex flex-col gap-3 flex-1 h-[290px] min-h-0">
        
        {/* Left Column (Main/Dominant Regime) and Right Column */}
        <div className="flex gap-3 min-h-0 h-full w-full">
          {/* Left Column (Main/Dominant Regime) */}
          {leftItem && (
            <div style={{ flex: `${leftColFlex} ${leftColFlex} 0%` }} className="min-w-0 min-h-0 h-full w-full">
              {(() => {
                const style = getRegimeStyle(leftItem.name);
                return (
                  <RegimeCard
                    name={leftItem.name}
                    percentage={leftItem.value}
                    bgColor={style.bgColor}
                    textColor={style.textColor}
                    glowColor={style.glowColor}
                    icon={style.icon}
                    badgeBg={style.badgeBg}
                    badgeText={style.badgeText}
                    isDominant={true}
                  />
                );
              })()}
            </div>
          )}

          {/* Right Column (Stacked smaller regimes) */}
          <div style={{ flex: `${rightColFlex} ${rightColFlex} 0%` }} className="flex flex-col gap-3 min-w-0 min-h-0 h-full w-full">
            {rightItems.map((item) => {
              const style = getRegimeStyle(item.name);
              return (
                <div key={item.name} style={{ flex: '1 1 0%' }} className="min-w-0 min-h-0 w-full">
                  <RegimeCard
                    name={item.name}
                    percentage={item.value}
                    bgColor={style.bgColor}
                    textColor={style.textColor}
                    glowColor={style.glowColor}
                    icon={style.icon}
                    badgeBg={style.badgeBg}
                    badgeText={style.badgeText}
                    isDominant={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1b1926]/40 flex flex-col items-center">
        <div className="flex items-center gap-2 text-[8px] text-[#686477] font-mono uppercase tracking-[0.1em]">
          SafeHeaven Regime Engine Active
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
