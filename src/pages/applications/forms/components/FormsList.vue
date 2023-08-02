<template>
  <div>
    <a-form-model
      ref="searchForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="searchForm"
    >
      <a-row>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-model-item label="关键字">
            <a-input
              style="width: 100%"
              placeholder="请输入"
              allowClear
              v-model="searchForm.keyword"
            />
          </a-form-model-item>
        </a-col>
        <a-col :lg="8" :md="12" :sm="24">
          <a-form-model-item label="表单类型">
            <a-tree-select
              show-search
              style="width: 100%" allowClear
              v-model="searchForm.parent"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="channelData"
              placeholder="请选择表单分类"
              :replaceFields="{
                key: 'id',
                value: 'id',
              }"
              :filterTreeNode="
                (value, node) => {
                  const data = node.componentOptions.propsData.dataRef;
                  return (
                    data.title.indexOf(value) !== -1 ||
                    data.name.indexOf(value) !== -1
                  );
                }
              "
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>

        <template v-if="advanced">
          <!-- <a-col :lg="8" :md="12" :sm="24">
            <a-form-model-item label="真实姓名">
              <a-input
                style="width: 100%"
                placeholder="请输入"
                v-model="searchForm.realname"
              />
            </a-form-model-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-model-item label="创建时间">
              <a-date-picker
                style="width: 100%"
                placeholder="请输入新增日期"
                value-format="YYYY-MM-DD"
                v-model="searchForm.createtime"
              />
            </a-form-model-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-model-item label="修改时间">
              <a-date-picker
                style="width: 100%"
                placeholder="请输入更新日期"
                value-format="YYYY-MM-DD"
                v-model="searchForm.modifytime"
              />
            </a-form-model-item>
          </a-col> -->
        </template>
        <a-col :lg="8" :md="12" :sm="24">
          <div style="padding-left: 50px; margin-top: 3px">
            <a-button type="primary" @click="onSearch" html-type="submit"
              >查询</a-button
            >
            <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
            <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <div>
      <a-space class="operator">
        <a-button @click="onAdd" type="primary" v-auth="`forms.user.add`"
          >新建</a-button
        >
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item
              @click="deleteRecord(selectedRowKeys)"
              v-auth="`forms.delete`"
              >批量删除</a-menu-item
            >
          </a-menu>
          <a-button>
            更多操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </a-space>
      <standard-table
        :loading="loading"
        :columns="columns"
        :current="pagination.page"
        :pageSize="pagination.per_page"
        :dataSource="data.items"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
        :rowKey="'id'"
        @selectedRowChange="onSelectChange"
        :pagination="false"
      >
        <span slot="action" slot-scope="{ record }">
          <a-tooltip>
            <template slot="title"> 删除 </template>
            <a @click="deleteRecord(record.id)" v-auth="`forms.delete`">
              <a-icon type="delete" />
            </a>
          </a-tooltip>
        </span>
        <span slot="titles" slot-scope="{ record }">
          <a
            style="margin-right: 8px;color:#1890ff"
            @click="onEdit(record)"
            v-auth="`forms.user.edit`"
          >
            {{ record.title }}</a
          >
        </span>
      </standard-table>
      <a-pagination
        size="small"
        style="text-align: right;padding: 15px 0"
        :current="pagination.page"
        :defaultPageSize="pagination.per_page"
        @change="onChangePage"
        @showSizeChange="onChangePage"
        :pageSizeOptions="['10', '20', '30', '40']"
        :total="data.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
  </div>
</template>
<script>
import StandardTable from "@/components/table/StandardTable";
import { forms_paginate, form_delete } from "@/services/forms";
import { dictmap_tree } from "@/services/dictmap";
export default {
  name: "FormsList",
  components: { StandardTable },
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      title: null,
      visible: false,
      loading: true,
      advanced: false,
      columns: [
        {
          title: "表单标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "表单名称",
          dataIndex: "name",
        },
        {
          title: "是否主表",
          dataIndex: "main",
          customRender: (field) => (field ? "是" : "否"),
          align: "center",
        },
        {
          title: "是否被挂载",
          dataIndex: "bind",
          customRender: (field) => (field ? "是" : "否"),
          align: "center",
        },
        {
          title: "创建人",
          dataIndex: "_creator.realname",
          align: "center",
          scopedSlots: { customRender: "_creator" },
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          width: "160px",
          align: "center",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "修改人",
          dataIndex: "_modifier.realname",
          align: "center",
          scopedSlots: { customRender: "_modifier" },
        },
        {
          title: "修改时间",
          dataIndex: "_modifytime",
          width: "160px",
          align: "center",
          scopedSlots: { customRender: "_modifytime" },
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      dataSource: [],
      dynamicData: {},
      jsonData: {},
      selectedRows: [],
      data: {},
      currRecord: null,
      commit: null,
      searchForm: {},
      searchValues: {},
      selectedRowKeys: [],
      channelData:[]
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.data.page || 1,
          per_page: this.data.per_page || 10,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
  },
  created() {
    this.init();
  },
  authorize: {
    onAdd: "forms.user.add",
    onEdit: "forms.user.edit",
    deleteRecord: "forms.delete",
  },

  methods: {
    init() {
      this.pagination = this.params.pagination || this.pagination;
      this.searchForm = this.params.searchForm || this.searchForm;
      dictmap_tree({ name: "FormsType" })
        .then((response) => {
          this.channelData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      this.paginate();
    },
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },
    paginate() {
      forms_paginate(Object.assign(this.pagination, this.searchForm))
        .then((res) => {
          this.loading = false;
          this.data = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSearch() {
      this.pagination = {
        per_page: 10,
        page: 1,
      };
      this.loading = true;
      this.paginate();
    },
    onReset() {
      this.loading = true;
      this.searchForm = {};
      this.pagination = {
        per_page: 10,
        page: 1,
      };
      this.paginate();
    },
    // 用户表单增编
    onEdit(record) {
      if (record) {
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "forms-details",
            params: Object.assign({}, record, {
              pagination: this.pagination,
              searchForm: this.searchForm,
            }),
          },
        });
      } else {
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "forms-details",
            params: {
              id: undefined,
              pagination: this.pagination,
              searchForm: this.searchForm,
            },
          },
        });
      }
    },
    onAdd() {
      this.onEdit();
    },
    // 表单删除
    deleteRecord(key) {
      var id = {};
      if (key instanceof Array) {
        id = { ids: key };
      } else {
        id = { ids: [key] };
      }
      
      if (key.length) {
        this.$nextTick(() => {
          this.$confirm({
            title: "删除确认",
            content: "确认要删除此表单吗!该操作不可逆,请谨慎操作!",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
              form_delete(id)
                .then((response) => {
                  this.loading = true;
                  this.paginate();
                  this.$message.success(response.data.message);
                })
                .catch((err) => {
                  this.$message.success(err.response.data.message);
                });
            },
            onCancel: () => {
              console.log("取消");
            },
          });
        });
      } else {
        this.$message.warning("请选择至少一条数据！");
      }
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },

    onChange(e) {
      this.$message.info("表格状态改变了", e);
    },
  },
};
</script>
<style scoped>
.operator {
  padding-bottom: 5px;
}
</style>
