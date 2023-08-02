import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'



/**获取用户企业信息 */
export async function ruser_get(params) {
    return request(`${BASE_URL}/ruser/get`, params || {}, METHOD.POST)
}

/** 企业信息 */

// 企业信息详情
export async function info_get(params) {
    return request(`${BASE_URL}/info/get`, params || {}, METHOD.POST)
}
// 企业基本信息编辑
export async function info_edit(params) {
    return request(`${BASE_URL}/info/edit`, params || {}, METHOD.POST)
}
// 企业商务信息编辑
export async function industry_create(params) {
    return request(`${BASE_URL}/industry/create`, params || {}, METHOD.POST)
}
// 企业形象墙
export async function land_certificate(params) {
    return request(`${BASE_URL}/land/certificate`, params || {}, METHOD.POST)
}
/** 用地信息  */
// 增编
export async function info_land(params) {
    return request(`${BASE_URL}/info/land`, params || {}, METHOD.POST)
}

/** 产品信息 */

// 分页
export async function product_paginate(params) {
    return request(`${BASE_URL}/product/info/paginate`, params || {}, METHOD.POST)
}
// 删除
export async function product_delete(params) {
    return request(`${BASE_URL}/product/delete`, params || {}, METHOD.POST)
}
// 还原
export async function product_restore(params) {
    return request(`${BASE_URL}/product/restore`, params || {}, METHOD.POST)
}
// 编辑
export async function product_edit(params) {
    return request(`${BASE_URL}/product/edit`, params || {}, METHOD.POST)
}
// 新增
export async function product_create(params) {
    return request(`${BASE_URL}/product/create`, params || {}, METHOD.POST)
}
// 详情
export async function product_get(params) {
    return request(`${BASE_URL}/product/get`, params || {}, METHOD.POST)
}
// 列表
export async function product_list(params) {
    return request(`${BASE_URL}/product/list`, params || {}, METHOD.POST)
}


/** 企业经营信息 */
// 分页
export async function manage_paginate(params) {
    return request(`${BASE_URL}/manage/paginate`, params || {}, METHOD.POST)
}
// 新增
export async function manage_create(params) {
    return request(`${BASE_URL}/manage/create`, params || {}, METHOD.POST)
}
// 企业经营信息验证
export async function manage_verify(params) {
    return request(`${BASE_URL}/manage/verify`, params || {}, METHOD.POST)
}
// 编辑
export async function manage_edit(params) {
    return request(`${BASE_URL}/manage/edit`, params || {}, METHOD.POST)
}
// 删除
export async function manage_delete(params) {
    return request(`${BASE_URL}/manage/delete`, params || {}, METHOD.POST)
}
// 还原
export async function manage_restore(params) {
    return request(`${BASE_URL}/manage/restore`, params || {}, METHOD.POST)
}
// 详情
export async function manage_get(params) {
    return request(`${BASE_URL}/manage/get`, params || {}, METHOD.POST)
}
// 企业重大事项增编
export async function manage_event(params) {
    return request(`${BASE_URL}/manage/event`, params || {}, METHOD.POST)
}
// 企业重大事项删除
export async function manage_event_delete(params) {
    return request(`${BASE_URL}/manage/event/delete`, params || {}, METHOD.POST)
}

// 生产情况编辑
export async function manage_production(params) {
    return request(`${BASE_URL}/manage/production`, params || {}, METHOD.POST)
}
// 经营情况编辑
export async function manage_run(params) {
    return request(`${BASE_URL}/manage/run`, params || {}, METHOD.POST)
}
// 用工情况编辑
export async function manage_work(params) {
    return request(`${BASE_URL}/manage/work`, params || {}, METHOD.POST)
}

/** 管理岗位 */

// 分页
export async function regulate_paginate(params) {
    return request(`${BASE_URL}/manage/regulate/paginate`, params || {}, METHOD.POST)
}
// 删除
export async function regulate_delete(params) {
    return request(`${BASE_URL}/manage/regulate/delete`, params || {}, METHOD.POST)
}
// 还原
export async function regulate_restore(params) {
    return request(`${BASE_URL}/manage/regulate/restore`, params || {}, METHOD.POST)
}
// 新增
export async function regulate_create(params) {
    return request(`${BASE_URL}/manage/regulate/create`, params || {}, METHOD.POST)
}
// 编辑
export async function regulate_edit(params) {
    return request(`${BASE_URL}/manage/regulate/edit`, params || {}, METHOD.POST)
}

/**  高端人才 */

// 分页
export async function highperson_paginate(params) {
    return request(`${BASE_URL}/manage/highperson/paginate`, params || {}, METHOD.POST)
}
// 删除
export async function highperson_delete(params) {
    return request(`${BASE_URL}/manage/highperson/delete`, params || {}, METHOD.POST)
}
// 还原
export async function highperson_restore(params) {
    return request(`${BASE_URL}/manage/highperson/restore`, params || {}, METHOD.POST)
}
// 新增
export async function highperson_create(params) {
    return request(`${BASE_URL}/manage/highperson/create`, params || {}, METHOD.POST)
}
// 编辑
export async function highperson_edit(params) {
    return request(`${BASE_URL}/manage/highperson/edit`, params || {}, METHOD.POST)
}

/** 主题填报 */

// 填报分页
export async function theme_paginate(params) {
    return request(`${BASE_URL}/theme/company/paginate`, params || {}, METHOD.POST)
}
// 填报详情
export async function theme_info(params) {
    return request(`${BASE_URL}/theme/info`, params || {}, METHOD.POST)
}
// 填报编辑
export async function theme_answer(params) {
    return request(`${BASE_URL}/theme/answer`, params || {}, METHOD.POST)
}
// 答案详情
export async function answer_get(params) {
    return request(`${BASE_URL}/answer/get`, params || {}, METHOD.POST)
}

/** 沟通信息管理 */
// 分页
export async function message_paginate(params) {
    return request(`${BASE_URL}/qy/message/paginate`, params || {}, METHOD.POST)
}
// 删除
export async function message_delete(params) {
    return request(`${BASE_URL}/qy/message/delete`, params || {}, METHOD.POST)
}
// 还原
export async function message_restore(params) {
    return request(`${BASE_URL}/qy/message/restore`, params || {}, METHOD.POST)
}
// 详情
export async function message_get(params) {
    return request(`${BASE_URL}/qy/message/get`, params || {}, METHOD.POST)
}
// 创建
export async function message_create(params) {
    return request(`${BASE_URL}/qy/message/create`, params || {}, METHOD.POST)
}
// 编辑
export async function message_edit(params) {
    return request(`${BASE_URL}/qy/message/edit`, params || {}, METHOD.POST)
}
// // 营业额折线图
// export async function company_yingyee_enterprise(params) {
//     return request(`${BASE_URL}/company/yingyee/enterprise`, params || {}, METHOD.POST)
// }
// // 纳税额折线图
// export async function company_nashui_enterprise(params) {
//     return request(`${BASE_URL}/company/nashui/enterprise`, params || {}, METHOD.POST)
// }