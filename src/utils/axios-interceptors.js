import Cookie from 'js-cookie'
import {
	logout,
	refresh_token
} from '@/services/user';
import {
	BASE_URL,
	LOGIN,
	CONNECTTOKEN,

} from '@/services/api';

const skips = {
	//根据路由名称匹配

	uris: [LOGIN, CONNECTTOKEN, `${BASE_URL}/forms/get`],
	includes(uri) {
		return this.uris.includes(uri)
	}
}
/**
 * token刷新白名单
 */
const skips_route = {
	//根据路由名称匹配

	uris: [
		LOGIN,
		CONNECTTOKEN,
		`${BASE_URL}/forms/get`,
		`${BASE_URL}/background/list`,
		`${BASE_URL}/schedule/list`,
		`${BASE_URL}/message/paginate`],
	includes(uri) {
		return this.uris.includes(uri)
	}
}

// 401拦截
const resp401 = {
	/**
	 * 响应数据之前做点什么
	 * @param response 响应对象
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {*}
	 */
	onFulfilled(response, options) {
		const {
			message,
		} = options
		if (response.status === 200 && response.data.code === 401) {
			message.error('认证 token 已过期，请重新登录')
			logout()
			window.location.reload()
		}
		return response
	},
	/**
	 * 响应出错时执行
	 * @param error 错误对象
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {Promise<never>}
	 */
	onRejected(error, options) {
		const {
			message
		} = options
		const {
			response
		} = error
		if (response.status === 401) {
			message.error('认证 token 已过期，请重新登录')
			logout()
			window.location.reload()
		}
		return Promise.reject(error)
	}
}

const resp403 = {
	onFulfilled(response, options) {
		const {
			message
		} = options
		if (response.status === 200 && response.data.code === 403) {
			message.error('无此权限')
		}
		return response
	},
	onRejected(error, options) {
		const {
			message
		} = options
		const {
			response
		} = error
		if (response.status === 403) {
			message.error('无此权限')
		}
		return Promise.reject(error)
	}
}

const reqCommon = {
	/**
	 * 发送请求之前做些什么
	 * @param config axios config
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {*}
	 */
	onFulfilled(config, options) {
		const {
			message
		} = options
		const {
			url,
			xsrfCookieName
		} = config
		if (!skips.includes(url) && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
			message.warning('认证 token 已过期，请重新登录')
			logout()
			window.location.reload()
		} else {
			if (!skips_route.includes(url)) {
				refresh_token().catch(() => {});
			}
		}
		return config
	},
	/**
	 * 请求出错时做点什么
	 * @param error 错误对象
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {Promise<never>}
	 */
	onRejected(error, options) {
		const {
			message
		} = options
		try {
			message.error(error.response.data.data.message)
		} catch (e) {
			message.error(error.message)
		}
		return Promise.reject(error)
	}
}

export default {
	request: [reqCommon], // 请求拦截
	response: [resp401, resp403] // 响应拦截
}
