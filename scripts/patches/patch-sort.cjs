const fs = require('fs');
let content = fs.readFileSync('src/pages/StockAnalysis.tsx', 'utf8');

const assertCode = `
    // Dev-only assertion to check sort consistency
    for (let i = 1; i < filtered.length; i++) {
      let prev = filtered[i - 1][sortBy];
      let curr = filtered[i][sortBy];
      
      if (typeof prev === 'string') prev = prev.toLowerCase();
      if (typeof curr === 'string') curr = curr.toLowerCase();

      let ok = true;
      if (sortOrder === 'desc') {
        if (prev < curr) ok = false;
      } else {
        if (prev > curr) ok = false;
      }
      if (!ok) {
        console.warn(\`Sort break at index \${i}: \${filtered[i - 1].symbol}(\${prev}) -> \${filtered[i].symbol}(\${curr})\`);
      }
    }
`;

content = content.replace('return filtered;\n  }, [stocks,', assertCode + '\n    return filtered;\n  }, [stocks,');
fs.writeFileSync('src/pages/StockAnalysis.tsx', content);
