const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });

db.execute("SELECT DISTINCT ticker FROM price_history WHERE ticker = 'IHSG' OR ticker = 'EMAS' OR ticker = 'GOLD'").then(res => {
  console.log('Match:', res.rows);
}).catch(console.error);
