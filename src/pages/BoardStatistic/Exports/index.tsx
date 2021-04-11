import IconEmbed from 'monday-ui-react-core/dist/icons/Embed';
import IconNote from 'monday-ui-react-core/dist/icons/Note';
import IconTable from 'monday-ui-react-core/dist/icons/Table';
import { ReactElement } from 'react';
import { MondayExportEnum } from '../../../models/proxies/monday';
import useMondayStore from '../../../store/useMonday';
import useUserStore from '../../../store/useUser';
import { exportDataByType } from '../../../utils/export';

import * as S from './styles';

function BoardStatisticExports(): ReactElement {
  const users = useUserStore(state => state.users);
  const calendars = useMondayStore(state => state.calendars);

  const isLoadingData = useMondayStore(state => state.isLoadingData);

  return (<>
    {(isLoadingData) && (
      <S.Loading/>
    )}

    <S.Section>
      <S.Title type="h2" value="Export entire board"/>

      <S.ExportButton disabled={isLoadingData}
                      onClick={() => exportDataByType(MondayExportEnum.CSV, users, calendars)}>
        <S.ExportButtonIcon icon={IconNote} ignoreFocusStyle/>
        Export in CSV
      </S.ExportButton>

      <S.ExportButton disabled={isLoadingData}
                      onClick={() => exportDataByType(MondayExportEnum.EXCEL, users, calendars)}>
        <S.ExportButtonIcon icon={IconTable} ignoreFocusStyle/>
        Export in Excel
      </S.ExportButton>

      <S.ExportButton disabled={isLoadingData}
                      onClick={() => exportDataByType(MondayExportEnum.JSON, users, calendars)}>
        <S.ExportButtonIcon icon={IconEmbed} ignoreFocusStyle/>
        Export in Json
      </S.ExportButton>
    </S.Section>
  </>)
}

export default BoardStatisticExports;
