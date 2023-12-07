import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';
import { Modal, Space, Upload, message } from 'antd';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<PRODUCT_API.ProductListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<PRODUCT_API.ProductListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  if (props.updateModalOpen)
    return (
      <ModalForm
        width={580}
        // style={{ padding: '32px 40px 48px' }}
        open={props.updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props.onCancel(),
          cancelText: 'Hủy',
        }}
        onFinish={props.onSubmit}
        initialValues={{
          name: props.values.name,
          adult: props.values.heightNote[0],
          child: props.values.heightNote[1],
          elder: props.values.heightNote[2],
          manual: props.values.manual,
          note: props.values.note,
          country: props.values.country,
        }}
        title="Cập nhật sản phẩm"
      >
        <Space>
          <ProFormText
            name="name"
            label="Tên sản phẩm"
            width='sm'
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
        <ProFormUploadButton
          label="Logo"
          name="logo"
          status="success"
          listType="picture-card"
          title="Chọn logo"
          fieldProps={{
            maxCount: 1,
            onPreview: handlePreview,
            beforeUpload: (file) => {
              const isPNG = file.type.includes('image/');
              if (!isPNG) {
                message.error(`Xin mời chọn file ảnh`);
              }
              return isPNG || Upload.LIST_IGNORE;
            },
          }}
        />
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Space>
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
        </Space>
        <ProFormTextArea
          name="manual"
          label="Hướng dẫn sử dụng"
          width="xl"
          fieldProps={{
            autoSize: true,
          }}
          placeholder="Nhập hướng dẫn sử dụng"
        />
        <ProFormTextArea
          name="note"
          label="Lưu ý"
          width="xl"
          fieldProps={{
            autoSize: true,
          }}
          placeholder="Nhập lưu ý"
        />
      </ModalForm>
    );
};

export default UpdateForm;
