import React, { ReactElement, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

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
      <BrowserRouter>
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

          <Route default>
            <Redirect to="/login"/>
          </Route>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}

export default AppRouting;
