import { ModalForm, ProFormText } from '@ant-design/pro-components';
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
  values: Partial<any>;
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
        name: props.values.name,
        pin: props.values.pin,
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
      <ProFormText
        name="pin"
        label="Mã Pin"
        placeholder="Nhập mã pin"
        width="md"
        fieldProps={{
          onKeyDown: (event) => {
            if (!/^[0-9]/g.test(event.key)) {
              event.preventDefault();
            }
          },
        }}
        rules={[
          {
            required: true,
            message: 'Xin nhập Mã Pin 4 số',
            min: 4,
            max: 4,
          },
        ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
