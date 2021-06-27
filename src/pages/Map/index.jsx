import React, { useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';


const Map = (props) => {
    const { dispatch, currentUser, records, loading, updating } = props;

    const tableQuery = (params, sorter, filter) => {
        // dispatch({
        //     type: 'login/update',
        //     payload: { password: currentUser.password, name: currentUser.name },
        // });

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
            dispatch({
                type: 'login/update',
                payload: { password: currentUser.password, name: currentUser.name },
            });
        }
    }, []);

    return (
        <PageContainer loading={loading}>
            <Card>
                App
            </Card>
        </PageContainer>
    );
};

export default connect(({ user, record, loading }) => ({
    currentUser: user.currentUser,
    records: record.records,
    loading: loading.models.record,
    updating: loading.effects['login/update']
}))(Map);