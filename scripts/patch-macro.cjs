const fs = require('fs');
let code = fs.readFileSync('src/components/MacroChart.tsx', 'utf8');

code = code.replace(
  /chartRef\.current\.timeScale\(\)\.fitContent\(\);/,
  "chartRef.current.timeScale().fitContent();\n      chartRef.current.priceScale('right').applyOptions({ autoScale: true });"
);

fs.writeFileSync('src/components/MacroChart.tsx', code);
