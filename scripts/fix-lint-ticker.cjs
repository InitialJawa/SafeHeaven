const fs = require('fs');
let code = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

code = code.replace(
  /import \{ createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries \} from 'lightweight-charts';/,
  "import { createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries, ColorType } from 'lightweight-charts';"
);

fs.writeFileSync('src/pages/TickerDetail.tsx', code);
