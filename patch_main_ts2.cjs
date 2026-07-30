const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');
content = content.replace(/return originalFetch\(\.\.\.args\);/, 'return originalFetch(args[0], args[1]);');
fs.writeFileSync('src/main.tsx', content);
