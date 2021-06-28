import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useRef } from 'react';
import { Link, connect, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/wifi.svg';

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Produced by Xiaoyu`}
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/famishedfish/BS-project',
        blankTarget: true,
      },
      {
        key: 'eIoT',
        title: '广告位招租',
        href: 'https://github.com/famishedfish/BS-project',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <ProLayout
      logo={logo}
      title="eIoT System"
      {...props}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: "首页",
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => {
          return defaultFooterDom;
      }}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
    >
        {children}
    </ProLayout>
  );
};

export default connect(({ global }) => ({
  collapsed: global.collapsed,
}))(BasicLayout);
