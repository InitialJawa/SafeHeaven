const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/backtest/run',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log("last 5:", data.data?.equityCurve?.slice(-5));
  });
});
req.write(JSON.stringify({"template":"warren-buffett","strategyProfile":"auto","universe":"All Saham","capital":"500000000","topN":10,"rebalanceDays":14,"mode":"Dynamic","thresholdPercent":5,"startDate":"2021-01-04","endDate":"2026-07-20"}));
req.end();
