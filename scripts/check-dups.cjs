fetch('http://localhost:3000/api/market/analysis-matrix')
  .then(res => res.json())
  .then(res => {
     let symbols = res.data.map(d => d.symbol);
     let unique = new Set(symbols);
     console.log('Total:', symbols.length, 'Unique:', unique.size);
  });
