const fs = require('fs');
let code = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

code = code.replace(
  '{mode === \'Dynamic\' && (',
  `{mode === 'Dynamic' && (
              <div className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 p-3 rounded-xl mb-3">
                <strong>Mode Multi-Tier Rotation Aktif:</strong> Simulasi ini akan merotasi aset dinamis antara Saham, Emas, IDR, dan USD sesuai tren momentum.
              </div>
            )}
            {mode === 'Dynamic' && (`
);

if (code.indexOf('Mode Multi-Tier Rotation Aktif') === -1) {
  // Let's just insert it after the mode radios
  const insertionPoint = '</div>\n            </div>\n\n            {/* Conditional Threshold % */}';
  code = code.replace(insertionPoint, `</div>\n            </div>\n            \n            {mode === 'Dynamic' && (\n              <div className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 p-3 rounded-xl mb-1">\n                <strong>Multi-Tier Rotation Aktif:</strong> Merotasi otomatis ke Saham, Emas, IDR/USD.\n              </div>\n            )}\n\n            {/* Conditional Threshold % */}`);
}

fs.writeFileSync('src/pages/Backtest.tsx', code);
