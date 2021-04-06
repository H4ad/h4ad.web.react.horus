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
    (cancelToken) => getTokenProxyFromAPI(cancelToken, { username: form.getFieldValue('email'), password: form.getFieldValue('password') }),
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
      <S.AntdCard>
        <S.AntdForm layout="vertical" form={form} onFinish={createUserMutate} hideRequiredMark>
          <S.Title>Horus</S.Title>
          <S.SubTitle>Hello! Please fill in the fields below.</S.SubTitle>

          <S.AntFormItem
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'You need to fill your name.',
              }
            ]}>
            <S.Input placeholder="Enter your name"
                     type="text" />
          </S.AntFormItem>

          <S.AntFormItem
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'You need to fill your email.',
              }
            ]}>
          <S.Input placeholder="Enter your email"
                   type="email"/>
          </S.AntFormItem>

          <S.AntFormItem
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'You need to fill your password.',
              },
            ]}>
          <S.Input placeholder="Enter your password"
                   name="password"
                   type="password"/>
          </S.AntFormItem>

          <S.Button loading={isLoading}
                    htmlType="submit"
                    type="primary">Register</S.Button>

          <S.ForgotPassword>Already have an account? <S.Link to="/login">Login</S.Link></S.ForgotPassword>
        </S.AntdForm>
      </S.AntdCard>
    </S.Page>
  )
}

export default RegisterPage;
