import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { TickerLogo } from '../components/TickerLogo';
import { Columns, Plus, Trash2, Sliders, Shield, Award } from 'lucide-react';

interface CompColumn {
  id: string;
  name: string;
  capital: number;
  allocationSaham: number;
  allocationEmas: number;
  allocationCash: number;
  allocationUSD: number;
  tickers: { symbol: string; score: number }[];
}

export const Compare: React.FC = () => {
  const { portfolioConfig } = useAppStore();

  // Initialize with two default mock comparison columns
  const [columns, setColumns] = useState<CompColumn[]>([
    {
      id: 'c1',
      name: portfolioConfig?.strategyName || 'Defensive Value Strategy',
      capital: portfolioConfig?.capital || 500000000,
      allocationSaham: portfolioConfig?.allocationSaham || 60,
      allocationEmas: portfolioConfig?.allocationEmas || 20,
      allocationCash: portfolioConfig?.allocationCash || 10,
      allocationUSD: portfolioConfig?.allocationUSD || 10,
      tickers: [
        { symbol: 'BBCA', score: 88 },
        { symbol: 'BBRI', score: 85 },
        { symbol: 'TLKM', score: 79 },
        { symbol: 'ASII', score: 65 }
      ]
    },
    {
      id: 'c2',
      name: 'Aggressive Quality Momentum',
      capital: 350000000,
      allocationSaham: 80,
      allocationEmas: 10,
      allocationCash: 5,
      allocationUSD: 5,
      tickers: [
        { symbol: 'BMRI', score: 82 },
        { symbol: 'KLBF', score: 76 },
        { symbol: 'BBNI', score: 72 },
        { symbol: 'ADRO', score: 58 }
      ]
    }
  ]);

  const addComparisonColumn = () => {
    const id = `col-${Date.now()}`;
    const newCol: CompColumn = {
      id,
      name: `Custom Strategic Portfolio ${columns.length + 1}`,
      capital: 200000000,
      allocationSaham: 50,
      allocationEmas: 25,
      allocationCash: 15,
      allocationUSD: 10,
      tickers: [
        { symbol: 'BBCA', score: 88 },
        { symbol: 'TLKM', score: 79 },
        { symbol: 'BMRI', score: 82 }
      ]
    };
    setColumns([...columns, newCol]);
  };

  const removeColumn = (id: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(c => c.id !== id));
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div id="compare-portfolio-view" className="px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Bandingkan Portofolio</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Komparasi antar racikan taktis dan formasi alokasi modal secara paralel.</p>
          </div>
        </div>
        <button
          id="add-comparison-col-btn"
          onClick={addComparisonColumn}
          className="px-4.5 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Tambah Portofolio
        </button>
      </div>

      {/* Grid containing comparison columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {columns.map((col, idx) => (
          <div key={col.id} className="card card-elevated p-6 flex flex-col justify-between space-y-5 relative bg-[#0b0a10]/45">
            {/* Remove button */}
            {columns.length > 1 && (
              <button
                id={`remove-col-btn-${col.id}`}
                onClick={() => removeColumn(col.id)}
                className="absolute top-5 right-5 text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Hapus kolom"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4">
              {/* Profile Card Header */}
              <div>
                <span className="text-[10px] font-extrabold text-[#ccff00] uppercase font-mono tracking-wider">Formula {idx + 1}</span>
                <h3 className="text-sm font-extrabold text-white tracking-tight mt-1 font-sans truncate pr-8">{col.name}</h3>
                <span className="text-xs text-[#9f9bac] font-sans font-medium mt-1 block">Modal: <span className="font-mono text-white font-bold">{formatIDR(col.capital)}</span></span>
              </div>

              {/* Stacked Allocation Horizontal Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-sans">
                  <span className="text-[#9f9bac] font-semibold">Sebaran Alokasi Aset</span>
                  <span className="text-[#686477]">Total 100%</span>
                </div>
                {/* Horizontal Stacked visual bar */}
                <div className="w-full h-4.5 rounded-lg overflow-hidden flex border border-[#1b1926]">
                  <div 
                    style={{ width: `${col.allocationSaham}%` }} 
                    className="h-full bg-[#ccff00]" 
                    title={`Saham: ${col.allocationSaham}%`}
                  ></div>
                  <div 
                    style={{ width: `${col.allocationEmas}%` }} 
                    className="h-full bg-[#00f0ff]" 
                    title={`Emas: ${col.allocationEmas}%`}
                  ></div>
                  <div 
                    style={{ width: `${col.allocationCash}%` }} 
                    className="h-full bg-[#a855f7]" 
                    title={`Cash IDR: ${col.allocationCash}%`}
                  ></div>
                  <div 
                    style={{ width: `${col.allocationUSD}%` }} 
                    className="h-full bg-[#6366f1]" 
                    title={`USD Cash: ${col.allocationUSD}%`}
                  ></div>
                </div>

                {/* Micro percentages indicators */}
                <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-[#9f9bac] pt-1">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span>
                    <span>S:{col.allocationSaham}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
                    <span>E:{col.allocationEmas}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>
                    <span>C:{col.allocationCash}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span>
                    <span>U:{col.allocationUSD}%</span>
                  </div>
                </div>
              </div>

              {/* Stock Picks Overlay section */}
              <div className="space-y-2 pt-3.5 border-t border-[#1b1926]">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#686477] font-sans">Overlay Konstituen</h4>
                <div className="space-y-1.5">
                  {col.tickers.map((t, i) => {
                    const colors = ['bg-[#ccff00]/10 text-[#ccff00]', 'bg-[#00f0ff]/10 text-[#00f0ff]', 'bg-purple-500/10 text-purple-400', 'bg-pink-500/10 text-pink-400'];
                    return (
                      <div 
                        key={t.symbol} 
                        className="bg-[#111018]/60 border border-[#1b1926] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <TickerLogo symbol={t.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                          <span className="font-mono font-extrabold text-white">{t.symbol}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#686477] text-[10px]">Skor Kuantitatif:</span>
                          <span className="font-mono text-[#00f5a0] font-extrabold">{t.score}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulated rating/quality badge */}
            <div className="pt-4 border-t border-[#1b1926] flex items-center justify-between text-[11px] text-[#686477]">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-[#00f5a0]" /> Risiko Terkontrol</span>
              <span className="text-[#ccff00] font-mono font-bold">DIVERSIFIED</span>
            </div>
          </div>
        ))}

        {/* Big plus placeholder column */}
        <div 
          onClick={addComparisonColumn}
          className="border-2 border-dashed border-[#1b1926] hover:border-[#ccff00]/40 rounded-2xl cursor-pointer p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all min-h-[350px] bg-[#0b0a10]/15 group hover:bg-[#ccff00]/[0.01] active:scale-98 select-none"
        >
          <div className="w-12 h-12 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] group-hover:border-[#ccff00]/30 group-hover:text-[#ccff00] transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white font-sans group-hover:text-[#ccff00] transition-colors">Buka Formasi Tambahan</h3>
            <p className="text-[11px] text-[#686477] max-w-xs mt-1 font-sans">
              Klik di sini untuk mengintegrasikan slot simulasi perbandingan model ketiga secara langsung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
