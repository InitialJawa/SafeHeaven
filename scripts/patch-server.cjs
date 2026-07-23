const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const wss = new WebSocketServer\(\{ server, path: '\/ws' \}\);[\s\S]*?console\.error\("YF WS Error:", e\.message\);\n  \}\n\}, 15000\);/, "");

fs.writeFileSync('server.ts', code);
