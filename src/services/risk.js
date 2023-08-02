import {request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

// 添加
export async function riskinfo_add(params) {
  return request(`${BASE_URL}/riskinfo/add`, params || {},METHOD.POST)
}
// 编辑
export async function riskinfo_edit(params) {
  return request(`${BASE_URL}/riskinfo/edit`, params || {},METHOD.POST)
}
// 详情
export async function riskinfo_get(params) {
  return request(`${BASE_URL}/riskinfo/get`, params || {},METHOD.POST)
}

// 详情
export async function riskinfo_detail(params) {
  return request(`${BASE_URL}/riskinfo/detail`, params || {},METHOD.POST)
}

// 列表
export async function riskinfo_paginate(params) {
  return request(`${BASE_URL}/riskinfo/paginate`, params || {},METHOD.POST)
}