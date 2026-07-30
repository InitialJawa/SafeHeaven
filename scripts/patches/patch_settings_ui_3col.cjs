const fs = require('fs');
let code = fs.readFileSync('src/pages/Settings.tsx', 'utf-8');

const anchorStart = `{/* Grid 2: Top N, Strategy, Interval, Mode, Threshold */}`;
const anchorEnd = `              </div>
            )}

            {/* TAB 2: Notification Channels (WhatsApp, Email, Webhook) */}`;

const startIndex = code.indexOf(anchorStart);
const endIndex = code.indexOf(anchorEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{/* Row 2: Top N & Strategy */}\n                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans mt-4">
                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Konstituen Unggulan (Top N Saham)
                    </label>
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
                    <p className="text-[10px] text-[#686477]">Jumlah maksimum saham berperingkat skor tertinggi dalam alokasi.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" /> Profil Strategi Kuantitatif
                    </label>
                    <select
                      id="settings-strategy-profile-select"
                      value={strategyProfile === 'custom' ? \`custom:\${strategyTemplate}\` : strategyProfile}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith('custom:')) {
                          const stratId = val.replace('custom:', '');
                          const strat = strategies.find(s => s.id === stratId);
                          if (strat) {
                            setStrategyProfile('custom');
                            setStrategyTemplate(stratId);
                            toast.info(\`Strategi diubah ke template kustom: \${strat.name}\`);
                          }
                        } else {
                          const nameMap: Record<string, string> = {
                            auto: 'Auto Regime (IHSG)',
                            aggressive_momentum: 'Aggressive Momentum',
                            defensive_value: 'Defensive Value'
                          };
                          setStrategyProfile(val);
                          toast.info(\`Profil dinamis diaktifkan: \${nameMap[val] || val}\`);
                        }
                      }}
                      className="w-full bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]/40 font-bold"
                    >
                      <optgroup label="PROFIL DINAMIS (REGIME-BASED)" className="bg-[#12111f] text-amber-400 font-bold">
                        <option value="auto" className="bg-[#12111f] text-white">Auto (Ikut Regime IHSG)</option>
                        <option value="aggressive_momentum" className="bg-[#12111f] text-white">Aggressive Momentum (Otoriter)</option>
                        <option value="defensive_value" className="bg-[#12111f] text-white">Defensive Value (Konservatif)</option>
                      </optgroup>
                      <optgroup label="TEMPLATE KUSTOM MANUAL" className="bg-[#12111f] text-[#ccff00] font-bold">
                        {strategies.map((s) => (
                          <option key={s.id} value={\`custom:\${s.id}\`} className="bg-[#12111f] text-white">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <p className="text-[10px] text-[#686477]">Pilih profil otomasi AI berbasis regime pasar, atau gunakan template manual.</p>
                  </div>
                </div>

                {/* Row 3: Interval, Threshold, Mode (Sejajar) */}
                <div className={\`grid grid-cols-1 \${rebalanceMode !== 'Buy & Hold' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5 text-xs font-sans mt-5\`}>
                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-pink-400" /> Interval Penyeimbangan
                    </label>
                    <div className="flex items-center gap-4 bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 h-[42px]">
                      <input
                        type="range"
                        min="1"
                        max="90"
                        step="1"
                        value={rebalanceDays}
                        onChange={(e) => setRebalanceDays(parseInt(e.target.value))}
                        className="w-full accent-[#ccff00]"
                      />
                      <span className="text-[#ccff00] font-mono font-bold w-8 text-right">{rebalanceDays}</span>
                    </div>
                  </div>

                  {rebalanceMode !== 'Buy & Hold' && (
                    <div className="space-y-2">
                      <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Threshold Deviasi
                      </label>
                      <div className="flex items-center gap-4 bg-[#111018]/60 border border-[#1b1926] rounded-xl px-4 py-3 h-[42px]">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={thresholdDev}
                          onChange={(e) => setThresholdDev(parseInt(e.target.value))}
                          className="w-full accent-[#ccff00]"
                        />
                        <span className="text-[#ccff00] font-mono font-bold w-12 text-right">±{thresholdDev}%</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[#9f9bac] font-extrabold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" /> Mode Rebalancing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRebalanceMode('Buy & Hold')}
                        className={\`py-2.5 rounded-xl text-xs font-bold transition-all border \${
                          rebalanceMode === 'Buy & Hold' ? 'bg-[#ccff00]/10 border-[#ccff00]/50 text-[#ccff00]' : 'bg-[#111018]/60 border-[#1b1926] text-[#9f9bac] hover:text-white'
                        }\`}
                      >
                        Buy&Hold
                      </button>
                      <button
                        type="button"
                        onClick={() => setRebalanceMode('Periodic')}
                        className={\`py-2.5 rounded-xl text-xs font-bold transition-all border \${
                          rebalanceMode === 'Periodic' ? 'bg-[#ccff00]/10 border-[#ccff00]/50 text-[#ccff00]' : 'bg-[#111018]/60 border-[#1b1926] text-[#9f9bac] hover:text-white'
                        }\`}
                      >
                        Periodic
                      </button>
                      <button
                        type="button"
                        onClick={() => setRebalanceMode('Dynamic')}
                        className={\`py-2.5 rounded-xl text-xs font-bold transition-all border \${
                          rebalanceMode === 'Dynamic' ? 'bg-[#ccff00]/10 border-[#ccff00]/50 text-[#ccff00]' : 'bg-[#111018]/60 border-[#1b1926] text-[#9f9bac] hover:text-white'
                        }\`}
                      >
                        Dynamic
                      </button>
                    </div>
                  </div>
                </div>\n`;
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/pages/Settings.tsx', code);
  console.log("Patched successfully.");
} else {
  console.log("Anchors not found");
}
