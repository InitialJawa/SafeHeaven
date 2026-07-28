const fs = require('fs');
let code = fs.readFileSync('src/components/RegimeTreemap.tsx', 'utf8');

// Update Volatile colors to black
code = code.replace(
  "bgColor: 'bg-[#ff5e3a]', // Sunset Orange\n        textColor: 'text-white',\n        icon: <RefreshCw className=\"w-4 h-4 text-white\" />,\n        glowColor: 'rgba(255, 94, 58, 0.15)',\n        badgeBg: 'bg-white/20',\n        badgeText: 'text-white/90',",
  "bgColor: 'bg-[#ff5e3a]', // Sunset Orange\n        textColor: 'text-black',\n        icon: <RefreshCw className=\"w-4 h-4 text-black\" />,\n        glowColor: 'rgba(255, 94, 58, 0.15)',\n        badgeBg: 'bg-black/10',\n        badgeText: 'text-black/80',"
);

// Check if it was replaced
fs.writeFileSync('src/components/RegimeTreemap.tsx', code);
