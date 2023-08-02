import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'


export async function policy_list(params) {
    return request(`${BASE_URL}/policy/list`, params || {}, METHOD.POST)
}
export async function policy_paginate(params) {
    return request(`${BASE_URL}/policy/paginate`, params || {}, METHOD.POST)
}
export async function policy_get(params) {
    return request(`${BASE_URL}/policy/get`, params || {}, METHOD.POST)
}
export async function policy_edit(params) {
    return request(`${BASE_URL}/policy/edit`, params || {}, METHOD.POST)
}
export async function policy_delete(params) {
    return request(`${BASE_URL}/policy/delete`, params || {}, METHOD.POST)
}
export async function policy_routes(params) {
    return request( `${BASE_URL}/policy/routes`, params || {}, METHOD.POST)
}
export async function policy_add(params) {
    return request(`${BASE_URL}/policy/add`, params || {}, METHOD.POST)
}
// 策略树
export async function policy_tree(params) {
    return request(`${BASE_URL}/policy/tree`, params || {}, METHOD.POST)
}
// 策略树
export async function policy_alltree(params) {
    return request(`${BASE_URL}/policy/alltree`, params || {}, METHOD.POST)
}