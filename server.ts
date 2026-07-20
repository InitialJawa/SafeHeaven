/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

// Initialize server-side Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// -------------------------------------------------------------------
// Mock Database & Constants
// -------------------------------------------------------------------

const INITIAL_TICKERS = [
  { symbol: 'BBCA', name: 'Bank Central Asia Tbk', price: 10450, changePercent: 1.25, score: 88, signal: 'Beli' as const },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', price: 4620, changePercent: -0.85, score: 85, signal: 'Akumulasi' as const },
  { symbol: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', price: 6350, changePercent: 2.10, score: 82, signal: 'Akumulasi' as const },
  { symbol: 'TLKM', name: 'Telkom Indonesia Tbk', price: 3120, changePercent: 0.15, score: 79, signal: 'Tahan' as const },
  { symbol: 'ASII', name: 'Astra International Tbk', price: 4850, changePercent: -1.20, score: 65, signal: 'Tahan' as const },
  { symbol: 'BBNI', name: 'Bank Negara Indonesia Tbk', price: 4980, changePercent: 0.50, score: 72, signal: 'Tahan' as const },
  { symbol: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 2750, changePercent: -2.30, score: 58, signal: 'Hindari' as const },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 54, changePercent: 0.00, score: 32, signal: 'Jual' as const },
  { symbol: 'UNVR', name: 'Unilever Indonesia Tbk', price: 2240, changePercent: -1.10, score: 45, signal: 'Hindari' as const },
  { symbol: 'KLBF', name: 'Kalbe Farma Tbk', price: 1510, changePercent: 1.85, score: 76, signal: 'Akumulasi' as const },
];

let portfolioConfig = {
  capital: 500000000,
  strategyName: 'Defensive Value Strategy',
  universe: 'LQ45 Core Universe',
  topN: 10,
  allocationSaham: 60,
  allocationEmas: 20,
  allocationCash: 10,
  allocationUSD: 10,
  crashThreshold: 15,
  stopLoss: 10,
};

let alertRules = [
  { id: 'ar-1', name: 'Batas Skor Tinggi BBCA', type: 'Score', condition: '>=', threshold: 85, ticker: 'BBCA', status: 'ON' },
  { id: 'ar-2', name: 'Peringatan Crash GOTO', type: 'Price', condition: '<=', threshold: 120, ticker: 'GOTO', status: 'ON' },
  { id: 'ar-3', name: 'Batas Momentum LQ45', type: 'Momentum', condition: '<=', threshold: 40, status: 'OFF' }
];

let strategies = [
  {
    id: 'strat-1',
    name: 'Defensive Value Strategy',
    description: 'Menargetkan saham-saham blue-chip dengan dividend yield tinggi dan stabilitas momentum.',
    weightQuality: 30,
    weightMomentum: 20,
    weightValue: 20,
    weightVolume: 15,
    weightDividend: 15,
    allocationSaham: 60,
    allocationEmas: 20,
    allocationCash: 10,
    allocationUSD: 10,
    crashThreshold: 15,
    stopLoss: 10
  },
  {
    id: 'strat-2',
    name: 'Aggressive Quality Momentum',
    description: 'Fokus pada saham dengan momentum pertumbuhan kuat dan skor kualitas fundamental superior.',
    weightQuality: 40,
    weightMomentum: 40,
    weightValue: 10,
    weightVolume: 10,
    weightDividend: 0,
    allocationSaham: 80,
    allocationEmas: 10,
    allocationCash: 5,
    allocationUSD: 5,
    crashThreshold: 20,
    stopLoss: 15
  }
];

let universes = [
  { id: 'uni-1', name: 'LQ45 Core Universe', description: 'Kumpulan 45 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO', 'ADRO', 'UNVR', 'KLBF'] },
  { id: 'uni-2', name: 'Dividend Champion', description: 'Saham dengan histori pembagian dividen konsisten 5 tahun terakhir.', tickers: ['ADRO', 'PTBA', 'ITMG', 'BBCA', 'BMRI', 'ASII'] }
];

let apiKeys = [
  { id: 'k-1', name: 'Production Live Feed', key: 'sh_live_9f83a218', status: 'Active', lastUsed: '2026-07-20 11:14' },
  { id: 'k-2', name: 'Backtest Sandbox', key: 'sh_test_cc9831fa', status: 'Active', lastUsed: '2026-07-19 14:22' }
];

let users = [
  { id: 'usr-1', email: 'imamnasrulloh02@gmail.com', name: 'Imam Nasrulloh', role: 'admin', registeredAt: '2026-01-01' },
  { id: 'usr-2', email: 'advisor1@safeheaven.id', name: 'Budi Santoso', role: 'advisor', registeredAt: '2026-02-15' },
  { id: 'usr-3', email: 'client1@gmail.com', name: 'Amir Nasution', role: 'user', registeredAt: '2026-04-20' }
];

let clients = [
  { id: 'cl-1', name: 'Amir Nasution', email: 'client1@gmail.com', advisorId: 'usr-2' },
  { id: 'cl-2', name: 'Citra Kirana', email: 'citra@outlook.com', advisorId: 'usr-2' }
];

let rebalanceConfig = {
  enabled: true,
  frequency: 'weekly',
  day: 'Senin',
  time: '09:00',
  type: 'full'
};

let notificationConfig = {
  email: 'imamnasrulloh02@gmail.com',
  rotationAlert: true,
  signalAlert: true,
  dailyReport: false,
  crashAlert: true
};

// -------------------------------------------------------------------
// REST API Handlers
// -------------------------------------------------------------------

// 1. Snapshot Market
app.get('/api/market/snapshot', (req, res) => {
  res.json(INITIAL_TICKERS);
});

// 2. Portfolio Config
app.get('/api/portfolio/config', (req, res) => {
  res.json(portfolioConfig);
});

app.put('/api/portfolio/config', (req, res) => {
  portfolioConfig = { ...portfolioConfig, ...req.body };
  res.json(portfolioConfig);
});

import yahooFinance from 'yahoo-finance2';
const yf = new yahooFinance();

// New IHSG historical data endpoint
app.get('/api/market/ihsg', async (req, res) => {
  const range = (req.query.range as string) || '1M';
  const symbol = '^JKSE';
  
  let period1: Date;
  let interval: '1d' | '1wk' | '1mo' = '1d';
  const now = new Date();

  switch(range) {
    case '1D': period1 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); break;
    case '1M': period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
    case '3M': period1 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
    case '1Y': period1 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
    case '5Y': period1 = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000); interval = '1wk'; break;
    case '10Y': period1 = new Date(now.getTime() - 10 * 365 * 24 * 60 * 60 * 1000); interval = '1wk'; break;
    case 'Life': period1 = new Date('1990-01-01'); interval = '1mo'; break;
    default: period1 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  try {
    const queryOptions = {
        period1: period1.toISOString().split('T')[0],
        period2: now.toISOString().split('T')[0],
        interval
    };
    const result = await yf.historical(symbol, queryOptions);
    const data = result
      .filter(q => q.close !== null)
      .map(q => ({
        date: q.date.toISOString().split('T')[0],
        value: q.close!
      }));
    res.json(data);
  } catch (err) {
    console.error('Error fetching IHSG from Yahoo Finance:', err);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// 3. Portfolio Tier
app.get('/api/portfolio/tier', (req, res) => {
  const cap = portfolioConfig.capital;
  let tier = 'Perunggu';
  let level = 1;
  let next = 2;
  let reqText = 'Miliki alokasi modal minimal Rp 100.000.000 untuk naik ke Perak';

  if (cap >= 1000000000) {
    tier = 'Platinum';
    level = 4;
    next = 5;
    reqText = 'Pertahankan saldo Rp 1.000.000.000+ untuk akses fitur Konsultasi VIP';
  } else if (cap >= 500000000) {
    tier = 'Emas';
    level = 3;
    next = 4;
    reqText = 'Miliki alokasi modal minimal Rp 1.000.000.000 untuk naik ke Platinum';
  } else if (cap >= 100000000) {
    tier = 'Perak';
    level = 2;
    next = 3;
    reqText = 'Miliki alokasi modal minimal Rp 500.000.000 untuk naik ke Emas';
  }

  res.json({
    tier,
    progress: { current: level, next, req: reqText }
  });
});

// 4. Portfolio Stock Picks
app.get('/api/portfolio/stock-picks', (req, res) => {
  // Generate dynamically based on Top N and current Capital
  const n = portfolioConfig.topN;
  const picks = INITIAL_TICKERS.slice(0, n).map((t, i) => {
    // Generate weights
    const weight = Math.round((100 / n) * (1.5 - (i / n) * 0.8));
    const alloc = Math.round((portfolioConfig.capital * (portfolioConfig.allocationSaham / 100)) * (weight / 100));
    return {
      symbol: t.symbol,
      name: t.name,
      score: t.score,
      weight,
      allocation: alloc,
      signal: t.signal
    };
  });
  res.json(picks);
});

// 5. Alerts History
let alertsHistory = [
  { id: 'a-1', time: '2026-07-20T11:00:00Z', type: 'Score', message: 'Skor fundamental BBCA naik ke 88 (Beli)', status: 'unread' },
  { id: 'a-2', time: '2026-07-20T09:30:00Z', type: 'Price', message: 'BBRI menembus batas support Rp 4.500', status: 'unread' },
  { id: 'a-3', time: '2026-07-19T15:00:00Z', type: 'Momentum', message: 'Sinyal GOTO berubah menjadi Hindari (Score: 32)', status: 'read' },
];

app.get('/api/alerts', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  res.json(alertsHistory.slice(0, limit));
});

// 6. Alert Rules
app.get('/api/alert-rules', (req, res) => {
  res.json(alertRules);
});

app.post('/api/alert-rules', (req, res) => {
  const newRule = { id: `ar-${Date.now()}`, ...req.body, lastTriggered: 'Never' };
  alertRules.push(newRule);
  res.json(newRule);
});

app.put('/api/alert-rules/:id', (req, res) => {
  alertRules = alertRules.map((r) => r.id === req.params.id ? { ...r, ...req.body } : r);
  res.json(alertRules.find((r) => r.id === req.params.id));
});

app.delete('/api/alert-rules/:id', (req, res) => {
  alertRules = alertRules.filter((r) => r.id !== req.params.id);
  res.json({ success: true });
});

// 7. Strategies
app.get('/api/strategies', (req, res) => {
  res.json(strategies);
});

app.post('/api/strategies', (req, res) => {
  const newStrat = { id: `strat-${Date.now()}`, ...req.body };
  strategies.push(newStrat);
  res.json(newStrat);
});

app.put('/api/strategies/:id', (req, res) => {
  strategies = strategies.map((s) => s.id === req.params.id ? { ...s, ...req.body } : s);
  res.json(strategies.find((s) => s.id === req.params.id));
});

app.delete('/api/strategies/:id', (req, res) => {
  strategies = strategies.filter((s) => s.id !== req.params.id);
  res.json({ success: true });
});

// 8. Universes
app.get('/api/universes', (req, res) => {
  res.json(universes);
});

app.post('/api/universes', (req, res) => {
  const newUni = { id: `uni-${Date.now()}`, ...req.body };
  universes.push(newUni);
  res.json(newUni);
});

app.put('/api/universes/:id', (req, res) => {
  universes = universes.map((u) => u.id === req.params.id ? { ...u, ...req.body } : u);
  res.json(universes.find((u) => u.id === req.params.id));
});

app.delete('/api/universes/:id', (req, res) => {
  universes = universes.filter((u) => u.id !== req.params.id);
  res.json({ success: true });
});

let riskState = {
  stopLossTriggered: false,
  crashShieldActive: true,
  dynamicBufferPercent: 4.5
};

app.get('/api/risk/settings', (req, res) => {
  const assets = [
    { symbol: 'BBCA', buyPrice: 10200, stopLossLevel: -10 },
    { symbol: 'BBRI', buyPrice: 4800, stopLossLevel: -10 },
    { symbol: 'BMRI', buyPrice: 6200, stopLossLevel: -10 },
    { symbol: 'TLKM', buyPrice: 3250, stopLossLevel: -10 },
    { symbol: 'ASII', buyPrice: 5500, stopLossLevel: -10 }
  ].map((asset) => {
    const live = liveTickers.find((t) => t.symbol === asset.symbol);
    const currentPrice = live ? live.price : asset.buyPrice;
    const currentReturn = ((currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
    
    let status: 'Safe' | 'Warning' | 'Triggered' = 'Safe';
    if (currentReturn <= asset.stopLossLevel) {
      status = 'Triggered';
    } else if (currentReturn <= asset.stopLossLevel + 5) {
      status = 'Warning';
    }
    
    return {
      ...asset,
      currentPrice,
      currentReturn,
      status
    };
  });

  const stopLossTriggered = riskState.stopLossTriggered || assets.some((a) => a.status === 'Triggered');

  res.json({
    stopLossTriggered,
    crashShieldActive: riskState.crashShieldActive,
    dynamicBufferPercent: riskState.dynamicBufferPercent,
    assets
  });
});

app.post('/api/risk/control', (req, res) => {
  const { action } = req.body;
  if (action === 'bypass') {
    riskState.stopLossTriggered = false;
  } else if (action === 'reset') {
    riskState.crashShieldActive = true;
    riskState.stopLossTriggered = false;
  }
  
  const assets = [
    { symbol: 'BBCA', buyPrice: 10200, stopLossLevel: -10 },
    { symbol: 'BBRI', buyPrice: 4800, stopLossLevel: -10 },
    { symbol: 'BMRI', buyPrice: 6200, stopLossLevel: -10 },
    { symbol: 'TLKM', buyPrice: 3250, stopLossLevel: -10 },
    { symbol: 'ASII', buyPrice: 5500, stopLossLevel: -10 }
  ].map((asset) => {
    const live = liveTickers.find((t) => t.symbol === asset.symbol);
    const currentPrice = live ? live.price : asset.buyPrice;
    const currentReturn = ((currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
    
    let status: 'Safe' | 'Warning' | 'Triggered' = 'Safe';
    if (currentReturn <= asset.stopLossLevel) {
      status = 'Triggered';
    } else if (currentReturn <= asset.stopLossLevel + 5) {
      status = 'Warning';
    }
    
    if (action === 'bypass' && status === 'Triggered') {
      status = 'Warning';
    }

    return {
      ...asset,
      currentPrice,
      currentReturn,
      status
    };
  });

  const stopLossTriggered = action === 'bypass' ? false : assets.some((a) => a.status === 'Triggered');

  res.json({
    stopLossTriggered,
    crashShieldActive: riskState.crashShieldActive,
    dynamicBufferPercent: riskState.dynamicBufferPercent,
    assets
  });
});

// 9. Risk Analytics
app.get('/api/risk/portfolio', (req, res) => {
  res.json({
    var95: 1.84, // Percent
    var99: 2.52,
    cvar: 3.10,
    sharpe: 2.15,
    sortino: 2.44,
    contributions: INITIAL_TICKERS.map((t) => ({
      symbol: t.symbol,
      beta: parseFloat((0.8 + Math.random() * 0.6).toFixed(2)),
      stdev: parseFloat((1.5 + Math.random() * 2).toFixed(2)),
      riskContribution: parseFloat((5 + Math.random() * 15).toFixed(1))
    }))
  });
});

// 10. Analytics Dashboard
app.get('/api/analytics/dashboard', (req, res) => {
  const index = req.query.index || 'LQ45';
  const multiplier = index === 'IDX30' ? 0.9 : index === 'IDX80' ? 1.1 : 1;
  
  res.json({
    scoredToday: Math.round(42 * multiplier),
    scoreDate: '2026-07-20',
    marketRegime: 'Bullish Acc',
    sectorAverages: [
      { sector: 'Financials', score: Math.round(85 * multiplier) },
      { sector: 'Technology', score: Math.round(45 * multiplier) },
      { sector: 'Telco', score: Math.round(79 * multiplier) },
      { sector: 'Resources', score: Math.round(62 * multiplier) },
      { sector: 'Consumer', score: Math.round(55 * multiplier) }
    ],
    topGainers: INITIAL_TICKERS.slice(0, 5).map(t => ({ ...t, changePercent: t.changePercent + (2 * multiplier) })),
    topLosers: INITIAL_TICKERS.slice(5, 10).map(t => ({ ...t, changePercent: t.changePercent - (2 * multiplier) })),
    marketStats: {
      marketCap: index === 'IDX30' ? 'Rp 8.240 Triliun' : 'Rp 14.500 Triliun',
      usdIdr: 'Rp 16.120',
      goldPrice: 'Rp 1.420.000 / gr'
    },
    regimeDistribution: [
      { name: 'Normal', value: index === 'IDX30' ? 60 : 40 },
      { name: 'Bull', value: index === 'IDX80' ? 35 : 25 },
      { name: 'Bear', value: 10 },
      { name: 'Volatile', value: index === 'IDX30' ? 5 : 25 }
    ]
  });
});

// 11. Portfolio Growth Data
app.get('/api/portfolio/growth', (req, res) => {
  const capital = parseFloat(req.query.capital as string) || 500000000;
  const data = [];
  let currentBalance = capital;
  const now = new Date();
  
  // Simulate 6 months of growth
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    const dateStr = date.toLocaleString('default', { month: 'short' });
    
    // Simulate some volatility and upward trend
    const dailyReturn = (Math.random() - 0.45) * 0.015; // 0.5% upward bias
    currentBalance = currentBalance * (1 + dailyReturn);
    
    // Only add points for the start of months for cleaner chart
    if (date.getDate() === 1 || i === 0) {
        data.push({ date: dateStr, balance: Math.round(currentBalance) });
    }
  }
  res.json(data);
});

// 11. Rebalance API
app.get('/api/rebalance/config', (req, res) => res.json(rebalanceConfig));
app.put('/api/rebalance/config', (req, res) => {
  rebalanceConfig = { ...rebalanceConfig, ...req.body };
  res.json(rebalanceConfig);
});
app.post('/api/rebalance/trigger', (req, res) => {
  res.json({ success: true, message: 'Rebalancing executed successfully.' });
});

// 12. Notification API
app.get('/api/notif/config', (req, res) => res.json(notificationConfig));
app.put('/api/notif/config', (req, res) => {
  notificationConfig = { ...notificationConfig, ...req.body };
  res.json(notificationConfig);
});
app.post('/api/notif/test', (req, res) => {
  res.json({ success: true, message: 'Test email successfully sent to ' + notificationConfig.email });
});

// 13. API keys management
app.get('/api/keys', (req, res) => res.json(apiKeys));
app.post('/api/keys', (req, res) => {
  const newKey = { id: `k-${Date.now()}`, name: req.body.name, key: 'sh_live_' + Math.random().toString(36).substring(2, 10), status: 'Active' as const, lastUsed: 'Never' };
  apiKeys.push(newKey);
  res.json(newKey);
});
app.delete('/api/keys/:id', (req, res) => {
  apiKeys = apiKeys.filter((k) => k.id !== req.params.id);
  res.json({ success: true });
});

// 14. Admin API
app.get('/api/admin/users', (req, res) => res.json(users));
app.put('/api/admin/users/:id/role', (req, res) => {
  users = users.map((u) => u.id === req.params.id ? { ...u, role: req.body.role } : u);
  res.json({ success: true });
});
app.get('/api/admin/clients', (req, res) => res.json(clients));
app.post('/api/admin/clients', (req, res) => {
  const newC = { id: `cl-${Date.now()}`, name: req.body.name, email: req.body.email, advisorId: 'usr-2' };
  clients.push(newC);
  res.json(newC);
});

// 15. Ticker Detail APIs
app.get('/api/ticker/:symbol', (req, res) => {
  const tick = INITIAL_TICKERS.find((t) => t.symbol.toUpperCase() === req.params.symbol.toUpperCase()) || INITIAL_TICKERS[0];
  res.json(tick);
});

app.get('/api/ticker/:symbol/score', (req, res) => {
  const tick = INITIAL_TICKERS.find((t) => t.symbol.toUpperCase() === req.params.symbol.toUpperCase()) || INITIAL_TICKERS[0];
  // 5 dimensions
  res.json({
    symbol: tick.symbol,
    score: tick.score,
    dimensions: [
      { name: 'Quality', value: tick.score },
      { name: 'Momentum', value: Math.min(100, Math.max(20, tick.score + (Math.random() * 20 - 10))) },
      { name: 'Value', value: Math.min(100, Math.max(20, 100 - tick.score + 10)) },
      { name: 'Volume', value: Math.min(100, Math.max(20, tick.score - (Math.random() * 15))) },
      { name: 'Dividend', value: tick.symbol === 'BBCA' || tick.symbol === 'ADRO' ? 75 : 30 }
    ]
  });
});

app.get('/api/ticker/:symbol/signal', (req, res) => {
  const tick = INITIAL_TICKERS.find((t) => t.symbol.toUpperCase() === req.params.symbol.toUpperCase()) || INITIAL_TICKERS[0];
  res.json({ symbol: tick.symbol, signal: tick.signal });
});

// Canvas Candle chart data Generator
app.get('/api/ticker/:symbol/chart', (req, res) => {
  const symbol = req.params.symbol;
  const count = req.query.range === '1m' ? 30 : req.query.range === '3m' ? 90 : req.query.range === '6m' ? 180 : 250;
  
  let currentPrice = INITIAL_TICKERS.find((t) => t.symbol === symbol)?.price || 5000;
  const data = [];
  
  const now = new Date();
  for (let i = count; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    // Simulate trend + daily random noise
    const trend = Math.sin(i / 15) * 100;
    const change = (Math.random() - 0.48) * (currentPrice * 0.03) + (trend * 0.1);
    const open = Math.round(currentPrice - change);
    const close = Math.round(currentPrice);
    const high = Math.round(Math.max(open, close) + Math.random() * (currentPrice * 0.015));
    const low = Math.round(Math.min(open, close) - Math.random() * (currentPrice * 0.015));
    
    data.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume: Math.round(1000000 + Math.random() * 5000000)
    });
    
    currentPrice = open; // Propagate backwards
  }
  
  res.json(data.reverse());
});

// 16. Backtest Run
app.post('/api/backtest/run', (req, res) => {
  const { capital, topN, mode, thresholdPercent, rebalanceDays } = req.body;
  const seedCapital = capital || 100000000;
  
  // Create simulated equity curves
  const dataPoints = 24;
  const equityCurve = [];
  let currentVal = seedCapital;
  let bhVal = seedCapital;
  let ihsgVal = seedCapital;
  let goldVal = seedCapital;

  const now = new Date();
  for (let i = dataPoints; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 15 * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    
    // Growth simulation
    const drift = mode === 'Dynamic' ? 0.025 : mode === 'Threshold' ? 0.02 : 0.018;
    const noise = (Math.random() - 0.42) * 0.08; // positive bias
    const bhNoise = (Math.random() - 0.46) * 0.085;
    const ihsgNoise = (Math.random() - 0.48) * 0.05;
    const goldNoise = (Math.random() - 0.49) * 0.02;
    
    currentVal = Math.round(currentVal * (1 + drift + noise));
    bhVal = Math.round(bhVal * (1 + 0.01 + bhNoise));
    ihsgVal = Math.round(ihsgVal * (1 + 0.005 + ihsgNoise));
    goldVal = Math.round(goldVal * (1 + 0.002 + goldNoise));

    equityCurve.push({
      date: dateStr,
      value: currentVal,
      buyAndHoldValue: bhVal,
      ihsg: ihsgVal,
      gold: goldVal
    });
  }

  const finalReturn = ((currentVal - seedCapital) / seedCapital) * 100;
  const maxDd = -10 - Math.random() * 8; // -10% to -18%
  const sharpe = parseFloat((1.8 + Math.random() * 0.9).toFixed(2));
  const volatility = parseFloat((12 + Math.random() * 6).toFixed(1));

  // Simulating trade logs
  const trades = [
    { id: 't-1', date: '2026-02-15', ticker: 'BBCA', action: 'Beli' as const, price: 9800, amount: 2000, total: 19600000 },
    { id: 't-2', date: '2026-03-22', ticker: 'GOTO', action: 'Jual' as const, price: 82, amount: 50000, total: 4100000 },
    { id: 't-3', date: '2026-04-10', ticker: 'BBRI', action: 'Beli' as const, price: 4400, amount: 3500, total: 15400000 },
    { id: 't-4', date: '2026-05-30', ticker: 'KLBF', action: 'Beli' as const, price: 1450, amount: 8000, total: 11600000 },
    { id: 't-5', date: '2026-07-01', ticker: 'ADRO', action: 'Jual' as const, price: 2900, amount: 4000, total: 11600000 }
  ];

  res.json({
    equityCurve,
    metrics: {
      totalReturn: parseFloat(finalReturn.toFixed(2)),
      cagr: parseFloat((finalReturn * 0.65).toFixed(2)),
      maxDrawdown: parseFloat(maxDd.toFixed(2)),
      sharpeRatio: sharpe,
      volatility
    },
    tradeMarkers: trades
  });
});

// 17. Optimizer Run
app.post('/api/optimize/run', (req, res) => {
  const results = [];
  const topNOptions = [5, 10, 15, 20];
  const rebOptions = [7, 14, 30, 60];

  for (const n of topNOptions) {
    for (const d of rebOptions) {
      const isBest = n === 10 && d === 14;
      const baseReturn = isBest ? 44.5 : 20 + Math.random() * 20;
      const baseSharpe = isBest ? 2.45 : 1.2 + Math.random() * 1.1;
      const maxDd = isBest ? -11.4 : -10 - Math.random() * 15;

      results.push({
        topN: n,
        rebalanceDays: d,
        totalReturn: parseFloat(baseReturn.toFixed(2)),
        sharpeRatio: parseFloat(baseSharpe.toFixed(2)),
        maxDrawdown: parseFloat(maxDd.toFixed(2))
      });
    }
  }

  // Sort by Return descending
  results.sort((a, b) => b.totalReturn - a.totalReturn);
  res.json(results);
});

// 18. AI Assistant Chat with Server-side Gemini
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ text: 'Prompt tidak boleh kosong.' });
  }

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah "SafeHeaven AI Assistant" cerdas buatan Google AI Studio / Stitch. Berikan saran analisis alokasi portfolio keuangan, penyeimbangan taktis (rebalancing), interpretasi visual radar dimensi saham (Quality, Momentum, Value, Volume, Dividend), dan kalkulasi risiko kuantitatif. Berbahasa Indonesia, ramah, singkat, berstruktur bullet-point jika sesuai, dan profesional.'
        }
      });

      return res.json({ text: response.text });
    } else {
      // Mock fallback response if no key configured
      setTimeout(() => {
        const lowerPrompt = prompt.toLowerCase();
        let reply = 'Halo! Saya adalah SafeHeaven AI Assistant. Saya terhubung dalam mode offline untuk kenyamanan sandbox.';

        if (lowerPrompt.includes('saham') || lowerPrompt.includes('saran') || lowerPrompt.includes('ticker')) {
          reply = 'Berdasarkan analisis multi-skor fundamental kami:\n- **BBCA** (Skor 88) dan **BBRI** (Skor 85) berada pada rating **Beli/Akumulasi**.\n- **TLKM** (Skor 79) direkomendasikan **Tahan** karena volume transaksi cenderung netral.\n- Kami menyarankan menghindari penambahan posisi pada **GOTO** (Skor 32, rating **Jual**) sampai volatilitas momentum mereda.';
        } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('alokasi')) {
          reply = `Konfigurasi portfolio Anda saat ini:\n- **Modal Total**: Rp ${portfolioConfig.capital.toLocaleString('id-ID')}\n- **Strategi**: ${portfolioConfig.strategyName}\n- **Alokasi**: Saham (${portfolioConfig.allocationSaham}%), Emas (${portfolioConfig.allocationEmas}%), Kas IDR (${portfolioConfig.allocationCash}%), USD (${portfolioConfig.allocationUSD}%).\n\nDeviasi alokasi saat ini terpantau sehat (<2% dari target rebalancing).`;
        } else if (lowerPrompt.includes('backtest') || lowerPrompt.includes('optimasi') || lowerPrompt.includes('rebalance')) {
          reply = `Mesin rebalancing diatur otomatis secara **${rebalanceConfig.frequency}** setiap hari **${rebalanceConfig.day}** pukul **${rebalanceConfig.time} WIB**. Berdasarkan simulasi backtest terakhir, rebalancing taktis berkala terbukti menaikkan Sharpe Ratio portfolio Anda dari **1.45 menjadi 2.15** serta menekan Max Drawdown hingga 5%.`;
        } else if (lowerPrompt.includes('risiko') || lowerPrompt.includes('risk')) {
          reply = 'Analisis risiko kuantitatif menunjukkan Value-at-Risk (VaR 95%) harian portfolio berada di angka **1.84%**. Berarti peluang kerugian melebihi 1.84% dalam satu hari perdagangan hanyalah sebesar 5%. Indeks diversifikasi Anda dinilai **Sangat Baik** berkat eksposur emas dan USD.';
        }

        res.json({ text: reply });
      }, 500);
    }
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ text: `Maaf, gagal memproses pertanyaan via Gemini: ${error.message}` });
  }
});

// -------------------------------------------------------------------
// Start Server & WebSocket Price Broadcast Engine
// -------------------------------------------------------------------
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Keep track of ticker prices
let liveTickers = [...INITIAL_TICKERS];

// Periodically update live prices and broadcast via WebSocket to simulate market
setInterval(() => {
  liveTickers = liveTickers.map((t) => {
    const isGOTO = t.symbol === 'GOTO';
    const amplitude = isGOTO ? 0.08 : 0.015; // GOTO is highly volatile
    const change = (Math.random() - 0.5) * 2 * amplitude;
    const newPrice = Math.round(t.price * (1 + change));
    const newChangePercent = parseFloat((t.changePercent + change * 100).toFixed(2));
    
    return {
      ...t,
      price: Math.max(50, newPrice),
      changePercent: newChangePercent
    };
  });

  // Broadcast
  const payload = JSON.stringify({
    type: 'prices',
    tickers: liveTickers
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}, 4000);

wss.on('connection', (ws) => {
  // Send immediate update upon connection
  ws.send(JSON.stringify({
    type: 'prices',
    tickers: liveTickers
  }));
});

// -------------------------------------------------------------------
// Mount Frontend Assets / Vite
// -------------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SafeHeaven Backend] Running successfully on http://localhost:${PORT}`);
  });
}

bootstrap();
