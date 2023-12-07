import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React from 'react';

export type CreateFormProps = {
  onCancel: (flag?: boolean) => void;
  onFinish: (values: Partial<USER_API.UserListItem>) => Promise<void>;
  createModalOpen: boolean;
  // onOpenChange: any;
  values: Partial<USER_API.UserListItem>;
  roleList: any;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      width={380}
      open={props.createModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
      onFinish={props.onFinish}
      title={intl.formatMessage({
        id: 'pages.searchTable.updateForm.userCreate',
        defaultMessage: 'Create User',
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
      />
    </ModalForm>
  );
};

export default CreateForm;
