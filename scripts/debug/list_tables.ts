import { createClient } from '@libsql/client';
const dbClient = createClient({ url: 'file:safehaven.db' });
async function run() {
  const res = await dbClient.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.log(res.rows);
}
run();
