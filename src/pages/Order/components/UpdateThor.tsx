import { ModalForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<ORDER_API.OrderListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<ORDER_API.OrderListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      width={380}
      // style={{ padding: '32px 40px 48px' }}
      open={props.updateModalOpen}
      modalProps={{
        destroyOnClose: true,
        cancelText: 'Hủy',
        okText: 'OK',
        onCancel: () => props.onCancel(),
      }}
      onFinish={props.onSubmit}
      title="Cập nhật đơn hàng"
    >
      <ProFormText
        name="customerName"
        label="Tên khách hàng"
        placeholder="Nhập tên khách hàng"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập tên khách hàng!',
          },
        ]}
      />
      <ProFormText
        name="customerCar"
        label="Biển số xe"
        placeholder="Nhập biển số xe"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập biển số xe!',
          },
        ]}
      />
      <ProFormText
        name="customerPhone"
        label="Sđt khách hàng"
        placeholder="Nhập sđt"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập sđt!',
          },
        ]}
      />

    </ModalForm>
  );
};

export default UpdateForm;
