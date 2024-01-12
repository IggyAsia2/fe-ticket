import { ModalForm, ProFormText } from '@ant-design/pro-components';
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
};

const PinForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      width={380}
      // style={{ padding: '32px 40px 48px' }}
      open={props.updateModalOpen}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
        cancelText: 'Hủy',
        okText: 'OK',
      }}
      onFinish={props.onSubmit}
      title="Mã PIN"
    >
      <ProFormText
        name="pin"
        placeholder="Nhập mã pin 4 số"
        width="md"
        // fieldProps={{
        //   onKeyDown: (event) => {
        //     if (!/^[0-9]/g.test(event.key)) {
        //       event.preventDefault();
        //     }
        //   },
        // }}
        rules={[
          {
            required: true,
            message: 'Xin nhập Mã Pin 4 số',
            min: 4,
            max: 4,
          },
        ]}
      />
    </ModalForm>
  );
};

export default PinForm;
