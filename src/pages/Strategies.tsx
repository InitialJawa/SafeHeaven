/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Strategy } from '../types';
import { Sliders, Plus, Trash2, Shield, Percent, Check, X, Pencil, Info } from 'lucide-react';
import { toast } from 'sonner';

export const Strategies: React.FC = () => {
  const { strategies, portfolioConfig, addStrategy, updateStrategy, deleteStrategy, updatePortfolioConfig } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showAutoTooltip, setShowAutoTooltip] = useState(false);
  
  // Modal states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [weightQuality, setWeightQuality] = useState(20);
  const [weightMomentum, setWeightMomentum] = useState(20);
  const [weightValue, setWeightValue] = useState(20);
  const [weightGrowth, setWeightGrowth] = useState(20);
  const [weightDividend, setWeightDividend] = useState(20);

  const [allocSaham, setAllocSaham] = useState(50);
  const [allocEmas, setAllocEmas] = useState(20);
  const [allocCash, setAllocCash] = useState(15);
  const [allocUSD, setAllocUSD] = useState(15);

  const [crashThreshold, setCrashThreshold] = useState(15);
  const [stopLoss, setStopLoss] = useState(10);
  const [autoAllocation, setAutoAllocation] = useState(false);

  const [enableTacticalRotation, setEnableTacticalRotation] = useState(false);
  const [enableBearMarketGold, setEnableBearMarketGold] = useState(false);
  const [enableBearMarketUSD, setEnableBearMarketUSD] = useState(false);
  const [enableDividendDefender, setEnableDividendDefender] = useState(false);

  const openCreateModal = () => {
    setEditId(null);
    resetForm();
    setIsOpen(true);
  };

  const openEditModal = (strat: Strategy) => {
    setEditId(strat.id);
    setName(strat.name);
    setDescription(strat.description);
    setWeightQuality(strat.weightQuality);
    setWeightMomentum(strat.weightMomentum);
    setWeightValue(strat.weightValue);
    setWeightGrowth(strat.weightGrowth);
    setWeightDividend(strat.weightDividend);
    setAllocSaham(strat.allocationSaham);
    setAllocEmas(strat.allocationEmas);
    setAllocCash(strat.allocationCash);
    setAllocUSD(strat.allocationUSD);
    setCrashThreshold(strat.crashThreshold);
    setStopLoss(strat.stopLoss);
    setAutoAllocation(strat.autoAllocation || false);
    setEnableTacticalRotation(strat.enableTacticalRotation || false);
    setEnableBearMarketGold(strat.enableBearMarketGold || false);
    setEnableBearMarketUSD(strat.enableBearMarketUSD || false);
    setEnableDividendDefender(strat.enableDividendDefender || false);
    setIsOpen(true);
  };

  const totalScoreWeights = weightQuality + weightMomentum + weightValue + weightGrowth + weightDividend;
  const totalAllocation = allocSaham + allocEmas + allocCash + allocUSD;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (totalScoreWeights !== 100) {
      toast.error(`Total bobot kualitatif harus bernilai tepat 100% (Saat ini: ${totalScoreWeights}%)`);
      return;
    }
    if (totalAllocation !== 100) {
      toast.error(`Total alokasi aset harus bernilai tepat 100% (Saat ini: ${totalAllocation}%)`);
      return;
    }
    

    const payload: Omit<Strategy, 'id'> = {
      name,
      description,
      weightQuality,
      weightMomentum,
      weightValue,
      weightVolume: 0,
      weightGrowth,
      weightDividend,
      allocationSaham: allocSaham,
      allocationEmas: allocEmas,
      allocationCash: allocCash,
      allocationUSD: allocUSD,
      crashThreshold,
      stopLoss,
      autoAllocation,
      enableTacticalRotation,
      enableBearMarketGold,
      enableBearMarketUSD,
      enableDividendDefender
    };

    if (editId) {
      await updateStrategy(editId, payload);
      toast.success(`Strategi "${name}" berhasil diperbarui.`);
    } else {
      await addStrategy(payload);
      toast.success(`Strategi "${name}" berhasil dibuat!`);
    }

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setWeightQuality(20);
    setWeightMomentum(20);
    setWeightValue(20);
    setWeightGrowth(20);
    setWeightDividend(20);
    setAllocSaham(50);
    setAllocEmas(20);
    setAllocCash(15);
    setAllocUSD(15);
    setCrashThreshold(15);
    setStopLoss(10);
    setAutoAllocation(false);
    setEnableTacticalRotation(false);
    setEnableBearMarketGold(false);
    setEnableBearMarketUSD(false);
    setEnableDividendDefender(false);
  };

  return (
    <div id="strategies-view" className="px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Formula Strategi</h1>
            <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Gubah pembobotan faktor kuantitatif dan target pengaman crash alokasi Anda.</p>
          </div>
        </div>
        <button
          id="create-strategy-btn"
          onClick={openCreateModal}
          className="px-4.5 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5px]" /> Buat Strategi Baru
        </button>
      </div>

      {/* Profile Active Banner */}
      {portfolioConfig?.strategyProfile !== 'custom' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-300 text-xs font-sans">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">
                Profil Strategi Aktif: <span className="text-[#ccff00] font-mono">{portfolioConfig?.strategyProfile === 'auto' ? 'Auto (Ikut Regime IHSG)' : portfolioConfig?.strategyProfile?.includes('aggressive') ? 'Aggressive Momentum (Otoriter)' : 'Defensive Value (Konservatif)'}</span>
              </p>
              <p className="text-[11px] text-[#9f9bac] mt-0.5">
                Sistem saat ini mengendalikan skoring berbasis profil dinamis. Memilih template manual di bawah ini akan mengaktifkan profil <span className="text-white font-bold">Custom</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid Cards of Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {strategies.map((strat) => (
          <div key={strat.id} className="card card-elevated p-6 space-y-5 flex flex-col justify-between bg-[#0b0a10]/45">
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white font-sans">{strat.name}</h3>
                  {portfolioConfig?.strategyTemplate === strat.id && portfolioConfig?.strategyProfile === 'custom' ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-[pulse_2s_ease-in-out_infinite]"></div> Aktif (Custom)
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        updatePortfolioConfig({
                          strategyProfile: 'custom',
                          strategyTemplate: strat.id,
                          strategyName: strat.name,
                          allocationSaham: strat.allocationSaham,
                          allocationEmas: strat.allocationEmas,
                          allocationCash: strat.allocationCash,
                          allocationUSD: strat.allocationUSD
                        });
                        toast.success(`Mode Custom diaktifkan dengan template ${strat.name}`);
                      }}
                      className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#1b1926]/50 text-[#686477] border border-[#1b1926] hover:text-white hover:border-[#686477]/50 cursor-pointer transition-colors"
                      title="Gunakan strategi ini"
                    >
                      Pilih StrategiIni
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id={`edit-strat-${strat.id}`}
                    onClick={() => openEditModal(strat)}
                    className="text-[#9f9bac] hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit Strategi"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {strategies.length > 1 && (
                    <button
                      id={`delete-strat-${strat.id}`}
                      onClick={() => {
                        deleteStrategy(strat.id);
                        toast.info(`Strategi dihapus.`);
                      }}
                      className="text-[#686477] hover:text-[#ff3366] p-1.5 hover:bg-[#ff3366]/5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#ff3366]/20"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#9f9bac] leading-relaxed font-sans font-medium">{strat.description}</p>

              {/* Progress bars of components scoring weights */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider font-sans">Bobot Faktor Scoring</span>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono text-white">
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-2.5">
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Qual</div>
                    <div className="font-extrabold mt-1 text-[#ccff00]">{strat.weightQuality}%</div>
                  </div>
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-2.5">
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Mom</div>
                    <div className="font-extrabold mt-1 text-[#00f0ff]">{strat.weightMomentum}%</div>
                  </div>
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-2.5">
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Value</div>
                    <div className="font-extrabold mt-1 text-[#00f5a0]">{strat.weightValue}%</div>
                  </div>
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-2.5">
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Growth</div>
                    <div className="font-extrabold mt-1 text-white">{strat.weightGrowth}%</div>
                  </div>
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-2.5">
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Div</div>
                    <div className="font-extrabold mt-1 text-[#9f9bac]">{strat.weightDividend}%</div>
                  </div>
                </div>
              </div>


            </div>

            {/* Threshold controls display */}
            <div className="pt-3.5 border-t border-[#1b1926] grid grid-cols-2 text-[11px] text-[#686477] font-sans font-extrabold uppercase tracking-wide">
              <div>Crash Threshold: <span className="text-[#f59e0b] font-extrabold font-mono ml-1">{strat.crashThreshold}%</span></div>
              <div className="text-right">Stop Loss: <span className="text-[#ff3366] font-extrabold font-mono ml-1">{strat.stopLoss}%</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Buat Strategi Baru */}
      {isOpen && (
        <div id="strategy-form-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop overlay */}
          <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>

          <div className="bg-[#0c0b12] border border-[#1b1926] rounded-2xl w-full max-w-lg p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                  {editId ? 'Edit Strategi' : 'Definisikan Strategi Kuantitatif'}
                </h3>
              </div>
              <button
                id="modal-close-btn"
                onClick={() => setIsOpen(false)}
                className="text-[#9f9bac] hover:text-white p-1 rounded-lg hover:bg-[#111018] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans font-medium">
              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Nama Strategi</label>
                <input
                  id="strat-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth: Aggressive Alpha Momentum"
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Deskripsi</label>
                <textarea
                  id="strat-desc-input"
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan mandat strategis, parameter sasaran rebalancing, dll..."
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-semibold"
                />
              </div>

              {/* Scoring Weights sliders group */}
              <div className="space-y-3 pt-3 border-t border-[#1b1926]">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[#9f9bac] uppercase text-[10px] tracking-wider">Faktor Scoring (Total 100%)</span>
                  <span className={`font-mono font-extrabold text-sm ${totalScoreWeights === 100 ? 'text-[#ccff00]' : 'text-[#ff3366]'}`}>
                    {totalScoreWeights}% / 100%
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Bobot Quality', val: weightQuality, set: setWeightQuality, color: '#ccff00' },
                    { label: 'Bobot Momentum', val: weightMomentum, set: setWeightMomentum, color: '#00f0ff' },
                    { label: 'Bobot Value', val: weightValue, set: setWeightValue, color: '#00f5a0' },
                    { label: 'Bobot Growth', val: weightGrowth, set: setWeightGrowth, color: '#ffffff' },
                    { label: 'Bobot Dividend', val: weightDividend, set: setWeightDividend, color: '#9f9bac' },
                  ].map((s) => (
                    <div key={s.label} className="grid grid-cols-4 items-center gap-4">
                      <span className="text-[11px] text-[#9f9bac] font-semibold">{s.label}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={s.val}
                        onChange={(e) => s.set(parseInt(e.target.value))}
                        className="col-span-2 accent-[#ccff00]"
                      />
                      <span className="text-right font-mono text-white font-extrabold text-xs">{s.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Asset Allocations sliders group */}
              <div className="pt-4 border-t border-[#1b1926] mt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[#9f9bac] uppercase text-[10px] tracking-wider">Alokasi Sasaran Makro</span>
                    <div className="flex items-center gap-2 relative">
                      <label className="flex items-center cursor-pointer gap-2" title="Aktifkan Auto Dinamis (Rotasi Taktis)">
                        <div className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${autoAllocation ? 'bg-[#ccff00]' : 'bg-[#1b1926]'}`}>
                          <input type="checkbox" className="hidden" checked={autoAllocation} onChange={(e) => setAutoAllocation(e.target.checked)} />
                          <div className={`bg-black w-3 h-3 rounded-full shadow-md transform transition-transform ${autoAllocation ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className={`text-[10px] font-bold ${autoAllocation ? 'text-[#ccff00]' : 'text-[#686477]'}`}>AUTO</span>
                      </label>
                      <button 
                        type="button" 
                        className="text-[#686477] hover:text-[#ccff00] transition-colors"
                        onMouseEnter={() => setShowAutoTooltip(true)}
                        onMouseLeave={() => setShowAutoTooltip(false)}
                        onClick={() => setShowAutoTooltip(!showAutoTooltip)}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      
                      {/* Tooltip */}
                      {showAutoTooltip && (
                        <div className="absolute z-50 left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 sm:w-72 bg-[#1b1926] border border-[#ccff00]/30 shadow-xl rounded-xl p-3 animate-in fade-in zoom-in-95 duration-200">
                          <div className="absolute -top-1.5 sm:right-4 left-4 sm:left-auto w-3 h-3 bg-[#1b1926] border-t border-l border-[#ccff00]/30 rotate-45"></div>
                          <div className="relative z-10 space-y-2">
                            <h4 className="text-[#ccff00] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                              <Info className="w-3 h-3" />
                              Mode Auto vs Manual
                            </h4>
                            <div className="text-[10px] text-white space-y-1.5 leading-relaxed">
                              <p><strong className="text-[#00f0ff]">Mode Manual:</strong> Anda menentukan secara pasti proporsi aset (Saham, Emas, Kas, USD). Nilai akan dikunci sesuai pilihan Anda.</p>
                              <p><strong className="text-[#ccff00]">Mode Auto:</strong> Sistem mengambil alih alokasi. Dana akan diputar secara taktis berdasarkan kondisi market (Bear/Bull) dan rotasi sektoral tanpa perlu Anda ubah secara manual.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`font-mono font-extrabold text-sm ${totalAllocation === 100 ? 'text-[#ccff00]' : 'text-[#ff3366]'}`}>
                    {totalAllocation}% / 100%
                  </span>
                </div>
                
                <div className="relative mt-3">
                  {autoAllocation && (
                    <div className="absolute inset-[-10px] z-10 bg-[#0b0a10]/70 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#ccff00]/20">
                      <div className="bg-[#111018] px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.15)] border border-[#ccff00]/30">
                        <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></div>
                        <span className="text-[#ccff00] font-bold text-xs">Auto Dinamis</span>
                      </div>
                    </div>
                  )}
                  <div className={`space-y-4 p-3 rounded-xl transition-all ${autoAllocation ? 'opacity-30 pointer-events-none' : 'bg-[#111018]/30 border border-[#1b1926]'}`}>
                    {[
                      { label: 'Saham', val: allocSaham, set: setAllocSaham, color: '#ccff00' },
                      { label: 'Emas', val: allocEmas, set: setAllocEmas, color: '#00f0ff' },
                      { label: 'Kas IDR', val: allocCash, set: setAllocCash, color: '#00f5a0' },
                      { label: 'USD', val: allocUSD, set: setAllocUSD, color: '#a855f7' }
                    ].map((s) => (
                      <div key={s.label} className="grid grid-cols-4 items-center gap-3">
                        <span className="text-[10px] text-[#686477] font-extrabold uppercase">{s.label}</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={s.val}
                          onChange={(e) => s.set(parseInt(e.target.value))}
                          disabled={autoAllocation} className="col-span-2 accent-[#ccff00]"
                        />
                        <span className="text-right font-mono text-white font-extrabold text-xs">{s.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Threshold controls */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1b1926]">
                <div className="space-y-2">
                  <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Crash Threshold (%)</label>
                  <input
                    id="strat-crash-input"
                    type="number"
                    min="1"
                    max="50"
                    value={crashThreshold}
                    onChange={(e) => setCrashThreshold(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#ccff00]/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Stop Loss (%)</label>
                  <input
                    id="strat-stoploss-input"
                    type="number"
                    min="1"
                    max="50"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#ccff00]/40"
                  />
                </div>
              </div>

              {/* Advanced Rotational Settings */}
              <div className="space-y-3 pt-4 border-t border-[#1b1926] mt-4 relative">
                <span className="font-extrabold text-[#9f9bac] uppercase text-[10px] tracking-wider block">Aturan Rotasi Taktis (Advanced)</span>
                
                <label className="flex items-center justify-between cursor-pointer p-3 bg-[#111018]/60 border border-[#1b1926] rounded-xl hover:bg-[#111018] transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">Enable Tactical Rotation</div>
                    <div className="text-[10px] text-[#686477]">Menerapkan rotasi dinamis saat kondisi pasar bearish.</div>
                  </div>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${enableTacticalRotation ? 'bg-[#ccff00]' : 'bg-[#1b1926]'}`}>
                    <input type="checkbox" className="hidden" checked={enableTacticalRotation} onChange={(e) => setEnableTacticalRotation(e.target.checked)} />
                    <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${enableTacticalRotation ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </label>

                {enableTacticalRotation && (
                  <div className="pl-4 border-l-2 border-[#1b1926] space-y-3 ml-2">
                    <label className="flex items-center justify-between cursor-pointer p-3 bg-[#111018]/40 border border-[#1b1926]/50 rounded-xl hover:bg-[#111018]/80 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-white">Rotasi Emas (Bear Market)</div>
                        <div className="text-[9px] text-[#686477]">Pindahkan dana ke Emas jika saham turun & tren Emas naik.</div>
                      </div>
                      <div className={`w-8 h-5 flex items-center rounded-full p-0.5 transition-colors ${enableBearMarketGold ? 'bg-[#00f0ff]' : 'bg-[#1b1926]'}`}>
                        <input type="checkbox" className="hidden" checked={enableBearMarketGold} onChange={(e) => setEnableBearMarketGold(e.target.checked)} />
                        <div className={`bg-black w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${enableBearMarketGold ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-3 bg-[#111018]/40 border border-[#1b1926]/50 rounded-xl hover:bg-[#111018]/80 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-white">Rotasi USD (Market Crash)</div>
                        <div className="text-[9px] text-[#686477]">Pindahkan ke Dolar AS jika Saham & Emas ikut turun.</div>
                      </div>
                      <div className={`w-8 h-5 flex items-center rounded-full p-0.5 transition-colors ${enableBearMarketUSD ? 'bg-[#00f5a0]' : 'bg-[#1b1926]'}`}>
                        <input type="checkbox" className="hidden" checked={enableBearMarketUSD} onChange={(e) => setEnableBearMarketUSD(e.target.checked)} />
                        <div className={`bg-black w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${enableBearMarketUSD ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-3 bg-[#111018]/40 border border-[#1b1926]/50 rounded-xl hover:bg-[#111018]/80 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-white">Dividend Defender</div>
                        <div className="text-[9px] text-[#686477]">Kecualikan saham berdividen/berkualitas tinggi dari penjualan panic.</div>
                      </div>
                      <div className={`w-8 h-5 flex items-center rounded-full p-0.5 transition-colors ${enableDividendDefender ? 'bg-[#ff3366]' : 'bg-[#1b1926]'}`}>
                        <input type="checkbox" className="hidden" checked={enableDividendDefender} onChange={(e) => setEnableDividendDefender(e.target.checked)} />
                        <div className={`bg-black w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${enableDividendDefender ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-5 border-t border-[#1b1926]">
                <button
                  id="cancel-strategy-btn"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-[#111018] border border-[#1b1926] hover:bg-white/5 text-white py-3 rounded-xl font-extrabold transition-all cursor-pointer active:scale-95"
                >
                  Batal
                </button>
                <button
                  id="save-strategy-btn"
                  type="submit"
                  className="flex-1 bg-[#ccff00] hover:bg-[#ddff33] text-black py-3 rounded-xl font-extrabold transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-95"
                >
                  {editId ? 'Simpan Perubahan' : 'Simpan Strategi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
