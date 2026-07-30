const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');

content = content.replace(/window\.appFetch = async \(\.\.\.args\) => \{/g, 'window.appFetch = async (...args: [RequestInfo | URL, RequestInit?]) => {');

// Because originalFetch is typed from window.fetch, we can just cast args:
content = content.replace(/return originalFetch\(\.\.\.args\);/g, 'return originalFetch(...args);');

fs.writeFileSync('src/main.tsx', content);
