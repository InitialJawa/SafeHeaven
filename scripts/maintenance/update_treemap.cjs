const fs = require('fs');
let code = fs.readFileSync('src/components/AssetTreemap.tsx', 'utf8');

code = code.replace(
  "import { TrendingUp, Landmark, ShieldAlert, Award, PieChart, Coins } from 'lucide-react';",
  "import { TrendingUp, Landmark, ShieldAlert, Award, PieChart, Coins, LineChart, DollarSign } from 'lucide-react';"
);

code = code.replace(
  /<TrendingUp className="w-3\.5 h-3\.5 text-black" \/>/,
  '<LineChart className="w-3.5 h-3.5 text-black" />'
);

code = code.replace(
  "bgColor: 'bg-[#545863]', // Slate grey",
  "bgColor: 'bg-[#ffbe3b]', // Golden yellow"
);
code = code.replace(
  "textColor: 'text-white',\n      shadowColor: 'rgba(0,0,0,0.15)',\n      icon: <Award className=\"w-3.5 h-3.5 text-white\" />",
  "textColor: 'text-black',\n      shadowColor: 'rgba(255,190,59,0.12)',\n      icon: <Award className=\"w-3.5 h-3.5 text-black\" />"
);

code = code.replace(
  "bgColor: 'bg-[#ffbe3b]', // Golden yellow",
  "bgColor: 'bg-[#545863]', // Slate grey"
);
code = code.replace(
  "textColor: 'text-black',\n      shadowColor: 'rgba(255,190,59,0.12)',\n      icon: <Coins className=\"w-3.5 h-3.5 text-black\" />",
  "textColor: 'text-white',\n      shadowColor: 'rgba(0,0,0,0.15)',\n      icon: <DollarSign className=\"w-3.5 h-3.5 text-white\" />"
);

fs.writeFileSync('src/components/AssetTreemap.tsx', code);
