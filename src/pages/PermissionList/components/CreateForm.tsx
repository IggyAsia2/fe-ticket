import { ModalForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<USER_API.UserListItem>) => Promise<void>;
  createModalOpen: boolean;
  // onOpenChange: any;
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
      }}
      onFinish={props.onFinish}
      title="Tạo Role"
    >
      <ProFormText
        name="name"
        label="Role"
        width="md"
        rules={[
          {
            required: true,
            message: "Bạn chưa nhập tên role"
          },
        ]}
      />
    </ModalForm>
  );
};

export default CreateForm;
