import {
  ModalForm,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<USER_API.UserListItem>) => Promise<void>;
  createModalOpen: boolean;
  // onOpenChange: any;
  values: Partial<USER_API.UserListItem>;
  productList: any;
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
      title="Create Ticket"
      initialValues={{
        sku: "CXR00103",
        name: "Vé tham quan",
        bigTicket: "65407895cb7fa743fc7b4e33",
        unit: "Elder",
        price: 800000
      }}
    >
      <ProFormText
        name="sku"
        label="Sku"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please enter the sku!',
          },
        ]}
      />
      <ProFormText
        name="name"
        label="Name"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please enter the name!',
          },
        ]}
      />

      <ProFormSelect<ROLE_API.RistLole>
        name="bigTicket"
        label="Place"
        options={props.productList}
        rules={[
          {
            required: true,
            message: 'Please select place!',
          },
        ]}
        width="md"
      />

      <ProFormSelect<ROLE_API.RistLole>
        name="unit"
        label="Unit"
        options={[
          { label: 'Adult', value: 'Adult' },
          { label: 'Child', value: 'Child' },
          { label: 'Elder', value: 'Elder' },
        ]}
        rules={[
          {
            required: true,
            message: 'Please select an unit!',
          },
        ]}
        width="md"
      />

      <ProFormMoney
        label="Price"
        name="price"
        locale="vi-VN"
        // initialValue={22.22}
        rules={[
          {
            required: true,
            message: 'Please enter the price!',
          },
        ]}
      />
    </ModalForm>
  );
};

export default CreateForm;
