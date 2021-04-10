import { HTMLAttributes, ReactElement } from 'react';

import * as S from './styles';

function HLoading(props: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <S.Container {...props}>
      <S.Loading />
    </S.Container>
  )
}

export default HLoading;
