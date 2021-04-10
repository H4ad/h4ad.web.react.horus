import Button from 'monday-ui-react-core/dist/Button';
import IconEmbed from 'monday-ui-react-core/dist/icons/Embed';
import IconGraph from 'monday-ui-react-core/dist/icons/Graph';
import { ReactElement } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import BoardStatisticExports from './Exports';
import BoardStatisticReports from './Reports';

import * as S from './styles';

function BoardStatistic(): ReactElement {
  const history = useHistory();
  const location = useLocation();

  const getButtonKindForPath = path => location.pathname.endsWith(path) ? Button.kinds.SECONDARY : Button.kinds.TERTIARY;
  const redirectTo = (path) => () => history.push(`/board/statistic/${path}`);

  return (
    <S.Page>
      <S.Tab menuButtonSize="40">
        <S.TabItem onClick={redirectTo('reports')} kind={getButtonKindForPath('reports')}>
          <S.TabItemIcon icon={IconGraph} ignoreFocusStyle/>
          Reports
        </S.TabItem>

        <S.TabItem onClick={redirectTo('export')} kind={getButtonKindForPath('export')}>
          <S.TabItemIcon icon={IconEmbed} ignoreFocusStyle/>
          Export
        </S.TabItem>
      </S.Tab>

      <S.Content>
        <Switch>
          <Route exact path="/">
            <Redirect to="/board/statistic/reports"/>
          </Route>

          <Route path="/board/statistic/reports">
            <BoardStatisticReports/>
          </Route>

          <Route path="/board/statistic/export">
            <BoardStatisticExports/>
          </Route>

          <Route default>
            <Redirect to="/board/statistic/reports"/>
          </Route>
        </Switch>
      </S.Content>
    </S.Page>
  )
}

export default BoardStatistic;
