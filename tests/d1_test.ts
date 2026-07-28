import dotenv from 'dotenv';
dotenv.config();

const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const cfDatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;

async function test() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/d1/database/${cfDatabaseId}/query`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: 'SELECT * FROM portfolio_configs',
        params: []
      })
    });
    const data = await res.json();
    console.log('portfolio_configs:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
