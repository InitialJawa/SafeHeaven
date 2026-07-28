const fs = require('fs');
let content = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

content = content.replace(
  /<div className="flex items-center gap-2">\s*<h3 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Semesta Saham \(Universe Index\)<\/h3>/g,
  '<div className="flex flex-wrap items-center gap-2">\s*<h3 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Semesta Saham (Universe Index)</h3>'
);

fs.writeFileSync('src/pages/Analytics.tsx', content);
