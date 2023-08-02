import {  BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export function icon_list() {
  return request(`${BASE_URL}/icon/list`, {}, METHOD.POST)
}

export function icon_delete(params) {
  return request(`${BASE_URL}/icon/delete`, params || {}, METHOD.POST)
}