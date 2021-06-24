import request from '@/utils/request';
export async function accountLogin(params) {
  return request('/api/users/login', {
    method: 'POST',
    data: params,
  });
}
