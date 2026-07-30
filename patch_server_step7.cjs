const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const securityHeadersCode = `
import helmet from 'helmet';
import cors from 'cors';

// Allowed origins
const allowedOrigins = [
  'https://ais-dev-r5abb57u446w7nfq2bmgnc-971900799550.asia-southeast1.run.app',
  'https://ais-pre-r5abb57u446w7nfq2bmgnc-971900799550.asia-southeast1.run.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(helmet({
  contentSecurityPolicy: false, // We're using Vite middleware, strict CSP might break dev server
}));

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, false); // Block origin silently or error
    }
    return callback(null, true);
  },
  credentials: true
}));
`;

content = content.replace(/app\.use\(express\.json\(\)\);/g, `${securityHeadersCode}\napp.use(express.json());`);

fs.writeFileSync('server.ts', content);
