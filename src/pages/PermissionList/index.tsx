import { addRole, removeRole, role, updateRole } from '@/api/permission';
import { rightGroupList } from '@/api/right/rightGroup';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, Popconfirm, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { useRequest } from '@umijs/max';

/**
 * @param fields
 */

const handleAdd = async (fields: PERM_API.PermListItem) => {
  const hide = message.loading('Adding');
  try {
    await addRole({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRows: PERM_API.PermListItem[]) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;
  try {
    await removeRole(selectedRows[0]);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const PermissionList: React.FC = () => {
  const { data: rightGroupData, run } = useRequest(rightGroupList, {
    manual: true,
    formatResult: (res: any) =>
      res.data.map((el: any, index: number) => {
        const children = el.rights.map((elC: any) => ({
          key: elC.name,
          title: elC.name,
        }));
        return {
          key: index,
          title: el.name,
          children: children,
        };
      }),
  });

  useEffect(() => {
    run({ current: 1, pageSize: 100 });
  }, []);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<PERM_API.PermListItem>();

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Đang xử lý');
    let { _id, name }: any = currentRow;
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    try {
      await updateRole({
        ...doc,
        roleId: _id,
      });
      hide();
      message.success('Update is successful');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const columns: ProColumns<PERM_API.PermListItem>[] = [
    {
      title: 'Tên',
      dataIndex: 'name',
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
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          hidden={record.name === 'admin'}
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
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <a hidden={record.name === 'admin'} key="delete">
              Xóa
            </a>
          </Popconfirm>
        </>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<PERM_API.PermListItem, API.PageParams>
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
            Tạo
          </Button>,
        ]}
        request={role}
        columns={columns}
      />

      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value as PERM_API.PermListItem);
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
        rightGroupData={rightGroupData}
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
          <ProDescriptions<PERM_API.PermListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<PERM_API.PermListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PermissionList;
