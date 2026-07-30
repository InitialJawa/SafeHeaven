const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Remove the old /api/db/query endpoint
const oldEndpointRegex = /app\.post\('\/api\/db\/query', async \(req, res\) => \{[\s\S]*?\n\}\);\n/g;
content = content.replace(oldEndpointRegex, '');

// Add the new specific parameterized endpoints
const newEndpoints = `
app.get('/api/db/admin/price_history', async (req, res) => {
  const { ticker } = req.query;
  try {
    let result;
    if (ticker) {
      result = await dbClient.execute({
        sql: 'SELECT * FROM price_history WHERE ticker = ? ORDER BY date DESC LIMIT 20',
        args: [String(ticker).toUpperCase().trim()]
      });
    } else {
      result = await dbClient.execute('SELECT * FROM price_history ORDER BY date DESC LIMIT 20');
    }
    res.json({
      success: true,
      columns: result.columns || [],
      rows: result.rows || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/db/admin/fundamentals_historical', async (req, res) => {
  const { ticker } = req.query;
  try {
    let result;
    if (ticker) {
      result = await dbClient.execute({
        sql: 'SELECT * FROM fundamentals_historical WHERE ticker = ? ORDER BY report_date DESC LIMIT 10',
        args: [String(ticker).toUpperCase().trim()]
      });
    } else {
      result = await dbClient.execute('SELECT * FROM fundamentals_historical ORDER BY report_date DESC LIMIT 10');
    }
    res.json({
      success: true,
      columns: result.columns || [],
      rows: result.rows || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/db/admin/records_summary', async (req, res) => {
  try {
    const result = await dbClient.execute('SELECT ticker, count(*) as total_records FROM price_history GROUP BY ticker ORDER BY total_records DESC LIMIT 15');
    res.json({
      success: true,
      columns: result.columns || [],
      rows: result.rows || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
`;

content = content.replace(/app\.get\('\/api\/db\/price_history\/:ticker',/g, newEndpoints + "\napp.get('/api/db/price_history/:ticker',");
fs.writeFileSync('server.ts', content);
