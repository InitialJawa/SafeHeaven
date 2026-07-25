import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const target = `            <div>
              <div className="flex justify-between">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#686477] mb-2">Jumlah Top N Saham</label>
                <span className="text-[10px] text-[#ccff00] font-bold">{topN} Saham</span>
              </div>
              <input type="range" min="1" max="50" value={topN} onChange={e => setTopN(Number(e.target.value))} className="w-full accent-[#ccff00]" />
            </div>`;

const replacement = target + `
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
                <label className="text-[9px] font-black uppercase tracking-widest text-[#686477]">
                  PROFIL STRATEGI (OTORITER/AUTO/DEFENSIF)
                </label>
              </div>
              <select value={strategyProfile} onChange={e => setStrategyProfile(e.target.value)} className="w-full bg-[#111018] border border-[#1b1926] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]/50">
                <option value="auto">Auto (Ikut Regime IHSG)</option>
                <option value="aggressive">Aggressive Momentum (Otoriter)</option>
                <option value="defensive">Defensive Value (Konservatif)</option>
                <option value="custom">Custom (Gunakan Template Manual)</option>
              </select>
            </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log("Replaced");
} else {
  console.log("Not found");
}

fs.writeFileSync('src/pages/Backtest.tsx', content);
