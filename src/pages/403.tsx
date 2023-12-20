import { history, useModel } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoAuthPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyền truy cập!"
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

export default NoAuthPage;
