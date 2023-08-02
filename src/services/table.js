import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function table_form(params) {
    return request(`${BASE_URL}/table/form`, params || {}, METHOD.POST)
}

export async function table_form_get(params) {
    return request(`${BASE_URL}/table/form/get`, params || {}, METHOD.POST)
}