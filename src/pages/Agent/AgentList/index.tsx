import {
  addUser,
  removeManyUser,
  removeUser,
  updateUser,
  agentList,
  getUser,
  updateDiscount,
} from '@/api/user';
import { productList } from '@/api/product';
import { getPrice } from '@/helper/helper';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProProvider,
  ProTable,
  createIntl,
} from '@ant-design/pro-components';
import { useAccess, useRequest } from '@umijs/max';
import { Button, Drawer, Popconfirm, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import DiscountForm from './components/DiscountForm';
import enLocale from '@/locales/table-en';

/**
 * @param fields
 */

const handleAdd = async (fields: USER_API.UserListItem) => {
  const hide = message.loading('Đang tạo');
  try {
    await addUser({ ...fields, isAgent: true, role: '657919983a6e33398c0ab535' });
    hide();
    message.success('Thêm mới thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm mới thất bại, xin vui lòng thử lại!');
    return false;
  }
};

const handleRemove = async (selectedRows: USER_API.UserListItem[]) => {
  const hide = message.loading('Đang xóa');
  if (!selectedRows) return true;
  try {
    if (selectedRows.length > 1) {
      await removeManyUser({
        key: selectedRows.map((row) => row._id),
      });
    } else {
      await removeUser(selectedRows[0]);
    }
    hide();
    message.success('Đã xóa thành công!');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại, xin vui lòng thử lại!');
    return false;
  }
};

const UserList: React.FC = () => {
  const { data: productData, run: runProduct } = useRequest(productList, {
    manual: true,
    formatResult: (res: any) => res.data,
  });
  const access = useAccess();
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [discountModalOpen, handleDiscountModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<USER_API.UserListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<USER_API.UserListItem[]>([]);

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Đang cập nhật');
    let { _id, email, role, name, discountAgent }: any = currentRow;
    const userData = await getUser({ userID: _id });
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (email !== fields.email) doc.email = fields.email;
    if (fields.moneny) doc.moneny = userData.data.moneny + fields.moneny;
    if (discountAgent !== fields.discountAgent) doc.discountAgent = fields.discountAgent;
    if (email !== fields.email) doc.email = fields.email;
    if (role?._id !== fields.role) doc.role = fields.role;
    if (Object.keys(doc).length) {
      try {
        await updateUser({
          ...doc,
          userId: _id,
        });
        if (doc.moneny) {
        }
        hide();
        message.success('Cập nhật thành công!');
        return true;
      } catch (error) {
        hide();
        message.error('Cập nhật thất bại, xin vui lòng thử lại!');
        return false;
      }
    } else {
      hide();
      return true;
    }
  };

  const columns: ProColumns<USER_API.UserListItem>[] = [
    {
      title: 'Tên đại lý',
      dataIndex: 'name',
      fieldProps: {
        placeholder: 'Nhập tên đại lý',
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      fieldProps: {
        placeholder: 'Nhập email',
      },
      valueType: 'textarea',
    },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'active',
    //   hideInForm: true,
    //   hideInSearch: true,
    //   valueEnum: {
    //     true: {
    //       text: 'Hoạt động',
    //       status: 'Success',
    //     },
    //     false: {
    //       text: 'Hủy',
    //       status: 'Error',
    //     },
    //   },
    // },
    {
      title: 'Tài khoản',
      dataIndex: 'moneny',
      hideInSearch: true,
      renderText: (val: number) => {
        return getPrice(val || 0);
      },
    },
    // {
    //   title: 'Chiết khấu',
    //   dataIndex: 'discountAgent',
    //   hideInSearch: true,
    //   renderText: (val: number) => {
    //     return getPrice(val);
    //   },
    // },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          hidden={!access.canDeleteUser}
          key="config"
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
              // setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            cancelText="Hủy"
          >
            <a
              hidden={record.email === 'pcvbaoit@gmail.com' || !access.canDad}
              key="subscribeAlert"
            >
              Xóa
            </a>
          </Popconfirm>
        </>,
        <a
          hidden={!access.canDeleteUser}
          key="discount"
          onClick={() => {
            handleDiscountModalOpen(true);
            setCurrentRow(record);
          }}
        >
          Chiết khấu
        </a>,
      ],
    },
  ];

  useEffect(() => {
    runProduct({ current: 1, pageSize: 100 });
  }, []);

  const handleUpdateDiscount = async (value: any, curNum: number, bigID: string) => {
    if (Object.keys(value).length === curNum) {
      const hide = message.loading('Đang cập nhật');
      try {
        await updateDiscount({ bigID, list: value, userID: currentRow?._id });
        hide();
        message.success('Cập nhật thành công!');
        return true;
      } catch (error) {
        hide();
        message.error('Cập nhật thất bại, xin vui lòng thử lại!');
        return false;
      }
    } else {
      message.warning('Bạn chưa nhập đủ chiết khấu!');
    }
  };

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<USER_API.UserListItem, API.PageParams>
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
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
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
          tableAlertRender={({ selectedRowKeys }) => {
            return <span>Chọn {selectedRowKeys.length}</span>;
          }}
          request={agentList}
          columns={columns}
          // rowSelection={{
          //   onChange: (_, selectedRows) => {
          //     setSelectedRows(selectedRows);
          //   },
          //   getCheckboxProps: (record) => ({
          //     disabled: record.email === 'pcvbaoit@gmail.com', // Column configuration not to be checked
          //     name: record.email,
          //   }),
          // }}
        />
      </ProProvider.Provider>

      {/* {selectedRowsState?.length > 0 && (
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
      )} */}
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value as USER_API.UserListItem);
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
      />

      <DiscountForm
        onFinish={async (value, curNum, bigID) => {
          const success = await handleUpdateDiscount(value, curNum, bigID);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleDiscountModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        discountModalOpen={discountModalOpen}
        values={productData}
        currentRow={currentRow || {}}
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
          <ProDescriptions<USER_API.UserListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<USER_API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
