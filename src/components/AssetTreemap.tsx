import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Sparkles, Activity } from 'lucide-react';
import { useAppStore } from '../stores';

interface AssetTreemapProps {
  capital?: number;
  style?: React.CSSProperties;
}

interface AssetBlock {
  id: string;
  name: string;
  percentage: number;
  val: number;
  change: string;
  color: string;
  textColor: string;
  subtitle: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const AssetTreemap: React.FC<AssetTreemapProps> = ({ capital = 500000000, style }) => {
  const { portfolioConfig, marketRegime } = useAppStore();
  const activeCapital = portfolioConfig?.capital || capital;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<AssetBlock | null>(null);
  const [, setAnimTime] = useState(0);

  const isEmasRegime = marketRegime === 'bear';

  // Asset allocations (ensuring percentages sum to 100)
  const rawAssets = [
    {
      id: 'saham',
      name: 'SAHAM',
      percentage: isEmasRegime ? 0 : 60,
      change: isEmasRegime ? '-2.4%' : '+4.82%',
      color: '#1ae88e',
      textColor: '#0b0a10',
      subtitle: isEmasRegime ? 'UNDERWEIGHT (AVOID)' : 'OVERWEIGHT (REKOMENDASI)'
    },
    {
      id: 'emas',
      name: 'EMAS',
      percentage: isEmasRegime ? 70 : 20,
      change: isEmasRegime ? '+8.50%' : '+1.50%',
      color: '#ffc145',
      textColor: '#0b0a10',
      subtitle: isEmasRegime ? 'OVERWEIGHT' : 'UNDERWEIGHT (HOLD)'
    },
    {
      id: 'usd',
      name: 'USD CASH',
      percentage: isEmasRegime ? 15 : 10,
      change: '+0.25%',
      color: '#5c5e66',
      textColor: '#ffffff',
      subtitle: 'NEUTRAL'
    },
    {
      id: 'idr',
      name: 'CASH IDR',
      percentage: isEmasRegime ? 15 : 10,
      change: '0.00%',
      color: '#a100ff',
      textColor: '#ffffff',
      subtitle: 'NEUTRAL'
    }
  ].filter(a => a.percentage > 0); // Filter out 0% assets

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setAnimTime((prev) => prev + dt);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

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

          const totalWeight = rawAssets.reduce((acc, curr) => acc + curr.percentage, 0);

          const layoutRects: Array<AssetBlock & { x: number; y: number; w: number; h: number }> = [];

          if (rawAssets.length === 4) {
            const saham = rawAssets.find(a => a.id === 'saham')!;
            const emas = rawAssets.find(a => a.id === 'emas')!;
            const usd = rawAssets.find(a => a.id === 'usd')!;
            const idr = rawAssets.find(a => a.id === 'idr')!;

            const leftW = Math.round((innerW - gap) * 0.52);
            const rightW = innerW - leftW - gap;

            // 1. Saham (Left block, full height)
            layoutRects.push({
              ...saham,
              val: activeCapital * (saham.percentage / 100),
              x: padding,
              y: padding,
              w: leftW,
              h: innerH
            });

            // Right column: Top is Emas (52% height), Bottom split into USD Cash & Cash IDR side-by-side
            const rightTopH = Math.round((innerH - gap) * 0.52);
            const rightBotH = innerH - rightTopH - gap;
            const subW = Math.round((rightW - gap) * 0.5);

            const rx = padding + leftW + gap;

            // 2. Emas (Top right, full right width)
            layoutRects.push({
              ...emas,
              val: activeCapital * (emas.percentage / 100),
              x: rx,
              y: padding,
              w: rightW,
              h: rightTopH
            });

            // 3. USD Cash (Bottom right left)
            layoutRects.push({
              ...usd,
              val: activeCapital * (usd.percentage / 100),
              x: rx,
              y: padding + rightTopH + gap,
              w: subW,
              h: rightBotH
            });

            // 4. Cash IDR (Bottom right right)
            layoutRects.push({
              ...idr,
              val: activeCapital * (idr.percentage / 100),
              x: rx + subW + gap,
              y: padding + rightTopH + gap,
              w: rightW - subW - gap,
              h: rightBotH
            });
          } else {
            let curX = padding;
            rawAssets.forEach((asset) => {
              const w = (innerW - gap * (rawAssets.length - 1)) * (asset.percentage / totalWeight);
              layoutRects.push({
                ...asset,
                val: activeCapital * (asset.percentage / 100),
                x: curX,
                y: padding,
                w,
                h: innerH
              });
              curX += w + gap;
            });
          }

          // Render each block onto Canvas
          layoutRects.forEach((asset) => {
            ctx.save();
            const isHovered = hoveredAsset && hoveredAsset.id === asset.id;

            if (isHovered) {
              ctx.shadowColor = asset.color;
              ctx.shadowBlur = 16;
            } else {
              ctx.shadowColor = 'rgba(0,0,0,0.25)';
              ctx.shadowBlur = 6;
              ctx.shadowOffsetY = 3;
            }

            const radius = 14;
            ctx.beginPath();
            ctx.roundRect(asset.x, asset.y, asset.w, asset.h, radius);

            const grad = ctx.createLinearGradient(asset.x, asset.y, asset.x + asset.w, asset.y + asset.h);
            grad.addColorStop(0, asset.color);
            grad.addColorStop(1, adjustColorBrightness(asset.color, -25));
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = isHovered ? 2 : 1;
            ctx.stroke();

            // Text rendering
            ctx.fillStyle = asset.textColor;
            ctx.font = 'bold 12px Inter, system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            if (asset.w > 70 && asset.h > 65) {
              ctx.fillText(asset.name, asset.x + 14, asset.y + 14);

              // Change badge
              const badgeText = asset.change;
              ctx.font = 'bold 10px JetBrains Mono, monospace';
              const badgeW = ctx.measureText(badgeText).width + 12;
              const badgeH = 20;
              const badgeX = asset.x + asset.w - badgeW - 14;
              const badgeY = asset.y + 14;

              ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
              ctx.beginPath();
              ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
              ctx.fill();

              ctx.fillStyle = asset.textColor;
              ctx.fillText(badgeText, badgeX + 6, badgeY + 5);

              // Percentage & Subtitle
              if (asset.h > 110) {
                ctx.font = '900 26px Inter, system-ui, sans-serif';
                ctx.fillText(`${asset.percentage}%`, asset.x + 14, asset.y + asset.h - 48);

                ctx.font = '600 10px JetBrains Mono, monospace';
                ctx.fillStyle = asset.textColor === '#ffffff' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)';
                ctx.fillText(asset.subtitle, asset.x + 14, asset.y + asset.h - 22);
              } else {
                ctx.font = '900 20px Inter, system-ui, sans-serif';
                ctx.fillText(`${asset.percentage}%`, asset.x + 14, asset.y + asset.h - 32);

                ctx.font = '600 9px JetBrains Mono, monospace';
                ctx.fillStyle = asset.textColor === '#ffffff' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)';
                ctx.fillText(asset.subtitle, asset.x + 14, asset.y + asset.h - 16);
              }
            } else if (asset.w > 50 && asset.h > 40) {
              ctx.font = 'bold 10px Inter, system-ui, sans-serif';
              ctx.fillText(asset.name, asset.x + 8, asset.y + 8);
              ctx.font = 'bold 14px Inter, system-ui, sans-serif';
              ctx.fillText(`${asset.percentage}%`, asset.x + 8, asset.y + asset.h - 22);
            }

            ctx.restore();
          });

          // Store layout rects in ref for mouse hit testing
          (canvas as any).__layoutRects = layoutRects;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredAsset, marketRegime, activeCapital]);

  function adjustColorBrightness(hex: string, percent: number) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const layoutRects = (canvas as any).__layoutRects || [];
    const found = layoutRects.find((r: any) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
    if (found) {
      setHoveredAsset(found);
    } else {
      setHoveredAsset(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredAsset(null);
  };

  return (
    <div 
      ref={containerRef}
      id="asset-treemap-container" 
      style={style} 
      className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between h-full min-h-[440px] relative overflow-hidden group"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#686477] tracking-widest uppercase font-sans">
              HTML5 Canvas & SVG Treemap
            </span>
            <span className="text-[9px] font-mono bg-[#ccff00]/10 text-[#ccff00] px-1.5 py-0.2 rounded border border-[#ccff00]/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> 60 FPS
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight leading-none font-sans mt-1">
            {portfolioConfig?.strategyName || 'IMAM NASRULLOH'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold text-[#1ae88e] flex items-center gap-1 bg-[#1ae88e]/10 px-2 py-0.5 rounded-md border border-[#1ae88e]/20">
              <Activity className="w-3 h-3 animate-pulse" /> +4.82% Bulan Ini
            </span>
            <span className="text-[9px] text-[#686477] font-mono tracking-wider uppercase font-extrabold">
              {isEmasRegime ? 'Bear Regime (Defensif)' : 'Bull Regime (Agresif)'}
            </span>
          </div>
        </div>
        
        <div className="w-9 h-9 rounded-xl bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#9f9bac] shadow-inner group-hover:border-[#ccff00]/40 transition-colors">
          <PieChart className="w-4 h-4 text-[#ccff00]" />
        </div>
      </div>

      <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-[#1b1926] bg-[#0b0a10]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-pointer block"
        />

        <AnimatePresence>
          {hoveredAsset && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-3 left-3 right-3 bg-[#111018]/95 backdrop-blur-md border border-[#ccff00]/30 p-3 rounded-xl shadow-2xl z-20 pointer-events-none flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shrink-0 shadow-lg"
                  style={{ backgroundColor: hoveredAsset.color }}
                />
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    {hoveredAsset.name}
                    <span className="text-[10px] font-mono font-bold text-[#ccff00]">
                      {hoveredAsset.percentage}% alokasi
                    </span>
                  </div>
                  <div className="text-[10px] text-[#9f9bac] font-mono mt-0.5">
                    Est. Nilai: Rp {formatIDR(hoveredAsset.val)} • Return: <strong className="text-[#1ae88e]">{hoveredAsset.change}</strong>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase px-2 py-1 rounded bg-[#1b1926] text-[#ccff00] border border-[#ccff00]/20 font-bold">
                  {hoveredAsset.subtitle}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1b1926]/40 flex flex-col items-center">
        <p className="text-[#686477] text-[8px] font-mono uppercase tracking-[0.1em] text-center mb-1">
          Rendered via HTML5 Canvas & SVG high-performance vector pipeline.
        </p>
        <div className="flex items-center gap-2 text-[8px] text-[#686477] font-mono uppercase tracking-[0.1em]">
          SafeHeaven Tactic Model v1.4
          <span className="inline-block w-1 h-1 bg-[#ccff00] rounded-full"></span>
          <span className="flex items-center gap-1 text-[#1ae88e]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ae88e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1ae88e]"></span>
            </span>
            60 FPS Canvas Active
          </span>
        </div>
      </div>

    </div>
  );
};

