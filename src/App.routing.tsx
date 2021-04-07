import React, { ReactElement, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LockPageManager from './components/LockPageManager';
import PublicRoute from './components/PublicRoute';
import BoardStatistic from './pages/BoardStatistic';
import useAuthStore from './store/useAuth';

function AppRouting(): ReactElement | null {
  const isLogged = useAuthStore((state) => state.isLogged);

  if (isLogged === null) return null;

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <LockPageManager />

      <Switch>
        <PublicRoute exact path="/">
          <Redirect to="/board/statistic"/>
        </PublicRoute>

        <PublicRoute path="/board/statistic">
          <BoardStatistic/>
        </PublicRoute>

        <Route default>
          <Redirect to="/login"/>
        </Route>
      </Switch>
    </Suspense>
  );
}

export default AppRouting;
