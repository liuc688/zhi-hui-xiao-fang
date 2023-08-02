//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL =  API_PROXY_PREFIX
// /gongkai/admin
const API_PROXY_PREFIX='/api'
const prefix = process.env.NODE_ENV === 'production'? "":""
const BASE_URL =  prefix + API_PROXY_PREFIX

module.exports = {
	BASE_URL:BASE_URL,
  ROUTES: `${BASE_URL}/routes`,
  BACKGROUND_UPLOAD:`${BASE_URL}/background/upload`,
  ICON_UPLOAD:`${BASE_URL}/icon/upload`,
  BACKGROUND_LIST:`${BASE_URL}/background/list`,
  /*用户接口 -- /user/{*} */
  SSO:`${BASE_URL}/user/sso`,
  LOGIN: `${BASE_URL}/user/login`,
  CONNECTTOKEN: `${BASE_URL}/connect/token`,
  INFO: `${BASE_URL}/user/info`,
  Refresh: `${BASE_URL}/connect/token`,
  UserPaginate: `${BASE_URL}/user/paginate`,
  UserAdd: `${BASE_URL}/user/add`,
  UserEdit: `${BASE_URL}/user/edit`,
  UserDelet: `${BASE_URL}/user/delete`,
  /*上传接口 -- /{*}/upload */
  UEditorUpload:`${BASE_URL}/ueditor/upload`,
  PublicUpload:`${BASE_URL}/public/upload`,
  FormUpload:`${BASE_URL}/form/upload`,
  
  /*应用接口 -- /application/{*} */
  ApplicationList:`${BASE_URL}/application/list`,
  ApplicationGet:`${BASE_URL}/application/get`,
  ApplicationAdd:`${BASE_URL}/application/add`,
  ApplicationEdit:`${BASE_URL}/application/edit`,
  ApplicationDelete:`${BASE_URL}/application/delete`,
  /*路由接口 -- /router/{*} */
  RouteList:`${BASE_URL}/route/list`,
  RouteGet:`${BASE_URL}/route/get`,
  RouteEdit:`${BASE_URL}/route/edit`,
  RouteSync:`${BASE_URL}/route/sync`,
  /*路由信息接口 -- /routerinfo/{*} */
  RouteInfoAdd:`${BASE_URL}/routeinfo/add`,
  RouteInfoEdit:`${BASE_URL}/routeinfo/edit`,
  RouteInfoGroup:`${BASE_URL}/routeinfo/group`,
  RouteInfoGet:`${BASE_URL}/routeinfo/get`,
  /*组织接口 -- /organization/{*} */
  OrganizationGroup:`${BASE_URL}/organization/paginate`,
  OrganizationTree:`${BASE_URL}/organization/tree`,
  OrganizationAdd:`${BASE_URL}/organization/add`,
  OrganizationEdit:`${BASE_URL}/organization/edit`,
  OrganizationList:`${BASE_URL}/organization/list`,
  OrganizationGet:`${BASE_URL}/organization/get`,
  /* 用户/系统/流程 表单接口  Forms */
  Formsuserlist:`${BASE_URL}/forms/user/paginate`,
  Formsuseradd:`${BASE_URL}/forms/user/add`, 
  Formsuseredit:`${BASE_URL}/forms/user/edit`, 
  Formssystemlist:`${BASE_URL}/forms/system/paginate`,
  Formssystemadd:`${BASE_URL}/forms/system/add`, 
  Formssystemedit:`${BASE_URL}/forms/system/edit`, 
  Formsworkflowlist:`${BASE_URL}/forms/workflow/paginate`,
  Formsworkflowadd:`${BASE_URL}/forms/workflow/add`, 
  Formsworkflowedit:`${BASE_URL}/forms/workflow/edit`, 
  Formdelete:`${BASE_URL}/forms/delete`,
  Formget:`${BASE_URL}/forms/get`,
  /* 策略管理*/
  Policylist:`${BASE_URL}/policy/list`,
  Policyedit:`${BASE_URL}/policy/edit`, 
  Policydelete:`${BASE_URL}/policy/delete`,
  Policypaginate:`${BASE_URL}/policy/paginate`,
  Policyget:`${BASE_URL}/policy/get`,
  Policyroutes:`${BASE_URL}/policy/routes`,
  Policyadd:`${BASE_URL}/policy/add`,

  /** 主动公开 */ 
  Channellist:`${BASE_URL}/channel/list`,
}
