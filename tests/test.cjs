const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
console.log(code.includes('/api/live-tickers'));
