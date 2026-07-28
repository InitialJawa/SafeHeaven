const fs = require('fs');
let content = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

const regex = /\{\/\* Navigation and Name Header \*\/\}\s*<div className="flex flex-col gap-4 mb-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newHeader = `{/* Navigation and Name Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
            <div className="mb-4">
                <button
                id="ticker-back-btn"
                onClick={() => window.history.back()}
                className="flex items-center gap-1.5 text-xs text-[#9f9bac] hover:text-white bg-transparent border-0 cursor-pointer p-0 font-bold transition-colors"
                >
                <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
            </div>
            <div className="flex items-center gap-4">
                <TickerLogo symbol={details.symbol} sizeClassName="w-14 h-14" />
                <div className="text-left">
                    <div className="flex items-center gap-3 justify-start">
                      <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">{details.symbol}</h1>
                    </div>
                    <span className="text-sm text-[#9f9bac] font-sans font-medium mt-1 block">{details.name}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-stretch gap-3">
          <div className="bg-[#111018]/50 border border-[#1b1926] rounded-xl px-5 py-3 text-right flex items-center justify-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-[#686477] uppercase font-bold tracking-wider font-sans block leading-none mb-1.5">Harga Terakhir</span>
              <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-white">Rp {details.price.toLocaleString('id-ID')}</span>
                  <span className={\`text-sm font-bold font-mono \${details.changePercent >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}\`}>
                      {details.changePercent >= 0 ? '+' : ''}{details.changePercent.toFixed(2)}%
                  </span>
              </div>
            </div>
          </div>
          <button
              onClick={() => downloadPDF('ticker-detail-view', \`Analysis_\${details.symbol}\`)}
              className="flex flex-col items-center justify-center px-4 py-2 bg-[#1b1926] hover:bg-[#ccff00] hover:text-black border border-[#2a273b] hover:border-[#ccff00] text-[#9f9bac] rounded-xl text-xs font-bold transition-all cursor-pointer group"
              title="Download PDF"
          >
              <Download className="w-5 h-5 mb-1 group-hover:text-black text-[#9f9bac] transition-colors" />
              <span>Export</span>
          </button>
        </div>
      </div>`;

content = content.replace(regex, newHeader);
fs.writeFileSync('src/pages/TickerDetail.tsx', content);
