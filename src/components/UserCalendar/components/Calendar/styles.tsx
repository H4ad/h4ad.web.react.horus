import styled from '@emotion/styled';

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

export const Loading = styled.p`
  margin: 0;
  font-size: 90%;
`;

export const SVGGraph = styled.svg`
  max-width: 100%;
  height: auto;
  margin-bottom: 0.25rem;
  overflow: visible;
`;
