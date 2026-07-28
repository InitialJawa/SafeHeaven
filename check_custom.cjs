const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });

db.execute("SELECT DISTINCT ticker FROM price_history WHERE ticker NOT LIKE '%.JK' AND ticker NOT IN ('^JKSE', 'GC=F', 'IDR=X')").then(res => {
  console.log('Other symbols:', res.rows);
}).catch(console.error);
