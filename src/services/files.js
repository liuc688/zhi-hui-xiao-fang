import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function file_create_file(params) {
    return request(`${BASE_URL}/file/create/file`, params || {}, METHOD.POST)
}

export async function file_create_dir(params) {
    return request(`${BASE_URL}/file/create/dir`, params || {}, METHOD.POST)
}

export async function file_rename(params) {
    return request(`${BASE_URL}/file/rename`, params || {}, METHOD.POST)
}
export async function file_body(params) {
    return request(`${BASE_URL}/file/body`, params || {}, METHOD.POST)
}
export async function file_remove(params) {
    return request(`${BASE_URL}/file/remove`, params || {}, METHOD.POST)
}

export async function file_content(params) {
    return request(`${BASE_URL}/file/content`, params || {}, METHOD.POST)
}

export async function file_timeline(params) {
    return request(`${BASE_URL}/file/timeline`, params || {}, METHOD.POST)
}