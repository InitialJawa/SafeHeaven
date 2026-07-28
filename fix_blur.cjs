const fs = require('fs');
let content = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');
content = content.replace(
  /<div className="space-y-3 relative overflow-hidden rounded-lg p-2 -mx-2">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Threshold controls \*\/\}/g,
  `<div className="relative mt-3">
                  {autoAllocation && (
                    <div className="absolute inset-[-10px] z-10 bg-[#0b0a10]/70 backdrop-blur-sm flex items-center justify-center rounded-xl border border-[#ccff00]/20">
                      <div className="bg-[#111018] px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.15)] border border-[#ccff00]/30">
                        <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></div>
                        <span className="text-[#ccff00] font-bold text-xs">Auto Dinamis</span>
                      </div>
                    </div>
                  )}
                  <div className={\`space-y-4 p-3 rounded-xl transition-all \${autoAllocation ? 'opacity-30 pointer-events-none' : 'bg-[#111018]/30 border border-[#1b1926]'}\`}>
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

              {/* Threshold controls */}`
);
fs.writeFileSync('src/pages/Strategies.tsx', content);
