<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :model="searchform" ref="searchform">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="关键字"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  placeholder="请输入"
                  v-model="searchform.keyword"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="区划"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-tree-select
                  show-search
                  :treeData="division"
                  :replaceFields="{
                    key: '_id',
                    value: '_id',
                  }"
                  v-model="searchform.division"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择区划"
                  allow-clear
                  tree-default-expand-all
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="行业分类"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-tree-select
                  show-search
                  :treeData="organization"
                  :replaceFields="{
                    key: 'id',
                    value: 'id',
                  }"
                  v-model="searchform.organization"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择行业分类"
                  allow-clear
                  multiple
                  tree-default-expand-all
                ></a-tree-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  placeholder="请选择状态"
                  v-model="searchform.status"
                  allowClear
                >
                  <template v-for="item in status">
                    <a-select-option :value="item._id" :key="item._id">{{
                      item.title
                    }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="所属部门"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-tree-select
                  show-search
                  :treeData="industrial"
                  :replaceFields="{
                    key: '_id',
                    value: '_id',
                  }"
                  v-model="searchform.industrial"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择所属部门"
                  allow-clear
                  multiple
                  tree-default-expand-all
                ></a-tree-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" @click="onSearch" :loading="loading"
            >查询</a-button
          >
          <a-button
            style="margin-left: 8px"
            @click="
              () => {
                searchform = {};
                onLoad();
              }
            "
            >重置</a-button
          >
          <a
            @click="
              () => {
                advanced = !advanced;
              }
            "
            style="margin-left: 8px"
          >
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <div style="width: 100%; padding: 5px 0px">
        <a-space>
          <a-dropdown-button @click="onAdd()">登记信息</a-dropdown-button>
          <a-dropdown-button @click="onRiskRequest()"
            >协同请求</a-dropdown-button
          >
          <a-button-group
            ><a-button
              :disabled="selectedRows.length ? false : true"
              @click="onDelete"
              >删除</a-button
            ></a-button-group
          >
        </a-space>
      </div>
      <standard-table
        :loading="loading"
        :columns="columns"
        :dataSource="data.items"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        :rowKey="'id'"
        @selectedRowChange="onSelectChange"
        :pagination="false"
      >
        <div slot="_title" slot-scope="{ record }">
          <a @click="onSee(record)">{{ record.title }}</a>
        </div>
        <div slot="status" slot-scope="{ record }">
          <a-tag color="#87d068" v-if="record.status.name == 'STATUS_STOP'">{{
            record.status.title
          }}</a-tag>
          <a-tag
            color="#108ee9"
            v-else-if="record.status.name == 'STATUS_RUNING'"
            >{{ record.status.title }}</a-tag
          >
        </div>
        <div slot="level" slot-scope="{ record }">
          <a-tag color="green" v-if="record.level.name == 'LEVEL_NORMAL'">{{
            record.level.title
          }}</a-tag>
          <a-tag
            color="blue"
            v-else-if="record.level.name == 'LEVEL_WARNING'"
            >{{ record.level.title }}</a-tag
          >
          <a-tag
            color="orange"
            v-else-if="record.level.name == 'LEVEL_SERIOUS'"
            >{{ record.level.title }}</a-tag
          >
          <a-tag
            color="red"
            v-else-if="record.level.name == 'LEVEL_VERY_SERIOUS'"
            >{{ record.level.title }}</a-tag
          >
        </div>
        <div slot="organization" slot-scope="{ record }">
          <a-tag
            color="blue"
            v-for="item in record.organization"
            :key="item._id"
          >
            {{ item.title }}
          </a-tag>
        </div>
        <div slot="industrial" slot-scope="{ record }">
          <a-tag color="cyan" v-for="item in record.industrial" :key="item._id">
            {{ item.title }}
          </a-tag>
        </div>
        <div slot="action" slot-scope="{ text, record }">
          <a @click="onSee(record)">
            <a-icon type="eye" />
            查看
          </a>
          <a-divider type="vertical" />

          <a @click="onTask(record)">
            <a-icon type="book" />
            任务
          </a>
          <a-divider type="vertical" />
          <a @click="onEdit(record)">
            <a-icon type="edit" />
            编辑
          </a>
          <a-divider type="vertical" />
          <a @click="onDelete(record.id)">
            <a-icon type="delete" />
            删除
          </a>
        </div>
      </standard-table>
      <a-pagination
        size="small"
        style="text-align: right; padding: 15px 0"
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
  </a-card>
</template>

<script>
import { riskinfo_paginate } from "@/services/risk";
import { dictmap_tree } from "@/services/dictmap";
import { organization_tree } from "@/services/organization";

import StandardTable from "@/components/table/StandardTable";
export default {
  components: { StandardTable },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    crumbs: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      advanced: false,
      columns: [
        {
          title: "标题",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "摘要",
          dataIndex: "summary",
          ellipsis: true,
        },
        {
          title: "状态",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "级别",
          scopedSlots: { customRender: "level" },
        },
        {
          title: "区划",
          dataIndex: "division.title",
        },
        {
          title: "行业",
          scopedSlots: { customRender: "organization" },
        },
        {
          title: "部门",
          scopedSlots: { customRender: "industrial" },
        },
        {
          title: "操作",
          width: 300,
          scopedSlots: { customRender: "action" },
        },
      ],
      data: {},
      searchform: {},
      dictmaps: [],
      organization: [],
      users: [],
      selectedRows: [],
      visible: false,
    };
  },
  computed: {
    status() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "STATUS";
        });
        return maps.children;
      }
      return [];
    },
    division() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "DIVISION";
        });
        return maps.children;
      }
      return [];
    },
    industrial() {
      if (this.dictmaps.length) {
        const maps = this.dictmaps.find((item) => {
          return item.name == "INDUSTRIAL";
        });
        return maps.children;
      }
      return [];
    },
    pagination: {
      get() {
        return {
          page: this.data.page || this.params.page || 1,
          per_page: this.data.per_page || this.params.per_page || 10,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
    crumbParams() {
      return Object.assign(this.pagination, this.searchform);
    },
  },
  authorize: {},
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      if (
        this.params &&
        typeof this.params == "object" &&
        Object.keys(this.params).length
      ) {
        const searchform = Object.assign({}, this.params);
        delete searchform["page"];
        delete searchform["per_page"];
        this.searchform = searchform;
      }

      this.paginate();
      Promise.all([dictmap_tree(), organization_tree()])
        .then((response) => {
          this.dictmaps = response[0].data.data;
          this.organization = response[1].data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    paginate() {
      this.loading = true;
      const params = Object.assign(this.pagination, this.searchform);
      riskinfo_paginate(params)
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    onLink(params) {
      this.crumbs.push({
        params: this.crumbParams,
        route: "risk-list",
      });
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "risk-details",
          params: params || {},
          crumbs: this.crumbs || [],
        },
      });
    },
    onAdd() {
      this.onLink();
    },
    onRiskRequest(params) {
      this.crumbs.push({
        params: this.crumbParams,
        route: "risk-list",
      });
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "risk-request",
          params: params || {},
          crumbs: this.crumbs || [],
        },
      });
    },
    onSee(record) {
      this.$emit("event", {
        method: "onOpen",
        params: {
          name: "riskdetail",
          height: "80%",
          width: "80%",
          title: "网络舆情协同处置平台",
          type: "system",
          router: "RiskDetail",
          data: {
            id: record.id,
            self: true,
          },
        },
      });
    },
    onTask(params) {

      this.crumbs.push({
        params: this.crumbParams,
        route: "risk-list",
      });
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "task-list",
          params: params,
          crumbs: this.crumbs || [],
        },
      });
    },
    onMore() {
    },
    onEdit(record) {
      this.onLink(record);
    },
    onDelete(record) {
    },
    onSearch() {
      this.pagination.page = 1;
      this.paginate();
    },
    onClear() {},
    onStatusTitleClick() {},
    onChange() {},
    onSelectChange() {},
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
