const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const newTopRow = `
        {/* TOP ROW: Visual Cards and Currency Switchers (Bento Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Bento Card 1: SafeHeaven Signature Wallet & Cockpit (8 Cols) */}
          <div className="card card-elevated p-6 lg:col-span-8 flex flex-col justify-between bg-[#0b0a10]/45 border border-[#1b1926] space-y-4">
            <div className="flex flex-row justify-between items-start">
              <div>
                <h4 className="text-xs font-bold uppercase text-[#9f9bac] tracking-wider font-sans">Kartu Manajemen Dana & Quick Actions</h4>
                <p className="text-[10px] text-[#686477] mt-0.5">Akses saldo aktif, transfer cepat, dan kontrol kokpit portofolio utama.</p>
              </div>
              <div className="pt-1 text-[9px] text-[#686477] flex items-center gap-2">
                 <span className="font-mono">Pusat Pintar</span>
                 <span className="font-mono text-[#ccff00]">Autopilot ON</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
              {/* Wallet Left */}
              <div className="select-none flex justify-center lg:col-span-7">
                <PhysicalWallet 
                  capital={capital}
                  strategyName={portfolioConfig?.strategyName || 'IMAM NASRULLOH'}
                  onTopUp={() => {
                    toast.success('Pintu Deposit Instan siap di Settings Workbench.');
                    setLocation('/settings');
                  }}
                  onTransfer={() => {
                    toast.info('Modul Transfer diaktifkan. Pilih instrumen bursa tujuan.');
                    setLocation('/portfolio');
                  }}
                />
              </div>

              {/* Actions Right */}
              <div className="grid grid-cols-2 gap-3 lg:col-span-5">
                <button
                  id="action-quick-transfer"
                  onClick={() => {
                    toast.success('Modul Transfer Instan (IDR/USD) dibuka.');
                    setLocation('/portfolio');
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group"
                >
                  <Send className="w-5 h-5 text-[#00f5a0] mb-2 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[11px] font-bold">Kirim Dana</span>
                </button>

                <button
                  id="action-quick-rebalance"
                  onClick={handleQuickRebalance}
                  disabled={rebalancing}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group disabled:opacity-55"
                >
                  <RefreshCw className={\`w-5 h-5 text-[#00f0ff] mb-2 group-hover:rotate-180 transition-all \${rebalancing ? 'animate-spin' : ''}\`} />
                  <span className="text-[11px] font-bold">Rebalance</span>
                </button>

                <button
                  id="action-card-alerts"
                  onClick={() => {
                    setLocation('/alerts');
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group"
                >
                  <Bell className="w-5 h-5 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Alerts</span>
                </button>

                <button
                  id="action-card-compare"
                  onClick={() => setLocation('/compare')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#111018] border border-[#1b1926] hover:border-[#ccff00]/40 text-[#9f9bac] hover:text-white transition-all text-center cursor-pointer group"
                >
                  <Sliders className="w-5 h-5 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">Bandingkan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Multi-Tier Rotation (4 Cols) */}
          <div className="card card-elevated p-6 lg:col-span-4 flex flex-col justify-between space-y-4 bg-[#0b0a10]/45 border border-[#1b1926]">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#00f0ff]" />
                  <h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Multi-Tier Rotation</h4>
                </div>
                <p className="text-[10px] text-[#686477] mt-0.5">Rotasi aset dinamis (Jaring Pengaman).</p>
              </div>
              <button
                onClick={() => setLocation('/optimize')}
                className="text-[10px] font-extrabold text-[#ccff00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Walk Forward <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 my-auto">
               {/* Item 1: Saham */}
               <div className="p-3 rounded-xl bg-[#111018]/80 border border-red-500/20 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                       <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#9f9bac] uppercase font-extrabold leading-none">Saham</p>
                      <p className="text-xs font-bold text-white mt-1">Fase Koreksi</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[9px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">AVOID</span>
                 </div>
               </div>

               {/* Item 2: Emas */}
               <div className="p-3 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 shadow-[0_0_15px_rgba(204,255,0,0.1)] flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#ccff00]/20 to-transparent blur-md rounded-bl-full" />
                 <div className="flex items-center gap-2.5 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
                       <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#ccff00] uppercase font-extrabold leading-none">Emas</p>
                      <p className="text-xs font-bold text-white mt-1">Uptrend Kuat</p>
                    </div>
                 </div>
                 <div className="text-right relative z-10">
                    <span className="text-[9px] font-bold text-black bg-[#ccff00] px-1.5 py-0.5 rounded">REKOMENDASI</span>
                 </div>
               </div>

               {/* Item 3 & 4: USD & IDR */}
               <div className="grid grid-cols-2 gap-2.5">
                 <div className="p-2.5 rounded-xl bg-[#111018]/80 border border-[#1b1926] flex items-center justify-between opacity-60">
                    <span className="text-[10px] text-[#9f9bac] font-bold">Cash USD</span>
                    <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-1.5 py-0.5 rounded">HOLD</span>
                 </div>
                 <div className="p-2.5 rounded-xl bg-[#111018]/80 border border-[#1b1926] flex items-center justify-between opacity-60">
                    <span className="text-[10px] text-[#9f9bac] font-bold">Cash IDR</span>
                    <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-1.5 py-0.5 rounded">HOLD</span>
                 </div>
               </div>
            </div>

            <div className="pt-2 border-t border-[#1b1926] flex items-center justify-between text-[9px] text-[#686477]">
              <span>Alokasi mengikuti</span>
              <span className="text-[#ccff00] font-bold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setLocation('/settings')}><CheckCircle className="w-3 h-3"/> Active Strategy</span>
            </div>
          </div>
        </div>
`;

// we need to replace from `{/* TOP ROW: Visual Cards and Currency Switchers (Bento Grid) */}`
// down to `{/* SECOND ROW: Chart and Allocation Allocation (Bento Grid) */}` exclusive

const startStr = "{/* TOP ROW: Visual Cards and Currency Switchers (Bento Grid) */}";
const endStr = "{/* SECOND ROW: Chart and Allocation Allocation (Bento Grid) */}";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newTopRow + '\n        ' + code.substring(endIndex);
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
  console.log('Patched top row successfully!');
} else {
  console.log('Failed to find start or end strings.');
}
