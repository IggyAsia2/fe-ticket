import { getOrder } from '@/api/order';
import { getProductToLink } from '@/api/product';
import { getDate, getPrice } from '@/helper/helper';
import { PrinterFilled } from '@ant-design/icons';
import { useParams, useRequest } from '@umijs/max';
import { Button, Card, Divider, QRCode, Row, Space, Image, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const { Text } = Typography;
const beou = { fontSize: '11px', fontWeight: 'bold', lineHeight: 1.1 };
const unit: any = {
  Adult: {
    name: 'Người lớn',
    note: 0,
  },
  Child: {
    name: 'Trẻ em',
    note: 1,
  },
  Elder: {
    name: 'Người cao tuổi',
    note: 2,
  },
};

const LinkOrder: React.FC = () => {
  const actionRef = useRef(null);
  const { orderId } = useParams();
  const paramsOrder = orderId?.split('-')[0];
  const paramsBig = orderId?.split('-')[1];

  const { data, run: getProductLinkRun } = useRequest(getProductToLink, {
    manual: true,
    formatResult: (res: any) => res.data,
  });

  const { data: OrderData, run: orderRun } = useRequest(getOrder, {
    manual: true,
    formatResult: (res: any) => [res.data],
  });

  const listBig = [paramsBig];

  useEffect(() => {
    // if (props.manyLinkModalOpen)
    getProductLinkRun({ listBig });
    orderRun({ oid: paramsOrder });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => actionRef.current,
    documentTitle: 'emp-data',
  });

  if (data && OrderData && data.length) {
    return (
      <>
        <Space style={{ padding: '0.5rem' }} align="baseline">
          <Button type="primary" icon={<PrinterFilled />} onClick={async () => handlePrint()}>
            In vé
          </Button>
        </Space>
        <div>
          <div ref={actionRef}>
            {OrderData.map((bigItem: any, bigIndex: number) => {
              const { groupTicket, bookDate, price, orderId }: any = bigItem;
              const itnu = groupTicket?.unit && unit[groupTicket.unit];
              const place = groupTicket?.bigTicket?.name;
              const { logo, note, manual, heightNote }: any = data[bigIndex];

              return (
                <>
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
                              <Divider
                                dashed
                                style={{ margin: '0 0 4px 0', borderColor: '#ccc' }}
                              />
                              <div style={{ padding: '5px' }}>
                                <div style={{ marginBottom: '7px' }}>
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: 'bolder',
                                      lineHeight: 1,
                                    }}
                                  >
                                    Hướng dẫn sử dụng
                                  </div>
                                  <div style={{ lineHeight: 1.0 }}>
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
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: 'bolder',
                                      lineHeight: 1,
                                    }}
                                  >
                                    Lưu ý
                                  </div>
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
      </>
    );
  }
};

export default LinkOrder;
