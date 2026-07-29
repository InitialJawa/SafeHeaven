const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

const targetStr = `          <div className="flex items-center space-x-1 sm:space-x-3 bg-[#1a1926] p-1 sm:p-1.5 rounded-xl border border-[#2f2d45] overflow-x-auto hide-scrollbar w-full md:w-auto">
            
            <button
              onClick={() => setActiveTab('settings')}`;

const newStr = `          <div className="flex items-center space-x-1 sm:space-x-3 bg-[#1a1926] p-1 sm:p-1.5 rounded-xl border border-[#2f2d45] overflow-x-auto hide-scrollbar w-full md:w-auto">
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
              onClick={() => setActiveTab('settings')}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/AiManager.tsx', code);
  console.log("Fixed tabs successfully.");
} else {
  console.log("Could not find tabs target.");
}
