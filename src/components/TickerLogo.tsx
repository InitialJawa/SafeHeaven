/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

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
  
  const cleanSymbol = symbol ? symbol.trim().toUpperCase() : 'IHSG';
  const rawSymbol = cleanSymbol.replace(/\.JK$/, '');

  useEffect(() => {
    setError(false);
  }, [cleanSymbol]);

  // Handle special case for IHSG / IDX / ^JKSE / COMPOSITE
  const isIdx = ['IHSG', 'IDX', '^JKSE', 'JKSE', 'COMPOSITE'].includes(cleanSymbol);
  
  if (isIdx) {
    return (
      <div 
        className={`relative shrink-0 ${sizeClassName} rounded-xl bg-gradient-to-br from-[#c62828] via-[#b71c1c] to-[#8e0000] border border-[#ef5350]/30 flex flex-col items-center justify-center overflow-hidden shadow-md text-white ${className}`}
        title="IDX - Bursa Efek Indonesia (IHSG)"
      >
        <svg viewBox="0 0 40 40" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* IDX Crimson Red Background with subtle border */}
          <rect width="40" height="40" rx="10" fill="url(#idx_red_grad)" />
          {/* Stylized IDX Diamond Emblem */}
          <g transform="translate(11, 6) scale(0.75)">
            <path d="M12 2L3 11L12 20L21 11L12 2Z" fill="#FFFFFF" fillOpacity="0.9" />
            <path d="M12 6L7 11L12 16L17 11L12 6Z" fill="#B71C1C" />
            <path d="M12 8.5L9 11.5L12 14.5L15 11.5L12 8.5Z" fill="#FFFFFF" />
          </g>
          {/* Crisp IDX text */}
          <text 
            x="20" 
            y="33" 
            textAnchor="middle" 
            fill="#FFFFFF" 
            fontSize="10" 
            fontWeight="900" 
            fontFamily="monospace"
            letterSpacing="-0.5"
          >
            IDX
          </text>
          <defs>
            <linearGradient id="idx_red_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D32F2F" />
              <stop offset="1" stopColor="#8E0000" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  let logoUrl = `https://assets.stockbit.com/logos/companies/${rawSymbol}.png`;

  // Failover color mapping to keep visual variety if images fail to load
  const colors: Record<string, string> = {
    IHSG: 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/30',
    IDX: 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/30',
    BBCA: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/30',
    BBRI: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    BMRI: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    BBNI: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    TLKM: 'bg-red-500/15 text-red-400 border-red-500/30',
    ASII: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    GOTO: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    ADRO: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    UNVR: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    KLBF: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  };

  const defaultColor = 'bg-[#1b1926] text-[#ccff00] border-[#2a273b]';
  const colorClass = colors[rawSymbol] || defaultColor;

  if (error) {
    const displayText = isIdx ? 'IDX' : rawSymbol.slice(0, 4);
    return (
      <div 
        className={`${sizeClassName} rounded-xl border flex items-center justify-center shrink-0 font-extrabold text-[10px] font-mono tracking-tighter ${colorClass} ${className}`}
        title={rawSymbol}
      >
        {displayText}
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
