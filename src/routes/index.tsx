import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { AppLayout } from '../AppLayout';
import { PageLoader } from '../components/PageLoader';
import { AuthGuardView, PremiumGuardView } from '../components/AccessGuards';
import { AdminProtectedRoute } from '../admin/AdminProtectedRoute';
import { useAppStore } from '../stores';

// Lazy-loaded Page Modules
const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Portfolio = lazy(() => import('../pages/Portfolio').then(m => ({ default: m.Portfolio })));
const Compare = lazy(() => import('../pages/Compare').then(m => ({ default: m.Compare })));
const Backtest = lazy(() => import('../pages/Backtest').then(m => ({ default: m.Backtest })));
const Optimizer = lazy(() => import('../pages/Optimizer').then(m => ({ default: m.Optimizer })));
const Strategies = lazy(() => import('../pages/Strategies').then(m => ({ default: m.Strategies })));
const Analytics = lazy(() => import('../pages/Analytics').then(m => ({ default: m.Analytics })));
const UniversePage = lazy(() => import('../pages/Universe').then(m => ({ default: m.UniversePage })));
const StockAnalysis = lazy(() => import('../pages/StockAnalysis').then(m => ({ default: m.StockAnalysis })));
const MarketNews = lazy(() => import('../pages/MarketNews').then(m => ({ default: m.MarketNews })));
const Risk = lazy(() => import('../pages/Risk').then(m => ({ default: m.Risk })));
const Alerts = lazy(() => import('../pages/Alerts').then(m => ({ default: m.Alerts })));
const Admin = lazy(() => import('../pages/Admin').then(m => ({ default: m.Admin })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const AiManager = lazy(() => import('../pages/AiManager').then(m => ({ default: m.AiManager })));
const TickerDetail = lazy(() => import('../pages/TickerDetail').then(m => ({ default: m.TickerDetail })));
const FullChart = lazy(() => import('../pages/FullChart').then(m => ({ default: m.FullChart })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));
const Premium = lazy(() => import('../pages/Premium').then(m => ({ default: m.Premium })));

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
