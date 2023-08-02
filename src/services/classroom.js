import { BASE_URL } from '@/services/api'
import {request, METHOD } from '@/utils/request'

// 添加
export async function classroom_add(params) {
  return request(`${BASE_URL}/classroom/add`, params || {},METHOD.POST)
}
// 编辑
export async function classroom_edit(params) {
  return request(`${BASE_URL}/classroom/edit`, params || {},METHOD.POST)
}
// 详情
export async function classroom_get(params) {
  return request(`${BASE_URL}/classroom/get`, params || {},METHOD.POST)
}

// 评价
export async function classroom_grade(params) {
  return request(`${BASE_URL}/classroom/grade`, params || {},METHOD.POST)
}
// 获取评价
export async function classroom_get_grade(params) {
  return request(`${BASE_URL}/classroom/get/grade`, params || {},METHOD.POST)
}

// 删除
export async function classroom_delete(params) {
  return request(`${BASE_URL}/classroom/delete`, params || {},METHOD.POST)
}

// 列表
export async function classroom_paginate(params) {
  return request(`${BASE_URL}/classroom/paginate`, params || {},METHOD.POST)
}