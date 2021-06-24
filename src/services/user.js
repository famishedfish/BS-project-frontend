import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function registerUser(params) {
  return request('/api/users/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
