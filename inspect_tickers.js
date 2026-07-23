import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:safehaven.db",
});

async function run() {
  try {
    const tickersRes = await client.execute("SELECT ticker, COUNT(*) as count FROM price_history GROUP BY ticker ORDER BY count DESC LIMIT 20;");
    console.log("Top Tickers in price_history:");
    console.log(tickersRes.rows);

    const fundsRes = await client.execute("SELECT ticker, COUNT(*) as count FROM fundamentals_historical GROUP BY ticker ORDER BY count DESC LIMIT 20;");
    console.log("\nTop Tickers in fundamentals_historical:");
    console.log(fundsRes.rows);

    const postsRes = await client.execute("SELECT COUNT(*) as count FROM posts;");
    console.log("\nTotal posts:", postsRes.rows[0].count);
  } catch (err) {
    console.error(err);
  }
}

run();
