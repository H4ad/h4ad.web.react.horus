import React, { ReactElement, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import BoardStatistic from './pages/BoardStatistic';

function AppRouting(): ReactElement | null {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/board/statistic"/>
        </Route>

        <Route path="/board/statistic">
          <BoardStatistic/>
        </Route>

        <Route default>
          <Redirect to="/login"/>
        </Route>
      </Switch>
    </Suspense>
  );
}

export default AppRouting;
