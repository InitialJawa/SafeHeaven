/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { 
  TickerInfo, 
  PortfolioConfig, 
  StockPick, 
  AlertRule, 
  AlertHistory, 
  Strategy, 
  Universe, 
  UserInfo, 
  ClientInfo, 
  ApiKey, 
  ChatMessage, 
  BacktestResult, 
  OptimizerResult 
} from '../types';

interface AppState {
  // Auth State
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  
  // Market Tickers
  tickers: TickerInfo[];
  setTickers: (tickers: TickerInfo[]) => void;
  updateTickerPrice: (symbol: string, price: number, changePercent: number) => void;
  
  // Portfolio
  portfolioConfig: PortfolioConfig | null;
  tier: string; // "Perunggu" | "Perak" | "Emas" | "Platinum"
  tierProgress: { current: number; next: number; req: string };
  stockPicks: StockPick[];
  comparePortfolios: { id: string; name: string; capital: number; allocation: number[]; tickers: string[] }[];
  
  // Strategies
  strategies: Strategy[];
  
  // Universes
  universes: Universe[];
  
  // Alerts
  alerts: AlertHistory[];
  alertRules: AlertRule[];
  
  // Admin & Clients
  users: UserInfo[];
  clients: ClientInfo[];
  
  // Keys
  apiKeys: ApiKey[];
  
  // Chat
  chatMessages: ChatMessage[];
  chatLoading: boolean;

  // Settings configs
  rebalanceConfig: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    day: string;
    time: string;
    type: 'full' | 'partial';
  };
  notificationConfig: {
    email: string;
    rotationAlert: boolean;
    signalAlert: boolean;
    dailyReport: boolean;
    crashAlert: boolean;
  };

  // API Call Helpers
  fetchInitialData: () => Promise<void>;
  updatePortfolioConfig: (config: Partial<PortfolioConfig>) => Promise<void>;
  addAlertRule: (rule: Omit<AlertRule, 'id' | 'lastTriggered'>) => Promise<void>;
  toggleAlertRule: (id: string) => Promise<void>;
  deleteAlertRule: (id: string) => Promise<void>;
  addStrategy: (strat: Omit<Strategy, 'id'>) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  addUniverse: (uni: Omit<Universe, 'id'>) => Promise<void>;
  deleteUniverse: (id: string) => Promise<void>;
  triggerRebalance: () => Promise<void>;
  saveRebalanceConfig: (config: any) => Promise<void>;
  saveNotificationConfig: (config: any) => Promise<void>;
  generateApiKey: (name: string) => Promise<void>;
  revokeApiKey: (id: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  changeUserRole: (userId: string, role: 'user' | 'advisor' | 'admin') => Promise<void>;
  addClient: (name: string, email: string) => Promise<void>;
}

// In-store base URL resolver
const getApiUrl = (path: string) => {
  const base = window.location.origin;
  return `${base}${path}`;
};

export const useAppStore = create<AppState>((set, get) => ({
  // Dummy Default User
  user: {
    id: 'usr-1',
    email: 'imamnasrulloh02@gmail.com',
    name: 'Imam Nasrulloh',
    role: 'admin', // Default to admin for full-view dashboard access
    registeredAt: '2026-01-01'
  },
  isAuthenticated: true,

  tickers: [],
  portfolioConfig: {
    capital: 500000000, // Rp 500.000.000
    strategyName: 'Defensive Value Strategy',
    universe: 'LQ45 Core Universe',
    topN: 10,
    strategyTemplate: 'strat-1',
    allocationSaham: 60,
    allocationEmas: 20,
    allocationCash: 10,
    allocationUSD: 10,
    crashThreshold: 15,
    stopLoss: 10,
  },
  tier: 'Platinum',
  tierProgress: { current: 4, next: 5, req: 'Gunakan saldo minimum Rp 1.000.000.000 untuk naik ke Tier Apex' },
  stockPicks: [
    { symbol: 'BBCA', name: 'Bank Central Asia Tbk', score: 88, weight: 20, allocation: 100000000, signal: 'Beli' },
    { symbol: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', score: 85, weight: 15, allocation: 75000000, signal: 'Akumulasi' },
    { symbol: 'TLKM', name: 'Telkom Indonesia Tbk', score: 79, weight: 15, allocation: 75000000, signal: 'Tahan' },
    { symbol: 'ASII', name: 'Astra International Tbk', score: 65, weight: 10, allocation: 50000000, signal: 'Tahan' },
    { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', score: 32, weight: 0, allocation: 0, signal: 'Jual' },
  ],
  comparePortfolios: [
    { id: 'p1', name: 'Portfolio Growth A', capital: 500000000, allocation: [60, 20, 10, 10], tickers: ['BBCA', 'BBRI', 'TLKM'] },
    { id: 'p2', name: 'Portfolio Defensive B', capital: 250000000, allocation: [40, 40, 10, 10], tickers: ['ASII', 'TLKM', 'UNVR'] }
  ],
  strategies: [
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
  ],
  universes: [
    { id: 'uni-1', name: 'LQ45 Core Universe', description: 'Kumpulan 45 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO', 'ADRO', 'UNVR', 'KLBF'] },
    { id: 'uni-2', name: 'Dividend Champion', description: 'Saham dengan histori pembagian dividen konsisten 5 tahun terakhir.', tickers: ['ADRO', 'PTBA', 'ITMG', 'BBCA', 'BMRI', 'ASII'] },
    { id: 'uni-3', name: 'IDX30 Core Universe', description: 'Kumpulan 30 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'UNVR'] },
    { id: 'uni-4', name: 'IDX80 Core Universe', description: 'Kumpulan 80 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO', 'KLBF'] }
  ],
  alerts: [
    { id: 'a-1', time: '2026-07-20T11:00:00Z', type: 'Score', message: 'Skor fundamental BBCA naik ke 88 (Beli)', status: 'unread' },
    { id: 'a-2', time: '2026-07-20T09:30:00Z', type: 'Price', message: 'BBRI menembus batas support Rp 4.500', status: 'unread' },
    { id: 'a-3', time: '2026-07-19T15:00:00Z', type: 'Momentum', message: 'Sinyal GOTO berubah menjadi Hindari (Score: 32)', status: 'read' },
  ],
  alertRules: [
    { id: 'ar-1', name: 'Batas Skor Tinggi BBCA', type: 'Score', condition: '>=', threshold: 85, ticker: 'BBCA', status: 'ON' },
    { id: 'ar-2', name: 'Peringatan Crash GOTO', type: 'Price', condition: '<=', threshold: 120, ticker: 'GOTO', status: 'ON' },
    { id: 'ar-3', name: 'Batas Momentum LQ45', type: 'Momentum', condition: '<=', threshold: 40, status: 'OFF' }
  ],
  users: [
    { id: 'usr-1', email: 'imamnasrulloh02@gmail.com', name: 'Imam Nasrulloh', role: 'admin', registeredAt: '2026-01-01' },
    { id: 'usr-2', email: 'advisor1@safeheaven.id', name: 'Budi Santoso', role: 'advisor', registeredAt: '2026-02-15' },
    { id: 'usr-3', email: 'client1@gmail.com', name: 'Amir Nasution', role: 'user', registeredAt: '2026-04-20' }
  ],
  clients: [
    { id: 'cl-1', name: 'Amir Nasution', email: 'client1@gmail.com', advisorId: 'usr-2' },
    { id: 'cl-2', name: 'Citra Kirana', email: 'citra@outlook.com', advisorId: 'usr-2' }
  ],
  apiKeys: [
    { id: 'k-1', name: 'Production Live Feed', key: 'sh_live_9f83a218', status: 'Active', lastUsed: '2026-07-20 11:14' },
    { id: 'k-2', name: 'Backtest Sandbox', key: 'sh_test_cc9831fa', status: 'Active', lastUsed: '2026-07-19 14:22' }
  ],
  chatMessages: [
    { id: 'c-1', sender: 'ai', text: 'Halo! Saya SafeHeaven AI Assistant. Saya dapat membantu menganalisis portfolio, menyusun aturan alert, atau menjelaskan strategi backtest Anda. Silakan tanyakan apa saja!', timestamp: new Date().toLocaleTimeString('id-ID') }
  ],
  chatLoading: false,

  rebalanceConfig: {
    enabled: true,
    frequency: 'weekly',
    day: 'Senin',
    time: '09:00',
    type: 'full'
  },
  notificationConfig: {
    email: 'imamnasrulloh02@gmail.com',
    rotationAlert: true,
    signalAlert: true,
    dailyReport: false,
    crashAlert: true
  },

  // Auth Operations
  login: (email, name) => {
    set({
      user: {
        id: `usr-${Date.now()}`,
        email,
        name,
        role: email.includes('admin') ? 'admin' : email.includes('advisor') ? 'advisor' : 'user',
        registeredAt: new Date().toISOString().split('T')[0]
      },
      isAuthenticated: true
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  register: async (email, password, name) => {
    set({
      user: {
        id: `usr-${Date.now()}`,
        email,
        name,
        role: 'user',
        registeredAt: new Date().toISOString().split('T')[0]
      },
      isAuthenticated: true
    });
  },

  setTickers: (tickers) => set({ tickers }),
  updateTickerPrice: (symbol, price, changePercent) => {
    set((state) => ({
      tickers: state.tickers.map((t) => 
        t.symbol === symbol ? { ...t, price, changePercent } : t
      )
    }));
  },

  fetchInitialData: async () => {
    try {
      const snapRes = await fetch(getApiUrl('/api/market/snapshot'));
      if (snapRes.ok) {
        const data = await snapRes.json();
        set({ tickers: data });
      }

      const portRes = await fetch(getApiUrl('/api/portfolio/config'));
      if (portRes.ok) {
        const data = await portRes.json();
        set({ portfolioConfig: data });
      }

      const tierRes = await fetch(getApiUrl('/api/portfolio/tier'));
      if (tierRes.ok) {
        const data = await tierRes.json();
        set({ tier: data.tier, tierProgress: data.progress });
      }

      const pickRes = await fetch(getApiUrl('/api/portfolio/stock-picks'));
      if (pickRes.ok) {
        const data = await pickRes.json();
        set({ stockPicks: data });
      }

      const rulesRes = await fetch(getApiUrl('/api/alert-rules'));
      if (rulesRes.ok) {
        const data = await rulesRes.json();
        set({ alertRules: data });
      }

      const alertsRes = await fetch(getApiUrl('/api/alerts'));
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        set({ alerts: data });
      }

      const stratRes = await fetch(getApiUrl('/api/strategies'));
      if (stratRes.ok) {
        const data = await stratRes.json();
        set({ strategies: data });
      }

      const uniRes = await fetch(getApiUrl('/api/universes'));
      if (uniRes.ok) {
        const data = await uniRes.json();
        set({ universes: data });
      }

      const rebRes = await fetch(getApiUrl('/api/rebalance/config'));
      if (rebRes.ok) {
        const data = await rebRes.json();
        set({ rebalanceConfig: data });
      }

      const notifRes = await fetch(getApiUrl('/api/notif/config'));
      if (notifRes.ok) {
        const data = await notifRes.json();
        set({ notificationConfig: data });
      }

      const keysRes = await fetch(getApiUrl('/api/keys'));
      if (keysRes.ok) {
        const data = await keysRes.json();
        set({ apiKeys: data });
      }

      const usersRes = await fetch(getApiUrl('/api/admin/users'));
      if (usersRes.ok) {
        const data = await usersRes.json();
        set({ users: data });
      }

      const clientRes = await fetch(getApiUrl('/api/admin/clients'));
      if (clientRes.ok) {
        const data = await clientRes.json();
        set({ clients: data });
      }
    } catch (err) {
      console.warn('API sync failed, continuing with responsive in-memory state.', err);
    }
  },

  updatePortfolioConfig: async (config) => {
    try {
      const response = await fetch(getApiUrl('/api/portfolio/config'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        const data = await response.json();
        set({ portfolioConfig: data });
      } else {
        set((state) => ({
          portfolioConfig: state.portfolioConfig ? { ...state.portfolioConfig, ...config } as PortfolioConfig : null
        }));
      }
    } catch {
      set((state) => ({
        portfolioConfig: state.portfolioConfig ? { ...state.portfolioConfig, ...config } as PortfolioConfig : null
      }));
    }
  },

  addAlertRule: async (rule) => {
    const id = `ar-${Date.now()}`;
    const newRule: AlertRule = { ...rule, id, status: 'ON' };
    try {
      const response = await fetch(getApiUrl('/api/alert-rules'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      if (response.ok) {
        const saved = await response.json();
        set((state) => ({ alertRules: [...state.alertRules, saved] }));
      } else {
        set((state) => ({ alertRules: [...state.alertRules, newRule] }));
      }
    } catch {
      set((state) => ({ alertRules: [...state.alertRules, newRule] }));
    }
  },

  toggleAlertRule: async (id) => {
    set((state) => {
      const updated = state.alertRules.map((r) => 
        r.id === id ? { ...r, status: (r.status === 'ON' ? 'OFF' : 'ON') as 'ON' | 'OFF' } : r
      );
      // Fire-and-forget sync
      fetch(getApiUrl(`/api/alert-rules/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated.find(r => r.id === id))
      }).catch(() => {});
      return { alertRules: updated };
    });
  },

  deleteAlertRule: async (id) => {
    set((state) => ({ alertRules: state.alertRules.filter((r) => r.id !== id) }));
    try {
      await fetch(getApiUrl(`/api/alert-rules/${id}`), { method: 'DELETE' });
    } catch {}
  },

  addStrategy: async (strat) => {
    const id = `strat-${Date.now()}`;
    const newStrat: Strategy = { ...strat, id };
    try {
      const response = await fetch(getApiUrl('/api/strategies'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStrat)
      });
      if (response.ok) {
        const saved = await response.json();
        set((state) => ({ strategies: [...state.strategies, saved] }));
      } else {
        set((state) => ({ strategies: [...state.strategies, newStrat] }));
      }
    } catch {
      set((state) => ({ strategies: [...state.strategies, newStrat] }));
    }
  },

  deleteStrategy: async (id) => {
    set((state) => ({ strategies: state.strategies.filter((s) => s.id !== id) }));
    try {
      await fetch(getApiUrl(`/api/strategies/${id}`), { method: 'DELETE' });
    } catch {}
  },

  addUniverse: async (uni) => {
    const id = `uni-${Date.now()}`;
    const newUni: Universe = { ...uni, id };
    try {
      const response = await fetch(getApiUrl('/api/universes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUni)
      });
      if (response.ok) {
        const saved = await response.json();
        set((state) => ({ universes: [...state.universes, saved] }));
      } else {
        set((state) => ({ universes: [...state.universes, newUni] }));
      }
    } catch {
      set((state) => ({ universes: [...state.universes, newUni] }));
    }
  },

  deleteUniverse: async (id) => {
    set((state) => ({ universes: state.universes.filter((u) => u.id !== id) }));
    try {
      await fetch(getApiUrl(`/api/universes/${id}`), { method: 'DELETE' });
    } catch {}
  },

  triggerRebalance: async () => {
    try {
      await fetch(getApiUrl('/api/rebalance/trigger'), { method: 'POST' });
    } catch {}
  },

  saveRebalanceConfig: async (config) => {
    try {
      const res = await fetch(getApiUrl('/api/rebalance/config'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        set({ rebalanceConfig: config });
      }
    } catch {
      set({ rebalanceConfig: config });
    }
  },

  saveNotificationConfig: async (config) => {
    try {
      const res = await fetch(getApiUrl('/api/notif/config'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        set({ notificationConfig: config });
      }
    } catch {
      set({ notificationConfig: config });
    }
  },

  generateApiKey: async (name) => {
    const id = `k-${Date.now()}`;
    const key = `sh_live_${Math.random().toString(36).substring(2, 10)}`;
    const newKey: ApiKey = { id, name, key, status: 'Active', lastUsed: 'Never' };
    try {
      const res = await fetch(getApiUrl('/api/keys'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey)
      });
      if (res.ok) {
        const saved = await res.json();
        set((state) => ({ apiKeys: [...state.apiKeys, saved] }));
      } else {
        set((state) => ({ apiKeys: [...state.apiKeys, newKey] }));
      }
    } catch {
      set((state) => ({ apiKeys: [...state.apiKeys, newKey] }));
    }
  },

  revokeApiKey: async (id) => {
    set((state) => ({
      apiKeys: state.apiKeys.map((k) => k.id === id ? { ...k, status: 'Revoked' } : k)
    }));
    try {
      await fetch(getApiUrl(`/api/keys/${id}`), { method: 'DELETE' });
    } catch {}
  },

  sendChatMessage: async (text) => {
    const idUser = `msg-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: idUser,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID')
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      chatLoading: true
    }));

    try {
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });

      if (response.ok) {
        const data = await response.json();
        const idAi = `msg-ai-${Date.now()}`;
        const aiMsg: ChatMessage = {
          id: idAi,
          sender: 'ai',
          text: data.text || 'Maaf, saya tidak dapat memproses tanggapan.',
          timestamp: new Date().toLocaleTimeString('id-ID')
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, aiMsg],
          chatLoading: false
        }));
      } else {
        throw new Error('API Error');
      }
    } catch {
      // Local fallback mock reply using basic rule matches or standard reply
      setTimeout(() => {
        const idAi = `msg-ai-${Date.now()}`;
        const replyText = text.toLowerCase().includes('saham') 
          ? 'Saham-saham blue-chip seperti BBCA dan BBRI saat ini memiliki skor fundamental tinggi (skor > 80), menjadikannya kandidat Beli/Akumulasi utama di portfolio Defensive Value Anda.'
          : 'Terima kasih atas pertanyaannya! SafeHeaven AI merekomendasikan rebalancing berkala setiap minggu (Senin pagi) untuk meminimalisir deviasi alokasi aset Anda dari target.';
        const aiMsg: ChatMessage = {
          id: idAi,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('id-ID')
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, aiMsg],
          chatLoading: false
        }));
      }, 800);
    }
  },

  changeUserRole: async (userId, role) => {
    set((state) => ({
      users: state.users.map((u) => u.id === userId ? { ...u, role } : u)
    }));
    try {
      await fetch(getApiUrl(`/api/admin/users/${userId}/role`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
    } catch {}
  },

  addClient: async (name, email) => {
    const id = `cl-${Date.now()}`;
    const newClient: ClientInfo = { id, name, email, advisorId: 'usr-2' };
    set((state) => ({ clients: [...state.clients, newClient] }));
    try {
      await fetch(getApiUrl('/api/admin/clients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
    } catch {}
  }
}));
