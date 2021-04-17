import { useForm } from 'antd/lib/form/Form';
import IconEdit from 'monday-ui-react-core/dist/icons/Edit';
import IconEmbed from 'monday-ui-react-core/dist/icons/Embed';
import IconNote from 'monday-ui-react-core/dist/icons/Note';
import IconTable from 'monday-ui-react-core/dist/icons/Table';
import MenuDivider from 'monday-ui-react-core/dist/MenuDivider';
import MenuItem from 'monday-ui-react-core/dist/MenuItem';
import MenuTitle from 'monday-ui-react-core/dist/MenuTitle';
import { ReactElement, useState } from 'react';
import { MondayExportEnum } from '../../models/proxies/monday';
import { UserProxy } from '../../models/proxies/user.proxy';
import useUserStore from '../../store/useUser';

import * as S from './styles';

export type UserPopupProfileProps = {
  className?: string;
  user: UserProxy;
  onClickToExport: (type: MondayExportEnum) => void;
}

function EditUserProfile({ user, className, onClickToExport }: UserPopupProfileProps): ReactElement {
  const [form] = useForm<{ name: string, workTimeHour: number, workTimeMin: number }>();

  const [visible, setVisible] = useState(false);
  const updateUserById = useUserStore(state => state.updateUserById);

  function onClickSave() {
    const updatedUser = form.getFieldsValue();

    updateUserById(user.id, {
      ...user,
      name: updatedUser.name,
      workTime: Number(updatedUser.workTimeHour) + (Number(updatedUser.workTimeMin) / 60),
    });

    setVisible(false);
  }

  return (<>
    <S.EditContainer className={className}>
      <S.EditMenuButton size="40">
        <S.EditMenu size="medium">
          <MenuTitle caption="User" captionPosition="top"/>
          <MenuItem icon={IconEdit} iconType="SVG" title="Edit User" onClick={() => setVisible(true)}/>
          <MenuDivider/>
          <MenuTitle caption="Export Options" captionPosition="top"/>
          <MenuItem icon={IconNote} iconType="SVG" title="Export hours in CSV"
                    onClick={() => onClickToExport(MondayExportEnum.CSV)}/>
          <MenuItem icon={IconTable} iconType="SVG" title="Export hours in Excel"
                    onClick={() => onClickToExport(MondayExportEnum.EXCEL)}/>
          <MenuItem icon={IconEmbed} iconType="SVG" title="Export hours in JSON"
                    onClick={() => onClickToExport(MondayExportEnum.JSON)}/>
        </S.EditMenu>
      </S.EditMenuButton>
    </S.EditContainer>

    <S.Modal visible={visible}
             onCancel={() => setVisible(false)}>
      <S.AntdForm form={form} onFinish={onClickSave} hideRequiredMark>
        <S.Title type="h2" value="Edit User"/>
        <S.Description>Change the user&apos;s name and the user&apos;s working hours to change the colors in the calendar.</S.Description>

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

        <S.WorkTimeContainer>
          <S.AntdWorkTimeItem
            label="Work Time (Hour)"
            name="workTimeHour"
            initialValue={~~user.workTime}
            rules={[
              { required: true, message: 'You need to enter the min. hours for the user to do in one day.' },
            ]}>
            <S.WorkTimeHourInput required
                                 min={0}
                                 max={23}
                                 step={1}
                                 size="medium"
                                 clearOnIconClick={true}
                                 placeholder="Select the hour"
                                 type="number"/>
          </S.AntdWorkTimeItem>

          <S.AntdWorkTimeItem
            label="Work Time (Minutes)"
            name="workTimeMin"
            initialValue={Math.round((user.workTime % 1) * 60)}
            rules={[
              { required: true, message: 'You need to enter the min. minutes for the user to do in one day.' },
            ]}>
            <S.WorkTimeMinInput required
                                min={0}
                                max={60}
                                step={1}
                                size="medium"
                                clearOnIconClick={true}
                                placeholder="Select the minutes"
                                type="number"/>
          </S.AntdWorkTimeItem>
        </S.WorkTimeContainer>

        <S.SaveButton type="submit">
          Save
        </S.SaveButton>
      </S.AntdForm>
    </S.Modal>
  </>)
}

export default EditUserProfile;
