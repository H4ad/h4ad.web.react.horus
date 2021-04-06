import React, { ReactElement, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import PublicRoute from './components/PublicRoute';
import useAuthStore from './store/useAuth';

function AppRouting(): ReactElement | null {
  const isLogged = useAuthStore((state) => state.isLogged);

  if (isLogged === null) return null;

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/">
            <p>Página de início</p>
          </PublicRoute>

          <Route default>
            <Redirect to="/"/>
          </Route>
        </Switch>
     </BrowserRouter>
    </Suspense>
  );
}

export default AppRouting;
