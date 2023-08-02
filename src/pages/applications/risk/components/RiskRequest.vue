<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-page-header @back="onBack">
        <span slot="title">
          <a @click="onBack" style="color: #000000">返回</a>
        </span>
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
          </span>
        </a-form>
      </a-page-header>
    </div>
    <div>
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
        <div slot="organization" slot-scope="{ record }">
          {{ record.organization.title }}
        </div>
        <div slot="hander" slot-scope="{ record }">
          <span v-if="record.hander">
            {{ record.hander.realname }}
          </span>
          <span v-else style="color: #ccc"> N/A </span>
        </div>
        <div slot="action" slot-scope="{ text, record }">
          <a @click="onSee(record)">
            <a-icon type="eye" />
            查看
          </a>
          <a-divider type="vertical" />
          <template v-if="record.accept === undefined">
            <a @click="onAccept(record, true)" style="color: #40a9ff">
              <a-icon type="select" />
              接受
            </a>
            <a-divider type="vertical" />
            <a @click="onAccept(record, false)" style="color: #ff7575">
              <a-icon type="import" />
              退回
            </a>
          </template>
          <template v-else>
            <span v-if="record.accept" style="color: #40a9ff">
              <a-icon type="select" />
              已接受
            </span>
            <span v-else style="color: #ff7575">
              <a-icon type="import" />
              已退回
            </span>
          </template>
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
import { form_get } from "@/services/forms";
import {
  riskrequest_paginate,
  riskrequest_accept,
} from "@/services/riskrequest";
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
      visible: false,
      columns: [
        {
          title: "标题",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "涉及行业",
          scopedSlots: { customRender: "organization" },
        },
        {
          title: "申请人",
          dataIndex: "requester.realname",
        },
        {
          title: "处置人",
          scopedSlots: { customRender: "hander" },
        },
        {
          title: "操作",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      id: null,
      organization: [],
      title: null,
      jsonData: {},
      data: {},
      searchform: {},
      selectedRows: [],
    };
  },
  computed: {
    dynamicData() {
      let result = {
        organization: this.organization,
      };
      return result;
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
      return Object.assign(this.pagination, this.searchform, {
        parent: this.params.id,
      });
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
        delete searchform["id"];
        this.searchform = searchform;
      }

      this.paginate();

      Promise.all([
        form_get({
          name: "risk_request",
        }),
        organization_tree(),
      ])
        .then((response) => {
          this.jsonData = response[0].data.data.form;
          this.organization = response[1].data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    paginate() {
      this.loading = true;

      riskrequest_paginate(this.crumbParams)
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },

    onAccept(record, isAccept) {
      this.loading = true;
      riskrequest_accept({
        id: record.id,
        accept: isAccept,
      })
        .then(() => {
          this.onLoad();
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    onSee(record) {
      
      this.$emit("event", {
        method: "onOpen",
        params: {
          name: "riskrequestdetail",
          height: "80%",
          width: "80%",
          title: "网络舆情协同处置平台",
          type: "system",
          router: "RiskRequestDetail",
          data: record,
        },
      });
    },
    onSearch() {
      this.pagination.page = 1;
      this.paginate();
    },
    onBack() {
      const last = this.crumbs.pop();
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "risk-list",
          params: last.params,
          crumbs: this.crumbs || [],
        },
      });
    },
    onClear() {},
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
