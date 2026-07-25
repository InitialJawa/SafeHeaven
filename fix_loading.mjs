import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

// Remove gradients
content = content.replace(/<div className="absolute w-80 h-80 rounded-full bg-\[#ccff00\]\/5 blur-\[100px\] pointer-events-none -top-20 -left-20" \/>/g, '');
content = content.replace(/<div className="absolute w-80 h-80 rounded-full bg-\[#00f5a0\]\/5 blur-\[100px\] pointer-events-none -bottom-20 -right-20" \/>/g, '');

// Simplify the UI
const listRegex = /<div className="w-full max-w-xl mt-8 space-y-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\)\s*:\s*\(/;

const singleLineReplacement = `
              <div className="w-full max-w-md mt-8">
                <div className="w-full bg-[#111018] rounded-full h-2 overflow-hidden border border-[#1b1926]">
                  <div 
                    className="bg-gradient-to-r from-[#00f5a0] to-[#ccff00] h-full transition-all duration-300 ease-out" 
                    style={{ width: \`\${progress}%\` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
`;

if (listRegex.test(content)) {
  content = content.replace(listRegex, singleLineReplacement);
} else {
  console.log("Regex for list did not match");
}

fs.writeFileSync('src/pages/Backtest.tsx', content);
