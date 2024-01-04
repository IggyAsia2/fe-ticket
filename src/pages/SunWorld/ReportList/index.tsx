import { reportSunList } from '@/api/sunWorld/sun';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProProvider, ProTable, createIntl } from '@ant-design/pro-components';
import { Typography, Table } from 'antd';
import React, { useContext, useEffect, useRef } from 'react';
// import { useAccess } from '@umijs/max';
import enLocale from '@/locales/table-en';
import { convertArrayToObject, getPrice, timeStamp } from '@/helper/helper';
import { useRequest } from '@umijs/max';
import { userList } from '@/api/user';
import { rangePresets } from '@/components/Table/constValue';
import moment from 'moment';

const { Text } = Typography;

/**
 * @param fields
 */

const ReportSunList: React.FC = () => {
  // const access = useAccess();
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);

  const actionRef = useRef<ActionType>();

  const { data: userData, run: runUser } = useRequest(userList, {
    manual: true,
    formatResult: (res: any) =>
      res.data.map((el: any) => {
        return { label: `${el.name}`, value: el.email };
      }),
  });

  useEffect(() => {
    runUser({ current: 1, pageSize: 100 });
  }, []);

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
      title: 'Người tạo',
      dataIndex: 'orderUser',
      valueType: 'select',
      valueEnum: userData && convertArrayToObject(userData, 'value'),
      fieldProps: {
        showSearch: true,
        placeholder: 'Chọn người xuất',
      },
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
          'orderDate[gte]': timeStamp(value[0]),
          'orderDate[lte]': moment(value[1], 'DD/MM/YYYY').add(1, 'days').toISOString(),
          sort: '-orderDate',
        }),
      },
      render: () => null,
    },
    // {
    //   title: 'Tùy chọn',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => [
    //     <>
    //       {/* <a
    //         key="export"
    //         hidden={access.canMelinh && record._id !== '6578175d4549961cf866ff61'}
    //         onClick={() => {
    //           handleExportModalOpen(true);
    //           setCurrentRow(record);
    //         }}
    //       >
    //         Đặt vé
    //       </a> */}
    //     </>,
    //   ],
    // },
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
          request={reportSunList}
          columns={columns}
        />
      </ProProvider.Provider>
    </PageContainer>
  );
};

export default ReportSunList;
