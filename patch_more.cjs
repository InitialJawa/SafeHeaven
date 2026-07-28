const fs = require('fs');

function patchFile(path, regexes) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  for (const { rx, rep } of regexes) {
    content = content.replace(rx, rep);
  }
  fs.writeFileSync(path, content);
}

patchFile('src/pages/Strategies.tsx', [
  { rx: /<Sliders className="w-5 h-5 text-\[#ccff00\]" \/>\s*<h3 className="text-sm font-bold text-white tracking-tight font-sans">/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">' }
]);

patchFile('src/pages/Settings.tsx', [
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">\s*<SettingsIcon className="w-4\.5 h-4\.5 text-\[#ccff00\]" \/> Konfigurasi Dasar Portfolio/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Konfigurasi Dasar Portfolio</h3>' },
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">\s*<Bell className="w-4\.5 h-4\.5 text-\[#ccff00\]" \/> Saluran Lampiran Notifikasi & Alert/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Saluran Lampiran Notifikasi & Alert</h3>' },
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">\s*<SlidersHorizontal className="w-4\.5 h-4\.5 text-\[#ccff00\]" \/> Pengaturan Sistem Global Workbench/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Pengaturan Sistem Global Workbench</h3>' }
]);

patchFile('src/components/TickerAnalysisWidgets.tsx', [
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">\s*<BarChart2 className="w-4 h-4 text-\[#ccff00\]" \/>/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">' },
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2 mb-1">\s*<Percent className="w-4 h-4 text-\[#ccff00\]" \/>/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans mb-1">' }
]);

patchFile('src/components/WidgetWatchlistDetail.tsx', [
  { rx: /<Newspaper className="w-4 h-4 text-\[#ccff00\]" \/>\s*<h3 className="text-sm font-bold text-white font-sans">Berita Terkini/g, rep: '<h3 className="text-sm font-bold text-white font-sans">Berita Terkini' }
]);

patchFile('src/admin/BroadcastConsole.tsx', [
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">\s*<Send className="w-4 h-4 text-\[#ccff00\]" \/> Broadcast Sinyal Ke Seluruh Tab/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Broadcast Sinyal Ke Seluruh Tab</h3>' }
]);

patchFile('src/admin/StressTestConsole.tsx', [
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">\s*<ShieldAlert className="w-4 h-4 text-\[#ff3366\]" \/> Modul Simulasi Krisis Pasar & Black Swan/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Modul Simulasi Krisis Pasar & Black Swan</h3>' }
]);

patchFile('src/admin/UserManagementConsole.tsx', [
  { rx: /<h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">\s*<UserPlus className="w-4 h-4 text-amber-400" \/> Daftarkan Member VIP Baru/g, rep: '<h3 className="text-sm font-bold text-white font-sans">Daftarkan Member VIP Baru</h3>' },
  { rx: /<h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">\s*<Wrench className="w-4 h-4 text-\[#00f0ff\]" \/> Cek & Diagnosis Error Member VIP/g, rep: '<h3 className="text-sm font-bold text-white font-sans">Cek & Diagnosis Error Member VIP</h3>' }
]);

patchFile('src/admin/RiskControlConsole.tsx', [
  { rx: /<ShieldAlert className=\{`w-5 h-5 \$\{data\?\.crashShieldActive \? 'text-\[#ff3366\] animate-pulse' : 'text-\[#00f5a0\]'\}`\} \/>\s*<h3 className="text-sm font-bold text-white font-sans">Status Crash Shield<\/h3>/g, rep: '<h3 className="text-sm font-bold text-white font-sans">Status Crash Shield</h3>' },
  { rx: /<Flame className=\{`w-5 h-5 \$\{data\?\.stopLossTriggered \? 'text-\[#ff3366\]' : 'text-amber-400'\}`\} \/>\s*<h3 className="text-sm font-bold text-white font-sans">Mekanisme Stop Loss Asset<\/h3>/g, rep: '<h3 className="text-sm font-bold text-white font-sans">Mekanisme Stop Loss Asset</h3>' },
  { rx: /<h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">\s*<SlidersHorizontal className="w-4 h-4 text-\[#ccff00\]" \/> Pengaturan Parameter Ambang Risiko Sumbu Sistem<\/h3>/g, rep: '<h3 className="text-sm font-bold text-white font-sans">Pengaturan Parameter Ambang Risiko Sumbu Sistem</h3>' }
]);

patchFile('src/admin/RebalanceConsole.tsx', [
  { rx: /<h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">\s*<Layers className="w-4 h-4 text-\[#ccff00\]" \/> Laboratorium Rebalancing & Drift Simulasi<\/h3>/g, rep: '<h3 className="text-sm font-bold text-white tracking-tight font-sans">Laboratorium Rebalancing & Drift Simulasi</h3>' }
]);

