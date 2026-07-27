import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export interface RegimeItem {
  name: string;
  value: number;
}

export interface RegimeTreemapProps {
  distribution?: RegimeItem[];
  showHeader?: boolean;
}

interface RegimeBlock {
  id: string;
  name: string;
  percentage: number;
  color: string;
  textColor: string;
  subtitle: string;
  isDominant: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const RegimeTreemap: React.FC<RegimeTreemapProps> = ({ distribution = [], showHeader = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<RegimeBlock | null>(null);

  const defaultDist: RegimeItem[] = [
    { name: 'Normal', value: 40 },
    { name: 'Bull', value: 30 },
    { name: 'Volatile', value: 20 },
    { name: 'Bear', value: 10 }
  ];

  const activeDist = (distribution && distribution.length > 0) ? distribution : defaultDist;

  // Color & Subtitle helper
  const getRegimeDetails = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('normal') || norm.includes('sideways')) {
      return {
        color: '#1ae88e', // Neon Green
        textColor: '#0b0a10',
        subtitle: 'Normal / Sideways Market',
      };
    } else if (norm.includes('bull')) {
      return {
        color: '#00f0ff', // Cyan
        textColor: '#0b0a10',
        subtitle: 'Bullish / Uptrend Agresif',
      };
    } else if (norm.includes('volatile')) {
      return {
        color: '#ff5e3a', // Sunset Orange
        textColor: '#0b0a10',
        subtitle: 'High Volatility / Fluktuatif',
      };
    } else { // Bear
      return {
        color: '#a100ff', // Electric Violet
        textColor: '#ffffff',
        subtitle: 'Bearish / Risk-Off Market',
      };
    }
  };

  const adjustColorBrightness = (hex: string, percent: number) => {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const drawRoundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = window.devicePixelRatio || 1;
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Background grid pattern (TradingView style dark financial canvas)
      ctx.fillStyle = '#111018';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(27, 25, 38, 0.8)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const padding = 12;
      const gap = 10;
      const innerW = width - padding * 2;
      const innerH = height - padding * 2;

      // Sort descending by value so highest value is prominent
      const sorted = [...activeDist].sort((a, b) => b.value - a.value);

      const layoutBlocks: RegimeBlock[] = [];

      if (sorted.length >= 2) {
        const topItem = sorted[0];
        const rightItems = sorted.slice(1);

        // Left column width proportional to top item value (min 40%, max 60%)
        const leftRatio = Math.min(0.6, Math.max(0.4, topItem.value / 100));
        const leftW = Math.round((innerW - gap) * leftRatio);
        const rightW = innerW - leftW - gap;

        // Left Dominant Block
        const detailsTop = getRegimeDetails(topItem.name);
        layoutBlocks.push({
          id: topItem.name.toLowerCase(),
          name: topItem.name.toUpperCase(),
          percentage: topItem.value,
          color: detailsTop.color,
          textColor: detailsTop.textColor,
          subtitle: detailsTop.subtitle,
          isDominant: true,
          x: padding,
          y: padding,
          w: leftW,
          h: innerH
        });

        // Right column stacked blocks
        const totalRightVal = rightItems.reduce((sum, item) => sum + item.value, 0) || 1;
        let currentY = padding;
        const availableH = innerH - gap * (rightItems.length - 1);

        rightItems.forEach((item, idx) => {
          const itemH = idx === rightItems.length - 1 
            ? (padding + innerH - currentY) 
            : Math.round(availableH * (item.value / totalRightVal));
          
          const details = getRegimeDetails(item.name);
          layoutBlocks.push({
            id: item.name.toLowerCase(),
            name: item.name.toUpperCase(),
            percentage: item.value,
            color: details.color,
            textColor: details.textColor,
            subtitle: details.subtitle,
            isDominant: false,
            x: padding + leftW + gap,
            y: currentY,
            w: rightW,
            h: itemH
          });

          currentY += itemH + gap;
        });
      } else {
        // Fallback for 1 item
        sorted.forEach((item) => {
          const details = getRegimeDetails(item.name);
          layoutBlocks.push({
            id: item.name.toLowerCase(),
            name: item.name.toUpperCase(),
            percentage: item.value,
            color: details.color,
            textColor: details.textColor,
            subtitle: details.subtitle,
            isDominant: true,
            x: padding,
            y: padding,
            w: innerW,
            h: innerH
          });
        });
      }

      // Render each block
      layoutBlocks.forEach((block) => {
        ctx.save();
        const isHovered = hoveredBlock && hoveredBlock.id === block.id;

        if (isHovered) {
          ctx.shadowColor = block.color;
          ctx.shadowBlur = 18;
        } else {
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 3;
        }

        const borderRadius = 14;
        drawRoundRectPath(ctx, block.x, block.y, block.w, block.h, borderRadius);

        const grad = ctx.createLinearGradient(block.x, block.y, block.x + block.w, block.y + block.h);
        grad.addColorStop(0, block.color);
        grad.addColorStop(1, adjustColorBrightness(block.color, -25));
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = block.textColor;

        // Render text according to block height and width
        if (block.h >= 110) {
          // Large Block (e.g., NORMAL 40%)
          ctx.font = '800 13px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(block.name, block.x + 14, block.y + 14);

          if (block.isDominant) {
            const badgeText = 'DOMINAN';
            ctx.font = 'extrabold 9px JetBrains Mono, monospace';
            const badgeW = ctx.measureText(badgeText).width + 10;
            const badgeH = 18;
            const badgeX = block.x + block.w - badgeW - 12;
            const badgeY = block.y + 12;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            drawRoundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 6);
            ctx.fill();

            ctx.fillStyle = block.textColor;
            ctx.fillText(badgeText, badgeX + 5, badgeY + 4);
          }

          // Bottom stacked text
          ctx.font = '900 32px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(`${block.percentage}%`, block.x + 14, block.y + block.h - 52);

          ctx.font = '700 10px JetBrains Mono, monospace';
          ctx.fillStyle = block.textColor === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)';
          ctx.fillText(block.subtitle, block.x + 14, block.y + block.h - 20);

        } else if (block.h >= 75) {
          // Medium Block (e.g., BULL 30% or VOLATILE with larger space)
          ctx.font = '800 12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(block.name, block.x + 14, block.y + 10);

          ctx.font = '900 22px Inter, system-ui, sans-serif';
          ctx.fillText(`${block.percentage}%`, block.x + 14, block.y + 26);

          if (block.h >= 90) {
            ctx.font = '700 9px JetBrains Mono, monospace';
            ctx.fillStyle = block.textColor === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)';
            ctx.fillText(block.subtitle, block.x + 14, block.y + 52);
          }

        } else if (block.h >= 50) {
          // Medium Compact Block (e.g. VOLATILE 20%)
          ctx.font = '800 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(block.name, block.x + 12, block.y + 10);

          ctx.font = '900 18px Inter, system-ui, sans-serif';
          ctx.fillText(`${block.percentage}%`, block.x + 12, block.y + 26);

        } else {
          // Small Compact Inline Block (e.g. BEAR 10%)
          const midY = block.y + block.h / 2;
          ctx.font = '800 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(block.name, block.x + 12, midY);

          ctx.font = '900 14px Inter, system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${block.percentage}%`, block.x + block.w - 12, midY);
        }

        ctx.restore();
      });

      ctx.restore();

      // Save blocks in ref
      (canvas as any).__layoutBlocks = layoutBlocks;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredBlock, activeDist]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const layoutBlocks = (canvas as any).__layoutBlocks || [];
    const found = layoutBlocks.find((b: RegimeBlock) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    setHoveredBlock(found || null);
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  return (
    <div 
      ref={containerRef}
      id="regime-treemap-card" 
      className={`card card-elevated p-6 w-full flex flex-col justify-between bg-[#0b0a10]/45 border border-[#1b1926] rounded-2xl min-h-[400px] relative overflow-hidden group`}
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1ae88e]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4 z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              Sebaran Durasi Regime Pasar (IHSG)
            </h3>
            <span className="text-[9px] font-mono bg-[#1ae88e]/10 text-[#1ae88e] px-2 py-0.5 rounded-full border border-[#1ae88e]/20 flex items-center gap-1">
              Live Engine
            </span>
          </div>
          <p className="text-xs text-[#9f9bac]">
            Peta distribusi durasi regime pasar (Normal, Bull, Bear, Volatile).
          </p>
        </div>
        
        <div className="w-9 h-9 rounded-xl bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] shadow-inner group-hover:border-[#1ae88e]/40 transition-colors">
          <Layers className="w-4 h-4 text-[#1ae88e]" />
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-[#1b1926] bg-[#0b0a10]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-pointer block"
        />

        <AnimatePresence>
          {hoveredBlock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-3 left-3 right-3 bg-[#111018]/95 backdrop-blur-md border border-[#1ae88e]/30 p-3 rounded-xl shadow-2xl z-20 pointer-events-none flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-lg"
                  style={{ backgroundColor: hoveredBlock.color }}
                />
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    {hoveredBlock.name} REGIME
                    <span className="text-[10px] font-mono font-bold text-[#1ae88e]">
                      {hoveredBlock.percentage}% Durasi
                    </span>
                  </div>
                  <div className="text-[10px] text-[#9f9bac] font-mono mt-0.5">
                    {hoveredBlock.subtitle}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase px-2 py-1 rounded bg-[#1b1926] text-[#1ae88e] border border-[#1ae88e]/20 font-bold">
                  {hoveredBlock.isDominant ? 'Dominan Market State' : 'Secondary State'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#1b1926]/40 flex items-center justify-between text-[9px] text-[#686477] font-mono">
        <span className="uppercase tracking-widest">SafeHaven Regime Engine Active</span>
        <span className="flex items-center gap-1 text-[#1ae88e] font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ae88e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1ae88e]"></span>
          </span>
          Live Data Active
        </span>
      </div>

    </div>
  );
};
