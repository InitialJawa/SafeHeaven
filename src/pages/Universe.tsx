/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Universe } from '../types';
import { TickerLogo } from '../components/TickerLogo';
import { Layers, Plus, Trash2, Search, Sliders, Check, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

export const UniversePage: React.FC = () => {
  const { universes, addUniverse, deleteUniverse } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [bulkText, setBulkText] = useState('');
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);

  const SECTORS = ['Financials', 'Technology', 'Telco', 'Resources', 'Consumer'];
  const INDICES = ['LQ45', 'IDX30', 'IDX80'];
  const SAMPLE_TICKERS = [
    { symbol: 'BBCA', sector: 'Financials', index: 'LQ45' },
    { symbol: 'BBRI', sector: 'Financials', index: 'LQ45' },
    { symbol: 'BMRI', sector: 'Financials', index: 'IDX30' },
    { symbol: 'BBNI', sector: 'Financials', index: 'IDX30' },
    { symbol: 'TLKM', sector: 'Telco', index: 'LQ45' },
    { symbol: 'ASII', sector: 'Consumer', index: 'IDX80' },
    { symbol: 'GOTO', sector: 'Technology', index: 'IDX80' },
    { symbol: 'ADRO', sector: 'Resources', index: 'LQ45' },
    { symbol: 'UNVR', sector: 'Consumer', index: 'IDX30' },
    { symbol: 'KLBF', sector: 'Consumer', index: 'IDX80' },
  ];

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };
  
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);

  const toggleIndex = (index: string) => {
    setSelectedIndices((prev) => 
      prev.includes(index) ? prev.filter(s => s !== index) : [...prev, index]
    );
  };

  const addTickerToSelection = (symbol: string) => {
    if (selectedTickers.includes(symbol)) return;
    setSelectedTickers([...selectedTickers, symbol]);
  };

  const removeTickerFromSelection = (symbol: string) => {
    setSelectedTickers(selectedTickers.filter(s => s !== symbol));
  };

  const handleBulkAdd = () => {
    if (!bulkText.trim()) return;
    const splitSymbols = bulkText
      .toUpperCase()
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const uniqueSymbols = Array.from(new Set([...selectedTickers, ...splitSymbols]));
    setSelectedTickers(uniqueSymbols);
    setBulkText('');
    toast.success(`Berhasil mem-paste ${splitSymbols.length} ticker secara bulk!`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTickers.length === 0) {
      toast.error('Pilihlah minimal 1 ticker untuk menyusun universe!');
      return;
    }

    const payload: Omit<Universe, 'id'> = {
      name,
      description,
      tickers: selectedTickers
    };

    await addUniverse(payload);
    toast.success(`Universe "${name}" berhasil disimpan!`);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSearchQuery('');
    setSelectedSectors([]);
    setBulkText('');
    setSelectedTickers([]);
  };

  // Filter tickers list based on sector/index filter and search query
  const filteredTickers = SAMPLE_TICKERS.filter((t) => {
    const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(t.sector);
    const matchesIndex = selectedIndices.length === 0 || selectedIndices.includes(t.index);
    return matchesSearch && matchesSector && matchesIndex;
  });

  return (
    <div id="universe-builder-view" className="px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Universe Builder</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Pilah dan kelompokkan sekuritas pilihan untuk menjadi saringan basis rebalancing.</p>
          </div>
        </div>
        <button
          id="create-universe-btn"
          onClick={() => setIsOpen(true)}
          className="px-4.5 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5px]" /> Buat Universe Baru
        </button>
      </div>

      {/* Universes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {universes.map((uni) => (
          <div key={uni.id} className="card card-elevated p-6 space-y-5 flex flex-col justify-between bg-[#0b0a10]/45">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ccff00]" />
                  <h3 className="text-sm font-bold text-white font-sans">{uni.name}</h3>
                </div>
                {universes.length > 1 && (
                  <button
                    id={`delete-uni-${uni.id}`}
                    onClick={() => {
                      deleteUniverse(uni.id);
                      toast.info(`Universe dihapus.`);
                    }}
                    className="text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-[#ff3366]/5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#ff3366]/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-[#9f9bac] leading-relaxed font-sans font-medium">{uni.description}</p>
            </div>

            {/* Ticker chips */}
            <div className="space-y-2 pt-3.5 border-t border-[#1b1926]">
              <span className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider font-sans block">
                Konstituen Aktif ({uni.tickers.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {uni.tickers.map((t) => (
                  <span 
                    key={t} 
                    className="bg-[#111018]/60 border border-[#1b1926] text-white font-mono text-[10px] px-2.5 py-1 rounded-lg font-extrabold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Modal - Buat Universe Baru */}
      {isOpen && (
        <div id="universe-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>

          <div className="bg-[#0c0b12] border border-[#1b1926] rounded-2xl w-full max-w-2xl p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Side: General & Selection */}
            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans md:border-r md:border-r-[#1b1926] md:pr-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-[#ccff00]" />
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans">Koleksi Baru</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Nama Universe</label>
                  <input
                    id="uni-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="cth: Blue-Chip Core 10"
                    className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Deskripsi</label>
                  <textarea
                    id="uni-desc-input"
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kumpulan filter pengaman..."
                    className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-semibold"
                  />
                </div>

                {/* Selection Summary Table */}
                <div className="space-y-2 pt-2 border-t border-[#1b1926]">
                  <span className="font-extrabold text-[#9f9bac] uppercase text-[10px] tracking-wider block">
                    Konstituen Terpilih ({selectedTickers.length})
                  </span>
                  
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-3 min-h-[110px] max-h-[140px] overflow-y-auto">
                    {selectedTickers.length === 0 ? (
                      <span className="text-[#686477] block text-center py-6 font-semibold">Belum ada ticker terpilih</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTickers.map((t) => (
                          <span 
                            key={t}
                            className="inline-flex items-center gap-1.5 bg-[#0c0b12] border border-[#1b1926] text-white font-mono text-[10px] pl-2.5 pr-1.5 py-1 rounded-lg font-extrabold"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => removeTickerFromSelection(t)}
                              className="text-[#686477] hover:text-[#ff3366] cursor-pointer font-sans text-xs"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-5 border-t border-[#1b1926] mt-4">
                <button
                  id="cancel-uni-btn"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-[#111018] border border-[#1b1926] hover:bg-white/5 text-white py-3 rounded-xl font-extrabold transition-all cursor-pointer text-center active:scale-95"
                >
                  Batal
                </button>
                <button
                  id="save-uni-btn"
                  type="submit"
                  className="flex-1 bg-[#ccff00] hover:bg-[#ddff33] text-black py-3 rounded-xl font-extrabold transition-all cursor-pointer text-center shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </form>

            {/* Right Side: Filters, Search, and Lists */}
            <div className="space-y-4 text-xs font-sans font-medium">
              <div className="space-y-3">
                <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" /> Filter & Penambahan Bulk
                </h4>

                {/* Bulk Paste Textarea */}
                <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-3 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#9f9bac] flex items-center gap-1.5 uppercase tracking-wide">
                    <FileText className="w-3 h-3 text-[#ccff00]" /> Paste Kode Ticker (Bulk Add)
                  </span>
                  <textarea
                    id="bulk-tickers-paste"
                    rows={1}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="contoh: BBCA, BBRI, GOTO, TLKM"
                    className="w-full bg-[#0c0b12] border border-[#1b1926] rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#ccff00]/30 font-bold"
                  />
                  <button
                    id="bulk-add-tickers-btn"
                    type="button"
                    onClick={handleBulkAdd}
                    className="w-full bg-[#111018] border border-[#1b1926] hover:border-[#ccff00] hover:text-[#ccff00] py-2 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer"
                  >
                    Tambah Bulk
                  </button>
                </div>

                {/* Search field */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#686477] absolute left-3 top-3" />
                  <input
                    id="ticker-search-field"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kode saham..."
                    className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl pl-9.5 pr-3 py-2.5 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                  />
                </div>

                {/* Sector Checkboxes */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SECTORS.map((sec) => {
                    const active = selectedSectors.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => toggleSector(sec)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                          active 
                            ? 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]' 
                            : 'bg-[#111018] border-[#1b1926] text-[#686477] hover:text-white hover:border-[#686477]/45'
                        }`}
                      >
                        {sec}
                      </button>
                    );
                  })}
                  {INDICES.map((idx) => {
                    const active = selectedIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                          active 
                            ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' 
                            : 'bg-[#111018] border-[#1b1926] text-[#686477] hover:text-white hover:border-[#686477]/45'
                        }`}
                      >
                        {idx}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtered Tick list */}
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto border border-[#1b1926] rounded-xl p-2 bg-[#111018]/40">
                {filteredTickers.map((tick) => {
                  const added = selectedTickers.includes(tick.symbol);
                  return (
                    <div 
                      key={tick.symbol} 
                      className="flex items-center justify-between p-2 bg-[#0c0b12] border border-[#1b1926]/40 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <TickerLogo symbol={tick.symbol} sizeClassName="w-5 h-5" className="!rounded-lg" />
                        <div>
                          <span className="font-mono font-extrabold text-white">{tick.symbol}</span>
                          <span className="text-[10px] text-[#686477] font-extrabold font-sans ml-2 uppercase">({tick.sector} • {tick.index})</span>
                        </div>
                      </div>
                      <button
                        id={`add-ticker-select-${tick.symbol}`}
                        type="button"
                        onClick={() => addTickerToSelection(tick.symbol)}
                        disabled={added}
                        className={`px-3 py-1.5 text-[10px] rounded-lg font-extrabold transition-all cursor-pointer border ${
                          added 
                            ? 'bg-white/5 border-transparent text-[#686477] cursor-not-allowed' 
                            : 'bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00]/20 border-[#ccff00]/30'
                        }`}
                      >
                        {added ? 'Ditambahkan' : 'Tambah'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
