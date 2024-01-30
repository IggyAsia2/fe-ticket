import { getPrice, unit } from '@/helper/helper';
import { ModalForm, ProFormMoney } from '@ant-design/pro-components';
import { Col, List, Row, Typography } from 'antd';
import React, { useState } from 'react';

const { Link } = Typography;

export type DiscountFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: any, curNum: number, bigID: string) => Promise<void>;
  discountModalOpen: boolean;
  values: any;
  currentRow: any;
};

const DiscountForm: React.FC<DiscountFormProps> = (props) => {
  const [groupTicket, setGroupTicket] = useState([]);
  const [currentList, setCurrentList] = useState<any>({});
  const [click, setClick] = useState<string>('');
  const [bigID, setBigID] = useState<string>('');
  const discountList = props.currentRow.discountList;

  return (
    <ModalForm
      width={900}
      open={props.discountModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          props.onCancel();
          setGroupTicket([]);
          setClick('');
          setBigID('');
          setCurrentList({});
        },
        cancelText: 'Hủy',
        okText: 'Cập nhật',
      }}
      onFinish={(value) => props.onFinish(value, groupTicket.length, bigID)}
      title="Tùy chỉnh chiết khấu"
    >
      <Row gutter={20}>
        <Col span={8}>
          <div
            style={{
              height: 500,
              overflow: 'auto',
              padding: '0 10px',
              border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
          >
            <List
              header={<div>Chọn khu vui chơi</div>}
              className="demo-loadmore-list"
              itemLayout="horizontal"
              // dataSource={groupTickets && groupTickets.filter((el: any) => el.price !== 1)}
              dataSource={props.values}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link
                        key={item._id}
                        onClick={() => {
                          const checkList = discountList.find((el: any) => el.bigID === item._id);
                          setGroupTicket(item.groupTickets.filter((el: any) => el.price !== 1));
                          if (checkList) {
                            setCurrentList(checkList.list);
                          }
                          setClick(item.name);
                          setBigID(item._id);
                        }}
                      >
                        - {item.name}
                      </Link>
                    }
                    // description={`${getPrice(item.price)} (${unit[item.unit].name})`}
                  />
                </List.Item>
              )}
            />
          </div>
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
                    width: '98%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>Nhập số tiền chiết khấu</div>
                  <div>
                    <b>{click}</b>
                  </div>
                </div>
              }
              className="demo-loadmore-list"
              itemLayout="horizontal"
              // dataSource={groupTickets && groupTickets.filter((el: any) => el.price !== 1)}
              dataSource={groupTicket}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <>
                      <ProFormMoney
                        key={item._id}
                        name={[item._id]}
                        placeholder="Nhập chiết khấu"
                        min={0}
                        initialValue={currentList && currentList[item._id]}
                        locale="vi-VN"
                      />
                    </>,
                  ]}
                >
                  <List.Item.Meta
                    title={`- ${item.name}`}
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

export default DiscountForm;
