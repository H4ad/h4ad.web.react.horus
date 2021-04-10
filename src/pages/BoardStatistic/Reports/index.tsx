import { ReactElement, useMemo } from 'react';
import { useQuery } from 'react-query';
import Button from 'monday-ui-react-core/dist/Button';
import { getBoardsInfoForBoardStatistic } from '../../../services/monday';
import useMondayStore from '../../../store/useMonday';
import useUserStore from '../../../store/useUser';
import { getFormattedHours } from '../../../utils/hours';
import { getTimeTrackingLogsFromItem } from '../../../utils/monday';
import { getCalendarDataFromMondayQuery } from './functions';

import * as S from './styles';

function BoardStatisticReports(): ReactElement {
  const monday = useMondayStore(state => state.monday);
  const boardIds = useMondayStore(state => state.boardIds);
  const openItemCard = useMondayStore(state => state.openItemCard);

  const selectedDays = useMondayStore(state => state.selectedDays);
  const onChangeSelectedDay = useMondayStore(state => state.onChangeSelectedDay);

  const settings = useMondayStore(state => state.settings);

  const usersMap = useUserStore(state => state.usersMap);
  const fetchUsersByIds = useUserStore(state => state.fetchUsersByIds);

  const { isFetching, data } = useQuery(['boards', boardIds], () => getBoardsInfoForBoardStatistic(monday, boardIds, settings));

  const [userIds, calendarDatas] = useMemo(() => !!data ? getCalendarDataFromMondayQuery(data, settings) : [[], []], [data, settings]);

  useQuery(['users', userIds], () => fetchUsersByIds(userIds));

  const listByDays = Object.keys(selectedDays).sort((a, b) => a > b ? 1 : -1);

  return (<>
    {(isFetching) && (
      <S.Loading/>
    )}

    <S.Section>
      <S.Calendars>
        {calendarDatas.map(calendarData => {
          const user = usersMap[calendarData.userId];

          if (!user)
            return <S.Loading key={`userStatisticLoading_${calendarData.userId}`}/>;

          return (
            <S.UserStatistic key={`userStatistic_${user.id}`}>
              <S.User>
                <S.UserPhoto src={user.photo_thumb_small} alt={user.name}/>

                <S.UserNameContainer>
                  <S.UserName type="h2" value={user.name}/>
                </S.UserNameContainer>

                <S.EditProfile user={user}/>
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
