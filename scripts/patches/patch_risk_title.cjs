const fs = require('fs');
let code = fs.readFileSync('src/pages/Risk.tsx', 'utf8');

code = code.replace(
  '<h3 className="text-sm font-bold text-white tracking-tight font-sans mb-4">Tingkat Proteksi Konstituen (Asset Drawdown Watchlist)</h3>',
  '<h3 className="text-sm font-bold text-white tracking-tight font-sans mb-4">Tingkat Proteksi Konstituen & Triggered Alerts (Watchlist Rotasi)</h3>'
);

fs.writeFileSync('src/pages/Risk.tsx', code);
