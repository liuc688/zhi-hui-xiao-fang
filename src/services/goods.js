import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

// 商品分页
export async function good_paginate(params) {
    return request(`${BASE_URL}/vol/good/paginate`, params || {}, METHOD.POST)
}
// 商品审核
export async function good_check(params) {
    return request(`${BASE_URL}/vol/good/check`, params || {}, METHOD.POST)
}
// 商品删除
export async function good_delete(params) {
    return request(`${BASE_URL}/vol/good/delete`, params || {}, METHOD.POST)
}
// 商品还原
export async function good_restore(params) {
    return request(`${BASE_URL}/vol/good/restore`, params || {}, METHOD.POST)
}
// 商品详情
export async function good_get(params) {
    return request(`${BASE_URL}/vol/good/get`, params || {}, METHOD.POST)
}
// 商品新增
export async function good_insert(params) {
    return request(`${BASE_URL}/vol/good/insert`, params || {}, METHOD.POST)
}
// 商品编辑
export async function good_edit(params) {
    return request(`${BASE_URL}/vol/good/edit`, params || {}, METHOD.POST)
}
// 兑换列表
export async function value_list(params) {
    return request(`${BASE_URL}/vol/value/list`, params || {}, METHOD.POST)
}
// 兑换商品
export async function success_value(params) {
    return request(`${BASE_URL}/vol/success/value`, params || {}, METHOD.POST)
}
// 删除兑换 
export async function value_delete(params) {
    return request(`${BASE_URL}/vol/value/delete`, params || {}, METHOD.POST)
}