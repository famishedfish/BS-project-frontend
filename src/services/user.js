import request from '@/utils/request';

export async function registerUser(params) {
  return request('/api/users/register', {
    method: 'POST',
    data: params,
  });
}