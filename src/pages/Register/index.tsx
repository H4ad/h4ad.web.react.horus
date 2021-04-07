import { useForm } from 'antd/lib/form/Form';
import { ReactElement } from 'react';
import useCancellableMutation from '../../hooks/useCancellableMutation';
import { CreateUserPayload } from '../../models/payloads/create-user.payload';
import { UserProxy } from '../../models/proxies/user.proxy';
import { createErrorNotification } from '../../services/notification';
import useAuthStore from '../../store/useAuth';

import * as S from './styles';

function RegisterPage(): ReactElement {
  const [form] = useForm<CreateUserPayload>();

  const getTokenProxyFromAPI = useAuthStore((state) => state.getTokenProxyFromAPI);
  const getInfoAboutCurrentUserFromAPI = useAuthStore((state) => state.getInfoAboutCurrentUserFromAPI);
  const createUserFromAPI = useAuthStore((state) => state.createUserFromAPI);

  const { mutate: getUserMutate, isLoading: isGettingUser } = useCancellableMutation<void, Error>(
    (cancelToken) => getInfoAboutCurrentUserFromAPI(cancelToken),
    {
      onError: (error) => createErrorNotification(error.message),
    },
  );

  const { mutate: getTokenProxyMutate, isLoading: isPerformingLogin } = useCancellableMutation<void, Error>(
    (cancelToken) => getTokenProxyFromAPI(cancelToken, {
      username: form.getFieldValue('email'),
      password: form.getFieldValue('password'),
    }),
    {
      onError: (error) => createErrorNotification(error.message),
      onSuccess: () => getUserMutate(),
    },
  );

  const { mutate: createUserMutate, isLoading: isPerformingCreating } = useCancellableMutation<UserProxy, Error>(
    (cancelToken) => createUserFromAPI(cancelToken, form.getFieldsValue()),
    {
      onError: (error) => createErrorNotification(error.message),
      onSuccess: () => getTokenProxyMutate(),
    },
  );

  const isLoading = isPerformingCreating || isPerformingLogin || isGettingUser;

  return (
    <S.Page>
      <S.Card>
        <S.AntdForm layout="vertical" form={form} onFinish={createUserMutate} hideRequiredMark>
          <S.Title type="h1" value="Horus"/>
          <S.SubTitle type="h4" value="Hello! Please fill in the fields below."/>

          <S.AntFormItem
            name="name"
            rules={[
              {
                required: true,
                message: 'You need to fill your name.',
              },
            ]}>
            <S.NameInput required
                         size="medium"
                         title="Name"
                         clearOnIconClick={true}
                         placeholder="Enter your name"
                         type="text"/>
          </S.AntFormItem>

          <S.AntFormItem
            name="email"
            rules={[
              {
                required: true,
                message: 'You need to fill your email.',
              },
            ]}>
            <S.EmailInput required
                          size="medium"
                          title="Email"
                          clearOnIconClick={true}
                          placeholder="Enter your email"
                          type="email"/>
          </S.AntFormItem>

          <S.AntFormItem
            name="password"
            rules={[
              {
                required: true,
                message: 'You need to fill your password.',
              },
            ]}>
            <S.PasswordInput required
                             size="medium"
                             title="Password"
                             clearOnIconClick={true}
                             placeholder="Enter your password"
                             name="password"
                             type="password"/>
          </S.AntFormItem>

          <S.RegisterButton loading={isLoading}
                            type="submit">Register</S.RegisterButton>

          <S.ForgotPassword>Already have an account? <S.Link to="/login">Login</S.Link></S.ForgotPassword>
        </S.AntdForm>
      </S.Card>
    </S.Page>
  )
}

export default RegisterPage;
