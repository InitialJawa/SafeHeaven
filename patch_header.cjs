const fs = require('fs');

let content = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

const regex = /\{\/\* Navigation and Name Header \*\/\}\s*<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">[\s\S]*?<span>Export<\/span>\s*<\/button>\s*<\/div>\s*<\/div>/;

const newHeader = `{/* Navigation and Name Header */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex items-center justify-between">
            <button
              id="ticker-back-btn"
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-xs text-[#9f9bac] hover:text-white bg-transparent border-0 cursor-pointer p-0 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            
            <button
                onClick={() => downloadPDF('ticker-detail-view', \`Analysis_\${details.symbol}\`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1926] hover:bg-[#252233] border border-[#2a273b] text-[#9f9bac] hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
                <Download className="w-3.5 h-3.5" /> PDF
            </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <TickerLogo symbol={details.symbol} sizeClassName="w-14 h-14" />
                <div className="text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono leading-none">{details.symbol}</h1>
                    <span className="text-sm text-[#9f9bac] font-sans font-medium mt-1 block">{details.name}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 md:border-l border-[#1b1926] pt-4 md:pt-0 md:pl-6">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-[#686477] uppercase font-bold tracking-wider font-sans block leading-none mb-1.5">Harga Terakhir</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-white tracking-tight">Rp {details.price.toLocaleString('id-ID')}</span>
                    <span className={\`text-sm font-bold font-mono \${details.changePercent >= 0 ? 'text-[#00f5a0]' : 'text-[#ff3366]'}\`}>
                        {details.changePercent >= 0 ? '+' : ''}{details.changePercent.toFixed(2)}%
                    </span>
                </div>
              </div>
            </div>
        </div>
      </div>`;

content = content.replace(regex, newHeader);
fs.writeFileSync('src/pages/TickerDetail.tsx', content);
