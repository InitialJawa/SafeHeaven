const fs = require('fs');
let code = fs.readFileSync('src/components/AssetTreemap.tsx', 'utf8');

const lines = code.split('\n');
const fixedLines = [];
for (let i = 0; i < lines.length; i++) {
  if (i === 124) {
    // This is line 125
    fixedLines.push('          <motion.div style={{ boxShadow: `0 10px 20px ${assets[0].shadowColor}` }} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`flex-1 ${assets[0].bgColor} ${assets[0].textColor} p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer `}>');
  } else if (i === 125) {
    // This is line 126
    // skip it
  } else {
    fixedLines.push(lines[i]);
  }
}
fs.writeFileSync('src/components/AssetTreemap.tsx', fixedLines.join('\n'));
