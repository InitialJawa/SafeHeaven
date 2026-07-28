const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });

db.execute("SELECT date, close FROM price_history WHERE ticker = '^JKSE' AND date LIKE '2024-%' LIMIT 5").then(res => console.log('2024', res.rows));
