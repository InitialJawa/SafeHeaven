const fs = require('fs');

let content = fs.readFileSync('src/pages/TickerDetail.tsx', 'utf8');

const activeAlertsCode = `
            <div className="mt-4 pt-4 border-t border-[#1b1926]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Alert Harga Aktif</h4>
              {priceAlerts.filter(a => a.symbol === symbol && a.status === 'active').length === 0 ? (
                <p className="text-[11px] text-[#686477] text-center italic">Belum ada alert harga aktif.</p>
              ) : (
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                  {priceAlerts.filter(a => a.symbol === symbol && a.status === 'active').map(alert => (
                    <div key={alert.id} className="flex items-center justify-between bg-[#181622] border border-[#2a273b] p-2.5 rounded-xl">
                      <div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <span>{alert.condition === 'above' ? '>= (Naik)' : '<= (Turun)'}</span>
                          <span className="text-[#ccff00]">Rp {alert.targetPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <span className="text-[9px] text-[#686477] mt-0.5 block">Dibuat: {new Date(alert.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <button
                        onClick={() => deletePriceAlert(alert.id)}
                        className="text-xs text-[#ff3366] hover:text-white bg-[#ff3366]/10 hover:bg-[#ff3366] border border-[#ff3366]/20 hover:border-[#ff3366] cursor-pointer p-1.5 rounded-lg transition-colors"
                        title="Hapus Alert"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
`;

content = content.replace(
  /className="px-5 py-2 rounded-xl text-xs font-bold bg-\[#ccff00\] hover:bg-\[#b3e600\] text-black transition-colors cursor-pointer"\s*>\s*Simpan Alert\s*<\/button>\s*<\/div>/,
  'className="px-5 py-2 rounded-xl text-xs font-bold bg-[#ccff00] hover:bg-[#b3e600] text-black transition-colors cursor-pointer">\nSimpan Alert\n</button>\n</div>\n' + activeAlertsCode
);

const blockToRemoveRegex = /\{\/\* Active Price Alerts for this Ticker \*\/\}\s*<div className="card card-elevated p-5 flex flex-col gap-4">[\s\S]*?\{\/\* 3\. Interactive Sub-Tabs Bar \*\/\}/;

content = content.replace(blockToRemoveRegex, "{/* 3. Interactive Sub-Tabs Bar */}");

fs.writeFileSync('src/pages/TickerDetail.tsx', content);
