const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const adminMiddleware = `
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Missing user context' });
  }
  // Check for custom claim 'admin'
  if (req.user.admin !== true) {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }
  next();
};

app.use('/api/admin', requireAdmin);
`;

content = content.replace(/\/\/ Apply auth middleware to \/api\napp\.use\('\/api', verifyAuth\);/g, `// Apply auth middleware to /api
app.use('/api', verifyAuth);

${adminMiddleware}
`);

fs.writeFileSync('server.ts', content);
