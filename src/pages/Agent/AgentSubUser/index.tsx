import { createSubUser, removeSubUser, getSubUser, updateSubUser } from '@/api/user';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProProvider, ProTable, createIntl } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
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
    await createSubUser({ ...fields });
    hide();
    message.success('Thêm mới thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm mới thất bại, xin vui lòng thử lại!');
    return false;
  }
};

const handleRemove = async (subID: string) => {
  const hide = message.loading('Đang xóa');
  try {
    await removeSubUser({ subID });
    hide();
    message.success('Xóa thàng công');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại vui lòng thử lại');
    return false;
  }
};

const SubUserList: React.FC = () => {
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);


  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<USER_API.UserListItem>();

  const handleUpdate = async (fields: any) => {
    const hide = message.loading('Đang xử lý');
    let { _id, name, pin }: any = currentRow;
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (pin !== fields.pin) doc.pin = fields.pin;
    if (Object.keys(doc).length > 0) {
      try {
        await updateSubUser({
          ...doc,
          subID: _id,
        });
        hide();
        message.success('Cập nhật thành công');
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
      title: 'Tên người dùng',
      dataIndex: 'name',
      fieldProps: {
        placeholder: 'Nhập tên người dùng',
      },
    },
    {
      title: 'Mã Pin',
      dataIndex: 'pin',
      hideInSearch: true,
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <a
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
              await handleRemove(record._id);
              // setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            cancelText="Hủy"
          >
            <a hidden={record.name === 'Admin'} key="delete">
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
          request={getSubUser}
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
        }}
        createModalOpen={createModalOpen}
        values={currentRow || {}}
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
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default SubUserList;
