import fs from 'fs';

const file = fs.readFileSync('server.ts', 'utf8');

const divFunction = `
async function fetchAndStoreDividends(ticker: string) {
  try {
    const symbol = ticker === '^JKSE' || ticker === 'GC=F' ? ticker : \`\${ticker}.JK\`;
    
    // Check the latest date in DB for this ticker
    const lastDateRes = await executeQuery('SELECT MAX(date) as last_date FROM dividend_history WHERE ticker = ?', [ticker]);
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); 
    
    if (lastDateRes.rows && lastDateRes.rows[0] && lastDateRes.rows[0].last_date) {
      const lastDate = new Date(lastDateRes.rows[0].last_date);
      lastDate.setDate(lastDate.getDate() + 1);
      startDate = lastDate;
    }
    
    if (startDate >= new Date()) return; 

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = new Date().toISOString().split('T')[0];
    if (startStr === endStr) return;

    const hist = await yf.historical(symbol, {
      period1: startStr,
      period2: endStr,
      events: 'dividends'
    }).catch(() => []);

    let count = 0;
    for (const h of hist) {
      if (!h || !h.date || !h.dividends) continue;
      const dateStr = h.date.toISOString().split('T')[0];
      const id = \`\${ticker}-div-\${dateStr}\`;
      await executeQuery(
        \`INSERT OR IGNORE INTO dividend_history (id, ticker, date, dividend) VALUES (?, ?, ?, ?)\`,
        [id, ticker, dateStr, h.dividends]
      );
      count++;
    }
    if (count > 0) {
      console.log(\`[CRON] Fetched & stored \${count} new dividends for \${ticker}\`);
    }
  } catch (err) {
    console.error(\`[CRON] Failed to fetch dividend history for \${ticker}:\`, err);
  }
}
`;

const updated = file.replace(
  'function setupCronJobs() {', 
  divFunction + '\nfunction setupCronJobs() {'
).replace(
  "await fetchAndStorePriceHistory(sym);",
  "await fetchAndStorePriceHistory(sym);\n           await fetchAndStoreDividends(sym);"
);

fs.writeFileSync('server.ts', updated);
console.log('Fixed cron update for dividends');
