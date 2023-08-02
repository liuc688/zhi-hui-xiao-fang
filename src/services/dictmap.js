import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function dictmap_add(params) {
  return request(`${BASE_URL}/dict/add`, params || {}, METHOD.POST)
}

export async function dictmap_edit(params) {
  return request(`${BASE_URL}/dict/edit`, params || {}, METHOD.POST)
}

export async function dictmap_del(params) {
  return request(`${BASE_URL}/dict/delete`, params || {}, METHOD.POST)
}

export async function dictmap_tree(params) {
  return request(`${BASE_URL}/dict/tree`, params || {}, METHOD.POST)
}

export async function dictmap_list(params) {
  return request(`${BASE_URL}/dict/list`, params || {}, METHOD.POST)
}