const fs = require('fs');

function patchFile(path, regexes) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  for (const { rx, rep } of regexes) {
    content = content.replace(rx, rep);
  }
  fs.writeFileSync(path, content);
}

const dropdownStylePattern = /bg-\[#([a-fA-F0-9]{6})\] border border-\[#([a-fA-F0-9]{6})\] rounded-xl shadow-2xl/g;
const standardDropdownStyle = 'bg-[#111018] border border-[#1b1926] rounded-xl shadow-2xl';

const files = [
  'src/pages/TickerDetail.tsx',
  'src/pages/FullChart.tsx',
  'src/pages/Backtest.tsx',
  'src/components/WidgetWatchlistDetail.tsx',
  'src/components/NotificationCenter.tsx'
];

files.forEach(file => {
  patchFile(file, [
    { rx: dropdownStylePattern, rep: standardDropdownStyle }
  ]);
});
