import { ModalForm, ProFormSelect, ProFormDigit } from '@ant-design/pro-components';
import { Typography, Button, Space, message } from 'antd';
import { getProductToLink } from '@/api/product';
import { useRequest } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { convertDepartToC, getPrice } from '@/helper/helper';
import { useReactToPrint } from 'react-to-print';
import { PrinterFilled } from '@ant-design/icons';
import Cookies from 'js-cookie';
import BillTemplate from './billTemplate';
import TicketPrintTemplate from '@/helper/ticketPrintTemplate';
const { Text } = Typography;

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
            {/* <Button
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
            </Button> */}
            {/* <Space direction="horizontal">
              <ProFormSelect
                style={{ width: '200px' }}
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
            </Space> */}
          </Space>
        }
      >
        {/* <div style={{ display: 'none' }}>
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
        </div> */}
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
                        <TicketPrintTemplate
                          item={item}
                          index={index}
                          logo={logo}
                          groupTicket={groupTicket}
                          itnu={itnu}
                          heightNote={heightNote}
                          place={place}
                          bookDate={bookDate}
                          price={price}
                          manual={manual}
                          note={note}
                          orderId={orderId}
                          bigItem={bigItem}
                        />
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
