import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

// 访客权限
export async function guest_get(params) {
    return request(`${BASE_URL}/guest/get`, params || {}, METHOD.POST)
}

// 访客权限编辑
export async function guest_edit(params) {
    return request(`${BASE_URL}/guest/edit`, params || {}, METHOD.POST)
}
