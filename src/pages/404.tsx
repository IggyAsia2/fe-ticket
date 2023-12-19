import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Xin lỗi, trang này không tồn tại!."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Quay lại
      </Button>
    }
  />
);

export default NoFoundPage;
