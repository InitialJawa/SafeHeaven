const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Riwayat Amunisi Sinyal Alarm</h3>',
  '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Riwayat Rotasi & Sinyal Alarm</h3>'
);

code = code.replace(
  '<p className="text-[11px] text-[#686477] font-sans">Log alarm harga, target deviasi aset, dan analisis fundamental real-time.</p>',
  '<p className="text-[11px] text-[#686477] font-sans">Log pergerakan rotasi dinamis, alarm harga, dan aksi jaring pengaman.</p>'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
