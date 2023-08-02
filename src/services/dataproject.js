import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 项目管理
 */
// 分页
export async function project_paginate(params) {
    return request(`${BASE_URL}/project/paginate`, params || {}, METHOD.POST)
}
// 新增
export async function project_create(params) {
    return request(`${BASE_URL}/project/create`, params || {}, METHOD.POST)
}
// 编辑
export async function project_edit(params) {
    return request(`${BASE_URL}/project/edit`, params || {}, METHOD.POST)
}
// 删除
export async function project_delete(params) {
    return request(`${BASE_URL}/project/delete`, params || {}, METHOD.POST)
}
// 还原
export async function project_restore(params) {
    return request(`${BASE_URL}/project/restore`, params || {}, METHOD.POST)
}
// 详情
export async function project_get(params) {
    return request(`${BASE_URL}/project/get`, params || {}, METHOD.POST)
}
//
/** 报表管理 */
// 分页
export async function report_paginate(params) {
    return request(`${BASE_URL}/report/paginate`, params || {}, METHOD.POST)
}
// 删除
export async function report_delete(params) {
    return request(`${BASE_URL}/report/delete`, params || {}, METHOD.POST)
}
// 还原
export async function report_restore(params) {
    return request(`${BASE_URL}/report/restore`, params || {}, METHOD.POST)
}
// 运行
export async function report_run(params) {
    return request(`${BASE_URL}/report/run`, params || {}, METHOD.POST)
}