import styled from '@emotion/styled';
import Button from 'monday-ui-react-core/dist/Button';
import ExpandCollapse from 'monday-ui-react-core/dist/ExpandCollapse';
import Heading from 'monday-ui-react-core/dist/Heading';
import Tooltip from 'monday-ui-react-core/dist/Tooltip';
import EditUserProfile from '../../../components/EditUserProfile';
import HLoading from '../../../components/HLoading';
import UserCalendar from '../../../components/UserCalendar';

export const Loading = styled(HLoading)`
  height: 2rem;
  width: 2rem;

  margin: 0 auto;
`;

export const Legends = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1rem;

  max-width: 1280px;
`

export const LegendItem = styled.div`
  display: flex;

  align-items: center;
  
  margin-right: .75rem;
  margin-left: .75rem;
  margin-bottom: .5rem;
  
  font-size: .8rem;
`

export const LegendItemColor = styled.span`
  height: 1rem;
  width: 1rem;

  margin-right: .5rem;

  background-color: ${props => props.color};
`

export const Section = styled.section`
  display: flex;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: 0 auto;
`;

export const Calendars = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    padding-right: 1rem;

    width: 60%;
  }
`;

export const Items = styled.div`
  width: 100%;

  padding-left: .5rem;
  padding-right: .5rem;

  @media (min-width: 768px) {
    padding-left: 1rem;
    padding-right: 0;

    width: 40%;
  }
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

  margin-bottom: 1rem;
`;

export const ItemButtonText = styled.p`
  display: block;

  height: 100%;
  max-width: calc(100% - 2rem);

  text-align: center;

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

export const UserNameContainer = styled.div``
export const HeaderText = styled(Heading)``
export const EditProfile = styled(EditUserProfile)``

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

