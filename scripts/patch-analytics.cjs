const fs = require('fs');
let code = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');

const importReplacement = `import { MacroChart } from '../components/MacroChart';`;
code = code.replace(/import { RegimeTreemap } from '\.\.\/components\/RegimeTreemap';/, `import { RegimeTreemap } from '../components/RegimeTreemap';\n${importReplacement}`);

const chartSectionRegex = /<div className="flex items-center justify-between mb-4">[\s\S]*?<\/ResponsiveContainer>\n\s*<\/div>\n\s*<\/div>/;
const chartSectionReplacement = `<MacroChart />\n        </div>`;

code = code.replace(chartSectionRegex, chartSectionReplacement);
fs.writeFileSync('src/pages/Analytics.tsx', code);
