const fs = require('fs');
fetch('http://localhost:3000/api/market/analysis-matrix')
  .then(res => res.json())
  .then(res => {
     let types = new Set();
     res.data.forEach(d => types.add(typeof d.growth));
     console.log(Array.from(types));
  });
