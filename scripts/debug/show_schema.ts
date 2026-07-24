import { createClient } from '@libsql/client';
const dbClient = createClient({ url: 'file:safehaven.db' });
async function run() {
  const res = await dbClient.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='portfolio_snapshots';");
  console.log(res.rows[0].sql);
  const count = await dbClient.execute("SELECT COUNT(*) as count FROM portfolio_snapshots;");
  console.log("Count:", count.rows[0].count);
}
run();
