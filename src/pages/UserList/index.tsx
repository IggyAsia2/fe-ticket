import { ristLole } from '@/api/role';
import { addUser, removeManyUser, removeUser, updateUser, userList } from '@/api/user';
import { getDateTime } from '@/helper/helper';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProProvider,
  ProTable,
  createIntl,
} from '@ant-design/pro-components';
import { useRequest, useAccess } from '@umijs/max';
import { Button, Drawer, Popconfirm, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import enLocale from '@/locales/table-en';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields: USER_API.UserListItem) => {
  const hide = message.loading('Đang tạo');
  try {
    await addUser({ ...fields });
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
  const access = useAccess();
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const { data, run } = useRequest(ristLole, {
    manual: true,
    formatResult: (res) => res,
  });

  useEffect(() => {
    run();
  }, []);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<USER_API.UserListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<USER_API.UserListItem[]>([]);

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Đang cập nhật');
    let { _id, email, role, name, phone, active }: any = currentRow;
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (phone !== fields.phone) doc.phone = fields.phone;
    if (email !== fields.email) doc.email = fields.email;
    if (active !== fields.active) doc.active = fields.active;
    if (role?._id !== fields.role) doc.role = fields.role;
    if (Object.keys(doc).length) {
      try {
        await updateUser({
          ...doc,
          userId: _id,
        });
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
      title: 'Tên',
      dataIndex: 'name',
      fieldProps: {
        placeholder: 'Nhập tên',
      },
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
      title: 'Email',
      dataIndex: 'email',
      fieldProps: {
        placeholder: 'Nhập email',
      },
      valueType: 'textarea',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      // sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: USER_API.RoleItem) => {
        return val && val.name;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        true: {
          text: 'Hoạt động',
          status: 'Success',
        },
        false: {
          text: 'Hủy',
          status: 'Error',
        },
      },
    },

    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'createdAt',
    //   hideInSearch: true,
    //   renderText: (val: string) => {
    //     return getDateTime(val);
    //   },
    // },
    // {
    //   title: 'Ngày cập nhật',
    //   // sorter: true,
    //   hideInSearch: true,
    //   dataIndex: 'updatedAt',
    //   renderText: (val: string) => {
    //     return getDateTime(val);
    //   },
    // },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          hidden={record.email === 'admin@gmail.com' || !access.canDeleteUser}
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
            title="Bạn có chắc muốn xóa ?"
            onConfirm={async () => {
              await handleRemove([record]);
              // setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            cancelText="Hủy"
          >
            <a
              hidden={record.email === 'admin@gmail.com' || !access.canDeleteUser}
              key="subscribeAlert"
            >
              Xóa
            </a>
          </Popconfirm>
        </>,
      ],
    },
  ];

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
          request={userList}
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
        roleList={data}
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
        roleList={data}
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
