import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

//预约详情
export async function bookings_get(params) {
    return request(`${BASE_URL}/bookings/get`, params || {}, METHOD.POST)
}

//添加预约
export async function person_add(params) {
    return request(`${BASE_URL}/person/add`, params || {}, METHOD.POST)
}

//我的预约
export async function person_list(params) {
    return request(`${BASE_URL}/person/list`, params || {}, METHOD.POST)
}

//预约受理
export async function person_accept(params) {
    return request(`${BASE_URL}/person/accept`, params || {}, METHOD.POST)
}

//预约列表
export async function bookings_paginate(params) {
    return request(`${BASE_URL}/bookings/paginate`, params || {}, METHOD.POST)
}

//预约项目所有人员的信息
export async function person_paginate(params) {
    return request(`${BASE_URL}/person/paginate`, params || {}, METHOD.POST)
}

