import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React from 'react';

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
  roleList: any;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      width={380}
      // style={{ padding: '32px 40px 48px' }}
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
      title={intl.formatMessage({
        id: 'pages.searchTable.updateForm.userConfig',
        defaultMessage: 'Update User',
      })}
    >
      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'pages.searchTable.updateForm.userName.nameLabel',
          defaultMessage: 'Update',
        })}
        width="md"
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.updateForm.userName.nameUsers"
                defaultMessage="Update"
              />
            ),
          },
        ]}
      />
      <ProFormText
        name="email"
        label={intl.formatMessage({
          id: 'pages.searchTable.updateForm.userEmail.emailLabel',
          defaultMessage: 'Update',
        })}
        width="md"
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.updateForm.userEmail.emailPlaceholder"
                defaultMessage="Update"
              />
            ),
          },
        ]}
      />
      <ProFormSelect<ROLE_API.RistLole>
        name="role"
        label={intl.formatMessage({
          id: 'pages.searchTable.updateForm.role',
          defaultMessage: 'Role',
        })}
        options={props.roleList}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.updateForm.rolePlaceholder"
                defaultMessage="Role"
              />
            ),
          },
        ]}
        width="md"
        // options={[
        //   {
        //     value: 'ádasdasd',
        //     label: 'Admin',
        //   },
        //   {
        //     value: 'user',
        //     label: 'User',
        //   },
        // ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
