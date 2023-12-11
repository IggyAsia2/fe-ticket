import { PlusOutlined } from '@ant-design/icons';
import {
  addDepart,
  departList,
  removeCashier,
  removeDepart,
  updateDepart,
  updateCashier,
} from '@/api/depart';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProProvider, ProTable, createIntl } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useContext, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CreateCashierForm from './components/CreateCashierForm';
import UpdateCashierForm from './components/UpdateCashierForm';
import enLocale from '@/locales/table-en';

export type TableListItem = {
  key: number;
  name: string;
  cashiers: any;
};

const handleAdd = async (fields: DEPART_API.DepartListItem) => {
  const hide = message.loading('Adding');
  try {
    await addDepart({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRows: PRODUCT_API.ProductListItem[]) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;
  try {
    await removeDepart(selectedRows[0]);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const handleRemoveCashier = async (departID: string, cashierID: string) => {
  const hide = message.loading('Deleting');
  try {
    await removeCashier({ departID, cashierID });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

export default () => {
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<DEPART_API.DepartListItem>();
  const [currentCashier, setCurrentCashier] = useState<DEPART_API.DepartListItem>();
  const [currentDepartID, setCurrentDepartID] = useState<any>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [createCashierModal, handleCashierModalOpen] = useState<boolean>(false);
  const [updateCashierModal, handleUpdateCashierOpen] = useState<boolean>(false);

  const handleUpdate = async (fields: any, method: string) => {
    const hide = message.loading('Đang xử lý');
    let { _id, name, phone, order }: any = currentRow;
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (phone !== fields.phone) doc.phone = fields.phone;
    if (order !== fields.order) doc.order = fields.order;
    if (Object.keys(doc).length > 0) {
      try {
        await updateDepart({
          ...doc,
          departID: _id,
          method,
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

  const handleUpdateCashier = async (fields: any, departID: any) => {
    console.log(fields, currentCashier);
    const hide = message.loading('Đang xử lý');
    let { _id, name, order }: any = currentCashier;
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (order !== fields.order) doc.order = fields.order;
    if (Object.keys(doc).length > 0) {
      try {
        await updateCashier({
          ...doc,
          departID,
          cashierID: _id,
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

  const expandedRowRender = (record: any) => {
    return (
      <ProTable
        columns={[
          { title: 'Quầy', dataIndex: 'name' },

          { title: 'STT', dataIndex: 'order' },
          {
            title: 'Action',
            valueType: 'option',
            render: (_, item: any) => [
              <a
                key="conf"
                onClick={() => {
                  handleUpdateCashierOpen(true);
                  setCurrentCashier(item);
                  setCurrentDepartID(record._id);
                }}
              >
                Cập nhật
              </a>,
              <>
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  onConfirm={async () => {
                    await handleRemoveCashier(record._id, item._id);
                    actionRef.current?.reloadAndRest?.();
                  }}
                >
                  <a key="deletec">Xóa</a>
                </Popconfirm>
              </>,
            ],
          },
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={record.cashiers.map((el: any) => ({ key: el._id, ...el }))}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Địa điểm',
      width: 120,
      dataIndex: 'name',
    },
    {
      title: 'Điện thoại',
      width: 120,
      dataIndex: 'phone',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      render: (_, record: any) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <a
            key="update"
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            Cập nhật
          </a>
          <a
            key="create"
            onClick={() => {
              handleCashierModalOpen(true);
              setCurrentRow(record);
            }}
          >
            Tạo quầy
          </a>
          <>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={async () => {
                await handleRemove([record]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <a key="delete">Xóa</a>
            </Popconfirm>
          </>
        </div>
      ),
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
          request={departList}
          rowKey="_id"
          expandable={{ expandedRowRender, defaultExpandAllRows: true }}
          search={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalOpen(true);
              }}
            >
              <PlusOutlined /> Tạo
            </Button>,
          ]}
        />
      </ProProvider.Provider>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, 'PATCH');
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current?.reloadAndRest?.();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value as DEPART_API.DepartListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalOpen(false);
        }}
        createModalOpen={createModalOpen}
        values={currentRow || {}}
      />

      <CreateCashierForm
        onFinish={async (value) => {
          const success = await handleUpdate(value, 'POST');
          if (success) {
            handleCashierModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleCashierModalOpen(false);
        }}
        createModalOpen={createCashierModal}
        values={currentRow || {}}
      />

      <UpdateCashierForm
        onFinish={async (value) => {
          const success = await handleUpdateCashier(value, currentDepartID);
          if (success) {
            handleUpdateCashierOpen(false);
            setCurrentRow(undefined);
            setCurrentDepartID(undefined);
            if (actionRef.current) {
              actionRef.current?.reloadAndRest?.();
            }
          }
        }}
        onCancel={() => {
          handleUpdateCashierOpen(false);
        }}
        updateModalOpen={updateCashierModal}
        values={currentCashier || {}}
      />
    </PageContainer>
  );
};
