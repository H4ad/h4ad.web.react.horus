import { ButtonProps } from 'antd';
import { ReactElement } from 'react';

import * as S from './styles';

function HButton(props: ButtonProps): ReactElement {
  return <S.AntdButton {...props}/>
}

export default HButton;
