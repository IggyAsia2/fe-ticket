import { Card, Divider, Row, Image, Typography, QRCode } from 'antd';
import { getDate, getPrice } from './helper';
const { Text } = Typography;

const mapu = { fontSize: '13px', fontWeight: 'bolder', lineHeight: 1 };
const beou = { fontSize: '13px', fontWeight: 'bold', lineHeight: 1.1 };
const beoi = { fontSize: '13px', lineHeight: 1.1 };
const TicketPrintTemplate: any = (props: any) => {
  const {
    item,
    index,
    logo,
    groupTicket,
    itnu,
    heightNote,
    place,
    bookDate,
    price,
    manual,
    note,
    orderId,
    bigItem,
  } = props;
  return (
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
            color: '#000000',
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
                {/* <Image
                  preview={false}
                  width={100}
                  src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${item.serial}`}
                /> */}
                {/* <Image
                  preview={false}
                  width={100}
                  src={`https://image-charts.com/chart?chs=150x150&cht=qr&chl=${item.serial}`}
                /> */}
                <QRCode
                  type="svg"
                  style={{ padding: '0 0 0 0' }}
                  size={100}
                  bordered={false}
                  value={item.serial}
                ></QRCode>
                <Text
                  style={{
                    fontSize: '13px',
                    // paddingRight: '12px',
                    paddingBottom: '8px',
                    color: '#000000'
                  }}
                  strong
                >
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
                  <div style={mapu}>{`${groupTicket?.name} - ${itnu.name}`}</div>
                  <small style={{ fontSize: '13px' }}>{heightNote[itnu.note]}</small>
                </div>
                <p style={{ fontSize: '13px', marginBottom: 0 }}>{place}</p>
                <p style={{ fontSize: '13px', marginBottom: 0 }}>Ngày: {getDate(bookDate)}</p>
                <p style={{ fontSize: '13px', marginBottom: 0 }}>Giá: {getPrice(price)}</p>
              </div>
            </div>
            <Divider dashed style={{ margin: '0 0 4px 0', borderColor: '#ccc' }} />
            <div style={{ padding: '5px' }}>
              <div style={{ marginBottom: '7px' }}>
                <div style={mapu}>Hướng dẫn sử dụng</div>
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
                <div style={mapu}>Lưu ý</div>
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
              <div style={mapu}>VINTRIP</div>
              <div style={mapu}>Hotline: 0906897705</div>
              <div style={beoi}>Mã đặt vé: {orderId}</div>
            </div>

            <Divider dashed style={{ margin: '5px 0', borderColor: '#ccc' }} />
            <div style={{ ...beoi, textAlign: 'center' }}>Powered by Vintrip.vn</div>
          </div>
        </Card>
        <div style={{ ...beou, textAlign: 'center' }}>{`${index + 1}/${
          bigItem.allOfTicket.length
        }`}</div>
      </div>
    </>
  );
};

export default TicketPrintTemplate;
