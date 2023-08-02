import { BACKGROUND_LIST, BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

export function background_list() {
  return request(BACKGROUND_LIST, {}, METHOD.POST)
}

export function background_delete(params) {
  return request(`${BASE_URL}/background/delete`, params || {}, METHOD.POST)
}