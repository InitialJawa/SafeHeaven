const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });

db.execute("SELECT ticker FROM tickers WHERE ticker IN ('^JKSE', 'GC=F', 'IDR=X')").then(res => {
  console.log('Tickers table:', res.rows);
}).catch(console.error);
