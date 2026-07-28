const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const cfDatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;

console.log("Account:", cfAccountId);
console.log("DB:", cfDatabaseId);
console.log("Token:", cfApiToken ? "SET" : "NOT SET");

async function test() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/d1/database/${cfDatabaseId}/query`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfApiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql: "SELECT 1 as val", params: [] })
  });
  const data = await response.json();
  console.log("Response:", JSON.stringify(data, null, 2));
}

test().catch(console.error);
