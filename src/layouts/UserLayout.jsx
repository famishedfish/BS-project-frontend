import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, connect, FormattedMessage } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>eIoT System</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="pages.layouts.userLayout.title"
                defaultMessage="累计用户量达1人的物联网应用管理系统"
              />
            </div>
          </div>
          {children}
        </div>
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
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
