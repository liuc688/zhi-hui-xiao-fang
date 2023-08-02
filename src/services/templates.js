import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'


export async function template_add(params) {
    return request(`${BASE_URL}/template/add`, params || {}, METHOD.POST)
}

export async function template_edit(params) {
    return request(`${BASE_URL}/template/edit`, params || {}, METHOD.POST)
}

export async function template_list(params) {
    return request(`${BASE_URL}/template/list`, params || {}, METHOD.POST)
}

export async function template_paginate(params) {
    return request(`${BASE_URL}/template/paginate`, params || {}, METHOD.POST)
}

export async function template_dir(params) {
    return request(`${BASE_URL}/template/dir`, params || {}, METHOD.POST)
}

export async function template_share(params) {
    return request(`${BASE_URL}/template/share`, params || {}, METHOD.POST)
}

export async function template_delete(params) {
    return request(`${BASE_URL}/template/delete`, params || {}, METHOD.POST)
}

export async function template_timeline(params) {
    return request(`${BASE_URL}/template/timeline`, params || {}, METHOD.POST)
}
// 分享模板分页
export async function template_sharepaginate(params) {
    return request(`${BASE_URL}/template/sharepaginate`, params || {}, METHOD.POST)
}
// 分享模板下载
export async function template_download(params) {
    return request(`${BASE_URL}/template/download`, params || {}, METHOD.POST)
}
// 分享模板批量下载
export async function template_batchdownload(params) {
    return request(`${BASE_URL}/template/batchdownload`, params || {}, METHOD.POST)
}