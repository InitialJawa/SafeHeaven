const fs = require('fs');
let content = fs.readFileSync('src/pages/Settings.tsx', 'utf8');
content = content.replace(/<Bot className="w-4.5 h-4.5" \/>\s*<span>AI Engine API<\/span>/g, '<span>AI Engine API</span>');
fs.writeFileSync('src/pages/Settings.tsx', content);
