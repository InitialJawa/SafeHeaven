import 'dotenv/config';
import yahooFinance from 'yahoo-finance2';
const yf = new yahooFinance();

async function run() {
  try {
    const hist = await yf.historical('^JKSE', {
      period1: '2021-01-04',
      period2: '2026-07-20',
      interval: '1d'
    });
    console.log("History count:", hist.length);
    if (hist.length > 0) {
      console.log("First bar:", hist[0]);
      console.log("Last bar:", hist[hist.length - 1]);
    }
  } catch (err) {
    console.error("YF error:", err);
  }
}

run();
