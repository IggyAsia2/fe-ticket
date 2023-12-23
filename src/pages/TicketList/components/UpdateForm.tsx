import { ModalForm, ProFormMoney, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TICKET_API.TicketListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<TICKET_API.TicketListItem>;
  productList: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      width={380}
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
        sku: props.values.sku,
        bigTicket: props.values.bigTicket?._id,
        unit: props.values.unit,
        price: props.values.price,
        discountPrice: props.values.discountPrice,
      }}
      title="Cập nhật vé"
    >
      <ProFormText
        name="sku"
        label="Sku"
        width="md"
        placeholder="Nhập mã sku"
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
        placeholder="Nhập tên loại vé"
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
        placeholder="Chọn địa điểm"
        options={props.productList}
        showSearch
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
        label="Loại vé"
        placeholder="Chọn loại vé"
        options={[
          { label: 'Người lớn', value: 'Adult' },
          { label: 'Trẻ em', value: 'Child' },
          { label: 'Người cao tuổi', value: 'Elder' },
        ]}
        rules={[
          {
            required: true,
            message: 'Bạn chưa chọn loại vé!',
          },
        ]}
        width="md"
      />

      <ProFormMoney
        label="Giá"
        name="price"
        placeholder="Nhập giá"
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
        // max={props.values.price}
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

export default UpdateForm;
