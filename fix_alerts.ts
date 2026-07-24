import { createClient } from '@libsql/client';
const dbClient = createClient({ url: 'file:safehaven.db' });
async function check() {
  const c = await dbClient.execute("SELECT COUNT(*) as c FROM alerts");
  console.log("alerts: ", c.rows[0].c);
  const p = await dbClient.execute("SELECT COUNT(*) as c FROM portfolio_snapshots");
  console.log("snapshots: ", p.rows[0].c);
}
check();
