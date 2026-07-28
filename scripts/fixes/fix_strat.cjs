const fs = require('fs');
const code = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');

const lines = code.split('\n');
const fixedLines = [];

let skip = false;
for (let i = 0; i < lines.length; i++) {
  if (i === 330) {
    // Line 331 in 1-based is `              </div><div className="p-4...`
    // We are at index 330
    fixedLines.push('              </div>');
    fixedLines.push('              <div className="p-4 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 mt-4">');
    fixedLines.push('                <p className="text-[11px] text-[#ccff00] font-bold leading-relaxed">');
    fixedLines.push('                  Sistem Alokasi Aset (Saham, Emas, IDR, USD) diatur secara dinamis oleh <strong>Multi-Tier Rotation</strong> (Jaring Pengaman AI). Parameter di atas kini khusus digunakan sebagai pembobot skor kualitatif (Stock Picking) saat fase Saham aktif.');
    fixedLines.push('                </p>');
    fixedLines.push('              </div>');
    skip = true;
  }
  
  if (skip && i === 358) { // index 358 is line 359 (the one before {/* Threshold controls */})
    skip = false;
    continue;
  }
  
  if (!skip) {
    fixedLines.push(lines[i]);
  }
}

fs.writeFileSync('src/pages/Strategies.tsx', fixedLines.join('\n'));
