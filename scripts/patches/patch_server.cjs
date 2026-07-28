const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Patch main initialization
content = content.replace(
  /ai = new GoogleGenAI\(\{\s*apiKey: process\.env\.GEMINI_API_KEY\s*\}\);/,
  `const isBearer = process.env.GEMINI_API_KEY.startsWith('ya29') || process.env.GEMINI_API_KEY.startsWith('AQ.');
  ai = new GoogleGenAI(isBearer ? {
    httpOptions: { headers: { Authorization: \`Bearer \${process.env.GEMINI_API_KEY}\` } }
  } : {
    apiKey: process.env.GEMINI_API_KEY
  });`
);

// Patch customApiKey initialization
content = content.replace(
  /geminiInstance = new GoogleGenAI\(\{ apiKey: cfg\.customApiKey \}\);/,
  `const isBearerKey = cfg.customApiKey.startsWith('ya29') || cfg.customApiKey.startsWith('AQ.');
      geminiInstance = new GoogleGenAI(isBearerKey ? {
        httpOptions: { headers: { Authorization: \`Bearer \${cfg.customApiKey}\` } }
      } : {
        apiKey: cfg.customApiKey
      });`
);

fs.writeFileSync('server.ts', content);
