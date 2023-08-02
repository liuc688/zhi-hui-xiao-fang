import {  BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export async function systemstatus_get(params) {
    return request(`${BASE_URL}/systemstatus/get`, params || {}, METHOD.POST)
}