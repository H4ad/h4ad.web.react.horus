import { ModalProps } from 'antd';
import { ReactElement } from 'react';

import * as S from './styles'

export type HModalProps = ModalProps & { backgroundColor?: string, children?: ReactElement };

function HModal({ onCancel, children, backgroundColor = '#FFF', ...props }: HModalProps) {
  return (
    <S.AntdModal
      onCancel={onCancel}
      maskClosable={true}
      modalRender={() => (
        <S.ModalContent hasCloseButton={!!onCancel} backgroundColor={backgroundColor}>
          {onCancel && (
            <S.CloseButton onClick={onCancel}/>
          )}

          {children}
        </S.ModalContent>
      )}
      {...props}
    />
  )
}

export default HModal
