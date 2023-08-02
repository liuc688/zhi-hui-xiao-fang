<template>
	<div style="width: 100%; padding: 5px 0px">
		<div style="width: 100%; padding: 5px 0px">
			<a-space>
				<a-dropdown-button @click="onAdd()" v-auth="`dict.add`">添加字典</a-dropdown-button>
				<a-button-group><a-button :disabled="selectedRows.length ? false : true" @click="onDelete" v-auth="`dict.del`">删除</a-button></a-button-group>
				<a-input-search style="width: 300px;" placeholder="请输入" allowClear @search="onSearch" @change="onSearchChange" v-model="keyword" />
			</a-space>
		</div>
		<standard-table
			:loading="loading"
			:columns="columns"
			:dataSource="data"
			:selectedRows.sync="selectedRows"
			
			@clear="onClear"
			:rowKey="'id'"
			v-auth="`dict.list`"
			:pagination="false"
		>
			<span slot="_title" slot-scope="{ record }">
				<a @click="onEdit(record)" v-auth="`dict.update`">{{ record.title }}</a>
			</span>
			<span slot="action" slot-scope="{ record }">
				<a-tooltip>
					<template slot="title">
						删除
					</template>
					<a @click="onDelete(record)"><a-icon type="delete" /></a>
				</a-tooltip>
			</span>
		</standard-table>
		<!-- 弹窗 -->
		<a-modal
			v-model="visible"
			:title="title"
			:maskClosable="false"
			ok-text="确认"
			cancel-text="取消"
			@ok="onOk"
			centered
			width="45%"
			:confirmLoading="okloading"
			:z-index="1002"
			@cancel="
				() => {
					this.$refs.form.reset();
					visible = false;
				}
			"
		>
			<k-form-build :value="jsonData" ref="form" :dynamicData="dynamicData" />
		</a-modal>
	</div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable';
import { dictmap_list, dictmap_add, dictmap_edit, dictmap_del } from '@/services/dictmap';
import { form_get } from '@/services/forms';
export default {
	name: 'dict-map-list',
	components: { StandardTable },
	props: {
		params: {
			//传递的数据
			type: Object
		},
		event: {
			type: Function
		}
	},
	data() {
		return {
			loading: false,
			okloading: false,
			keyword: null,
			visible: false,
			jsonData: {},
			data: [],
			oldData: [],
			currData: {},
			selectedRows: [],
			searchForm: {},
			labelCol: { span: 5 },
			wrapperCol: { span: 18, offset: 1 },
			title: '',
			commit: undefined,
			columns: [
				{
					title: '标题',
					dataIndex: 'title',
					scopedSlots: { customRender: '_title' }
				},
				{
					title: '名称',
					dataIndex: 'name'
				},
				{
					title: '操作',
					scopedSlots: {
						customRender: 'action'
					},
					align: 'center'
				}
			]
		};
	},
	computed: {
		dynamicData() {
			return {};
		}
	},
	created() {
		this.init();
	},
	authorize: {
		onAdd: 'dict.add',
		onEdit: 'dict.update',
		onDelete:'dict.del'
	},
	methods: {
		init() {
			this.loading = true;
			Promise.all([
				dictmap_list({
					parent: this.params.id
				}),
				form_get({
					name: 'dictmap_add'
				})
			])
				.then(response => {
					this.loading = false;
					this.data = response[0].data.data;
					this.oldData = this.data;
					this.jsonData = response[1].data.data.form;
				})
				.catch(error => {
					console.log(error);
					this.loading = false;
				});
		},
		onOk() {
			this.$refs.form.getData().then(formData => {
				this.okloading = true;
				if (this.params.id) {
					formData.parent = this.params.id;
				}
				if (this.currData.id) {
					formData.id = this.currData.id;
				}
				this.commit(formData)
					.then(response => {
						this.init();
						this.$emit('event', {
							method: 'onRefresh'
						});
						this.visible = false;
						this.okloading = false;
					})
					.catch(error => {
						console.log(error);
						this.visible = false;
						this.okloading = false;
					});
			});
		},
		onAdd() {
			this.commit = dictmap_add;
			this.visible = true;
			this.$nextTick(() => {
				this.$refs.form.reset();
			});
		},
		onEdit(record) {
			this.commit = dictmap_edit;
			this.visible = true;
			this.currData = record;
			this.$nextTick(() => {
				this.$refs.form.reset();
				this.$refs.form.setData({
					title: record.title,
					name: record.name,
					color:record.color
				});
			});
		},
		onClear() {
			this.selectedRows = [];
		},
		onSearch(value) {
			if (value) {
				this.data = this.oldData.filter(item => {
					let filter = item.title.indexOf(value) > -1 || item.title.toLowerCase().indexOf(value) > -1
					filter = filter || item.name.indexOf(value) > -1  || item.name.toLowerCase().indexOf(value) > -1 
					return filter;
				});
			}
		},
		onSearchChange() {
			if (!this.keyword) {
				this.data = this.oldData;
			}
		},
		onDelete(record) {
			const that = this;
			let ids = [];
			if (record.id) {
				ids = [record.id];
			} else {
				ids = that.selectedRows.map(item => {
					return item.id;
				});
			}
			this.$confirm({
				title: '确定要删除此字典吗?',
				content: '该操作不可逆 !请谨慎操作 !',
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() {
					dictmap_del({
						ids: ids
					})
						.then(response => {
							that.init();
							that.$emit('event', {
								method: 'onRefresh'
							});
							that.visible = false;
							that.okloading = false;
						})
						.catch(error => {
							console.log(error);
							that.visible = false;
							that.okloading = false;
						});
				},
				onCancel() {
				}
			});
		}
	}
};
</script>

<style></style>
