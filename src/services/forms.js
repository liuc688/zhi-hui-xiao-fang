import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 用户表单 分页、添加、编辑
export async function forms_paginate(params) {
  return request(`${BASE_URL}/forms/user/paginate`, params || {}, METHOD.POST)
}
export async function forms_list(params) {
  return request(`${BASE_URL}/forms/user/list`, params || {}, METHOD.POST)
}
export async function forms_add(params) {
  return request(`${BASE_URL}/forms/user/add`, params || {}, METHOD.POST)
}
export async function forms_edit(params) {
  return request(`${BASE_URL}/forms/user/edit`, params || {}, METHOD.POST)
}
// 系统表单 分页、添加、编辑、列表
export async function system_paginate(params) {
  return request(`${BASE_URL}/forms/system/paginate`, params || {}, METHOD.POST)
}
export async function system_add(params) {
  return request(`${BASE_URL}/forms/system/add`, params || {}, METHOD.POST)
}
export async function system_edit(params) {
  return request(`${BASE_URL}/forms/system/edit`, params || {}, METHOD.POST)
}
export async function forms_system_list(params) {
  return request(`${BASE_URL}/forms/system/list`, params || {}, METHOD.POST)
}
// 流程表单 分页、添加、编辑
export async function workflow_paginate(params) {
  return request(`${BASE_URL}/forms/workflow/paginate`, params || {}, METHOD.POST)
}
export async function workflow_add(params) {
  return request(`${BASE_URL}/forms/workflow/add`, params || {}, METHOD.POST)
}
export async function workflow_edit(params) {
  return request(`${BASE_URL}/forms/workflow/edit`, params || {}, METHOD.POST)
}
// 公共方法：获取与删除
export async function form_get(params) {
  return request(`${BASE_URL}/forms/get`, params || {}, METHOD.POST)
}
export async function form_delete(params) {
  return request(`${BASE_URL}/forms/delete`, params || {}, METHOD.POST)
}
/**
 * 获取多个表单
 */
export async function form_multiple(params) {
  return request(`${BASE_URL}/forms/multiple`, params || {}, METHOD.POST)
}