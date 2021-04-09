import Button from 'monday-ui-react-core/dist/Button';
import { ReactElement, useMemo } from 'react';
import { useQuery } from 'react-query';
import { MondayUser } from '../../../models/proxies/monday';
import { getBoardsInfoForBoardStatistic, getUserInfoByIds } from '../../../services/monday';
import useMondayStore from '../../../store/useMonday';
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

  const {
    isFetching,
    data,
  } = useQuery(['boards', boardIds], () => getBoardsInfoForBoardStatistic(monday, boardIds, settings));

  const [userIds, calendarDatas] = useMemo(() => !!data ? getCalendarDataFromMondayQuery(data, settings) : [[], []], [data, settings]);

  const {
    isFetching: isFetchingUsers,
    data: users,
  } = useQuery(['users', userIds], () => getUserInfoByIds(monday, userIds));

  const userIdToUser = useMemo<Record<string, MondayUser>>(() => users?.reduce((acc, user) => {
    acc[user.id] = user;

    return acc;
  }, {}) || {}, [users]);

  return (
    <S.Section>
      <S.Calendars>
        {calendarDatas.map(calendarData => {
          const user = userIdToUser[calendarData.userId];

          if (!user)
            return 'Loading...';

          return (
            <S.UserStatistic key={calendarData.userId}>
              <S.User>
                <S.UserPhoto src={user.photo_thumb_small} alt={user.name}/>
                <S.UserName type="h2" value={user.name}/>
              </S.User>
              <S.Calendar years={calendarData.yearsNumbers}
                          onChangeSelectedDays={(newData) => onChangeSelectedDay(user, newData)}
                          data={calendarData}
                          fullYear={false}/>
            </S.UserStatistic>
          );
        })}
      </S.Calendars>
      <S.Items>
        {Object.keys(selectedDays).map(day => {
          return (
            <S.ItemGroup key={`itemGroup_${day}`}
                         headerComponentRenderer={() => <S.ItemGroupHeader type="h3" value={day}/>}>
              {Object.keys(selectedDays[day]).map(userId => (
                selectedDays[day][userId].items.map(item => {
                  const user = userIdToUser[userId];

                  const time = getTimeTrackingLogsFromItem(item, settings.timeTrackingColumnId)
                    .reduce((acc, log) => acc + log.time, 0);

                  return (
                    <S.ItemButtonTooltip key={`itemGroup_${item.id}`} content={item.name}>
                      <S.ItemButton kind={Button.kinds.TERTIARY}
                                    onClick={() => openItemCard(+item.id)}>
                        <S.UserPhoto src={user.photo_thumb_small} alt={user.name}/>
                        <S.ItemButtonText>({getFormattedHours(time)}) - {item.name}</S.ItemButtonText>
                      </S.ItemButton>
                    </S.ItemButtonTooltip>
                  )
                })
              ))}
            </S.ItemGroup>
          )
        })}
      </S.Items>
    </S.Section>
  )
}

export default BoardStatisticReports;
