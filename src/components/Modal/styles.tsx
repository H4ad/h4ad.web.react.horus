import styled from '@emotion/styled'
import Modal from 'antd/lib/modal'
import iconClose from '../../assets/images/icon-close.svg';

export const AntdModal = styled(Modal)`
  pointer-events: auto;
`

export const ModalContent = styled.div<{ hasCloseButton: boolean, backgroundColor: string }>`
  width: 100%;
  
  padding: ${props => props.hasCloseButton ? '3rem' : '2rem'} 2rem 2rem 2rem;

  background-color: ${props => props.backgroundColor};

  box-shadow: 0px 4px 10px rgb(0 0 0 / 12%);
  border-radius: 20px;
`

export const CloseButton = styled.button`
  outline: none;
  border: none;
  appearance: none;

  top: 1.5rem;
  right: 1.5rem;
  position: absolute;

  height: 1.3rem;
  width: 1.3rem;

  background-image: url("${iconClose}");
  background-size: 100% 100%;
  background-color: transparent;

  cursor: pointer;
`
