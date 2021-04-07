import { ReactElement } from 'react';
import h4ad from '../../../components/UserCalendar/examples/h4ad.json';

import * as S from './styles';

function BoardStatisticReports(): ReactElement {
  return (
    <S.Section>
      <S.UserStatistic>
        <S.UserName type="h2" value="H4ad"/>
        <S.Calendar data={h4ad} fullYear={false}/>
      </S.UserStatistic>
    </S.Section>
  )
}

export default BoardStatisticReports;
