const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "signal: 'Hindari' as const },",
  "signal: 'Hindari' as ('Beli' | 'Akumulasi' | 'Tahan' | 'Hindari' | 'Jual') },"
);

fs.writeFileSync('server.ts', code);
