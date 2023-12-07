import { ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<DEPART_API.CashierListItem>) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<DEPART_API.CashierListItem>;
};

const UpdateCashierForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      width={580}
      open={props.updateModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
      }}
      onFinish={props.onFinish}
      initialValues={{
        name: props.values.name,
        order: props.values.order,
      }}
      title="Cập nhật quầy vé"
    >
      <ProFormText
        name="name"
        label="Tên quầy"
        width="xl"
        placeholder="Nhập tên quầy"
        rules={[
          {
            required: true,
            message: 'Nhập tên quầy!',
          },
        ]}
      />

      <ProFormDigit
        name="order"
        label="STT"
        width="xl"
        placeholder="Nhập số thứ tự"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập stt',
          },
        ]}
      />
    </ModalForm>
  );
};

export default UpdateCashierForm;
