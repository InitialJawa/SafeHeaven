const fs = require('fs');
let code = fs.readFileSync('src/pages/Strategies.tsx', 'utf8');

// Remove totalAllocation check
code = code.replace(/if\s*\(totalAllocation\s*!==\s*100\)\s*\{\s*toast\.error\([\s\S]*?return;\s*\}/, '');

// Replace the allocation UI block
const startStr = `<div className="space-y-3">
                  {[
                    { label: 'Alokasi Saham', val: allocSaham, set: setAllocSaham },`;
const endStr = `                  ))}
                </div>
              </div>`;

const startIndex = code.indexOf('<div className="space-y-3">\n                  {[\n                    { label: \'Alokasi Saham\'');
const endIndex = code.indexOf('                  ))}\n                </div>\n              </div>');

if (startIndex !== -1 && endIndex !== -1) {
    const sectionToReplace = code.substring(startIndex, endIndex + '                  ))}\n                </div>\n              </div>'.length);
    const newSection = `<div className="p-4 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 mt-4">
                  <p className="text-[11px] text-[#ccff00] font-bold leading-relaxed">
                    Sistem Alokasi Aset (Saham, Emas, IDR, USD) diatur secara dinamis oleh <strong>Multi-Tier Rotation</strong> (Jaring Pengaman AI). Parameter di atas kini khusus digunakan sebagai pembobot skor kualitatif (Stock Picking) saat fase Saham aktif.
                  </p>
                </div>
              </div>`;
    code = code.replace(sectionToReplace, newSection);

    // Let's also remove the header for Target Alokasi
    code = code.replace(`<h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center justify-between">
                  Target Alokasi
                  <span className={\`text-[10px] px-2 py-1 rounded \${totalAllocation === 100 ? 'bg-[#00f5a0]/20 text-[#00f5a0]' : 'bg-red-500/20 text-red-500'}\`}>
                    Total: {totalAllocation}%
                  </span>
                </h4>`, '');

    fs.writeFileSync('src/pages/Strategies.tsx', code);
    console.log('Patched strategies builder successfully!');
} else {
    console.log('Failed to find strings in strategies builder.');
}
