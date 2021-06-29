export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/home',
              },
              {
                path: '/home',
                name: '首页',
                icon: 'barChart',
                component: './Home',
              },
              {
                path: '/data',
                name: '数据管理',
                icon: 'dashboard',
                component: './DataList',
              },
              {
                name: '数据地图',
                icon: 'global',
                path: '/map',
                component: './Map',
              },
              {
                name: '设备配置',
                icon: 'setting',
                path: '/devices',
                component: './DeviceConfig',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
