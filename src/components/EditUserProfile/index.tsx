import { useForm } from 'antd/lib/form/Form';
import MenuTitle from 'monday-ui-react-core/dist/MenuTitle';
import MenuItem from 'monday-ui-react-core/dist/MenuItem';
import MenuDivider from 'monday-ui-react-core/dist/MenuDivider';
import IconEdit from 'monday-ui-react-core/dist/icons/Edit';
import IconNote from 'monday-ui-react-core/dist/icons/Note';
import IconTable from 'monday-ui-react-core/dist/icons/Table';
import IconEmbed from 'monday-ui-react-core/dist/icons/Embed';
import { ReactElement, useMemo, useState } from 'react';
import { MondayExportEnum } from '../../models/proxies/monday';
import { UserProxy } from '../../models/proxies/user.proxy';
import useUserStore from '../../store/useUser';
import { fromDateToHour } from './functions';

import * as S from './styles';

export type UserPopupProfileProps = {
  className?: string;
  user: UserProxy;
  onClickToExport: (type: MondayExportEnum) => void;
}

function EditUserProfile({ user, className, onClickToExport }: UserPopupProfileProps): ReactElement {
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
    <S.EditContainer className={className}>
      <S.EditMenuButton size="40">
        <S.EditMenu size="medium">
          <MenuTitle caption="User" captionPosition="top"/>
          <MenuItem icon={IconEdit} iconType="SVG" title="Edit User" onClick={() => setVisible(true)}/>
          <MenuDivider/>
          <MenuTitle caption="Export Options" captionPosition="top"/>
          <MenuItem icon={IconNote} iconType="SVG" title="Export hours in CSV" onClick={() => onClickToExport(MondayExportEnum.CSV)}/>
          <MenuItem icon={IconTable} iconType="SVG" title="Export hours in Excel" onClick={() => onClickToExport(MondayExportEnum.EXCEL)}/>
          <MenuItem icon={IconEmbed} iconType="SVG" title="Export hours in JSON" onClick={() => onClickToExport(MondayExportEnum.JSON)}/>
        </S.EditMenu>
      </S.EditMenuButton>
    </S.EditContainer>

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
