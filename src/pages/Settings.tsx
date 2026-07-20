import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores';
import { Settings as SettingsIcon, Shield, HelpCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { 
    portfolioConfig, 
    strategies, 
    universes, 
    updatePortfolioConfig 
  } = useAppStore();

  const [capital, setCapital] = useState(500000000);
  const [universe, setUniverse] = useState('LQ45');
  const [topN, setTopN] = useState(10);
  const [strategyTemplate, setStrategyTemplate] = useState('strat-1');

  // Sliders
  const [allocationSaham, setAllocationSaham] = useState(60);
  const [allocationEmas, setAllocationEmas] = useState(20);
  const [allocationCash, setAllocationCash] = useState(10);
  const [allocationUSD, setAllocationUSD] = useState(10);

  useEffect(() => {
    if (portfolioConfig) {
      setCapital(portfolioConfig.capital);
      setUniverse(portfolioConfig.universe);
      setTopN(portfolioConfig.topN);
      setStrategyTemplate(portfolioConfig.strategyTemplate);
      setAllocationSaham(portfolioConfig.allocationSaham);
      setAllocationEmas(portfolioConfig.allocationEmas);
      setAllocationCash(portfolioConfig.allocationCash);
      setAllocationUSD(portfolioConfig.allocationUSD);
    }
  }, [portfolioConfig]);

  // Synchronize allocation sliders if strategy template is changed
  const handleStrategyChange = (templateId: string) => {
    setStrategyTemplate(templateId);
    const selectedStrat = strategies.find(s => s.id === templateId);
    if (selectedStrat) {
      setAllocationSaham(selectedStrat.allocationSaham);
      setAllocationEmas(selectedStrat.allocationEmas);
      setAllocationCash(selectedStrat.allocationCash);
      setAllocationUSD(selectedStrat.allocationUSD);
      toast.info(`Alokasi disesuaikan dengan template strategi: ${selectedStrat.name}`);
    }
  };

  const totalAlloc = allocationSaham + allocationEmas + allocationCash + allocationUSD;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalAlloc !== 100) {
      toast.error(`Jumlah alokasi aset harus bernilai tepat 100%! (Saat ini: ${totalAlloc}%)`);
      return;
    }

    const payload = {
      capital,
      universe,
      topN,
      strategyTemplate,
      allocationSaham,
      allocationEmas,
      allocationCash,
      allocationUSD,
      strategyName: strategies.find(s => s.id === strategyTemplate)?.name || 'Custom Strategy'
    };

    try {
      const base = window.location.origin;
      const res = await fetch(`${base}/api/portfolio/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        updatePortfolioConfig(payload);
        toast.success('Konfigurasi portfolio sukses disimpan & disinkronisasi!');
      } else {
        toast.error('Gagal menyimpan konfigurasi.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Kesalahan server saat memproses konfigurasi.');
    }
  };

  return (
    <div id="settings-workbench" className="px-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#ccff00] rounded-full"></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">Settings Workbench</h1>
          <p className="text-xs text-[#9f9bac] font-sans mt-0.5">Sesuaikan modal kerja awal, target alokasi strategis, dan universe saham Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Settings Form */}
        <div className="card card-elevated p-6 lg:col-span-8 bg-[#0b0a10]/45">
          <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 pb-4 border-b border-[#1b1926]">
              <SettingsIcon className="w-4.5 h-4.5 text-[#ccff00]" /> Konfigurasi Dasar Portfolio
            </h3>

            {/* Row 1: Capital & Universe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Alokasi Modal Kerja Awal (Capital)</label>
                <input
                  id="settings-capital-input"
                  type="number"
                  required
                  value={capital}
                  onChange={(e) => setCapital(parseInt(e.target.value) || 0)}
                  placeholder="Rp 500.000.000"
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Target Universe</label>
                <select
                  id="settings-universe-select"
                  value={universe}
                  onChange={(e) => setUniverse(e.target.value)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                >
                  {universes.map((u) => (
                    <option key={u.id} value={u.name} className="bg-[#12111f]">{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Top N & Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Konstituen Unggulan (Top N Saham)</label>
                <input
                  id="settings-topn-input"
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={topN}
                  onChange={(e) => setTopN(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-mono text-xs font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px]">Pilih Template Strategi</label>
                <select
                  id="settings-strategy-select"
                  value={strategyTemplate}
                  onChange={(e) => handleStrategyChange(e.target.value)}
                  className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                >
                  {strategies.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#12111f]">{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sliders allocation block */}
            <div className="space-y-4 pt-5 border-t border-[#1b1926]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider">Bobot Pengaman Alokasi Aset (Total 100%)</span>
                <span className={`font-mono font-extrabold text-sm ${totalAlloc === 100 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                  {totalAlloc}% / 100%
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Alokasi Saham', val: allocationSaham, set: setAllocationSaham },
                  { label: 'Alokasi Emas Batangan', val: allocationEmas, set: setAllocationEmas },
                  { label: 'Alokasi Kas IDR', val: allocationCash, set: setAllocationCash },
                  { label: 'Alokasi USD Cash', val: allocationUSD, set: setAllocationUSD },
                ].map((a) => (
                  <div key={a.label} className="grid grid-cols-4 items-center gap-4 py-1.5">
                    <span className="text-[11px] text-[#9f9bac] font-bold">{a.label}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={a.val}
                      onChange={(e) => a.set(parseInt(e.target.value))}
                      className="col-span-2 accent-[#ccff00] cursor-pointer"
                    />
                    <span className="text-right font-mono text-[#ccff00] font-extrabold text-sm">{a.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit btn */}
            <div className="pt-5 border-t border-[#1b1926] flex justify-end">
              <button
                id="save-settings-workbench-btn"
                type="submit"
                className="px-6 py-3 bg-[#ccff00] hover:bg-[#ddff33] text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98 transition-all"
              >
                <Save className="w-4 h-4 stroke-[2.5px]" /> Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info/Tips Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card card-elevated p-6 space-y-3 bg-[#0b0a10]/45">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-[#ccff00]" /> Aturan Diversifikasi Makro
            </h4>
            <p className="text-xs text-[#9f9bac] leading-relaxed font-sans">
              Model pembobotan SafeHeaven direkayasa untuk meminimalkan deviasi modal (drawdown). Mempertahankan porsi hedging minimum emas 20% adalah prasyarat naiknya ke Platinum Tier.
            </p>
          </div>

          <div className="card card-elevated p-6 space-y-3 bg-[#0b0a10]/45">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-[#00f0ff]" /> Bantuan Skenario
            </h4>
            <ul className="text-xs text-[#9f9bac] leading-relaxed space-y-2 list-disc pl-4 font-sans font-medium">
              <li>Gunakan menu <span className="text-white font-extrabold">Admin Console</span> untuk menguji ketahanan model Crash Shield.</li>
              <li>Parameter Top N meregulasi sebaran saham dalam kelompok penyaring scoring momentum.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
