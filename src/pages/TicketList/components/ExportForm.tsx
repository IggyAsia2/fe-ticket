import { availableInven } from '@/api/inventory';
import { getPrice } from '@/helper/helper';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Card, Col, Row } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ProFormInstance } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import React, { useState, useRef } from 'react';

const itnu: any = {
  Adult: {
    name: 'Người lớn',
  },
  Child: {
    name: 'Trẻ em',
  },
  Elder: {
    name: 'Người cao tuổi',
  },
};

export type ExportFormValueType = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  quantity?: number;
  bookDate?: string;
} & Partial<TICKET_API.TicketListItem>;

export type ExportFormProps = {
  onCancel: (flag?: boolean, formVals?: ExportFormValueType) => void;
  onSubmit: (values: ExportFormValueType) => Promise<void>;
  exportModalOpen: boolean;
  values: Partial<TICKET_API.TicketListItem>;
  productList: any;
};

const ExportForm: React.FC<ExportFormProps> = (props) => {
  const [quan, setQuan] = useState<number>(0);
  const { data, run } = useRequest(availableInven, {
    manual: true,
    formatResult: (res: any) => setQuan(res.available),
  });
  const formRef = useRef<ProFormInstance>();

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf('day');
  };

  const { bigTicket, name, sku, price, unit }: any = props.values;

  return (
    <ModalForm
      width={760}
      // style={{ padding: '32px 40px 48px' }}
      open={props.exportModalOpen}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
      submitter={{
        render: (props, defaultDoms) => {
          if (props.form?.getFieldValue('bookDate')) props.form?.resetFields(['quantity']);
          return [...defaultDoms];
        },
      }}
      onFinish={props.onSubmit}
      initialValues={{
        customerName: 'Xuân Bảo',
        customerEmail: 'test@gmail.com',
        customerPhone: '0903997705',
      }}
      title="Xuất vé"
    >
      <Row>
        <Col span={12}>
          <ProFormText
            name="customerName"
            label="Tên khách hàng"
            width="md"
            rules={[
              {
                required: true,
                message: 'Xin nhập tên khách hàng!',
              },
            ]}
          />
          <ProFormText
            name="customerEmail"
            label="Email khách hàng"
            width="md"
            rules={[
              {
                required: true,
                message: 'Xin nhập email khách hàng!',
              },
            ]}
          />
          <ProFormText
            name="customerPhone"
            label="Sđt khách hàng"
            width="md"
            rules={[
              {
                required: true,
                message: 'Xin nhập sđt khách hàng!',
              },
            ]}
          />

          <ProFormDatePicker
            label="Ngày book vé"
            name="bookDate"
            width="md"
            fieldProps={{
              format: 'DD/MM/YYYY',
              disabledDate: disabledDate,
              onChange: async (_, record: string) => {
                if (record) {
                  const endDate = record.split('/').reverse().join('/');
                  run({
                    groupTicket: props.values._id,
                    expiredDate: endDate,
                  });
                } else {
                  setQuan(0);
                }
              },
            }}
            rules={[
              {
                required: true,
                message: 'Xin nhập ngày xuất vé!',
              },
            ]}
          />

          <ProFormDigit
            disabled={!quan}
            label="Số vé"
            name="quantity"
            width="md"
            min={1}
            max={quan}
            placeholder={`Còn ${quan} vé`}
            rules={[
              {
                required: true,
                message: 'Xin nhập số vé cần xuất!',
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <Card title="Thông tin vé xuất" bordered={false} style={{ width: 350 }}>
            <p>Địa điểm: {bigTicket?.name}</p>
            <p>Vé: {name}</p>
            <p>Sku: {sku}</p>
            <p>Loại vé: {itnu[unit]?.name}</p>
            <p>Giá vé: {getPrice(price)}</p>
          </Card>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ExportForm;
