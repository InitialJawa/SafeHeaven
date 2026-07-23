const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "signal: 'Tahan' as const },",
  "signal: 'Tahan' as ('Beli' | 'Akumulasi' | 'Tahan' | 'Hindari' | 'Jual') },"
);

fs.writeFileSync('server.ts', code);
