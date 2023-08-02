import {request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

// 组织树状列表
export async function organization_tree(params) {
  return request(`${BASE_URL}/organization/tree`, params || {},METHOD.POST)
}
// 全部组织树状列表
export async function organization_alltree(params) {
  return request(`${BASE_URL}/organization/alltree`, params || {},METHOD.POST)
}
// 组织添加
export async function organization_add(params) {
  return request(`${BASE_URL}/organization/add`, params || {},METHOD.POST)
}
// 组织获取
export async function organization_get(params) {
  return request(`${BASE_URL}/organization/get`, params || {},METHOD.POST)
}
// 组织编辑
export async function organization_edit(params) {
  return request(`${BASE_URL}/organization/edit`, params || {},METHOD.POST)
}
// 组织列表
export async function organization_list(params) {
  return request(`${BASE_URL}/organization/list`, params || {},METHOD.POST)
}
// 导出站点下发文量
export async function site_documentcount(params) {
  return request(`${BASE_URL}/site/document/count`, params || {},METHOD.POST)
}