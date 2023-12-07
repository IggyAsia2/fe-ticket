import { ModalForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';
// import TreeTrans from './TreeTransfer';
// import { Typography } from 'antd';
import { DataNode } from 'antd/es/tree';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<USER_API.UserListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<USER_API.UserListItem>;
  rightGroupData: DataNode[];
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      width={380}
      open={props.updateModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
      onFinish={props.onSubmit}
      initialValues={{
        id: props.values._id,
        name: props.values.name,
        email: props.values.email,
        role: props.values.role?._id,
      }}
      title="Cập nhật phân quyền"
    >
      <ProFormText
        name="name"
        label="Role"
        width="md"
        rules={[
          {
            required: true,
            message: 'Bạn chưa nhập role',
          },
        ]}
      />
      {/* <Typography.Title level={5}>Phân quyền</Typography.Title>
      {props.updateModalOpen && <TreeTrans rightGroupData={props.rightGroupData} />} */}
    </ModalForm>
  );
};

export default UpdateForm;
