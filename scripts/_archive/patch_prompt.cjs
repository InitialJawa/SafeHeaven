const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  /Wajib gunakan tabel Markdown \(e\.g\. \| Kolom 1 \| Kolom 2 \|\) yang valid untuk membandingkan aset\/skenario/g,
  "Wajib gunakan tabel Markdown yang valid untuk membandingkan aset/skenario. PASTIKAN SELALU menyisipkan baris kosong (empty line) sebelum dan sesudah tabel, serta gunakan enter (newline) pada setiap akhir baris tabel agar tabel ter-render dengan sempurna"
);

fs.writeFileSync('server.ts', code);
console.log("Patched prompt successfully");
