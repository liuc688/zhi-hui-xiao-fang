<template>
	<a-layout class="route-layout">
		<a-layout-header v-if="header">
			<slot name="header"></slot>
			<div style="float: right;"><slot name="header-right"></slot></div>
		</a-layout-header>
		<a-layout-content class="conter">
			<a-layout>
				<a-layout-sider>
					<slot name="search"><a-input-search @search="clickSearch" allowClear></a-input-search></slot>
					<a-tree
						:tree-data="treeData"
						:selectedKeys.sync="selectedKeysSync"
						:draggable="true"
						:block-node="true"
						:show-icon="true"
						:default-expand-all="true"
						:expandedKeys.sync="expandedKeysSync"
						:replaceFields="{
							key: 'id'
						}"
						@select="clickTreeSelect"
					>
						<a-icon slot="icon" type="tags" theme="twoTone" style="font-size: 20px;" />
						<span slot="title" slot-scope="text">{{ text }}</span>
					</a-tree>
				</a-layout-sider>
				<a-layout-content>
					<a-page-header @back="$emit('on-back')">
						<template slot="title">
							<slot name="title"></slot>
						</template>
						<template slot="subTitle">
							<slot name="subTitle"></slot>
						</template>
						<template slot="tags">
							<slot name="tags"></slot>
						</template>
						<template slot="extra">
							<slot name="extra"></slot>
						</template>
						<a-row type="flex"><slot name="flex"></slot></a-row>
					</a-page-header>
					<page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
						<slot name="content"></slot>
					</page-toggle-transition>
				</a-layout-content>
			</a-layout>
		</a-layout-content>
	</a-layout>
</template>

<script>
import { mapState } from 'vuex';
import PageToggleTransition from '@/components/transition/PageToggleTransition';
export default {
	name: 'page-views',
	props: {
		id: {
			type: String
		},
		selectedKeys: {
			type: Array,
			default: () => {
				return [];
			}
		},
		expandedKeys: {
			type: Array,
			default: () => {
				return [];
			}
		},
		data: {
			//传递的数据
			type: Object,
			default: () => {
				return {};
			}
		},
		header: {
			type: Boolean,
			default: () => {
				return true;
			}
		},
		onBack: {
			type: Function,
			default: () => {
				console.log('onBack');
			}
		},
		onRefresh: {
			type: Function,
			default: () => {
				console.log('onRefresh');
			}
		},
		onSearch: {
			type: Function,
			default: () => {
				console.log('onSearch');
			}
		},
		treeData: {
			type: Array,
			default: () => {
				return [undefined];
			}
		},

		onTreeSelect: {
			type: Function,
			default: () => {
				console.log('onTreeSelect');
			}
		},
		loading: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	data() {
		return {
			expandedKeysSync: [],
			selectedKeysSync: []
		};
	},
	watch: {
		selectedKeys: {
			handler(val) {
				this.selectedKeysSync = val;
			},
			deep: true
		},
		expandedKeys: {
			handler(val) {
				this.expandedKeysSync = val;
			},
			deep: true
		},
		expandedKeysSync: {
			handler(val) {
				this.$emit('update:expandedKeys', val);
			},
			deep: true
		},
		selectedKeysSync: {
			handler(val) {
				this.$emit('update:selectedKeys', val);
			},
			deep: true
		}
	},
	components: {
		PageToggleTransition
	},
	created() {},
	computed: {
		...mapState('setting', ['theme', 'animate'])
	},
	methods: {
		init() {
		},
		clickTreeSelect(key, e) {
			this.$emit('on-tree-select', key, e);
		},
		clickSearch(value, event) {
			this.$emit('on-search', value, event);
		}
	}
};
</script>

<style scoped="lang">
.ant-layout-content{
	background-color: #ffffff;
	box-shadow: 2px 0px 10px #d9d9d9;
    z-index: 2;
	min-height: 90vh;
}
.ant-layout-sider{
	background-color: #ffffff;
    max-width: 300px !important;
    min-width: 300px !important;
    width: 300px !important;
}

</style>
