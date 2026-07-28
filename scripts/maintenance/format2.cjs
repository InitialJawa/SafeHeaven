const fs = require('fs');
let content = fs.readFileSync('src/AppLayout.tsx', 'utf8');

// Subtitle block 1 (desktop sidebar expanded)
content = content.replace(/<div className="flex items-center gap-1 text-\[10px\] text-\[#9f9bac\] truncate">\s*<span className="text-\[10px\] text-\[#ccff00\] uppercase font-mono font-bold block truncate">\s*\{user\.isPremium \|\| user\.tier === 'Platinum' \? '⭐ Platinum Member' : user\.role\}\s*<\/span>\s*<\/div>/g, '');

// Subtitle block 2 (mobile top nav)
content = content.replace(/<span className="text-\[9px\] text-\[#ccff00\] font-mono block truncate">\s*\{isPremium \? '⭐ Premium Active' : 'Demo Active'\}\s*<\/span>/g, '');

// Subtitle block 3 (mobile sidebar expanded)
content = content.replace(/<span className="text-\[9px\] text-\[#ccff00\] uppercase font-mono font-bold block truncate">\s*\{isPremium \? '⭐ Premium Member' : 'Demo Active'\}\s*<\/span>/g, '');


fs.writeFileSync('src/AppLayout.tsx', content);
