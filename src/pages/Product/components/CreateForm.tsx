import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<PRODUCT_API.ProductListItem>) => Promise<void>;
  createModalOpen: boolean;
  values: Partial<PRODUCT_API.ProductListItem>;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <ModalForm
      width={580}
      open={props.createModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
      }}
      onFinish={props.onFinish}
      title="Tạo sản phẩm"
    >
      <Space>
        <ProFormText
          name="name"
          label="Tên sản phẩm"
          width="sm"
          placeholder="Nhập tên sản phẩm"
          rules={[
            {
              required: true,
              message: 'Nhập tên sản phẩm!',
            },
          ]}
        />
        <ProFormText
          name="country"
          label="Tên địa danh"
          width="sm"
          placeholder="Nhập tên địa danh"
          rules={[
            {
              required: true,
              message: 'Nhập tên địa danh!',
            },
          ]}
        />
      </Space>
      {/* <Space>
        <ProFormTextArea
          name="adult"
          label="Người lớn"
          width="xs"
          fieldProps={{
            autoSize: true,
          }}
          placeholder="Nhập mô tả chiều cao"
        />
        <ProFormTextArea
          name="child"
          label="Trẻ em"
          width="xs"
          fieldProps={{
            autoSize: true,
          }}
          placeholder="Nhập mô tả chiều cao"
        />
        <ProFormTextArea
          name="elder"
          label="Người cao tuổi"
          width="xs"
          fieldProps={{
            autoSize: true,
          }}
          placeholder="Nhập mô tả chiều cao"
        />
      </Space> */}
      <ProFormTextArea
        name="manual"
        label="Hướng dẫn sử dụng"
        width="xl"
        placeholder="Nhập hướng dẫn sử dụng"
      />
      <ProFormTextArea name="note" label="Lưu ý" width="xl" placeholder="Nhập lưu ý" />
    </ModalForm>
  );
};

export default CreateForm;
