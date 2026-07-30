const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

const targetStr = `                {/* Context Attachments */}
                <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 sm:gap-4 px-2">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xs text-[#888899] font-medium uppercase tracking-wider hidden sm:inline">Context:</span>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="form-checkbox rounded bg-[#1a1926] border-[#2f2d45] text-[#ccff00] focus:ring-[#ccff00] focus:ring-offset-0 focus:ring-offset-transparent w-4 h-4 transition-colors cursor-pointer"
                        checked={includePortfolio}
                        onChange={(e) => setIncludePortfolio(e.target.checked)}
                      />
                      <span className="text-xs text-[#a0a0b0] group-hover:text-white transition-colors">Data Portfolio</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="form-checkbox rounded bg-[#1a1926] border-[#2f2d45] text-[#ccff00] focus:ring-[#ccff00] focus:ring-offset-0 focus:ring-offset-transparent w-4 h-4 transition-colors cursor-pointer"
                        checked={includeWatchlist}
                        onChange={(e) => setIncludeWatchlist(e.target.checked)}
                      />
                      <span className="text-xs text-[#a0a0b0] group-hover:text-white transition-colors">Data Watchlist</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:ml-auto w-full sm:w-auto">
                    <span className="text-xs text-[#888899] whitespace-nowrap">Fokus Saham:</span>
                    <select
                      value={selectedTicker}
                      onChange={(e) => setSelectedTicker(e.target.value)}
                      className="bg-[#1a1926] border border-[#2f2d45] text-white text-xs rounded-lg px-3 py-2 sm:py-1.5 focus:outline-none focus:border-[#ccff00] w-full sm:w-auto"
                    >
                      <option value="">-- Pilih Ticker --</option>
                      {tickers.slice(0, 15).map(t => (
                        <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>`;

const newStr = `                {/* Context Attachments */}
                <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-3 px-2">
                  <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
                    <span className="text-[10px] md:text-xs text-[#888899] font-medium uppercase tracking-wider shrink-0">Context:</span>
                    <label className="flex items-center space-x-1.5 cursor-pointer group shrink-0">
                      <input 
                        type="checkbox" 
                        className="form-checkbox rounded bg-[#1a1926] border-[#2f2d45] text-[#ccff00] focus:ring-[#ccff00] focus:ring-offset-0 focus:ring-offset-transparent w-3.5 h-3.5 md:w-4 md:h-4 transition-colors cursor-pointer"
                        checked={includePortfolio}
                        onChange={(e) => setIncludePortfolio(e.target.checked)}
                      />
                      <span className="text-[10px] md:text-xs text-[#a0a0b0] group-hover:text-white transition-colors">Portfolio</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer group shrink-0">
                      <input 
                        type="checkbox" 
                        className="form-checkbox rounded bg-[#1a1926] border-[#2f2d45] text-[#ccff00] focus:ring-[#ccff00] focus:ring-offset-0 focus:ring-offset-transparent w-3.5 h-3.5 md:w-4 md:h-4 transition-colors cursor-pointer"
                        checked={includeWatchlist}
                        onChange={(e) => setIncludeWatchlist(e.target.checked)}
                      />
                      <span className="text-[10px] md:text-xs text-[#a0a0b0] group-hover:text-white transition-colors">Watchlist</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
                    <span className="text-[10px] md:text-xs text-[#888899] whitespace-nowrap">Fokus:</span>
                    <select
                      value={selectedTicker}
                      onChange={(e) => setSelectedTicker(e.target.value)}
                      className="flex-1 md:flex-none bg-[#1a1926] border border-[#2f2d45] text-white text-[10px] md:text-xs rounded-lg px-2 md:px-3 py-1.5 focus:outline-none focus:border-[#ccff00] appearance-none"
                    >
                      <option value="">-- Pilih Ticker --</option>
                      {tickers.slice(0, 15).map(t => (
                        <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/AiManager.tsx', code);
  console.log("Patched context attachments");
} else {
  console.log("Context attachments not found");
}
