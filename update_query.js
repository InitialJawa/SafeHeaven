const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /\/\/ Robust query executor with Cloudflare D1 REST API and local SQLite fallback[\s\S]*?async function executeQuery[\s\S]*?throw error;\n  }\n}/,
  `// Robust query executor for local SQLite
async function executeQuery(sql: string, args: any[] = []): Promise<any> {
  try {
    const res = await dbClient.execute({ sql, args });
    return {
      rows: res.rows || []
    };
  } catch (error) {
    console.error(\`Local SQLite execute error: \${sql}\`, error);
    throw error;
  }
}`
);
fs.writeFileSync('server.ts', content);
