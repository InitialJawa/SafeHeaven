const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });

db.execute("SELECT DISTINCT ticker FROM price_history WHERE ticker LIKE '%IHSG%' OR ticker LIKE '%JKSE%' OR ticker LIKE '%GC%'").then(res => {
  console.log(res.rows);
}).catch(console.error);
