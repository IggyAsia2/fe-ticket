import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoAuthPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Bạn không có quyền truy cập!"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Quay lại
      </Button>
    }
  />
);

export default NoAuthPage;
