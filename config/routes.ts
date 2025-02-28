﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */

export default [
  {
    path: '/',
    hideInMenu: true,
    component: './Welcome',
  },
  {
    name: 'login',
    path: '/login',
    layout: false,
    component: './User/Login',
  },
  {
    name: 'list.product-list',
    icon: 'FileTextFilled',
    path: '/san-pham',
    component: './Product',
    access: 'canSeeProduct'
  },
  {
    name: 'list.order-list',
    icon: 'BookFilled',
    path: '/don-hang',
    component: './Order',
    access: 'canSeeOrder',
  },
  {
    name: 'list.product-agent-list',
    icon: 'FileTextFilled',
    path: '/san-pham-dl',
    component: './Agent/AgentProduct',
    access: 'canAgent'
  },
  {
    name: 'list.order-agent-list',
    icon: 'BookFilled',
    path: '/don-hang-dl',
    component: './Agent/AgentOrder',
    access: 'canSubUser'
  },
  {
    name: 'list.agent-report-list',
    icon: 'BookFilled',
    path: '/bao-cao-dl',
    component: './Agent/AgentReport',
    access: 'canSubAdmin'
  },
  {
    name: 'list.report-list',
    icon: 'BookFilled',
    path: '/bao-cao',
    component: './Report',
    access: 'notAgent',
  },
  {
    name: 'list.user-agent-list',
    icon: 'user',
    path: '/nguoi-dung-dl',
    component: './Agent/AgentSubUser',
    access: 'canSubAdmin'
  },

  {
    name: 'list.ticket-list',
    icon: 'TagFilled',
    path: '/kho-ve',
    component: './TicketList',
    access: 'canSeeInventory'
  },
  {
    name: 'list.inventory-list',
    icon: 'TagFilled',
    path: '/ma-ve',
    component: './Inventory',
    access: 'canAdmin',
  },

  {
    path: '/agent/printticketlink/:orderId',
    component: './LinkOrder',
    layout: false,
    hideInMenu: true
  },

  {
    name: 'list.depart-list',
    icon: 'ShopFilled',
    path: '/quay-ve',
    component: './Depart',
    access: 'canAdmin',
  },
  {
    name: 'list.agent',
    icon: 'LayoutFilled',
    access: 'canDeleteUser',
    path: '/agent',
    routes: [
      {
        name: 'list',
        path: '/agent/agent-list',
        component: './Agent/AgentList',
        access: 'canDeleteUser',
      },
      // {
      //   name: 'history',
      //   path: '/agent/history',
      //   component: './Agent/HistoryTopup',
      //   access: 'canDad',
      // },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.sun',
    icon: 'LayoutFilled',
    access: 'canDeleteUser',
    path: '/sun-world',
    routes: [
      {
        name: 'site',
        path: '/sun-world/site-list',
        component: './SunWorld/SiteList',
        access: 'canDeleteUser',
      },
      {
        name: 'order',
        path: '/sun-world/order-list',
        component: './SunWorld/OrderList',
        access: 'canDeleteUser',
      },
      {
        name: 'report',
        path: '/sun-world/report-list',
        component: './SunWorld/ReportList',
        access: 'canDeleteUser',
        // access: 'canDad',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.user-list',
    icon: 'user',
    path: '/user-list',
    component: './UserList',
    access: 'canAdmin',
  },
  {
    name: 'list.permission-list',
    icon: 'HddFilled',
    path: '/permission-list',
    component: './PermissionList',
    access: 'canAdmin',
  },
  {
    name: 'list.import-history-list',
    icon: 'HistoryOutlined',
    path: '/lich-su-nhap-ve',
    component: './ImportList',
    access: 'canSeeImportList',
  },
  {
    name: 'list.setting-list',
    icon: 'setting',
    path: '/account/settings',
    component: './Account',
  },
  {
    path: '/',
    redirect: '/',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
  // {
  //   path: '/ke-toan',
  //   name: 'list.accountant',
  //   icon: 'smile',
  //   component: './Accountant',
  // },
];
