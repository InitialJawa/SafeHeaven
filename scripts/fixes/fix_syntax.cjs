const fs = require('fs');

function fixFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/<\/h3>\s*<\/h3>/g, '</h3>');
  content = content.replace(/<\/h4>\s*<\/h4>/g, '</h4>');
  fs.writeFileSync(path, content);
}

const files = [
  'src/pages/Settings.tsx',
  'src/pages/Strategies.tsx',
  'src/components/TickerAnalysisWidgets.tsx',
  'src/components/WidgetWatchlistDetail.tsx',
  'src/admin/BroadcastConsole.tsx',
  'src/admin/StressTestConsole.tsx',
  'src/admin/UserManagementConsole.tsx',
  'src/admin/RiskControlConsole.tsx',
  'src/admin/RebalanceConsole.tsx'
];

files.forEach(fixFile);
