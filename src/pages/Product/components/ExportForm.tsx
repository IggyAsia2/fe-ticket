import { availableGroupInven } from '@/api/inventory';
import { convertDepartToCascader, getPrice, unit } from '@/helper/helper';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Col, List, Row } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ProFormInstance } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import React, { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export type ExportFormValueType = {
  customerName?: string;
  customerCar?: string;
  customerPhone?: string;
  departID?: string;
  quantity?: number;
  bookDate?: string;
} & Partial<TICKET_API.TicketListItem>;

export type ExportFormProps = {
  onCancel: (flag?: boolean, formVals?: ExportFormValueType) => void;
  onSubmit: (values: ExportFormValueType) => Promise<void>;
  exportModalOpen: boolean;
  values: Partial<TICKET_API.TicketListItem>;
  groupQuan: any;
  setGroupQuan: any;
  quan: any;
  setQuan: any;
};

const ExportForm: React.FC<ExportFormProps> = (props) => {
  const { initialState } = useModel('@@initialState');
  const { departList }: any = initialState;
  const { run } = useRequest(availableGroupInven, {
    manual: true,
    formatResult: (res: any) => props.setGroupQuan(res.data),
  });
  const formRef = useRef<ProFormInstance>();

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf('day');
  };

  const { name, groupTickets, _id }: any = props.values;
  let newGroupTickets = groupTickets;
  if (_id === '65407895cb7fa743fc7b4e33') {
    newGroupTickets = groupTickets.sort((a: any, b: any) => a.stt - b.stt);
  }

  useEffect(() => {
    const endDate = dayjs().format('YYYY/MM/DD');
    if (props.values._id) {
      run({
        bigTicket: props.values._id,
        expiredDate: endDate,
      });
    }
  }, [props.values._id]);

  return (
    <ModalForm
      width={800}
      // style={{ padding: '32px 40px 48px' }}
      open={props.exportModalOpen}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
        centered: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
        okText: 'OK',
      }}
      submitter={{
        render: (props, defaultDoms) => {
          if (props.form?.getFieldValue('bookDate')) props.form?.resetFields(['quantity']);
          return [...defaultDoms];
        },
      }}
      onFinish={props.onSubmit}
      initialValues={{
        // customerName: 'Xuân Bảo',
        // customerPhone: '0903997705',
        departID: Cookies.get('departID'),
      }}
      title={name}
    >
      <Row gutter={20}>
        <Col span={8}>
          <ProFormText
            name="customerName"
            label="Tên khách hàng"
            width="md"
            fieldProps={{
              placeholder: 'Nhập tên khách hàng',
            }}
            rules={[
              {
                required: true,
                message: 'Xin nhập tên khách hàng!',
              },
            ]}
          />
          <ProFormText
            name="customerCar"
            label="Biển số xe"
            width="md"
            fieldProps={{
              placeholder: 'Nhập biển số xe khách hàng',
            }}
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
            fieldProps={{
              placeholder: 'Nhập sđt khách hàng',
            }}
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
              placeholder: 'Chọn ngày book vé',
              defaultValue: dayjs(),
              disabledDate: disabledDate,
              allowClear: false,
              onChange: async (_, record: string) => {
                if (record) {
                  const endDate = record.split('/').reverse().join('/');
                  run({
                    bigTicket: props.values._id,
                    expiredDate: endDate,
                  });
                } else {
                  props.setGroupQuan([]);
                }
              },
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Xin nhập ngày xuất vé!',
            //   },
            // ]}
          />

          {/* <ProFormDigit
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
          /> */}
        </Col>
        <Col span={16}>
          <div
            style={{
              height: 500,
              overflow: 'auto',
              padding: '0 10px',
              border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
          >
            <List
              header={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <ProFormSelect
                    style={{ width: '200px' }}
                    name="departID"
                    label="Chọn quầy vé"
                    // name="depet"
                    onChange={(value: string, options: any) => {
                      Cookies.set('depart', options.label);
                      Cookies.set('departID', value);
                    }}
                    fieldProps={{
                      // defaultValue: Cookies.get('departID'),
                      options: departList && convertDepartToCascader(departList),
                    }}
                    showSearch
                    placeholder="Chọn quầy vé"
                    allowClear={false}
                    rules={[
                      {
                        // type: 'array',
                        required: true,
                        message: 'Bạn chưa chọn quầy vé!',
                      },
                    ]}
                  />
                  <div>Nhập số lượng vé</div>
                </div>
              }
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={newGroupTickets}
              renderItem={(item: any, index) => (
                <List.Item
                  actions={[
                    <>
                      <ProFormDigit
                        key={item._id}
                        name={item._id}
                        disabled={!props.groupQuan[index]}
                        width="xs"
                        min={1}
                        max={props.groupQuan[index]}
                        placeholder={`Còn ${props.groupQuan[index]} vé`}
                      />
                    </>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ color: item.name.includes('Buffet') ? 'red' : 'black' }}>
                        - {item.name}
                      </div>
                    }
                    description={`${getPrice(item.price)} (${unit[item.unit].name})`}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ExportForm;
