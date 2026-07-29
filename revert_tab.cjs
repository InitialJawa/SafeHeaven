const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// Remove VibeTradingAgent import
code = code.replace(/import \{ VibeTradingAgent \} from '\.\.\/components\/VibeTradingAgent';\n/, '');

// Change state back
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<'chat' \| 'prompts' \| 'vibe' \| 'settings'>\('chat'\);/,
  "const [activeTab, setActiveTab] = useState<'chat' | 'prompts' | 'settings'>('chat');"
);

// Remove the button
const buttonRegex = /<button[\s\n]*onClick=\{\(\) => setActiveTab\('vibe'\)\}[\s\S]*?<span>Vibe Trading<\/span>[\s\n]*<\/button>/;
code = code.replace(buttonRegex, '');

// Remove the content
const contentRegex = /\{activeTab === 'vibe' && \([\s\n]*<div className="flex-1 p-8 overflow-y-auto">[\s\n]*<VibeTradingAgent \/>[\s\n]*<\/div>[\s\n]*\)\}/;
code = code.replace(contentRegex, '');

fs.writeFileSync('src/pages/AiManager.tsx', code);
console.log("Reverted tab");
