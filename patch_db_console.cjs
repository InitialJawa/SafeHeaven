const fs = require('fs');
let content = fs.readFileSync('src/admin/DatabaseConsole.tsx', 'utf-8');

// Replace runSqlQuery
content = content.replace(/const runSqlQuery = async \(customQuery\?: string\) => \{[\s\S]*?finally \{\s+setDbLoading\(false\);\s+\}\s+\};/g, `const runSqlQuery = async (customTable?: string, customTicker?: string) => {
    setDbLoading(true);
    setQueryError(null);
    setQueryResult(null);
    
    const tableToQuery = customTable || activeTable;
    const ticker = customTicker !== undefined ? customTicker : tickerFilter;
    
    try {
      let url = '';
      if (tableToQuery === 'price_history') {
        url = \`/api/db/admin/price_history\${ticker.trim() ? \`?ticker=\${encodeURIComponent(ticker.trim())}\` : ''}\`;
      } else if (tableToQuery === 'fundamentals_historical') {
        url = \`/api/db/admin/fundamentals_historical\${ticker.trim() ? \`?ticker=\${encodeURIComponent(ticker.trim())}\` : ''}\`;
      } else {
        url = '/api/db/admin/records_summary';
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      if (data.success) {
        setQueryResult(data);
        addLog(\`Data records fetched from \${tableToQuery}\`);
      } else {
        setQueryError(data.error || 'Terjadi kesalahan mengambil data.');
      }
    } catch (err: any) {
      setQueryError(err.message || 'Kesalahan koneksi ke server.');
    } finally {
      setDbLoading(false);
    }
  };`);

// Replace the custom SQL textarea and logic with a preset button that uses records_summary
content = content.replace(/<button\s+onClick=\{\(\) => \{\s+setActiveTable\('custom'\);[\s\S]*?Custom SQL Query \(Read-only\)\n\s+<\/button>/g, `<button
            onClick={() => {
              setActiveTable('custom');
              setQueryResult(null);
              setQueryError(null);
            }}
            className={\`px-4 py-3 border-r border-[#1b1926] transition-all flex items-center gap-1.5 cursor-pointer \${activeTable === 'custom' ? 'bg-[#1b1926] text-white' : 'text-[#9f9bac] hover:text-white'}\`}
          >
            <Code className="w-3.5 h-3.5 text-[#00f0ff]" /> Top Tickers Summary
          </button>`);

content = content.replace(/<div className="space-y-3">\s+<div className="space-y-1">\s+<label className="text-\[#9f9bac\] font-extrabold uppercase text-\[10px\] flex items-center justify-between">[\s\S]*?Eksekusi Custom SQL\n\s+<\/button>\n\s+<\/div>\n\s+<\/div>/g, `<div className="space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <div className="text-[#686477] flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-[#00f0ff]" />
                  <span>Summary emiten dengan record data harga terbanyak (Top 15).</span>
                </div>
                <button
                  onClick={() => runSqlQuery()}
                  disabled={dbLoading}
                  className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#ddff33] text-black font-extrabold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {dbLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Load Summary
                </button>
              </div>
            </div>`);

content = content.replace(/runSqlQuery\(\`SELECT \* FROM \$\{activeTable === 'price_history' \? 'price_history' : 'fundamentals_historical'\} WHERE ticker = '\$\{t\}' ORDER BY \$\{activeTable === 'price_history' \? 'date' : 'report_date'\} DESC LIMIT 20;\`\);/g, `runSqlQuery(activeTable, t);`);

fs.writeFileSync('src/admin/DatabaseConsole.tsx', content);
