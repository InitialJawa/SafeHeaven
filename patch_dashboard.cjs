const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Multi-Tier Rotation System
content = content.replace(
  /<div className="flex items-center gap-2">\s*<RefreshCw className="w-4 h-4 text-\[#00f0ff\]" \/>\s*<h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Multi-Tier Rotation System<\/h4>\s*<\/div>/g,
  '<h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Multi-Tier Rotation System</h4>'
);

// 2. Riwayat Rotasi & Sinyal Alarm
content = content.replace(
  /<div className="flex items-center gap-2">\s*<Bell className="w-4.5 h-4.5 text-\[#ccff00\]" \/>\s*(<div>\s*<h3 className="text-sm font-bold text-white tracking-tight font-sans">Riwayat Rotasi & Sinyal Alarm<\/h3>\s*<p className="text-\[11px\] text-\[#686477\] font-sans">Log pergerakan rotasi dinamis, alarm harga, dan aksi jaring pengaman\.<\/p>\s*<\/div>)\s*<\/div>/g,
  '$1'
);

// 3. Analisis IHSG Terpadu
content = content.replace(
  /<div className="flex items-center gap-2">\s*<span className="w-1.5 h-3.5 bg-\[#ccff00\] rounded-full"><\/span>\s*<h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Analisis IHSG Terpadu \(Yahoo Finance Live\)<\/h4>\s*<\/div>/g,
  '<h4 className="text-xs font-bold uppercase text-white tracking-wider font-sans">Analisis IHSG Terpadu (Yahoo Finance Live)</h4>'
);

// 4. IHSG Tabs - remove icons
content = content.replace(/<Gauge className="w-3\.5 h-3\.5" \/>\s*<span>Speedometer<\/span>/g, '<span>Speedometer</span>');
content = content.replace(/<BarChart2 className="w-3\.5 h-3\.5" \/>\s*<span>Kinerja & Musiman<\/span>/g, '<span>Kinerja & Musiman</span>');

fs.writeFileSync('src/pages/Dashboard.tsx', content);
