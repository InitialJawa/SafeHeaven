const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

// 1. Remove state variables
code = code.replace(/  const \[includePortfolio, setIncludePortfolio\] = useState\(false\);\n/, '');
code = code.replace(/  const \[includeWatchlist, setIncludeWatchlist\] = useState\(false\);\n/, '');
code = code.replace(/  const \[selectedTicker, setSelectedTicker\] = useState\(''\);\n/, '');

// 2. Remove context concatenation logic
const logicStr = `    // Append context if requested
    let contextString = "";
    if (includePortfolio) {
      contextString += \`\\n\\n[CONTEXT: Portfolio saat ini memiliki capital \${portfolioConfig?.capital?.toLocaleString('id-ID') || 'N/A'}, strategi: \${portfolioConfig?.strategyName || 'N/A'}]\`;
    }
    if (includeWatchlist) {
      contextString += \`\\n\\n[CONTEXT: User sedang memantau watchlist]\`;
    }
    if (selectedTicker) {
      const tickerData = tickers.find(t => t.symbol === selectedTicker);
      if (tickerData) {
        contextString += \`\\n\\n[CONTEXT: Analisis difokuskan pada saham \${selectedTicker} dengan harga terakhir \${tickerData.price} (Perubahan: \${tickerData.changePercent}%)]\`;
      }
    }
    
    setInput('');
    await sendChatMessage(message + contextString);`;

const logicNew = `    setInput('');
    await sendChatMessage(message);`;

code = code.replace(logicStr, logicNew);
fs.writeFileSync('src/pages/AiManager.tsx', code);
console.log("Removed context logic");
