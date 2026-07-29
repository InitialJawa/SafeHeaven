const { createClient } = require('@libsql/client');
const fs = require('fs');

async function test() {
  const dbClient = createClient({ url: "file:data/safehaven.db" });
  try {
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS tickers (
        ticker TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sector TEXT,
        market TEXT DEFAULT 'IDX',
        is_active INTEGER DEFAULT 1,
        list TEXT DEFAULT 'idx80'
      );
    `);
    console.log("Created tickers");
  } catch(e) {
    console.error("Error creating tickers:", e);
  }
}
test();
