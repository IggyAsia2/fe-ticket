import { productList } from '@/api/product';
import { userList } from '@/api/user';
import { rangePresets } from '@/components/Table/constValue';
import {
  convertArrayToCascader,
  convertArrayToObject,
  convertDepartToCascader,
  getPrice,
  timeStamp,
} from '@/helper/helper';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProProvider, ProTable, createIntl } from '@ant-design/pro-components';
import { request, useAccess, useModel, useRequest } from '@umijs/max';
import { Button, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import { getAuth } from '@/services/authHelper';
import enLocale from '@/locales/table-en';
const { Text } = Typography;

/**
 * @param fields
 */

const state: any = {
  Finished: {
    name: 'Hoàn thành',
    color: 'Green',
  },
  Canceled: {
    name: 'Hủy',
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
  },
  Child: {
    name: 'Trẻ em',
  },
  Elder: {
    name: 'Người cao tuổi',
  },
};

const valueEnum = {
  false: { text: 'Vintrip' },
  true: { text: 'Đại Lý' },
};

const ReportList: React.FC = () => {
  const access = useAccess();
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const { initialState } = useModel('@@initialState');
  const { departList }: any = initialState;
  const [excelData, setExcelData] = useState<string[]>([]);
  const [isAgent, setIsAgent] = useState<boolean>(false);
  const { data: userData, run: runUser } = useRequest(userList, {
    manual: true,
    formatResult: (res: any) =>
      res.data.map((el: any) => {
        return { label: `${el.name}`, value: el.email };
      }),
  });

  const { data: productData, run: runProduct } = useRequest(productList, {
    manual: true,
    formatResult: (res: any) => res.data,
  });

  useEffect(() => {
    // runReport({ current: 1, pageSize: 1000 });
    runProduct({ current: 1, pageSize: 100 });
  }, []);
  useEffect(() => {
    runUser({ current: 1, pageSize: 100, isAgent: isAgent });
  }, [isAgent]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ORDER_API.OrderListItem>[] = [
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
        defaultValue: [dayjs(), dayjs()],
      }),
      search: {
        transform: (value: any) => ({
          'updatedAt[gte]': timeStamp(value[0]),
          'updatedAt[lte]': moment(value[1], 'DD/MM/YYYY').add(1, 'days').toISOString(),
          // sort: 'updatedAt',
        }),
      },
      render: () => null,
    },
    {
      title: 'Tên người xuất',
      dataIndex: 'exportUser',
      valueType: 'select',
      hideInSearch: !access.canAdmin,
      valueEnum: userData && convertArrayToObject(userData, 'value'),
      fieldProps: {
        showSearch: true,
        placeholder: 'Chọn người xuất vé',
      },
    },
    {
      // title: 'Lọc',
      dataIndex: 'isAgent',
      hideInTable: true,
      hideInSearch: !access.canAdmin,
      valueType: 'radioButton',
      initialValue: 'false',
      fieldProps: {
        onChange: (e: any) => {
          setIsAgent(e.target.value);
        },
      },
      width: 100,
      valueEnum,
    },
    {
      title: 'Loại vé',
      dataIndex: 'groupTicket',
      valueType: 'cascader',
      fieldProps: {
        options: productData && convertArrayToCascader(productData),
        fieldNames: {
          children: 'ticket',
          label: 'field',
        },
        // expandTrigger: 'hover',
        changeOnSelect: true,
        placeholder: 'Chọn địa điểm',
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
        return record.groupTicket.bigTicket.name;
      },
    },
    {
      title: 'Loại vé',
      hideInSearch: true,
      render: (_, record: any) => {
        return `${record.groupTicket.name} - ${unit[record.groupTicket.unit].name}`;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      hideInSearch: true,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      hideInSearch: true,
      renderText: (val) => getPrice(val),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'subTotal',
      hideInSearch: true,
      renderText: (value) => getPrice(value),
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discountPrice',
      hideInSearch: true,
      renderText: (val) => getPrice(val),
    },
    {
      title: 'Tổng CK',
      dataIndex: 'discountSubtotal',
      hideInSearch: true,
      renderText: (value) => getPrice(value),
    },
    {
      title: 'Tổng thu',
      hideInSearch: true,
      render: (_, record: any) => getPrice(record.subTotal - record.discountSubtotal),
    },
    // {
    //   title: 'Ngày xuất vé',
    //   dataIndex: 'updatedAt',
    //   hideInSearch: true,
    //   renderText: (value) => getDateTime(value),
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
        placeholder: 'Chọn trạng thái',
        defaultValue: 'Hoàn Thành',
      },
      render: (_, record: any) => (
        <div>
          <Tag color={state[record.state].color} key={state[record.state].name}>
            {state[record.state].name}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Quầy vé',
      dataIndex: 'departID',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: convertDepartToCascader(departList),
        placeholder: 'Chọn quầy vé',
      },
      hideInSearch: access.canAgent,
    },
  ];

  const columns2: any = [
    {
      title: 'Tên người xuất',
      dataIndex: 'exportUser',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'groupTicket',
      render: (_: any, record: any) => record.groupTicket.bigTicket.name,
    },
    {
      title: 'Loại vé',
      dataIndex: 'unit',
      render: (_: any, record: any) =>
        `${record.groupTicket.name} - ${unit[record.groupTicket.unit].name}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
    },
    {
      title: 'Tổng',
      dataIndex: 'subTotal',
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discountPrice',
    },
    {
      title: 'Tổng CK',
      dataIndex: 'discountSubtotal',
    },
    {
      title: 'Tổng thu',
      render: (_: any, record: any) => record.subTotal - record.discountSubtotal,
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
      // .setRowHeight(2, 'cm')
      .addColumns(columns2)
      .addDataSource(excelData, {
        str2Percent: true,
      })
      .saveAs('Report-File.xlsx');
  };

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<ORDER_API.OrderListItem, API.PageParams>
          pagination={{
            pageSize: 1000,
            showTotal: (total) => `Tổng ${total}`,
            // showSizeChanger: true,
          }}
          toolBarRender={() => [
            <>
              <Button type="primary" onClick={() => handleExporttoExcel()}>
                Xuất file
              </Button>
            </>,
          ]}
          dateFormatter="string"
          actionRef={actionRef}
          rowKey="_id"
          search={{
            labelWidth: 100,
            defaultCollapsed: false,
            searchText: 'Tìm',
            resetText: 'Đặt lại',
            collapseRender: () => {
              return true;
            },
          }}
          request={async (
            params: {
              // query
              /** Current page number */
              current?: number;
              /** Page size */
              pageSize?: number;
              exportUser?: string;
              state?: string;
              'updatedAt[gte]'?: string;
              'updatedAt[lte]'?: string;
            },
            options?: { [key: string]: any },
          ) => {
            const getState = !params.state ? '&state=Finished' : '';

            const getGte = !params['updatedAt[gte]']
              ? `&updatedAt[gte]=${timeStamp(dayjs().format('DD/MM/YYYY'))}`
              : '';
            const getLte = !params['updatedAt[lte]']
              ? `&updatedAt[lte]=${timeStamp(dayjs().add(1, 'day').format('DD/MM/YYYY'))}`
              : '';
            const result: any = await request<ORDER_API.OrderList>(
              `${API_URL}/orders/report?sort=updatedAt${getState}${getGte}${getLte}`,
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
          // dataSource={reportData}
          columns={columns}
          summary={(pageData) => {
            let totalSub = 0;
            let totalQuantity = 0;
            let totalDis = 0;
            pageData.forEach(({ subTotal, discountSubtotal, quantity, state }: any) => {
              totalQuantity += state === 'Finished' && quantity;
              totalSub += state === 'Finished' && subTotal;
              totalDis += state === 'Finished' && discountSubtotal;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>Tổng cộng</Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Text type="success">{totalQuantity} vé</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Text type="success">{getPrice(totalSub)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={0}></Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Text type="success">{getPrice(totalDis)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={0}>
                    <Text type="success">{getPrice(totalSub - totalDis)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </ProProvider.Provider>
    </PageContainer>
  );
};

export default ReportList;
