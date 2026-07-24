import fs from 'fs';

const file = fs.readFileSync('server.ts', 'utf8');

const fetchFunction = `
async function fetchAndStorePriceHistory(ticker: string) {
  try {
    const symbol = ticker === '^JKSE' || ticker === 'GC=F' ? ticker : \`\${ticker}.JK\`;
    
    // Check the latest date in DB for this ticker
    const lastDateRes = await executeQuery('SELECT MAX(date) as last_date FROM price_history WHERE ticker = ?', [ticker]);
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // default 1 year back
    
    if (lastDateRes.rows && lastDateRes.rows[0] && lastDateRes.rows[0].last_date) {
      const lastDate = new Date(lastDateRes.rows[0].last_date);
      // Add 1 day to lastDate
      lastDate.setDate(lastDate.getDate() + 1);
      startDate = lastDate;
    }
    
    // If startDate is in the future or today, maybe skip or just fetch 1 day
    if (startDate >= new Date()) {
      return; // Already up to date
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = new Date().toISOString().split('T')[0];
    
    if (startStr === endStr) return; // No new data to fetch

    const hist = await yf.historical(symbol, {
      period1: startStr,
      period2: endStr,
      interval: '1d'
    }).catch(() => []);

    for (const h of hist) {
      if (!h || !h.date) continue;
      const dateStr = h.date.toISOString().split('T')[0];
      const id = \`\${ticker}-\${dateStr}\`;
      const changePct = h.open && h.close ? ((h.close - h.open) / h.open) * 100 : 0;
      await executeQuery(
        \`INSERT OR IGNORE INTO price_history (id, ticker, date, open, high, low, close, volume, change_pct) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
        [id, ticker, dateStr, h.open, h.high, h.low, h.close, h.volume, changePct]
      );
    }
    console.log(\`[CRON] Fetched & stored \${hist.length} new prices for \${ticker}\`);
  } catch (err) {
    console.error(\`[CRON] Failed to fetch price history for \${ticker}:\`, err);
  }
}
`;

const updated = file.replace(
  'function setupCronJobs() {', 
  fetchFunction + '\nfunction setupCronJobs() {'
).replace(
  "await fetchAndStorePriceHistory(sym, '1d');",
  "await fetchAndStorePriceHistory(sym);"
);

fs.writeFileSync('server.ts', updated);
console.log('Fixed cron update');
