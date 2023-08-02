import { request } from '@/utils/request'
import { BASE_URL } from '@/services/api'

// 动态分页
export function event_paginate(data) {
    return request(`${BASE_URL}/event/paginate`, data)
}
// 发文量统计
export function event_document(data) {
    return request(`${BASE_URL}/event/document`, data)
}
// 任务量统计
export function risk_count(data) {
    return request(`${BASE_URL}/risk/finish/count`, data)
}
// 任务分页
export function risk_paginate(data) {
    return request(`${BASE_URL}/risk/paginate`, data)
}
// 任务完成统计
export function risk_finish(data) {
    return request(`${BASE_URL}/risk/finish`, data)
}
// 站点统计
export function risk_site(data) {
    return request(`${BASE_URL}/risk/site`, data)
}

// 督导各站点任务量
export function risk_site_count(data) {
    return request(`${BASE_URL}/risk/site/count`, data)
}
// 站点任务完成量
export function risk_site_finish(data) {
    return request(`${BASE_URL}/risk/site/finish`, data)
}
// 站点统计完成任务
export function risk_finish_site(data) {
    return request(`${BASE_URL}/risk/finish/site`, data)
}
// 各站点完成度
export function risk_finished_site(data) {
    return request(`${BASE_URL}/risk/finished/site`, data)
}
// 站点任务应发文量
export function risk_taskload(data) {
    return request(`${BASE_URL}/risk/taskload`, data)
}
// 任务详情
export function risk_get(data) {
    return request(`${BASE_URL}/risk/get`, data)
}

// 督导任务新增
export function risk_create(data) {
    return request(`${BASE_URL}/risk/create`, data)
}
// 督导任务编辑
export function risk_edit(data) {
    return request(`${BASE_URL}/risk/edit`, data)
}
// 督导任务删除
export function risk_delete(data) {
    return request(`${BASE_URL}/risk/delete`, data)
}
// 督导任务还原
export function risk_restore(data) {
    return request(`${BASE_URL}/risk/restore`, data)
}
// 督导任务获取
export function risk_gain(data) {
    return request(`${BASE_URL}/risk/gain`, data)
}
// 督导催办
export function event_create(data) {
    return request(`${BASE_URL}/event/create`, data)
}
//获取时间周期
export function datetime_degrees(data) {
    return request(`${BASE_URL}/datetime/degrees`, data)
}
// 删改完成
export function initiative_finish(data) {
    return request(`${BASE_URL}/risk/initiative/finish`, data)
}
// 下级任务列表
export function risk_children(data) {
    return request(`${BASE_URL}/risk/children`, data)
}
