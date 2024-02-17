import { getDateTime, getPrice } from '@/helper/helper';
import { Image, Space } from 'antd';
import React from 'react';

const itnu: any = {
  Adult: 'NL',
  Child: 'TE',
  Elder: 'NLT',
};

const BillTemplate: React.FC<any> = (props) => {
  const { actionBillRef, departInfo, data, takePrice, isDiscount, options } = props;
  const { customerName, customerPhone, customerCar, exportUser } = data[0];
  const newDate = new Date();
  const nlPrice = 10000;
  const tePrice = 5000;
  const newArr = [...data];
  let total = 0;
  let bill = '';

  const isFound = (val: any, str: string) =>
    val.some((el: any) => {
      if (el.groupTicket.name === str) {
        return true;
      }
      return false;
    });

  if (options.nl && !isFound(newArr, 'VÉ CỔNG (NL)'))
    newArr.unshift({
      groupTicket: {
        name: 'VÉ CỔNG (NL)',
      },
      price: nlPrice,
      quantity: options.nl,
      subTotal: options.nl * nlPrice,
    });

  if (options.te && !isFound(newArr, 'VÉ CỔNG (TE)'))
    newArr.unshift({
      groupTicket: {
        name: 'VÉ CỔNG (TE)',
      },
      price: tePrice,
      quantity: options.te,
      subTotal: options.te * tePrice,
    });

  return (
    <>
      <div style={{ color: '#000000' }} className="print-bill" ref={actionBillRef}>
        <div style={{ display: 'grid', textAlign: 'center' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {departInfo.name.toUpperCase()}
          </span>
          {/* <span style={{ fontSize: '12pt', fontWeight: 'bold' }}>SĐT: {departInfo.phone}</span> */}
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>HÓA ĐƠN BÁN HÀNG</span>
        </div>
        <div>
          <div>
            <strong>Khách hàng: </strong>
            {customerName}
          </div>
          <div>Điện thoại: {customerPhone}</div>
          <div>Biển số xe: {customerCar}</div>
          <div>Thời gian: {getDateTime(newDate.toString())}</div>
          <div>
            <strong>Người bán: </strong>
            {exportUser.split('@')[0]}
          </div>
        </div>
        <hr style={{ marginTop: '40px', borderTop: '1px dashed' }} />
        <table width="100%">
          <tr>
            <th style={{ textAlign: 'left', width: '55%' }}>Đơn giá</th>
            <th style={{ textAlign: 'left' }}>SL</th>
            <th style={{ textAlign: 'right' }}>Thành tiền</th>
          </tr>
          {newArr.map((el: any) => {
            total += el.subTotal;
            bill += el.orderId + '%20';
            return (
              <>
                <tr style={{ borderBottom: '1px dashed' }}>
                  <td style={{ paddingBottom: '30px' }}>
                    <div>
                      {el.groupTicket.name} ({itnu[el.groupTicket.unit]})
                    </div>
                    <div>{getPrice(el.price)}</div>
                  </td>
                  <td style={{ paddingBottom: '30px' }}>{el.quantity}</td>
                  <td style={{ paddingBottom: '30px', textAlign: 'right' }}>
                    {getPrice(el.subTotal)}
                  </td>
                </tr>
              </>
            );
          })}
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <div>Tổng tiền hàng:</div>
              {isDiscount && <div>Chiết khấu:</div>}
              <div>Tổng cộng:</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>{getPrice(total)}</div>
              <div>{isDiscount && getPrice(takePrice.discount)}</div>
              <strong>{isDiscount ? getPrice(total - takePrice.discount) : getPrice(total)}</strong>
            </div>
          </div>
        </div>
        <hr style={{ marginTop: '20px', borderTop: '1px dashed' }} />
        <div style={{ display: 'grid', justifyItems: 'center', marginTop: '20px' }}>
          <Space direction="vertical" style={{ textAlign: 'center' }}>
            <Image
              width={70}
              preview={false}
              // src={STATIC_URL + '/Qrcode/tpbank.png'}
              src={`https://img.vietqr.io/image/TPB-35525378888-qr_only.png?amount=${
                isDiscount ? total - takePrice.discount : total
              }&addInfo=thanh%20toan%20hoa%20don%20${bill}`}
              crossOrigin="anonymous"
            />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <strong>STK: 3552 5378 888</strong>
              <span>CTK: Cao Thị Cẩm Tú - TP Bank</span>
            </div>
          </Space>
        </div>
        <hr />
        <div style={{ textAlign: 'center', fontSize: '12px' }}>
          <strong>Cảm ơn quý khách và hẹn gặp lại!!!</strong>
        </div>
        <hr />
        <div style={{ textAlign: 'center', fontSize: '12px' }}>
          <strong>CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ PHÁT TRIỂN VINTRIP</strong>
          <div>Địa chỉ: 292/33/15A Bình Lợi, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh</div>
          <div> SĐT: 070 472 9909 - 090 399 7705</div>
        </div>
      </div>
    </>
  );
};
export default BillTemplate;
