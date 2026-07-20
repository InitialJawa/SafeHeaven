import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Landmark, ShieldAlert, Award, PieChart, Coins } from 'lucide-react';
import { useAppStore } from '../stores';

interface AssetTreemapProps {
  capital?: number;
}

export const AssetTreemap: React.FC<AssetTreemapProps> = ({ capital = 500000000 }) => {
  const { portfolioConfig } = useAppStore();

  const activeCapital = portfolioConfig?.capital || capital;
  
  // Format to IDR
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Convert to USD equivalent
  const formatUSDVal = (val: number) => {
    const usdEquivalent = val / 15000; // standard mock exchange rate used in dashboard
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usdEquivalent);
  };

  // 5 Asset classes to match the 5 blocks in the user's sample image
  const assets = [
    {
      id: 'saham',
      name: 'SAHAM',
      percentage: portfolioConfig?.allocationSaham || 60,
      val: activeCapital * (portfolioConfig?.allocationSaham || 60) / 100,
      change: '+4.82%',
      bgColor: 'bg-[#1bfb7c]', // Neon green
      textColor: 'text-black',
      icon: <TrendingUp className="w-3.5 h-3.5 text-black" />
    },
    {
      id: 'emas',
      name: 'EMAS',
      percentage: portfolioConfig?.allocationEmas || 20,
      val: activeCapital * (portfolioConfig?.allocationEmas || 20) / 100,
      change: '+1.50%',
      bgColor: 'bg-[#545863]', // Slate grey
      textColor: 'text-white',
      icon: <Award className="w-3.5 h-3.5 text-white" />
    },
    {
      id: 'usd',
      name: 'USD CASH',
      percentage: portfolioConfig?.allocationUSD || 10,
      val: activeCapital * (portfolioConfig?.allocationUSD || 10) / 100,
      change: '+0.25%',
      bgColor: 'bg-[#ffbe3b]', // Golden yellow
      textColor: 'text-black',
      icon: <Coins className="w-3.5 h-3.5 text-black" />
    },
    {
      id: 'idr',
      name: 'CASH IDR',
      percentage: portfolioConfig?.allocationCash || 10,
      val: activeCapital * (portfolioConfig?.allocationCash || 10) / 100,
      change: '0.00%',
      bgColor: 'bg-[#9d1df2]', // Electric violet
      textColor: 'text-white',
      icon: <Landmark className="w-3.5 h-3.5 text-white" />
    },
    {
      id: 'hedging',
      name: 'HEDGING',
      percentage: 5, // fill to make it 5 elements like the image
      val: activeCapital * 0.05,
      change: '+12.4%',
      bgColor: 'bg-[#ff5621]', // Sunset orange
      textColor: 'text-black',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-black" />
    }
  ];

  return (
    <div id="asset-treemap-container" className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between h-full min-h-[420px]">
      
      {/* Header section matching 'Income' title styling from the sample image */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#686477] tracking-wider uppercase font-sans">
            Alokasi Aset
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight leading-none font-sans">
            {formatIDR(activeCapital)}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-[#1bfb7c] flex items-center gap-0.5">
              ↑ 4.82%
            </span>
            <span className="text-[10px] text-[#686477] font-mono">
              {formatUSDVal(activeCapital)} USD
            </span>
          </div>
        </div>
        
        {/* Decorative dynamic badge */}
        <div className="w-8 h-8 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477]">
          <PieChart className="w-4 h-4" />
        </div>
      </div>

      {/* High-fidelity Treemap Grid structure (custom-designed grid mimicking the user's sample image) */}
      <div className="grid grid-cols-2 gap-2.5 h-[270px]">
        
        {/* Left column: tall green box on top, purple box on bottom */}
        <div className="flex flex-col gap-2.5 h-full">
          {/* SAHAM (Tall Neon Green Box) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex-1 ${assets[0].bgColor} ${assets[0].textColor} p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer shadow-[0_10px_20px_rgba(27,251,124,0.12)]`}
          >
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                {assets[0].icon}
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase font-mono">{assets[0].name}</span>
            </div>
            
            <div className="space-y-0.5 mt-auto">
              <div className="text-3xl font-black tracking-tighter leading-none font-sans">
                {assets[0].percentage}%
              </div>
              <p className="text-[9px] font-bold opacity-75 font-mono leading-none">
                {formatIDR(assets[0].val).replace(/Rp\s?/, '')}
              </p>
            </div>
            
            <div className="self-end mt-1.5">
              <span className="inline-block px-1.5 py-0.5 text-[8px] font-black rounded-md bg-black/15 text-black border border-black/10">
                {assets[0].change}
              </span>
            </div>
          </motion.div>

          {/* CASH IDR (Purple Box) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`h-[95px] ${assets[3].bgColor} ${assets[3].textColor} p-3 rounded-2xl flex flex-col justify-between cursor-pointer shadow-[0_8px_16px_rgba(157,29,242,0.12)]`}
          >
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                {assets[3].icon}
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase font-mono">{assets[3].name}</span>
            </div>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-lg font-black tracking-tighter leading-none font-sans">
                  {assets[3].percentage}%
                </div>
                <p className="text-[8px] opacity-75 font-mono mt-0.5">
                  {formatIDR(assets[3].val).replace(/Rp\s?/, '')}
                </p>
              </div>
              <span className="px-1.5 py-0.5 text-[8px] font-black rounded-md bg-black/30 text-white/90">
                {assets[3].change}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right column: gray box, yellow box, orange box stacked */}
        <div className="flex flex-col gap-2.5 h-full">
          {/* EMAS (Slate Gray Box) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`h-[85px] ${assets[1].bgColor} ${assets[1].textColor} p-3 rounded-2xl flex flex-col justify-between cursor-pointer shadow-[0_8px_16px_rgba(0,0,0,0.15)]`}
          >
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                {assets[1].icon}
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase font-mono">{assets[1].name}</span>
            </div>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-lg font-black tracking-tighter leading-none font-sans">
                  {assets[1].percentage}%
                </div>
                <p className="text-[8px] opacity-75 font-mono mt-0.5">
                  {formatIDR(assets[1].val).replace(/Rp\s?/, '')}
                </p>
              </div>
              <span className="px-1.5 py-0.5 text-[8px] font-black rounded-md bg-black/30 text-white/90">
                {assets[1].change}
              </span>
            </div>
          </motion.div>

          {/* USD CASH (Golden Yellow Box) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`h-[85px] ${assets[2].bgColor} ${assets[2].textColor} p-3 rounded-2xl flex flex-col justify-between cursor-pointer shadow-[0_8px_16px_rgba(255,190,59,0.12)]`}
          >
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                {assets[2].icon}
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase font-mono">{assets[2].name}</span>
            </div>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-lg font-black tracking-tighter leading-none font-sans">
                  {assets[2].percentage}%
                </div>
                <p className="text-[8px] opacity-75 font-mono mt-0.5">
                  {formatIDR(assets[2].val).replace(/Rp\s?/, '')}
                </p>
              </div>
              <span className="px-1.5 py-0.5 text-[8px] font-black rounded-md bg-black/25 text-black">
                {assets[2].change}
              </span>
            </div>
          </motion.div>

          {/* HEDGING (Sunset Orange Box) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`h-[85px] ${assets[4].bgColor} ${assets[4].textColor} p-3 rounded-2xl flex flex-col justify-between cursor-pointer shadow-[0_8px_16px_rgba(255,86,33,0.12)]`}
          >
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                {assets[4].icon}
              </div>
              <span className="text-[9px] font-black tracking-wider uppercase font-mono">{assets[4].name}</span>
            </div>
            
            <div className="flex items-end justify-between mt-auto">
              <div>
                <div className="text-lg font-black tracking-tighter leading-none font-sans">
                  {assets[4].percentage}%
                </div>
                <p className="text-[8px] opacity-75 font-mono mt-0.5">
                  {formatIDR(assets[4].val).replace(/Rp\s?/, '')}
                </p>
              </div>
              <span className="px-1.5 py-0.5 text-[8px] font-black rounded-md bg-black/25 text-black">
                {assets[4].change}
              </span>
            </div>
          </motion.div>
        </div>

      </div>

      <div className="text-[9px] text-[#686477] font-mono text-center pt-3 border-t border-[#1b1926]/40">
        SafeHeaven Tactic Model v1.4 • Live data update
      </div>

    </div>
  );
};
