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
      <S.AntdCard>
        <S.AntdForm layout="vertical" form={form} onFinish={getTokenProxyMutate} hideRequiredMark>
          <S.Title>Horus</S.Title>
          <S.SubTitle>Hello! Log in with your email.</S.SubTitle>

          <S.AntFormItem
            label="Email"
            name="username"
            rules={[
              {
                required: true,
                message: 'You need to fill your email.',
              },
            ]}>
            <S.Input placeholder="Enter your email"
                     type="email"/>
          </S.AntFormItem>

          <S.AntFormItem
            label="Password"
            name="password">
            <S.Input placeholder="Enter your password"
                     name="password"
                     type="password"/>
          </S.AntFormItem>

          <S.Button loading={isLoading}
                    type="primary"
                    htmlType="submit">Login</S.Button>

          <S.ForgotPassword>Don&apos;t have an account? <S.Link to="/register">Register</S.Link></S.ForgotPassword>
        </S.AntdForm>
      </S.AntdCard>
    </S.Page>
  )
}

export default LoginPage;
