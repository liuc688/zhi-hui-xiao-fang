import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function report_add(params) {
    return request(`${BASE_URL}/report/add`, params || {}, METHOD.POST)
}
export async function report_edit(params) {
    return request(`${BASE_URL}/report/edit`, params || {}, METHOD.POST)
}
export async function report_delete(params) {
    return request(`${BASE_URL}/report/delete`, params || {}, METHOD.POST)
}
export async function report_get(params) {
    return request(`${BASE_URL}/report/get`, params || {}, METHOD.POST)
}

export async function forecast_add(params) {
    return request(`${BASE_URL}/forecast/add`, params || {}, METHOD.POST)
}

export async function forecast_get(params) {
    return request(`${BASE_URL}/forecast/get`, params || {}, METHOD.POST)
}

export async function report_paginate(params) {
    return request(`${BASE_URL}/report/paginate`, params || {}, METHOD.POST)
}