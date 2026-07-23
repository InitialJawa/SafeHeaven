const fs = require('fs');
let code = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');

const original = `              {/* Progress bars of Asset Allocation */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-extrabold text-[#686477] uppercase tracking-wider font-sans">Alokasi Sasaran Makro</span>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#111018]/80 border border-[#1b1926]">
                  <div style={{ width: \`\${strat.allocationSaham}%\` }} className="bg-[#ccff00]" title="Saham"></div>
                  <div style={{ width: \`\${strat.allocationEmas}%\` }} className="bg-[#00f0ff]" title="Emas"></div>
                  <div style={{ width: \`\${strat.allocationCash}%\` }} className="bg-[#686477]" title="Kas"></div>
                  <div style={{ width: \`\${strat.allocationUSD}%\` }} className="bg-[#ff3366]" title="USD"></div>
                </div>
                <div className="flex justify-between text-[9px] text-[#9f9bac] font-mono font-bold">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span> Saham: {strat.allocationSaham}%</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span> Emas: {strat.allocationEmas}%</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#686477]"></span> Kas: {strat.allocationCash}%</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ff3366]"></span> USD: {strat.allocationUSD}%</span>
                </div>
              </div>`;

if(code.includes(original)) {
  code = code.replace(original, '');
  fs.writeFileSync('src/pages/Strategies.tsx', code);
  console.log('Update applied.');
} else {
  console.log('Original block not found.');
}
