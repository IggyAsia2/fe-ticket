import { ModalForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<PRODUCT_API.ProductListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<DEPART_API.DepartListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      width={580}
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
        phone: props.values.phone,
      }}
      title="Cập nhật địa điểm"
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

export default UpdateForm;
