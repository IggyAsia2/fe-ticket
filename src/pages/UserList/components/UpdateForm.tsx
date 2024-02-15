import { ModalForm, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<USER_API.UserListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<USER_API.UserListItem>;
  roleList: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      width={380}
      // style={{ padding: '32px 40px 48px' }}
      open={props.updateModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
        okText: 'OK',
      }}
      onFinish={props.onSubmit}
      initialValues={{
        id: props.values._id,
        name: props.values.name,
        email: props.values.email,
        active: props.values.active,
        phone: props.values.phone,
        role: props.values.role?._id,
      }}
      title="Cập nhật người dùng"
    >
      <ProFormText
        name="name"
        label="Họ và tên"
        placeholder="Nhập tên người dùng"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập tên',
          },
        ]}
      />
      <ProFormText name="phone" label="Số điện thoại" placeholder="Nhập SĐT" width="md" />
      <ProFormText
        name="email"
        label="Email"
        placeholder="Nhập email"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập email',
          },
        ]}
      />
      <ProFormSwitch name="active" label="Kích hoạt" />
      <ProFormSelect<ROLE_API.RistLole>
        name="role"
        label="Role"
        placeholder="Chọn role"
        options={props.roleList}
        rules={[
          {
            required: true,
            message: 'Bạn chưa chọn role',
          },
        ]}
        width="md"
        // options={[
        //   {
        //     value: 'ádasdasd',
        //     label: 'Admin',
        //   },
        //   {
        //     value: 'user',
        //     label: 'User',
        //   },
        // ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
