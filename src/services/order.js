
import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'

export async function pagiante(params) {
    return request(`${BASE_URL}/order/paginate`, params || {}, METHOD.POST)
}
export async function orders(params) {
    return request(`${BASE_URL}/order/get`, params || {}, METHOD.POST)
}
export async function forwardget(params) {
    return request(`${BASE_URL}/forward/get`, params || {}, METHOD.POST)
}
export async function dispose(params) {
    return request(`${BASE_URL}/order/dispose`, params || {}, METHOD.POST)
}
export async function disposed(params) {
    return request(`${BASE_URL}/order/disposed`, params || {}, METHOD.POST)
}
export async function orderclose(params) {
    return request(`${BASE_URL}/order/close`, params || {}, METHOD.POST)
}
export async function activate(params) {
    return request(`${BASE_URL}/order/activate`, params || {}, METHOD.POST)
}
export async function reject(params) {
    return request(`${BASE_URL}/order/reject`, params || {}, METHOD.POST)
}
export async function order_import(params) {
    return request(`${BASE_URL}/order/import`, params || {}, METHOD.POST)
}
export async function depart(params) {
    return request(`${BASE_URL}/organization/list`, params || {}, METHOD.POST)
}
export async function organization_add(params) {
    return request(`${BASE_URL}/organization/add`, params || {}, METHOD.POST)
}
export async function insert(params) {
    return request(`${BASE_URL}/order/insert`, params || {}, METHOD.POST)
}
export async function forward(params) {
    return request(`${BASE_URL}/order/forward`, params || {}, METHOD.POST)
}
export async function labellist(params) {
    return request(`${BASE_URL}/label/list`, params || {}, METHOD.POST)
}
export async function labelall(params) {
    return request(`${BASE_URL}/label/all`, params || {}, METHOD.POST)
}
export async function documentkeyword(params) {
    return request(`${BASE_URL}/order/keywords`, params || {}, METHOD.POST)
}
export async function projectlist(params) {
    return request(`${BASE_URL}/project/all`, params || {}, METHOD.POST)
}
export async function projectpaginate(params) {
    return request(`${BASE_URL}/project/list`, params || {}, METHOD.POST)
}
export async function label_Insert(params) {
    return request(`${BASE_URL}/label/insert`, params || {}, METHOD.POST)
}
export async function list(params) {
    return request(`${BASE_URL}/label/list`, params || {}, METHOD.POST)
}
export async function remove(params) {
    return request(`${BASE_URL}/label/remove`, params || {}, METHOD.POST)
}
export async function projectsave(params) {
    return request(`${BASE_URL}/project/save`, params || {}, METHOD.POST)
}
export async function projectinsert(params) {
    return request(`${BASE_URL}/project/insert`, params || {}, METHOD.POST)
}
export async function projectdel(params) {
    return request(`${BASE_URL}/project/del`, params || {}, METHOD.POST)
}
export async function label_save(params) {
    return request(`${BASE_URL}/label/save`, params || {}, METHOD.POST)
}
export async function departmentlis(params) {
    return request(`${BASE_URL}/organization/list`, params || {}, METHOD.POST)
}
export async function workerlis(params) {
    return request(`${BASE_URL}/user/list`, params || {}, METHOD.POST)
}
export async function departinser(params) {
    return request(`${BASE_URL}/organization/edit`, params || {}, METHOD.POST)
}
export async function workerinsert(params) {
    return request(`${BASE_URL}/user/add`, params || {}, METHOD.POST)
}
export async function workerremove(params) {
    return request(`${BASE_URL}/user/delete`, params || {}, METHOD.POST)
}
export async function application_list(params) {
    return request(`${BASE_URL}/application/list`, params || {}, METHOD.POST)
}
export async function form_get(params) {
    return request(`${BASE_URL}/forms/get`, params || {}, METHOD.POST)
}
// export async function order_import(params) {
//     return request(`${BASE_URL}/order/activate`, params || {}, METHOD.POST)
// }
// export async function user_edit(params) {
//     return request(`${BASE_URL}/order/pagiante`, params || {}, METHOD.POST)
// }
// export async function user_delete(params) {
//     return request(`${BASE_URL}/order/pagiante`, params || {}, METHOD.POST)
// }
// export async function policy_list(params) {
//     return request(`${BASE_URL}/order/pagiante`, params || {}, METHOD.POST)
// }

export async function getform(params) {
    return request(`${BASE_URL}/forms/get`, params || {}, METHOD.POST)
}