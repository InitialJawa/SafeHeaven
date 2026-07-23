const yfLib = require('yahoo-finance2').default;
const yf = new yfLib();
yf.quote('BBCA.JK').then(res => console.log(res.regularMarketPrice)).catch(console.error);
