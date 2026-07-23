import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:safehaven.db",
});

async function run() {
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    const tables = res.rows.map(r => r.name);
    console.log("Tables:", tables.join(', '));
    
    for (const table of tables) {
      const cols = await client.execute(`PRAGMA table_info(${table});`);
      console.log(`\nTable ${table} schema:`, cols.rows.map(c => `${c.name} (${c.type})`).join(', '));
      
      const row = await client.execute(`SELECT * FROM ${table} LIMIT 1;`);
      console.log(`Table ${table} sample row:`, row.rows[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
