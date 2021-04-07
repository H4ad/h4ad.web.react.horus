import { useForm } from 'antd/lib/form/Form';
import { ReactElement } from 'react';
import useCancellableMutation from '../../hooks/useCancellableMutation';
import { CreateUserPayload } from '../../models/payloads/create-user.payload';
import { createErrorNotification } from '../../services/notification';
import useAuthStore from '../../store/useAuth';

import * as S from './styles';

function LoginPage(): ReactElement {
  const [form] = useForm<CreateUserPayload>();

  const getTokenProxyFromAPI = useAuthStore((state) => state.getTokenProxyFromAPI);
  const getInfoAboutCurrentUserFromAPI = useAuthStore((state) => state.getInfoAboutCurrentUserFromAPI);

  const { mutate: getUserMutate, isLoading: isGettingUser } = useCancellableMutation<void, Error>(
    (cancelToken) => getInfoAboutCurrentUserFromAPI(cancelToken),
    {
      onError: (error) => createErrorNotification(error.message),
    },
  );

  const { mutate: getTokenProxyMutate, isLoading: isPerformingLogin } = useCancellableMutation<void, Error>(
    (cancelToken) => getTokenProxyFromAPI(cancelToken, form.getFieldsValue()),
    {
      onError: (error) => createErrorNotification(error.message),
      onSuccess: () => getUserMutate(),
    },
  );

  const isLoading = isGettingUser || isPerformingLogin;

  return (
    <S.Page>
      <S.Card>
        <S.AntdForm layout="vertical" form={form} onFinish={getTokenProxyMutate} hideRequiredMark>
          <S.Title type="h1" value="Horus"/>
          <S.SubTitle type="h4" value="Hello! Log in with your email."/>

          <S.AntFormItem
            name="username"
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

          <S.LoginButton loading={isLoading}
                         type="submit">Login</S.LoginButton>

          <S.ForgotPassword>Don&apos;t have an account? <S.Link to="/register">Register</S.Link></S.ForgotPassword>
        </S.AntdForm>
      </S.Card>
    </S.Page>
  )
}

export default LoginPage;
