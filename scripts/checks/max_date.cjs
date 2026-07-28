const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:data/safehaven.db' });
db.execute("SELECT MAX(date) FROM price_history").then(res => console.log(res.rows));
