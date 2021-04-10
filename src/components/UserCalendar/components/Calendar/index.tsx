import format from 'date-fns/format';
import getYear from 'date-fns/getYear';
import parseISO from 'date-fns/parseISO';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ColorInput } from 'tinycolor2';
import { UserProxy } from '../../../../models/proxies/user.proxy';
import { getFormattedHoursExtended } from '../../../../utils/hours';
import { usePrevious } from '../../hooks/usePrevious';
import { Block, CalendarData, CalendarDataContributionItem, getProcessGraphData, GraphData } from '../../services/contributions';
import { createCalendarTheme, getClassName } from '../../utils';

import { DEFAULT_THEME, LINE_HEIGHT, MIN_DISTANCE_MONTH_LABELS, Theme } from '../../utils/constants';
import { getLevelByHourAndUser } from './functions';

import * as S from './styles';

export type Props = {
  data: CalendarData;
  user: UserProxy;
  className?: string;
  blockMargin?: number;
  blockSize?: number;
  color?: ColorInput;
  dateFormat?: string;
  fontSize?: number;
  fullYear?: boolean;
  showTotalCount?: boolean;
  theme?: Theme;
  years?: Array<number>;
  onChangeSelectedDays?: (user: UserProxy, days: Record<string, CalendarDataContributionItem>) => void;
};

const UserCalendar: React.FC<Props> = ({
                                           className,
                                           data,
                                           user,
                                           blockMargin = 2,
                                           blockSize = 12,
                                           children,
                                           color = undefined,
                                           dateFormat = 'MMM d, yyyy',
                                           fontSize = 14,
                                           fullYear = true,
                                           showTotalCount = true,
                                           theme = undefined,
                                           onChangeSelectedDays = undefined,
                                           years = [Number(format(new Date(), 'yyyy'))],
                                         }) => {
  const [graphs, setGraphs] = useState<Array<GraphData> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDays, setSelectedDays] = useState<Record<string, CalendarDataContributionItem>>({});

  const prevYears = usePrevious(years);
  const prevData = usePrevious(data);
  const prevFullYear = usePrevious(fullYear);
  const prevOnChangeSelectedDays = useRef(onChangeSelectedDays);

  const fetchData = useCallback(() => {
    setError(null);

    getProcessGraphData({
      years,
      data,
      lastYear: fullYear,
    })
      .then(setGraphs)
      .catch(setError);
  }, [years, data, fullYear]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  // Refetch if relevant props change
  useEffect(() => {
    if (
      prevFullYear !== fullYear ||
      prevData !== data ||
      prevYears.some(y => !years.includes(y))
    ) {
      fetchData();
    }
  }, [fetchData, fullYear, prevFullYear, prevData, prevYears, data, years]);

  useEffect(() => {
    if (!prevOnChangeSelectedDays)
      return;

    prevOnChangeSelectedDays.current(user, selectedDays);
  }, [user, selectedDays]);

  function getTheme(): Theme {
    if (theme) {
      return Object.assign({}, DEFAULT_THEME, theme);
    }

    if (color) {
      return createCalendarTheme(color);
    }

    return DEFAULT_THEME;
  }

  function getDimensions() {
    const textHeight = Math.round(fontSize * LINE_HEIGHT);

    // Since weeks start on Sunday, there is a good chance that the graph starts
    // in the week before January 1st. Therefore, the calendar shows 53 weeks.
    const width = (52 + 1) * (blockSize + blockMargin) - blockMargin;
    const height = textHeight + (blockSize + blockMargin) * 7 - blockMargin;

    return { width, height };
  }

  function getTooltipMessage(day: Required<Block>) {
    const date = parseISO(day.date);

    return `<strong>${getFormattedHoursExtended(day.info.count)}</strong> on ${format(date, dateFormat)}`;
  }

  function renderMonthLabels(monthLabels: GraphData['monthLabels']) {
    const style = {
      fill: getTheme().text,
      fontSize,
    };

    // Remove the first month label if there's not enough space to the next one
    // (end of previous month)
    if (monthLabels[1].x - monthLabels[0].x <= MIN_DISTANCE_MONTH_LABELS) {
      monthLabels.shift();
    }

    return monthLabels.map(month => (
      <text x={(blockSize + blockMargin) * month.x} y={fontSize} key={`monthLabel_${user.id}_${month.x}`} style={style}>
        {month.label}
      </text>
    ));
  }

  function renderBlocks(blocks: GraphData['blocks']) {
    const theme = getTheme();
    const textHeight = Math.round(fontSize * LINE_HEIGHT);

    const onClickInDay = (day: Block) => {
      if (!day.info)
        return;

      if (selectedDays[day.date]) {
        const days = Object.keys(selectedDays)
          .filter(selectedDay => selectedDay !== day.date)
          .reduce((acc, selectedDay) => {
            acc[selectedDay] = selectedDays[selectedDay];

            return acc;
          }, {});

        setSelectedDays(days);
      } else {
        selectedDays[day.date] = day.info;

        setSelectedDays({
          ...selectedDays,
        });
      }
    }

    return blocks
      .map(week =>
        week.map((day, y) => {
          const count = day.info?.count || 0;
          const level = getLevelByHourAndUser(count, user);

          const defaultColor = theme[`grade${level}`];

          return (<Fragment key={`day_${user.id}_${day.date}`}>
            <S.DayRect
              onClick={() => onClickInDay(day)}
              x="0"
              y={textHeight + (blockSize + blockMargin) * y}
              width={blockSize}
              height={blockSize}
              fill={defaultColor}
              hasInfo={!!day.info}
              data-tip={day.info ? getTooltipMessage(day as Required<Block>) : null}
            />

            {day.info && (
              <S.DayRect
                onClick={() => onClickInDay(day)}
                x="2"
                y={textHeight + (blockSize + blockMargin) * y + 2}
                width={(blockSize || 0) * .7}
                height={(blockSize || 0) * .7}
                fill={selectedDays[day.date] ? '#000' : defaultColor}
                data-tip={day.info ? getTooltipMessage(day as Required<Block>) : null}
              />
            )}
          </Fragment>);
        }),
      )
      .map((week, x) => (
        <g key={`week_${user.id}_${x}`} transform={`translate(${(blockSize + blockMargin) * x}, 0)`}>
          {week}
        </g>
      ));
  }

  function renderTotalCount(year: number, totalCount: number) {
    const isCurrentYear = getYear(new Date()) === year;

    return (
      <div className={getClassName('meta')} style={{ fontSize }}>
        {isCurrentYear && fullYear ? 'Last year' : year}
        {' – '}
        {isCurrentYear && !fullYear ? 'So far ' : null}
        {getFormattedHoursExtended(totalCount)}
      </div>
    );
  }

  const { width, height } = getDimensions();

  if (error) {
    console.error(error);

    return <p>Error :(</p>;
  }

  if (!graphs) {
    return <S.Loading key={`graphLoading_${user.id}`}>Loading …</S.Loading>;
  }

  return (
    <S.Calendar className={className}>
      {graphs.map(graph => {
        const { year, blocks, monthLabels, totalCount } = graph;

        return (
          <S.Graph key={`graph_${user.id}_${year}`}>
            <S.SVGGraph
              xmlns="http://www.w3.org/2000/svg"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              style={{ backgroundColor: theme?.background }}>
              {renderMonthLabels(monthLabels)}
              {renderBlocks(blocks)}
            </S.SVGGraph>

            <ReactTooltip delayShow={50} html/>

            {showTotalCount && renderTotalCount(year, totalCount)}
            {children}
          </S.Graph>
        );
      })}
    </S.Calendar>
  );
};

export default UserCalendar;
