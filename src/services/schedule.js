import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function schedule_add(params) {
    return request(`${BASE_URL}/schedule/add`, params || {}, METHOD.POST)
}

export async function schedule_get(params) {
    return request(`${BASE_URL}/schedule/get`, params || {}, METHOD.POST)
}

export async function schedule_list(params) {
    return request(`${BASE_URL}/schedule/list`, params || {}, METHOD.POST)
}

export async function schedule_paginate(params) {
    return request(`${BASE_URL}/schedule/paginate`, params || {}, METHOD.POST)
}

export async function schedule_delete(params) {
    return request(`${BASE_URL}/schedule/delete`, params || {}, METHOD.POST)
}
/** 日程列表 */
export function schedule_risklist(params) {
    return request(`${BASE_URL}/schedule/risk/list`, params || {}, METHOD.POST)
}
/** 日程详情 */
export function schedule_riskget(params) {
    return request(`${BASE_URL}/schedule/risk/get`, params || {}, METHOD.POST)
}
/** 日程删除 */
export function schedule_riskdelete(params) {
    return request(`${BASE_URL}/schedule/risk/delete`, params || {}, METHOD.POST)
}