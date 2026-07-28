const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const oldExecute = `
      if (data.success && data.result && data.result[0]) {
        const d1Result = data.result[0];
        return {
          rows: d1Result.results || []
        };
      } else {
        console.warn('Cloudflare D1 query returned success=false, disabling D1 and falling back to local SQLite:', data.errors || data);
        cloudflareDisabled = true;
      }
    } catch (err) {
      console.error('Cloudflare D1 HTTP connection error, disabling D1 and falling back to local SQLite:', err);
      cloudflareDisabled = true;
    }
  }

  // Fallback to local SQLite client with auto-healing on corruption
  try {
`;

const newExecute = `
      if (data.success && data.result) {
        // Handle array of results (for multiple statements) or single result
        const d1Result = Array.isArray(data.result) ? data.result[data.result.length - 1] : data.result;
        return {
          rows: d1Result?.results || []
        };
      } else {
        console.warn('Cloudflare D1 query returned success=false, falling back to local SQLite for this query:', data.errors || data);
        if (data.errors && data.errors.some(e => e.code === 10000 || e.code === 7000)) {
           // 10000 is Auth error, 7000 is route error - only disable if credentials/config are completely wrong
           cloudflareDisabled = true;
        }
      }
    } catch (err) {
      console.warn('Cloudflare D1 HTTP connection error, falling back to local SQLite for this query:', err);
    }
  }

  // Fallback to local SQLite client with auto-healing on corruption
  try {
`;

if (code.includes(oldExecute.trim().substring(0, 50))) {
   // Replace using a more robust way
   code = code.replace(
     /if \(data.success && data.result && data.result\[0\]\) \{[\s\S]*?\/\/ Fallback to local SQLite client with auto-healing on corruption\n  try \{/,
     newExecute.trim() + "\n"
   );
   fs.writeFileSync('server.ts', code);
   console.log('Fixed executeQuery');
} else {
   console.log('Could not find code block');
}
