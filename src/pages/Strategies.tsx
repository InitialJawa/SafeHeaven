/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Strategy } from '../types';
import { Sliders, Plus, Trash2, Shield, Percent, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export const Strategies: React.FC = () => {
  const { strategies, addStrategy, deleteStrategy } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Modal states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [weightQuality, setWeightQuality] = useState(20);
  const [weightMomentum, setWeightMomentum] = useState(20);
  const [weightValue, setWeightValue] = useState(20);
  const [weightVolume, setWeightVolume] = useState(20);
  const [weightDividend, setWeightDividend] = useState(20);

  const [allocSaham, setAllocSaham] = useState(50);
  const [allocEmas, setAllocEmas] = useState(20);
  const [allocCash, setAllocCash] = useState(15);
  const [allocUSD, setAllocUSD] = useState(15);

  const [crashThreshold, setCrashThreshold] = useState(15);
  const [stopLoss, setStopLoss] = useState(10);

  const totalScoreWeights = weightQuality + weightMomentum + weightValue + weightVolume + weightDividend;
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
      weightVolume,
      weightDividend,
      allocationSaham: allocSaham,
      allocationEmas: allocEmas,
      allocationCash: allocCash,
      allocationUSD: allocUSD,
      crashThreshold,
      stopLoss
    };

    await addStrategy(payload);
    toast.success(`Strategi "${name}" berhasil dibuat!`);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setWeightQuality(20);
    setWeightMomentum(20);
    setWeightValue(20);
    setWeightVolume(20);
    setWeightDividend(20);
    setAllocSaham(50);
    setAllocEmas(20);
    setAllocCash(15);
    setAllocUSD(15);
    setCrashThreshold(15);
    setStopLoss(10);
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
          onClick={() => setIsOpen(true)}
          className="px-4.5 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5px]" /> Buat Strategi Baru
        </button>
      </div>

      {/* Grid Cards of Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {strategies.map((strat) => (
          <div key={strat.id} className="card card-elevated p-6 space-y-5 flex flex-col justify-between bg-[#0b0a10]/45">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-sans">{strat.name}</h3>
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
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Vol</div>
                    <div className="font-extrabold mt-1 text-white">{strat.weightVolume}%</div>
                  </div>
                  <div className="bg-[#111018]/60 border border-[#1b1926] rounded-xl p-2.5">
                    <div className="text-[#686477] text-[8px] font-extrabold uppercase font-sans">Div</div>
                    <div className="font-extrabold mt-1 text-[#9f9bac]">{strat.weightDividend}%</div>
                  </div>
                </div>
              </div>

              {/* Progress bars of Asset Allocation */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider font-sans">Alokasi Sasaran Makro</span>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#111018]/80 border border-[#1b1926]">
                  <div style={{ width: `${strat.allocationSaham}%` }} className="bg-[#ccff00]" title="Saham"></div>
                  <div style={{ width: `${strat.allocationEmas}%` }} className="bg-[#00f0ff]" title="Emas"></div>
                  <div style={{ width: `${strat.allocationCash}%` }} className="bg-[#686477]" title="Kas"></div>
                  <div style={{ width: `${strat.allocationUSD}%` }} className="bg-[#ff3366]" title="USD"></div>
                </div>
                <div className="flex justify-between text-[9px] text-[#9f9bac] font-mono font-bold">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span> Saham: {strat.allocationSaham}%</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span> Emas: {strat.allocationEmas}%</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#686477]"></span> Kas: {strat.allocationCash}%</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ff3366]"></span> USD: {strat.allocationUSD}%</span>
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
                <Sliders className="w-5 h-5 text-[#ccff00]" />
                <h3 className="text-sm font-bold text-white tracking-tight font-sans">Definisikan Strategi Kuantitatif</h3>
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
                    { label: 'Bobot Volume', val: weightVolume, set: setWeightVolume, color: '#ffffff' },
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

              {/* Allocation Weights sliders group */}
              <div className="space-y-3 pt-3 border-t border-[#1b1926]">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[#9f9bac] uppercase text-[10px] tracking-wider">Alokasi Sasaran (Total 100%)</span>
                  <span className={`font-mono font-extrabold text-sm ${totalAllocation === 100 ? 'text-[#ccff00]' : 'text-[#ff3366]'}`}>
                    {totalAllocation}% / 100%
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Alokasi Saham', val: allocSaham, set: setAllocSaham },
                    { label: 'Alokasi Emas', val: allocEmas, set: setAllocEmas },
                    { label: 'Alokasi Kas IDR', val: allocCash, set: setAllocCash },
                    { label: 'Alokasi USD Cash', val: allocUSD, set: setAllocUSD },
                  ].map((a) => (
                    <div key={a.label} className="grid grid-cols-4 items-center gap-4">
                      <span className="text-[11px] text-[#9f9bac] font-semibold">{a.label}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={a.val}
                        onChange={(e) => a.set(parseInt(e.target.value))}
                        className="col-span-2 accent-[#ccff00]"
                      />
                      <span className="text-right font-mono text-white font-extrabold text-xs">{a.val}%</span>
                    </div>
                  ))}
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
                  Simpan Strategi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
