const fs = require('fs');

let content = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

content = content.replace(
  /<div className="w-8 h-8 rounded-lg bg-\[#ccff00\]\/10 border border-\[#ccff00\]\/20 flex items-center justify-center text-\[#ccff00\]">\s*<Filter className="w-4 h-4" \/>\s*<\/div>/g,
  ''
);

fs.writeFileSync('src/pages/Analytics.tsx', content);
