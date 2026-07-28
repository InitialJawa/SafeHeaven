const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /console\.warn\("Gemini API Error \\(fallback mode activated\\):", _err\?\.message \|\| "Unknown error"\);/,
  `console.warn("Gemini API Error (fallback mode activated):", (_err?.message || '').includes('401') ? "Invalid API Key" : "Unknown error");`
);

fs.writeFileSync('server.ts', content);
