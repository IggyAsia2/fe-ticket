import {
  updateAgentOrder,
  updateManyAgentOrder,
  cancelOrder,
  cancelManyOrder,
  reduceOrder,
  // sendMailOrder,
} from '@/api/order';
import { productList } from '@/api/product';
import { rangePresets } from '@/components/Table/constValue';
import {
  convertArrayToCascader,
  convertArrayToObject,
  convertArrayToObjectDepart,
  convertSubUserToList,
  getDate,
  getDateTime,
  getPrice,
  timeStamp,
} from '@/helper/helper';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProProvider,
  ProTable,
  createIntl,
} from '@ant-design/pro-components';
import { request, useRequest, useAccess, useModel } from '@umijs/max';
import { Button, InputNumber, Popconfirm, Space, Tag, Typography, message } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
// import LinkForm from './components/LinkForm';
import { getAuth } from '@/services/authHelper';
import { userList } from '@/api/user';
import ManyLinkForm from './components/ManyLinkForm';
import enLocale from '@/locales/table-en';

/**
 * @param fields
 */

const state: any = {
  Finished: {
    name: 'Hoàn thành',
    color: 'Green',
  },
  Canceled: {
    name: 'Đã Hủy',
    color: 'red',
  },
  Pending: {
    name: 'Pending',
    color: 'yellow',
  },
};

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

const OrderList: React.FC = () => {
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { departList, currentUser }: any = initialState;
  const subUserCheck: any = convertArrayToObjectDepart(currentUser.subUser, '_id');
  // const newArrDepart = departList
  //   .map((value: any) => value.cashiers.map((child: any) => ({ name: child.name, id: child._id })))
  //   .flat();

  // const departCheck: any = convertArrayToObjectDepart(newArrDepart, 'id');
  const { data: productData, run: runProduct } = useRequest(productList, {
    manual: true,
    formatResult: (res: any) => res.data,
  });
  const { data: userData, run: runUser } = useRequest(userList, {
    manual: true,
    formatResult: (res: any) =>
      res.data.map((el: any) => {
        return { label: `${el.name}`, value: el.email };
      }),
  });

  useEffect(() => {
    runProduct({ current: 1, pageSize: 100 });
    runUser({ current: 1, pageSize: 100, isAgent: true });
  }, []);

  const access = useAccess();
  const [takePrice, setTakePrice] = useState<any>({
    total: 0,
    discount: 0,
  });
  const [newQuan, setNewQuan] = useState<any>(null);
  const [excelData, setExcelData] = useState<string[]>([]);
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<ORDER_API.OrderListItem>();
  const [selectedRowsState, setSelectedRows] = useState<ORDER_API.OrderListItem[]>([]);
  const [linkRow, setLinkRow] = useState<ORDER_API.OrderListItem[]>([]);
  // const [linkModalOpen, handleLinkModalOpen] = useState<boolean>(false);
  const [manyLinkModalOpen, handleManyLinkModalOpen] = useState<boolean>(false);

  const handleFinished = async (selectedRows: ORDER_API.OrderListItem[], state: string) => {
    const hide = message.loading('Đang xử lý');
    try {
      if (state === 'Canceled') {
        if (selectedRows.length > 1) {
          await cancelManyOrder({
            key: selectedRows.map((row) => row._id),
          });
        } else {
          await cancelOrder({
            oid: selectedRows[0]._id,
          });
        }
        hide();

        message.success('Đã hủy đơn hàng!');
      } else {
        if (selectedRows.length > 1) {
          await updateManyAgentOrder({
            key: selectedRows.map((row) => row._id),
          });
        } else {
          try {
            await updateAgentOrder({
              oid: selectedRows[0]._id,
              state,
            });
            message.success('Xác nhận đơn hàng thành công!');
          } catch (error) {
            message.error('Xác nhận đơn hàng không thành công!');
          }
          setSelectedRows([]);
        }
        hide();
      }

      return true;
    } catch (error) {
      hide();
      message.error('Đã có lỗi xảy ra, vui lòng thử lại!');
      return false;
    }
  };

  const handleReduceOrder = async (selectedRows: ORDER_API.OrderListItem[], newQuan: number) => {
    const hide = message.loading('Đang xử lý');
    const { price: currentPrice, quantity: currentQuantity, discountPrice }: any = selectedRows[0];
    if (newQuan === currentQuantity) {
      hide();
      message.success('Đã cập nhật đơn hàng thành công!');
      setNewQuan(null);
      return true;
    } else {
      try {
        await reduceOrder({
          oid: selectedRows[0]._id,
          rmQuan: currentQuantity - newQuan,
          newQuan,
          newSubtotal: newQuan * currentPrice,
          newDiscountTotal: newQuan * discountPrice,
        });
        hide();
        message.success('Đã cập nhật đơn hàng thành công!');
        setNewQuan(null);
        return true;
      } catch (error) {
        hide();
        message.error('Đã có lỗi xảy ra, vui lòng thử lại!');
        setNewQuan(null);
        return false;
      }
    }
  };

  // const handleSendEmail = async (record: any) => {
  //   const hide = message.loading('Đang tạo');
  //   try {
  //     await sendMailOrder({
  //       email: record.customerEmail,
  //       subject: record.groupTicket.name,
  //       html: `<button>asdaskdlk</button>`
  //     });
  //     hide();
  //     message.success('Tạo thành công');
  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('Tạo thất bại, xin vui lòng thử lại!');
  //     return false;
  //   }
  // };

  const columns2 = [
    {
      title: 'Mã ĐH',
      dataIndex: 'orderId',
    },
    {
      title: 'Ngày xuất vé',
      dataIndex: 'updatedAt',
      render: (_: any, record: any) => getDate(record.updatedAt),
    },
    {
      title: 'Đại diện',
      dataIndex: 'customerName',
      render: (_: any, record: any) => `${record.customerName} - ${record.customerPhone}`,
    },
    {
      title: 'Người xuất',
      dataIndex: 'departID',
      render: (record: string) => `${subUserCheck[record]}`,
    },
    {
      title: 'Đia điểm',
      dataIndex: ['groupTicket', 'bigTicket', 'name'],
    },
    {
      title: 'Sku',
      dataIndex: ['groupTicket', 'sku'],
    },
    {
      title: 'Loại vé',
      dataIndex: 'groupTicket',
      render: (_: any, record: any) => `${record.groupTicket.name} - ${record.groupTicket.unit}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
    },
    {
      title: 'Tổng',
      dataIndex: 'subTotal',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      render: (_: any, record: any) => state[record.state].name,
    },
  ];

  const handleExporttoExcel = async () => {
    const excel = await new Excel();
    excel
      .addSheet('Sheet')
      .addColumns(columns2)
      .addDataSource(excelData, {
        str2Percent: true,
      })
      .saveAs('Order-File.xlsx');
  };

  const columns: ProColumns<ORDER_API.OrderListItem>[] = [
    {
      title: 'Tên người xuất',
      dataIndex: 'exportUser',
      valueType: 'select',
      valueEnum: userData && convertArrayToObject(userData, 'value'),
      hideInTable: true,
      hideInSearch: !access.canAdmin,
      fieldProps: {
        showSearch: true,
        // filterTreeNode: true,
        // treeNodeFilterProp: 'field',
        placeholder: 'Chọn người xuất',
      },
      render: () => null,
    },
    {
      title: 'Địa điểm',
      dataIndex: 'groupTicket',
      hideInTable: true,
      valueType: 'cascader',
      fieldProps: {
        options: productData && convertArrayToCascader(productData),
        placeholder: 'Chọn địa điểm',
        fieldNames: {
          children: 'ticket',
          label: 'field',
        },
        // expandTrigger: 'hover',
        changeOnSelect: true,
      },
      search: {
        transform: (value) => {
          if (value.length === 2) {
            return {
              groupTicket: value[1],
            };
          } else {
            return {
              bigTicket: value,
            };
          }
        },
      },
      render: () => null,
    },
    {
      title: 'Người xuất',
      dataIndex: 'departID',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: convertSubUserToList(currentUser.subUser),
        placeholder: 'Chọn quầy vé',
      },
    },
    {
      title: 'Ngày xuất vé',
      dataIndex: 'updatedAt',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: () => ({
        format: 'DD/MM/YYYY',
        // span: 20,
        presets: rangePresets,
        placeholder: ['Từ ngày', 'Đến ngày'],
      }),
      search: {
        transform: (value: any) => ({
          'updatedAt[gte]': timeStamp(value[0]),
          'updatedAt[lte]': moment(value[1], 'DD/MM/YYYY').add(1, 'days').toISOString(),
          sort: 'updatedAt',
        }),
      },
      render: () => null,
    },
    {
      title: 'Mã ĐH',
      dataIndex: 'orderId',
      valueType: 'digit',
      fieldProps: {
        placeholder: 'Nhập mã đơn hàng',
      },
      render: (_, record: any) => {
        return (
          <div>
            <div>
              {record.orderId} - {getDateTime(record.updatedAt)}
            </div>
            <div>{record.exportUser.split('@')[0]}</div>
          </div>
        );
      },
    },
    {
      title: 'Sđt KH',
      dataIndex: 'customerPhone',
      hideInTable: true,
      fieldProps: {
        placeholder: 'Nhập sđt khách hàng',
      },
    },
    // {
    //   title: 'Biến số xe',
    //   dataIndex: 'customerCar',
    //   hideInTable: true,
    //   fieldProps: {
    //     placeholder: 'Nhập biển số xe',
    //   },
    // },
    {
      title: 'Khách hàng',
      width: '150px',
      valueType: 'text',
      hideInSearch: true,
      fieldProps: {
        placeholder: 'Nhập biển số xe',
      },
      render: (_, record: any) => {
        return (
          <div>
            <div>{record.customerName}</div>
            <div>{record.customerCar}</div>
            <div>{record.customerPhone}</div>
          </div>
        );
      },
      // hideInSearch: true,
    },
    {
      title: 'Người xuất',
      dataIndex: 'departID',
      width: '100px',
      valueType: 'text',
      renderText: (record: string) => {
        return subUserCheck[record];
      },
      hideInSearch: true,
    },
    {
      title: 'Loại vé',
      hideInSearch: true,
      render: (_, record: any) => {
        const meo = record.groupTicket;
        return (
          <div>
            <div>
              {meo.sku} - {meo.name}
            </div>
            <div>
              <b>{meo.bigTicket.name}</b> - {getPrice(record.price)} - {getDate(record.bookDate)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Tổng',
      hideInSearch: true,
      render: (_, record: any) => {
        const meo = record.groupTicket;
        return (
          <div>
            <div>
              {record.quantity}({unit[meo.unit].name})
            </div>
            <div>{getPrice(record.subTotal)}</div>
          </div>
        );
      },
    },
    // {
    //   title: 'Chiết khấu',
    //   hideInSearch: true,
    //   render: (_, record: any) => {
    //     return (
    //       <div>
    //         <div>{`${record.quantity} x ${getPrice(record.discountPrice)}`}</div>
    //         <div>{getPrice(record.discountSubtotal)}</div>
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        Finished: 'Hoàn thành',
        Canceled: 'Hủy',
        Pending: 'Pending',
      },
      fieldProps: {
        placeholder: 'Chọn trạng thái đơn hàng',
        style: {
          // backgroundColor: 'red',
        },
      },
      render: (_, record: any) => {
        return {
          props: {
            style: { textAlign: 'center' },
          },
          children: [
            <>
              <Space direction="vertical" size="small">
                <Tag
                  style={{ width: '80px', textAlign: 'center' }}
                  color={state[record.state].color}
                  key={state[record.state].name}
                >
                  {state[record.state].name}
                </Tag>
                <div>
                  <Popconfirm
                    title={
                      <>
                        <Typography.Title level={5}>Nhập lại số vé cần xuất</Typography.Title>
                        <InputNumber
                          style={{ width: '100%' }}
                          min={1}
                          max={record.quantity}
                          value={newQuan}
                          onChange={(e) => setNewQuan(e)}
                        />
                      </>
                    }
                    cancelText="Hủy"
                    okButtonProps={{
                      disabled: !newQuan,
                    }}
                    onCancel={() => setNewQuan(null)}
                    onConfirm={async () => {
                      const success = await handleReduceOrder([record], newQuan);
                      if (success) {
                        setSelectedRows([]);
                        if (actionRef.current) {
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        }
                      }
                    }}
                  >
                    <a hidden={record.state !== 'Pending' || record.quantity === 1} key="success">
                      Cập nhật
                    </a>
                  </Popconfirm>
                </div>
              </Space>
            </>,
          ],
        };
      },
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <>
          <Popconfirm
            title="Bạn chắc chắn muốn xác nhận đơn hàng này?"
            onConfirm={async () => {
              const realMoney = record.subTotal - record.discountSubtotal;
              const success = await handleFinished([record], 'Finished');
              if (success) {
                setSelectedRows([]);
                if (actionRef.current) {
                  if (currentUser?.moneny > realMoney) {
                    setInitialState((s: any) => ({
                      ...s,
                      currentUser: {
                        ...s?.currentUser,
                        moneny: s?.currentUser?.moneny - realMoney,
                      },
                    }));
                  }
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }
            }}
          >
            <a hidden={record.state !== 'Pending'} key="success">
              Xác nhận
            </a>
          </Popconfirm>
        </>,
        <>
          <Popconfirm
            title="Bạn chắc chắn muốn hủy đơn hàng này?"
            onConfirm={async () => {
              const success = await handleFinished([record], 'Canceled');
              if (success) {
                if (actionRef.current) {
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }
            }}
          >
            <a hidden={record.state !== 'Pending'} key="delete">
              Hủy
            </a>
          </Popconfirm>
        </>,
        <a
          hidden={record.state !== 'Finished'}
          key="mail"
          href={`/agent/printticketlink/${record._id}-${record.groupTicket.bigTicket.id}`}
          target="_blank"
          rel="noreferrer"
        >
          Link
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<ORDER_API.OrderListItem, API.PageParams>
          pagination={{
            // pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
            locale: { items_per_page: '' },
          }}
          // scroll={{ y: 440 }}
          dateFormatter="string"
          actionRef={actionRef}
          rowKey={(record) => {
            return record.state + ',' + record._id;
          }}
          search={{
            labelWidth: 100,
            defaultCollapsed: false,
            searchText: 'Tìm',
            resetText: 'Đặt lại',
            collapseRender: () => {
              return true;
            },
          }}
          toolBarRender={() => [
            <>
              <Button hidden={access.canSale} type="primary" onClick={() => handleExporttoExcel()}>
                Xuất file
              </Button>
            </>,
          ]}
          request={async (params: any, options?: { [key: string]: any }) => {
            Object.keys(params).forEach((key: any) => {
              if (params[key] === '') {
                delete params[key];
              }
            });
            const result: any = await request<ORDER_API.OrderList>(
              `${API_URL}/orders?isAgent=true`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${getAuth()}`,
                },
                params: {
                  ...params,
                },
                ...(options || {}),
              },
            );
            setExcelData(result?.data);
            return result;
          }}
          columns={columns}
          tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
            const subtotal = selectedRows.reduce((pre, item: any) => pre + item.subTotal, 0);
            const subdiscount = selectedRows.reduce(
              (pre, item: any) => pre + item.discountSubtotal,
              0,
            );
            return (
              <Space size={24}>
                <span>
                  Chọn {selectedRowKeys.length} đơn
                  <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                    Bỏ chọn
                  </a>
                </span>
                <span>{`Tổng: ${getPrice(subtotal)}`}</span>
                <span>-</span>
                <span>{`Chiết khấu: ${getPrice(subdiscount)}`}</span>
                <span>=</span>
                <span>{`${getPrice(subtotal - subdiscount)}`}</span>
              </Space>
            );
          }}
          tableAlertOptionRender={({ selectedRows }) => {
            if (selectedRows.every((el) => el.state === 'Finished'))
              return (
                <Space size={16}>
                  <Button
                    type="default"
                    color="#34ebc0"
                    onClick={() => {
                      setLinkRow(selectedRowsState);
                      handleManyLinkModalOpen(true);
                    }}
                  >
                    Link
                  </Button>
                </Space>
              );
          }}
          rowSelection={{
            onChange: (_, selectedRows: any) => {
              const total = selectedRows.reduce((accumulator: any, b: any) => {
                return accumulator + b.subTotal;
              }, 0);
              const discount = selectedRows.reduce((accumulator: any, b: any) => {
                return accumulator + b.discountSubtotal;
              }, 0);
              setTakePrice({
                total,
                discount,
              });
              setSelectedRows(selectedRows);
            },
            getCheckboxProps: (record) => ({
              disabled: record.state === 'Canceled', // Column configuration not to be checked
              // name: record.email,
            }),
          }}
        />
      </ProProvider.Provider>

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          {selectedRowsState.every((el) => el.state === 'Pending') && (
            <>
              {/* <Popconfirm
                title="Bạn chắc chắn muốn xác nhận đơn hàng này?"
                onConfirm={async () => {
                  await handleFinished(selectedRowsState, 'Finished');
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="primary">Xác nhận</Button>
              </Popconfirm> */}
              <Popconfirm
                title="Bạn chắc chắn muốn hủy đơn hàng này?"
                onConfirm={async () => {
                  await handleFinished(selectedRowsState, 'Canceled');
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="primary" danger>
                  Hủy đơn
                </Button>
              </Popconfirm>
            </>
          )}
          {/* {selectedRowsState.every((el) => el.state === 'Finished') && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setLinkRow(selectedRowsState);
                  handleManyLinkModalOpen(true);
                }}
              >
                Link
              </Button>
            </>
          )} */}
        </FooterToolbar>
      )}

      {/* <LinkForm
        onCancel={() => {
          handleLinkModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        linkModalOpen={linkModalOpen}
        values={currentRow || {}}
        unit={unit}
        departList={departList}
      /> */}

      <ManyLinkForm
        onCancel={() => {
          handleManyLinkModalOpen(false);
          // if (!showDetail) {
          setLinkRow([]);
          // }
        }}
        manyLinkModalOpen={manyLinkModalOpen}
        values={linkRow || {}}
        unit={unit}
        takePrice={takePrice}
        departList={departList}
      />

      {/* <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.orderId && (
          <ProDescriptions<ORDER_API.OrderListItem>
            column={1}
            title={currentRow?.orderId}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.orderId,
            }}
            columns={columns.slice(3) as ProDescriptionsItemProps<ORDER_API.OrderListItem>[]}
          />
        )}
      </Drawer> */}
    </PageContainer>
  );
};

export default OrderList;
