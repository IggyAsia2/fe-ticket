import { ristLole } from '@/api/role';
import { addUser, removeManyUser, removeUser, updateUser, userList } from '@/api/user';
import { getDateTime } from '@/helper/helper';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useRequest } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields: USER_API.UserListItem) => {
  const hide = message.loading('Adding');
  try {
    await addUser({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRows: USER_API.UserListItem[]) => {
  const hide = message.loading('Deleting');
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
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const UserList: React.FC = () => {
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
  const [selectedRowsState, setSelectedRows] = useState<USER_API.UserListItem[]>([]);

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Đang xử lý');
    let { _id, email, role, name }: any = currentRow;
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (email !== fields.email) doc.email = fields.email;
    if (role?._id !== fields.role) doc.role = fields.role;
    if (Object.keys(doc).length) {
      try {
        await updateUser({
          ...doc,
          userId: _id,
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

  const columns: ProColumns<USER_API.UserListItem>[] = [
    {
      title: "Tên",
      dataIndex: 'name',
      tip: 'The Name is the unique key',
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
      valueType: 'textarea',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      // sorter: true,
      hideInForm: true,
      renderText: (val: USER_API.RoleItem) => {
        return val && val.name;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      hideInForm: true,
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
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      renderText: (val: string) => {
        return getDateTime(val);
      },
      // renderFormItem: (item, { defaultRender, ...rest }, form) => {
      //   console.log(item);
      //   const status = form.getFieldValue('status');
      //   if (`${status}` === '0') {
      //     return false;
      //   }
      //   if (`${status}` === '3') {
      //     return (
      //       <Input
      //         {...rest}
      //         placeholder={intl.formatMessage({
      //           id: 'pages.searchTable.exception',
      //           defaultMessage: 'Please enter the reason for the exception!',
      //         })}
      //       />
      //     );
      //   }
      //   return defaultRender(item);
      // },
    },
    {
      title: 'Ngày cập nhật',
      // sorter: true,
      dataIndex: 'updatedAt',
      renderText: (val: string) => {
        return getDateTime(val);
      },
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          hidden={record.email === 'pcvbaoit@gmail.com'}
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          Cập nhật
        </a>,
        <a
          hidden={record.email === 'pcvbaoit@gmail.com'}
          key="subscribeAlert"
          onClick={async () => {
            await handleRemove([record]);
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          Xóa
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<USER_API.UserListItem, API.PageParams>
        dateFormatter="string"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
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
        request={userList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
          getCheckboxProps: (record) => ({
            disabled: record.email === 'pcvbaoit@gmail.com', // Column configuration not to be checked
            name: record.email,
          }),
        }}
      />
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
            <FormattedMessage id="pages.searchTable.deletion" defaultMessage="Deletion" />
          </Button>
        </FooterToolbar>
      )}
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
