import 'dotenv/config';

async function run() {
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfDatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!cfAccountId || !cfDatabaseId || !cfApiToken) {
    console.error("Missing Cloudflare environment variables.");
    return;
  }

  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/d1/database/${cfDatabaseId}/query`;
    
    // Check first few dates for ^JKSE
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: "SELECT MIN(date) as min_date, MAX(date) as max_date, COUNT(*) as count FROM price_history WHERE ticker = '^JKSE';",
        params: []
      })
    });
    
    const data = await response.json();
    console.log("JKSE current range in DB:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
