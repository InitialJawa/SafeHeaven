import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex2 = /<button[\s\S]*?<Maximize2 className="w-3\.5 h-3\.5" \/> Studio Layar Penuh[\s\S]*?<\/button>/g;
content = content.replace(regex2, '');

fs.writeFileSync('src/pages/Backtest.tsx', content);
