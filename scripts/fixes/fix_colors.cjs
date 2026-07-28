const fs = require('fs');
let code = fs.readFileSync('src/components/AssetTreemap.tsx', 'utf8');

code = code.replace(
  "bgColor: 'bg-[#545863]', // Slate grey\n      textColor: 'text-black',\n      shadowColor: 'rgba(255,190,59,0.12)',\n      icon: <Award className=\"w-3.5 h-3.5 text-black\" />",
  "bgColor: 'bg-[#ffbe3b]', // Golden yellow\n      textColor: 'text-black',\n      shadowColor: 'rgba(255,190,59,0.12)',\n      icon: <Award className=\"w-3.5 h-3.5 text-black\" />"
);

code = code.replace(
  "bgColor: 'bg-[#ffbe3b]', // Golden yellow\n      textColor: 'text-white',\n      shadowColor: 'rgba(0,0,0,0.15)',\n      icon: <DollarSign className=\"w-3.5 h-3.5 text-white\" />",
  "bgColor: 'bg-[#545863]', // Slate grey\n      textColor: 'text-white',\n      shadowColor: 'rgba(0,0,0,0.15)',\n      icon: <DollarSign className=\"w-3.5 h-3.5 text-white\" />"
);

fs.writeFileSync('src/components/AssetTreemap.tsx', code);
