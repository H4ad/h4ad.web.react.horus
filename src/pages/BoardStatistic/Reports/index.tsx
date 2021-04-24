import { Empty } from 'antd';
import Button from 'monday-ui-react-core/dist/Button';
import { ReactElement, useMemo } from 'react';
import { CalendarDataContributionItem, CalendarDataContributionItems } from '../../../components/UserCalendar/services/contributions';
import { DEFAULT_THEME } from '../../../components/UserCalendar/utils/constants';
import { UserProxy } from '../../../models/proxies/user.proxy';
import useMondayStore from '../../../store/useMonday';
import { getColumnsStoreInList } from '../../../store/useMonday/functions';
import useUserStore from '../../../store/useUser';
import { exportDataByType } from '../../../utils/export';
import { getFormattedHoursExtended, getFormattedRange } from '../../../utils/hours';
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

type SelectedDayGroupItemProps = {
  userIds: number[],
  usersMap: Record<number, UserProxy>,
  selectedDay: Record<string, CalendarDataContributionItem>,
};

function SelectedDayGroupItem({ userIds, usersMap, selectedDay }: SelectedDayGroupItemProps): ReactElement {
  const openItemCard = useMondayStore(state => state.openItemCard);

  const groupedData = useMemo(() => {
    type GroupedItem = CalendarDataContributionItems & { user: UserProxy };

    const allItems = userIds.reduce((acc, userId) => [...acc, ...selectedDay[userId].items.map(item =>
      ({
        ...item,
        user: getDefaultUserIfNotLoading(false, userId, usersMap[userId]),
      }),
    )], []);

    const groups: { boardName: string, items: GroupedItem[] }[] = [];

    let lastGroupName = '';

    const sortedItems = allItems.sort((a, b) => {
      return +new Date(a.task.startedAt) - +new Date(b.task.startedAt)
    });

    for (const item of sortedItems) {
      if (item.task.boardName === lastGroupName) {
        groups[groups.length - 1].items.push(item);

        continue;
      }

      lastGroupName = item.task.boardName;

      groups.push({
        boardName: item.task.boardName,
        items: [item],
      })
    }

    return groups;
  }, [userIds, usersMap, selectedDay])

  return (
    <>
      {groupedData.map(itemGroup => {
        return (<div key={Math.random().toString(16)}>
          <S.HeaderText type="h4" value={itemGroup.boardName}/>

          {itemGroup.items.map(item => {
            return (
              <S.ItemButtonTooltip key={`itemGroup_${item.id}`} content={item.name} position="left">
                <S.ItemButton kind={Button.kinds.TERTIARY}
                              onClick={() => openItemCard(+item.id)}>
                  <S.UserPhoto src={item.user.photo_thumb_small} alt={item.user.name}/>
                  <S.ItemButtonText>
                    {getFormattedRange(item.task.startedAt, item.task.endedAt)}
                    <br/>
                    {getFormattedHoursExtended(item.task.time)}
                    <br/>
                    {item.name}
                  </S.ItemButtonText>
                </S.ItemButton>
              </S.ItemButtonTooltip>
            );
          })}
        </div>)
      })}
    </>
  );
}

function BoardStatisticReports(): ReactElement {
  const alreadySelectedBoard = useMondayStore(state => state.boardIds.length > 0);
  const timeTrackingColumnList = useMondayStore(state => getColumnsStoreInList(state.settings.timeTrackingColumnId));
  const personColumnList = useMondayStore(state => getColumnsStoreInList(state.settings.personColumnId));

  const isLoadingData = useMondayStore(state => state.isLoadingData);
  const calendars = useMondayStore(state => state.calendars);

  const selectedDays = useMondayStore(state => state.selectedDays);
  const onChangeSelectedDay = useMondayStore(state => state.onChangeSelectedDay);

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

    <S.Legends>
      <S.LegendItem>
        <S.LegendItemColor color={DEFAULT_THEME.grade0}/>

        <S.ItemButtonTooltip content="No time registered">
          <span>No time registered</span>
        </S.ItemButtonTooltip>
      </S.LegendItem>

      <S.LegendItem>
        <S.LegendItemColor color={DEFAULT_THEME.grade1}/>

        <S.ItemButtonTooltip content="Less than specified working time">
          <span>Time is {'<'} Work Time</span>
        </S.ItemButtonTooltip>
      </S.LegendItem>

      <S.LegendItem>
        <S.LegendItemColor color={DEFAULT_THEME.grade2}/>

        <S.ItemButtonTooltip content="Working time greater than specified, but not more than 1 hour.">
          <span>Time is {'>'} Work Time and {'<'} +1</span>
        </S.ItemButtonTooltip>
      </S.LegendItem>

      <S.LegendItem>
        <S.LegendItemColor color={DEFAULT_THEME.grade3}/>

        <S.ItemButtonTooltip content="Exceeded in 1 hour of the specified work time">
          <span>Time is {'>'} Work Time +1</span>
        </S.ItemButtonTooltip>
      </S.LegendItem>

      <S.LegendItem>
        <S.LegendItemColor color={DEFAULT_THEME.grade4}/>

        <S.ItemButtonTooltip content="Exceeded in 2 hour of the specified work time">
          <span>Time is {'>'} Work Time +2</span>
        </S.ItemButtonTooltip>
      </S.LegendItem>
    </S.Legends>

    <S.Section>
      <S.Calendars>
        {calendars.map(calendarData => <CalendarBlock key={`calendarBlock_${calendarData.userId}`}
                                                      calendarData={calendarData} usersMap={usersMap}
                                                      userId={calendarData.userId}
                                                      onChangeSelectedDay={onChangeSelectedDay}
                                                      isLoading={isLoadingData}/>)}
      </S.Calendars>
      <S.Items>
        {calendars.length > 0 && listByDays.length === 0 && (
          <Empty description="Try selecting a colorful day on the left to see what happens :)"/>
        )}

        {listByDays.map(day => {
          const userIds = Object.keys(selectedDays[day]).map(Number);

          return (
            <S.ItemGroup key={`itemGroup_${day}`}
                         headerComponentRenderer={() => <S.ItemGroupHeader type="h3" value={day}/>}>
              <SelectedDayGroupItem userIds={userIds}
                                    usersMap={usersMap}
                                    selectedDay={selectedDays[day]}/>
            </S.ItemGroup>
          )
        })}
      </S.Items>
    </S.Section>
  </>)
}

export default BoardStatisticReports;
