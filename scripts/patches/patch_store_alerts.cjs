const fs = require('fs');
let code = fs.readFileSync('src/stores/index.ts', 'utf8');

const originalAlerts = `  alerts: [
    { id: 'a-1', time: '2026-07-20T11:00:00Z', type: 'Score', message: 'Skor fundamental BBCA naik ke 88 (Beli)', status: 'unread' },
    { id: 'a-2', time: '2026-07-20T09:30:00Z', type: 'Price', message: 'BBRI menembus batas support Rp 4.500', status: 'unread' },
    { id: 'a-3', time: '2026-07-19T15:00:00Z', type: 'Momentum', message: 'Sinyal GOTO berubah menjadi Hindari (Score: 32)', status: 'read' },
  ],`;

const newAlerts = `  alerts: [
    { id: 'a-1', time: '2026-07-22T10:15:00Z', type: 'Rotation', message: 'Sistem memicu rotasi dari Saham ke Emas akibat penurunan momentum ekstrem', status: 'unread' },
    { id: 'a-2', time: '2026-07-22T10:10:00Z', type: 'Stop Loss', message: 'Proteksi Stop-Loss (Crash Shield) aktif. Mengamankan 10% Cash.', status: 'unread' },
    { id: 'a-3', time: '2026-07-21T09:00:00Z', type: 'Momentum', message: 'Momentum IHSG melemah, bersiap mode bertahan (Risk-Off)', status: 'read' },
  ],`;

code = code.replace(originalAlerts, newAlerts);
fs.writeFileSync('src/stores/index.ts', code);
