const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/wss\.on\('connection', \(ws\) => \{[\s\S]*?\}\);/g, "");

fs.writeFileSync('server.ts', code);
