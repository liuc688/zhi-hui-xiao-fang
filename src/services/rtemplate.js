import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function rtemplate_add(params) {
    return request(`${BASE_URL}/rtemplate/add`, params || {}, METHOD.POST)
}
export async function rtemplate_edit(params) {
    return request(`${BASE_URL}/rtemplate/edit`, params || {}, METHOD.POST)
}
export async function rtemplate_delete(params) {
    return request(`${BASE_URL}/rtemplate/delete`, params || {}, METHOD.POST)
}

export async function rtemplate_get(params) {
    return request(`${BASE_URL}/rtemplate/get`, params || {}, METHOD.POST)
}
export async function rtemplate_paginate(params) {
    return request(`${BASE_URL}/rtemplate/paginate`, params || {}, METHOD.POST)
}