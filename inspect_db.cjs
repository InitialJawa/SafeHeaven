const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('safehaven.db');

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Tables:", tables.map(t => t.name).join(', '));
    
    tables.forEach(table => {
      db.all(`PRAGMA table_info(${table.name});`, (err, cols) => {
         console.log(`\nTable ${table.name} schema:`, cols.map(c => `${c.name} (${c.type})`).join(', '));
      });
      db.get(`SELECT * FROM ${table.name} LIMIT 1;`, (err, row) => {
         console.log(`Table ${table.name} sample row:`, row);
      });
    });
  });
});
