import { LOGIN, INFO, CONNECTTOKEN, BASE_URL } from '@/services/api'
import { request, METHOD, removeAuthorization, setAuthorization } from '@/utils/request'
import Cookie from 'js-cookie'
import qs from "qs";
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(username, password, vcode) {
  return request(LOGIN, {
    username: username,
    password: password,
    vcode: vcode
  }, METHOD.POST)
}

export async function connect_token(params) {
  return request(CONNECTTOKEN, params || {}, METHOD.POST, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}

export function user_info(params) {
  return request(INFO, params || {}, METHOD.POST)
}

// 用户分页
export async function user_paginate(params) {
  return request(`${BASE_URL}/user/paginate`, params || {}, METHOD.POST)
}

// 用户列表
export async function user_list(params) {
  return request(`${BASE_URL}/user/list`, params || {}, METHOD.POST)
}
// 用户添加
export async function user_add(params) {
  return request(`${BASE_URL}/user/add`, params || {}, METHOD.POST)
}
// 用户编辑
export async function user_edit(params) {
  return request(`${BASE_URL}/user/edit`, params || {}, METHOD.POST)
}
// 用户删除
export async function user_delete(params) {
  return request(`${BASE_URL}/user/delete`, params || {}, METHOD.POST)
}

export function user_get(params) {
  return request(`${BASE_URL}/user/get`, params || {}, METHOD.POST)
}

export function user_editinfo(params) {
  return request(`${BASE_URL}/user/editinfo`, params || {}, METHOD.POST)
}

export function user_editorganization(params) {
  return request(`${BASE_URL}/user/editorganization`, params || {}, METHOD.POST)
}

export function user_pullorganization(params) {
  return request(`${BASE_URL}/user/pullorganization`, params || {}, METHOD.POST)
}

export function user_pushorganization(params) {
  return request(`${BASE_URL}/user/pushorganization`, params || {}, METHOD.POST)
}
export function user_editprimary(params) {
  return request(`${BASE_URL}/user/editprimary`, params || {}, METHOD.POST)
}
export function user_editpolicy(params) {
  return request(`${BASE_URL}/user/editpolicy`, params || {}, METHOD.POST)
}
export function user_editrole(params) {
  return request(`${BASE_URL}/user/editrole`, params || {}, METHOD.POST)
}
export function user_editpassword(params) {
  return request(`${BASE_URL}/user/editpassword`, params || {}, METHOD.POST)
}
// 重置密码
export async function reset_password(params) {
  return request(`${BASE_URL}/user/resetpassword`, params || {},METHOD.POST)
}

export function user_initusername(params) {
  return request(`${BASE_URL}/user/initusername`, params || {}, METHOD.POST)
}

export function user_initpassword(params) {
  return request(`${BASE_URL}/user/initpassword`, params || {}, METHOD.POST)
}
export function user_initmobile(params) {
  return request(`${BASE_URL}/user/initmobile`, params || {}, METHOD.POST)
}
export function user_initidentity(params) {
  return request(`${BASE_URL}/user/initidentity`, params || {}, METHOD.POST)
}

/** 错敏词校对 */
export function text_parser(params) {
  return request(`${BASE_URL}/text/parser`, params || {}, METHOD.POST)
}
/** 敏感词校对 */
export function text_check(params) {
  return request(`${BASE_URL}/text/check`, params || {}, METHOD.POST)
}

/**
 * 刷新token
 */
export function refresh_token() {
  return new Promise((resolve, reject) => {
    try {
      const _refresh_token = Cookie.get("refresh_token")
      const expires_in = Cookie.get("expires_in")
      const expiresAt = parseInt(expires_in)
      const newDate = new Date().getTime();
      /**
       * 单位毫秒
       */
      const time_diff = expiresAt - newDate;
      const out_time_diff = 1000 * 60 * 20;
      console.warn(`登录状态即将在${time_diff / 1000 / 60}分钟后过期!,在临过期前的${out_time_diff / 1000 / 60}分钟内如果存在有效操作将更新登录!否则将会被强制退出!`);

      if (time_diff <= out_time_diff) {
        //token即将过期
        request(CONNECTTOKEN, qs.stringify({
          client_secret: "Saunk2019",
          client_id: "suncool",
          grant_type: "refresh_token",
          refresh_token: _refresh_token,
          scope: "offline_access transfer",
        }), METHOD.POST, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          const { data } = response;
          var millisecond = new Date().getTime();
          var expire_At = millisecond + data.expires_in * 1000;
          var expireAt = new Date(expire_At);
          var auth = {
            token: data.access_token,
            expireAt: expireAt,
            refresh_token: data.refresh_token,
            expires_in: expireAt.getTime(),
          };
          setAuthorization(auth);
          resolve(data)
          console.warn("token更新！")
        }).catch(error => {
          console.log('error', error);
          reject(error)
        })
      } else {
        reject("token未过期")
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  user_info
}
