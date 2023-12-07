import React from 'react';
import { message } from 'antd';
import { ProFormText, ProForm } from '@ant-design/pro-components';
import { CurrentUser } from '@/helper/helper';
// import { useRequest } from '@umijs/max';

import styles from './BaseView.less';
import { updateUser } from '@/api/user';

const BaseView: React.FC = () => {
  const currentUser: any = CurrentUser();

  const handleFinish = async (fields: any) => {
    const hide = message.loading('Đang xử lý');
    try {
      await updateUser({
        name: fields.name,
        userId: currentUser._id,
      });
      hide();

      message.success('Đã cập nhật thông tin thành công !');
      window.location.reload();

      return true;
    } catch (error) {
      window.location.reload();
      hide();
      message.error('Cập nhật không thành công, xin mời thử lại!');
      return false;
    }
  };

  return (
    <div className={styles.baseView}>
      <>
        <div className={styles.left}>
          <ProForm
            layout="vertical"
            onFinish={(fields: any) => handleFinish(fields)}
            submitter={{
              searchConfig: {
                submitText: 'Cập nhật',
              },
              render: (_: any, dom: any) => dom[1],
            }}
            initialValues={{
              ...currentUser,
            }}
          >
            <ProFormText width="md" name="email" label="Email" disabled />
            <ProFormText
              width="md"
              name="name"
              label="Tên"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên!',
                },
              ]}
            />
          </ProForm>
        </div>
      </>
    </div>
  );
};

export default BaseView;
