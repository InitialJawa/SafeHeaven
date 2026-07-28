const fs = require('fs');

// Patch TickerDetail.tsx to remove the one inside the chart card
let tickerDetail = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

// Replace the chart header ticker info with an empty div, to keep justify-between working if needed
// Or just remove the whole flex items-center gap-3
tickerDetail = tickerDetail.replace(
  /<div className="flex items-center gap-3">\s*<TickerLogo symbol={details\.symbol} sizeClassName="w-8 h-8" \/>\s*<div>\s*<h3 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">\s*<span className="font-mono text-\[#ccff00\] font-extrabold text-base">{details\.symbol}<\/span>\s*<span className="text-\[#9f9bac\] font-normal text-xs truncate max-w-\[150px\] sm:max-w-\[250px\]">{details\.name}<\/span>\s*<\/h3>\s*<p className="text-\[11px\] text-\[#686477\] font-sans mt-0\.5 flex items-center gap-2">\s*<span>Rp {details\.price\.toLocaleString\('id-ID'\)}<\/span>\s*<span className={`font-mono font-bold \$\{details\.changePercent >= 0 \? 'text-\[#00f5a0\]' : 'text-\[#ff3366\]'\}`}>\s*\(\{details\.changePercent >= 0 \? '\+' : ''\}\{details\.changePercent\.toFixed\(2\)\}\%\)\s*<\/span>\s*<\/p>\s*<\/div>\s*<\/div>/,
  '<div></div>'
);

// Patch the icons in the cards
tickerDetail = tickerDetail.replace(/<Activity className="w-4 h-4 text-\[#ccff00\]" \/>/g, '');
tickerDetail = tickerDetail.replace(/<PieChart className="w-4 h-4 text-\[#ccff00\]" \/>/g, '');
tickerDetail = tickerDetail.replace(/<LayoutDashboard className="w-4 h-4 text-\[#ccff00\]" \/>/g, '');
tickerDetail = tickerDetail.replace(/<Bell className="w-4 h-4 text-\[#ccff00\]" \/>/g, '');

fs.writeFileSync('src/pages/TickerDetail.tsx', tickerDetail);

// Patch WidgetWatchlistDetail.tsx
let widgetWatchlist = fs.readFileSync('src/components/WidgetWatchlistDetail.tsx', 'utf8');
widgetWatchlist = widgetWatchlist.replace(
  /\{\/\* 2\. Ticker Main Info Header \*\/\}\s*<div className="space-y-1">\s*<div className="flex items-center justify-between gap-2">\s*<div className="flex items-center gap-2">\s*<TickerLogo symbol=\{data\.symbol\} sizeClassName="w-8 h-8" \/>\s*<span className="text-base font-black text-white font-mono tracking-tight">\{data\.symbol\}<\/span>\s*<\/div>\s*<\/div>\s*<div className="flex items-center gap-1\.5 text-xs text-\[#9f9bac\]">\s*<span className="font-semibold text-white\/90 truncate max-w-\[200px\]">\{data\.name\}<\/span>\s*<a \s*href=\{`https:\/\/www\.idx\.co\.id\/id\/perusahaan-tercatat\/profil-perusahaan-tercatat\/\$\{data\.symbol\}`\}\s*target="_blank"\s*rel="noopener noreferrer"\s*className="text-\[#686477\] hover:text-\[#ccff00\] transition-colors"\s*>\s*<ExternalLink className="w-3 h-3 inline" \/>\s*<\/a>\s*<span>-<\/span>\s*<span className="font-mono text-\[10px\] text-\[#686477\]">\{data\.exchange\}<\/span>\s*<\/div>\s*<div className="text-\[11px\] text-\[#686477\]">\s*\{data\.sector\} · \{data\.subsector\}\s*<\/div>\s*<\/div>/,
  ''
);

fs.writeFileSync('src/components/WidgetWatchlistDetail.tsx', widgetWatchlist);
