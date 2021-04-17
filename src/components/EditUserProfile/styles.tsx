import styled from '@emotion/styled';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import MenuButton from 'monday-ui-react-core/dist/MenuButton';
import Menu from 'monday-ui-react-core/dist/Menu';
import Button from 'monday-ui-react-core/dist/Button';
import Heading from 'monday-ui-react-core/dist/Heading';
import Icon from 'monday-ui-react-core/dist/Icon';
import Input from 'monday-ui-react-core/dist/TextField';
import HModal from '../Modal';

export const Modal = styled(HModal)`
  width: 30rem;
`;

export const EditMenuButton = styled(MenuButton)``;

export const EditContainer = styled.div`
  height: 2rem;
  width: 2.5rem;
  margin-left: auto;
  
  button {
    height: 100%;
    width: 100%;
  }
`

export const EditMenu = styled(Menu)``;

export const EditButton = styled(Button)`
  margin: 0 .5rem;
`

export const EditButtonIcon = styled(Icon)``

export const Container = styled.div`
  width: 100%;
`;

export const Title = styled(Heading)`
  width: 100%;
  text-align: center;
`;

export const Description = styled.p`
  color: #323338;
  font-size: 1rem;
  margin-bottom: 2rem;
  
  width: 100%;
  text-align: center;
`;

export const AntdForm = styled(Form)`
  width: 100%;
`

export const AntdFormItem = styled(FormItem)`
  width: 100%;
  
  label {
    font-size: 1rem;
    font-weight: 500;
  }
`

export const AntdWorkTimeItem = styled(FormItem)`
  ${AntdFormItem};
  
  margin-bottom: 0;
`

export const SaveButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`;

export const NameInput = styled(Input)``

export const WorkTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  
  & > div {
    width: calc(50% - 1rem);
  }
`

export const WorkTimeHourInput = styled(Input)``
export const WorkTimeMinInput = styled(Input)``

export const Notes = styled.span`
  font-size: .8rem;
  color: ${props => props.theme.colors.light800};
`;
