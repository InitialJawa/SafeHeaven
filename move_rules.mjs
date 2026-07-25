import fs from 'fs';

let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const rulesFullMatch = content.match(/\{\/\* TAB 2: QUANTLAB STRATEGY RULE BUILDER IDE \*\/\}\s*\{activeTab === 'rules' && \([\s\S]*?\{\/\* TAB 3: STRESS TEST & CRISIS SIMULATION \*\/\}/);
if (!rulesFullMatch) {
  console.log('Full rules tab not found');
  process.exit(1);
}

const fullRulesTab = rulesFullMatch[0];
const innerRulesContentMatch = fullRulesTab.match(/<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">([\s\S]*?)<\/div>\s*<\/div>\s*\)\}\s*\{\/\* TAB 3: STRESS TEST/);

if (!innerRulesContentMatch) {
  console.log("Inner rules not found");
  process.exit(1);
}
let innerRulesContent = innerRulesContentMatch[1];

innerRulesContent = innerRulesContent.replace(/lg:col-span-6/g, 'w-full');

const sidebarRegex = /(<\/form>)/;
content = content.replace(sidebarRegex, `$1\n          ) : (\n            <div className="space-y-5 animate-fadeIn flex flex-col">\n              ${innerRulesContent}\n            </div>\n          )}`);

content = content.replace(/\{\/\* TAB 2: QUANTLAB STRATEGY RULE BUILDER IDE \*\/\}\s*\{activeTab === 'rules' && \([\s\S]*?\}\)\s*(?=\{\/\* TAB 3)/, '');

content = content.replace(/<button[^>]*onClick=\{\(\) => setActiveTab\('rules'\)\}[^>]*>[\s\S]*?<\/button>/, '');

content = content.replace(/<div className="sticky top-0 z-20 bg-\[#060608\] flex flex-col sm:flex-row sm:items-center justify-between border-b border-\[#1b1926\] pt-1 pb-1 gap-3 shrink-0">/, `<div className="sticky top-0 z-20 bg-[#060608] flex items-center justify-between border-b border-[#1b1926] pt-1 pb-1 gap-3 shrink-0 px-1 overflow-hidden">`);

content = content.replace(/<div className="flex flex-wrap gap-1\.5">/, `<div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-1.5 flex-1">`);

fs.writeFileSync('src/pages/Backtest.tsx', content);
console.log('done');
