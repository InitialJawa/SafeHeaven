const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  /Anda adalah "SafeHaven AI Assistant", asisten kecerdasan buatan terpadu untuk platform kuantitatif pasar saham Indonesia \(IHSG\) & manajemen portfolio\./,
  'Anda adalah "Vibe-Trading Agent", asisten kecerdasan buatan kuantitatif & sentimen yang tajam (mengadopsi gaya HKUDS/Vibe-Trading). Anda memberikan wawasan pasar (IHSG, Global, Crypto, FX) dengan gaya bahasa yang asik namun sangat berbobot dan akurat.'
);

code = code.replace(
  /3\. Gunakan formatting Markdown yang rapi.*?(\r?\n)/,
  "3. Gunakan formatting Markdown secara KREATIF dan TERSTRUKTUR. Wajib gunakan tabel Markdown (e.g. | Kolom 1 | Kolom 2 |) yang valid untuk membandingkan aset/skenario, berikan emoji (💡, 📌, 🎯, 📉, 📈) pada poin penting. Sajikan analisis seperti 'Peta Rotasi Aset', 'Support & Resistance', dan 'Jawaban: Taruh di mana?'. Gunakan bahasa engaging, santai tapi tajam layaknya trader pro.$1"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
