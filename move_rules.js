const fs = require('fs');

let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

// The rules block is everything from `{/* Factor Weight Sliders */}` to just before `{/* TAB 3: STRESS TEST & CRISIS SIMULATION */}`.
// I'll grab it using regex.
const ruleBlockMatch = content.match(/\{\/\* Factor Weight Sliders \*\/\}([\s\S]*?)\{\/\* Executable Rules Preview Code Box \*\/\}/);
if (!ruleBlockMatch) {
  console.log('Rule block not found');
  process.exit(1);
}

const ruleBlock = ruleBlockMatch[1];
// Find where the form ends.
const formEndMatch = content.match(/<\/form>\s*(?:<\/(?:div|React.Fragment)>)?/);

// Wait, it's easier to find the exact place I inserted `{configTab === 'params' ? (`.
// Then I close it with `) : (` and insert the ruleBlock and the Executable Rules Preview Code Box.

// Let's first extract the two blocks.
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

// Make the lg:col-span-6 classes full width since it's in the sidebar now.
innerRulesContent = innerRulesContent.replace(/lg:col-span-6/g, 'w-full');
// Reduce some paddings maybe? Or leave as is.

// Now find where to insert in the sidebar.
// The form ends with `Jalankan Backtest\n                </>\n              )}\n            </button>\n          </form>`
const sidebarRegex = /(<\/form>)/;
content = content.replace(sidebarRegex, `$1\n          ) : (\n            <div className="space-y-5 animate-fadeIn flex flex-col">\n              ${innerRulesContent}\n            </div>\n          )}`);

// Now remove the activeTab === 'rules' from the main view
content = content.replace(/\{\/\* TAB 2: QUANTLAB STRATEGY RULE BUILDER IDE \*\/\}\s*\{activeTab === 'rules' && \([\s\S]*?\}\)\s*(?=\{\/\* TAB 3)/, '');

// Also need to remove the "Rule Builder IDE" button from the main navigation tabs bar.
content = content.replace(/<button[^>]*onClick=\{\(\) => setActiveTab\('rules'\)\}[^>]*>[\s\S]*?<\/button>/, '');

// And modify the tabs container to be flex-nowrap overflow-x-auto
content = content.replace(/<div className="sticky top-0 z-20 bg-\[#060608\] flex flex-col sm:flex-row sm:items-center justify-between border-b border-\[#1b1926\] pt-1 pb-1 gap-3 shrink-0">/, `<div className="sticky top-0 z-20 bg-[#060608] flex items-center justify-between border-b border-[#1b1926] pt-1 pb-1 gap-3 shrink-0 px-1 overflow-hidden">`);

content = content.replace(/<div className="flex flex-wrap gap-1\.5">/, `<div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-1.5 flex-1">`);

fs.writeFileSync('src/pages/Backtest.tsx', content);
console.log('done');
