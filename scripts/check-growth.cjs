fetch('http://localhost:3000/api/market/analysis-matrix')
  .then(res => res.json())
  .then(res => {
     let undefinedCount = 0;
     let nanCount = 0;
     let stringCount = 0;
     let nullCount = 0;
     for (let d of res.data) {
        if (d.growth === undefined) undefinedCount++;
        else if (d.growth === null) nullCount++;
        else if (Number.isNaN(d.growth)) nanCount++;
        else if (typeof d.growth === 'string') stringCount++;
     }
     console.log({undefinedCount, nanCount, stringCount, nullCount});
  });
