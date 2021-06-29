import React, { useEffect, useRef } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';


const DataList = (props) => {
    const { dispatch, currentUser, records, loading, updating } = props;
    const actionRef = useRef();

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
        {
            title: '数值',
            search: false,
            dataIndex: 'value',
            sorter: true,
            hideInForm: true,
        },
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
            title: '纬度',
            search: false,
            dataIndex: 'lat',
            valueType: 'textarea',
            renderText: (value) => value.toFixed(2),
        },
        {
            title: '经度',
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


    const tableQuery = (params, sorter, filter) => {
        dispatch({
            type: 'login/update',
            payload: { password: currentUser.password, name: currentUser.name },
        });

        while (updating) { }

        let data = records.slice()

        // 只显示用户订阅的设备
        const deviceList = currentUser.devices
        data = data.filter((item) => {
            return deviceList.indexOf(item.clientId) !== -1
        });

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
            />
        </PageContainer>
    );
};

export default connect(({ user, record, loading }) => ({
    currentUser: user.currentUser,
    records: record.records,
    loading: loading.models.record,
    updating: loading.effects['login/update']
}))(DataList);