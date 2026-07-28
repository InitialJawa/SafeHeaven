const fs = require('fs');
let code = fs.readFileSync('src/components/RegimeTreemap.tsx', 'utf8');

// I will completely rewrite RegimeTreemap.tsx to match the new styling paradigm.

const newContent = `import React from 'react';
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
        bgColor: 'bg-[#1ae88e]', // Neon Green
        textColor: 'text-black',
        icon: <Activity className="w-5 h-5 text-black" />,
        glowColor: 'rgba(26, 232, 142, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else if (norm.includes('bull')) {
      return {
        bgColor: 'bg-[#00f0ff]', // Cyan
        textColor: 'text-black',
        icon: <TrendingUp className="w-4 h-4 text-black" />,
        glowColor: 'rgba(0, 240, 255, 0.15)',
        badgeBg: 'bg-black/10',
        badgeText: 'text-black/80',
      };
    } else if (norm.includes('volatile')) {
      return {
        bgColor: 'bg-[#ff5e3a]', // Sunset Orange
        textColor: 'text-white',
        icon: <RefreshCw className="w-4 h-4 text-white" />,
        glowColor: 'rgba(255, 94, 58, 0.15)',
        badgeBg: 'bg-white/20',
        badgeText: 'text-white/90',
      };
    } else { // Bear
      return {
        bgColor: 'bg-[#a100ff]', // Electric Violet
        textColor: 'text-white',
        icon: <TrendingDown className="w-4 h-4 text-white" />,
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
      <div className="flex flex-col gap-3 flex-1 h-[290px]">
        
        {/* Left Column (Main/Dominant Regime) and Right Column */}
        <div className="flex gap-3 h-full">
          {/* Left Column (Main/Dominant Regime) */}
          {leftItem && (
            <div className="flex flex-col flex-1 h-full">
              {(() => {
                const style = getRegimeStyle(leftItem.name);
                return (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ boxShadow: \`0 10px 20px \${style.glowColor}\` }}
                    className={\`flex-1 \${style.bgColor} \${style.textColor} p-5 rounded-3xl flex flex-col justify-between cursor-pointer relative overflow-hidden\`}
                  >
                    <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
                    
                    <div className="flex items-center gap-2 opacity-90 relative z-10">
                      <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center">
                        {style.icon}
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase font-sans">{leftItem.name}</span>
                    </div>

                    <div className="space-y-1 mt-auto relative z-10">
                      <div className="text-5xl font-black tracking-tighter leading-none font-sans">
                        {leftItem.value}%
                      </div>
                      <span className={\`inline-block px-2 py-0.5 text-[10px] font-bold rounded-lg \${style.badgeBg} \${style.badgeText} border border-black/5 mt-1\`}>
                        DOMINAN
                      </span>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          )}

          {/* Right Column (Stacked smaller regimes) */}
          <div className="flex flex-col gap-3 flex-[1.2] h-full justify-between">
            {rightItems.map((item, idx) => {
              const style = getRegimeStyle(item.name);
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ boxShadow: \`0 8px 16px \${style.glowColor}\` }}
                  className={\`flex-1 \${style.bgColor} \${style.textColor} p-4 rounded-3xl flex flex-col justify-between cursor-pointer relative overflow-hidden\`}
                >
                  <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'}}></div>
                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-sans truncate max-w-[80px]">{item.name}</span>
                    <div className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center">
                      {style.icon}
                    </div>
                  </div>
                  
                  <div className="text-3xl font-black tracking-tighter leading-none font-sans mt-auto relative z-10">
                    {item.value}%
                  </div>
                </motion.div>
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
`;
fs.writeFileSync('src/components/RegimeTreemap.tsx', newContent);
