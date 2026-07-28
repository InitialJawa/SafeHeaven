const fs = require('fs');
let content = fs.readFileSync('src/AppLayout.tsx', 'utf8');
console.log(content.includes('GoogleIcon className="w-2.5 h-2.5"'));
