import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 组织列表
export async function email_site_list(params) {
    return request(`${BASE_URL}/email/organization/list`, params || {}, METHOD.POST)
}
// 邮件分页
export async function email_paginate(params) {
    return request(`${BASE_URL}/email/paginate`, params || {}, METHOD.POST)
}
// 邮件获取
export async function email_get(params) {
    return request(`${BASE_URL}/email/get`, params || {}, METHOD.POST)
}
// 邮件不予受理
export async function email_refuse(params) {
    return request(`${BASE_URL}/email/refuse`, params || {}, METHOD.POST)
}
// 邮件退回
export async function email_back(params) {
    return request(`${BASE_URL}/email/back`, params || {}, METHOD.POST)
}
// 邮件回复
export async function email_reply(params) {
    return request(`${BASE_URL}/email/reply`, params || {}, METHOD.POST)
}
// 邮件转发
export async function email_transpond(params) {
    return request(`${BASE_URL}/email/transpond`, params || {}, METHOD.POST)
}
// 信箱转发权限验证
export async function email_forwards_get(params) {
  return request(`${BASE_URL}/email/forwards/get`, params || {}, METHOD.POST)
}