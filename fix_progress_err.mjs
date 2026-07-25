import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex3 = /if \(stepProgress === 100 && activeStepIdx < 3\) \{[\s\S]*?activeStepIdx\+\+;[\s\S]*?\}/;
content = content.replace(regex3, '');

fs.writeFileSync('src/pages/Backtest.tsx', content);
