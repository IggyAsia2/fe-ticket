import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import styles from './BaseView.less';
import { message } from 'antd';
import { updatePassword } from '@/api/user';
import Cookies from 'js-cookie';

const SecurityView: React.FC = () => {
  const handleFinish = async (fields: any) => {
    const hide = message.loading('Đang xử lý');
    try {
      await updatePassword({
        ...fields,
        passwordConfirm: fields.password,
      });
      hide();
      Cookies.remove('jwt');
      window.location.reload();
      message.success('Đã cập nhật mật khẩu thành công !');

      return true;
    } catch (error) {
      hide();
      message.error('Cập nhật mật khẩu không thành công, xin mời thử lại!');
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
          >
            <ProFormText.Password
              width="md"
              name="passwordCurrent"
              label="Mật khẩu cũ"
              placeholder="Nhập lại mật khẩu cũ"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập!',
                },
              ]}
            />
            <ProFormText.Password
              width="md"
              name="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: 'Bạn chưa nhập!',
                },
              ]}
            />
          </ProForm>
        </div>
      </>
    </div>
  );
};

export default SecurityView;
