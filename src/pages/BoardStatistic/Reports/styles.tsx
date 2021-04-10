import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Button from 'monday-ui-react-core/dist/Button';
import ExpandCollapse from 'monday-ui-react-core/dist/ExpandCollapse';
import Heading from 'monday-ui-react-core/dist/Heading';
import Tooltip from 'monday-ui-react-core/dist/Tooltip';
import HLoading from '../../../components/HLoading';
import UserCalendar from '../../../components/UserCalendar';

export const Loading = styled(HLoading)`
  height: 2rem;
  width: 2rem;
  
  margin: 0 auto;
`;

export const LoadingSVGClassName = css`
  height: 2rem;
  width: 2rem;
  
  margin: 0 auto;
`

export const Section = styled.section`
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
`;

export const Calendars = styled.div`
  width: 60%;

  padding-right: 1rem;
`;

export const Items = styled.div`
  width: 40%;
  
  padding-left: 1rem;
`;

export const ItemGroup = styled(ExpandCollapse)`
  margin-bottom: 1rem;
  width: 100%;
  
  .expand-collapse {
    width: 100%;
  }
`;

export const ItemGroupHeader = styled(Heading)``;

export const ItemButtonTooltip = styled(Tooltip)``;

export const ItemButton = styled(Button)`
  max-width: 100%;
  min-width: 100%;
  display: flex;
  justify-content: flex-start;
  
  margin-bottom: 1rem;
`;

export const ItemButtonText = styled.p`
  display: block;
  
  height: 100%;
  
  max-width: calc(100% - 2rem);
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserStatistic = styled.div`
  margin-bottom: 2rem;
`

export const User = styled.div`
  display: flex;
  
  align-items: center;
`;

export const UserPhoto = styled.img`
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
  
  margin-right: .5rem;
  margin-left: .5rem;
`;

export const UserName = styled(Heading)``

export const Calendar = styled(UserCalendar)`
  margin-top: .5rem;
  margin-left: .5rem;
  max-width: 100%;

  & > div {
    margin-bottom: 1rem;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`

