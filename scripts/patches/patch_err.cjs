const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /message: \`Uji Coba AI Gagal \(\$\{testConfig\.provider\}\): \$\{err\.message \|\| 'Error koneksi AI API'\}\`,/,
  `message: \`Uji Coba AI Gagal (\${testConfig.provider}): \${(err.message || '').includes('401') || (err.message || '').includes('UNAUTHENTICATED') ? 'API Key tidak valid atau belum disetel (Settings > AI Settings).' : (err.message || 'Error koneksi AI API')}\`,`
);

fs.writeFileSync('server.ts', content);
