import YahooFinance from 'yahoo-finance2';
const yf = new YahooFinance();
async function test() {
  const result = await yf.quote(['BBCA.JK', 'GOTO.JK']);
  console.log(result.length);
}
test();
