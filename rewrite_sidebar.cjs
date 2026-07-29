const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// 1. Remove the Riwayat button
const headerOld = `          <div className="flex items-center justify-between w-full md:w-auto">
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
          
const headerNew = `          <div className="flex items-center justify-between w-full md:w-auto">
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
          </div>`;

code = code.replace(headerOld, headerNew);

// 2. Add History Tab
const tabRegex = /<button\s+onClick=\{\(\) => setActiveTab\('prompts'\)\}[\s\S]*?<\/button>/;
const match = code.match(tabRegex);
if (match) {
  const historyTab = `
            <button
              onClick={() => setActiveTab('history')}
              className={\`lg:hidden px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none justify-center whitespace-nowrap \${
                activeTab === 'history' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>`;
  code = code.replace(match[0], match[0] + historyTab);
}

// 3. Rewrite Sidebar section
const oldMainAreaStr = `      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="max-w-screen-2xl mx-auto h-full flex">
          
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* History Sidebar */}
          <div className={\`absolute lg:relative z-50 w-64 border-r border-[#222030] bg-[#0f0e15] flex-col h-full transform transition-transform duration-300 \${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex\`}>
            <div className="p-4 border-b border-[#222030]">
              <button 
                onClick={handleNewSession}
                className="w-full py-2 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 rounded-lg flex items-center justify-center space-x-2 text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Chat Baru</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <h3 className="text-[10px] uppercase tracking-wider text-[#686880] font-bold mb-3 px-2">Sesi Tersimpan</h3>
              <div className="space-y-1">
                {chatSessions.map(sess => (
                  <div 
                    key={sess.id}
                    onClick={() => {
                      handleSelectSession(sess.id);
                      setIsSidebarOpen(false);
                    }}
                    className={\`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer \${
                      currentSessionId === sess.id 
                        ? 'bg-[#222030]/50 text-white border border-[#222030]' 
                        : 'text-[#888899] hover:bg-[#222030]/50 border border-transparent'
                    }\`}
                  >
                    <span className="truncate flex-1">{sess.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(sess.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-zinc-500 transition-opacity"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 h-full flex flex-col">`;

const newMainAreaStr = `      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="max-w-screen-2xl mx-auto h-full flex">
          
          {/* Desktop History Sidebar */}
          <div className="hidden lg:flex w-64 border-r border-[#222030] bg-[#0f0e15] flex-col h-full">
            <div className="p-4 border-b border-[#222030]">
              <button 
                onClick={handleNewSession}
                className="w-full py-2 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 rounded-lg flex items-center justify-center space-x-2 text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Chat Baru</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <h3 className="text-[10px] uppercase tracking-wider text-[#686880] font-bold mb-3 px-2">Sesi Tersimpan</h3>
              <div className="space-y-1">
                {chatSessions.map(sess => (
                  <div 
                    key={sess.id}
                    onClick={() => {
                      handleSelectSession(sess.id);
                    }}
                    className={\`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer \${
                      currentSessionId === sess.id 
                        ? 'bg-[#222030]/50 text-white border border-[#222030]' 
                        : 'text-[#888899] hover:bg-[#222030]/50 border border-transparent'
                    }\`}
                  >
                    <span className="truncate flex-1">{sess.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(sess.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-zinc-500 transition-opacity"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile History View */}
          {activeTab === 'history' && (
            <div className="flex-1 lg:hidden flex flex-col h-full bg-[#0b0a10] overflow-y-auto w-full">
              <div className="p-4 border-b border-[#222030]">
                <button 
                  onClick={() => {
                    handleNewSession();
                    setActiveTab('chat');
                  }}
                  className="w-full py-3 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 rounded-xl flex items-center justify-center space-x-2 text-sm font-bold transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Chat Baru</span>
                </button>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-xs uppercase tracking-wider text-[#686880] font-bold mb-4 px-2">Sesi Tersimpan</h3>
                <div className="space-y-2">
                  {chatSessions.map(sess => (
                    <div 
                      key={sess.id}
                      onClick={() => {
                        handleSelectSession(sess.id);
                        setActiveTab('chat');
                      }}
                      className={\`group w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer \${
                        currentSessionId === sess.id 
                          ? 'bg-[#222030]/50 text-white border border-[#222030]' 
                          : 'text-[#888899] hover:bg-[#222030]/50 border border-transparent'
                      }\`}
                    >
                      <span className="truncate flex-1">{sess.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(sess.id);
                        }}
                        className="p-2 hover:text-red-400 text-zinc-500 transition-opacity"
                        title="Hapus Sesi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Panel Area */}
          <div className={\`flex-1 h-full flex flex-col \${activeTab === 'history' ? 'hidden lg:flex' : 'flex'}\`}>`;

code = code.replace(oldMainAreaStr, newMainAreaStr);

fs.writeFileSync('src/pages/AiManager.tsx', code);
console.log("Rewrote sidebar into a tab successfully!");
