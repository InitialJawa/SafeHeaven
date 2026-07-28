const fs = require('fs');

fetch('http://localhost:3000/api/market/analysis-matrix')
  .then(res => res.json())
  .then(result => {
    let stocks = result.data;
    
    // 1. Calculate Score
    const weights = { quality: 0.2, growth: 0.2, value: 0.2, moment: 0.2, dividen: 0.2 };
    const scored = stocks.map(stock => {
      const totalScore = parseFloat((
        stock.quality * weights.quality +
        stock.growth * weights.growth +
        stock.value * weights.value +
        stock.moment * weights.moment +
        stock.dividen * weights.dividen
      ).toFixed(1));
      return { ...stock, totalScore };
    });

    const byTotalScore = [...scored].sort((a, b) => b.totalScore - a.totalScore);
    const ranked = scored.map(s => {
       const rank = byTotalScore.findIndex(ts => ts.symbol === s.symbol) + 1;
       return { ...s, globalRank: rank };
    });

    let filtered = ranked;

    const sortBy = 'growth';
    const sortOrder = 'desc';

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return a.symbol.localeCompare(b.symbol);
    });

    console.log("TOP 5 Growth:");
    for(let i=0; i<5; i++) console.log(`Rank: ${filtered[i].globalRank}, Growth: ${filtered[i].growth}`);
    
    console.log("BOTTOM 10 Growth:");
    for(let i=filtered.length-10; i<filtered.length; i++) console.log(`Rank: ${filtered[i].globalRank}, Growth: ${filtered[i].growth}`);
  });
