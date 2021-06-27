import { query as queryDevices } from '@/services/device';

const DeviceModel = {
    namespace: 'device',
    state: {
        total: 0,
        online: 0,
        devices: [],
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
            return {
                ...state,
                total: devices.length,
                online: online,
                devices: devices,
            }
        },
    },
};
export default DeviceModel;
