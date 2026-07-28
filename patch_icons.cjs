const fs = require('fs');

function patchFile(path, regexes) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  for (const { rx, rep } of regexes) {
    content = content.replace(rx, rep);
  }
  fs.writeFileSync(path, content);
}

patchFile('src/pages/Settings.tsx', [
  { rx: /<SettingsIcon className="w-4 h-4" \/>\s*/g, rep: '' },
  { rx: /<Bell className="w-4 h-4" \/>\s*/g, rep: '' },
  { rx: /<SlidersHorizontal className="w-4 h-4" \/>\s*/g, rep: '' },
  { rx: /<Bot className="w-4 h-4 text-\[#ccff00\]" \/>\s*/g, rep: '' },
  { rx: /<div className="w-10 h-10 rounded-xl bg-\[#ccff00\]\/10 border border-\[#ccff00\]\/20 flex items-center justify-center text-\[#ccff00\]">\s*<Bot className="w-5 h-5" \/>\s*<\/div>/g, rep: '' }
]);

patchFile('src/components/TickerAnalysisWidgets.tsx', [
  { rx: /<Activity className="w-3\.5 h-3\.5 text-\[#ccff00\]" \/>/g, rep: '' },
  { rx: /<Calendar className="w-3\.5 h-3\.5 text-\[#ccff00\]" \/>/g, rep: '' },
  { rx: /<Target className="w-3\.5 h-3\.5 text-\[#ccff00\]" \/>/g, rep: '' }
]);

