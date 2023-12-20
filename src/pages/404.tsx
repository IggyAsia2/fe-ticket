import { history, useModel } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang này không tồn tại!."
      extra={
        <Button
          type="primary"
          onClick={() => history.push(currentUser?.isAgent ? 'san-pham-dl' : '/san-pham')}
        >
          Quay lại
        </Button>
      }
    />
  );
};

export default NoFoundPage;
