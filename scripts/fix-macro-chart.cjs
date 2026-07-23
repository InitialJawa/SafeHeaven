const fs = require('fs');
let code = fs.readFileSync('src/components/MacroChart.tsx', 'utf8');

// Add autoSize
code = code.replace(/const chart = createChart\(chartContainerRef\.current, \{/, "const chart = createChart(chartContainerRef.current, {\n        autoSize: true,");

// Fix container unmounting
const renderRegex = /\{loading \? \([\s\S]*?LOADING DATA\.\.\.[\s\S]*?<\/div>\n\s*\) : \([\s\S]*?<div ref=\{chartContainerRef\} className="w-full h-full min-h-\[300px\] rounded-lg overflow-hidden" \/>\n\s*\)\}/;
const renderReplacement = `<div className="relative w-full h-full min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#686477] bg-[#0b0a10]/80 z-10 animate-pulse rounded-lg">
            LOADING DATA...
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0 rounded-lg overflow-hidden" />
      </div>`;

code = code.replace(renderRegex, renderReplacement);

fs.writeFileSync('src/components/MacroChart.tsx', code);
