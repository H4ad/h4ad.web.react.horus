import { InputProps } from 'antd';
import { ReactElement } from 'react';

import * as S from './styles';

function HInput(props: InputProps): ReactElement {
  return <S.AntdInput {...props}/>
}

export default HInput;
