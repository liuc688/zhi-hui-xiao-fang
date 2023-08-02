import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function sample_add(params) {
    return request(`${BASE_URL}/sample/add`, params || {}, METHOD.POST)
}
export async function sample_edit(params) {
    return request(`${BASE_URL}/sample/edit`, params || {}, METHOD.POST)
}
export async function sample_delete(params) {
    return request(`${BASE_URL}/sample/delete`, params || {}, METHOD.POST)
}

export async function sample_get(params) {
    return request(`${BASE_URL}/sample/get`, params || {}, METHOD.POST)
}

export async function sample_paginate(params) {
    return request(`${BASE_URL}/sample/paginate`, params || {}, METHOD.POST)
}