import Button from 'monday-ui-react-core/dist/Button';
import { ReactElement, useMemo } from 'react';
import useMondayStore from '../../../store/useMonday';
import { getColumnsStoreInList } from '../../../store/useMonday/functions';
import useUserStore from '../../../store/useUser';
import { exportDataByType } from '../../../utils/export';
import { getFormattedHours } from '../../../utils/hours';
import { getTimeTrackingLogsFromItem } from '../../../utils/monday';
import { getDefaultUserIfNotLoading } from './functions';

import * as S from './styles';

function CalendarBlock({ isLoading, userId, usersMap, calendarData, onChangeSelectedDay }): ReactElement {
  const user = useMemo(() => getDefaultUserIfNotLoading(isLoading, userId, usersMap[userId]), [usersMap, userId, isLoading]);

  if (!user)
    return null;

  return (
    <S.UserStatistic key={`userStatistic_${user.id}`}>
      <S.User>
        <S.UserPhoto src={user.photo_thumb_small} alt={user.name}/>

        <S.UserNameContainer>
          <S.HeaderText type="h2" value={user.name}/>
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
}

function BoardStatisticReports(): ReactElement {
  const openItemCard = useMondayStore(state => state.openItemCard);

  const alreadySelectedBoard = useMondayStore(state => state.boardIds.length > 0);
  const timeTrackingColumnList = useMondayStore(state => getColumnsStoreInList(state.settings.timeTrackingColumnId));
  const personColumnList = useMondayStore(state => getColumnsStoreInList(state.settings.personColumnId));

  const isLoadingData = useMondayStore(state => state.isLoadingData);
  const calendars = useMondayStore(state => state.calendars);

  const selectedDays = useMondayStore(state => state.selectedDays);
  const onChangeSelectedDay = useMondayStore(state => state.onChangeSelectedDay);

  const settings = useMondayStore(state => state.settings);

  const usersMap = useUserStore(state => state.usersMap);

  const listByDays = Object.keys(selectedDays).sort((a, b) => a > b ? 1 : -1);

  if (!alreadySelectedBoard)
    return <S.HeaderText type="h2" value="Sorry, you need to select the board first."/>

  if (timeTrackingColumnList.length === 0)
    return <S.HeaderText type="h2"
                         value="Sorry, the columns of Time Tracking is missing, please, select these columns first."/>

  if (personColumnList.length === 0)
    return <S.HeaderText type="h2"
                         value="Sorry, the columns of Person is missing, please, select these columns first."/>

  return (<>
    {(isLoadingData) && (
      <S.Loading/>
    )}

    <S.Section>
      <S.Calendars>
        {calendars.map(calendarData => <CalendarBlock key={`calendarBlock_${calendarData.userId}`}
                                                      calendarData={calendarData} usersMap={usersMap}
                                                      userId={calendarData.userId}
                                                      onChangeSelectedDay={onChangeSelectedDay}
                                                      isLoading={isLoadingData}/>)}
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

                  const timeTrackingColumn = settings.timeTrackingColumnId[item.boardId] || settings.timeTrackingColumnId.default;

                  const time = getTimeTrackingLogsFromItem(item, timeTrackingColumn)
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
