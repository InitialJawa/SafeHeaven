const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `    await Promise.all(tickersToFetch.map(async (symbol) => {
      // Check cache first (using GROUP BY date to handle duplicate entries in D1/SQLite)
      let cachedRows = [];`;

const replacement = `    // Process tickers in chunks of 3 to avoid Yahoo Finance rate limits
    for (let i = 0; i < tickersToFetch.length; i += 3) {
      const chunk = tickersToFetch.slice(i, i + 3);
      await Promise.all(chunk.map(async (symbol) => {
      // Check cache first (using GROUP BY date to handle duplicate entries in D1/SQLite)
      let cachedRows = [];`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  // also need to replace the closing brace of Promise.all
  
  const endTarget = `        uniqueDatesSet.add(dateStr);
      }
    }));`;
    
  const endReplacement = `        uniqueDatesSet.add(dateStr);
      }
    }));
    await new Promise(r => setTimeout(r, 200)); // small delay between chunks
    }`;
    
  content = content.replace(endTarget, endReplacement);
  fs.writeFileSync('server.ts', content);
  console.log('Patched server.ts');
} else {
  console.log('Target string not found');
}
