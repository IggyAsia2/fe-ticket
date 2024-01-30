import { ModalForm, ProFormMoney, ProFormText } from '@ant-design/pro-components';
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
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const moneny: any = props.values.moneny;
  const minusMin = moneny * -1;

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
        // discountAgent: props.values.discountAgent,
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

      {/* <ProFormMoney
        label="Chiết khấu"
        name="discountAgent"
        min={0}
        placeholder="Nhập chiết khấu"
        locale="vi-VN"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập chiết khấu!',
          },
        ]}
      /> */}
      <ProFormMoney
        label="Nạp thêm"
        name="moneny"
        min={minusMin}
        placeholder="Nhập số tiền nạp thêm"
        locale="vi-VN"
      />
    </ModalForm>
  );
};

export default UpdateForm;
