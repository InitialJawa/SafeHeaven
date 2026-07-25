import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const target = `            <button
              id="run-backtest-trigger-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccff00] hover:bg-[#ddff33] disabled:bg-white/5 disabled:text-[#4b5563] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/20 active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Mensimulasi Sinyal...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current stroke-[2.5px]" /> Jalankan Backtest
                </>
              )}
            </button>`;

const replacement = `            <button
              id="run-backtest-trigger-btn"
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-[#ccff00] hover:bg-[#ddff33] disabled:bg-white/5 disabled:text-[#4b5563] text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer shadow-lg shadow-[#ccff00]/10 hover:shadow-[#ccff00]/30 active:scale-95 group"
            >
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Mensimulasi...
                </span>
              ) : (
                <>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 fill-current stroke-[2.5px] group-hover:scale-110 transition-transform" /> Jalankan Backtest
                  </span>
                </>
              )}
            </button>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  console.log("Button Replaced");
} else {
  console.log("Button Not found");
}

fs.writeFileSync('src/pages/Backtest.tsx', content);
