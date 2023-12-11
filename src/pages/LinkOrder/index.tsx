import { getOrder } from '@/api/order';
import { getProductToLink } from '@/api/product';
import TicketPrintTemplate from '@/helper/ticketPrintTemplate';
import { PrinterFilled } from '@ant-design/icons';
import { useParams, useRequest } from '@umijs/max';
import { Button, Space } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

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
      </>
    );
  }
};

export default LinkOrder;
