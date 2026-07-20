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
    // Establish WebSocket Connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws: WebSocket | null = null;
    let fallbackInterval: any = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'prices' && data.tickers) {
            // Feed into global store
            data.tickers.forEach((t: TickerInfo) => {
              updateTickerPrice(t.symbol, t.price, t.changePercent);
            });
          }
        } catch (e) {
          console.error('Error parsing WS price updates:', e);
        }
      };

      ws.onerror = () => {
        setupFallback();
      };

      ws.onclose = () => {
        setupFallback();
      };
    } catch {
      setupFallback();
    }

    function setupFallback() {
      if (fallbackInterval) return;
      // Failover to client-side live simulated updates
      fallbackInterval = setInterval(() => {
        const currentTickers = useAppStore.getState().tickers;
        if (currentTickers.length === 0) return;
        currentTickers.forEach((t) => {
          // Random tiny fluctuation (-0.5% to +0.5%)
          const pctDelta = (Math.random() - 0.5) * 0.4;
          const newPrice = Math.max(50, Math.round(t.price * (1 + pctDelta / 100)));
          const newPct = parseFloat((t.changePercent + pctDelta).toFixed(2));
          
          // Notify store directly in an async block
          updateTickerPrice(t.symbol, newPrice, newPct);
        });
      }, 3000);
    }

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
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
              <span className={`font-semibold ${isPositive ? 'text-[#00c9a5]' : 'text-[#f23645]'}`}>
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
