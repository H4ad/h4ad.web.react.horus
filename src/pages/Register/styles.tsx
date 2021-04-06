import styled from '@emotion/styled';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { NavLink } from 'react-router-dom';
import HButton from '../../components/HButton';
import HInput from '../../components/HInput';

export const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  background-color: ${props => props.theme.colors.light500};
`;

export const AntdCard = styled(Card)`
  border-radius: 16px;
  
  width: 22rem;
  
  padding: 1.2rem;
`

export const AntdForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h1`
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: bold;
  
  color: ${props => props.theme.colors.primaryContrast500};
`

export const SubTitle = styled.h2`
  margin-top: .5rem;
  margin-bottom: 1rem;
  
  font-size: 1rem;
  line-height: 1.5rem;
  
  color: ${props => props.theme.colors.primaryContrast500};
`

export const AntFormItem = styled(FormItem)`
  margin-top: 1rem;

  width: 100%;
`

export const Input = styled(HInput)``

export const Button = styled(HButton)`  
  min-width: 8rem;
`

export const ForgotPassword = styled.p`
  margin-top: 1.5rem;

  font-size: 1rem;
  color: ${props => props.theme.colors.primaryContrast500};
`

export const Link = styled(NavLink)``
