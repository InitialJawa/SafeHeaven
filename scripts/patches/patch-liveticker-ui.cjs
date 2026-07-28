const fs = require('fs');

let code = fs.readFileSync('src/components/LiveTicker.tsx', 'utf8');

const newEffect = `useEffect(() => {
    let interval: any;
    
    const fetchLiveTickers = async () => {
      try {
        const base = window.location.origin;
        const res = await fetch(\`\${base}/api/live-tickers\`);
        if (res.ok) {
          const data = await res.json();
          data.forEach((t: TickerInfo) => {
            updateTickerPrice(t.symbol, t.price, t.changePercent);
          });
        }
      } catch (err) {
        console.error('Error fetching live tickers', err);
      }
    };
    
    fetchLiveTickers();
    interval = setInterval(fetchLiveTickers, 15000);
    
    return () => clearInterval(interval);
  }, [updateTickerPrice]);`;

code = code.replace(/useEffect\(\(\) => \{[\s\S]*?return \(\) => \{[\s\S]*?clearInterval\(fallbackInterval\);\n    \};\n  \}, \[updateTickerPrice\]\);/, newEffect);

fs.writeFileSync('src/components/LiveTicker.tsx', code);
