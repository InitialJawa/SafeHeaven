const fs = require('fs');
let code = fs.readFileSync('src/pages/Optimizer.tsx', 'utf8');

code = code.replace(
  '{/* Optimizer Search Method */}',
  `{method === 'Walk-Forward' && (
              <div className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 p-3 rounded-xl">
                <strong>Multi-Tier Rotation Aktif:</strong> Optimasi ini mensimulasikan rotasi dinamis ke Emas/Cash saat momentum Saham (Top N) turun.
              </div>
            )}
            
            {/* Optimizer Search Method */}`
);

fs.writeFileSync('src/pages/Optimizer.tsx', code);
