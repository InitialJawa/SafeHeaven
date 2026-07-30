const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// We need to replace the entire Header and Main Content Area structure.
// To be safe, we'll extract the code blocks and replace them.

// 1. Remove the "Riwayat" button from the header
const headerButtonOld = `            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ccff00] hover:text-black hover:bg-[#ccff00] focus:outline-none bg-[#ccff00]/10 rounded-lg border border-[#ccff00]/30 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>`;
code = code.replace(headerButtonOld, '');

// 2. Add the History tab to the tabs section
const chatTabRegex = /<button[\s\S]*?onClick=\{\(\) => setActiveTab\('chat'\)\}[\s\S]*?<\/button>/;
const match = code.match(chatTabRegex);
if (match) {
  const historyTab = `            <button
              onClick={() => setActiveTab('history')}
              className={\`lg:hidden px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none justify-center whitespace-nowrap \${
                activeTab === 'history' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Riwayat</span>
              <span className="sm:hidden">Riwayat</span>
            </button>\n`;
  code = code.replace(match[0], match[0] + "\n" + historyTab);
}

// 3. Fix the Sidebar
const sidebarOldStart = `          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* History Sidebar */}
          <div className={\`absolute lg:relative z-50 w-64 border-r border-[#222030] bg-[#0f0e15] flex-col h-full transform transition-transform duration-300 \${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex\`}>`;

const sidebarNewStart = `          {/* History Sidebar (Desktop) */}
          <div className="hidden lg:flex w-64 border-r border-[#222030] bg-[#0f0e15] flex-col h-full">`;

if (code.includes(sidebarOldStart)) {
  code = code.replace(sidebarOldStart, sidebarNewStart);
}

// Also change the onClick handler for the desktop/mobile history to set activeTab to chat
const oldHistoryItemClick = `                    onClick={() => {
                      handleSelectSession(sess.id);
                      setIsSidebarOpen(false);
                    }}`;
const newHistoryItemClick = `                    onClick={() => {
                      handleSelectSession(sess.id);
                      setActiveTab('chat');
                    }}`;
code = code.replace(oldHistoryItemClick, newHistoryItemClick);

// 4. Add the Mobile History view inside the content area
// Wait, we can just use one unified history renderer.
// Actually, it's easier to just extract the History component into a separate function, but since it's a single file,
// we can just render the Mobile History View right below the Desktop one.
const mobileHistoryRenderer = `
          {/* Mobile History View */}
          {activeTab === 'history' && (
            <div className="lg:hidden flex-1 w-full bg-[#0f0e15] flex flex-col h-full">
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
              <div className="flex-1 overflow-y-auto p-4">
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
                        className="opacity-100 lg:opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 text-zinc-500 transition-opacity"
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
`;

// Insert the mobile renderer after the closing div of the desktop sidebar
// We'll locate the closing div of the sidebar, which is right before `{/* Content Panel */}`
const contentPanelStart = `          {/* Content Panel */}`;
if (code.includes(contentPanelStart)) {
  code = code.replace(contentPanelStart, mobileHistoryRenderer + "\n          {/* Content Panel */}\n          <div className={`flex-1 flex flex-col h-full bg-[#0b0a10] overflow-hidden ${activeTab === 'history' ? 'hidden lg:flex' : ''}`}>\n          {/* Old Content Panel Start */}");
}

// But wait, the original code doesn't have `{/* Content Panel */}` exactly like that.
// Let's check what's after the sidebar.
fs.writeFileSync('patch_ai_layout.cjs.tmp', code);
