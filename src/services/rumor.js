import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function rumortemplate_add(params) {
    return request(`${BASE_URL}/rumortemplate/add`, params || {}, METHOD.POST)
}
export async function rtemplate_edit(params) {
    return request(`${BASE_URL}/rumortemplate/edit`, params || {}, METHOD.POST)
}
export async function rtemplate_delete(params) {
    return request(`${BASE_URL}/rumortemplate/delete`, params || {}, METHOD.POST)
}

export async function rtemplate_get(params) {
    return request(`${BASE_URL}/rumortemplate/get`, params || {}, METHOD.POST)
}
export async function rtemplate_paginate(params) {
    return request(`${BASE_URL}/rumortemplate/paginate`, params || {}, METHOD.POST)
}

export async function sample_add(params) {
    return request(`${BASE_URL}/rumorsamples/add`, params || {}, METHOD.POST)
}
export async function sample_edit(params) {
    return request(`${BASE_URL}/rumorsamples/edit`, params || {}, METHOD.POST)
}
export async function sample_delete(params) {
    return request(`${BASE_URL}/rumorsamples/delete`, params || {}, METHOD.POST)
}

export async function sample_get(params) {
    return request(`${BASE_URL}/rumorsamples/get`, params || {}, METHOD.POST)
}

export async function sample_paginate(params) {
    return request(`${BASE_URL}/rumorsamples/paginate`, params || {}, METHOD.POST)
}