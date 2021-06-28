import { query as queryRecords } from '@/services/record';

const RecordModel = {
    namespace: 'record',
    state: {
        records: [],
    },
    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(queryRecords);  // 获取所有上报消息
            yield put({
                type: 'saveRecords',
                payload: response,
            });
        },

    },
    reducers: {
        saveRecords(state, action) {
            const { data } = action.payload
            const records = data.filter(function(item){ // 去除空消息
                return item.alert !== undefined
            });
            return {
                ...state,
                records: records
            }
        },
    },
};
export default RecordModel;
