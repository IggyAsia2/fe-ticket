import { ModalForm, ProFormMoney, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import React, { useState } from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<USER_API.UserListItem>) => Promise<void>;
  createModalOpen: boolean;
  values: Partial<USER_API.UserListItem>;
  productList: any;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [price, setPrice] = useState<number>(0);

  return (
    <ModalForm
      width={380}
      open={props.createModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
      onFinish={props.onFinish}
      title="Tạo vé"
      // initialValues={{
      //   sku: "",
      //   name: "Vé tham quan",
      //   bigTicket: "65407895cb7fa743fc7b4e33",
      //   unit: "Elder",
      //   price: 800000
      // }}
    >
      <ProFormText
        name="sku"
        label="Sku"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập mã sku!',
          },
        ]}
      />
      <ProFormText
        name="name"
        label="Tên loại vé"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập tên loại vé!',
          },
        ]}
      />

      <ProFormSelect<ROLE_API.RistLole>
        name="bigTicket"
        label="Địa điểm"
        options={props.productList}
        rules={[
          {
            required: true,
            message: 'Bạn chưa chọn địa điểm!',
          },
        ]}
        width="md"
      />

      <ProFormSelect<ROLE_API.RistLole>
        name="unit"
        label="Unit"
        options={[
          { label: 'Người lớn', value: 'Adult' },
          { label: 'Trẻ em', value: 'Child' },
          { label: 'Người cao tuổi', value: 'Elder' },
        ]}
        rules={[
          {
            required: true,
            message: 'Bạn chưa chọn unit!',
          },
        ]}
        width="md"
      />

      <ProFormMoney
        label="Giá"
        name="price"
        fieldProps={{
          onChange: (e: any) => setPrice(e),
        }}
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
        fieldProps={{
          disabled: price === 0,
        }}
        max={price}
        name="discountPrice"
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

export default CreateForm;
