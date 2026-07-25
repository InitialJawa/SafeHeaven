import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const targetState = "  const [loadingText, setLoadingText] = useState('Menginisialisasi parameter portofolio...');";
const replacementState = `  const [loadingText, setLoadingText] = useState('Menginisialisasi parameter portofolio...');
  const [loadingSubTextIndex, setLoadingSubTextIndex] = useState(0);

  const loadingMessages = [
    "Sistem menguji alokasi taktis portofolio secara dinamis berdasarkan data historis...",
    "Menghitung metrik Sharpe dan optimalisasi drawdown...",
    "Menjalankan simulasi Monte Carlo untuk proyeksi ke depan...",
    "Menyelaraskan korelasi antar emiten terhadap indeks acuan...",
    "Mengevaluasi faktor risiko krisis dan perlindungan downside..."
  ];

  React.useEffect(() => {
    let subTextInterval;
    if (loading) {
      subTextInterval = setInterval(() => {
        setLoadingSubTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingSubTextIndex(0);
    }
    return () => clearInterval(subTextInterval);
  }, [loading]);`;

if (content.includes(targetState)) {
  content = content.replace(targetState, replacementState);
} else {
  console.log("Failed to insert state");
}

const targetUI = `<p className="text-[10px] text-[#686477] mt-1 font-sans font-medium">Sistem menguji alokasi taktis portofolio secara dinamis berdasarkan data historis...</p>`;
const replacementUI = `<div className="h-[30px] flex items-center justify-center mt-1">
                <p className="text-[10px] text-[#686477] font-sans font-medium animate-pulse transition-opacity duration-500">
                  {loadingMessages[loadingSubTextIndex]}
                </p>
              </div>`;

if (content.includes(targetUI)) {
  content = content.replace(targetUI, replacementUI);
} else {
  console.log("Failed to insert UI");
}

const svgCircleRegex = /<circle cx="72" cy="72" r="58" stroke="#ccff00" strokeWidth="8" fill="transparent" strokeDasharray=\{2 \* Math.PI \* 58\} strokeDashoffset=\{2 \* Math.PI \* 58 \* \(1 - progress \/ 100\)\} className="transition-all duration-300 ease-out" strokeLinecap="round" \/>/;
const svgCircleReplacement = `<circle cx="72" cy="72" r="58" stroke="#ccff00" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)} className={\`transition-all duration-300 ease-out \${progress >= 95 ? 'animate-pulse' : ''}\`} strokeLinecap="round" />`;

content = content.replace(svgCircleRegex, svgCircleReplacement);

const progressBarRegex = /<div className="bg-\[#ccff00\] h-full transition-all duration-300 ease-out" style=\{\{ width: \`\\\$\\{progress\\}%\` \}\}><\/div>/;
const progressBarReplacement = `<div className={\`bg-[#ccff00] h-full transition-all duration-300 ease-out \${progress >= 95 ? 'animate-pulse relative overflow-hidden' : ''}\`} style={{ width: \`\${progress}%\` }}>
                    {progress >= 95 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[200%] animate-[shimmer_1.5s_infinite]" />
                    )}
                  </div>`;
content = content.replace(progressBarRegex, progressBarReplacement);

fs.writeFileSync('src/pages/Backtest.tsx', content);
console.log("Script finished");
