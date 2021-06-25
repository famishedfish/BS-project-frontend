import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { connect, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import moment from 'moment';
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


const DataList = (props) => {
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const actionRef = useRef();
    const [currentRow, setCurrentRow] = useState();
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
            search: false,
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
            valueType: 'select',
            dataIndex: 'alert',
            search: false,
            filters: true,
            valueEnum: {
                0: {
                    text: '正常',
                    status: 'Success',
                },
                1: {
                    text: '告警',
                    status: 'Error',
                },
            },
        },
        {
            title: '上报时间',
            dataIndex: 'timestamp',
            sorter: true,
            valueType: 'date',
            hideInForm: true,
        },
        {
            title: '经度',
            search: false,
            dataIndex: 'lat',
            valueType: 'textarea',
            renderText: (value) => value.toFixed(2),
        },
        {
            title: '纬度',
            search: false,
            dataIndex: 'lng',
            valueType: 'textarea',
            renderText: (value) => value.toFixed(2),
        },
        {
            title: '消息',
            search: false,
            dataIndex: 'info',
            valueType: 'textarea',
        },
    ];

    const { dispatch, records, loading } = props;

    const tableQuery = (params, sorter, filter) => {
        let data = records.slice()
        const searchKeys = Object.keys(params).slice(2)

        searchKeys.forEach((key) => {
            const searchVal = params[key]
            data = data.filter((item) => {
                if (key === 'clientId') return item[key].indexOf(searchVal) !== -1
                else {
                    return moment(item[key]).format('YYYY-MM-DD') === searchVal
                }
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

        if(filter) {
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
                type: 'record/fetch',
            });
        }
    }, []);

    return (
        <PageContainer loading={loading}>
            <ProTable
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                request={tableQuery}
                columns={columns}
                // beforeSearchSubmit={handleSearch}
            />
            {/* <UpdateForm
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
            /> */}

            {/* <Drawer
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
            </Drawer> */}
        </PageContainer>
    );
};

// export default DataList;
export default connect(({ record, loading }) => ({
    records: record.records,
    loading: loading.effects['record/fetch'], // login effect是否正在运行
    // loading: loading.models.record
}))(DataList);