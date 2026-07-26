/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SignalType = 'Beli' | 'Akumulasi' | 'Tahan' | 'Hindari' | 'Jual';

export interface TickerInfo {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  score: number;
  signal: SignalType;
  quality?: number;
  growth?: number;
  value?: number;
  moment?: number;
  dividen?: number;
}

export interface PortfolioConfig {
  capital: number;
  strategyName: string;
  universe: string;
  topN: number;
  strategyTemplate: string;
  strategyProfile?: 'auto' | 'aggressive_momentum' | 'defensive_value' | 'custom' | string;
  allocationSaham: number;
  allocationEmas: number;
  allocationCash: number;
  allocationUSD: number;
  crashThreshold: number;
  stopLoss: number;
  activeStressScenario?: string;
  stressImpactPct?: number;
  lastRebalancedAt?: string;
  projectedAnnualDividend?: number;
}

export interface StockPick {
  symbol: string;
  name: string;
  score: number;
  weight: number;
  allocation: number;
  signal: SignalType;
}

export interface AlertRule {
  id: string;
  name: string;
  type: 'Score' | 'Momentum' | 'Price';
  condition: '>=' | '<=';
  threshold: number;
  ticker?: string;
  status: 'ON' | 'OFF';
  lastTriggered?: string;
}

export interface PriceAlert {
  id: string;
  userId?: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  status: 'active' | 'triggered' | 'cancelled';
  createdAt: string;
}

export interface AlertHistory {
  id: string;
  time: string;
  type: string;
  message: string;
  status: 'read' | 'unread';
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  weightQuality: number;
  weightMomentum: number;
  weightValue: number;
  weightVolume: number;
  weightDividend: number;
  weightGrowth: number;
  allocationSaham: number;
  allocationEmas: number;
  allocationCash: number;
  allocationUSD: number;
  crashThreshold: number;
  stopLoss: number;
}

export interface Universe {
  id: string;
  name: string;
  description: string;
  tickers: string[];
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'advisor' | 'admin';
  registeredAt: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  email: string;
  advisorId: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'Active' | 'Revoked';
  lastUsed?: string;
}

export interface NotificationChannelConfig {
  email: string;
  emailEnabled: boolean;
  whatsapp: string;
  whatsappEnabled: boolean;
  webhookUrl: string;
  webhookEnabled: boolean;
  telegramToken: string;
  telegramChatId: string;
  telegramEnabled: boolean;
  discordWebhook: string;
  discordEnabled: boolean;
  rotationAlert: boolean;
  signalAlert: boolean;
  dailyReport: boolean;
  crashAlert: boolean;
}

export interface GlobalSystemConfig {
  currencyDisplay: 'IDR' | 'USD' | 'DUAL';
  executionMode: 'Otomatis' | 'Semi-Auto' | 'Simulasi';
  autoSyncInterval: '5s' | '15s' | '60s' | 'manual';
  maxSingleStockAllocation: number;
  autoStopLoss: number;
  soundNotifications: boolean;
  highContrastGlow: boolean;
}

export type AiProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'groq' | 'custom_openai';

export interface AiApiConfig {
  provider: AiProvider;
  aiModel: string;
  customApiKey?: string;
  customBaseUrl?: string;
  aiTemperature: number;
  aiAdvisorTone: 'balanced' | 'conservative' | 'growth_momentum';
  autoNewsSentiment: boolean;
  stockScoringReasoning: boolean;
  maxTokens: number;
  enableSearchGrounding: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  provider?: string;
  model?: string;
}

export interface ChatSessionItem {
  id: string;
  title: string;
  updatedAt: number;
  messages?: ChatMessage[];
}

export interface SavedPromptItem {
  id: string;
  title: string;
  prompt: string;
  category?: string;
}

export interface BacktestResult {
  equityCurve: { date: string; value: number; buyAndHoldValue: number }[];
  metrics: {
    totalReturn: number;
    cagr: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
    totalDividend?: number;
  };
  tradeMarkers: {
    id: string;
    date: string;
    ticker: string;
    action: 'Beli' | 'Jual';
    price: number;
    amount: number;
    total: number;
  }[];
}

export interface OptimizerResult {
  topN: number;
  rebalanceDays: number;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface BacktestHistoryItem {
  id: string;
  createdAt: string;
  strategyName: string;
  universe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalEquity: number;
  cagr: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  result: BacktestResult;
}
