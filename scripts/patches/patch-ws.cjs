const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /setInterval\(\(\) => \{[\s\S]*?\}, 4000\);/;

const replacement = `setInterval(async () => {
  try {
    const symbols = liveTickers.map(t => \`\${t.symbol}.JK\`);
    const quotes = await yf.quote(symbols);
    
    liveTickers = liveTickers.map(t => {
      const q = quotes.find(quote => quote.symbol === \`\${t.symbol}.JK\`);
      if (q) {
        return {
          ...t,
          price: q.regularMarketPrice,
          changePercent: parseFloat((q.regularMarketChangePercent || 0).toFixed(2))
        };
      }
      return t;
    });

    const payload = JSON.stringify({
      type: 'prices',
      tickers: liveTickers
    });
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  } catch(e) {
    console.error("YF WS Error:", e.message);
  }
}, 15000);`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
