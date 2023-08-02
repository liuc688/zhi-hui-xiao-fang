import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 问卷分页
export async function survey_paginate(params) {
    return request(`${BASE_URL}/survey/paginate`, params || {}, METHOD.POST)
}
// 问卷添加
export async function survey_add(params) {
    return request(`${BASE_URL}/survey/add`, params || {}, METHOD.POST)
}
// 问卷编辑
export async function survey_update(params) {
    return request(`${BASE_URL}/survey/update`, params || {}, METHOD.POST)
}
// 问卷获取
export async function survey_get(params) {
    return request(`${BASE_URL}/survey/get`, params || {}, METHOD.POST)
}
