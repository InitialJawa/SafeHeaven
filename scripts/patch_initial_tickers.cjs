const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const originalTickers = `const INITIAL_TICKERS = [
  { symbol: 'BBCA', name: 'Bank Central Asia Tbk', price: 10450, changePercent: 1.25, score: 88, signal: 'Beli' as const },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', price: 4620, changePercent: -0.85, score: 85, signal: 'Akumulasi' as const },
  { symbol: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', price: 6350, changePercent: 2.10, score: 82, signal: 'Akumulasi' as const },
  { symbol: 'TLKM', name: 'Telkom Indonesia Tbk', price: 3120, changePercent: 0.15, score: 79, signal: 'Tahan' as const },
  { symbol: 'ASII', name: 'Astra International Tbk', price: 4850, changePercent: -1.20, score: 65, signal: 'Tahan' as const },
  { symbol: 'BBNI', name: 'Bank Negara Indonesia Tbk', price: 4980, changePercent: 0.50, score: 72, signal: 'Tahan' as const },
  { symbol: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 2750, changePercent: -2.30, score: 58, signal: 'Hindari' as const },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 54, changePercent: 0.00, score: 32, signal: 'Jual' as const },
  { symbol: 'UNVR', name: 'Unilever Indonesia Tbk', price: 2240, changePercent: -1.10, score: 45, signal: 'Hindari' as const },
  { symbol: 'KLBF', name: 'Kalbe Farma Tbk', price: 1510, changePercent: 1.85, score: 76, signal: 'Akumulasi' as const },
];`;

const newTickers = `const INITIAL_TICKERS = [
  { symbol: 'BBCA', name: 'Bank Central Asia Tbk', price: 8900, changePercent: -12.50, score: 48, signal: 'Hindari' as const },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', price: 4200, changePercent: -14.85, score: 45, signal: 'Hindari' as const },
  { symbol: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', price: 5450, changePercent: -13.10, score: 42, signal: 'Hindari' as const },
  { symbol: 'TLKM', name: 'Telkom Indonesia Tbk', price: 2820, changePercent: -15.15, score: 39, signal: 'Jual' as const },
  { symbol: 'ASII', name: 'Astra International Tbk', price: 4850, changePercent: -11.20, score: 35, signal: 'Jual' as const },
  { symbol: 'BBNI', name: 'Bank Negara Indonesia Tbk', price: 4480, changePercent: -10.50, score: 42, signal: 'Hindari' as const },
  { symbol: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 2750, changePercent: -12.30, score: 38, signal: 'Jual' as const },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 54, changePercent: 0.00, score: 32, signal: 'Jual' as const },
  { symbol: 'UNVR', name: 'Unilever Indonesia Tbk', price: 2240, changePercent: -11.10, score: 25, signal: 'Jual' as const },
  { symbol: 'KLBF', name: 'Kalbe Farma Tbk', price: 1510, changePercent: -1.85, score: 56, signal: 'Tahan' as const },
];`;

code = code.replace(originalTickers, newTickers);

// Set stopLossTriggered to true and crashShieldActive to true
code = code.replace(
  'stopLossTriggered: false,\n  crashShieldActive: true,',
  'stopLossTriggered: true,\n  crashShieldActive: true,'
);

fs.writeFileSync('server.ts', code);
