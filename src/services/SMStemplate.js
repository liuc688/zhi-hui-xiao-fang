import { request} from '@/utils/request'
import { BASE_URL } from '@/services/api'

/** 短信模板管理 */
// 短信模板分页
export function short_paginate(data) {
    return request(`${BASE_URL}/short/template/paginate`, data)
}
// 短信模板创建
export function short_create(data) {
    return request(`${BASE_URL}/short/template/create`, data)
}
// 短信模板编辑
export function short_edit(data) {
    return request(`${BASE_URL}/short/template/edit`, data)
}
// 短信模板删除
export function short_delete(data) {
    return request(`${BASE_URL}/short/template/delete`, data)
}
// 短信模板还原
export function short_restore(data) {
    return request(`${BASE_URL}/short/template/restore`, data)
}
// 短信模板详情
export function short_get(data) {
    return request(`${BASE_URL}/short/template/get`, data)
}
// 短信模板信息
export function short_info(data) {
    return request(`${BASE_URL}/short/template/info`, data)
}
// 短信模板统计折线图
export function short_count(data) {
    return request(`${BASE_URL}/short/template/count`, data)
}