import React, { ReactElement, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LockPageManager from './components/LockPageManager';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/Login';
import MainPage from './pages/Main';
import RegisterPage from './pages/Register';
import useAuthStore from './store/useAuth';

function AppRouting(): ReactElement | null {
  const isLogged = useAuthStore((state) => state.isLogged);

  if (isLogged === null) return null;

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <LockPageManager />

      <Switch>
        <PublicRoute exact path="/">
          <Redirect to="/login"/>
        </PublicRoute>

        <PublicRoute path="/login">
          <LoginPage/>
        </PublicRoute>

        <PublicRoute path="/register">
          <RegisterPage/>
        </PublicRoute>

        <PrivateRoute path="/main">
          <MainPage/>
        </PrivateRoute>

        <PrivateRoute path="/board/statistic">
          <p>Board Statistic</p>
        </PrivateRoute>

        <Route default>
          <Redirect to="/login"/>
        </Route>
      </Switch>
    </Suspense>
  );
}

export default AppRouting;
