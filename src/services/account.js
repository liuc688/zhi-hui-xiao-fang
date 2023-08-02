import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export async function account_plan_add(params) {
    return request(`${BASE_URL}/account/plan/add`, params || {}, METHOD.POST)
}

export async function account_plan_edit(params) {
    return request(`${BASE_URL}/account/plan/edit`, params || {}, METHOD.POST)
}

export async function account_plan_delete(params) {
    return request(`${BASE_URL}/account/plan/delete`, params || {}, METHOD.POST)
}

export async function account_plan_list(params) {
    return request(`${BASE_URL}/account/plan/list`, params || {}, METHOD.POST)
}

export async function account_plan_pay(params) {
    return request(`${BASE_URL}/account/plan/pay`, params || {}, METHOD.POST)
}

export async function account_list(params) {
    return request(`${BASE_URL}/account/list`, params || {}, METHOD.POST)
}