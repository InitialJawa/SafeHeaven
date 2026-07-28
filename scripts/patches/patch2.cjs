const fs = require('fs');
let content = fs.readFileSync('src/pages/StockAnalysis.tsx', 'utf8');

const newSort = `
    // 3. Apply Sort
    filtered.sort((a, b) => {
      let valA = a[sortBy as keyof typeof a];
      let valB = b[sortBy as keyof typeof b];

      // Safe numeric sort
      if (typeof valA === 'number' && typeof valB === 'number') {
        if (valA !== valB) {
           return sortOrder === 'desc' ? valB - valA : valA - valB;
        }
      } else {
        // String sort
        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      }
      
      // Fallback tie-breaker: always sort symbol alphabetically A-Z
      return a.symbol.localeCompare(b.symbol);
    });

    // 4. Assert Monotonicity (Dev-only warning)
    if (process.env.NODE_ENV !== 'production') {
      for (let i = 1; i < filtered.length; i++) {
        const prev = filtered[i - 1][sortBy as keyof typeof filtered[0]];
        const curr = filtered[i][sortBy as keyof typeof filtered[0]];
        
        if (typeof prev === 'number' && typeof curr === 'number') {
          const ok = sortOrder === 'desc' ? prev >= curr : prev <= curr;
          if (!ok) {
            console.warn(\`Sort break at index \${i} for \${sortBy}: \${filtered[i - 1].symbol}(\${prev}) -> \${filtered[i].symbol}(\${curr})\`);
          }
        }
      }
    }

    return filtered;
`;

content = content.replace(/\/\/ 3\. Apply Sort[\s\S]*?return filtered;/m, newSort);
fs.writeFileSync('src/pages/StockAnalysis.tsx', content);
