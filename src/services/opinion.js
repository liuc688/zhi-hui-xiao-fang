import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 意见征集分页
export async function draft_paginate(params) {
  return request(`${BASE_URL}/draft/paginate`, params || {}, METHOD.POST)
}
// 组织列表
export async function site_list(params) {
    return request(`${BASE_URL}/opinion/site/list`, params || {}, METHOD.POST)
}
// 组织树
export async function organization_tree(params) {
    return request(`${BASE_URL}/organization/tree`, params || {},METHOD.POST)
  }
// 草案添加
export async function draft_add(params) {
    return request(`${BASE_URL}/draft/add`, params || {}, METHOD.POST)
}
// 草案编辑
export async function draft_update(params) {
    return request(`${BASE_URL}/draft/update`, params || {}, METHOD.POST)
}
// 草案删除
export async function draft_delete(params) {
    return request(`${BASE_URL}/draft/delete`, params || {}, METHOD.POST)
}
// 草案详情
export async function draft_get(params) {
    return request(`${BASE_URL}/draft/get`, params || {}, METHOD.POST)
}
// 意见添加
export async function opinion_add(params) {
    return request(`${BASE_URL}/opinion/add`, params || {}, METHOD.POST)
}
// 意见审核
export async function opinion_check(params) {
    return request(`${BASE_URL}/opinion/check`, params || {}, METHOD.POST)
}
// 意见移除
export async function opinion_remove(params) {
    return request(`${BASE_URL}/opinion/remove`, params || {}, METHOD.POST)
}

// 草案分页
export async function mold_paginate(params) {
    return request(`${BASE_URL}/mold/paginate`, params || {}, METHOD.POST)
}
// 草案编辑
export async function mold_update(params) {
    return request(`${BASE_URL}/mold/update`, params || {}, METHOD.POST)
}
// 草案新增
export async function mold_add(params) {
    return request(`${BASE_URL}/mold/add`, params || {}, METHOD.POST)
}
// 草案删除
export async function mold_delete(params) {
    return request(`${BASE_URL}/mold/delete`, params || {}, METHOD.POST)
}
// 草案列表
export async function mold_list(params) {
    return request(`${BASE_URL}/mold/list`, params || {}, METHOD.POST)
}

// 草案类别获取
export async function mold_get(params) {
    return request(`${BASE_URL}/mold/get`, params || {}, METHOD.POST)
}
// 获取目录
export async function channel_list(params) {
    return request(`${BASE_URL}/channel/list`, params || {}, METHOD.POST)
}