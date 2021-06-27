import { query as queryDevices } from '@/services/device';

import moment from 'moment';

const DeviceModel = {
    namespace: 'device',
    state: {
        total: 0,
        online: 0,
        devices: [],
        newDev: [],
    },
    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(queryDevices);  // 获取所有设备信息
            yield put({
                type: 'saveDevices',
                payload: response,
            });
        },

    },
    reducers: {
        saveDevices(state, action) {
            const { online, data: devices } = action.payload
            
            const endDay = new Date().getTime();
            const beginDay = endDay - 86400000 * 9
            let tmpData = {}
            for (let i = 0; i < 10; i += 1) {
                const date = moment(beginDay + 86400000 * i).format('YYYY-MM-DD');
                tmpData[date] = 0;
            }
            devices.filter((item) => {
                if(item.timestamp >= beginDay && item.timestamp <= endDay) {
                    const date = moment(item.timestamp).format('YYYY-MM-DD');
                    tmpData[date] += 1;
                    return true;
                }
                return false;
            });

            const newData = [];
            let newTotal = 0;
            Object.keys(tmpData).forEach((key) => {
                newData.push({
                    x: key,
                    y: tmpData[key],
                })
                newTotal += tmpData[key];
            });
            
            return {
                ...state,
                total: devices.length,
                online: online,
                devices: devices,
                newData: newData,
                newTotal: newTotal
            }
        },
    },
};
export default DeviceModel;
