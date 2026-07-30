/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { db, auth, handleFirestoreError, OperationType, firebaseSignOut } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { 
  TickerInfo, 
  PortfolioConfig, 
  StockPick, 
  AlertRule, 
  AlertHistory, 
  PriceAlert,
  Strategy, 
  Universe, 
  UserInfo, 
  ClientInfo, 
  ApiKey, 
  ChatMessage, 
  BacktestResult, 
  OptimizerResult,
  BacktestHistoryItem,
  ChatSessionItem,
  SavedPromptItem,
  NotificationChannelConfig,
  GlobalSystemConfig,
  AiApiConfig
} from '../types';

interface AppState {
  // Auth State
  user: UserInfo | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoadingData: boolean;
  login: (email: string, name: string) => void;
  loginWithGoogle: (email: string, name: string, uid: string, photoURL?: string) => Promise<void>;
  loginDemoUser: (asPremium?: boolean) => void;
  upgradeDemoToPremium: () => void;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  
  // Market Tickers
  tickers: TickerInfo[];
  setTickers: (tickers: TickerInfo[]) => void;
  updateTickerPrice: (symbol: string, price: number, changePercent: number) => void;
  
  // Portfolio
  portfolioConfig: PortfolioConfig | null;
  marketRegime: string | null;
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
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  deletePriceAlert: (id: string) => Promise<void>;
  
  // Backtest History
  backtestHistory: BacktestHistoryItem[];
  fetchBacktestHistory: () => Promise<void>;
  saveBacktestHistory: (item: Omit<BacktestHistoryItem, 'id' | 'createdAt'>) => Promise<string>;
  deleteBacktestHistory: (id: string) => Promise<void>;

  // Admin & Clients
  users: UserInfo[];
  clients: ClientInfo[];
  
  // Keys
  apiKeys: ApiKey[];
  
  // AI Memory Context
  userMemoryContext: string | null;
  fetchUserMemoryContext: () => Promise<void>;
  updateUserMemoryContext: (newContext: string) => Promise<void>;

  // Chat & AI Sessions
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  chatSessions: ChatSessionItem[];
  fetchChatSessions: () => Promise<ChatSessionItem[]>;
  saveChatSession: (session: ChatSessionItem) => Promise<void>;
  deleteChatSession: (sessionId: string) => Promise<void>;

  savedPrompts: SavedPromptItem[];
  fetchSavedPrompts: () => Promise<SavedPromptItem[]>;
  saveSavedPrompt: (prompt: SavedPromptItem) => Promise<void>;
  deleteSavedPrompt: (promptId: string) => Promise<void>;

  // Settings configs
  rebalanceConfig: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    day: string;
    time: string;
    type: 'full' | 'partial';
  };
  notificationConfig: NotificationChannelConfig;
  globalConfig: GlobalSystemConfig;
  aiConfig: AiApiConfig;

  // API Call Helpers
  fetchInitialData: () => Promise<void>;
  updatePortfolioConfig: (config: Partial<PortfolioConfig>) => Promise<void>;
  addAlertRule: (rule: Omit<AlertRule, 'id' | 'lastTriggered'>) => Promise<void>;
  toggleAlertRule: (id: string) => Promise<void>;
  deleteAlertRule: (id: string) => Promise<void>;
  addStrategy: (strat: Omit<Strategy, 'id'>) => Promise<void>;
  updateStrategy: (id: string, strat: Partial<Strategy>) => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
  addUniverse: (uni: Omit<Universe, 'id'>) => Promise<void>;
  updateUniverse: (id: string, uni: Partial<Universe>) => Promise<void>;
  deleteUniverse: (id: string) => Promise<void>;
  syncUniverses: () => Promise<boolean>;
  triggerRebalance: () => Promise<void>;
  saveRebalanceConfig: (config: any) => Promise<void>;
  saveNotificationConfig: (config: NotificationChannelConfig) => Promise<void>;
  saveGlobalConfig: (config: GlobalSystemConfig) => Promise<void>;
  saveAiConfig: (config: AiApiConfig) => Promise<void>;
  generateApiKey: (name: string) => Promise<void>;
  revokeApiKey: (id: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  clearChatMessages: () => void;
  changeUserRole: (userId: string, role: 'user' | 'advisor' | 'admin') => Promise<void>;
  addClient: (name: string, email: string) => Promise<void>;
}

// In-store base URL resolver
const getApiUrl = (path: string) => {
  const base = window.location.origin;
  return `${base}${path}`;
};

export const useAppStore = create<AppState>((set, get) => {
  const savedUserJson = typeof window !== 'undefined' ? localStorage.getItem('safehaven_user') : null;
  const savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;

  return {
    // Auth State - Default to null unless restored from storage
    user: savedUser,
    isAuthenticated: !!savedUser,
    isDemoMode: false,
    isLoadingData: false,

  tickers: [],
  marketRegime: 'neutral',
  backtestHistory: [],
  portfolioConfig: {
    capital: 500000000, // Rp 500.000.000
    strategyName: 'Warren Buffett',
    universe: 'LQ45 Core Universe',
    topN: 10,
    strategyTemplate: 'strat-1',
    allocationSaham: 60,
    allocationEmas: 20,
    allocationCash: 10,
    allocationUSD: 10,
    crashThreshold: -12,
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
      name: 'Warren Buffett',
      description: 'Quality + Value',
      weightQuality: 40,
      weightValue: 30,
      weightMomentum: 15,
      weightVolume: 0,
      weightDividend: 0,
      weightGrowth: 0,
      allocationSaham: 60,
      allocationEmas: 20,
      allocationCash: 10,
      allocationUSD: 10,
      crashThreshold: -12,
      stopLoss: 10
    },
    {
      id: 'strat-2',
      name: 'Peter Lynch',
      description: 'GARP (Growth at Reasonable Price)',
      weightQuality: 20,
      weightValue: 25,
      weightMomentum: 25,
      weightVolume: 0,
      weightDividend: 15,
      weightGrowth: 15,
      allocationSaham: 65,
      allocationEmas: 15,
      allocationCash: 10,
      allocationUSD: 10,
      crashThreshold: -10,
      stopLoss: 10
    },
    {
      id: 'strat-3',
      name: 'Renaissance / AQR',
      description: 'Multi-Factor Momentum',
      weightMomentum: 35,
      weightQuality: 25,
      weightValue: 25,
      weightVolume: 0,
      weightDividend: 0,
      weightGrowth: 15,
      allocationSaham: 70,
      allocationEmas: 10,
      allocationCash: 10,
      allocationUSD: 10,
      crashThreshold: -8,
      stopLoss: 8
    },
    {
      id: 'strat-4',
      name: 'Dividend Aristocrats',
      description: 'Dividend Growth',
      weightDividend: 35,
      weightQuality: 30,
      weightValue: 20,
      weightMomentum: 0,
      weightVolume: 0,
      weightGrowth: 15,
      allocationSaham: 50,
      allocationEmas: 30,
      allocationCash: 10,
      allocationUSD: 10,
      crashThreshold: -8,
      stopLoss: 10
    },
    {
      id: 'strat-5',
      name: 'Bridgewater All Weather',
      description: 'Risk Parity',
      weightQuality: 35,
      weightValue: 20,
      weightDividend: 20,
      weightMomentum: 10,
      weightVolume: 0,
      weightGrowth: 15,
      allocationSaham: 35,
      allocationEmas: 35,
      allocationCash: 20,
      allocationUSD: 10,
      crashThreshold: -7,
      stopLoss: 7
    },
    {
      id: 'strat-6',
      name: 'Resistance / Momentum Breakout',
      description: 'Breakout',
      weightMomentum: 40,
      weightVolume: 30,
      weightQuality: 15,
      weightValue: 15,
      weightDividend: 0,
      weightGrowth: 0,
      allocationSaham: 65,
      allocationEmas: 15,
      allocationCash: 10,
      allocationUSD: 10,
      crashThreshold: -8,
      stopLoss: 8
    },
    {
      id: 'strat-7',
      name: 'SafeHaven All-Weather',
      description: 'Rotasi Taktis: Saham + Emas + USD + Dividen',
      weightQuality: 30,
      weightValue: 20,
      weightDividend: 30,
      weightMomentum: 20,
      weightVolume: 0,
      weightGrowth: 0,
      allocationSaham: 40,
      allocationEmas: 30,
      allocationCash: 10,
      allocationUSD: 20,
      crashThreshold: -5,
      stopLoss: 10,
      enableTacticalRotation: true,
      enableBearMarketGold: true,
      enableBearMarketUSD: true,
      enableDividendDefender: true
    }
  ],
  universes: [
    { id: 'uni-0', name: 'All Saham', description: 'Semua saham yang terdaftar di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO', 'ADRO', 'UNVR', 'KLBF', 'TINS', 'TPIA', 'BUKA', 'HRTA', 'JPFA', 'ESSA', 'AMMN', 'BRPT', 'ADMR', 'EMTK', 'ULTJ', 'WIFI', 'PTBA', 'ITMG', 'ACES', 'MAPI', 'CPIN', 'INDF', 'ICBP', 'PGAS', 'MEDC', 'ANTM', 'MDKA', 'BRIS', 'SMGR', 'BSDE', 'PWON', 'CTRA', 'SMRA', 'EXCL', 'ISAT', 'JSMR', 'UNTR', 'SIDO', 'BREN', 'PGEO'] },
    { id: 'uni-1', name: 'LQ45 Core Universe', description: 'Kumpulan 45 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO', 'ADRO', 'UNVR', 'KLBF'] },
    { id: 'uni-2', name: 'Dividend Champion', description: 'Saham dengan histori pembagian dividen konsisten 5 tahun terakhir.', tickers: ['ADRO', 'PTBA', 'ITMG', 'BBCA', 'BMRI', 'ASII'] },
    { id: 'uni-3', name: 'IDX30 Core Universe', description: 'Kumpulan 30 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'UNVR'] },
    { id: 'uni-4', name: 'IDX80 Core Universe', description: 'Kumpulan 80 saham paling likuid di Bursa Efek Indonesia.', tickers: ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO', 'KLBF'] }
  ],
  alerts: [
    { id: 'a-1', time: '2026-07-22T10:15:00Z', type: 'Rotation', message: 'Sistem memicu rotasi dari Saham ke Emas akibat penurunan momentum ekstrem', status: 'unread' },
    { id: 'a-2', time: '2026-07-22T10:10:00Z', type: 'Stop Loss', message: 'Proteksi Stop-Loss (Crash Shield) aktif. Mengamankan 10% Cash.', status: 'unread' },
    { id: 'a-3', time: '2026-07-21T09:00:00Z', type: 'Momentum', message: 'Momentum IHSG melemah, bersiap mode bertahan (Risk-Off)', status: 'read' },
  ],
  alertRules: [
    { id: 'ar-1', name: 'Batas Skor Tinggi BBCA', type: 'Score', condition: '>=', threshold: 85, ticker: 'BBCA', status: 'ON' },
    { id: 'ar-2', name: 'Peringatan Crash GOTO', type: 'Price', condition: '<=', threshold: 120, ticker: 'GOTO', status: 'ON' },
    { id: 'ar-3', name: 'Batas Momentum LQ45', type: 'Momentum', condition: '<=', threshold: 40, status: 'OFF' }
  ],
  priceAlerts: [],

  addPriceAlert: async (alertData) => {
    const id = `p-alert-${Date.now()}`;
    const newAlert: PriceAlert = {
      ...alertData,
      id,
      userId: get().user?.id || 'usr-1',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    set((state) => ({ priceAlerts: [newAlert, ...state.priceAlerts] }));
    try {
      await setDoc(doc(db, 'priceAlerts', id), newAlert);
      toast.success(`Target alert harga ${alertData.symbol} di Rp ${alertData.targetPrice.toLocaleString('id-ID')} berhasil disimpan.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `priceAlerts/${id}`);
    }
  },

  deletePriceAlert: async (id) => {
    set((state) => ({ priceAlerts: state.priceAlerts.filter(a => a.id !== id) }));
    try {
      await deleteDoc(doc(db, 'priceAlerts', id));
      toast.info('Price alert berhasil dihapus.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `priceAlerts/${id}`);
    }
  },
  users: [
    { id: 'usr-1', email: 'admin@safehaven.id', name: 'SafeHaven Admin', role: 'admin', registeredAt: '2026-01-01' },
    { id: 'usr-2', email: 'advisor1@safehaven.id', name: 'Budi Santoso', role: 'advisor', registeredAt: '2026-02-15' },
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
  userMemoryContext: null,
  chatMessages: [
    { id: 'c-1', sender: 'ai', text: 'Halo! Saya SafeHaven AI Assistant. Saya dapat membantu menganalisis portfolio, menyusun aturan alert, atau menjelaskan strategi backtest Anda. Silakan tanyakan apa saja!', timestamp: new Date().toLocaleTimeString('id-ID') }
  ],
  chatLoading: false,
  chatSessions: [],
  savedPrompts: [],

  rebalanceConfig: {
    enabled: true,
    frequency: 'weekly',
    day: 'Senin',
    time: '09:00',
    type: 'full'
  },
  notificationConfig: {
    email: 'admin@safehaven.id',
    emailEnabled: true,
    whatsapp: '+6281234567890',
    whatsappEnabled: true,
    webhookUrl: 'https://api.my-custom-webhook.com/alerts',
    webhookEnabled: false,
    telegramToken: '7123456789:AAFxX_ExampleTelegramBotToken',
    telegramChatId: '-100123456789',
    telegramEnabled: true,
    discordWebhook: 'https://discord.com/api/webhooks/123456789/ExampleDiscordWebhookKey',
    discordEnabled: true,
    rotationAlert: true,
    signalAlert: true,
    dailyReport: false,
    crashAlert: true,
  },
  globalConfig: {
    currencyDisplay: 'IDR',
    executionMode: 'Otomatis',
    autoSyncInterval: '15s',
    maxSingleStockAllocation: 15,
    autoStopLoss: 10,
    soundNotifications: true,
    highContrastGlow: true,
  },
  aiConfig: {
    provider: 'gemini',
    aiModel: 'gemini-2.5-flash',
    customApiKey: '',
    customBaseUrl: '',
    aiTemperature: 0.3,
    aiAdvisorTone: 'balanced',
    autoNewsSentiment: true,
    stockScoringReasoning: true,
    maxTokens: 2048,
    enableSearchGrounding: true
  },

  // Auth Operations
  login: (email, name) => {
    const normalizedEmail = (email || '').toLowerCase();
    // Default to user role unless user is exact master admin email with password login
    const isMasterAdmin = normalizedEmail === 'admin@safehaven.id';
    const role = isMasterAdmin ? 'admin' : normalizedEmail.includes('advisor') ? 'advisor' : 'user';
    const isPremium = role === 'admin' || normalizedEmail.includes('premium');
    const userInfo: UserInfo = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      isPremium,
      tier: isPremium ? 'Platinum' : 'Perunggu',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('safehaven_user', JSON.stringify(userInfo));
    set({ user: userInfo, isAuthenticated: true, isDemoMode: false, tier: userInfo.tier || 'Perunggu' });
    toast.success(`Selamat datang kembali, ${name || email}!`);
  },
  loginWithGoogle: async (email, name, uid, photoURL) => {
    const normalizedEmail = (email || '').toLowerCase();
    let userRole: 'admin' | 'advisor' | 'user' = (normalizedEmail.includes('admin') || normalizedEmail.endsWith('@safehaven.id')) ? 'admin' : normalizedEmail.includes('advisor') ? 'advisor' : 'user';
    
    let isPremium = userRole === 'admin' || normalizedEmail.includes('premium');

    // Check if user record exists in Firestore
    try {
      const userDocSnap = await getDoc(doc(db, 'users', uid));
      if (userDocSnap.exists()) {
        const existingData = userDocSnap.data();
        if (existingData?.role === 'admin' || existingData?.role === 'advisor') {
          userRole = existingData.role;
        }
        if (existingData?.isPremium) {
          isPremium = true;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca profil role Firestore:', e);
    }

    const userInfo: UserInfo = {
      id: uid,
      email,
      name,
      ...(photoURL ? { photoURL } : {}),
      role: userRole,
      isPremium,
      tier: isPremium ? 'Platinum' : 'Perunggu',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('safehaven_user', JSON.stringify(userInfo));
    set({ user: userInfo, isAuthenticated: true, isDemoMode: false, tier: userInfo.tier || 'Perunggu' });

    // Sync user record with Firestore (filter out undefined values to prevent Firestore error)
    const firestorePayload = Object.fromEntries(
      Object.entries(userInfo).filter(([_, v]) => v !== undefined)
    );

    try {
      await setDoc(doc(db, 'users', uid), firestorePayload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }
    toast.success(`Berhasil masuk sebagai ${name}`);
  },
  loginDemoUser: (asPremium = false) => {
    const demoUser: UserInfo = {
      id: 'demo-user-123',
      email: 'demo@safehaven.id',
      name: asPremium ? 'Demo Investor (Premium)' : 'Demo Trader (Guest)',
      role: 'user',
      isPremium: asPremium,
      tier: asPremium ? 'Platinum' : 'Perunggu',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    set({ user: demoUser, isAuthenticated: true, isDemoMode: true, tier: demoUser.tier || 'Perunggu' });
    toast.success(`Sesi Akun Demo aktif (${asPremium ? 'Member Premium' : 'Free Demo'}).`);
  },
  upgradeDemoToPremium: () => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser: UserInfo = {
        ...currentUser,
        isPremium: true,
        tier: 'Platinum'
      };
      localStorage.setItem('safehaven_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, tier: 'Platinum' });
      toast.success('Selamat! Status akun Anda berhasil ditingkatkan ke Member Premium (Platinum Tier).');
    } else {
      get().loginDemoUser(true);
    }
  },
  logout: () => {
    firebaseSignOut(auth).catch(() => {});
    localStorage.removeItem('safehaven_user');
    set({ user: null, isAuthenticated: false, isDemoMode: false });
  },
  register: async (email, password, name) => {
    const normalizedEmail = (email || '').toLowerCase();
    const role = (normalizedEmail.includes('admin') || normalizedEmail.endsWith('@safehaven.id')) ? 'admin' : normalizedEmail.includes('advisor') ? 'advisor' : 'user';
    const userInfo: UserInfo = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      isPremium: role === 'admin',
      tier: role === 'admin' ? 'Platinum' : 'Perunggu',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('safehaven_user', JSON.stringify(userInfo));
    set({ user: userInfo, isAuthenticated: true, isDemoMode: false, tier: userInfo.tier || 'Perunggu' });
    toast.success(`Akun berhasil dibuat. Selamat datang, ${name}!`);
  },

  setTickers: (tickers) => set({ tickers }),
  updateTickerPrice: (symbol, price, changePercent) => {
    set((state) => {
      const tickers = state.tickers.map((t) => 
        t.symbol === symbol ? { ...t, price, changePercent } : t
      );

      // Check active price alerts
      state.priceAlerts.forEach(alert => {
        if (alert.symbol === symbol && alert.status === 'active') {
          const reached = alert.condition === 'above' ? price >= alert.targetPrice : price <= alert.targetPrice;
          if (reached) {
            toast.success("PRICE ALERT: " + symbol + " mencapai target Rp " + alert.targetPrice.toLocaleString('id-ID') + " (Harga: Rp " + price.toLocaleString('id-ID') + ")");
            alert.status = 'triggered';
            const newHistoryItem: AlertHistory = {
              id: `alert-hist-${Date.now()}`,
              time: new Date().toISOString(),
              type: 'Price',
              message: "Harga " + symbol + " menyentuh target " + (alert.condition === 'above' ? '>=' : '<=') + " Rp " + alert.targetPrice.toLocaleString('id-ID') + " (Aktual: Rp " + price.toLocaleString('id-ID') + ")",
              status: 'unread'
            };
            set(s => ({ alerts: [newHistoryItem, ...s.alerts] }));
            setDoc(doc(db, 'priceAlerts', alert.id), { ...alert, status: 'triggered' }).catch(() => {});
          }
        }
      });

      return { tickers };
    });
  },

  fetchInitialData: async () => {
    set({ isLoadingData: true });
    try {
      const fetchJson = async (endpoint: string) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);
          const res = await window.appFetch(getApiUrl(endpoint), { signal: controller.signal });
          clearTimeout(timeoutId);
          return res.ok ? await res.json() : null;
        } catch {
          return null;
        }
      };

      const [
        snapData,
        portData,
        regimeData,
        tierData,
        pickData,
        rulesData,
        alertsData,
        stratData,
        uniData,
        rebData,
        notifData,
        keysData,
        usersData,
        clientData,
      ] = await Promise.all([
        fetchJson('/api/market/snapshot'),
        fetchJson('/api/portfolio/config'),
        fetchJson('/api/market/regime'),
        fetchJson('/api/portfolio/tier'),
        fetchJson('/api/portfolio/stock-picks'),
        fetchJson('/api/alert-rules'),
        fetchJson('/api/alerts'),
        fetchJson('/api/strategies'),
        fetchJson('/api/universes'),
        fetchJson('/api/rebalance/config'),
        fetchJson('/api/notif/config'),
        fetchJson('/api/keys'),
        fetchJson('/api/admin/users'),
        fetchJson('/api/admin/clients'),
      ]);

      const stateUpdates: Record<string, any> = {};
      if (snapData) stateUpdates.tickers = snapData;
      if (portData) stateUpdates.portfolioConfig = portData;
      if (regimeData?.regime) stateUpdates.marketRegime = regimeData.regime;
      if (tierData) {
        stateUpdates.tier = tierData.tier;
        stateUpdates.tierProgress = tierData.progress;
      }
      if (pickData) stateUpdates.stockPicks = pickData;
      if (rulesData) stateUpdates.alertRules = rulesData;
      if (alertsData) stateUpdates.alerts = alertsData;
      if (stratData) stateUpdates.strategies = stratData;
      if (uniData) stateUpdates.universes = uniData;
      if (rebData) stateUpdates.rebalanceConfig = rebData;
      if (notifData) stateUpdates.notificationConfig = notifData;
      if (keysData) stateUpdates.apiKeys = keysData;
      if (usersData) stateUpdates.users = usersData;
      if (clientData) stateUpdates.clients = clientData;

      set(stateUpdates);

      // Asynchronous background load for Firestore priceAlerts
      (async () => {
        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
          const queryPromise = getDocs(collection(db, 'priceAlerts'));
          const querySnapshot = (await Promise.race([queryPromise, timeoutPromise])) as any;
          const loadedAlerts: PriceAlert[] = [];
          if (querySnapshot && typeof querySnapshot.forEach === 'function') {
            querySnapshot.forEach((docSnap: any) => {
              loadedAlerts.push(docSnap.data() as PriceAlert);
            });
            if (loadedAlerts.length > 0) {
              set({ priceAlerts: loadedAlerts });
            }
          }
        } catch {}
      })();

      // Asynchronous background load for Backtest History
      get().fetchBacktestHistory().catch(() => {});
      // Fetch AI user memory context
      get().fetchUserMemoryContext().catch(() => {});
      // Fetch Chat Sessions & Saved Prompts
      get().fetchChatSessions().catch(() => {});
      get().fetchSavedPrompts().catch(() => {});
    } catch (err) {
      console.warn('API sync failed, continuing with responsive in-memory state.', err);
    } finally {
      set({ isLoadingData: false });
    }
  },

  updatePortfolioConfig: async (config) => {
    try {
      const response = await window.appFetch(getApiUrl('/api/portfolio/config'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        const data = await response.json();
        set({ portfolioConfig: data });
        
        // Re-fetch dependent data
        const pickRes = await window.appFetch(getApiUrl('/api/portfolio/stock-picks'));
        if (pickRes.ok) {
          const picksData = await pickRes.json();
          set({ stockPicks: picksData });
        }
        
        const tierRes = await window.appFetch(getApiUrl('/api/portfolio/tier'));
        if (tierRes.ok) {
          const tierData = await tierRes.json();
          set({ tier: tierData.tier, tierProgress: tierData.progress });
        }
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
      const response = await window.appFetch(getApiUrl('/api/alert-rules'), {
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
      window.appFetch(getApiUrl(`/api/alert-rules/${id}`), {
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
      await window.appFetch(getApiUrl(`/api/alert-rules/${id}`), { method: 'DELETE' });
    } catch {}
  },

  addStrategy: async (strat) => {
    const id = `strat-${Date.now()}`;
    const newStrat: Strategy = { ...strat, id };
    try {
      const response = await window.appFetch(getApiUrl('/api/strategies'), {
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

  updateStrategy: async (id, strat) => {
    set((state) => ({
      strategies: state.strategies.map(s => s.id === id ? { ...s, ...strat } : s)
    }));
    try {
      await window.appFetch(getApiUrl(`/api/strategies/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strat)
      });
    } catch {}
  },

  deleteStrategy: async (id) => {
    set((state) => ({ strategies: state.strategies.filter((s) => s.id !== id) }));
    try {
      await window.appFetch(getApiUrl(`/api/strategies/${id}`), { method: 'DELETE' });
    } catch {}
  },

  addUniverse: async (uni) => {
    const id = `uni-${Date.now()}`;
    const newUni: Universe = { ...uni, id };
    try {
      const response = await window.appFetch(getApiUrl('/api/universes'), {
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
      await window.appFetch(getApiUrl(`/api/universes/${id}`), { method: 'DELETE' });
    } catch {}
  },

  syncUniverses: async () => {
    try {
      const response = await window.appFetch(getApiUrl('/api/universes/sync'), { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.universes) {
          set({ universes: data.universes });
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  },

  updateUniverse: async (id, uni) => {
    set((state) => ({
      universes: state.universes.map((u) => u.id === id ? { ...u, ...uni } : u)
    }));
    try {
      await window.appFetch(getApiUrl(`/api/universes/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uni)
      });
    } catch {}
  },

  triggerRebalance: async () => {
    try {
      await window.appFetch(getApiUrl('/api/rebalance/trigger'), { method: 'POST' });
    } catch {}
  },

  saveRebalanceConfig: async (config) => {
    try {
      const res = await window.appFetch(getApiUrl('/api/rebalance/config'), {
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
      const res = await window.appFetch(getApiUrl('/api/notif/config'), {
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

  saveGlobalConfig: async (config) => {
    try {
      const res = await window.appFetch(getApiUrl('/api/global/config'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        set({ globalConfig: config });
      }
    } catch {
      set({ globalConfig: config });
    }
  },

  saveAiConfig: async (config) => {
    try {
      const res = await window.appFetch(getApiUrl('/api/ai/config'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        set({ aiConfig: config });
      } else {
        set({ aiConfig: config });
      }
    } catch {
      set({ aiConfig: config });
    }
  },

  generateApiKey: async (name) => {
    const id = `k-${Date.now()}`;
    const key = `sh_live_${Math.random().toString(36).substring(2, 10)}`;
    const newKey: ApiKey = { id, name, key, status: 'Active', lastUsed: 'Never' };
    try {
      const res = await window.appFetch(getApiUrl('/api/keys'), {
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
      await window.appFetch(getApiUrl(`/api/keys/${id}`), { method: 'DELETE' });
    } catch {}
  },

  fetchUserMemoryContext: async () => {
    const firebaseUid = auth.currentUser?.uid;
    if (!firebaseUid) return;

    try {
      const docRef = doc(db, `users/${firebaseUid}/memory/default`);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        set({ userMemoryContext: data.memoryContext || null });
      } else {
        set({ userMemoryContext: null });
      }
    } catch (e) {
      console.warn("Failed to fetch user memory", e);
    }
  },

  updateUserMemoryContext: async (newContext: string) => {
    const firebaseUid = auth.currentUser?.uid;
    
    // Save locally
    set({ userMemoryContext: newContext });

    if (!firebaseUid) return;

    try {
      const docRef = doc(db, `users/${firebaseUid}/memory/default`);
      await setDoc(docRef, {
        userId: firebaseUid,
        memoryContext: newContext,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      set({ userMemoryContext: newContext });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUid}/memory/default`);
    }
  },

  clearChatMessages: () => {
    set({ chatMessages: [] });
  },

  sendChatMessage: async (text) => {
    const idUser = `msg-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: idUser,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      chatLoading: true
    }));

    try {
      const { userMemoryContext } = get();
      const response = await window.appFetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, memoryContext: userMemoryContext })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.text) {
        if (data.newMemoryContext) {
          get().updateUserMemoryContext(data.newMemoryContext);
        }

        const idAi = `msg-ai-${Date.now()}`;
        const aiMsg: ChatMessage = {
          id: idAi,
          sender: 'ai',
          text: data.text,
          provider: data.provider,
          model: data.model,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, aiMsg],
          chatLoading: false
        }));
      } else {
        const idAi = `msg-ai-${Date.now()}`;
        const aiMsg: ChatMessage = {
          id: idAi,
          sender: 'ai',
          text: data.text || `⚠️ Gagal mendapatkan respons dari AI: ${data.error || 'Server tidak merespons'}`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, aiMsg],
          chatLoading: false
        }));
      }
    } catch (err: any) {
      const idAi = `msg-ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: idAi,
        sender: 'ai',
        text: `⚠️ Terjadi kendala jaringan/koneksi backend: ${err?.message || 'Gagal menghubungi server'}.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      set((state) => ({
        chatMessages: [...state.chatMessages, aiMsg],
        chatLoading: false
      }));
    }
  },

  changeUserRole: async (userId, role) => {
    set((state) => ({
      users: state.users.map((u) => u.id === userId ? { ...u, role } : u)
    }));
    try {
      await window.appFetch(getApiUrl(`/api/admin/users/${userId}/role`), {
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
      await window.appFetch(getApiUrl('/api/admin/clients'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
    } catch {}
  },

  fetchBacktestHistory: async () => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';

    // Only attempt Firestore read if Firebase Auth user is logged in and matches the userId
    if (firebaseUid && firebaseUid === userId) {
      try {
        const colRef = collection(db, 'users', userId, 'backtests');
        const snapshot = await getDocs(colRef);
        const items: BacktestHistoryItem[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as BacktestHistoryItem);
        });
        // Sort newest first
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        set({ backtestHistory: items });
        try { localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(items)); } catch(e) { try { localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(items.slice(0, 5))); } catch(e2) {} }
        return;
      } catch (err) {
        // Fallthrough to local storage if Firestore fails
      }
    }

    // Read from local storage for offline / unauthenticated state
    const local = localStorage.getItem(`safehaven_backtests_${userId}`);
    if (local) {
      try {
        set({ backtestHistory: JSON.parse(local) });
      } catch {}
    }
  },

  saveBacktestHistory: async (itemData) => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';
    const backtestId = `bt-${Date.now()}`;
    const newItem: BacktestHistoryItem = {
      ...itemData,
      id: backtestId,
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...get().backtestHistory];
    set({ backtestHistory: updated });
    try { localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(updated)); } catch(e) { try { localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(updated.slice(0, 5))); } catch(e2) {} }

    if (firebaseUid && firebaseUid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'backtests', backtestId);
        await setDoc(docRef, newItem);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${userId}/backtests/${backtestId}`);
      }
    }
    return backtestId;
  },

  deleteBacktestHistory: async (id) => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';
    const updated = get().backtestHistory.filter(item => item.id !== id);
    set({ backtestHistory: updated });
    try { localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(updated)); } catch(e) { try { localStorage.setItem(`safehaven_backtests_${userId}`, JSON.stringify(updated.slice(0, 5))); } catch(e2) {} }

    if (firebaseUid && firebaseUid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'backtests', id);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${userId}/backtests/${id}`);
      }
    }
  },

  fetchChatSessions: async () => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';

    if (firebaseUid && firebaseUid === userId) {
      try {
        const colRef = collection(db, 'users', userId, 'chatSessions');
        const snapshot = await getDocs(colRef);
        const items: ChatSessionItem[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as ChatSessionItem);
        });
        items.sort((a, b) => b.updatedAt - a.updatedAt);
        if (items.length > 0) {
          set({ chatSessions: items });
          localStorage.setItem(`ai_chat_sessions_${userId}`, JSON.stringify(items));
          return items;
        }
      } catch (err) {
        console.warn("Failed to fetch chat sessions from Firestore", err);
      }
    }

    const local = localStorage.getItem(`ai_chat_sessions_${userId}`) || localStorage.getItem("ai_chat_sessions");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        set({ chatSessions: parsed });
        return parsed;
      } catch {}
    }
    return [];
  },

  saveChatSession: async (sessionItem) => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';
    
    const existingIndex = get().chatSessions.findIndex(s => s.id === sessionItem.id);
    let updated: ChatSessionItem[];
    if (existingIndex >= 0) {
      updated = get().chatSessions.map(s => s.id === sessionItem.id ? { ...s, ...sessionItem } : s);
    } else {
      updated = [sessionItem, ...get().chatSessions];
    }

    set({ chatSessions: updated });
    localStorage.setItem(`ai_chat_sessions_${userId}`, JSON.stringify(updated));
    localStorage.setItem("ai_chat_sessions", JSON.stringify(updated));

    if (firebaseUid && firebaseUid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'chatSessions', sessionItem.id);
        const firestorePayload: any = {
          id: sessionItem.id,
          title: sessionItem.title,
          updatedAt: sessionItem.updatedAt
        };
        if (sessionItem.messages) {
          firestorePayload.messages = JSON.stringify(sessionItem.messages);
        }
        await setDoc(docRef, firestorePayload, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${userId}/chatSessions/${sessionItem.id}`);
      }
    }
  },

  deleteChatSession: async (sessionId) => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';
    const updated = get().chatSessions.filter(s => s.id !== sessionId);
    set({ chatSessions: updated });
    localStorage.setItem(`ai_chat_sessions_${userId}`, JSON.stringify(updated));
    localStorage.setItem("ai_chat_sessions", JSON.stringify(updated));

    if (firebaseUid && firebaseUid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'chatSessions', sessionId);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${userId}/chatSessions/${sessionId}`);
      }
    }
  },

  fetchSavedPrompts: async () => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';

    if (firebaseUid && firebaseUid === userId) {
      try {
        const colRef = collection(db, 'users', userId, 'savedPrompts');
        const snapshot = await getDocs(colRef);
        const items: SavedPromptItem[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as SavedPromptItem);
        });
        if (items.length > 0) {
          set({ savedPrompts: items });
          localStorage.setItem(`ai_saved_prompts_${userId}`, JSON.stringify(items));
          return items;
        }
      } catch (err) {
        console.warn("Failed to fetch saved prompts from Firestore", err);
      }
    }

    const local = localStorage.getItem(`ai_saved_prompts_${userId}`) || localStorage.getItem("ai_saved_prompts");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        set({ savedPrompts: parsed });
        return parsed;
      } catch {}
    }
    const defaultPrompts: SavedPromptItem[] = [
      { id: "1", title: "Analisa Makro IHSG", prompt: "Tolong berikan analisis makro IHSG hari ini beserta sektor yang diuntungkan." },
      { id: "2", title: "Review Portfolio", prompt: "Berikan saran taktis untuk portofolio saham perbankan dan energi saya saat ini." },
      { id: "3", title: "Screener Saham Undervalued", prompt: "Bantu saya mencari 3 saham blue chip yang sedang undervalued secara fundamental." }
    ];
    set({ savedPrompts: defaultPrompts });
    return defaultPrompts;
  },

  saveSavedPrompt: async (promptItem) => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';
    
    const existingIndex = get().savedPrompts.findIndex(p => p.id === promptItem.id);
    let updated: SavedPromptItem[];
    if (existingIndex >= 0) {
      updated = get().savedPrompts.map(p => p.id === promptItem.id ? { ...p, ...promptItem } : p);
    } else {
      updated = [promptItem, ...get().savedPrompts];
    }

    set({ savedPrompts: updated });
    localStorage.setItem(`ai_saved_prompts_${userId}`, JSON.stringify(updated));
    localStorage.setItem("ai_saved_prompts", JSON.stringify(updated));

    if (firebaseUid && firebaseUid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'savedPrompts', promptItem.id);
        await setDoc(docRef, promptItem, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${userId}/savedPrompts/${promptItem.id}`);
      }
    }
  },

  deleteSavedPrompt: async (promptId) => {
    const firebaseUid = auth.currentUser?.uid;
    const userId = firebaseUid || get().user?.id || 'usr-1';
    const updated = get().savedPrompts.filter(p => p.id !== promptId);
    set({ savedPrompts: updated });
    localStorage.setItem(`ai_saved_prompts_${userId}`, JSON.stringify(updated));
    localStorage.setItem("ai_saved_prompts", JSON.stringify(updated));

    if (firebaseUid && firebaseUid === userId) {
      try {
        const docRef = doc(db, 'users', userId, 'savedPrompts', promptId);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${userId}/savedPrompts/${promptId}`);
      }
    }
  }
};
});
