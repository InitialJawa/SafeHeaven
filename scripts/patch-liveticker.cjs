const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Add /api/live-tickers endpoint
const endpointRegex = /app\.listen\(PORT, '0\.0\.0\.0', \(\) => \{/;
if (!serverCode.includes('/api/live-tickers')) {
  serverCode = serverCode.replace(
    /const server = http\.createServer\(app\);/,
    `app.get('/api/live-tickers', async (req, res) => {
  try {
    const symbols = INITIAL_TICKERS.map(t => t.symbol + '.JK');
    const quotes = await yf.quote(symbols);
    const updated = INITIAL_TICKERS.map(t => {
      const q = quotes.find(quote => quote.symbol === t.symbol + '.JK');
      if (q) {
        return {
          ...t,
          price: q.regularMarketPrice,
          changePercent: parseFloat((q.regularMarketChangePercent || 0).toFixed(2))
        };
      }
      return t;
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});\n\nconst server = http.createServer(app);`
  );
  fs.writeFileSync('server.ts', serverCode);
}
