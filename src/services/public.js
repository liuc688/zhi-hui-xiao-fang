import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'


/**
 * 应用列表
 * @param keyword 关键字检索,检索字段:title,name
 * @param sort 排序字段,默认sort
 * @param order_by 排序字段,默认 sort倒序
 * @returns {Promise<AxiosResponse<T>>}
 */
// 线下申请新增
export async function public_insert(params) {
  return request(`${BASE_URL}/public/insert`, params || {}, METHOD.POST)
}
// 线下申请编辑
export async function edit(params) {
  return request(`${BASE_URL}/public/edit`, params || {}, METHOD.POST)
}
// 申请分页
export async function public_paginate(params) {
  return request(`${BASE_URL}/public/paginate`, params || {}, METHOD.POST)
}
// 申请获取
export async function public_get(params) {
  return request(`${BASE_URL}/public/get`, params || {}, METHOD.POST)
}
// 标签获取
export function statistics(data) {
  return request(`${BASE_URL}/public/statistics`, data)
}
// 标签信息获取
export function keywordsapply(data) {
  return request(`${BASE_URL}/keywords/apply`, data)
}
// 标签列表
export function keywordslist(data) {
  return request(`${BASE_URL}/keywords/list`, data)
}
// 模板列表
export function uploadlist(data) {
  return request(`${BASE_URL}/module/list`, data)
}
// 待补证
export function repair(data) {
  return request(`${BASE_URL}/add/repair`, data)
}
// 补证资料
export function addition(data) {
  return request(`${BASE_URL}/add/material`, data)
}
// 待征求第三方意见
export function opinion(data) {
  return request(`${BASE_URL}/submit/opinion`, data)
}
// 录入第三方意见
export function opinioned(data) {
  return request(`${BASE_URL}/submit/opinioned`, data)
}
// 待补充协办信息
export function teamwork(data) {
  return request(`${BASE_URL}/team/work`, data)
}
// 录入协办信息
export function teamworked(data) {
  return request(`${BASE_URL}/team/worked`, data)
}
// 申请延期
export function defer(data) {
  return request(`${BASE_URL}/public/defer`, data)
}
// 答复
export function reply(data) {
  return request(`${BASE_URL}/public/reply`, data)
}
// 补充答复
export function restore(data) {
  return request(`${BASE_URL}/add/reply`, data)
}
// 行政复议
export function reconsider(data) {
  return request(`${BASE_URL}/public/reconsider`, data)
}
// 行政诉讼
export function lawsuit(data) {
  return request(`${BASE_URL}/public/lawsuit`, data)
}
// 撤销申请
export function repeal(data) {
  return request(`${BASE_URL}/public/repeal`, data)
}
// 站点-配置获取
export function config(data) {
  return request(`${BASE_URL}/config/get`, data)
}
// 站点-配置保存
export function apply_config(data) {
  return request(`${BASE_URL}/apply/config`, data)
}
// 模板列表
export function module_list(data) {
  return request(`${BASE_URL}/module/list`, data)
}
// 模板上传
export function module_upload(data) {
  return request(`${BASE_URL}/module/upload`, data)
}
// 模板上传
export function replace(data) {
  return request(`${BASE_URL}/module/replace`, data)
}
// 标签录入
export function keywords(data) {
  return request(`${BASE_URL}/public/keywords`, data)
}

// 状态饼状图
export function count(data) {
  return request(`${BASE_URL}/public/count`, data)
}
// 复议折线图
export function reconsidercount(data) {
  return request(`${BASE_URL}/reconsider/count`, data)
}
// 组织每月统计图 
export function organstatus(data) {
  return request(`${BASE_URL}/organization/statistics`, data)
}
// 组织列表
export async function site_list(params) {
  return request(`${BASE_URL}/opinion/site/list`, params || {}, METHOD.POST)
}
//  ++
// 应用配置

export async function application_config(params) {
  return request(`${BASE_URL}/application/config`, params || {}, METHOD.POST)
}