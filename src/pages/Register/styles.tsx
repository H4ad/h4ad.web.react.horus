import styled from '@emotion/styled';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'monday-ui-react-core/dist/Button';
import DialogContentContainer from 'monday-ui-react-core/dist/DialogContentContainer';
import Heading from 'monday-ui-react-core/dist/Heading';
import Input from 'monday-ui-react-core/dist/TextField';
import { NavLink } from 'react-router-dom';

export const Page = styled.main`
  min-height: 100vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.theme.colors.light500};
`;

export const Card = styled(DialogContentContainer)`
  border-radius: 16px;

  width: 22rem;

  padding: 2rem;
`

export const AntdForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled(Heading)`
  color: ${props => props.theme.colors.primaryContrast500};
`

export const SubTitle = styled(Heading)`
  margin-top: .5rem;
  margin-bottom: 1rem;

  color: ${props => props.theme.colors.primaryContrast500};
`

export const AntFormItem = styled(FormItem)`
  width: 100%;
`

export const NameInput = styled(Input)``
export const EmailInput = styled(Input)``
export const PasswordInput = styled(Input)``

export const RegisterButton = styled(Button)`
  min-width: 8rem;
`

export const ForgotPassword = styled.p`
  margin-top: 1.5rem;

  font-size: 1rem;
  color: ${props => props.theme.colors.primaryContrast500};
`

export const Link = styled(NavLink)``
