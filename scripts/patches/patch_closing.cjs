const fs = require('fs');
let content = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

content = content.replace(
  /\{\/\* 3\. Interactive Sub-Tabs Bar \*\/\}/,
  '        </div>\n      </div>\n\n      {/* 3. Interactive Sub-Tabs Bar */}'
);

fs.writeFileSync('src/pages/TickerDetail.tsx', content);
