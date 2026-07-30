const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// replace PanelLeft with History
code = code.replace('PanelLeft', 'History');
code = code.replace('PanelLeft', 'History'); // in case it's in the import list

const oldHeader = `          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white focus:outline-none bg-[#222030]/50 rounded-lg border border-[#222030]"
            >
              <History className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center space-x-2 lg:space-x-3 tracking-tight">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-[#ccff00]" />
                </div>
                <span>SafeHaven AI Manager</span>
              </h1>
              <p className="text-xs lg:text-sm text-[#888899] mt-1 lg:mt-2 hidden sm:block">
                Pusat komando cerdas untuk analisis, strategi, dan wawasan pasar modal Anda.
              </p>
            </div>
          </div>`;

const newHeader = `          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center space-x-2 lg:space-x-3 tracking-tight">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-[#ccff00]" />
                  </div>
                  <span>SafeHaven AI Manager</span>
                </h1>
                <p className="text-xs lg:text-sm text-[#888899] mt-1 lg:mt-2 hidden sm:block">
                  Pusat komando cerdas untuk analisis, strategi, dan wawasan pasar modal Anda.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ccff00] hover:text-black hover:bg-[#ccff00] focus:outline-none bg-[#ccff00]/10 rounded-lg border border-[#ccff00]/30 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>
          </div>`;

if (code.includes(oldHeader)) {
  code = code.replace(oldHeader, newHeader);
  fs.writeFileSync('src/pages/AiManager.tsx', code);
  console.log("Patched header toggle");
} else {
  console.log("Header not found");
}
