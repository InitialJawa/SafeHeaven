const fs = require('fs');
let content = fs.readFileSync('src/AppLayout.tsx', 'utf8');

content = content.replace(/\{\(user\.email\?\.toLowerCase\(\)\.includes\('gmail'\) \|\| user\.photoURL\) && \(\s*<span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0\.5 border border-\[#1b1926\] shadow-md z-10" title="Akun Gmail \/ Google">\s*<GoogleIcon className="w-2\.5 h-2\.5" \/>\s*<\/span>\s*\)\}/g, '');

content = content.replace(/\{\(user\?\.email\?\.toLowerCase\(\)\.includes\('gmail'\) \|\| user\?\.photoURL\) && \(\s*<span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0\.5 border border-\[#1b1926\] shadow-sm z-10" title="Akun Gmail \/ Google">\s*<GoogleIcon className="w-2\.5 h-2\.5" \/>\s*<\/span>\s*\)\}/g, '');

content = content.replace(/\{user\.email\?\.toLowerCase\(\)\.includes\('gmail'\) \? \([\s\S]*?\) : \(\s*<span className="text-\[10px\] text-\[#ccff00\] uppercase font-mono font-bold block truncate">\s*\{user\.isPremium \|\| user\.tier === 'Platinum' \? '⭐ Platinum Member' : user\.role\}\s*<\/span>\s*\)\}/, 
  `<span className="text-[10px] text-[#ccff00] uppercase font-mono font-bold block truncate">
                          {user.isPremium || user.tier === 'Platinum' ? '⭐ Platinum Member' : user.role}
                        </span>`);

content = content.replace(/\{user\?\.email\?\.toLowerCase\(\)\.includes\('gmail'\) \? \([\s\S]*?\) : \(\s*<span className="text-\[9px\] text-\[#ccff00\] font-mono block truncate">\s*\{isPremium \? '⭐ Premium Active' : 'Demo Active'\}\s*<\/span>\s*\)\}/,
  `<span className="text-[9px] text-[#ccff00] font-mono block truncate">
                      {isPremium ? '⭐ Premium Active' : 'Demo Active'}
                    </span>`);

content = content.replace(/\{user\?\.email\?\.toLowerCase\(\)\.includes\('gmail'\) \? \([\s\S]*?\) : \(\s*<span className="text-\[9px\] text-\[#ccff00\] uppercase font-mono font-bold block truncate">\s*\{isPremium \? '⭐ Premium Member' : 'Demo Active'\}\s*<\/span>\s*\)\}/,
  `<span className="text-[9px] text-[#ccff00] uppercase font-mono font-bold block truncate">
                        {isPremium ? '⭐ Premium Member' : 'Demo Active'}
                      </span>`);

fs.writeFileSync('src/AppLayout.tsx', content);
