const fs = require('fs');

let content = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

content = content.replace(
  /<div className="card card-elevated p-4 bg-\[#0b0a10\]\/60 border border-\[#1b1926\] flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl">/g,
  '<div className="card card-elevated p-4 bg-[#0b0a10]/60 border border-[#1b1926] flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl overflow-hidden">'
);

content = content.replace(
  /<div className="flex items-center gap-3">/g,
  '<div className="flex items-center gap-3 min-w-0">'
);

content = content.replace(
  /<div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">/g,
  '<div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar w-full lg:w-auto">'
);

fs.writeFileSync('src/pages/Analytics.tsx', content);
