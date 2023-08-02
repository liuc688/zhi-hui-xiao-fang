import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

// 表格分页
export async function table_paginate(params) {
    return request(`${BASE_URL}/table/paginate`, params || {}, METHOD.POST)
}
// 表格新增
export async function table_create(params) {
    return request(`${BASE_URL}/table/create`, params || {}, METHOD.POST)
}
// 表格编辑
export async function table_edit(params) {
    return request(`${BASE_URL}/table/edit`, params || {}, METHOD.POST)
}
// 表格删除
export async function table_delete(params) {
    return request(`${BASE_URL}/table/delete`, params || {}, METHOD.POST)
}
// 表格详情
export async function table_get(params) {
    return request(`${BASE_URL}/table/get`, params || {}, METHOD.POST)
}
// 表格名称校验
export async function table_name(params) {
    return request(`${BASE_URL}/table/name`, params || {}, METHOD.POST)
}
// 表格模板生成
export async function table_template(params) {
    return request(`${BASE_URL}/table/excel/template`, params || {}, METHOD.POST)
}
// 表格查询
export async function select_table(params) {
    return request(`${BASE_URL}/select/table`, params || {}, METHOD.POST)
}
// 查询记录
export async function select_record(params) {
    return request(`${BASE_URL}/select/record`, params || {}, METHOD.POST)
}
// 查看报表
export async function select_report(params) {
    return request(`${BASE_URL}/select/report`, params || {}, METHOD.POST)
}
// 接口文档
export async function interface_create(params) {
    return request(`${BASE_URL}/table/word/template`, params || {}, METHOD.POST)
}
// 设置表单
export async function table_form(params) {
    return request(`${BASE_URL}/table/form`, params || {}, METHOD.POST)
}

/**字段管理 */
// 字段排序
export async function field_sort(params) {
    return request(`${BASE_URL}/field/sort`, params || {}, METHOD.POST)
}
// 字段添加
export async function field_create(params) {
    return request(`${BASE_URL}/field/create`, params || {}, METHOD.POST)
}
// 字段编辑
export async function field_edit(params) {
    return request(`${BASE_URL}/field/edit`, params || {}, METHOD.POST)
}
// 字段删除
export async function field_delete(params) {
    return request(`${BASE_URL}/field/delete`, params || {}, METHOD.POST)
}
// 字段还原
export async function field_restore(params) {
    return request(`${BASE_URL}/field/restore`, params || {}, METHOD.POST)
}
// 字段列表
export async function field_list(params) {
    return request(`${BASE_URL}/field/list`, params || {}, METHOD.POST)
}
// 字段详情
export async function field_get(params) {
    return request(`${BASE_URL}/field/get`, params || {}, METHOD.POST)
}
// 字段验证
export async function field_verify(params) {
    return request(`${BASE_URL}/field/verify`, params || {}, METHOD.POST)
}
// 表单生成
export async function table_forms(params) {
    return request(`${BASE_URL}/table/forms`, params || {}, METHOD.POST)
}
// 表单获取
export async function table_formsget(params) {
    return request(`${BASE_URL}/table/forms/get`, params || {}, METHOD.POST)
}
// 表单编辑
export async function forms_edit(params) {
    return request(`${BASE_URL}/forms/edit`, params || {}, METHOD.POST)
}
// 结果导出
export async function value_export(params) {
    return request(`${BASE_URL}/value/export`, params || {}, METHOD.POST)
}
// 导出文件
// 分页
export async function download_paginate(params) {
    return request(`${BASE_URL}/download/paginate`, params || {}, METHOD.POST)
}
// 下载
export async function download_get(params) {
    return request(`${BASE_URL}/download/get`, params || {}, METHOD.POST)
}

/** 数据管理 */
// 数据创建
export async function value_create(params) {
    return request(`${BASE_URL}/value/create`, params || {}, METHOD.POST)
}
// 数据编辑
export async function value_edit(params) {
    return request(`${BASE_URL}/value/edit`, params || {}, METHOD.POST)
}
// 数据删除
export async function value_delete(params) {
    return request(`${BASE_URL}/value/delete`, params || {}, METHOD.POST)
}
// 数据还原
export async function value_restore(params) {
    return request(`${BASE_URL}/value/restore`, params || {}, METHOD.POST)
}
// 数据模板导入
export async function value_template(params) {
    return request(`${BASE_URL}/value/template`, params || {}, METHOD.POST)
}
// 数据详情
export async function select_get(params) {
    return request(`${BASE_URL}/select/get`, params || {}, METHOD.POST)
}



/**报表管理 */
// 分页
export async function report_paginate(params) {
    return request(`${BASE_URL}/report/paginate`, params || {}, METHOD.POST)
}
// 创建
export async function report_create(params) {
    return request(`${BASE_URL}/report/create`, params || {}, METHOD.POST)
}
// 编辑
export async function report_edit(params) {
    return request(`${BASE_URL}/report/edit`, params || {}, METHOD.POST)
}
// 删除
export async function report_delete(params) {
    return request(`${BASE_URL}/report/delete`, params || {}, METHOD.POST)
}
// 还原
export async function report_restore(params) {
    return request(`${BASE_URL}/report/restore`, params || {}, METHOD.POST)
}
// 运行
export async function report_run(params) {
    return request(`${BASE_URL}/report/run`, params || {}, METHOD.POST)
}
// 详情
export async function report_get(params) {
    return request(`${BASE_URL}/report/get`, params || {}, METHOD.POST)
}




/***事件管理 */
// 分页
export async function event_paginate(params) {
    return request(`${BASE_URL}/event/paginate`, params || {}, METHOD.POST)
}
// 创建
export async function event_create(params) {
    return request(`${BASE_URL}/event/create`, params || {}, METHOD.POST)
}
// 激活
export async function event_activate(params) {
    return request(`${BASE_URL}/event/activate`, params || {}, METHOD.POST)
}
// 关闭
export async function event_close(params) {
    return request(`${BASE_URL}/event/close`, params || {}, METHOD.POST)
}

/***查询管理 */
export async function select_filter(params) {
    return request(`${BASE_URL}/select/filter	`, params || {}, METHOD.POST)
}
// zhongtai
export async function value_sum(params) {
    return request(`${BASE_URL}/value/sum`, params || {}, METHOD.POST)
}
// chaxun
export async function filter_select(params) {
    return request(`${BASE_URL}/filter/select`, params || {}, METHOD.POST)
}
// luru
export async function create_select(params) {
    return request(`${BASE_URL}/create/select`, params || {}, METHOD.POST)
}