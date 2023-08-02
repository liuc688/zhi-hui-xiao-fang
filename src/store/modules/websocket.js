import {
	request
} from '@/utils/request';
import { BASE_URL } from '@/services/api'

export default {
	namespaced: true,
	state: {
		client: null,
		wsserver: null,
		id: null
	},
	getters: {
		id: state => {
			const id = localStorage.getItem(process.env.VUE_APP_WEBSOCKET_ID)
			state.id = id
			return state.id
		},
		client: state => {
			if (state.client) {
				return state.client
			}
			return null
		},
		wsserver: state => {
			const wsserver = localStorage.getItem(process.env.VUE_APP_WEBSOCKET_KEY)
			state.wsserver = wsserver;
			return wsserver;
		}
	},
	mutations: {
		setWsserver: (state, wsserver) => {
			state.wsserver = wsserver
		},
		setClient: (state, client) => {
			state.client = client
		},
		setId: (state, id) => {
			localStorage.setItem(process.env.VUE_APP_WEBSOCKET_ID, id)
			state.id = id
		}
	},
	actions: {
		onconnect({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				const websocketId = state.id || localStorage.getItem(process.env.VUE_APP_WEBSOCKET_ID)
				request(`${BASE_URL}/websocket/connect`, {
					websocketId: websocketId
				}).then(response => {
					const {
						status,
						data
					} = response.data
					if (status) {
						if (window.location.protocol === "https:") {
							data.wsserver = data.wsserver.replace("ws://","wss://")
						}
						localStorage.setItem(process.env.VUE_APP_WEBSOCKET_KEY, data.wsserver)
						commit('setWsserver', data.wsserver)
						const client = new WebSocket(data.wsserver);
						commit('setClient', client)
						resolve(client)
					}
				}).catch(error => {
					reject(error)
				})
			})
		},
		joinchan({
			state
		}) {
			const websocketId = state.id || localStorage.getItem(process.env.VUE_APP_WEBSOCKET_ID)
			return new Promise((resolve, reject) => {
				request(`${BASE_URL}/websocket/joinchan`, {
					websocketId: websocketId,
					channel: "channel"
				}, ).then(() => {
					resolve()
				}).catch(() => {
					reject()
				})
			})
		},
		onopen({
			state
		}, callback) {

			if (callback) {
				if (state.client) {
					state.client.onopen = function(e) {
						callback(e)
					};
				}

			}
		},
		onclose({
			state
		}, callback) {
			if (callback) {
				state.client.onclose = function(e) {
					state.client = null;
					callback(e)
				};
			}
		},
		onmessage({
			state
		}, callback) {
			if (callback) {
				if (state.client) state.client.onmessage = function(e) {
					try {
						let params = JSON.parse(e.data);
						callback(params, e)
					} catch (e) {
						//TODO handle the exception
						console.log("Resolve websocket message data exceptions !");
						console.log(e);
					}
				};
			}
		},
		onerror({
			state
		}, callback) {
			if (callback) {
				if (state.client) state.client.onerror = function(e) {
					
					state.client = null;
					callback(e)
				};
			}
		},
	}

}
