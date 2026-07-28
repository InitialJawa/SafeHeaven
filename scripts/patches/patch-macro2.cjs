const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const macroEndpointRegex = /app\.get\('\/api\/market\/ihsg', async \(req, res\) => \{[\s\S]*?\}\n\}\);/;

const macroEndpointReplacement = `app.get('/api/market/macro', async (req, res) => {
  const range = (req.query.range) || '1m';
  const type = (req.query.type) || 'ihsg';
  let symbol = '^JKSE';
  if (type === 'usd') symbol = 'IDR=X';
  if (type === 'gold') symbol = 'GC=F';
  
  const now = new Date();
  let period1 = new Date();
  
  if (range === '1m') period1.setMonth(now.getMonth() - 1);
  else if (range === '3m') period1.setMonth(now.getMonth() - 3);
  else if (range === '6m') period1.setMonth(now.getMonth() - 6);
  else if (range === '1y') period1.setFullYear(now.getFullYear() - 1);
  else if (range === '5y') period1.setFullYear(now.getFullYear() - 5);
  else period1.setMonth(now.getMonth() - 1);
  
  try {
    const chartResult = await yf.chart(symbol, { 
        period1: period1.toISOString(),
        interval: '1d'
    });
    
    const data = chartResult.quotes.map(q => ({
      time: q.date.toISOString().split('T')[0],
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      value: q.volume || 0,
      color: q.close >= q.open ? '#00e676' : '#ff1744'
    })).filter(q => q.open !== null && q.close !== null);
    
    res.json(data);
  } catch (e) {
    console.error("YF Macro Error:", e);
    res.json([]);
  }
});`;

code = code.replace(macroEndpointRegex, macroEndpointReplacement);
fs.writeFileSync('server.ts', code);
