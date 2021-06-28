import request from '@/utils/request';
export async function removeDevice(params) {
  return request('/api/devices/remove', {
    method: 'POST',
    data: { ...params },
  });
}
export async function addDevice(params) {
  return request('/api/devices/add', {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateDevice(params) {
  return request('/api/devices/update', {
    method: 'POST',
    data: { ...params },
  });
}
