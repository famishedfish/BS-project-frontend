import request from '@/utils/request';
export async function query(params) {
  return request('/api/datas/fetch', {  // 获取所有上报消息
    method: 'POST',
  });
}
