import styled from '@emotion/styled';
import HLoading from '../../../HLoading';

export const DayRect = styled.rect<{ hasInfo?: boolean }>`
  ${props => props.hasInfo && `
    cursor: pointer;
  `}
`;

export const Calendar = styled.article`
  max-width: 100%;
`;

export const Graph = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

export const Loading = styled(HLoading)`
  height: 2rem;
  width: 2rem;
  
  margin-top: .5rem;
  margin-left: .5rem;
`;

export const SVGGraph = styled.svg`
  max-width: 100%;
  height: auto;
  margin-bottom: 0.25rem;
  overflow: visible;
`;
