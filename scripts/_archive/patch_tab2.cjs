const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// Replace tab state
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<'chat' \| 'prompts' \| 'settings'>\('chat'\);/,
  "const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'vibe' | 'settings'>('chat');"
);

// Add Vibe tab button (after Prompts tab)
const promptsTabRegex = /<span>Saved Prompts<\/span>\s*<\/button>/;
const newButton = `<span>Saved Prompts</span>
          </button>
          <button
            onClick={() => setActiveTab('vibe')}
            className={\`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all \${
              activeTab === 'vibe' ? 'bg-[#222030] text-white shadow-sm' : 'text-[#888899] hover:text-white'
            }\`}
          >
            <Activity className="w-4 h-4" />
            <span>Vibe Trading</span>
          </button>`;
if (!code.includes("Vibe Trading")) {
  code = code.replace(promptsTabRegex, newButton);
}

// Add Vibe tab content
const tabContentEnd = `          )}
          
          </div>
        </div>
      </div>
    </div>
  );
};`;

const newContent = `          )}

          {activeTab === 'vibe' && (
            <div className="flex-1 p-8 overflow-y-auto">
              <VibeTradingAgent />
            </div>
          )}
          
          </div>
        </div>
      </div>
    </div>
  );
};`;

if (!code.includes("activeTab === 'vibe'")) {
  code = code.replace(tabContentEnd, newContent);
}

fs.writeFileSync('src/pages/AiManager.tsx', code);
console.log("Patched successfully");
