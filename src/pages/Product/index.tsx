import {
  addProduct,
  productList,
  removeManyProduct,
  removeProduct,
  updateProduct,
} from '@/api/product';
import { exportGroupInven } from '@/api/ticket';
import { CurrentUser } from '@/helper/helper';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
  ProProvider,
  createIntl,
} from '@ant-design/pro-components';
import { Button, Drawer, Popconfirm, message, Image } from 'antd';
import type { ExportFormValueType } from './components/ExportForm';
import ExportForm from './components/ExportForm';
import React, { useContext, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { useAccess } from '@umijs/max';
import Cookies from 'js-cookie';
import enLocale from '@/locales/table-en';
/**
 * @param fields
 */

const handleAdd = async (fields: PRODUCT_API.ProductListItem) => {
  const hide = message.loading('Đang tạo');
  try {
    await addProduct({ ...fields });
    hide();
    message.success('Tạo thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Tạo thất bại, xin vui lòng thử lại!');
    return false;
  }
};

const handleRemove = async (selectedRows: PRODUCT_API.ProductListItem[]) => {
  const hide = message.loading('Đang xóa');
  if (!selectedRows) return true;
  try {
    if (selectedRows.length > 1) {
      await removeManyProduct({
        key: selectedRows.map((row) => row._id),
      });
    } else {
      await removeProduct(selectedRows[0]);
    }
    hide();
    message.success('Xóa thàng công');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại vui lòng thử lại');
    return false;
  }
};

const ListProduct: React.FC = () => {
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);
  const access = useAccess();
  // const { data, run } = useRequest(ristLole, {
  //   manual: true,
  //   formatResult: (res) => res,
  // });

  // useEffect(() => {
  //   run();
  // }, []);

  const [groupQuan, setGroupQuan] = useState<[]>([]);
  const [quan, setQuan] = useState<[]>([]);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [exportModalOpen, handleExportModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<PRODUCT_API.ProductListItem>();
  const [selectedRowsState, setSelectedRows] = useState<PRODUCT_API.ProductListItem[]>([]);
  const email: string | undefined = CurrentUser()?.email;

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Đang xử lý');
    let { _id, name, manual, note, heightNote, country }: any = currentRow;
    const { adult, child, elder }: any = fields;
    const doc: any = {};
    const docHN: any = [heightNote[0], heightNote[1], heightNote[2]];
    if (heightNote[0] !== adult) docHN[0] = adult;
    if (heightNote[1] !== child) docHN[1] = child;
    if (heightNote[2] !== elder) docHN[2] = elder;
    const compareDoc = JSON.stringify(docHN) === JSON.stringify(heightNote);
    if (name !== fields.name) doc.name = fields.name;
    if (manual !== fields.manual) doc.manual = fields.manual;
    if (note !== fields.note) doc.note = fields.note;
    if (country !== fields.country) doc.country = fields.country;
    if (!compareDoc) doc.heightNote = docHN.toString();
    if (fields.logo) doc.logo = fields.logo[0].originFileObj;
    if (Object.keys(doc).length > 0) {
      try {
        await updateProduct({
          ...doc,
          productId: _id,
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

  const exportTicket = async (fields: ExportFormValueType) => {
    const groupNumberTicket = Object.entries(
      Object.fromEntries(Object.entries(fields).slice(5, Object.keys(fields).length)),
    );
    let { _id, groupTickets }: any = currentRow;
    if (groupNumberTicket.length) {
      const hide = message.loading('Đang xuất vé');
      try {
        await exportGroupInven({
          data: {
            customerCar: fields.customerCar,
            customerName: fields.customerName,
            customerPhone: fields.customerPhone,
          },
          groupNumberTicket,
          bookDate: fields.bookDate,
          departID: Cookies.get('departID'),
          exportUser: email,
          priceTicket: Object.fromEntries(groupTickets.map((el: any) => [el._id, el.price])),
          discountTicket: Object.fromEntries(
            groupTickets.map((el: any) => [el._id, el.discountPrice]),
          ),
          ticketId: _id,
        });
        hide();
        message.success('Đã xuất vé thành công');
        return true;
      } catch (error) {
        hide();
        message.error('Xuất vé không thành công');
        return false;
      }
    } else {
      message.warning('Bạn chưa nhập số lượng vé');
    }
  };

  const columns: ProColumns<PRODUCT_API.ProductListItem>[] = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      // fixed: 'left',
      fieldProps: {
        placeholder: 'Nhập tên sản phẩm',
      },
    },
    {
      title: 'Địa danh',
      dataIndex: 'country',
      valueType: 'select',
      fieldProps: {
        placeholder: 'Chọn địa danh',
        showSearch: true,
        // options: [
        //   {
        //     label: 'aa',
        //     value: 'aa',
        //   },
        //   {
        //     label: 'cc',
        //     value: 'bb',
        //   },
        // ],
        // multiple: true,
      },
      valueEnum: {
        'Đà Lạt': { text: 'Đà Lạt' },
        'Phan Thiết': { text: 'Phan Thiết' },
        'Tây Ninh': { text: 'Tây Ninh' },
        'Nha Trang': { text: 'Nha Trang' },
        'Phú Quốc': { text: 'Phú Quốc' },
      },
      hideInTable: true,
    },
    {
      title: 'Chiều cao',
      dataIndex: 'heightNote',
      valueType: 'cascader',
      hideInSearch: true,
      hideInTable: !access.canAdmin,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      valueType: 'image',
      hideInSearch: true,
      render: (_, record) => {
        return (
          record.logo && (
            <Image
              width={100}
              preview={false}
              src={STATIC_URL + '/BigTicket/' + record.logo}
              crossOrigin="anonymous"
            />
          )
        );
      },
    },
    {
      title: 'Hướng dẫn',
      dataIndex: 'manual',
      valueType: 'jsonCode',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'Lưu ý',
      dataIndex: 'note',
      valueType: 'jsonCode',
      hideInSearch: true,
      hideInTable: true,
    },
    // {
    //   title: 'Tạo ngày',
    //   dataIndex: 'createdAt',
    //   hideInSearch: true,
    //   renderText: (val: string) => {
    //     return getDateTime(val);
    //   },
    // },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <a
            key="config"
            hidden={!access.canAdmin}
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            Cập nhật
          </a>
          <>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={async () => {
                await handleRemove([record]);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <a hidden={!access.canDad} key="delete">
                Xóa
              </a>
            </Popconfirm>
          </>
          <a
            key="export"
            hidden={access.canMelinh && record._id !== '6578175d4549961cf866ff61'}
            onClick={() => {
              handleExportModalOpen(true);
              setGroupQuan(record.groupTickets.map(() => 0));
              setQuan(record.groupTickets.map(() => ''));
              setCurrentRow(record);
            }}
          >
            Xuất vé
          </a>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProProvider.Provider value={{ ...values, intl: enUSIntl }}>
        <ProTable<PRODUCT_API.ProductListItem, API.PageParams>
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
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              hidden={!access.canAdmin}
              onClick={() => {
                handleModalOpen(true);
              }}
            >
              Tạo
            </Button>,
          ]}
          tableAlertRender={({ selectedRowKeys }) => {
            return <span>Chọn {selectedRowKeys.length}</span>;
          }}
          pagination={{
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
          request={productList}
          columns={columns}
          rowSelection={
            access.canAdmin && {
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }
          }
        />
      </ProProvider.Provider>

      {selectedRowsState?.length > 0 && (
        <FooterToolbar>
          <Button
            type="primary"
            danger
            hidden={!access.canDad}
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Xóa
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value as PRODUCT_API.ProductListItem);
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
              actionRef.current?.reloadAndRest?.();
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

      <ExportForm
        onSubmit={async (value) => {
          const success = await exportTicket(value);
          if (success) {
            handleExportModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleExportModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        exportModalOpen={exportModalOpen}
        values={currentRow || {}}
        groupQuan={groupQuan}
        setGroupQuan={setGroupQuan}
        quan={quan}
        setQuan={setQuan}
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
          <ProDescriptions<PRODUCT_API.ProductListItem>
            column={1}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<PRODUCT_API.ProductListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ListProduct;
