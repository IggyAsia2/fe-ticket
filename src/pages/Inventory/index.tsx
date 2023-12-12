import { inventoryList, removeInven, removeManyInven } from '@/api/inventory';
import { productList } from '@/api/product';
import { ticketList2 } from '@/api/ticket';
import ExcelReader from '@/helper/ExcelReader';
import { convertArrayToCascader, getDate, getDateTime } from '@/helper/helper';
import enLocale from '@/locales/table-en';
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
import { Button, Drawer, Tag, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const state: any = {
  Delivered: {
    name: 'Đã xuất',
    color: 'red',
  },
  Pending: {
    name: 'Chưa xuất',
    color: 'green',
  },
};

const handleRemove = async (selectedRows: INVEN_API.InvenListItem[]) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;
  try {
    if (selectedRows.length > 1) {
      await removeManyInven({
        key: selectedRows.map((row) => row._id),
      });
    } else {
      await removeInven(selectedRows[0]);
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

const InventoryList: React.FC = () => {
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const { data, run } = useRequest(productList, {
    manual: true,
    formatResult: (res: any) => res.data,
  });

  const { data: data2, run: run2 } = useRequest(ticketList2, {
    manual: true,
    formatResult: (res: any) =>
      res.data.map((el: any) => {
        return {
          sku: el.sku,
          id: el._id,
        };
      }),
  });

  useEffect(() => {
    run({ current: 1, pageSize: 100 });
    run2({ current: 1, pageSize: 100, fields: '_id,sku' });
  }, []);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<INVEN_API.InvenListItem>();
  const [selectedRowsState, setSelectedRows] = useState<INVEN_API.InvenListItem[]>([]);

  const columns: ProColumns<INVEN_API.InvenListItem>[] = [
    {
      title: 'Sản phẩm',
      dataIndex: 'groupTicket',
      valueType: 'cascader',
      fieldProps: {
        options: data && convertArrayToCascader(data),
        fieldNames: {
          children: 'ticket',
          label: 'field',
        },
        expandTrigger: 'hover',
        changeOnSelect: true,
        placeholder: 'Chọn sản phẩm',
        // multiple: true,
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
      render: (_, record: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            <div>{record.groupTicket.name}</div>
            <div>
              {record.groupTicket.sku} - {record.groupTicket.unit}
            </div>
          </a>
        );
      },
    },
    {
      title: 'Lô vé nhập',
      hideInSearch: true,
      render: (_, record: any) => {
        return (
          <div>
            <div>
              {record.purchaseId} - {record.importUser}
            </div>
            <div>{getDateTime(record.createdAt)}</div>
          </div>
        );
      },
    },
    {
      title: 'Mã vé',
      valueType: 'text',
      render: (_, record: any) => {
        return (
          <div>
            <div>Serial: {record.serial}</div>
          </div>
        );
      },
      hideInSearch: true,
    },
    {
      title: 'Hiệu lực',
      hideInSearch: true,
      render: (_, record: any) => {
        return (
          <div>
            <div>{getDate(record.activatedDate)}</div>
            <div>{getDate(record.expiredDate)}</div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        Delivered: 'Đã xuất',
        Pending: 'Chưa xuất',
      },
      fieldProps: {
        placeholder: 'Chọn trạng thái vé',
      },
      render: (_, record: any) => (
        <div>
          <Tag color={state[record.state].color} key={state[record.state].name}>
            {state[record.state].name}
          </Tag>
          <div>{record.issuedDate && getDate(record.issuedDate)}</div>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<INVEN_API.InvenListItem, API.PageParams>
          pagination={{
            // pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} vé`,
            locale: { items_per_page: "" }
          }}
          dateFormatter="string"
          actionRef={actionRef}
          rowKey="_id"
          search={{
            labelWidth: 120,
            defaultCollapsed: false,
            searchText: 'Tìm',
            resetText: 'Đặt lại',
            collapseRender: () => {
              return true;
            },
          }}
          toolBarRender={() => [
            <>
              <ExcelReader checkData={data2} actionRef={actionRef} />
            </>,
          ]}
          request={inventoryList}
          columns={columns}
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
          <ProDescriptions<INVEN_API.InvenListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<INVEN_API.InvenListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default InventoryList;
