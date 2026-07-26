import React, { useState } from 'react';
import { Search, Check, X, SlidersHorizontal, Trash2, Layers, Compass, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { INDICATORS_REGISTRY, INDICATOR_CATEGORIES, IndicatorDef } from '../lib/indicators';

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeIndicatorIds: string[];
  onToggleIndicator: (id: string) => void;
  onClearAll: () => void;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  isOpen,
  onClose,
  activeIndicatorIds,
  onToggleIndicator,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  // Filter indicators based on category and search query
  const filteredIndicators = INDICATORS_REGISTRY.filter((ind) => {
    const matchesSearch =
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'active') return activeIndicatorIds.includes(ind.id);
    return ind.category === selectedCategory;
  });

  const activeCount = activeIndicatorIds.length;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-[#111018] border border-[#2a273b] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1b1926] flex items-center justify-between gap-4 bg-[#111018]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1b1926] border border-[#2a273b] rounded-xl text-[#ccff00]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Katalog Indikator Teknikal
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
                  {INDICATORS_REGISTRY.length} Indikator
                </span>
              </h2>
              <p className="text-xs text-[#8e8a9d]">
                Pilih indikator analisis teknikal untuk ditampilkan pada grafik saham.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#1b1926] hover:bg-[#252235] text-[#8e8a9d] hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Toolbar */}
        <div className="p-4 border-b border-[#1b1926] space-y-3 bg-[#0e0d14]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8e8a9d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari indikator (contoh: RSI, Moving Average, Bollinger, Volume)..."
              className="w-full bg-[#1b1926] border border-[#2a273b] focus:border-[#ccff00] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-[#686477] outline-none transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#8e8a9d] hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {INDICATOR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#ccff00] text-black shadow-md'
                      : 'bg-[#1b1926] text-[#8e8a9d] hover:text-white hover:bg-[#252235] border border-[#2a273b]'
                  }`}
                >
                  {cat.id === 'active' && <Check className="w-3.5 h-3.5" />}
                  {cat.name}
                  {cat.id === 'active' && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${isActive ? 'bg-black text-[#ccff00]' : 'bg-[#ccff00] text-black'}`}>
                      {activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicators List Workspace */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[500px]">
          {filteredIndicators.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Compass className="w-8 h-8 text-[#2a273b] mx-auto" />
              <p className="font-mono text-xs text-white font-bold">Indikator tidak ditemukan</p>
              <p className="text-xs text-[#686477]">
                Coba gunakan kata kunci pencarian yang lain atau ganti kategori.
              </p>
            </div>
          ) : (
            filteredIndicators.map((ind: IndicatorDef) => {
              const isActive = activeIndicatorIds.includes(ind.id);
              return (
                <div
                  key={ind.id}
                  onClick={() => onToggleIndicator(ind.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                    isActive
                      ? 'bg-[#ccff00]/5 border-[#ccff00]/40 shadow-sm'
                      : 'bg-[#181622] hover:bg-[#1f1c2d] border-[#2a273b] hover:border-[#3d3856]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs sm:text-sm text-white group-hover:text-[#ccff00] transition-colors">
                        {ind.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          ind.overlay
                            ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                            : 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30'
                        }`}
                      >
                        {ind.overlay ? 'Overlay' : 'Panel'}
                      </span>
                    </div>
                    <p className="text-xs text-[#8e8a9d] line-clamp-2">{ind.description}</p>
                  </div>

                  {/* Clean Checkbox / Toggle (NO DOT CIRCLES) */}
                  <div className="shrink-0 flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-[#ccff00] border-[#ccff00] text-black shadow-md'
                          : 'bg-[#1b1926] border-[#2a273b] group-hover:border-[#ccff00]/50'
                      }`}
                    >
                      {isActive && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1b1926] bg-[#0e0d14] flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#8e8a9d] font-mono">
              <strong>{activeCount}</strong> indikator aktif
            </span>
            {activeCount > 0 && (
              <button
                onClick={onClearAll}
                className="px-2.5 py-1.5 bg-[#ff1744]/10 hover:bg-[#ff1744]/20 border border-[#ff1744]/30 text-[#ff5252] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold rounded-xl transition-all cursor-pointer shadow-lg font-mono text-xs whitespace-nowrap"
          >
            Selesai & Tampilkan
          </button>
        </div>

      </div>
    </div>
  );
};
