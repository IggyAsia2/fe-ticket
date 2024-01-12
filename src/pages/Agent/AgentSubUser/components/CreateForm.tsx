import { ModalForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<USER_API.UserListItem>) => Promise<void>;
  createModalOpen: boolean;
  values: Partial<USER_API.UserListItem>;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      width={380}
      open={props.createModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
        okText: 'OK',
      }}
      onFinish={props.onFinish}
      title="Tạo người dùng"
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
    </ModalForm>
  );
};

export default CreateForm;
