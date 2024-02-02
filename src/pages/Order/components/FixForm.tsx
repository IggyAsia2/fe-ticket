import { ModalForm, ProFormMoney } from '@ant-design/pro-components';
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
  values: any;
};

const FixForm: React.FC<UpdateFormProps> = (props) => {
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
      initialValues={{
        price: props.values.price,
        discountPrice: props.values.discountPrice,
      }}
      title="Cập nhật đơn hàng"
    >
      <ProFormMoney
        label="Giá"
        name="price"
        placeholder="Nhập giá"
        min={0}
        locale="vi-VN"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập giá!',
          },
        ]}
      />

      <ProFormMoney
        label="Chiết khấu"
        name="discountPrice"
        placeholder="Nhập chiết khấu"
        min={0}
        locale="vi-VN"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập chiết khấu!',
          },
        ]}
      />
    </ModalForm>
  );
};

export default FixForm;
