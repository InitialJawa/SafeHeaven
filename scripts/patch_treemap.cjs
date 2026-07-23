const fs = require('fs');
let code = fs.readFileSync('src/components/AssetTreemap.tsx', 'utf8');

code = code.replace(
  '<div className="text-[9px] text-[#686477] font-mono text-center pt-3 border-t border-[#1b1926]/40">',
  '<div className="text-[9px] text-[#686477] font-mono text-center pt-3 border-t border-[#1b1926]/40">\n        Proporsi aset diatur otomatis secara dinamis oleh sinyal Multi-Tier Rotation.<br/>'
);

code = code.replace('Alokasi Aset', 'Alokasi Aset (Dinamis)');

fs.writeFileSync('src/components/AssetTreemap.tsx', code);
