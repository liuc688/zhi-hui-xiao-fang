import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export async function approve_add(params) {
    return request(`${BASE_URL}/approve/add`, params || {}, METHOD.POST)
}

export async function approve_submit(params) {
    return request(`${BASE_URL}/approve/submit`, params || {}, METHOD.POST)
}

export async function approve_multiadd(params) {
    return request(`${BASE_URL}/approve/multiadd`, params || {}, METHOD.POST)
}

export async function approve_multisub(params) {
    return request(`${BASE_URL}/approve/multisub`, params || {}, METHOD.POST)
}

export async function approve_document(params) {
    return request(`${BASE_URL}/approve/document`, params || {}, METHOD.POST)
}

export async function approve_versions(params) {
    return request(`${BASE_URL}/approve/versions`, params || {}, METHOD.POST)
}

export async function approve_get(params) {
    return request(`${BASE_URL}/approve/get`, params || {}, METHOD.POST)
}

export async function approved_get(params) {
    return request(`${BASE_URL}/approved/get`, params || {}, METHOD.POST)
}

export async function approved_verify(params) {
    return request(`${BASE_URL}/approved/verify`, params || {}, METHOD.POST)
}

export async function approved_revoke(params) {
    return request(`${BASE_URL}/approved/revoke`, params || {}, METHOD.POST)
}