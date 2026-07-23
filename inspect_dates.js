import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:safehaven.db",
});

async function run() {
  try {
    const res = await client.execute("SELECT MIN(date) as min_date, MAX(date) as max_date, COUNT(*) as count FROM price_history WHERE ticker = 'RAJA';");
    console.log("RAJA price history statistics:", res.rows);
  } catch (err) {
    console.error(err);
  }
}

run();
