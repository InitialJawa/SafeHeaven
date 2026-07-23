const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\('\/api\/analytics\/dashboard', \(req, res\) => \{[\s\S]*?const topLosers = \[\.\.\.universeStocks\]\.sort\(\(a, b\) => a\.changePercent - b\.changePercent\)\.slice\(0, 5\);/;

const replacement = `app.get('/api/analytics/dashboard', (req, res) => {
  const index = req.query.index as string || 'LQ45 Core Universe';
  
  // Find the selected universe
  const selectedUniverse = universes.find(u => u.name === index);
  const tickerList = selectedUniverse ? selectedUniverse.tickers : universes[0]?.tickers || [];

  // Generate dynamic data for all tickers in the universe
  const universeStocks = tickerList.map((symbol, i) => {
    const existing = INITIAL_TICKERS.find(t => t.symbol === symbol);
    if (existing) return existing;
    
    // Deterministic mock data
    const symbolHash = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length - 1);
    const price = 500 + (symbolHash * 13) % 25000;
    const changePercent = -5 + ((i * 3 + symbolHash) % 11);
    const score = 30 + ((i * 7 + symbolHash) % 70);
    const signal = score > 80 ? 'Beli' : score > 60 ? 'Akumulasi' : score > 40 ? 'Tahan' : 'Hindari';
    
    return {
      symbol,
      name: symbol + ' Tbk',
      price,
      changePercent,
      score,
      signal: signal as any
    };
  });
  
  // Sort stocks to find top gainers and losers
  const sortedByChange = [...universeStocks].sort((a, b) => b.changePercent - a.changePercent);
  
  const topGainers = sortedByChange.slice(0, 5);
  const topLosers = [...universeStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
