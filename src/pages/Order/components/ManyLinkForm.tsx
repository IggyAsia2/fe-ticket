import { ModalForm, ProFormSelect, ProFormDigit } from '@ant-design/pro-components';
import { Card, Image, Row, Typography, QRCode, Divider, Button, Space, message } from 'antd';
import { getProductToLink } from '@/api/product';
import { useRequest } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { convertDepartToC, getDate, getPrice } from '@/helper/helper';
import { useReactToPrint } from 'react-to-print';
import { PrinterFilled } from '@ant-design/icons';
import Cookies from 'js-cookie';
import BillTemplate from './billTemplate';
const { Text } = Typography;
const beou = { fontSize: '11px', fontWeight: 'bold', lineHeight: 1.1 };

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  manyLinkModalOpen: boolean;
  values: any;
  unit: any;
  takePrice: any;
  departList: any;
};

const ManyLinkForm: React.FC<CreateFormProps> = (props) => {
  const actionRef = useRef(null);
  const actionBillRef = useRef(null);
  const actionBillRefDC = useRef(null);
  const [departInfo, setDepartInfo] = useState<any>({
    name: Cookies.get('departName') || '',
    phone: Cookies.get('departPhone') || '',
  });
  const [nl, setNL] = useState<any>(null);
  const [te, setTE] = useState<any>(null);
  console.log(props.values);

  const listBig = props.values.map((el: any) => el.groupTicket.bigTicket._id);

  const { data, run } = useRequest(getProductToLink, {
    manual: true,
    formatResult: (res: any) => res.data,
  });

  useEffect(() => {
    // if (props.manyLinkModalOpen)
    run({ listBig });
  }, [props.manyLinkModalOpen]);

  const handlePrint = useReactToPrint({
    content: () => actionRef.current,
    documentTitle: 'emp-data',
    // onAfterPrint: () => message.success('Đã in thành công'),
  });

  const printBill = useReactToPrint({
    content: () => actionBillRef.current,
    documentTitle: 'Giao dịch - Hóa đơn',
  });
  const printBillDC = useReactToPrint({
    content: () => actionBillRefDC.current,
    documentTitle: 'Giao dịch - Hóa đơn',
  });

  const handlePrintBill = (bol: boolean) => {
    // if (Cookies.get('departName')) {
    if (departInfo.name) {
      if (bol) printBillDC();
      else printBill();
    } else {
      message.warning('Bạn chưa chọn quầy vé');
    }
  };

  if (props.manyLinkModalOpen === true && data && data.length) {
    const total = props.takePrice.total;
    const discount = props.takePrice.discount;

    return (
      <ModalForm
        width={1980}
        open={props.manyLinkModalOpen}
        onFinish={async () => handlePrint()}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onCancel();
          },
          cancelText: 'Hủy',
          okText: 'In',
        }}
        title={
          <Space align="baseline">
            <Text hidden={total === 0} type="success">{`Tổng: ${getPrice(
              total,
            )} , Chiết khấu: ${getPrice(discount)}, Thanh toán: ${getPrice(
              total - discount,
            )}`}</Text>
            <Button type="primary" icon={<PrinterFilled />} onClick={async () => handlePrint()}>
              In vé
            </Button>
            <Button
              icon={<PrinterFilled />}
              onClick={async () => {
                handlePrintBill(false);
              }}
            >
              Bill tổng
            </Button>
            <Button
              icon={<PrinterFilled />}
              onClick={async () => {
                handlePrintBill(true);
              }}
            >
              Bill ck
            </Button>
            <Space direction="horizontal">
              <ProFormSelect
                style={{ width: '250px' }}
                name="departID"
                label="Chọn địa điểm"
                onChange={(_, options: any) => {
                  setDepartInfo({
                    name: options.label,
                    phone: options.phone,
                  });
                  Cookies.set('departPhone', options.phone);
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
              <ProFormDigit
                name="nl"
                label="Vé cổng NL"
                fieldProps={{
                  onChange: (e) => setNL(e),
                  placeholder: 'Nhập số vé',
                }}
                // disabled={!props.groupQuan[index]}
                width="xs"
                min={1}
              />
              <ProFormDigit
                name="te"
                label="Vé cổng TE"
                fieldProps={{
                  onChange: (e) => setTE(e),
                  placeholder: 'Nhập số vé',
                }}
                // disabled={!props.groupQuan[index]}
                width="xs"
                min={1}
              />
            </Space>
          </Space>
        }
      >
        <div style={{ display: 'none' }}>
          <BillTemplate
            options={{ nl, te }}
            actionBillRef={actionBillRef}
            departInfo={departInfo}
            data={props.values}
            isDiscount={false}
            takePrice={props.takePrice}
          />
        </div>
        <div style={{ display: 'none' }}>
          <BillTemplate
            options={{ nl, te }}
            actionBillRef={actionBillRefDC}
            departInfo={departInfo}
            data={props.values}
            isDiscount={true}
            takePrice={props.takePrice}
          />
        </div>
        <div>
          <div ref={actionRef}>
            {props.values.map((bigItem: any, bigIndex: number) => {
              const {
                quantity,
                groupTicket,
                bookDate,
                price,
                subTotal,
                discountSubtotal,
                orderId,
              }: any = bigItem;
              const itnu = groupTicket?.unit && props.unit[groupTicket.unit];
              const place = groupTicket?.bigTicket?.name;
              const { logo, note, manual, heightNote }: any = data[bigIndex];

              return (
                <>
                  <Space className="hide-after-page-break" align="baseline">
                    <Typography.Title
                      level={5}
                    >{`${quantity} ${groupTicket?.name} - ${itnu.name} - ${place} `}</Typography.Title>
                    <Text mark>{`Tổng: ${getPrice(subTotal)} , Chiết khấu: ${getPrice(
                      discountSubtotal,
                    )}`}</Text>
                  </Space>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                    }}
                  >
                    {bigItem.allOfTicket.map((item: any, index: any) => (
                      <>
                        <div className="print-ticket">
                          <Card
                            className="superCard"
                            key={index}
                            style={{
                              margin: '10px',
                              padding: '5px',
                              width: 260,
                              borderRadius: 0,
                              borderColor: '#ccc',
                              pageBreakBefore: 'always',
                              fontFamily: 'Arial',
                            }}
                            bodyStyle={{ padding: 0 }}
                          >
                            <div>
                              <Row
                                align="middle"
                                justify="space-between"
                                style={{ padding: '0.2rem 0.2rem 0 0.2rem' }}
                              >
                                <Image
                                  width={120}
                                  preview={false}
                                  src={`${STATIC_URL}/BigTicket/${logo}`}
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
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                  }}
                                >
                                  <QRCode size={100} bordered={false} value={item.serial}></QRCode>
                                  <Text style={{ fontSize: '11px' }} strong>
                                    {item.serial}
                                  </Text>
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
                                    <small>{heightNote[itnu.note]}</small>
                                  </div>
                                  <p style={{ fontSize: '11px' }}>{place}</p>
                                  <p style={{ fontSize: '11px' }}>Ngày: {getDate(bookDate)}</p>
                                  <p style={{ fontSize: '11px' }}>Giá: {getPrice(price)}</p>
                                </div>
                              </div>
                              <Divider dashed style={{ margin: '0', borderColor: '#ccc' }} />
                              <div style={{ padding: '5px' }}>
                                <div style={{ marginBottom: '7px' }}>
                                  <strong style={{fontSize: '13px'}}>Hướng dẫn sử dụng</strong>
                                  <br />
                                  <div style={{ lineHeight: 1.2 }}>
                                    {manual.split('\n').map((el: any) => {
                                      return (
                                        <>
                                          <div style={{ fontSize: '13px' }}>{el}</div>
                                        </>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <strong style={{fontSize: '13px'}}>Lưu ý</strong>
                                  <br />
                                  <div style={{ lineHeight: 1.2 }}>
                                    {note.split('\n').map((el: any) => {
                                      return (
                                        <>
                                          <div style={{ fontSize: '13px' }}>{el}</div>
                                        </>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <Divider dashed style={{ margin: '5px 0', borderColor: '#ccc' }} />
                              <div style={{ padding: '5px' }}>
                                <div style={beou}>VINTRIP</div>
                                <div style={beou}>Hotline: 0906897705</div>
                                <div style={beou}>Mã đặt vé: {orderId}</div>
                              </div>

                              <Divider dashed style={{ margin: '5px 0', borderColor: '#ccc' }} />
                              <div style={{ ...beou, textAlign: 'center' }}>{`${index + 1}/${
                                bigItem.allOfTicket.length
                              }`}</div>
                            </div>
                          </Card>
                        </div>
                      </>
                    ))}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </ModalForm>
    );
  }
};

export default ManyLinkForm;
