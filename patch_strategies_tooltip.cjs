const fs = require('fs');
let content = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');

const targetStr = `<label className="flex items-center cursor-pointer gap-2" title="Aktifkan Auto Dinamis (Rotasi Taktis)">
                      <div className={\`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors \${autoAllocation ? 'bg-[#ccff00]' : 'bg-[#1b1926]'}\`}>
                        <input type="checkbox" className="hidden" checked={autoAllocation} onChange={(e) => setAutoAllocation(e.target.checked)} />
                        <div className={\`bg-black w-3 h-3 rounded-full shadow-md transform transition-transform \${autoAllocation ? 'translate-x-4' : 'translate-x-0'}\`}></div>
                      </div>
                      <span className={\`text-[10px] font-bold \${autoAllocation ? 'text-[#ccff00]' : 'text-[#686477]'}\`}>AUTO</span>
                    </label>`;

const replacementStr = `<div className="flex items-center gap-2 relative">
                      <label className="flex items-center cursor-pointer gap-2" title="Aktifkan Auto Dinamis (Rotasi Taktis)">
                        <div className={\`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors \${autoAllocation ? 'bg-[#ccff00]' : 'bg-[#1b1926]'}\`}>
                          <input type="checkbox" className="hidden" checked={autoAllocation} onChange={(e) => setAutoAllocation(e.target.checked)} />
                          <div className={\`bg-black w-3 h-3 rounded-full shadow-md transform transition-transform \${autoAllocation ? 'translate-x-4' : 'translate-x-0'}\`}></div>
                        </div>
                        <span className={\`text-[10px] font-bold \${autoAllocation ? 'text-[#ccff00]' : 'text-[#686477]'}\`}>AUTO</span>
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
                    </div>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/pages/Strategies.tsx', content);
