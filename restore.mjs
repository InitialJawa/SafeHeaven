import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `// Robust query executor with Cloudflare D1 REST API and local SQLite fallback
async function executeQuery(sql: string, args: any[] = []): Promise<any> {
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'e8585651011f6f7bef297da93c952b4f';
  const cfDatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || '947c79d9-a27f-4a84-9cf3-c12acaae4141';
  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN || 'cfut_nElv3u3E8ya1iIe6UpQJ8gYZ9AfhXFKoHf11kSmNcf878aba';

  if (cfAccountId && cfDatabaseId && cfApiToken && cfAccountId !== "" && cfDatabaseId !== "" && cfApiToken !== "") {
    try {
      const url = \`https://api.cloudflare.com/client/v4/accounts/\${cfAccountId}/d1/database/\${cfDatabaseId}/query\`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${cfApiToken}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sql: sql,
          params: args
        })
      });

      const data = await response.json() as any;

      if (data.success && data.result && data.result[0]) {
        const d1Result = data.result[0];
        return {
          rows: d1Result.results || []
        };
      } else {
        console.warn('Cloudflare D1 query returned success=false, falling back to local SQLite:', data.errors || data);
      }
    } catch (err) {
      console.error('Cloudflare D1 HTTP connection error, falling back to local SQLite:', err);
    }
  }

  // Fallback to local SQLite client
  try {
    const res = await dbClient.execute({ sql, args });
    return {
      rows: res.rows || []
    };
  } catch (error) {
    console.error(\`Local SQLite execute error: \${sql}\`, error);
    throw error;
  }
}`;

content = content.replace(/\/\/ Robust query executor with Cloudflare D1 REST API and local SQLite fallback[\s\S]*?async function executeQuery[\s\S]*?throw error;\n  }\n}/, replacement);
fs.writeFileSync('server.ts', content);
console.log('done');
