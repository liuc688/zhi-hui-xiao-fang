import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function project_add(params) {
    return request(`${BASE_URL}/project/add`, params || {}, METHOD.POST)
}

export async function project_edit(params) {
    return request(`${BASE_URL}/project/edit`, params || {}, METHOD.POST)
}

export async function project_delete(params) {
    return request(`${BASE_URL}/project/delete`, params || {}, METHOD.POST)
}

export async function project_list(params) {
    return request(`${BASE_URL}/project/list`, params || {}, METHOD.POST)
}

export async function project_get(params) {
    return request(`${BASE_URL}/project/get`, params || {}, METHOD.POST)
}
export async function project_export(params) {
    return request(`${BASE_URL}/project/export`, params || {}, METHOD.POST)
}
// 客户
export async function customer_export(params) {
    return request(`${BASE_URL}/customer/export`, params || {}, METHOD.POST)
}
// 账款
export async function account_export(params) {
    return request(`${BASE_URL}/account/export`, params || {}, METHOD.POST)
}