export default {
	namespaced: true,
	state: {
		menu: [],
		tabs: [],
		apps: [],
		active: null
	},
	getters: {
		menu: state => {
			if (!state.menu) {
				return state.menu
			}
			return []
		},
		apps: state => {
			if (!state.apps) {
				return state.apps
			}
			return []
		},
		tabs: state => {
			if (!state.tabs) {
				return state.tabs
			}
			return []
		},
		active: state => {
			if (!state.active) {
				return state.active
			}
			return state.active
		},
	},
	mutations: {
		setMenu(state, menu) {
			state.menu = menu
		},
		setTabs(state, route) {
			if (state.tabs.findIndex(item => item.fullPath === route.path) === -1) {
				state.tabs.push({
					keyPath: route.path,
					fullPath: route.path,
					title: route.name,
				})
			}
		},
		setActive(state, Active) {
			state.active = Active
		},
		setApps(state, apps) {
			state.apps = apps
		},
		addApps(state, app) {
			if (!state.apps.find(x => x.id == app.id)) {
				state.apps.push(app)
			}
		},
		removeApps(state, app) {
			state.apps = state.apps.filter(x => {
				return x.id != app.id
			})
		},
	}
}
