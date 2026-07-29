const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// 1. Add state for mobile session dropdown
const stateInsert = `  const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'history' | 'settings'>('chat');`;
const stateNew = `  const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'history' | 'settings'>('chat');\n  const [isMobileSessionDropdownOpen, setIsMobileSessionDropdownOpen] = useState(false);`;

if(code.includes(stateInsert)) {
  code = code.replace(stateInsert, stateNew);
}

// 2. Change the History tab - actually, since we have the dropdown now, we can remove the 'history' tab from the active tabs on mobile
const historyTabRegex = /<button[\s\S]*?onClick=\{\(\) => setActiveTab\('history'\)\}[\s\S]*?<\/button>/;
const match = code.match(historyTabRegex);
if(match) {
  code = code.replace(match[0], ''); // Remove history tab entirely
}

// 3. Remove Mobile History View in Content Area
const mobileHistoryView = `          {/* Mobile History View */}
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
          )}`;
code = code.replace(mobileHistoryView, '');

// Also fix the flex classes for the main chat area
const mainPanelStr = `          <div className={\`flex-1 h-full flex flex-col \${activeTab === 'history' ? 'hidden lg:flex' : 'flex'}\`}>`;
code = code.replace(mainPanelStr, `          <div className="flex-1 h-full flex flex-col">`);

// 4. Update Header
const headerTarget = `      {/* Header */}
      <div className="flex-none p-4 lg:p-6 border-b border-[#222030] bg-[#111018] relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between max-w-screen-2xl mx-auto px-4 lg:px-8 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
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

const currentSessionTitleCode = `chatSessions.find(s => s.id === currentSessionId)?.title || 'Chat Baru'`;

const newHeader = `      {/* Header */}
      <div className="flex-none p-3 lg:p-6 border-b border-[#222030] bg-[#111018] relative z-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between max-w-screen-2xl mx-auto px-2 lg:px-8 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto relative">
            
            {/* Desktop Branding */}
            <div className="hidden lg:flex items-center space-x-3">
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

            {/* Mobile Minimalist Session Dropdown */}
            <div className="lg:hidden flex-1 relative">
              <button
                onClick={() => setIsMobileSessionDropdownOpen(!isMobileSessionDropdownOpen)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl hover:bg-[#222030] transition-colors"
              >
                <div className="w-6 h-6 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#ccff00]" />
                </div>
                <span className="text-white font-semibold text-base truncate max-w-[200px]">
                  {${currentSessionTitleCode}}
                </span>
                <ChevronDown className={\`w-4 h-4 text-[#888899] transition-transform \${isMobileSessionDropdownOpen ? 'rotate-180' : ''}\`} />
              </button>

              {/* Dropdown Overlay */}
              {isMobileSessionDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30 bg-black/50" 
                    onClick={() => setIsMobileSessionDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#1a1926] border border-[#2f2d45] rounded-2xl shadow-xl overflow-hidden max-h-[60vh] flex flex-col">
                    <div className="p-2 border-b border-[#2f2d45]">
                      <button 
                        onClick={() => {
                          handleNewSession();
                          setIsMobileSessionDropdownOpen(false);
                          setActiveTab('chat');
                        }}
                        className="w-full py-2.5 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/30 rounded-xl flex items-center justify-center space-x-2 text-sm font-bold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Chat Baru</span>
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                      <div className="space-y-1">
                        {chatSessions.map(sess => (
                          <div 
                            key={sess.id}
                            onClick={() => {
                              handleSelectSession(sess.id);
                              setIsMobileSessionDropdownOpen(false);
                              setActiveTab('chat');
                            }}
                            className={\`group w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer \${
                              currentSessionId === sess.id 
                                ? 'bg-[#222030] text-white' 
                                : 'text-[#888899] hover:bg-[#222030]/50'
                            }\`}
                          >
                            <span className="truncate flex-1">{sess.title}</span>
                            {currentSessionId === sess.id && (
                               <Check className="w-4 h-4 text-[#ccff00] shrink-0 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>`;

if(code.includes(headerTarget)) {
  code = code.replace(headerTarget, newHeader);
} else {
  console.log("Header target not found!");
}

// 5. Add ChevronDown, Check to lucide imports if missing
const importRegex = /import\s+\{[^}]+\}\s+from\s+['"]lucide-react['"];/;
const importMatch = code.match(importRegex);
if(importMatch) {
  let importStr = importMatch[0];
  if(!importStr.includes('ChevronDown')) {
    importStr = importStr.replace('}', ', ChevronDown }');
  }
  if(!importStr.includes('Check')) {
    importStr = importStr.replace('}', ', Check }');
  }
  code = code.replace(importMatch[0], importStr);
}

fs.writeFileSync('src/pages/AiManager.tsx', code);
console.log("Patched mobile header session dropdown");
