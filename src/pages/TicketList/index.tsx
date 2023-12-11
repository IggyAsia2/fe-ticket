import { productList } from '@/api/product';
import {
  addTicket,
  exportInven,
  removeManyTicket,
  removeTicket,
  ticketList,
  updateTicket,
} from '@/api/ticket';
import { convertArrayToObject, getPrice, CurrentUser } from '@/helper/helper';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProProvider,
  ProTable,
  createIntl,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Drawer, Popconfirm, Table, message, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import ExportForm from './components/ExportForm';
import type { FormValueType } from './components/UpdateForm';
import type { ExportFormValueType } from './components/ExportForm';
import UpdateForm from './components/UpdateForm';
import { useAccess } from '@umijs/max';
import enLocale from '@/locales/table-en';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const unit: any = {
  Adult: {
    name: 'Người lớn',
  },
  Child: {
    name: 'Trẻ em',
  },
  Elder: {
    name: 'Người cao tuổi',
  },
};

const handleAdd = async (fields: TICKET_API.TicketListItem) => {
  const hide = message.loading('Adding');
  try {
    await addTicket({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRows: TICKET_API.TicketListItem[]) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;
  try {
    if (selectedRows.length > 1) {
      await removeManyTicket({
        key: selectedRows.map((row) => row._id),
      });
    } else {
      await removeTicket(selectedRows[0]);
    }
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
// { ticketId, numberTickets }: any

const TicketList: React.FC = () => {
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const access = useAccess();
  const { data, run } = useRequest(productList, {
    manual: true,
    formatResult: (res: any) =>
      res.data.map((el: any) => {
        return { label: `${el.name}`, value: el._id };
      }),
  });

  useEffect(() => {
    run({ current: 1, pageSize: 100 });
  }, []);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [exportModalOpen, handleExportModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TICKET_API.TicketListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TICKET_API.TicketListItem[]>([]);
  const email: string | undefined = CurrentUser()?.email;

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Đang xử lý');
    let { _id, sku, name, unit, price, bigTicket, discountPrice }: any = currentRow;
    const doc: any = {};
    if (sku !== fields.sku) doc.sku = fields.sku;
    if (name !== fields.name) doc.name = fields.name;
    if (unit !== fields.unit) doc.unit = fields.unit;
    if (price !== fields.price) doc.price = fields.price;
    if (discountPrice !== fields.discountPrice) doc.discountPrice = fields.discountPrice;
    if (bigTicket?._id !== fields.bigTicket) doc.bigTicket = fields.bigTicket;
    if (Object.keys(doc).length) {
      try {
        await updateTicket({
          ...doc,
          ticketId: _id,
        });
        hide();

        message.success('Update is successful');
        return true;
      } catch (error) {
        hide();
        message.error('Update failed, please try again!');
        return false;
      }
    } else {
      hide();
      return true;
    }
  };

  const exportTicket = async (fields: ExportFormValueType) => {
    const hide = message.loading('Đang xuất vé');
    let { _id, price, discountPrice }: any = currentRow;
    try {
      await exportInven({
        data: fields,
        exportUser: email,
        numberTickets: fields.quantity,
        priceTicket: price,
        ticketId: _id,
        discountPrice,
      });
      hide();
      message.success('Đã xuất vé thành công');
      return true;
    } catch (error) {
      hide();
      message.error('Xuất vé không thành công');
      return false;
    }
  };

  const columns: ProColumns<TICKET_API.TicketListItem>[] = [
    {
      title: 'Sku',
      dataIndex: 'sku',
      valueType: 'text',
      hideInSearch: true,
      renderText: (val) => val + ',',
    },
    {
      title: 'Tên vé',
      dataIndex: 'name',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Địa điểm',
      dataIndex: 'bigTicket',
      valueType: 'select',
      fieldProps: {
        placeholder: 'Chọn địa điểm',
        showSearch: true,
        // style: { width: '400px ' },
        mode: 'multiple',
      },
      search: {
        transform: (value) => {
          if (value.length)
            return {
              bigTicket: value.toString(),
            };
        },
      },
      valueEnum: data && convertArrayToObject(data, 'value'),
      renderText: (val: { name: string }) => {
        return val.name;
      },
    },
    {
      title: 'Loại vé',
      dataIndex: 'unit',
      valueType: 'select',
      valueEnum: {
        Adult: 'Người lớn',
        Child: 'Trẻ em',
        Elder: 'Người cao tuổi',
      },
      fieldProps: {
        placeholder: 'Chọn loại vé',
      },
      // hideInSearch: true,
      renderText: (val) => {
        return unit[val].name;
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      renderText: (val: number) => {
        return getPrice(val);
      },
      hideInSearch: true,
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discountPrice',
      renderText: (val: number) => {
        return val && getPrice(val);
      },
      hideInSearch: true,
    },
    {
      title: 'Đã xuất',
      dataIndex: 'delivered',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'Chưa xuất',
      dataIndex: 'pending',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'Tổng',
      valueType: 'text',
      render: (_, record: any) => {
        return record.delivered + record.pending;
      },
      hideInSearch: true,
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
          key="update"
          hidden={!access.canAdmin}
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          Cập nhật
        </a>,
        <>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={async () => {
              await handleRemove([record]);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <a hidden={!access.canAdmin} key="delete">
              Xóa
            </a>
          </Popconfirm>
        </>,
        // <a
        //   hidden={record.pending === 0}
        //   key="export"
        //   onClick={() => {
        //     handleExportModalOpen(true);
        //     setCurrentRow(record);
        //   }}
        // >
        //   Xuất
        // </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<TICKET_API.TicketListItem, API.PageParams>
          dateFormatter="string"
          actionRef={actionRef}
          rowKey="_id"
          search={{
            defaultCollapsed: false,
            // span: 7,
            searchText: 'Tìm',
            resetText: 'Đặt lại',
            labelWidth: 'auto',
            // filterType: 'light',
          }}
          pagination={{
            showSizeChanger: true,
            // onShowSizeChange: (current, size) => `${size} / trang`,
            showTotal: (total) => `Tổng ${total} mã vé`,
            locale: { items_per_page: "" }
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              hidden={!access.canAdmin}
              onClick={() => {
                handleModalOpen(true);
              }}
            >
              <PlusOutlined /> Tạo
            </Button>,
          ]}
          request={ticketList}
          columns={columns}
          rowSelection={
            access.canAdmin && {
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }
          }
          summary={(pageData) => {
            let totalDelivered = 0;
            let totalPending = 0;
            let totalTicket = 0;
            pageData.forEach(({ delivered, pending }: any) => {
              totalDelivered += delivered;
              totalPending += pending;
              totalTicket = totalDelivered + totalPending;
            });

            return (
              <>
                <Table.Summary.Row>
                  {access.canAdmin && <Table.Summary.Cell index={0}></Table.Summary.Cell>}
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Typography.Text type="success">{totalDelivered} </Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Typography.Text type="success">{totalPending}</Typography.Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Typography.Text type="success">{totalTicket}</Typography.Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </ProProvider.Provider>

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            type="primary"
            danger
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Xóa
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value as TICKET_API.TicketListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        createModalOpen={createModalOpen}
        values={currentRow || {}}
        productList={data}
      />
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
        productList={data}
      />

      <ExportForm
        onSubmit={async (value) => {
          const success = await exportTicket(value);
          if (success) {
            handleExportModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleExportModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        exportModalOpen={exportModalOpen}
        values={currentRow || {}}
        productList={data}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TICKET_API.TicketListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TICKET_API.TicketListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TicketList;
