import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export async function customer_add(params) {
    return request(`${BASE_URL}/customer/add`, params || {}, METHOD.POST)
}

export async function customer_edit(params) {
    return request(`${BASE_URL}/customer/edit`, params || {}, METHOD.POST)
}

export async function customer_delete(params) {
    return request(`${BASE_URL}/customer/delete`, params || {}, METHOD.POST)
}

export async function customer_list(params) {
    return request(`${BASE_URL}/customer/list`, params || {}, METHOD.POST)
}

