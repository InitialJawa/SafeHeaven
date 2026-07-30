const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

const targetStr = `                    onClick={() => handleSelectSession(sess.id)}`;
const replacementStr = `                    onClick={() => {
                      handleSelectSession(sess.id);
                      setIsSidebarOpen(false);
                    }}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/pages/AiManager.tsx', code);
  console.log("Patched sidebar click");
}
