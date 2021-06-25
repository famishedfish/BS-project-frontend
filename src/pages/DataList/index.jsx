import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { connect, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
    const hide = message.loading('Adding');

    try {
        await addRule({ ...fields });
        hide();
        message.success('Added successfully');
        return true;
    } catch (error) {
        hide();
        message.error('Adding failed, please try again!');
        return false;
    }
};
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
    const hide = message.loading('Configuring');

    try {
        await updateRule({
            name: fields.name,
            desc: fields.desc,
            key: fields.key,
        });
        hide();
        message.success('Configuration is successful');
        return true;
    } catch (error) {
        hide();
        message.error('Configuration failed, please try again!');
        return false;
    }
};
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
    const hide = message.loading('Deleting');
    if (!selectedRows) return true;

    try {
        await removeRule({
            key: selectedRows.map((row) => row.key),
        });
        hide();
        message.success('Deleted successfully and will refresh soon');
        return true;
    } catch (error) {
        hide();
        message.error('Delete failed, please try again');
        return false;
    }
};

const DataList = (props) => {
    /**
     * @en-US Pop-up window of new window
     * @zh-CN 新建窗口的弹窗
     *  */
    /**
     * @en-US The pop-up window of the distribution update window
     * @zh-CN 分布更新窗口的弹窗
     * */

    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const actionRef = useRef();
    const [currentRow, setCurrentRow] = useState();
    const [selectedRowsState, setSelectedRows] = useState([]);
    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */

    const columns = [
        {
            title: '设备ID',
            dataIndex: 'clientId',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '规则名称为必填项',
                    },
                ],
            },
        },
        // {
        //     title: '设备名',
        //     dataIndex: 'deviceName',
        //     tip: '在设备配置页面中重命名',
        //     valueType: 'textarea',
        // },
        {
            title: '数值',
            dataIndex: 'value',
            sorter: true,
            hideInForm: true,
        },
        // {
        //     title: '设备类型',
        //     dataIndex: 'deviceType',
        //     valueType: 'select',
        //     filters: true,
        //     onFilter: true,
        //     valueEnum: {
        //         rifrig: {
        //             text: '冰箱',
        //         },
        //         aircond: {
        //             text: '空调',
        //         },
        //     },
        // },
        {
            title: '状态',
            dataIndex: 'status',
            hideInForm: true,
            valueEnum: {
                0: {
                    text: '正常',
                    status: 'Default',
                },
                1: {
                    text: '告警',
                    status: 'Processing',
                },
            },
        },
        {
            title: '上报时间',
            dataIndex: 'updatedAt',
            sorter: true,
            valueType: 'date',
            hideInForm: true,
        },
        {
            title: '位置',
            dataIndex: 'position',
            valueType: 'textarea',
            renderText: (lat, lng) => `(${lat}, ${lng} )`,
        },
        {
            title: '消息',
            dataIndex: 'info',
            valueType: 'textarea',
        },
    ];

    const { dispatch, records } = props;

    const tableQuery = async (params, sorter, filter) => {
        const result = {
            data: records,
            // total: tableListDataSource.length,
            success: true,
            // pageSize,
            // current: parseInt(`${params.currentPage}`, 10) || 1,
          };
          return result;
    }




      useEffect(() => {
        if (dispatch) {
          dispatch({
            type: 'record/fetch',
          });
        }
      }, []);

    return (
        <PageContainer>
            <ProTable
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                request={tableQuery}
                // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
                columns={columns}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
                            <a
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedRowsState.length}
                            </a>{' '}
                            <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
                            &nbsp;&nbsp;
                            <span>
                                <FormattedMessage
                                    id="pages.searchTable.totalServiceCalls"
                                    defaultMessage="Total number of service calls"
                                />{' '}
                                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
                            </span>
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            await handleRemove(selectedRowsState);
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        <FormattedMessage
                            id="pages.searchTable.batchDeletion"
                            defaultMessage="Batch deletion"
                        />
                    </Button>
                    <Button type="primary">
                        <FormattedMessage
                            id="pages.searchTable.batchApproval"
                            defaultMessage="Batch approval"
                        />
                    </Button>
                </FooterToolbar>
            )}
            <UpdateForm
                onSubmit={async (value) => {
                    const success = await handleUpdate(value);

                    if (success) {
                        handleUpdateModalVisible(false);
                        setCurrentRow(undefined);

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => {
                    handleUpdateModalVisible(false);
                    setCurrentRow(undefined);
                }}
                updateModalVisible={updateModalVisible}
                values={currentRow || {}}
            />

            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.name && (
                    <ProDescriptions
                        column={2}
                        title={currentRow?.name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.name,
                        }}
                        columns={columns}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

// export default DataList;
export default connect(({ record }) => ({
    records: record.records,
  }))(DataList);