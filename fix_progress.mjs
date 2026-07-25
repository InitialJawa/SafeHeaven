import fs from 'fs';
let content = fs.readFileSync('src/pages/Backtest.tsx', 'utf8');

const regex = /let activeStepIdx = 0;[\s\S]*?if \(activeStepIdx === 0\) \{/m;

const replacement = `let progressVal = 0;

    const interval = setInterval(() => {
        let increment = Math.floor(Math.random() * 8) + 2;
        progressVal += increment;
        
        // Progress goes from 0 to 50 fast, then 50 to 100 slowly.
        if (progressVal > 50 && progressVal < 80) {
            progressVal += 5;
        } else if (progressVal > 95) {
            // Cap at 95 until complete
            progressVal = 95;
        }
        
        setProgress(progressVal);

        if (progressVal < 30) {`;

content = content.replace(regex, replacement);

const regex2 = /} else if \(activeStepIdx === 1\) \{[\s\S]*?\} else if \(activeStepIdx === 2\) \{[\s\S]*?\} else if \(activeStepIdx === 3\) \{[\s\S]*?\}/m;

const replacement2 = `} else if (progressVal < 60) {
          setLoadingText('Koneksi Data Emiten & Sinkronisasi Benchmark...');
        } else if (progressVal < 90) {
          setLoadingText('Menyelaraskan data historis...');
        } else {
          setLoadingText('Kalkulasi & Rebalancing Portofolio...');
        }`;

content = content.replace(regex2, replacement2);

fs.writeFileSync('src/pages/Backtest.tsx', content);
console.log('done');
