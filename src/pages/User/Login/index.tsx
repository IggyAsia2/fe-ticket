// import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { message } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { flushSync } from 'react-dom';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const fetchUserInfo = async ({ token }: API.TokenAuth) => {
    const jwt: string = token || '';
    const userInfo = await initialState?.fetchUserInfo?.({ token: jwt });
    const departList = await initialState?.fetchDepart?.({ token: jwt });
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
          departList,
        }));
        Cookies.set('jwt', jwt);
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values });
      if (msg.status === 'success') {
        const defaultLoginSuccessMessage = 'Đăng nhập thành công';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo({ token: msg.token });
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // If failed to set user error message
    } catch (err) {}
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>Login - Kho vé Vintrip</title>
      </Helmet>
      <div
        style={{
          flex: '1',
          // padding: '32px 0',
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <LoginFormPage
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          // logo={<img alt="logo" src="/logo.svg" />}
          title="Vintrip"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
          subTitle="Kho vé Vintrip"
          submitter={{
            searchConfig: {
              submitText: 'Đăng nhập',
            },
          }}
          initialValues={{
            email: '',
            password: '',
            // email: 'pcvbaoit@gmail.com',
            // password: 'khovevintrip',
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="Nhập địa chỉ email"
            rules={[
              {
                required: true,
                message: 'Bạn chưa nhập email',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="Nhập mật khẩu"
            rules={[
              {
                required: true,
                message: 'Bạn chưa nhập mật khẩu',
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
              textAlign: 'end',
            }}
          >
            <a>Quên mật khẩu</a>
          </div>
        </LoginFormPage>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
