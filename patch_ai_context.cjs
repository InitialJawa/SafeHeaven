const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

const targetStr = `              {/* Input Area */}
              <div className="p-6 bg-[#111018] border-t border-[#222030] flex flex-col gap-3">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full">
                  <div className="absolute left-4 top-4 flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-1.5 text-[#686880] hover:text-white hover:bg-[#222030] rounded-md transition-colors"
                      title="Clear Chat"
                      onClick={clearChatMessages}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanyakan analisis saham, review portfolio, atau strategi makro..."
                    className="w-full bg-[#1a1926] border border-[#2f2d45] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl pl-14 pr-14 py-4 text-sm text-white placeholder-[#686880] resize-none h-14 overflow-hidden transition-all shadow-inner"
                    rows={1}
                  />
                  
                  <button
                    type="submit"
                    disabled={!input.trim() || chatLoading}
                    className="absolute right-3 top-2.5 p-2 bg-[#ccff00] text-black hover:bg-[#b2e000] disabled:opacity-50 disabled:hover:bg-[#ccff00] rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                
                {/* Context Attachments */}
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
                </div>
              </div>`;

const newStr = `              {/* Input Area */}
              <div className="p-4 lg:p-6 bg-[#111018] border-t border-[#222030]">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto w-full">
                  <div className="absolute left-3 lg:left-4 top-3 lg:top-4 flex items-center space-x-2 z-10">
                    <button
                      type="button"
                      className="p-1.5 text-[#686880] hover:text-white hover:bg-[#222030] rounded-md transition-colors"
                      title="Clear Chat"
                      onClick={clearChatMessages}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanyakan analisis saham, review portfolio..."
                    className="w-full bg-[#1a1926] border border-[#2f2d45] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl pl-12 lg:pl-14 pr-12 lg:pr-14 py-3 lg:py-4 text-sm text-white placeholder-[#686880] resize-none h-12 lg:h-14 overflow-hidden transition-all shadow-inner"
                    rows={1}
                  />
                  
                  <button
                    type="submit"
                    disabled={!input.trim() || chatLoading}
                    className="absolute right-2 lg:right-3 top-1.5 lg:top-2.5 p-2 bg-[#ccff00] text-black hover:bg-[#b2e000] disabled:opacity-50 disabled:hover:bg-[#ccff00] rounded-lg transition-colors flex items-center justify-center z-10"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/AiManager.tsx', code);
  console.log("Patched input area, removed context");
} else {
  console.log("Target not found");
}
