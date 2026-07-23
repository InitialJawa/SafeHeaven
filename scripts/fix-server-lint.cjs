const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const targetStrategy = strategies\.find\(s => s\.id === portfolioConfig\.strategyTemplate\) \|\| strategies\[0\];/, "const targetStrategy = strategies.find(s => s.id === (portfolioConfig as any).strategyTemplate) || strategies[0];");

fs.writeFileSync('server.ts', code);
