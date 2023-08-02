import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 最新发文
export function news(data) {
    return request(`${BASE_URL}/chart/new`,data)
}
// 日发文量统计
export function daycounts(data) {
    return request(`${BASE_URL}/chart/daycount`,data)
}
// 部门发文量
export function organizations(data) {
    return request(`${BASE_URL}/organization/chart`,data)
}
// 日发文量
export function counts(data) {
    return request(`${BASE_URL}/chart/count`,data)
}
// 三天未更新文章部门查询
export function organizationout(data) {
    return request(`${BASE_URL}/organization/out`,data)
}
// 发文关联率
export function relevance(data) {
    return request(`${BASE_URL}/chart/relevance`,data)
}
/** 督导任务 */
// 任务分类
export function count(data) {
    return request(`${BASE_URL}/mission/count`, data)
}
// 部门任务折线图
export function organization(data) {
    return request(`${BASE_URL}/mission/organization`, data)
}
// 完成任务列表
export function list(data) {
    return request(`${BASE_URL}/mission/finish/list`, data)
}
// 任务完成度
export function finished(data) {
    return request(`${BASE_URL}/mission/finishing`, data)
}

//签审超期评估
export function chart_frequency(data) {
    return request(`${BASE_URL}/chart/frequency`, data)
}
// 多媒体使用评估 /chart/multimedi
export function chart_multimedi(data) {
    return request(`${BASE_URL}/chart/multimedi`, data)
}

// 访问量评估 /chart/visit
export function chart_visit(data) {
    return request(`${BASE_URL}//chart/visit`, data)
}