const fs = require('fs');
let code = fs.readFileSync('src/components/AssetTreemap.tsx', 'utf8');

// replace the assets array definition
const newAssetsDef = `
  // Dynamic regime simulation based on Multi-Tier Rotation (Saham AVOID, Emas REKOMENDASI)
  const isEmasRegime = true; // Simulating current regime

  const rawAssets = [
    {
      id: 'saham',
      name: 'SAHAM',
      percentage: isEmasRegime ? 0 : 60,
      val: activeCapital * (isEmasRegime ? 0 : 60) / 100,
      change: isEmasRegime ? '-2.4%' : '+4.82%',
      bgColor: 'bg-[#1bfb7c]', // Neon green
      textColor: 'text-black',
      shadowColor: 'rgba(27,251,124,0.12)',
      icon: <TrendingUp className="w-3.5 h-3.5 text-black" />
    },
    {
      id: 'emas',
      name: 'EMAS',
      percentage: isEmasRegime ? 70 : 20,
      val: activeCapital * (isEmasRegime ? 70 : 20) / 100,
      change: isEmasRegime ? '+8.50%' : '+1.50%',
      bgColor: 'bg-[#545863]', // Slate grey
      textColor: 'text-white',
      shadowColor: 'rgba(0,0,0,0.15)',
      icon: <Award className="w-3.5 h-3.5 text-white" />
    },
    {
      id: 'usd',
      name: 'USD CASH',
      percentage: isEmasRegime ? 15 : 10,
      val: activeCapital * (isEmasRegime ? 15 : 10) / 100,
      change: '+0.25%',
      bgColor: 'bg-[#ffbe3b]', // Golden yellow
      textColor: 'text-black',
      shadowColor: 'rgba(255,190,59,0.12)',
      icon: <Coins className="w-3.5 h-3.5 text-black" />
    },
    {
      id: 'idr',
      name: 'CASH IDR',
      percentage: isEmasRegime ? 15 : 10,
      val: activeCapital * (isEmasRegime ? 15 : 10) / 100,
      change: '0.00%',
      bgColor: 'bg-[#9d1df2]', // Electric violet
      textColor: 'text-white',
      shadowColor: 'rgba(157,29,242,0.12)',
      icon: <Landmark className="w-3.5 h-3.5 text-white" />
    },
    {
      id: 'hedging',
      name: 'HEDGING',
      percentage: 0, 
      val: 0,
      change: '+12.4%',
      bgColor: 'bg-[#ff5621]', // Sunset orange
      textColor: 'text-black',
      shadowColor: 'rgba(255,86,33,0.12)',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-black" />
    }
  ];

  const assets = [...rawAssets].sort((a, b) => b.percentage - a.percentage);
`;

const startIndex = code.indexOf('  const assets = [');
const endIndex = code.indexOf('  return (');

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newAssetsDef + '\n  ' + code.substring(endIndex);
  
  // Now replace the hardcoded shadow classes and indices
  // The original has assets[0], assets[1], etc.
  // Because we map them dynamically, we should just use them.
  // However, we need to inject the inline style for box-shadow since Tailwind arbitrary values don't support dynamic variables directly.
  
  code = code.replace(/shadow-\[0_10px_20px_rgba\(27,251,124,0\.12\)\]/g, '');
  code = code.replace(/shadow-\[0_8px_16px_rgba\(157,29,242,0\.12\)\]/g, '');
  code = code.replace(/shadow-\[0_8px_16px_rgba\(0,0,0,0\.15\)\]/g, '');
  code = code.replace(/shadow-\[0_8px_16px_rgba\(255,190,59,0\.12\)\]/g, '');
  code = code.replace(/shadow-\[0_8px_16px_rgba\(255,86,33,0\.12\)\]/g, '');
  
  // Left column top (assets[0])
  code = code.replace(/<motion\.div\n\s*whileHover=\{\{ scale: 1\.02, y: -2 \}\}\n\s*transition=\{\{ type: "spring", stiffness: 300, damping: 20 \}\}\n\s*className=\{\`flex-1 \$\{assets\[0\]\.bgColor\} \$\{assets\[0\]\.textColor\} p-3\.5 rounded-2xl flex flex-col justify-between cursor-pointer \`\}/g, 
  '<motion.div style={{ boxShadow: `0 10px 20px ${assets[0].shadowColor}` }} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`flex-1 ${assets[0].bgColor} ${assets[0].textColor} p-3.5 rounded-2xl flex flex-col justify-between cursor-pointer `}>');
  
  // Left column bottom (assets[3] -> assets[1])
  // Wait, if it's sorted, the assets will be:
  // assets[0]: largest
  // assets[1]: second largest
  // assets[2]: third largest
  // assets[3]: fourth largest
  // assets[4]: fifth largest
  
  // Let's replace the hardcoded indices in the JSX
  // Left column: Top = assets[0], Bottom = assets[3] -> let's change to assets[0] and assets[3]
  // Right column: Top = assets[1], Middle = assets[2], Bottom = assets[4]
  
  // We'll leave the indices as they were in the original code, BUT we will just apply the inline shadow correctly for each.
  code = code.replace(
    /className=\{\`flex-1 \$\{assets\[0\]\.bgColor\}(.*?)\`\}/g,
    'style={{ boxShadow: `0 10px 20px ${assets[0].shadowColor}` }} className={`flex-1 ${assets[0].bgColor}$1`}'
  );
  code = code.replace(
    /className=\{\`h-\[95px\] \$\{assets\[3\]\.bgColor\}(.*?)\`\}/g,
    'style={{ boxShadow: `0 8px 16px ${assets[3].shadowColor}` }} className={`h-[95px] ${assets[3].bgColor}$1`}'
  );
  code = code.replace(
    /className=\{\`h-\[85px\] \$\{assets\[1\]\.bgColor\}(.*?)\`\}/g,
    'style={{ boxShadow: `0 8px 16px ${assets[1].shadowColor}` }} className={`h-[85px] ${assets[1].bgColor}$1`}'
  );
  code = code.replace(
    /className=\{\`h-\[85px\] \$\{assets\[2\]\.bgColor\}(.*?)\`\}/g,
    'style={{ boxShadow: `0 8px 16px ${assets[2].shadowColor}` }} className={`h-[85px] ${assets[2].bgColor}$1`}'
  );
  code = code.replace(
    /className=\{\`h-\[85px\] \$\{assets\[4\]\.bgColor\}(.*?)\`\}/g,
    'style={{ boxShadow: `0 8px 16px ${assets[4].shadowColor}` }} className={`h-[85px] ${assets[4].bgColor}$1`}'
  );

  fs.writeFileSync('src/components/AssetTreemap.tsx', code);
  console.log('Patched dynamic treemap successfully!');
} else {
  console.log('Failed to find strings in treemap.');
}
