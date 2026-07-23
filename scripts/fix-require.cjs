const fs = require('fs');
let code = fs.readFileSync('src/components/MacroChart.tsx', 'utf8');

code = code.replace(/import \{ createChart, IChartApi, ISeriesApi, LineStyle, CrosshairMode, ColorType \} from 'lightweight-charts';/, "import { createChart, IChartApi, ISeriesApi, LineStyle, CrosshairMode, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';");

code = code.replace(/window\.LightweightCharts \? window\.LightweightCharts\.CandlestickSeries : undefined \|\| require\('lightweight-charts'\)\.CandlestickSeries/g, "CandlestickSeries");
code = code.replace(/window\.LightweightCharts \? window\.LightweightCharts\.LineSeries : undefined \|\| require\('lightweight-charts'\)\.LineSeries/g, "LineSeries");

fs.writeFileSync('src/components/MacroChart.tsx', code);
