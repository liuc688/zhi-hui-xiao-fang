import {request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'
/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function route_list(params) {
  return request(`${BASE_URL}/route/list`, params || {},METHOD.POST)
}

export async function routeinfo_add(params) {
  return request(`${BASE_URL}/routeinfo/add`, params || {},METHOD.POST)
}

export async function routeinfo_edit(params) {
  return request(`${BASE_URL}/routeinfo/edit`, params || {},METHOD.POST)
}

export async function routeinfo_get(params) {
  return request(`${BASE_URL}/routeinfo/get`, params || {},METHOD.POST)
}
// 路由编辑
export async function route_edit(params) {
  return request(`${BASE_URL}/route/edit`, params || {},METHOD.POST)
}

// 路由删除
export async function route_delete(params) {
  return request(`${BASE_URL}/route/delete`, params || {},METHOD.POST)
}
// 同步
export async function route_sync(params) {
  return request(`${BASE_URL}/route/sync`, params || {},METHOD.POST)
}
// 路由分组
export async function routeinfo_group(params) {
  return request(`${BASE_URL}/routeinfo/group`, params || {},METHOD.POST)
}
