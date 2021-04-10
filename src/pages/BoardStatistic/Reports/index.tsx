import { ReactElement } from 'react';
import Button from 'monday-ui-react-core/dist/Button';
import useMondayStore from '../../../store/useMonday';
import useUserStore from '../../../store/useUser';
import { getFormattedHours } from '../../../utils/hours';
import { getTimeTrackingLogsFromItem } from '../../../utils/monday';
import { exportDataByType } from './functions';

import * as S from './styles';

function BoardStatisticReports(): ReactElement {
  const openItemCard = useMondayStore(state => state.openItemCard);

  const alreadySelectedBoard = useMondayStore(state => state.boardIds.length > 0);
  const alreadySelectedColumns = useMondayStore(state => !!state.settings?.timeTrackingColumnId && !!state.settings.personColumnId);

  const isLoadingData = useMondayStore(state => state.isLoadingData);
  const calendars = useMondayStore(state => state.calendars);

  const selectedDays = useMondayStore(state => state.selectedDays);
  const onChangeSelectedDay = useMondayStore(state => state.onChangeSelectedDay);

  const settings = useMondayStore(state => state.settings);

  const usersMap = useUserStore(state => state.usersMap);

  const listByDays = Object.keys(selectedDays).sort((a, b) => a > b ? 1 : -1);

  if (!alreadySelectedBoard)
    return <S.H2>Sorry, you need to select the board first.</S.H2>

  if (!alreadySelectedColumns)
    return <S.H2>Sorry, the columns of Person or Time Tracking is missing, please, select these columns first.</S.H2>

  return (<>
    {(isLoadingData) && (
      <S.Loading/>
    )}

    <S.Section>
      <S.Calendars>
        {calendars.map(calendarData => {
          const user = usersMap[calendarData.userId];

          if (!user)
            return <S.Loading key={`userStatisticLoading_${calendarData.userId}`}/>;

          return (
            <S.UserStatistic key={`userStatistic_${user.id}`}>
              <S.User>
                <S.UserPhoto src={user.photo_thumb_small} alt={user.name}/>

                <S.UserNameContainer>
                  <S.H2 type="h2" value={user.name}/>
                </S.UserNameContainer>

                <S.EditProfile user={user} onClickToExport={type => exportDataByType(type, [user], [calendarData])}/>
              </S.User>
              <S.Calendar key={`userStatisticCalendar_${calendarData.userId}`}
                          years={calendarData.yearsNumbers}
                          user={user}
                          onChangeSelectedDays={onChangeSelectedDay}
                          data={calendarData}
                          fullYear={false}/>
            </S.UserStatistic>
          );
        })}
      </S.Calendars>
      <S.Items>
        {listByDays.map(day => {
          const userIds = Object.keys(selectedDays[day]);

          return (
            <S.ItemGroup key={`itemGroup_${day}`}
                         headerComponentRenderer={() => <S.ItemGroupHeader type="h3" value={day}/>}>
              {userIds.map(userId => {
                const dayInfo = selectedDays[day][userId];

                return dayInfo.items.map(item => {
                  const user = usersMap[userId];

                  const time = getTimeTrackingLogsFromItem(item, settings.timeTrackingColumnId)
                    .reduce((acc, log) => {
                      if (log.startedAt.startsWith(day))
                        return acc + log.time;

                      return acc;
                    }, 0);

                  return (
                    <S.ItemButtonTooltip key={`itemGroup_${item.id}`} content={item.name}>
                      <S.ItemButton kind={Button.kinds.TERTIARY}
                                    onClick={() => openItemCard(+item.id)}>
                        <S.UserPhoto src={user.photo_thumb_small} alt={user.name}/>
                        <S.ItemButtonText>({getFormattedHours(time)}) - {item.name}</S.ItemButtonText>
                      </S.ItemButton>
                    </S.ItemButtonTooltip>
                  );
                });
              })}
            </S.ItemGroup>
          )
        })}
      </S.Items>
    </S.Section>
  </>)
}

export default BoardStatisticReports;
