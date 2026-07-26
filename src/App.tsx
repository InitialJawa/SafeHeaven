/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { useAppStore } from './stores';
import { AppLayout } from './AppLayout';
import { testConnection, auth, onAuthStateChanged } from './lib/firebase';
import { Toaster } from 'sonner';
import { PageLoader } from './components/PageLoader';
import { AdminProtectedRoute } from './admin/AdminProtectedRoute';

// Lazy-loaded Page Modules
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Portfolio = lazy(() => import('./pages/Portfolio').then(m => ({ default: m.Portfolio })));
const Compare = lazy(() => import('./pages/Compare').then(m => ({ default: m.Compare })));
const Backtest = lazy(() => import('./pages/Backtest').then(m => ({ default: m.Backtest })));
const Optimizer = lazy(() => import('./pages/Optimizer').then(m => ({ default: m.Optimizer })));
const Strategies = lazy(() => import('./pages/Strategies').then(m => ({ default: m.Strategies })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const UniversePage = lazy(() => import('./pages/Universe').then(m => ({ default: m.UniversePage })));
const StockAnalysis = lazy(() => import('./pages/StockAnalysis').then(m => ({ default: m.StockAnalysis })));
const MarketNews = lazy(() => import('./pages/MarketNews').then(m => ({ default: m.MarketNews })));
const Risk = lazy(() => import('./pages/Risk').then(m => ({ default: m.Risk })));
const Alerts = lazy(() => import('./pages/Alerts').then(m => ({ default: m.Alerts })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const AiManager = lazy(() => import('./pages/AiManager').then(m => ({ default: m.AiManager })));
const TickerDetail = lazy(() => import('./pages/TickerDetail').then(m => ({ default: m.TickerDetail })));
const FullChart = lazy(() => import('./pages/FullChart').then(m => ({ default: m.FullChart })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

export default function App() {
  const { user, fetchInitialData, loginWithGoogle } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && (!user || user.id !== firebaseUser.uid)) {
        loginWithGoogle(
          firebaseUser.email || 'user@gmail.com',
          firebaseUser.displayName || 'Google User',
          firebaseUser.uid
        );
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  return (
    <>
      <Toaster position="top-right" theme="dark" closeButton />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* Public & Landing Pages */}
          <Route path="/landing" component={LandingPage} />
          <Route path="/login" component={Login} />

          {/* Root Path: LandingPage for visitors, Dashboard for logged in users */}
          <Route path="/">
            {!user ? <LandingPage /> : <AppLayout><Dashboard /></AppLayout>}
          </Route>
          <Route path="/portfolio">
            {!user ? <Redirect to="/login" /> : <AppLayout><Portfolio /></AppLayout>}
          </Route>
          <Route path="/compare">
            {!user ? <Redirect to="/login" /> : <AppLayout><Compare /></AppLayout>}
          </Route>
          <Route path="/backtest">
            {!user ? <Redirect to="/login" /> : <AppLayout><Backtest /></AppLayout>}
          </Route>
          <Route path="/optimize">
            {!user ? <Redirect to="/login" /> : <AppLayout><Optimizer /></AppLayout>}
          </Route>
          <Route path="/strategies">
            {!user ? <Redirect to="/login" /> : <AppLayout><Strategies /></AppLayout>}
          </Route>
          <Route path="/analytics">
            {!user ? <Redirect to="/login" /> : <AppLayout><Analytics /></AppLayout>}
          </Route>
          <Route path="/stock-analysis">
            {!user ? <Redirect to="/login" /> : <AppLayout><StockAnalysis /></AppLayout>}
          </Route>
          <Route path="/news">
            {!user ? <Redirect to="/login" /> : <AppLayout><MarketNews /></AppLayout>}
          </Route>
          <Route path="/universe">
            {!user ? <Redirect to="/login" /> : <AppLayout><UniversePage /></AppLayout>}
          </Route>
          <Route path="/risk">
            {!user ? <Redirect to="/login" /> : <AppLayout><Risk /></AppLayout>}
          </Route>
          <Route path="/alerts">
            {!user ? <Redirect to="/login" /> : <AppLayout><Alerts /></AppLayout>}
          </Route>
          <Route path="/admin">
            <AdminProtectedRoute>
              <AppLayout><Admin /></AppLayout>
            </AdminProtectedRoute>
          </Route>
          <Route path="/settings">
            {!user ? <Redirect to="/login" /> : <AppLayout><Settings /></AppLayout>}
          </Route>
          <Route path="/ai">
            {!user ? <Redirect to="/login" /> : <AppLayout><AiManager /></AppLayout>}
          </Route>

          {/* Dynamic ticker detail route */}
          <Route path="/ticker/:symbol">
            {(params) => !user ? <Redirect to="/login" /> : <AppLayout><TickerDetail params={params} /></AppLayout>}
          </Route>

          {/* Dedicated Standalone Full Chart Workspace Route */}
          <Route path="/full-chart/:symbol">
            {(params) => !user ? <Redirect to="/login" /> : <AppLayout><FullChart params={params} /></AppLayout>}
          </Route>

          {/* Catch-all 404 Route */}
          <Route>
            {!user ? <Redirect to="/login" /> : <AppLayout><NotFound /></AppLayout>}
          </Route>
        </Switch>
      </Suspense>
    </>
  );
}
