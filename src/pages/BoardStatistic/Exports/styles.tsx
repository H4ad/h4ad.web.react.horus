import styled from '@emotion/styled';
import Button from 'monday-ui-react-core/dist/Button';
import Heading from 'monday-ui-react-core/dist/Heading';
import Icon from 'monday-ui-react-core/dist/Icon';
import HLoading from '../../../components/HLoading';

export const Loading = styled(HLoading)`
  height: 2rem;
  width: 2rem;
  
  margin: 0 auto;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  
  max-width: 1280px;
  margin: 0 auto;
`;

export const Title = styled(Heading)``;

export const ExportButton = styled(Button)`
  width: 12rem;
  
  margin-top: 1rem;
  margin-left: .5rem;
`;

export const ExportButtonIcon = styled(Icon)`
  margin-right: .5rem;
  height: 1.2rem;
  width: 1.2rem;
`
