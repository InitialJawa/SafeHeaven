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
}

export interface PortfolioConfig {
  capital: number;
  strategyName: string;
  universe: string;
  topN: number;
  strategyTemplate: string;
  allocationSaham: number;
  allocationEmas: number;
  allocationCash: number;
  allocationUSD: number;
  crashThreshold: number;
  stopLoss: number;
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface BacktestResult {
  equityCurve: { date: string; value: number; buyAndHoldValue: number }[];
  metrics: {
    totalReturn: number;
    cagr: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
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
