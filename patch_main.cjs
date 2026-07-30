const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');

// Remove the window.fetch override completely
content = content.replace(/const originalFetch = window\.fetch;[\s\S]*?return originalFetch\(\.\.\.args\);\n\};\n/m, '');

const appFetchCode = `
const originalFetch = window.fetch;
window.appFetch = async (...args) => {
  let [resource, config] = args;
  
  let isApiCall = false;
  if (typeof resource === 'string' && resource.includes('/api/')) {
    isApiCall = true;
  } else if (resource instanceof Request && resource.url.includes('/api/')) {
    isApiCall = true;
  }
  
  if (isApiCall && auth?.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (typeof resource === 'string') {
         config = config || {};
         config.headers = {
           ...config.headers,
           'Authorization': \`Bearer \${token}\`
         };
         args = [resource, config];
      } else {
         const newReq = new Request(resource, config);
         newReq.headers.set('Authorization', \`Bearer \${token}\`);
         args = [newReq];
      }
    } catch(e) {
      console.warn('Failed to attach auth token:', e);
    }
  }
  return originalFetch(...args);
};

declare global {
  interface Window {
    appFetch: typeof fetch;
  }
}
`;

content = content.replace(/import \{ auth \} from '\.\/lib\/firebase';/, "import { auth } from './lib/firebase';\n" + appFetchCode);

fs.writeFileSync('src/main.tsx', content);
