const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /const isBearer = process\.env\.GEMINI_API_KEY\.startsWith\('ya29'\) \|\| process\.env\.GEMINI_API_KEY\.startsWith\('AQ\.'\);\s*ai = new GoogleGenAI\(isBearer \? \{\s*httpOptions: \{\s*headers: \{\s*Authorization: `Bearer \$\{process\.env\.GEMINI_API_KEY\}`\s*\}\s*\}\s*\} : \{\s*apiKey: process\.env\.GEMINI_API_KEY\s*\}\);/,
  `ai = new GoogleGenAI({\n    apiKey: process.env.GEMINI_API_KEY\n  });`
);

content = content.replace(
  /const isBearerKey = cfg\.customApiKey\.startsWith\('ya29'\) \|\| cfg\.customApiKey\.startsWith\('AQ\.'\);\s*geminiInstance = new GoogleGenAI\(isBearerKey \? \{\s*httpOptions: \{\s*headers: \{\s*Authorization: `Bearer \$\{cfg\.customApiKey\}`\s*\}\s*\}\s*\} : \{\s*apiKey: cfg\.customApiKey\s*\}\);/,
  `geminiInstance = new GoogleGenAI({ apiKey: cfg.customApiKey });`
);

fs.writeFileSync('server.ts', content);
