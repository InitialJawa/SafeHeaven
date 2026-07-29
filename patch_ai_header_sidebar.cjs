const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// Header replacement
const headerOld = `      {/* Header */}
      <div className="flex-none p-6 border-b border-[#222030] bg-[#111018]">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-3 tracking-tight">
              <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#ccff00]" />
              </div>
              <span>SafeHaven AI Manager</span>
            </h1>
            <p className="text-sm text-[#888899] mt-2">
              Pusat komando cerdas untuk analisis, strategi, dan wawasan pasar modal Anda.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#1a1926] p-1.5 rounded-xl border border-[#2f2d45]">
            <button
              onClick={() => setActiveTab('chat')}
              className={\`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all \${
                activeTab === 'chat' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={\`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all \${
                activeTab === 'prompts' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Prompts</span>
          </button>
            
          <button
              onClick={() => setActiveTab('settings')}
              className={\`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all \${
                activeTab === 'settings' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>`;

const headerNew = `      {/* Header */}
      <div className="flex-none p-4 lg:p-6 border-b border-[#222030] bg-[#111018] relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between max-w-screen-2xl mx-auto px-4 lg:px-8 gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
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
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-3 bg-[#1a1926] p-1 sm:p-1.5 rounded-xl border border-[#2f2d45] overflow-x-auto hide-scrollbar w-full md:w-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={\`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none justify-center whitespace-nowrap \${
                activeTab === 'chat' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={\`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none justify-center whitespace-nowrap \${
                activeTab === 'prompts' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved Prompts</span>
              <span className="sm:hidden">Prompts</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={\`px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none justify-center whitespace-nowrap \${
                activeTab === 'settings' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
              }\`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>`;

// Sidebar replacement
const sidebarOld = `          {/* History Sidebar (Desktop only) */}
          <div className="hidden lg:flex w-64 border-r border-[#222030] bg-[#0f0e15] flex-col h-full">`;

const sidebarNew = `          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* History Sidebar */}
          <div className={\`absolute lg:relative z-50 w-64 border-r border-[#222030] bg-[#0f0e15] flex-col h-full transform transition-transform duration-300 \${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex\`}>`;

if (code.includes(headerOld)) {
  code = code.replace(headerOld, headerNew);
  console.log("Header replaced.");
} else {
  console.log("Header NOT found.");
}

if (code.includes(sidebarOld)) {
  code = code.replace(sidebarOld, sidebarNew);
  console.log("Sidebar replaced.");
} else {
  console.log("Sidebar NOT found.");
}

fs.writeFileSync('src/pages/AiManager.tsx', code);
