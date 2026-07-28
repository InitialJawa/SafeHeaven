const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "TrendingDown",
  "TrendingDown,\n  DollarSign"
);

// Fix Item 1: Saham
const sahamOriginal = `               {/* Item 1: Saham */}
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
               </div>`;

const sahamNew = `               {/* Item 1: Saham */}
               <div className="p-3 rounded-xl bg-[#111018]/80 border border-[#1bfb7c]/20 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1bfb7c]/10 flex items-center justify-center text-[#1bfb7c]">
                       <LineChart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#1bfb7c] uppercase font-extrabold leading-none">Saham</p>
                      <p className="text-xs font-bold text-white mt-1">Fase Koreksi</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[9px] font-bold text-[#1bfb7c] bg-[#1bfb7c]/10 px-1.5 py-0.5 rounded">AVOID</span>
                 </div>
               </div>`;

// Fix Item 2: Emas
const emasOriginal = `               {/* Item 2: Emas */}
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
               </div>`;

const emasNew = `               {/* Item 2: Emas */}
               <div className="p-3 rounded-xl bg-[#ffbe3b]/10 border border-[#ffbe3b]/30 shadow-[0_0_15px_rgba(255,190,59,0.15)] flex items-center justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#ffbe3b]/20 to-transparent blur-md rounded-bl-full" />
                 <div className="flex items-center gap-2.5 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-[#ffbe3b]/20 flex items-center justify-center text-[#ffbe3b]">
                       <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#ffbe3b] uppercase font-extrabold leading-none">Emas</p>
                      <p className="text-xs font-bold text-white mt-1">Uptrend Kuat</p>
                    </div>
                 </div>
                 <div className="text-right relative z-10">
                    <span className="text-[9px] font-bold text-black bg-[#ffbe3b] px-1.5 py-0.5 rounded">REKOMENDASI</span>
                 </div>
               </div>`;

// Fix Item 3 & 4
const usdIdrOriginal = `               {/* Item 3 & 4: USD & IDR */}
               <div className="grid grid-cols-2 gap-2.5">
                 <div className="p-2.5 rounded-xl bg-[#111018]/80 border border-[#1b1926] flex items-center justify-between opacity-60">
                    <span className="text-[10px] text-[#9f9bac] font-bold">Cash USD</span>
                    <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-1.5 py-0.5 rounded">HOLD</span>
                 </div>
                 <div className="p-2.5 rounded-xl bg-[#111018]/80 border border-[#1b1926] flex items-center justify-between opacity-60">
                    <span className="text-[10px] text-[#9f9bac] font-bold">Cash IDR</span>
                    <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-1.5 py-0.5 rounded">HOLD</span>
                 </div>
               </div>`;

const usdIdrNew = `               {/* Item 3 & 4: USD & IDR */}
               <div className="grid grid-cols-2 gap-2.5">
                 <div className="p-2.5 rounded-xl bg-[#111018]/80 border border-[#545863]/30 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#545863]" />
                      <span className="text-[10px] text-[#545863] font-bold">Cash USD</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-1.5 py-0.5 rounded">HOLD</span>
                 </div>
                 <div className="p-2.5 rounded-xl bg-[#111018]/80 border border-[#9d1df2]/30 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-[#9d1df2]" />
                      <span className="text-[10px] text-[#9d1df2] font-bold">Cash IDR</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#686477] bg-white/5 px-1.5 py-0.5 rounded">HOLD</span>
                 </div>
               </div>`;

code = code.replace(sahamOriginal, sahamNew);
code = code.replace(emasOriginal, emasNew);
code = code.replace(usdIdrOriginal, usdIdrNew);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
