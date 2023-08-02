import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'
// 组培目录列表
export async function channel_list(params) {
  return request(`${BASE_URL}/channel/list`, params || {}, METHOD.POST)
}
// 栏目列表
export async function directory_list(params) {
  return request(`${BASE_URL}/directory/list`, params || {}, METHOD.POST)
}
// 栏目文章
export async function directory_document(params) {
  return request(`${BASE_URL}/directory/document`, params || {}, METHOD.POST)
}
// 栏目文章删除
export async function directory_delete(params) {
  return request(`${BASE_URL}/directory/delete`, params || {}, METHOD.POST)
}
// 栏目详情
export async function directory_get(params) {
  return request(`${BASE_URL}/directory/get`, params || {}, METHOD.POST)
}
// 栏目新增
export async function directory_insert(params) {
  return request(`${BASE_URL}/directory/insert`, params || {}, METHOD.POST)
}
// 栏目编辑
export async function directory_edit(params) {
  return request(`${BASE_URL}/directory/edit`, params || {}, METHOD.POST)
}
// 栏目目录
export async function directory_channel(params) {
  return request(`${BASE_URL}/directory/channel`, params || {}, METHOD.POST)
}
// 栏目名称修改
export async function directory_editname(params) {
  return request(`${BASE_URL}/directory/editname`, params || {}, METHOD.POST)
}
// 下级栏目导出
export async function directory_children_export(params) {
  return request(`${BASE_URL}/directory/children/export`, params || {}, METHOD.POST)
}
// 栏目批量导入
export async function directory_update_import(params) {
  return request(`${BASE_URL}/directory/update/import`, params || {}, METHOD.POST)
}
// 目录批量创建
export async function channel_many_insert(params) {
  return request(`${BASE_URL}/channel/many/insert`, params || {}, METHOD.POST)
}

// 名称认证
export async function directory_verifyname(params) {
  return request(`${BASE_URL}/directory/verifyname`, params || {}, METHOD.POST)
}
// 文章分页
export async function document_paginate(params) {
  return request(`${BASE_URL}/document/paginate`, params || {}, METHOD.POST)
}
// 文章删除
export async function document_delete(params) {
  return request(`${BASE_URL}/document/delete`, params || {}, METHOD.POST)
}
// 文章审核
export async function document_approved(params) {
  return request(`${BASE_URL}/document/approved`, params || {}, METHOD.POST)
}
//文章驳回
export async function document_rejection(params) {
  return request(`${BASE_URL}/document/rejection`, params || {}, METHOD.POST)
}

// 文章还原
export async function document_rollback(params) {
  return request(`${BASE_URL}/document/rollback`, params || {}, METHOD.POST)
}
// 文章新增
export async function document_insert(params) {
  return request(`${BASE_URL}/document/insert`, params || {}, METHOD.POST)
}
// 文章详情
export async function document_get(params) {
  return request(`${BASE_URL}/document/get`, params || {}, METHOD.POST)
}
// 文章编辑
export async function document_edit(params) {
  return request(`${BASE_URL}/document/edit`, params || {}, METHOD.POST)
}
// 提取关键词
export async function document_keyword(params) {
  return request(`${BASE_URL}/document/keyword`, params || {}, METHOD.POST)
}
// 提取关键词
export async function wordcloud_keywords(params) {
  return request(`${BASE_URL}/wordcloud/keywords`, params || {}, METHOD.POST)
}
//目录显隐
export async function channel_hidden(params) {
  return request(`${BASE_URL}/channel/hidden`, params || {}, METHOD.POST)
}
//目录详情
export async function channel_get(params) {
  return request(`${BASE_URL}/channel/get`, params || {}, METHOD.POST)
}
// 目录挂载表单
export async function channel_forms(params) {
  return request(`${BASE_URL}/channel/forms`, params || {}, METHOD.POST)
}
// 目录挂载表单
export async function sync_maps(params) {
  return request(`${BASE_URL}/channel/sync/maps`, params || {}, METHOD.POST)
}
//设置模板
export async function channel_template(params) {
  return request(`${BASE_URL}/channel/templates`, params || {}, METHOD.POST)
}
// 目录编辑
export async function channel_edit(params) {
  return request(`${BASE_URL}/channel/edit`, params || {}, METHOD.POST)
}
// 目录新增
export async function channel_insert(params) {
  return request(`${BASE_URL}/channel/insert`, params || {}, METHOD.POST)
}
// 目录删除
export async function channel_delete(params) {
  return request(`${BASE_URL}/channel/delete`, params || {}, METHOD.POST)
}
//目录映射列表
export async function channel_maps(params) {
  return request(`${BASE_URL}/channel/maps`, params || {}, METHOD.POST)
}
// 添加映射
export async function channel_editmaps(params) {
  return request(`${BASE_URL}/channel/editmaps`, params || {}, METHOD.POST)
}
// 删除映射
export async function channel_deletemaps(params) {
  return request(`${BASE_URL}/channel/deletemaps`, params || {}, METHOD.POST)
}

// 文章抄送/呈送
export async function document_source(params) {
  return request(`${BASE_URL}/document/source`, params || {}, METHOD.POST)
}
// 文章下达
export async function document_issued(params) {
  return request(`${BASE_URL}/document/issued`, params || {}, METHOD.POST)
}
// 文章迁移
export async function document_move(params) {
  return request(`${BASE_URL}/document/move`, params || {}, METHOD.POST)
}
// 双向绑定文章查询
export async function document_search(params) {
  return request(`${BASE_URL}/document/search`, params || {}, METHOD.POST)
}
// 目录过滤
export async function channel_black(params) {
  return request(`${BASE_URL}/channel/black`, params || {}, METHOD.POST)
}
// 目录过滤移除
export async function channel_filter(params) {
  return request(`${BASE_URL}/channel/filter`, params || {}, METHOD.POST)
}
// 栏目过滤
export async function directory_black(params) {
  return request(`${BASE_URL}/directory/black`, params || {}, METHOD.POST)
}
// 栏目过滤移除
export async function directory_filter(params) {
  return request(`${BASE_URL}/directory/filter`, params || {}, METHOD.POST)
}
// 目录排序
export async function channel_sort(params) {
  return request(`${BASE_URL}/channel/sort`, params || {}, METHOD.POST)
}
// 栏目排序
export async function directory_sort(params) {
  return request(`${BASE_URL}/directory/sort`, params || {}, METHOD.POST)
}
// 文章排序
export async function document_sort(params) {
  return request(`${BASE_URL}/document/sort`, params || {}, METHOD.POST)
}
// 日志
export function logs(data) {
  return request(`${BASE_URL}/logs/list`,data)
}
// 预览
export function document_router(data) {
  return request(`${BASE_URL}/document/router`,data)
}
// 分享平台绑定
export function thirdparty_binding(data) {
  return request(`${BASE_URL}/thirdparty/binding`,data)
}

// 获取第三方信息
export function thirdparty_get(data) {
  return request(`${BASE_URL}/thirdparty/get`,data)
}
// 发布删改型任务
export function risk_initiative(data) {
  return request(`${BASE_URL}/risk/initiative`,data)
}
// 验证排序
export function channel_verifsort(data) {
  return request(`${BASE_URL}/channel/verifysort`,data)
}
// 导出目录
export function channel_export(data) {
  return request(`${BASE_URL}/channel/export`,data)
}
// 导出目录发文量
export function channel_documentcount(data) {
  return request(`${BASE_URL}/channel/document/count`,data)
}
// 排序上锁
export function operate_lockclose(data) {
  return request(`${BASE_URL}/operate/lock/close`,data)
}
// 排序解锁
export function operate_lockopen(data) {
  return request(`${BASE_URL}/operate/lock/open`,data)
}
// 重新渲染
export function render_reset(data) {
  return request(`${BASE_URL}/render/reset`,data)
}
// 文章导入模板
export function channel_excel_template(data) {
  return request(`${BASE_URL}/channel/excel/template`,data)
}
// 文章批量导入
export function document_excel_import(data) {
  return request(`${BASE_URL}/document/excel/import`,data)
}
// 文章下载结果分页
export function download_result_paginate(data) {
  return request(`${BASE_URL}/download/result/paginate`,data)
}
// 文章下载结果详情
export function download_result_get(data) {
  return request(`${BASE_URL}/download/result/get`,data)
}
// 目录迁移
export async function site_channel_move(params) {
  return request(`${BASE_URL}/site/channel/move`, params || {}, METHOD.POST)
}
// 获取相应地址
export async function render_router(params) {
  return request(`${BASE_URL}/render/router`, params || {}, METHOD.POST)
}

// 栏目批量创建
export async function directory_many_insert	(params) {
  return request(`${BASE_URL}/directory/many/insert`, params || {}, METHOD.POST)
}
// 栏目批量验证
export async function directory_many_verify	(params) {
  return request(`${BASE_URL}/directory/many/verify`, params || {}, METHOD.POST)
}

// 获取目录懒加载

export async function channel_get_children	(params) {
  return request(`${BASE_URL}/channel/get/children`, params || {}, METHOD.POST)
}
