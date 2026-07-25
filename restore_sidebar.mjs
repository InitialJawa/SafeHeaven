import fs from 'fs';

let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex = /\{result && \(\s*<button\s*id="export-backtest-csv-btn"[\s\S]*?<\/button>\s*<\/div>\s*/;

const sidebarUI = `
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left Column: Config */}
        <div className="w-full lg:w-80 shrink-0 bg-[#060608] border-r border-[#1b1926] flex flex-col p-5 overflow-y-auto custom-scrollbar">
          <form onSubmit={runBacktest} className="space-y-5">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Strategy Template</label>
              <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50">
                {strategies.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Filter Universe</label>
              <select value={universe} onChange={e => setUniverse(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50">
                {universes.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Alokasi Modal Awal (Rp)</label>
              <input type="number" value={capital} onChange={e => setCapital(Number(e.target.value))} className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50" />
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Jumlah Top N Saham</label>
                <span className="text-[10px] text-[#ccff00] font-bold">{topN} Saham</span>
              </div>
              <input type="range" min="1" max="50" value={topN} onChange={e => setTopN(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Interval Penyeimbangan</label>
                <span className="text-[10px] text-[#ccff00] font-bold">{rebalanceDays} Hari</span>
              </div>
              <input type="range" min="5" max="90" value={rebalanceDays} onChange={e => setRebalanceDays(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Mode Rebalancing</label>
              <div className="grid grid-cols-2 gap-2">
                {['Buy & Hold', 'Periodic', 'Threshold', 'Dynamic'].map(m => (
                  <button key={m} type="button" onClick={() => setMode(m as any)} className={\`py-2 text-[10px] rounded-lg font-bold transition-all border \${mode === m ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' : 'bg-[#111018] border-[#1b1926] text-[#686477] hover:text-white'}\`}>
                    {m}
                  </button>
                ))}
              </div>
              {mode === 'Dynamic' && (
                <div className="mt-3 p-3 bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-lg">
                  <p className="text-[10px] text-[#ccff00] font-medium leading-relaxed">
                    <span className="font-bold">Multi-Tier Rotation Aktif:</span> Merotasi otomatis ke Saham, Emas, IDR/USD.
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Threshold Deviasi (%)</label>
                <span className="text-[10px] text-[#00f5a0] font-bold">±{threshold}%</span>
              </div>
              <input type="range" min="1" max="20" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full accent-[#00f5a0]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#ccff00]/50" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/> End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#ccff00]/50" />
              </div>
            </div>

            <button
              id="run-backtest-trigger-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] disabled:bg-white/5 disabled:text-[#4b5563] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Mensimulasi Sinyal...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current stroke-[2.5px]" /> Jalankan Backtest
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Results view column */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#060608] space-y-6 relative">
          <div className="flex items-center justify-between border-b border-[#1b1926] pb-4">
            <div className="flex gap-6 overflow-x-auto custom-scrollbar hide-scroll">
              <button
                onClick={() => setActiveTab('overview')}
                className={\`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap \${
                  activeTab === 'overview' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }\`}
              >
                <Activity className="w-3.5 h-3.5 inline-block mr-1" /> Performa
              </button>
              <button
                onClick={() => setActiveTab('stress')}
                className={\`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap \${
                  activeTab === 'stress' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }\`}
              >
                <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" /> Stress Test Krisis
              </button>
              <button
                onClick={() => setActiveTab('montecarlo')}
                className={\`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap \${
                  activeTab === 'montecarlo' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }\`}
              >
                <Dna className="w-3.5 h-3.5 inline-block mr-1" /> Monte Carlo (1K)
              </button>
              <button
                onClick={() => setActiveTab('heatmap')}
                className={\`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap \${
                  activeTab === 'heatmap' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }\`}
              >
                <Calendar className="w-3.5 h-3.5 inline-block mr-1" /> Heatmap Return
              </button>
              <button
                onClick={() => setActiveTab('trades')}
                className={\`pb-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap \${
                  activeTab === 'trades' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-[#686477] hover:text-white'
                }\`}
              >
                <Database className="w-3.5 h-3.5 inline-block mr-1" /> Transaksi ({result ? result.tradeMarkers.length : 0})
              </button>
            </div>
            
            {result && (
              <div className="flex items-center gap-2 mb-2 sm:mb-0 shrink-0">
                <button
                  id="export-backtest-csv-btn"
                  onClick={exportCSV}
                  className="text-[11px] bg-[#111018] hover:bg-[#ccff00]/10 text-[#ccff00] border border-[#1b1926] hover:border-[#ccff00]/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5px]" /> Export CSV
                </button>
              </div>
            )}
          </div>
`;

if (regex.test(content)) {
  content = content.replace(regex, sidebarUI);
  console.log("Restored successfully!");
} else {
  console.log("Regex did not match!");
}
fs.writeFileSync('src/pages/Backtest.tsx', content);
