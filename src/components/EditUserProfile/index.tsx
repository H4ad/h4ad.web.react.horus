import { useForm } from 'antd/lib/form/Form';
import Button from 'monday-ui-react-core/dist/Button';
import IconEdit from 'monday-ui-react-core/dist/icons/Edit';
import { ReactElement, useMemo, useState } from 'react';
import { UserProxy } from '../../models/proxies/user.proxy';
import useUserStore from '../../store/useUser';

import * as S from './styles';

export type UserPopupProfileProps = {
  className?: string;
  user: UserProxy;
}

function fromDateToHour(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}

function EditUserProfile({ user, className }: UserPopupProfileProps): ReactElement {
  const [form] = useForm<{ name: string, workTime: Date }>();

  const [visible, setVisible] = useState(false);
  const updateUserById = useUserStore(state => state.updateUserById);

  const defaultWorkTimeValue = useMemo(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ~~user.workTime, Math.round(user.workTime % 1 * 60))
  }, [user]);

  function onClickSave() {
    const updatedUser = form.getFieldsValue();

    updateUserById(user.id, {
      name: updatedUser.name,
      workTime: fromDateToHour(updatedUser.workTime),
    });

    setVisible(false);
  }

  function onChangeWorkTime(workTime: Date) {
    form.setFields([
      { name: 'workTime', value: workTime },
    ]);

    form.validateFields(['workTime']);
  }

  return (<>
    <S.EditButton className={className} kind={Button.kinds.TERTIARY} onClick={() => setVisible(true)}>
      <S.EditButtonIcon icon={IconEdit} ignoreFocusStyle/>
    </S.EditButton>

    <S.Modal visible={visible}
             onCancel={() => setVisible(false)}>
      <S.AntdForm form={form} onFinish={onClickSave} hideRequiredMark>
        <S.Title type="h2" value="Edit User"/>

        <S.AntdFormItem label="Name"
                        name="name"
                        initialValue={user.name}
                        rules={[
                          { required: true, message: 'You need to enter the name.' },
                        ]}>
          <S.NameInput required
                       size="medium"
                       placeholder="Enter the name"
                       clearOnIconClick={true}
                       type="text"/>
        </S.AntdFormItem>

        <S.AntdWorkTimeItem
          label="Work Time"
          name="workTime"
          initialValue={defaultWorkTimeValue}>
          <S.WorkTimeInput placeholder="Select the work time"
                           onChange={onChangeWorkTime}
                           format="HH:mm"/>
        </S.AntdWorkTimeItem>
        <S.Notes>Min. hours that should be made in a day</S.Notes>

        <S.SaveButton type="submit">
          Save
        </S.SaveButton>
      </S.AntdForm>
    </S.Modal>
  </>)
}

export default EditUserProfile;
