import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export async function contract_add(params) {
    return request(`${BASE_URL}/contract/add`, params || {}, METHOD.POST)
}

export async function contract_edit(params) {
    return request(`${BASE_URL}/contract/edit`, params || {}, METHOD.POST)
}

export async function contract_delete(params) {
    return request(`${BASE_URL}/contract/delete`, params || {}, METHOD.POST)
}
export async function contract_get(params) {
    return request(`${BASE_URL}/contract/get`, params || {}, METHOD.POST)
}
export async function contract_list(params) {
    return request(`${BASE_URL}/contract/list`, params || {}, METHOD.POST)
}

