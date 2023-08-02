import {request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

// 添加
export async function riskrequest_add(params) {
  return request(`${BASE_URL}/riskrequest/add`, params || {},METHOD.POST)
}
// 编辑
export async function riskrequest_edit(params) {
  return request(`${BASE_URL}/riskrequest/edit`, params || {},METHOD.POST)
}
// 详情
export async function riskrequest_get(params) {
  return request(`${BASE_URL}/riskrequest/get`, params || {},METHOD.POST)
}
// 详情
export async function riskrequest_accept(params) {
  return request(`${BASE_URL}/riskrequest/accept`, params || {},METHOD.POST)
}
// 详情
export async function riskrequest_detail(params) {
  return request(`${BASE_URL}/riskrequest/detail`, params || {},METHOD.POST)
}

// 列表
export async function riskrequest_paginate(params) {
  return request(`${BASE_URL}/riskrequest/paginate`, params || {},METHOD.POST)
}
export async function riskrequest_delete(params) {
  return request(`${BASE_URL}/riskrequest/delete`, params || {},METHOD.POST)
}
