const fs = require('fs');
let code = fs.readFileSync('src/pages/Risk.tsx', 'utf8');

code = code.replace(
  '<p className="text-xs text-[#9f9bac] font-sans mt-0.5">Sistem mitigasi penarikan dana ekstrem dan proteksi stop-loss otomatis.</p>',
  '<p className="text-xs text-[#9f9bac] font-sans mt-0.5">Sistem mitigasi penarikan dana ekstrem, proteksi stop-loss, dan pemantauan Multi-Tier Rotation.</p>'
);

code = code.replace(
  '<span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Stop Loss Triggered</span>',
  '<span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Sinyal Rotasi & Trigger</span>'
);

code = code.replace(
  '<span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Crash Shield Active</span>',
  '<span className="text-[10px] text-[#686477] font-extrabold uppercase tracking-wider font-sans">Multi-Tier Shield</span>'
);

code = code.replace(
  '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Triggered Alerts</h3>', // Does this exist? Let's assume it might or not
  '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Aset Terdampak & Peringatan</h3>'
);

fs.writeFileSync('src/pages/Risk.tsx', code);
