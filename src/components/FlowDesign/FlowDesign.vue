<template>
	<div class="wrap">
		<div class="content">
			<!--左侧工具栏-->
			<div id="flowStencil" class="sider" />
			<div class="panel">
				<!--流程图工具栏-->
				<div class="toolbar"><tool-bar v-if="isReady" /></div>
				<!--流程图画板-->
				<div :id="id" class="x6-graph" />
			</div>
			<!--右侧工具栏-->
			<div class="config"><config-panel v-if="isReady" /></div>
		</div>
	</div>
</template>

<script>
import './index.less';
import FlowGraph from './graph';
import ToolBar from './components/ToolBar/index.vue';
import ConfigPanel from './components/ConfigPanel/index.vue';

export default {
	name: 'FlowDesign',
	components: {
		ToolBar,
		ConfigPanel
	},
	props: {
		id: {
			type: String,
			default: () => {
				return "flowContainer";
			}
		}
	},
	data() {
		return {
			isReady: false
		};
	},
	created() {
		this.$nextTick(() => {
			this.initGraph();
		});
	},
	mounted() {},
	methods: {
		getContainerSize() {
			return {
				width: document.body.offsetWidth - 690,
				height: document.body.offsetHeight - 38
			};
		},
		initGraph() {
			const graph = FlowGraph.init(this.id);
			this.isReady = true;
			const resizeFn = () => {
				const { width, height } = this.getContainerSize();
				graph.resize(width, height);
			};
			resizeFn();
			window.addEventListener('resize', resizeFn);
			return () => {
				window.removeEventListener('resize', resizeFn);
			};
		}
	},
	destroyed() {
		FlowGraph.destroy();
		this.isReady = false;
	},
};
</script>

<style scoped lang="less"></style>
