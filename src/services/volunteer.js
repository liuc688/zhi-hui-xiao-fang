import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 资讯管理 树
export async function document_list(params) {
    return request(`${BASE_URL}/vol/channel/document`, params || {}, METHOD.POST)
}
// 活动管理 树
export async function activity_list(params) {
    return request(`${BASE_URL}/vol/channel/activity`, params || {}, METHOD.POST)
}

// 目录、活动类型 新增
export async function vol_channel_insert(params) {
    return request(`${BASE_URL}/vol/channel/insert`, params || {}, METHOD.POST)
}
// 目录、活动类型编辑
export async function vol_channel_edit(params) {
    return request(`${BASE_URL}/vol/channel/edit`, params || {}, METHOD.POST)
}
// 目录、活动类型删除
export async function vol_channel_delete(params) {
    return request(`${BASE_URL}/vol/channel/delete`, params || {}, METHOD.POST)
}
// 目录、活动类型详情
export async function channel_get(params) {
    return request(`${BASE_URL}/vol/channel/get`, params || {}, METHOD.POST)
}

// 文章分页
export async function vol_document_paginate(params) {
    return request(`${BASE_URL}/vol/document/paginate`, params || {}, METHOD.POST)
}
// 文章审核
export async function document_check(params) {
    return request(`${BASE_URL}/vol/document/check`, params || {}, METHOD.POST)
}
// 文章删除
export async function document_delete(params) {
    return request(`${BASE_URL}/vol/document/delete`, params || {}, METHOD.POST)
}
// 文章新增
export async function document_insert(params) {
    return request(`${BASE_URL}/vol/document/insert`, params || {}, METHOD.POST)
}
// 文章编辑
export async function document_edit(params) {
    return request(`${BASE_URL}/vol/document/edit`, params || {}, METHOD.POST)
}
// 文章详情
export async function document_get(params) {
    return request(`${BASE_URL}/vol/document/get`, params || {}, METHOD.POST)
}
// 文章还原
export async function document_restore(params) {
    return request(`${BASE_URL}/vol/document/restore`, params || {}, METHOD.POST)
}

// 活动分页
export async function vol_activity_paginate(params) {
    return request(`${BASE_URL}/vol/activity/paginate`, params || {}, METHOD.POST)
}
// 活动审核
export async function activity_check(params) {
    return request(`${BASE_URL}/vol/activity/check`, params || {}, METHOD.POST)
}
// 活动删除
export async function activity_delete(params) {
    return request(`${BASE_URL}/vol/activity/delete`, params || {}, METHOD.POST)
}
// 活动新增
export async function activity_insert(params) {
    return request(`${BASE_URL}/vol/activity/insert`, params || {}, METHOD.POST)
}
// 活动新增
export async function activity_edit(params) {
    return request(`${BASE_URL}/vol/activity/edit`, params || {}, METHOD.POST)
}
// 活动详情
export async function activity_get(params) {
    return request(`${BASE_URL}/vol/activity/get`, params || {}, METHOD.POST)
}
// 活动还原
export async function activity_restore(params) {
    return request(`${BASE_URL}/vol/activity/restore`, params || {}, METHOD.POST)
}
// 报名列表
export async function report_list(params) {
    return request(`${BASE_URL}/vol/report/list`, params || {}, METHOD.POST)
}
// 报名审核
export async function report_check(params) {
    return request(`${BASE_URL}/vol/report/check`, params || {}, METHOD.POST)
}
// 报名编辑
export async function report_edit(params) {
    return request(`${BASE_URL}/vol/report/edit`, params || {}, METHOD.POST)
}
// 报名移除
export async function report_cancel(params) {
    return request(`${BASE_URL}/vol/report/cancel`, params || {}, METHOD.POST)
}