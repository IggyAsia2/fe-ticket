import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import styles from './BaseView.less';
import { message } from 'antd';
import { updateSubUser } from '@/api/user';
import Cookies from 'js-cookie';

const PinView: React.FC = () => {
  const subID = Cookies.get('SubID');

  const handleFinish = async (fields: any) => {
    const hide = message.loading('Đang xử lý');
    try {
      await updateSubUser({
        ...fields,
        subID,
      });
      hide();
      message.success('Cập nhật thành công');
      return true;
    } catch (error) {
      hide();
      message.error('Cập nhật thất bại, xin vui lòng thử lại!');
      return false;
    }
  };

  return (
    <div className={styles.baseView}>
      {subID ? (
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
            <ProFormText
              width="md"
              name="pin"
              label="Mã pin mới"
              placeholder="Nhập mã pin mới"
              fieldProps={{
                onKeyDown: (event) => {
                  if (!/^[0-9]/g.test(event.key)) {
                    event.preventDefault();
                  }
                },
              }}
              rules={[
                {
                  required: true,
                  message: 'Xin nhập Mã Pin 4 số',
                  min: 4,
                  max: 4,
                },
              ]}
            />
          </ProForm>
        </div>
      ) : (
        <div>Bạn chưa chọn người dùng</div>
      )}
    </div>
  );
};

export default PinView;
