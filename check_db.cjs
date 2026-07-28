const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });

db.execute("SELECT ticker, COUNT(*) as count FROM price_history WHERE ticker IN ('^JKSE', 'GC=F', 'IDR=X') GROUP BY ticker").then(res => {
  console.log(res.rows);
}).catch(console.error);
