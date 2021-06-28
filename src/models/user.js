import { registerUser, query as queryUsers } from '@/services/user';
import { message } from 'antd';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    subDevices: [], // 用户订阅的设备
  },
  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(registerUser, payload);

      if (response.status === 'ok') {
        message.success('🎉 🎉 🎉  注册成功！');
      } 
      if (response.status === 'nameDup') {
        message.error('用户名重复！');
      } 
      if (response.status === 'phoneDup') {
        message.error('手机号已注册！');
      } 
      if (response.status === 'emailDup') {
        message.error('邮箱已注册！');
      }
    },

    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'fetchCurrentUser',
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {  // TODO 完善头像
        ...state, 
        currentUser: {...action.payload, avatar:'https://z3.ax1x.com/2021/06/27/RYWlJU.jpg'},
      }
    },

    fetchCurrentUser(state, action) {
      return {
        ...state, 
        currentUser: {...state.currentUser} || {},
      }
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
