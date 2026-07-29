const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');
code = code.replace(
  "import Markdown from 'react-markdown';",
  "import Markdown from 'react-markdown';\nimport remarkGfm from 'remark-gfm';"
);
code = code.replace(
  "<Markdown>{msg.text}</Markdown>",
  "<Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>"
);
fs.writeFileSync('src/pages/AiManager.tsx', code);
