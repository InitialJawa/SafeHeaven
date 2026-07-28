const fs = require('fs');
let content = fs.readFileSync('src/stores/index.ts', 'utf8');
content = content.replace(
  'localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(items));',
  `try { localStorage.setItem(\`safehaven_backtests_\${userId}\`, JSON.stringify(items)); } catch(e) { try { localStorage.setItem(\`safehaven_backtests_\${userId}\`, JSON.stringify(items.slice(0, 5))); } catch(e2) {} }`
);
content = content.replace(
  /localStorage\.setItem\(`safehaven_backtests_\$\{userId\}`,\s*JSON\.stringify\(updated\)\);/g,
  `try { localStorage.setItem(\`safehaven_backtests_\${userId}\`, JSON.stringify(updated)); } catch(e) { try { localStorage.setItem(\`safehaven_backtests_\${userId}\`, JSON.stringify(updated.slice(0, 5))); } catch(e2) {} }`
);
fs.writeFileSync('src/stores/index.ts', content);
