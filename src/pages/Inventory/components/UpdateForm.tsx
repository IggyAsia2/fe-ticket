import {
  ModalForm,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
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
  const intl = useIntl();
  return (
    <ModalForm
      width={380}
      // style={{ padding: '32px 40px 48px' }}
      open={props.updateModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
      onFinish={props.onSubmit}
      initialValues={{
        name: props.values.name,
        sku: props.values.sku,
        bigTicket: props.values.bigTicket?._id,
        unit: props.values.unit,
        price: props.values.price,
      }}
      title={intl.formatMessage({
        id: 'pages.searchTable.updateForm.userConfig',
        defaultMessage: 'Update User',
      })}
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

export default UpdateForm;
