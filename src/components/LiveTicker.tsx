/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores';
import { TickerInfo } from '../types';

export const LiveTicker: React.FC = () => {
  const { tickers, updateTickerPrice } = useAppStore();

  useEffect(() => {
    let interval: any;
    
    const fetchLiveTickers = async () => {
      try {
        const base = window.location.origin;
        const res = await window.appFetch(`${base}/api/live-tickers`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            data.forEach((t: TickerInfo) => {
              if (t && t.symbol && typeof t.price === 'number') {
                updateTickerPrice(t.symbol, t.price, t.changePercent || 0);
              }
            });
          }
        }
      } catch (err) {
        // Soft fallback to existing store tickers
      }
    };
    
    fetchLiveTickers();
    interval = setInterval(fetchLiveTickers, 15000);
    
    return () => clearInterval(interval);
  }, [updateTickerPrice]);

  return (
    <div id="live-ticker-tape" className="w-full bg-[#0a0a0a] border-b border-[#1f1f1f] h-10 overflow-hidden relative flex items-center">
      <div className="absolute flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-10 hover:[animation-play-state:paused] cursor-pointer">
        {/* Double list to create seamless looping */}
        {[...tickers, ...tickers].map((t, idx) => {
          const isPositive = t.changePercent >= 0;
          return (
            <div 
              key={`${t.symbol}-${idx}`} 
              className="inline-flex items-center space-x-2 text-sm font-mono"
            >
              <span className="text-[#ffffff] font-medium">{t.symbol}</span>
              <span className="text-[#a0a0a0]">Rp {t.price.toLocaleString('id-ID')}</span>
              <span className={`font-semibold ${isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(t.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
