import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const target = '<div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">';
const replacement = '</div>\n      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log("Fixed div");
}

fs.writeFileSync('src/pages/Backtest.tsx', content);
