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

export const RegimeTreemap: React.FC<RegimeTreemapProps> = ({ distribution }) => {
  // Map design color schemes to names
  const getRegimeStyle = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('normal') || norm.includes('sideways')) {
      return {
        bgColor: 'bg-[#1bfb7c]', // Neon Green
        textColor: 'text-black',
        icon: <Activity className="w-3.5 h-3.5 text-black" />,
        glowColor: 'rgba(27, 251, 124, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else if (norm.includes('bull')) {
      return {
        bgColor: 'bg-[#00f0ff]', // Cyan
        textColor: 'text-black',
        icon: <TrendingUp className="w-3.5 h-3.5 text-black" />,
        glowColor: 'rgba(0, 240, 255, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else if (norm.includes('volatile')) {
      return {
        bgColor: 'bg-[#ff5621]', // Sunset Orange
        textColor: 'text-black',
        icon: <RefreshCw className="w-3.5 h-3.5 text-black" />,
        glowColor: 'rgba(255, 86, 33, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else { // Bear
      return {
        bgColor: 'bg-[#9d1df2]', // Electric Violet
        textColor: 'text-white',
        icon: <TrendingDown className="w-3.5 h-3.5 text-white" />,
        glowColor: 'rgba(157, 29, 242, 0.15)',
        badgeBg: 'bg-white/10',
        badgeText: 'text-white/80',
      };
    }
  };

  // Sort distribution descending so the highest is always the prominent one on the left
  const sortedDistribution = [...distribution].sort((a, b) => b.value - a.value);

  // Split into left (largest item) and right (remaining items)
  const leftItem = sortedDistribution[0];
  const rightItems = sortedDistribution.slice(1);

  return (
    <div id="regime-treemap-card" className="card card-elevated p-6 lg:col-span-3 flex flex-col justify-between h-full min-h-[320px] bg-[#0b0a10]/45">
      
      {/* Header Info */}
      <div className="w-full mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white tracking-tight font-sans">Alokasi Regime</h3>
          <Layers className="w-4 h-4 text-[#686477]" />
        </div>
        <p className="text-[11px] text-[#686477] font-sans">Sebaran durasi regime pasar bursa.</p>
      </div>

      {/* Grid Layout copying the exact pattern of the sample image */}
      <div className="grid grid-cols-2 gap-2.5 h-[220px] flex-1">
        
        {/* Left Column (Main/Dominant Regime) */}
        {leftItem && (
          <div className="flex flex-col h-full">
            {(() => {
              const style = getRegimeStyle(leftItem.name);
              return (
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ boxShadow: `0 10px 20px ${style.glowColor}` }}
                  className={`flex-1 ${style.bgColor} ${style.textColor} p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer`}
                >
                  <div className="flex items-center gap-1.5 opacity-90">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      {style.icon}
                    </div>
                    <span className="text-[9px] font-black tracking-wider uppercase font-mono">{leftItem.name}</span>
                  </div>

                  <div className="space-y-0.5 mt-auto">
                    <div className="text-3xl font-black tracking-tighter leading-none font-sans">
                      {leftItem.value}%
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black rounded-md ${style.badgeBg} ${style.badgeText} mt-1.5`}>
                      DOMINAN
                    </span>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}

        {/* Right Column (Stacked smaller regimes) */}
        <div className="flex flex-col gap-2.5 h-full justify-between">
          {rightItems.map((item, idx) => {
            const style = getRegimeStyle(item.name);
            // Calculate a responsive height ratio or distribute equally
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02, y: -1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ boxShadow: `0 4px 10px ${style.glowColor}` }}
                className={`flex-1 ${style.bgColor} ${style.textColor} p-2.5 rounded-xl flex flex-col justify-between cursor-pointer`}
              >
                <div className="flex items-center justify-between opacity-90">
                  <span className="text-[8px] font-black tracking-wider uppercase font-mono truncate max-w-[65px]">{item.name}</span>
                  <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center scale-90">
                    {style.icon}
                  </div>
                </div>

                <div className="text-sm font-black tracking-tighter leading-none font-sans mt-auto">
                  {item.value}%
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      <div className="text-[8px] text-[#686477] font-mono text-center pt-3 mt-3 border-t border-[#1b1926]/40">
        SafeHeaven Regime Engine Active
      </div>

    </div>
  );
};
