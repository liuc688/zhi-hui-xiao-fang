import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function usenote_add(params) {
    return request(`${BASE_URL}/usenote/add`, params || {}, METHOD.POST)
}

export async function usenote_edit(params) {
    return request(`${BASE_URL}/usenote/edit`, params || {}, METHOD.POST)
}

export async function usenote_delete(params) {
    return request(`${BASE_URL}/usenote/delete`, params || {}, METHOD.POST)
}

export async function usenote_tree(params) {
    return request(`${BASE_URL}/usenote/tree`, params || {}, METHOD.POST)
}