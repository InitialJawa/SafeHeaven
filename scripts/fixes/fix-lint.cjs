const fs = require('fs');

// 1. Fix TickerDetail.tsx
let tdCode = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');
tdCode = tdCode.replace(/import \{ createChart, IChartApi, ISeriesApi, LineStyle \} from 'lightweight-charts';/, "import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType } from 'lightweight-charts';");
tdCode = tdCode.replace(/background: \{ type: 'solid', color: 'transparent' \}/, "background: { type: ColorType.Solid, color: 'transparent' }");
fs.writeFileSync('src/pages/TickerDetail.tsx', tdCode);

// 2. Fix Analytics.tsx
let analyticsCode = fs.readFileSync('src/pages/Analytics.tsx', 'utf8');
const calculateEMARegex = /const calculateEMA = \([\s\S]*?const ihsgWithEma = calculateEMA\(ihsgData, 20\);\n/;
analyticsCode = analyticsCode.replace(calculateEMARegex, '');
fs.writeFileSync('src/pages/Analytics.tsx', analyticsCode);

// 3. Fix server.ts (ignore strategyTemplate type error by casting to any)
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/const strategyTemplate = req\.body\.strategyTemplate;/, "const strategyTemplate = (req.body as any).strategyTemplate;");
fs.writeFileSync('server.ts', serverCode);

