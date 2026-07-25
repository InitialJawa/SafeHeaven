import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex = /<div className="relative w-36 h-36 flex items-center justify-center mb-6">[\s\S]*?<\/div>\s*<\/div>\s*\)\s*:\s*\(/;

const singleLineReplacement = `
              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#111018"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#ccff00"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)}
                    className="transition-all duration-300 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">{progress}%</span>
                  <span className="text-[8px] text-[#686477] font-bold uppercase tracking-widest mt-0.5">Total Progress</span>
                </div>
              </div>

              <h4 className="text-xs font-black text-[#ccff00] font-sans uppercase tracking-widest min-h-[16px] transition-all px-4 leading-relaxed max-w-md">
                {loadingText}
              </h4>
              <p className="text-[10px] text-[#686477] mt-1 font-sans font-medium">
                Sistem menguji alokasi taktis portofolio secara dinamis berdasarkan data historis...
              </p>

              <div className="w-full max-w-md mt-8">
                <div className="w-full bg-[#111018] rounded-full h-2 overflow-hidden border border-[#1b1926]">
                  <div 
                    className="bg-[#ccff00] h-full transition-all duration-300 ease-out" 
                    style={{ width: \`\${progress}%\` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
`;

if (regex.test(content)) {
  content = content.replace(regex, singleLineReplacement);
  console.log('Replaced successfully');
} else {
  console.log("Regex did not match");
}

fs.writeFileSync('src/pages/Backtest.tsx', content);
