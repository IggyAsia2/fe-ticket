import { sunProductList } from '@/api/sunWorld/sun';
import { ModalForm, ProFormDigit } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, DatePicker, List, Space } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { getPrice } from '@/helper/helper';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

export type ExportFormValueType = {
  customerName?: string;
  customerCar?: string;
  customerPhone?: string;
  quantity?: number;
  bookDate?: string;
} & Partial<TICKET_API.TicketListItem>;

export type ExportFormProps = {
  onCancel: (flag?: boolean, formVals?: ExportFormValueType) => void;
  onSubmit: (values: any, dataSubmit: any) => Promise<void>;
  exportModalOpen: boolean;
  values: any;
  // usageDate: string;
  // setUsageDate: any;
};

const ExportForm: React.FC<ExportFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [sample, setSample] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [usageDate, setUsageDate] = useState<string>('');
  const { run: sunProductRun } = useRequest(sunProductList, {
    manual: true,
    loadingDelay: 2,
    formatResult: (res: any) => {
      setSample(res.data);
      setLoading(false);
    },
  });

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().startOf('day');
  };
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setUsageDate(dateString);
  };

  const newUsageDate = (d: string) => d.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$2-$1');

  const { code, name }: any = props.values;

  useEffect(() => {
    if (Object.keys(props.values).length) {
      if (usageDate) {
        setLoading(true);
        sunProductRun({ 'siteCodes[]': code, date: newUsageDate(usageDate) });
      }
    }
  }, [props.values, usageDate]);

  return (
    <ModalForm
      width={550}
      // style={{ padding: '32px 40px 48px' }}
      open={props.exportModalOpen}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
        centered: true,
        onCancel: () => {
          setSample([]);
          props.onCancel();
          setLoading(false);
          setUsageDate('');
          // props.setUsageDate('');
        },
        cancelText: 'Hủy',
        okText: 'OK',
      }}
      // onValuesChange={(changeValues, values) => console.log(values)}
      // submitter={{
      //   render: (props, defaultDoms) => {
      //     if (props.form?.getFieldValue('bookDate')) props.form?.resetFields(['quantity']);
      //     return [...defaultDoms];
      //   },
      // }}
      onFinish={async (values) => {
        const valueArr = Object.keys(values);
        const newSample = sample.filter((el: any) => valueArr.includes(el.code));
        const newArr = newSample.map((el: any) => {
          return {
            productCode: el.code,
            siteCode: el.site.code,
            usageDate: newUsageDate(usageDate),
            performanceId: el.performance[0].id,
            quantity: values[el.code].quantity,
          };
        });
        await props.onSubmit(values, newArr);
        setLoading(false);
      }}
      initialValues={
        {
          // customerName: 'Xuân Bảo',
          // customerPhone: '0903997705',
        }
      }
      title={`${name} | ${code} (${usageDate})`}
    >
      <Col>
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
                <Space>
                  <div>Chọn ngày đặt vé</div>
                  <DatePicker
                    onChange={onChange}
                    placeholder="Nhập ngày"
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                  />
                </Space>
              </div>
            }
            loading={loading}
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={sample || []}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <>
                    <Space>
                      <ProFormDigit
                        key={item.id}
                        name={[item.code, 'quantity']}
                        // disabled={!props.groupQuan[index]}
                        width="xs"
                        min={1}
                        max={50}
                        placeholder={`Nhập số lượng vé`}
                      />
                      {/* <ProFormDatePicker
                        name={[item.code, 'date']}
                        placeholder="Nhập ngày sử dụng"
                        fieldProps={{
                          format: 'DD/MM/YYYY',
                          disabledDate: disabledDate,
                        }}
                      /> */}
                    </Space>
                  </>,
                ]}
              >
                <List.Item.Meta
                  title={`- ${item.name} | ${item.code}`}
                  description={`${getPrice(item.unitPrice)} (${item.personType})`}
                />
              </List.Item>
            )}
          />
        </div>
      </Col>
    </ModalForm>
  );
};

export default ExportForm;
