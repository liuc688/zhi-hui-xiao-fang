import { request, METHOD } from '@/utils/request'
import { BASE_URL } from '@/services/api'
// --首页--
// 产品分页
export async function product_paginate(params) {
  return request(`${BASE_URL}/product/paginate`, params || {}, METHOD.POST)
}
// 企业营业额
export async function company_run_sum(params) {
  return request(`${BASE_URL}/company/run/sum`, params || {}, METHOD.POST)
}
// 营业额排行榜
export async function company_run_rank(params) {
  return request(`${BASE_URL}/company/run/rank`, params || {}, METHOD.POST)
}
// 企业用工情况
export async function company_number_sum(params) {
  return request(`${BASE_URL}/company/number/sum`, params || {}, METHOD.POST)
}
// 产品分类
export async function company_run_category(params) {
  return request(`${BASE_URL}/company/run/category`, params || {}, METHOD.POST)
}
// 企业产品列表（针对于某个企业的分页）
export async function company_products_list(params) {
  return request(`${BASE_URL}/company/products/list`, params || {}, METHOD.POST)
}
// 管委会产品新增
export async function product_create(params) {
  return request(`${BASE_URL}/product/create`, params || {}, METHOD.POST)
}
// 管委会产品编辑
export async function product_edit(params) {
  return request(`${BASE_URL}/product/edit`, params || {}, METHOD.POST)
}
// （管委会）产品详情
export async function product_get(params) {
  return request(`${BASE_URL}/product/get`, params || {}, METHOD.POST)
}
// 企业地址分布
export async function company_address(params) {
  return request(`${BASE_URL}/company/address`, params || {}, METHOD.POST)
}
// 填报折线图
export async function company_datetime_theme(params) {
  return request(`${BASE_URL}/company/datetime/theme`, params || {}, METHOD.POST)
}
// 管委会走访编辑
export async function company_managements_edit(params) {
  return request(`${BASE_URL}/company/managements/edit`, params || {}, METHOD.POST)
}
// 管委会走访获取
export async function company_managements_get(params) {
  return request(`${BASE_URL}/company/managements/get`, params || {}, METHOD.POST)
}
// 管委会走访列表
export async function company_managements_list(params) {
  return request(`${BASE_URL}/company/managements/list`, params || {}, METHOD.POST)
}
// 管委会走访删除
export async function company_managements_delete(params) {
  return request(`${BASE_URL}/company/managements/delete`, params || {}, METHOD.POST)
}
// --企业管理--
// 企业信息分页
export async function info_paginate(params) {
  return request(`${BASE_URL}/info/paginate`, params || {}, METHOD.POST)
}
// 企业基本信息新增
export async function info_create (params) {
  return request(`${BASE_URL}/info/create`, params || {}, METHOD.POST)
}
// 企业基本信息新增时的验证（如果公司名重复或者手机号重复，就新增不成功）
export async function info_admin_verify(params) {
  return request(`${BASE_URL}/info/admin/verify`, params || {}, METHOD.POST)
}
// 企业工商信息新增 和 编辑
export async function industry_create(params) {
  return request(`${BASE_URL}/industry/create`, params || {}, METHOD.POST)
}
// 字典下级树
export async function dict_tree(params) {
  return request(`${BASE_URL}/dict/tree`, params || {}, METHOD.POST)
}
// 企业基本信息编辑
export async function info_edit(params) {
  return request(`${BASE_URL}/info/edit`, params || {}, METHOD.POST)
}
// 企业信息详情
export async function info_get(params) {
  return request(`${BASE_URL}/info/get`, params || {}, METHOD.POST)
}
// 企业信息删除
export async function info_delete(params) {
  return request(`${BASE_URL}/info/delete`, params || {}, METHOD.POST)
}
// 企业信息还原
export async function info_restore (params) {
  return request(`${BASE_URL}/info/restore `, params || {}, METHOD.POST)
}
// 企业列表
export async function info_list (params) {
  return request(`${BASE_URL}/info/list `, params || {}, METHOD.POST)
}
// 企业经营信息
export async function manage_admin_paginate (params) {
  return request(`${BASE_URL}/manage/admin/paginate`, params || {}, METHOD.POST)
}
// 管委会新增企业经营信息
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
// 营业额折线图
export async function company_yingyee_enterprise (params) {
  return request(`${BASE_URL}/company/yingyee/enterprise`, params || {}, METHOD.POST)
}
// 纳税折线图
export async function company_nashui_enterprise (params) {
  return request(`${BASE_URL}/company/nashui/enterprise`, params || {}, METHOD.POST)
}
// 用工折线图
export async function company_yonggong_enterprise(params) {
  return request(`${BASE_URL}/company/yonggong/enterprise`, params || {}, METHOD.POST)
}
// 能耗折线图
export async function company_nenghao_enterprise(params) {
  return request(`${BASE_URL}/company/nenghao/enterprise`, params || {}, METHOD.POST)
}
// 利润总额折线图
export async function company_lirun_enterprise(params) {
  return request(`${BASE_URL}/company/lirun/enterprise`, params || {}, METHOD.POST)
}
// 研发费用折线图
export async function company_yanfa_enterprise(params) {
  return request(`${BASE_URL}/company/yanfa/enterprise`, params || {}, METHOD.POST)
}
// 工业总产值折线图
export async function company_chanzhi_enterprise(params) {
  return request(`${BASE_URL}/company/chanzhi/enterprise`, params || {}, METHOD.POST)
}
// 企业经营预警
export async function manage_admin_warning (params) {
  return request(`${BASE_URL}/manage/admin/warning`, params || {}, METHOD.POST)
}
// --企业数据中心--

// --主题管理--
// 主题分页
export async function theme_paginate(params) {
  return request(`${BASE_URL}/theme/paginate`, params || {}, METHOD.POST)
}
// 主题填报创建
export async function theme_create(params) {
  return request(`${BASE_URL}/theme/create`, params || {}, METHOD.POST)
}
// 主题填报编辑
export async function theme_edit(params) {
  return request(`${BASE_URL}/theme/edit`, params || {}, METHOD.POST)
}
// 主题详情
export async function theme_get(params) {
  return request(`${BASE_URL}/theme/get`, params || {}, METHOD.POST)
}
// 主题信息，用于主题数据编辑，theme_get接口也可以，只是theme_get接口数据太多了，很多用不到，影响性能
export async function theme_info(params) {
  return request(`${BASE_URL}/theme/info`, params || {}, METHOD.POST)
}
// 主题删除
export async function theme_delete(params) {
  return request(`${BASE_URL}/theme/delete`, params || {}, METHOD.POST)
}
// 主题还原
export async function theme_restore(params) {
  return request(`${BASE_URL}/theme/restore`, params || {}, METHOD.POST)
}
// --沟通信息管理--
// 沟通中心分页
export async function message_admin_paginate(params) {
  return request(`${BASE_URL}/message/admin/paginate`, params || {}, METHOD.POST)
}
// 沟通中心分页
export async function qy_message_paginate(params) {
  return request(`${BASE_URL}/qy/message/paginate`, params || {}, METHOD.POST)
}
// 沟通回复
export async function qy_message_reply(params) {
  return request(`${BASE_URL}/qy/message/reply`, params || {}, METHOD.POST)
}
// 沟通信息详情
export async function qy_message_get(params) {
  return request(`${BASE_URL}/qy/message/get`, params || {}, METHOD.POST)
}
// --企业用户中心--
// 用户创建
export async function ruser_create(params) {
  return request(`${BASE_URL}/ruser/create`, params || {}, METHOD.POST)
}
// 策略列表
export async function ruser_policy(params) {
  return request(`${BASE_URL}/ruser/policy`, params || {}, METHOD.POST)
}
// 企业用户获取
export async function ruser_get(params) {
  return request(`${BASE_URL}/ruser/get`, params || {}, METHOD.POST)
}
// 用户分页
export async function ruser_paginate(params) {
  return request(`${BASE_URL}/ruser/paginate`, params || {}, METHOD.POST)
}
// 用户删除
export async function ruser_delete(params) {
  return request(`${BASE_URL}/ruser/delete`, params || {}, METHOD.POST)
}
// 用户还原
export async function ruser_restore(params) {
  return request(`${BASE_URL}/ruser/restore`, params || {}, METHOD.POST)
}
// --企业宏观经济--
// 企业规模分类
export async function company_manage_scale (params) {
  return request(`${BASE_URL}/company/manage/scale`, params || {}, METHOD.POST)
}
// 企业状态分类
export async function company_manage_status (params) {
  return request(`${BASE_URL}/company/manage/status`, params || {}, METHOD.POST)
}
// 企业产品分类
export async function product_company_category (params) {
  return request(`${BASE_URL}/product/company/category`, params || {}, METHOD.POST)
}
// 企业产品分类产值产量
export async function product_company_run (params) {
  return request(`${BASE_URL}/product/company/run`, params || {}, METHOD.POST)
}
// 企业按月营业额总计
export async function company_yingyee_sum (params) {
  return request(`${BASE_URL}/company/yingyee/sum`, params || {}, METHOD.POST)
}
// 营业额折线图
export async function manage_year_yingyee(params) {
  return request(`${BASE_URL}/manage/year/yingyee`, params || {}, METHOD.POST)
}
// 纳税额折线图
export async function manage_year_nashui(params) {
  return request(`${BASE_URL}/manage/year/nashui`, params || {}, METHOD.POST)
}
// 利润折线图
export async function manage_year_lirun(params) {
  return request(`${BASE_URL}/manage/year/lirun`, params || {}, METHOD.POST)
}
// 研发费用折线图
export async function manage_year_yanfa(params) {
  return request(`${BASE_URL}/manage/year/yanfa`, params || {}, METHOD.POST)
}
// 工业总产值折线图
export async function manage_year_chanzhi(params) {
  return request(`${BASE_URL}/manage/year/chanzhi`, params || {}, METHOD.POST)
}



// 企业未填报预警
export async function manage_input_warn (params) {
  return request(`${BASE_URL}/manage/input/warn`, params || {}, METHOD.POST)
}
// 经营预警分发
export async function info_message (params) {
  return request(`${BASE_URL}/info/message`, params || {}, METHOD.POST)
}
// 企业用户创建，新建一个企业，自动创建这个企业的账号和密码
export async function info_admin_create (params) {
  return request(`${BASE_URL}/info/admin/create`, params || {}, METHOD.POST)
}
// 企业列表
// export async function info_list (params) {
//   return request(`${BASE_URL}/info/list`, params || {}, METHOD.POST)
// }
// 企业重大事项
export async function manage_admin_event (params) {
  return request(`${BASE_URL}/manage/admin/event`, params || {}, METHOD.POST)
}
// 策略列表
export async function policy_list (params) {
  return request(`${BASE_URL}/policy/list`, params || {}, METHOD.POST)
}