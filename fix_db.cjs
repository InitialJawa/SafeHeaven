const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(data\.success && data\.result && data\.result\[0\]\) \{[\s\S]*?\/\/ Fallback to local SQLite client with auto-healing on corruption\n  try \{/m;

const newExecute = `if (data.success && data.result) {
        const d1Result = Array.isArray(data.result) ? data.result[data.result.length - 1] : data.result;
        return {
          rows: d1Result?.results || []
        };
      } else {
        console.warn('Cloudflare D1 query returned success=false, falling back to local SQLite for this query:', data.errors || data);
        if (data.errors && data.errors.some(e => e.code === 10000 || e.code === 7003 || e.code === 9109)) {
           cloudflareDisabled = true;
        }
      }
    } catch (err) {
      console.warn('Cloudflare D1 HTTP connection error, falling back to local SQLite for this query:', err);
    }
  }

  // Fallback to local SQLite client with auto-healing on corruption
  try {`;

if (regex.test(code)) {
   code = code.replace(regex, newExecute);
   fs.writeFileSync('server.ts', code);
   console.log('Fixed executeQuery');
} else {
   console.log('Could not find code block');
}
