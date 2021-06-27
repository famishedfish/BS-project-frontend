import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { connect } from 'umi';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;
  const [type, setType] = useState('account');  // type = ['account', 'register']

  const handleSubmit = (values) => {
    const { dispatch } = props;
    if (type === 'account') {
      dispatch({
        type: 'login/login',
        payload: { ...values, type },
      });
    } else {  // register 
      dispatch({
        type: 'user/register',
        payload: { ...values, type },
      });
    }
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values);
          return Promise.resolve();
        }}
      >
        <Tabs activeKey={type} onChange={setType}>  {/* 账号密码登录&注册 */}
          <Tabs.TabPane
            key="account"
            tab='账号密码登陆'
          />
          <Tabs.TabPane
            key="register"
            tab='注册新用户'
          />
        </Tabs>

        {/* 账号密码错误 */}
        {status === 'error' && type === 'account' && !submitting && (
          <LoginMessage
            content="账号或密码错误"
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="name"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder='用户名'
              rules={[
                {
                  required: true,
                  message: "请输入用户名！",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}

        {type === 'register' && (
          <>
            <ProFormText
              name="name"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: "用户名是必填项！"
                },
                {
                  pattern: /^.{6,}$/, // 至少6字符 
                  message: "用户名至少包含6个字符"
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
                {
                  pattern: /(?=.*\d)(?=.*[a-zA-Z])/,
                  message: "密码必须包含数字及字母，长度至少为6个字符"
                },
              ]}
            />
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={styles.prefixIcon} />,
              }}
              name="phone"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '请输入合法的手机号！',
                },
              ]}
            />
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder="邮箱地址"
              name="email"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱地址！",
                },
                {
                  pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                  message: "不合法的邮箱地址！"
                }
              ]}
            />
          </>
        )}
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'], // login effect是否正在运行
}))(Login);
