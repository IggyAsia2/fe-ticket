import { orderSunList } from '@/api/sunWorld/sun';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProProvider, ProTable, createIntl } from '@ant-design/pro-components';
import { Typography, Table } from 'antd';
import React, { useContext, useRef, useState } from 'react';
// import { useAccess } from '@umijs/max';
import enLocale from '@/locales/table-en';
import { getDateTime, getPrice } from '@/helper/helper';

const { Text } = Typography;

/**
 * @param fields
 */

const OrderSunList: React.FC = () => {
  // const access = useAccess();
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<SUN_SITE_API.SunSiteItem>();

  const expandedRowRender = (record: any) => {
    return (
      <ProTable
        columns={[
          { title: 'Mã vé', dataIndex: ['products', 'productCode'] },
          { title: 'Số Lượng', dataIndex: ['products', 'quantity'] },
          {
            title: 'Đơn Giá',
            dataIndex: ['products', 'unitPrice'],
            renderText: (val) => getPrice(val),
          },
          {
            title: 'Tổng',
            render: (el: any) => getPrice(el.products.quantity * el.products.unitPrice),
          },
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={record.items}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<SUN_SITE_API.SunSiteItem>[] = [
    {
      title: 'Mã Order',
      dataIndex: 'orderCode',
      fieldProps: {
        placeholder: 'Nhập tên',
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'orderUser',
      hideInSearch: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalOrderPrice',
      hideInSearch: true,
      renderText: (val) => getPrice(val),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'orderDate',
      hideInSearch: true,
      renderText: (val) => getDateTime(val),
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          {/* <a
            key="export"
            hidden={access.canMelinh && record._id !== '6578175d4549961cf866ff61'}
            onClick={() => {
              handleExportModalOpen(true);
              setCurrentRow(record);
            }}
          >
            Đặt vé
          </a> */}
        </>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<SUN_SITE_API.SunSiteItem, API.PageParams>
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
          pagination={{
            showTotal: (total) => `Tổng ${total}`,
          }}
          expandable={{ expandedRowRender, defaultExpandAllRows: true }}
          summary={(pageData) => {
            let totalSub = 0;
            pageData.forEach(({ totalOrderPrice }: any) => {
              totalSub += totalOrderPrice;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>Tổng cộng</Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Text type="success">{getPrice(totalSub)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
          toolBarRender={() => []}
          request={orderSunList}
          columns={columns}
        />
      </ProProvider.Provider>
    </PageContainer>
  );
};

export default OrderSunList;
