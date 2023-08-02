<template>
	<div style="width: 100%; height: calc(100vh - 64px)" v-if="appdata.status">
		<TreeViews
			:tree-data="organizations"
			:selectedKeys.sync="keys"
			@on-tree-select="onTreeSelect"
			:data="params"
			@on-search="onSearch"
			@on-back="onBack"
			style="width: 100%; height: 100%"
		>
			<template slot="header">
				<a-button-group slot="enterButton"><a-button icon="reload" type="link" style="color: #ffffff" @click="onRefresh" :loading="loading">刷新</a-button></a-button-group>
			</template>
			<template slot="search">
				<a-tree-select
					style="width: 100%"
					show-search
					@change="handleChanges"
					v-model="key"
					:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
					:treeData="organizations"
					placeholder="请选择搜索站点"
					:replaceFields="{
						key: 'id',
						value: 'id'
					}"
					:filterTreeNode="
						(value, node) => {
							const data = node.componentOptions.propsData.dataRef;
							return data.title.indexOf(value) !== -1 || data.name.indexOf(value) !== -1;
						}
					"
				></a-tree-select>
			</template>
			<template slot="title">
				<a-tag color="blue" style="font-size: 20px;padding: 5px;">{{ currData.title ? currData.title : '请选择站点' }}</a-tag>
			</template>
			<template slot="content">
				<component ref="component" :is="route" :params="params" :organizations="organizations" :forms.sync="forms" @event="event" :key="key"></component>
			</template>
		</TreeViews>
	</div>
	<maintain v-else />
</template>

<script>
import TreeViews from '@/layouts/ApplicationViews/TreeViews';
import { organization_tree } from '@/services/organization';
import { form_get } from '@/services/forms';
import TemplateList from './components/TemplateList.vue';
import TemplateFolder from './components/TemplateFolder.vue';
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";
export default {
	props: {
		appid:{
			type: String
		}
	},
	data() {
		return {
			loading: false,
			organizations: [],
			route: null,
			params: {},
			key: '',
			keys: [],
			back: {
				route: null,
				params: null
			},
			currData: {},
			title: '',
			visible: false,
			confirmLoading: false,
			orglist: [],
			orginId: '',
			selects: [],
			forms:{},
			appdata:{
				status: true
			}
		};
	},
	components: {
		TreeViews,
		TemplateList,
		TemplateFolder,
		maintain
	},

	created() {
		application_get({ id: this.appid }).then((res) => {
			this.appdata = res.data.data;
			if(this.appdata.status){
				this.init();
			}
		}).catch(err=>{
			console.log(err)
			this.$message.error(response.data.message)
		})
	},
	
	authorize: {
		
	},
	computed: {
		
	},
	methods: {
		init() {
			Promise.all([
				organization_tree(),
				form_get({ name: "template_add" })
				])
				.then(response => {
					this.organizations = response[0].data.data;
					this.forms = response[1].data.data.form;
					this.key =  this.organizations[0].id;
          			this.keys = [this.organizations[0].id];
					this.params = {
						id: this.key
					}
					this.route = 'template-list';
				})
				.catch(err => {
					console.log(err);
				});
		},
		onBack() {
			if (this.back.route) {
				this.route = this.back.route;
				this.params = this.back.params;
			}
		},
		onRefresh() {
			if (this.$refs.component && typeof this.$refs.component.onReset === 'function') {
				this.$refs.component.onReset();
			}
		},
		handleChanges(value, key, e) {
			this.currData = e.triggerNode.$options.propsData.dataRef;
			this.title = this.currData.title;
			this.key = this.currData.id;
			this.keys = [this.key];
			this.onLink({
				route: 'template-list',
				params: this.currData
			});
		},
		onSearch(value, event) {
		},
		// 树状选择
		onTreeSelect(key, e) {
			if (e.selected) {
				this.currData = e.node.$options.propsData.dataRef;
				this.title = this.currData.title;
				this.key = this.currData.id;
				this.keys = [this.key];
				this.onLink({
					route: 'template-list',
					params: this.currData
				});
			} else {
				this.currData = {};
				this.title = '';
				this.key = '';
				this.keys = [];
				this.onLink({
					route: 'template-list',
					params: undefined
				});
			}
		},
		//
		onLink({ route, params }) {
			this.back.route = this.route;
			this.back.params = this.params;
			//跳转
			this.route = route;
			this.params = params;
		},
		onDragEnter(info) {
		},
		onSelect(selectedKeys, info) {
		},
		onCheck(checkedKeys, info) {
		},
		onDrop(info) {
		},
		event({ method, params }) {
			if (this[method] && typeof this[method] === 'function') {
				this[method](params);
			}
		},
	}
};
</script>
