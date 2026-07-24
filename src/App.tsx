/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { useAppStore } from './stores';
import { AppLayout } from './AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Compare } from './pages/Compare';
import { Backtest } from './pages/Backtest';
import { Optimizer } from './pages/Optimizer';
import { Strategies } from './pages/Strategies';
import { Analytics } from './pages/Analytics';
import { UniversePage } from './pages/Universe';
import { StockAnalysis } from './pages/StockAnalysis';
import { MarketNews } from './pages/MarketNews';
import { Risk } from './pages/Risk';
import { Alerts } from './pages/Alerts';
import { Admin } from './pages/Admin';
import { Settings } from './pages/Settings';
import { TickerDetail } from './pages/TickerDetail';
import { NotFound } from './pages/NotFound';
import { Toaster } from 'sonner';

export default function App() {
  const { user, fetchInitialData } = useAppStore();

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  return (
    <>
      <Toaster position="top-right" theme="dark" closeButton />
      <Switch>
        {/* Unauthenticated Auth Path */}
        <Route path="/login" component={Login} />

        {/* Authenticated Paths Group with guards */}
        <Route path="/">
          {!user ? <Redirect to="/login" /> : <AppLayout><Dashboard /></AppLayout>}
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
          {!user ? <Redirect to="/login" /> : <AppLayout><Admin /></AppLayout>}
        </Route>
        <Route path="/settings">
          {!user ? <Redirect to="/login" /> : <AppLayout><Settings /></AppLayout>}
        </Route>

        {/* Dynamic ticker detail route */}
        <Route path="/ticker/:symbol">
          {(params) => !user ? <Redirect to="/login" /> : <AppLayout><TickerDetail params={params} /></AppLayout>}
        </Route>

        {/* Catch-all 404 Route */}
        <Route>
          {!user ? <Redirect to="/login" /> : <AppLayout><NotFound /></AppLayout>}
        </Route>
      </Switch>
    </>
  );
}
