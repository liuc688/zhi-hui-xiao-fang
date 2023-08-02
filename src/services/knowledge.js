import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

//分库分页
export async function bases_paginate(params) {
    return request(`${BASE_URL}/bases/paginate`, params || {}, METHOD.POST)
  }

// 分库添加
export async function bases_add(params) {
  return request(`${BASE_URL}/bases/add`, params || {}, METHOD.POST)
}

// 分库修改
export async function bases_edit(params) {
  return request(`${BASE_URL}/bases/edit`, params || {}, METHOD.POST)
}

// 分库删除
export async function bases_delete(params) {
  return request(`${BASE_URL}/bases/delete`, params || {}, METHOD.POST)
}

// 题目增加
export async function questions_add(params) {
  return request(`${BASE_URL}/questions/add`, params || {}, METHOD.POST)
}

// 题目编辑
export async function questions_edit(params) {
  return request(`${BASE_URL}/questions/edit`, params || {}, METHOD.POST)
}

// 题目删除
export async function questions_delete(params) {
  return request(`${BASE_URL}/questions/delete`, params || {}, METHOD.POST)
}

// 分库删除
export async function questions_paginate(params) {
  return request(`${BASE_URL}/questions/paginate`, params || {}, METHOD.POST)
}

// 科目添加
export async function subjects_add(params) {
  return request(`${BASE_URL}/subjects/add`, params || {}, METHOD.POST)
}

// 科目修改
export async function subjects_edit(params) {
  return request(`${BASE_URL}/subjects/edit`, params || {}, METHOD.POST)
}

// 科目删除
export async function subjects_delete(params) {
  return request(`${BASE_URL}/subjects/delete`, params || {}, METHOD.POST)
}

// 科目分页
export async function subjects_paginate(params) {
  return request(`${BASE_URL}/subjects/paginate`, params || {}, METHOD.POST)
}
//科目列表
export async function subjects_list(params) {
  return request(`${BASE_URL}/subjects/list`, params || {}, METHOD.POST)
}
//试卷添加
export async function papers_add(params) {
  return request(`${BASE_URL}/papers/add`, params || {}, METHOD.POST)
}
//试卷修改
export async function papers_edit(params) {
  return request(`${BASE_URL}/papers/edit`, params || {}, METHOD.POST)
}
//试卷删除
export async function papers_delete(params) {
  return request(`${BASE_URL}/papers/delete`, params || {}, METHOD.POST)
}
//试卷分页
export async function papers_paginate(params) {
  return request(`${BASE_URL}/papers/paginate`, params || {}, METHOD.POST)
}
//题目列表
export async function questions_list(params) {
  return request(`${BASE_URL}/questions/list`, params || {}, METHOD.POST)
}
//考试添加
export async function examinations_add(params) {
  return request(`${BASE_URL}/examinations/add`, params || {}, METHOD.POST)
}
//考试修改
export async function examinations_edit(params) {
  return request(`${BASE_URL}/examinations/edit`, params || {}, METHOD.POST)
}
//考试删除
export async function examinations_delete(params) {
  return request(`${BASE_URL}/examinations/delete`, params || {}, METHOD.POST)
}
//考试分页
export async function examinations_paginate(params) {
  return request(`${BASE_URL}/examinations/paginate`, params || {}, METHOD.POST)
}
//参加考试
export async function examinees_add(params) {
  return request(`${BASE_URL}/examinees/add`, params || {}, METHOD.POST)
}

//试卷获取
export async function examinees_get(params) {
  return request(`${BASE_URL}/examinees/get`, params || {}, METHOD.POST)
}
//自动打分
export async function examinees_chitotal(params) {
  return request(`${BASE_URL}/examinees/chitotal`, params || {}, METHOD.POST)
}
//成绩列表
export async function examinees_paginate(params) {
  return request(`${BASE_URL}/examinees/paginate`, params || {}, METHOD.POST)
}
//解答题获取
export async function short_get(params) {
  return request(`${BASE_URL}/examinees/short/get`, params || {}, METHOD.POST)
}
//试卷打分
export async function examinees_total(params) {
  return request(`${BASE_URL}/examinees/total`, params || {}, METHOD.POST)
}

// 供考试人员查看自己的错题
export async function examinees_case(params) {
  return request(`${BASE_URL}/examinees/case`, params || {}, METHOD.POST)
}
