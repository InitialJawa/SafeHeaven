const fs = require('fs');
let content = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

content = content.replace(
  /<span className="text-\[9px\] font-bold text-\[#ccff00\] bg-\[#ccff00\]\/10 px-2 py-0\.5 rounded-full border border-\[#ccff00\]\/20">/g,
  '<span className="text-[9px] font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20 whitespace-nowrap shrink-0">'
);

fs.writeFileSync('src/pages/Analytics.tsx', content);
