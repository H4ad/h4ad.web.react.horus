import styled from '@emotion/styled';
import Button from 'monday-ui-react-core/dist/Button';
import Icon from 'monday-ui-react-core/dist/Icon';
import ResponsiveList from 'monday-ui-react-core/dist/ResponsiveList';

export const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  
  background-color: ${props => props.theme.colors.light500};
  
  padding-top: 5rem;
`;

export const Tab = styled(ResponsiveList)`  
  display: flex;
  justify-content: center;
  
  margin-left: 10%;
  width: 80%;
`

export const Content = styled.div`
  padding: 2rem;
`

export const TabItem = styled(Button)`
  margin: 0 .5rem;
`

export const TabItemIcon = styled(Icon)`
  margin-right: .5rem;
`
