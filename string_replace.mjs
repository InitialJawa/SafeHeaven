import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*\{\/\* TAB 1: OVERVIEW & EQUITY CURVE \*\/\}\s*\{activeTab === 'overview' && \(/;

const replacement = `</div>
          
          {!result && !loading ? (
            <div className="card card-elevated p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px] bg-[#0b0a10]/50 border border-[#1b1926]">
              <div className="w-16 h-16 rounded-full bg-[#111018] border border-[#1b1926] flex items-center justify-center text-[#686477] mb-4">
                <Activity className="w-8 h-8 text-[#ccff00]" />
              </div>
              <h3 className="text-base font-bold text-white font-sans">Menunggu Simulasi QuantLab</h3>
              <p className="text-xs text-[#686477] max-w-sm mt-1.5 font-sans font-medium leading-relaxed">
                Gunakan konsol konfigurasi di sebelah kiri untuk me-render grafik performa aset historis, analisis krisis, simulasi Monte Carlo, dan log transaksi rebalancing.
              </p>
            </div>
          ) : loading ? (
            <div className="card card-elevated p-8 sm:p-12 flex flex-col items-center justify-center text-center h-full min-h-[550px] bg-[#0b0a10]/50 border border-[#1b1926] relative overflow-hidden">
              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="#111018" strokeWidth="8" fill="transparent" />
                  <circle cx="72" cy="72" r="58" stroke="#ccff00" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)} className="transition-all duration-300 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">{progress}%</span>
                  <span className="text-[8px] text-[#686477] font-bold uppercase tracking-widest mt-0.5">Total Progress</span>
                </div>
              </div>
              <h4 className="text-xs font-black text-[#ccff00] font-sans uppercase tracking-widest min-h-[16px] transition-all px-4 leading-relaxed max-w-md">{loadingText}</h4>
              <p className="text-[10px] text-[#686477] mt-1 font-sans font-medium">Sistem menguji alokasi taktis portofolio secara dinamis berdasarkan data historis...</p>
              <div className="w-full max-w-md mt-8">
                <div className="w-full bg-[#111018] rounded-full h-2 overflow-hidden border border-[#1b1926]">
                  <div className="bg-[#ccff00] h-full transition-all duration-300 ease-out" style={{ width: \`\${progress}%\` }}></div>
                </div>
              </div>
            </div>
          ) : (
            result && (
              <div className="flex-1 animate-fadeIn flex flex-col min-h-0 relative">
                {/* TAB 1: OVERVIEW & EQUITY CURVE */}
                {activeTab === 'overview' && (`

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  console.log("Regex Replaced!");
} else {
  console.log("Regex not found!");
}

fs.writeFileSync('src/pages/Backtest.tsx', content);
