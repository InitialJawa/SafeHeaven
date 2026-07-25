import fs from 'fs';

let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex = /\{\/\* TAB 2: QUANTLAB STRATEGY RULE BUILDER IDE \*\/\}\s*\{activeTab === 'rules' && \([\s\S]*?\}\)\s*(?=\{\/\* TAB 3: STRESS TEST)/;
content = content.replace(regex, '');

fs.writeFileSync('src/pages/Backtest.tsx', content);
console.log('done');
