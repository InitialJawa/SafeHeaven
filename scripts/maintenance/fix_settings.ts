import fs from 'fs';

let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');
const lines = code.split('\n');

// remove lines 546-551
// Be careful with zero index!
// We want to keep 552.
const newLines = [
...lines.slice(0, 546),
...lines.slice(551)
];

fs.writeFileSync('src/pages/Settings.tsx', newLines.join('\n'));
