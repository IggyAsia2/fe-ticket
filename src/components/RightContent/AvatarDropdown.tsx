import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { Space, Spin, message } from 'antd';
import Cookies from 'js-cookie';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { convertSubUserToList, getPrice } from '@/helper/helper';
import { ProFormSelect } from '@ant-design/pro-components';
import PinForm from './components/PinModal';
import { checkPinSubUser } from '@/api/user';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const moenry = currentUser?.moneny ? currentUser.moneny : 0;
  return (
    <>
      <Space>
        <span className="anticon">{currentUser?.name}</span>
        {(currentUser?.isAgent || currentUser?.email === 'vsttravel@gmail.com') && (
          <>
            <span className="anticon">| Số dư: {getPrice(moenry)}</span>
          </>
        )}
      </Space>
    </>
  );
};

export const SubUserSelect = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [pinModal, setPinModal] = useState<boolean>(false);
  const [subID, setSubID] = useState<string>('');
  const SubUser = Cookies.get('SubUser');
  const [status, setStatus] = useState<boolean>(SubUser ? true : false);

  const handleAdd = async (fields: any) => {
    const hide = message.loading('Đang tạo');
    try {
      const check = await checkPinSubUser({ ...fields });
      hide();
      setStatus(true);
      Cookies.set('SubUser', check.data);
      Cookies.set('SubID', subID);
      window.location.reload();
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  return (
    currentUser?.isAgent && (
      <>
        <ProFormSelect
          style={{ width: '200px' }}
          name="_id"
          label="Chọn User"
          // name="depet"
          // onChange={(_, options) => {
          //   setPinModal(true);
          //   // Cookies.set('SubUser', options.label);
          //   // window.location.reload();
          // }}
          fieldProps={{
            defaultValue: Cookies.get('SubUser'),
            onSelect: (value) => {
              setSubID(value);
              setPinModal(true);
            },
            status: status ? '' : 'warning',
            options: currentUser && convertSubUserToList(currentUser?.subUser),
          }}
          showSearch
          placeholder="Chọn người dùng"
          allowClear={false}
        />
        <PinForm
          onSubmit={async (value: any) => {
            const success = await handleAdd({ pin: value.pin, subID });
            if (success) {
              setPinModal(false);
            }
          }}
          onCancel={() => {
            setPinModal(false);
            setSubID('');
          }}
          updateModalOpen={pinModal}
        />
      </>
    )
  );
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * Log out and save the current URL
   */
  const loginOut = async () => {
    Cookies.remove('jwt');
    Cookies.remove('SubID');
    Cookies.remove('SubUser');
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
      });
    }
  };
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems = [
    ...(!menu
      ? [
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
    </>
  );
};
