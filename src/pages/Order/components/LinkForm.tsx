import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { Card, Image, Row, Typography, QRCode, Divider, Button, Space, message } from 'antd';
import { getProduct } from '@/api/product';
import { useRequest } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import { convertDepartToC, getDate, getPrice } from '@/helper/helper';
import { useReactToPrint } from 'react-to-print';
import { PrinterFilled } from '@ant-design/icons';
import Cookies from 'js-cookie';
const { Text } = Typography;
const beou = { fontSize: '12px', fontWeight: 'bold', lineHeight: 1.1 };

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  linkModalOpen: boolean;
  values: Partial<ORDER_API.OrderListItem>;
  unit: any;
  departList: any;
};

const LinkForm: React.FC<CreateFormProps> = (props) => {
  const { data, run } = useRequest(getProduct, {
    manual: true,
    throwOnError: true,
    formatResult: (res: any) => res.data,
  });
  const {
    allOfTicket,
    quantity,
    groupTicket,
    bookDate,
    price,
    orderId,
    subTotal,
    discountSubtotal,
  }: any = props.values;
  const itnu = groupTicket?.unit && props.unit[groupTicket.unit];
  const place = groupTicket?.bigTicket?.name;

  const actionRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => actionRef.current,
    documentTitle: 'emp-data',
    // onAfterPrint: () => message.success('Đã in thành công'),
  });

  const handlePrintBill = () => {
    if(Cookies.get('departName')) {
      message.success('aaa')
    } else {
      message.warning('Bạn chưa chọn quầy vé')
    }
  }

  useEffect(() => {
    if (props.linkModalOpen) run({ productId: groupTicket?.bigTicket?._id });
  }, [groupTicket?.bigTicket?._id]);

  if (props.linkModalOpen)
    return (
      <ModalForm
        width={1980}
        open={props.linkModalOpen}
        onFinish={async () => handlePrint()}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props.onCancel(),
          cancelText: 'Hủy',
          okText: 'In',
        }}
        title={
          <Space align="baseline">
            <Space direction="vertical">
              <div>{`${quantity} ${groupTicket?.name} - ${itnu.name} - ${place}`}</div>
              <Space>
                <Text mark>{`Tổng: ${getPrice(subTotal)} , Chiết khấu: ${getPrice(
                  discountSubtotal,
                )}`}</Text>
                <Button icon={<PrinterFilled />} onClick={async () => handlePrintBill()}>
                  Bill tổng
                </Button>
                <Button icon={<PrinterFilled />} onClick={async () => handlePrintBill()}>
                  Bill ck
                </Button>
              </Space>
            </Space>
            <Button type="primary" icon={<PrinterFilled />} onClick={async () => handlePrint()}>
              In vé
            </Button>
            <ProFormSelect
              style={{ width: '250px' }}
              name="departID"
              label="Chọn địa điểm"
              onChange={(_, options: any) => {
                Cookies.set('departName', options.label);
              }}
              fieldProps={{
                defaultValue: Cookies.get('departName'),
                options: props.departList && convertDepartToC(props.departList),
              }}
              showSearch
              placeholder="Chọn địa điểm"
              allowClear={false}
              rules={[
                {
                  // type: 'array',
                  required: true,
                  message: 'Bạn chưa chọn quầy vé!',
                },
              ]}
            />
          </Space>
        }
      >
        {/* <List
          grid={{ gutter: 26, column: 5 }}
          ref={actionRef}
          dataSource={allOfTicket}
          renderItem={(item: any, index) => {
            const umbala = (
              <List.Item>
                <Card
                  key={index}
                  style={{ padding: '5px', width: 270, borderRadius: 0 }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div>
                    <Row align="middle" justify="space-between" style={{ padding: '0.2rem' }}>
                      <Image
                        width={120}
                        src={STATIC_URL + '/BigTicket/' + data?.logo}
                        crossOrigin="anonymous"
                      />
                      <Image
                        width={70}
                        src={STATIC_URL + '/Vintrip/logo.png'}
                        crossOrigin="anonymous"
                      />
                    </Row>
                    <hr />
                    <div style={{ display: 'flex' }}>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <QRCode size={110} bordered={false} value={item.serial}></QRCode>
                        <Text strong>{item.serial}</Text>
                      </div>
                      <div style={{ paddingTop: '10px' }}>
                        <div
                          style={{ display: 'flex', flexDirection: 'column', paddingBottom: '3px' }}
                        >
                          <div style={beou}>{`${groupTicket?.name} - ${itnu.name}`}</div>
                          <small>{itnu.note}</small>
                        </div>
                        <p style={{ fontSize: '11px' }}>{place}</p>
                        <p style={{ fontSize: '11px' }}>Ngày: {getDate(bookDate)}</p>
                        <p style={{ fontSize: '11px' }}>Giá: {getPrice(price)}</p>
                      </div>
                    </div>
                    <Divider dashed style={{ margin: '0' }} />
                    <div style={{ padding: '5px' }}>
                      <div style={{ marginBottom: '7px' }}>
                        <strong>Hướng dẫn sử dụng</strong>
                        <br />
                        <div style={{ lineHeight: 1.2 }}>
                          {data?.manual.split('\n').map((el: any) => {
                            return (
                              <>
                                <div style={{ fontSize: '13px' }}>{el}</div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <strong>Lưu ý</strong>
                        <br />
                        <div style={{ lineHeight: 1.2 }}>
                          {data?.note.split('\n').map((el: any) => {
                            return (
                              <>
                                <div style={{ fontSize: '13px' }}>{el}</div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <Divider dashed style={{ margin: '5px 0' }} />
                    <div style={{ padding: '5px' }}>
                      <div style={beou}>Vintrip</div>
                      <div style={beou}>Hotline: 0906897705</div>
                      <div style={beou}>Mã đặt vé: {orderId}</div>
                    </div>

                    <Divider dashed style={{ margin: '5px 0' }} />
                    <div style={{ ...beou, textAlign: 'center' }}>{`${index + 1}/${
                      allOfTicket.length
                    }`}</div>
                  </div>
                </Card>
              </List.Item>
            );
            return umbala;
          }}
        /> */}
        <div>
          <div
            ref={actionRef}
            className="print-container"
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
          >
            {allOfTicket.map((item: any, index: any) => (
              <>
                <Card
                  className="superCard"
                  key={index}
                  style={{
                    margin: '10px',
                    padding: '5px',
                    width: 270,
                    borderRadius: 0,
                    pageBreakBefore: 'always',
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div>
                    <Row align="middle" justify="space-between" style={{ padding: '0.2rem' }}>
                      <Image
                        width={120}
                        preview={false}
                        src={STATIC_URL + '/BigTicket/' + data?.logo}
                        crossOrigin="anonymous"
                      />
                      <Image
                        width={70}
                        preview={false}
                        src={STATIC_URL + '/Vintrip/logo.png'}
                        crossOrigin="anonymous"
                      />
                    </Row>
                    <hr />
                    <div style={{ display: 'flex' }}>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <QRCode size={110} bordered={false} value={item.serial}></QRCode>
                        <Text strong>{item.serial}</Text>
                      </div>
                      <div style={{ paddingTop: '10px' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingBottom: '3px',
                          }}
                        >
                          <div style={beou}>{`${groupTicket?.name} - ${itnu.name}`}</div>
                          <small>{data?.heightNote[itnu.note]}</small>
                        </div>
                        <p style={{ fontSize: '11px' }}>{place}</p>
                        <p style={{ fontSize: '11px' }}>Ngày: {getDate(bookDate)}</p>
                        <p style={{ fontSize: '11px' }}>Giá: {getPrice(price)}</p>
                      </div>
                    </div>
                    <Divider dashed style={{ margin: '0' }} />
                    <div style={{ padding: '5px' }}>
                      <div style={{ marginBottom: '7px' }}>
                        <strong>Hướng dẫn sử dụng</strong>
                        <br />
                        <div style={{ lineHeight: 1.2 }}>
                          {data?.manual.split('\n').map((el: any) => {
                            return (
                              <>
                                <div style={{ fontSize: '13px' }}>{el}</div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <strong>Lưu ý</strong>
                        <br />
                        <div style={{ lineHeight: 1.2 }}>
                          {data?.note.split('\n').map((el: any) => {
                            return (
                              <>
                                <div style={{ fontSize: '13px' }}>{el}</div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <Divider dashed style={{ margin: '5px 0' }} />
                    <div style={{ padding: '5px' }}>
                      <div style={beou}>Vintrip</div>
                      <div style={beou}>Hotline: 0906897705</div>
                      <div style={beou}>Mã đặt vé: {orderId}</div>
                    </div>

                    <Divider dashed style={{ margin: '5px 0' }} />
                    <div style={{ ...beou, textAlign: 'center' }}>{`${index + 1}/${
                      allOfTicket.length
                    }`}</div>
                  </div>
                </Card>
              </>
            ))}
          </div>
          <div style={{ display: 'none' }}></div>
        </div>
      </ModalForm>
    );
};

export default LinkForm;
