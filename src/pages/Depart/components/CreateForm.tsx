import { ModalForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<DEPART_API.DepartListItem>) => Promise<void>;
  createModalOpen: boolean;
  values: Partial<DEPART_API.DepartListItem>;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      width={580}
      open={props.createModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
        okText: 'OK',
      }}
      onFinish={props.onFinish}
      title="Tạo địa điểm"
    >
      <ProFormText
        name="name"
        label="Tên địa điểm"
        width="xl"
        placeholder="Nhập tên địa điểm"
        rules={[
          {
            required: true,
            message: 'Nhập tên địa điểm!',
          },
        ]}
      />
      <ProFormText
        name="phone"
        label="Điện thoại"
        width="xl"
        placeholder="Nhập số điện thoại"
        rules={[
          {
            required: true,
            message: 'Nhập số điện thoại!',
          },
        ]}
      />
    </ModalForm>
  );
};

export default CreateForm;
