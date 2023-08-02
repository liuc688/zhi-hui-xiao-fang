<template>
	<a-layout class="layout">
		<a-layout-sider v-model="collapsed" :trigger="null" collapsible>
			<a-menu
				:theme="theme.mode"
				mode="inline"
				:inline-collapsed="collapsed"
				:collapsed="false"
				:collapsible="false"
				:selected-keys="selectedKeys"
				:default-open-keys="opened"
			>
				<template v-for="item in routes">
					<a-sub-menu
						:theme="theme.mode"
						v-if="item.meta ? !item.meta.invisible : true"
						:class="'fixed-side'"
						:key="item.fullPath"
						:collapsed="collapsed"
						:collapsible="true"
					>
						<span slot="title">
							<a-icon type="menu-unfold" />
							<span>{{ item.name }}</span>
						</span>
						<template v-for="record in item.children">
							<a-menu-item :key="record.fullPath" v-if="record.meta ? !record.meta.invisible : true" @click="onMenuItem(record)">{{ record.name }}</a-menu-item>
						</template>
					</a-sub-menu>
				</template>
			</a-menu>
		</a-layout-sider>
		<a-layout>
			<a-layout-header>
				<a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
				<div style="float: right;"><a-input-search :loading="loading" @search="onSearch"></a-input-search></div>
			</a-layout-header>
			<a-layout-content :style="{ margin: '10px 10px', padding: '10px', background: '#fff', minHeight: '600px' }">
				<tabs-head :active="activePage" :page-list="pageList" @change="changePage" @close="remove" @refresh="refresh" @contextmenu="onContextmenu" />
				<page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
					<a-keep-alive :exclude-keys="excludeKeys" v-if="multiPage && cachePage" v-model="clearCaches">
						<router-view v-if="!refreshing" ref="tabContent" :key="$route.fullPath" />
					</a-keep-alive>
				</page-toggle-transition>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>

<script>
import TabsHead from '@/layouts/tabs/TabsHead';
import { mapState, mapMutations } from 'vuex';
import PageToggleTransition from '@/components/transition/PageToggleTransition';
import AKeepAlive from '@/components/cache/AKeepAlive';
export default {
	name: 'SystemView',
	components: {
		TabsHead,
		PageToggleTransition,
		AKeepAlive
	},
	data() {
		return {
			loading: false,
			collapsed: false,
			refreshing: false,
			excludeKeys: [],
			clearCaches: null
		};
	},
	watch: {
		'$router.options.routes': function(val) {
			this.excludeKeys = [];
			this.loadCacheConfig(val);
		}
	},
	computed: {
		...mapState('applications', ['menu', 'tabs', 'active']),
		...mapState('setting', [
			'isMobile',
			'animate',
			'multiPage',
			'cachePage',
			'theme',
			'layout',
			'footerLinks',
			'copyright',
			'fixedHeader',
			'fixedSideBar',
			'fixedTabs',
			'hideSetting',
			'multiPage'
		]),
		routes() {
			return this.menu;
		},
		pageList() {
			return this.tabs;
		},
		activePage() {
			return this.active;
		},
		selectedKeys() {
			if (this.activePage) {
				return [this.activePage];
			}
			return [];
		},
		opened() {
			return this.pageList.map(item => {
				return item.fullPath;
			});
		}
	},
	created() {
		this.loadCacheConfig(this.$router?.options?.routes);
	},
	methods: {
		init() {},
		onSearch() {},
		createPage(route) {
			return {
				keyPath: route.fullPath,
				fullPath: route.fullPath,
				loading: false,
				title: route.name,
				unclose: false
			};
		},
		onMenuItem(route) {
			this.$store.commit('applications/setActive', route.fullPath);
			this.$router.push(route);
			this.$store.commit('applications/setTabs', { path: route.fullPath, name: route.name });
		},
		changePage(key) {
			this.$store.commit('applications/setActive', key);
			this.$router.push(key);
		},
		remove(key, next) {
			if (this.pageList.length === 1) {
				return this.$message.warning('这是最后一页，不能再关闭了');
			}
			//清除缓存
			let index = this.pageList.findIndex(item => item.fullPath === key);
			this.clearCaches = this.pageList.splice(index, 1).map(page => page.cachedKey);
			if (next) {
				this.$router.push(next);
			} else if (key === this.activePage) {
				index = index >= this.pageList.length ? this.pageList.length - 1 : index;
				this.$store.commit('applications/setActive', this.pageList[index].fullPath);
				if (this.pageList.findIndex(item => item.fullPath === key) === -1) {
					this.$router.push(this.activePage);
				}
			}
		},
		refresh(key, page) {
			page = page || this.pageList.find(item => item.fullPath === key);
			page.loading = true;
			this.clearCache(page);
			if (key === this.activePage) {
				this.reloadContent(() => (page.loading = false));
			} else {
				// 其实刷新很快，加这个延迟纯粹为了 loading 状态多展示一会儿，让用户感知刷新这一过程
				setTimeout(() => (page.loading = false), 500);
			}
		},
		onContextmenu(pageKey, e) {
			if (pageKey) {
				e.preventDefault();
				e.meta = pageKey;
				this.menuVisible = true;
			}
		},

		clearCache(page) {
			page._init_ = false;
			this.clearCaches = [page.cachedKey];
		},
		reloadContent(onLoaded) {
			this.refreshing = true;
			setTimeout(() => {
				this.refreshing = false;
				this.$nextTick(() => {
					this.setCachedKey(this.$route);
					if (typeof onLoaded === 'function') {
						onLoaded.apply(this, []);
					}
				});
			}, 200);
		},

		/**
		 * 设置页面缓存的key
		 * @param route 页面对应的路由
		 */
		setCachedKey(route) {
			const page = this.pageList.find(item => item.fullPath === route.fullPath);
			page.unclose = route.meta && route.meta.page && route.meta.page.closable === false;
			if (!page._init_) {
				const vnode = this.$refs.tabContent.$vnode;
				page.cachedKey = vnode.key + vnode.componentOptions.Ctor.cid;
				page._init_ = true;
			}
		},
		loadCacheConfig(routes, pCache = true) {
			routes.forEach(item => {
				const cacheAble = item.meta?.page?.cacheAble ?? pCache ?? true;
				if (!cacheAble) {
					this.excludeKeys.push(new RegExp(`${item.fullPath}\\d+$`));
				}
				if (item.children) {
					this.loadCacheConfig(item.children, cacheAble);
				}
			});
		},
		...mapMutations('setting', ['correctPageMinHeight'])
	}
};
</script>

<style>
.route-layout .trigger {
	font-size: 18px;
	line-height: 64px;
	padding: 0 24px;
	cursor: pointer;
	transition: color 0.3s;
}
.tabs-container.affixed {
	margin: -16px auto 8px;
	top: unset;
}
</style>
