const fs = require('fs');
let code = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

// 1. Add Refs
code = code.replace(
  'const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);',
  'const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);\n  const sma20SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);\n  const ema10SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);'
);

// 2. Add state
code = code.replace(
  'const [showMA, setShowMA] = useState(true);',
  'const [showMA, setShowMA] = useState(true);\n  const [showSMA20, setShowSMA20] = useState(false);\n  const [showEMA10, setShowEMA10] = useState(false);'
);

// 3. Initialize Series
const initSeriesRe = /const maSeries = chart\.addSeries\(LineSeries, \{\n\s*color: '#ccff00',\n\s*lineWidth: 2,\n\s*crosshairMarkerVisible: false,\n\s*\}\);\n\s*maSeriesRef\.current = maSeries;/;

const initSeriesReplacement = `const maSeries = chart.addSeries(LineSeries, {
      color: '#ccff00',
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    maSeriesRef.current = maSeries;
    
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#00b0ff', // Light blue
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    sma20SeriesRef.current = sma20Series;
    
    const ema10Series = chart.addSeries(LineSeries, {
      color: '#ff9100', // Orange
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    ema10SeriesRef.current = ema10Series;`;

code = code.replace(initSeriesRe, initSeriesReplacement);

// 4. Clean up refs
const cleanupRe = /maSeriesRef\.current = null;/;
const cleanupReplacement = `maSeriesRef.current = null;
      sma20SeriesRef.current = null;
      ema10SeriesRef.current = null;`;
code = code.replace(cleanupRe, cleanupReplacement);

// 5. Update useEffect dependencies
const depsRe = /\}, \[candles, showMA, showVolume, loading\]\);/;
const depsReplacement = `}, [candles, showMA, showSMA20, showEMA10, showVolume, loading]);`;
code = code.replace(depsRe, depsReplacement);

// 6. Calculate Data
const updateDataRe = /if \(maSeriesRef\.current\) \{[\s\S]*?maSeriesRef\.current\.applyOptions\(\{ visible: showMA \}\);\n\s*\}/;
const updateDataReplacement = `if (maSeriesRef.current && sma20SeriesRef.current && ema10SeriesRef.current) {
      // Calculate 5-period SMA
      const maData = [];
      const period = 5;
      for (let i = 0; i < candles.length; i++) {
        if (i < period - 1) continue;
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].close;
        }
        maData.push({ time: candles[i].time, value: sum / period });
      }
      maSeriesRef.current.setData(maData);
      maSeriesRef.current.applyOptions({ visible: showMA });
      
      // Calculate 20-period SMA
      const sma20Data = [];
      const period20 = 20;
      for (let i = 0; i < candles.length; i++) {
        if (i < period20 - 1) continue;
        let sum = 0;
        for (let j = 0; j < period20; j++) {
          sum += candles[i - j].close;
        }
        sma20Data.push({ time: candles[i].time, value: sum / period20 });
      }
      sma20SeriesRef.current.setData(sma20Data);
      sma20SeriesRef.current.applyOptions({ visible: showSMA20 });
      
      // Calculate 10-period EMA
      const ema10Data = [];
      const period10 = 10;
      let k = 2 / (period10 + 1);
      let ema = candles.length > 0 ? candles[0].close : 0;
      for (let i = 0; i < candles.length; i++) {
        if (i === 0) {
          ema = candles[i].close;
        } else {
          ema = (candles[i].close - ema) * k + ema;
        }
        if (i >= period10 - 1) {
          ema10Data.push({ time: candles[i].time, value: ema });
        }
      }
      ema10SeriesRef.current.setData(ema10Data);
      ema10SeriesRef.current.applyOptions({ visible: showEMA10 });
    }`;
code = code.replace(updateDataRe, updateDataReplacement);


// 7. Add Checkboxes to UI
const checkboxesRe = /<label className="flex items-center gap-1\.5 text-\[10px\] font-sans font-bold text-\[\#9f9bac\] cursor-pointer">\s*<input type="checkbox" checked=\{showMA\} onChange=\{\(e\) => setShowMA\(e\.target\.checked\)\} className="accent-\[\#ccff00\]" \/>\s*SMA 5\s*<\/label>/;
const checkboxesReplacement = `<label className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#ccff00] cursor-pointer">
                        <input type="checkbox" checked={showMA} onChange={(e) => setShowMA(e.target.checked)} className="accent-[#ccff00]" />
                        SMA 5
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#00b0ff] cursor-pointer">
                        <input type="checkbox" checked={showSMA20} onChange={(e) => setShowSMA20(e.target.checked)} className="accent-[#00b0ff]" />
                        SMA 20
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#ff9100] cursor-pointer">
                        <input type="checkbox" checked={showEMA10} onChange={(e) => setShowEMA10(e.target.checked)} className="accent-[#ff9100]" />
                        EMA 10
                    </label>`;
code = code.replace(checkboxesRe, checkboxesReplacement);

fs.writeFileSync('src/pages/TickerDetail.tsx', code);
