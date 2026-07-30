const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Add firebase admin imports and verifyAuth middleware
const authMiddleware = `
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Only initialize if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    // We only need projectId for verifyIdToken to work, it fetches public keys
    projectId: "ai-studio-safeheaven-feb17918-0b82-4235-b3c1-5e4a8fa033c0" // fallback, actual project id doesn't matter much for token verify if credentials aren't checked, but we'll try application default
  });
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

const verifyAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Public routes that bypass auth
  const publicPaths = [
    '/api/db/info',
    '/api/db/stats',
    '/api/market/snapshot',
    '/api/market/macro',
    '/api/market/regime',
    '/api/market/live-stats',
    '/api/live-tickers',
    '/api/news'
  ];
  const publicPrefixes = [
    '/api/db/price_history/',
    '/api/ticker/',
    '/api/widgets/'
  ];
  
  const isPublic = publicPaths.includes(req.path) || publicPrefixes.some(prefix => req.path.startsWith(prefix));
  
  if (isPublic) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Apply auth middleware to /api
app.use('/api', verifyAuth);
`;

content = content.replace(/const app = express\(\);\nconst PORT = 3000;/g, `const app = express();\nconst PORT = 3000;\n\n${authMiddleware}`);

fs.writeFileSync('server.ts', content);
