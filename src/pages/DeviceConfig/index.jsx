import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { updateDevice, addDevice, removeDevice } from './service';


const handleAdd = async (fields, currentUser) => {
  const hide = message.loading('正在添加');

  try {
    // 检查clientId是否存在
    const itemId = "device" + fields.clientId;
    if (currentUser.devices.indexOf(itemId) !== -1) {
      hide();
      message.error('设备已存在，添加失败!');
      return false;
    } else {
      await addDevice({ ...fields, userName: currentUser.name });
      hide();
      message.success('🎉 🎉 🎉 添加成功');
      return true;
    }
  } catch (error) {
    hide();
    message.error('添加失败，请稍后重试!');
    return false;
  }
};

const handleUpdate = async (fields, stepFormValues) => {
  const hide = message.loading('正在更新');

  try {
    await updateDevice({ clientId: stepFormValues.clientId, ...fields });
    hide();
    message.success('🎉 🎉 🎉 更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败，请稍后重试!');
    return false;
  }
};


const TableList = (props) => {
  const { dispatch, currentUser, devices, loading, updating } = props;
  // 新建窗口弹窗
  const [createModalVisible, handleModalVisible] = useState(false);
  // 更新窗口弹窗
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const columns = [
    {
      title: '设备ID',
      dataIndex: 'clientId',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '设备ID为必填项',
          },
          {
            pattern: /\d{4}$/,
            message: '设备ID为4位数字',
          },
        ],
      },
      render: (dom, _) => {
        return (
          <a
            onClick={() => {
              alert('显示设备相关信息')
            }}>
            {dom}
          </a>
        );
      },
    },
    {
      title: '设备名',
      dataIndex: 'deviceName',
      valueType: 'textarea',
    },
    {
      title: '类型',
      valueType: 'select',
      dataIndex: 'deviceType',
      search: false,
      filters: true,
      valueEnum: {
        0: { text: '空调' },
        1: { text: '冰箱' },
        2: { text: '电视' },
        3: { text: '热水器' },
        4: { text: '扫地机器人' },
        5: { text: '其他' },
      },
    },
    {
      title: '激活时间',
      dataIndex: 'timestamp',
      sorter: true,
      search: false,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setStepFormValues(record);
          }}>
          配置
        </a>,
        <Divider type="vertical" />,
        <a
          style={{ color: 'red' }}
          onClick={() => {
            handleRemove(record, currentUser);
          }}>
          删除
        </a>,
      ],
    },
  ];

  const handleRemove = (params, currentUser) => {
    Modal.confirm({
      title: '确认删除这台设备吗？',
      content: `设备ID: ${params.clientId}`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {  // 确认
        const hide = message.loading('正在删除');
        try {
          await removeDevice({ clientId: params.clientId, userName: currentUser.name });
          dispatch({
            type: 'device/fetch',
          });
          dispatch({
            type: 'login/update',
            payload: { password: currentUser.password, name: currentUser.name },
          });
          hide();
          message.success('删除成功');
        } catch (error) {
          hide();
          message.error('删除失败，请稍后重试!');
        }
      },
  
    });
  };

  const tableQuery = (params, sorter, filter) => {

    while (updating) { }
    let data = devices.slice()  // original data

    // display subscribed device only
    const deviceList = currentUser.devices
    data = data.filter((item) => {
      return deviceList.indexOf(item.clientId) !== -1
    });

    const searchKeys = Object.keys(params).slice(2)
    searchKeys.forEach((key) => {
      const searchVal = params[key]
      data = data.filter((item) => {
        if (!item[key]) return false  // filter for empty item
        return item[key].indexOf(searchVal) !== -1
      });
    })

    if (sorter) {
      data = data.sort((prev, next) => {
        let sortNumber = 0;
        Object.keys(sorter).forEach((key) => {
          if (sorter[key] === 'descend') {
            if (prev[key] - next[key] > 0) {
              sortNumber += -1;
            } else {
              sortNumber += 1;
            }
            return;
          } else if (sorter[key] === 'ascend') {
            if (prev[key] - next[key] > 0) {
              sortNumber += 1;
            } else {
              sortNumber += -1;
            }
            return;
          }
        });
        return sortNumber;
      });
    }

    if (filter) {
      if (Object.keys(filter).length > 0) {
        data = data.filter((item) => {
          return Object.keys(filter).some((key) => {
            if (!filter[key]) return true;
            if (filter[key].includes(`${item[key]}`)) return true;
            return false;
          });
        });
      }
    }

    const result = {
      data: data,
      success: true,
    };
    return result;
  }

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'device/fetch',
      });
      dispatch({
        type: 'login/update',
        payload: { password: currentUser.password, name: currentUser.name },
      });
    }
  }, []);

  return (
    <PageContainer loading={loading || updating}>
      <ProTable
        headerTitle="查询表格"
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 添加设备
          </Button>,
        ]}
        request={tableQuery}
        columns={columns}
      />
      <ModalForm
        title="添加设备"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value, currentUser);

          if (success) {
            handleModalVisible(false);
            dispatch({
              type: 'login/update',
              payload: { password: currentUser.password, name: currentUser.name },
            });
            dispatch({
              type: 'device/fetch',
            });
          }
        }}
      >

        <ProFormText
          rules={[
            {
              required: true,
              message: "请输入设备ID",
            },
            {
              pattern: /(^\d{4}$)/,
              message: "设备ID需为4位数字",
            },
          ]}
          label="设备ID"
          placeholder="输入4位数，如0001"
          width="md"
          name="clientId"
        />
        <ProFormText
          label="设备名"
          placeholder="可选项"
          width="md"
          name="deviceName"
        />
        <ProFormSelect
          width="sm"
          options={[
            { value: 0, label: '空调' },
            { value: 1, label: '冰箱' },
            { value: 2, label: '电视' },
            { value: 3, label: '热水器' },
            { value: 4, label: '扫地机器人' },
            { value: 5, label: '其他' },
          ]}
          name="deviceType"
          label="设备类型"
          placeholder="选择设备类型"
        />
      </ModalForm>
      <ModalForm
        title="配置设备"
        width="400px"
        visible={updateModalVisible}
        onVisibleChange={handleUpdateModalVisible}
        onFinish={async (value) => {
          const success = await handleUpdate(value, stepFormValues);

          if (success) {
            handleUpdateModalVisible(false);
            dispatch({
              type: 'login/update',
              payload: { password: currentUser.password, name: currentUser.name },
            });
            dispatch({
              type: 'device/fetch',
            });
          }
        }}
      >
        <ProFormText
          label="设备名"
          placeholder="可选项"
          width="md"
          name="deviceName"
        />
        <ProFormSelect
          width="sm"
          options={[
            { value: 0, label: '空调' },
            { value: 1, label: '冰箱' },
            { value: 2, label: '电视' },
            { value: 3, label: '热水器' },
            { value: 4, label: '扫地机器人' },
            { value: 5, label: '其他' },
          ]}
          name="deviceType"
          label="设备类型"
          placeholder="选择设备类型"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default connect(({ user, device, loading }) => ({
  currentUser: user.currentUser,
  devices: device.devices,
  loading: loading.models.device,
  // updating: loading.models.login
  updating: loading.effects['login/update']
}))(TableList);