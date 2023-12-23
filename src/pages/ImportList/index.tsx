import { importHistoryList } from '@/api/order';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProProvider, ProTable, createIntl } from '@ant-design/pro-components';
import { useContext, useEffect, useRef } from 'react';
import enLocale from '@/locales/table-en';
import { convertArrayToObject, getDateTime } from '@/helper/helper';
import { useRequest } from '@umijs/max';
import { userList } from '@/api/user';

export type TableListItem = {
  key: number;
  name: string;
  cashiers: any;
};

export default () => {
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
          { title: 'Sku', dataIndex: 'sku' },
          { title: 'Tên vé', dataIndex: 'name' },
          { title: 'Địa điểm', dataIndex: 'bigTicket' },
          { title: 'Loại vé', dataIndex: 'unit' },
          { title: 'Số lượng', dataIndex: 'quantity' },
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={record.ticket.map((el: any) => ({ key: el._id, ...el }))}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Người nhập',
      dataIndex: 'importUser',
      valueType: 'select',
      valueEnum: userData && convertArrayToObject(userData, 'value'),
      fieldProps: {
        showSearch: true,
        // filterTreeNode: true,
        // treeNodeFilterProp: 'field',
        placeholder: 'Chọn người nhập',
      },
    },
    {
      title: 'Import ID',
      dataIndex: 'importID',
      hideInSearch: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      hideInSearch: true,
      renderText: (val: string) => getDateTime(val),
    },
  ];

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<TableListItem>
          columns={columns}
          pagination={{
            showTotal: (total) => `Tổng ${total}`,
          }}
          actionRef={actionRef}
          request={importHistoryList}
          rowKey="_id"
          expandable={{ expandedRowRender, defaultExpandAllRows: true }}
          // search={false}
        />
      </ProProvider.Provider>
    </PageContainer>
  );
};
