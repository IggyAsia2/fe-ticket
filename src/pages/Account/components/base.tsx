import React from 'react';
import { message } from 'antd';
import { ProFormText, ProForm, ProFormMoney } from '@ant-design/pro-components';
import { CurrentUser } from '@/helper/helper';
// import { useRequest } from '@umijs/max';

import styles from './BaseView.less';
import { updateUser } from '@/api/user';

const BaseView: React.FC = () => {
  const currentUser: any = CurrentUser();
  const { name, moneny } = currentUser;
  const minusMin = currentUser.moneny * -1;

  const handleFinish = async (fields: any) => {
    const doc: any = {};
    if (name !== fields.name) doc.name = fields.name;
    if (fields.moneny) doc.moneny = moneny + fields.moneny;
    if (Object.keys(doc).length) {
      try {
        await updateUser({
          ...doc,
          userId: currentUser._id,
        });
        message.success('Đã cập nhật thông tin thành công !');
        window.location.reload();

        return true;
      } catch (error) {
        window.location.reload();
        message.error('Cập nhật không thành công, xin mời thử lại!');
        return false;
      }
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
              email: currentUser.email,
              name: currentUser.name,
            }}
          >
            <ProFormText width="md" name="email" label="Email" disabled />
            <ProFormText
              width="md"
              name="name"
              label="Tên"
              placeholder="Nhập tên"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập tên!',
                },
              ]}
            />
            <ProFormMoney
              hidden={currentUser.email !== 'vsttravel@gmail.com'}
              label="Nạp thêm"
              name="moneny"
              min={minusMin}
              placeholder="Nhập số tiền nạp thêm"
              locale="vi-VN"
            />
          </ProForm>
        </div>
      </>
    </div>
  );
};

export default BaseView;
