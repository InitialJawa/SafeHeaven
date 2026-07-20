/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface TickerLogoProps {
  symbol: string;
  className?: string;
  sizeClassName?: string; // e.g. "w-8 h-8", "w-5 h-5", etc.
}

export const TickerLogo: React.FC<TickerLogoProps> = ({ 
  symbol, 
  className = "", 
  sizeClassName = "w-8 h-8" 
}) => {
  const [error, setError] = useState(false);
  
  const cleanSymbol = symbol.trim().toUpperCase();

  // Stockbit uses standard upper-case PNG logos for Indonesian public companies
  const logoUrl = `https://assets.stockbit.com/logos/companies/${cleanSymbol}.png`;

  // Failover color mapping to keep visual variety if images fail to load
  const colors: Record<string, string> = {
    BBCA: 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20',
    BBRI: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/20',
    BMRI: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    BBNI: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    TLKM: 'bg-red-500/10 text-red-400 border-red-500/20',
    ASII: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    GOTO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ADRO: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    UNVR: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    KLBF: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  };

  const defaultColor = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  const colorClass = colors[cleanSymbol] || defaultColor;

  if (error) {
    return (
      <div 
        className={`${sizeClassName} rounded-xl border flex items-center justify-center font-bold text-xs font-mono shrink-0 ${colorClass} ${className}`}
        title={cleanSymbol}
      >
        {cleanSymbol.charAt(0)}
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${sizeClassName} rounded-xl bg-white p-1 border border-[#1b1926]/40 flex items-center justify-center overflow-hidden shadow-inner ${className}`}>
      <img
        src={logoUrl}
        alt={`${cleanSymbol} Logo`}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
};
