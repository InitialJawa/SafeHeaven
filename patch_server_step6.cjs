const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const rateLimitCode = `
import rateLimit from 'express-rate-limit';

const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each user to 20 requests per windowMs
  keyGenerator: (req) => {
    return req.user?.uid || req.ip || 'anonymous';
  },
  message: { error: 'Terlalu banyak permintaan (Rate Limit Exceeded). Silakan coba lagi nanti.' }
});
`;

content = content.replace(/const app = express\(\);/g, `${rateLimitCode}\nconst app = express();`);
content = content.replace(/app\.post\('\/api\/chat',/g, `app.post('/api/chat', chatRateLimiter,`);

fs.writeFileSync('server.ts', content);
