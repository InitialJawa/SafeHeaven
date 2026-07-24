import { createClient } from '@libsql/client';
const dbClient = createClient({ url: 'file:safehaven.db' });
async function run() {
  const count = await dbClient.execute("SELECT id FROM portfolio_configs LIMIT 1;");
  console.log(count.rows[0]?.id);
}
run();
