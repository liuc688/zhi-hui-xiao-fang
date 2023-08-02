import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function human_add(params) {
    return request(`${BASE_URL}/human/add`, params || {}, METHOD.POST)
}

export async function human_edit(params) {
    return request(`${BASE_URL}/human/edit`, params || {}, METHOD.POST)
}

export async function human_delete(params) {
    return request(`${BASE_URL}/human/delete`, params || {}, METHOD.POST)
}

export async function human_list(params) {
    return request(`${BASE_URL}/human/list`, params || {}, METHOD.POST)
}

export async function human_get(params) {
    return request(`${BASE_URL}/human/get`, params || {}, METHOD.POST)
}