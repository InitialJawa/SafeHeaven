const fs = require('fs');
let code = fs.readFileSync('src/components/MacroChart.tsx', 'utf8');

code = code.replace(/import \{ createChart, IChartApi, ISeriesApi, LineStyle, CrosshairMode \} from 'lightweight-charts';/, "import { createChart, IChartApi, ISeriesApi, LineStyle, CrosshairMode, ColorType } from 'lightweight-charts';");
code = code.replace(/background: \{ color: 'transparent' \}/, "background: { type: ColorType.Solid, color: 'transparent' }");

fs.writeFileSync('src/components/MacroChart.tsx', code);
