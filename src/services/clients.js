import { BASE_URL } from '@/services/api'
import {request, METHOD } from '@/utils/request'

// 添加
export async function client_add(params) {
  return request(`${BASE_URL}/client/add`, params || {},METHOD.POST)
}
// 编辑
export async function client_edit(params) {
  return request(`${BASE_URL}/client/edit`, params || {},METHOD.POST)
}
// 详情
export async function client_get(params) {
  return request(`${BASE_URL}/client/get`, params || {},METHOD.POST)
}

// 列表
export async function client_paginate(params) {
  return request(`${BASE_URL}/client/paginate`, params || {},METHOD.POST)
}
// 删除
export async function client_delete(params) {
  return request(`${BASE_URL}/client/delete`, params || {},METHOD.POST)
}
// 路由信息分组
export async function routeinfo_group(params) {
  return request(`${BASE_URL}/routeinfo/group`, params || {},METHOD.POST)
}
// 路由信息分组
export async function routeinfo_list(params) {
  return request(`${BASE_URL}/routeinfo/list`, params || {},METHOD.POST)
}
// 应用列表 application/list
export async function application_list(params) {
  return request(`${BASE_URL}/application/list`, params || {},METHOD.POST)
}