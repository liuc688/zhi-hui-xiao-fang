import RouterView from '@/layouts/ApplicationViews/RouterView'
// 路由配置
const options = {
	base: '/gongkai/admin',
	mode: 'history',
	routes: [
		{
			path: '/',
			name: '首页',
			redirect: '/login',
		},
		{
			path: '/loading',
			name: '载入',
			component: () => import('@/pages/loading/index')
		},
		{
			path: '/login',
			name: '登录',
			component: () => import('@/pages/login')
		},
		{
			path: '*',
			name: '404',
			component: () => import('@/pages/exception/404'),
		},
		{
			path: '/403',
			name: '403',
			component: () => import('@/pages/exception/403'),
		},

		{
			path: '/desktop',
			name: '桌面',
			meta: {
				authority: {
					permission: 'policy',
					role: 'organizations'
				}
			},
			component: () => import('@/pages/desktop')
		},
		{
			path: '/gateway',
			name: '网关管理',
			meta: {
				authority: {
					permission: 'policy',
					role: 'organizations'
				}
			},
			component: () => import('@/pages/applications/gateway')
		},
		{
			path: '/test',
			name: 'test',
			component: () => import('@/pages/test'),
		},
		{
			path: '/changepasswordes',
			name: 'changepasswordes',
			component: () => import('@/pages/changepasswordes'),
		},
		{
			path: '/screen',
			name: 'screen',
			component: () => import('@/pages/screen'),
		},



	]
}

export default options
