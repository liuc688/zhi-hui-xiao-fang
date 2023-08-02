import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

// 语料分页
export function corpus_paginate(data) {
  return request(`${BASE_URL}/corpus/paginate`,data)
}

//语料创建
export function corpus_create(data) {
  return request(`${BASE_URL}/corpus/create`,data)
}

// 语料标题验证
export function corpus_title_verify(data) {
  return request(`${BASE_URL}/corpus/title/verify`,data)
}

// 语料编辑
export function corpus_edit(data) {
  return request(`${BASE_URL}/corpus/edit`,data)
}

// 语料删除 
export function corpus_delete(data) {
  return request(`${BASE_URL}/corpus/delete`,data)
}

// 语料还原
export function corpus_restore(data) {
  return request(`${BASE_URL}/corpus/restore`,data)
}

// 语料详情
export function corpus_get(data) {
  return request(`${BASE_URL}/corpus/get`,data)
}

// 语料同步
export function corpus_static(data) {
  return request(`${BASE_URL}/corpus/static`,data)
}

