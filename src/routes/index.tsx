import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { AppLayout } from '../AppLayout';
import { PageLoader } from '../components/PageLoader';
import { AuthGuardView, PremiumGuardView } from '../components/AccessGuards';
import { AdminProtectedRoute } from '../admin/AdminProtectedRoute';
import { useAppStore } from '../stores';

// Helper for resilient page module dynamic imports with auto-retry
const lazyWithRetry = <P extends object = {}>(factory: () => Promise<any>, exportName?: string): React.ComponentType<P> => {
  return lazy(async () => {
    try {
      const module = await factory();
      const exportItem = module.default || (exportName ? module[exportName] : null) || Object.values(module)[0];
      return { default: exportItem };
    } catch (error) {
      console.warn(`[LazyLoad] Error loading module (${exportName || 'default'}), retrying...`, error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const module = await factory();
        const exportItem = module.default || (exportName ? module[exportName] : null) || Object.values(module)[0];
        return { default: exportItem };
      } catch (retryError) {
        console.error(`[LazyLoad] Failed to load module (${exportName || 'default'}):`, retryError);
        throw retryError;
      }
    }
  }) as unknown as React.ComponentType<P>;
};

// Lazy-loaded Page Modules
const LandingPage = lazyWithRetry(() => import('../pages/LandingPage'), 'LandingPage');
const Login = lazyWithRetry(() => import('../pages/Login'), 'Login');
const Dashboard = lazyWithRetry(() => import('../pages/Dashboard'), 'Dashboard');
const Portfolio = lazyWithRetry(() => import('../pages/Portfolio'), 'Portfolio');
const Compare = lazyWithRetry(() => import('../pages/Compare'), 'Compare');
const Backtest = lazyWithRetry(() => import('../pages/Backtest'), 'Backtest');
const Optimizer = lazyWithRetry(() => import('../pages/Optimizer'), 'Optimizer');
const Strategies = lazyWithRetry(() => import('../pages/Strategies'), 'Strategies');
const Analytics = lazyWithRetry(() => import('../pages/Analytics'), 'Analytics');
const UniversePage = lazyWithRetry(() => import('../pages/Universe'), 'UniversePage');
const StockAnalysis = lazyWithRetry(() => import('../pages/StockAnalysis'), 'StockAnalysis');
const MarketNews = lazyWithRetry(() => import('../pages/MarketNews'), 'MarketNews');
const Risk = lazyWithRetry(() => import('../pages/Risk'), 'Risk');
const Alerts = lazyWithRetry(() => import('../pages/Alerts'), 'Alerts');
const Admin = lazyWithRetry(() => import('../pages/Admin'), 'Admin');
const Settings = lazyWithRetry(() => import('../pages/Settings'), 'Settings');
const AiManager = lazyWithRetry(() => import('../pages/AiManager'), 'AiManager');
const TickerDetail = lazyWithRetry<any>(() => import('../pages/TickerDetail'), 'TickerDetail');
const FullChart = lazyWithRetry<any>(() => import('../pages/FullChart'), 'FullChart');
const NotFound = lazyWithRetry(() => import('../pages/NotFound'), 'NotFound');
const Premium = lazyWithRetry(() => import('../pages/Premium'), 'Premium');

export const AppRoutes = () => {
  const { user, isDemoMode } = useAppStore();

  const isRegisteredUser = !!user && !isDemoMode && user?.email !== 'demo@safehaven.id';
  const isPremium = isRegisteredUser && (user?.isPremium || user?.tier === 'Platinum' || user?.role === 'admin');

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Landing Page & Auth */}
        <Route path="/landing" component={LandingPage} />
        <Route path="/login" component={Login} />

        {/* 1. PUBLIC TABS (Cockpit, Charts, Analytics, News) */}
        <Route path="/">
          {!user && !isDemoMode ? <LandingPage /> : <AppLayout><Dashboard /></AppLayout>}
        </Route>
        <Route path="/dashboard">
          <AppLayout><Dashboard /></AppLayout>
        </Route>
        <Route path="/analytics">
          <AppLayout><Analytics /></AppLayout>
        </Route>
        <Route path="/stock-analysis">
          <AppLayout><StockAnalysis /></AppLayout>
        </Route>
        <Route path="/news">
          <AppLayout><MarketNews /></AppLayout>
        </Route>
        <Route path="/full-chart/:symbol">
          {(params) => <AppLayout><FullChart params={params} /></AppLayout>}
        </Route>
        <Route path="/ticker/:symbol">
          {(params) => <AppLayout><TickerDetail params={params} /></AppLayout>}
        </Route>

        {/* 2. LOGIN-REQUIRED TABS */}
        <Route path="/portfolio">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="Manajemen Portofolio" /></AppLayout> : <AppLayout><Portfolio /></AppLayout>}
        </Route>
        <Route path="/compare">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="Komparasi Portofolio" /></AppLayout> : <AppLayout><Compare /></AppLayout>}
        </Route>
        <Route path="/universe">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="Universe Builder" /></AppLayout> : <AppLayout><UniversePage /></AppLayout>}
        </Route>
        <Route path="/strategies">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="Strategy Builder" /></AppLayout> : <AppLayout><Strategies /></AppLayout>}
        </Route>
        <Route path="/alerts">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="Peringatan Alert & Signal" /></AppLayout> : <AppLayout><Alerts /></AppLayout>}
        </Route>
        <Route path="/risk">
          <Redirect to="/admin" />
        </Route>
        <Route path="/settings">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="Pengaturan Sistem" /></AppLayout> : <AppLayout><Settings /></AppLayout>}
        </Route>
        <Route path="/ai">
          {!isRegisteredUser ? <AppLayout><AuthGuardView featureName="AI Manager Assistant" /></AppLayout> : <AppLayout><AiManager /></AppLayout>}
        </Route>

        {/* Admin Route */}
        <Route path="/admin">
          {!isRegisteredUser ? (
            <AppLayout><AuthGuardView featureName="Admin Console" /></AppLayout>
          ) : (
            <AdminProtectedRoute>
              <AppLayout><Admin /></AppLayout>
            </AdminProtectedRoute>
          )}
        </Route>

        {/* 3. QUANT LAB TABS (Premium Only) */}
        <Route path="/backtest">
          {!isRegisteredUser ? (
            <AppLayout><AuthGuardView featureName="Quant Lab - Backtest Strategi" /></AppLayout>
          ) : !isPremium ? (
            <AppLayout><PremiumGuardView featureName="Quant Lab - Backtest Strategi" /></AppLayout>
          ) : (
            <AppLayout><Backtest /></AppLayout>
          )}
        </Route>
        <Route path="/optimize">
          {!isRegisteredUser ? (
            <AppLayout><AuthGuardView featureName="Quant Lab - Walk Forward Optimizer" /></AppLayout>
          ) : !isPremium ? (
            <AppLayout><PremiumGuardView featureName="Quant Lab - Walk Forward Optimizer" /></AppLayout>
          ) : (
            <AppLayout><Optimizer /></AppLayout>
          )}
        </Route>

        <Route path="/premium">
          {!isRegisteredUser ? (
            <AppLayout><AuthGuardView featureName="Premium Status" /></AppLayout>
          ) : (
            <AppLayout><Premium /></AppLayout>
          )}
        </Route>

        {/* Catch-all 404 */}
        <Route>
          <AppLayout><NotFound /></AppLayout>
        </Route>
      </Switch>
    </Suspense>
  );
};
