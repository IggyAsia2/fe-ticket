import { createSunOrder, sunWorldList } from '@/api/sunWorld/sun';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProProvider,
  ProTable,
  createIntl,
} from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import React, { useContext, useRef, useState } from 'react';
// import { useAccess } from '@umijs/max';
import enLocale from '@/locales/table-en';
import ExportForm from './components/ExportForm';

/**
 * @param fields
 */

const SunSiteList: React.FC = () => {
  // const access = useAccess();
  const enUSIntl = createIntl('en_US', enLocale);
  const values = useContext(ProProvider);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<SUN_SITE_API.SunSiteItem>();
  const [exportModalOpen, handleExportModalOpen] = useState<boolean>(false);

  const columns: ProColumns<SUN_SITE_API.SunSiteItem>[] = [
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
      title: 'Code',
      dataIndex: 'code',
      fieldProps: {
        placeholder: 'Nhập tên',
      },
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          <a
            key="export"
            onClick={() => {
              handleExportModalOpen(true);
              setCurrentRow(record);
            }}
          >
            Đặt vé
          </a>
        </>,
      ],
    },
  ];

  const createTicket = async (dataSubmit: string[]) => {
    if (dataSubmit.length) {
      const hide = message.loading('Đang tạo vé');
      try {
        await createSunOrder({
          products: dataSubmit,
          sunName: currentRow?.name,
          siteCode: currentRow?.code,
        });
        hide();
        message.success('Đã tạo vé thành công');
        // return true;
      } catch (error) {
        hide();
        message.error('Tạo vé không thành công');
        // return false;
      }
    } else {
      message.warning('Bạn chưa nhập số lượng vé');
    }
  };

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
          toolBarRender={() => []}
          request={sunWorldList}
          columns={columns}
        />
      </ProProvider.Provider>

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
          <ProDescriptions<SUN_SITE_API.SunSiteItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<SUN_SITE_API.SunSiteItem>[]}
          />
        )}
      </Drawer>
      <ExportForm
        onSubmit={async (values, dataSubmit) => {
          await createTicket(dataSubmit);
          // if (success) {
          //   handleExportModalOpen(false);
          //   setCurrentRow(undefined);
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // }
        }}
        onCancel={() => {
          handleExportModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        exportModalOpen={exportModalOpen}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default SunSiteList;
