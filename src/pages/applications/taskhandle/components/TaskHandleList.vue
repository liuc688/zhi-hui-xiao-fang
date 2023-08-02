<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-page-header>
        <a-form layout="horizontal" :model="searchform" ref="searchform">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="关键字"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }"
                >
                  <a-input placeholder="请输入" v-model="searchform.keyword" />
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
                  init();
                }
              "
              >重置</a-button
            >
          </span>
        </a-form>
      </a-page-header>
    </div>
    <div>
      <div style="width: 100%; padding: 5px 0px">
        <a-space>
          <a-dropdown-button @click="onRiskRequest()">协同请求</a-dropdown-button></a-dropdown-button>
          
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
          <a @click="onReply(record)">{{ record.title }}</a>
        </div>
        <div slot="action" slot-scope="{ text, record }">
          <a @click="onSee(record)">
            <a-icon type="eye" />
            查看舆情信息
          </a>
          <a-divider type="vertical" />
          <a @click="onReply(record)">
            <a-icon type="eye" />
            回复
          </a>
          <a-divider type="vertical" />
          <a @click="onDelete(record)">
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
import { form_get } from "@/services/forms";
import {
  risktask_user_paginate,
  risktask_delete,
  risktask_add,
} from "@/services/task";
import { user_list } from "@/services/user";

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
          title: "发布时间",
          dataIndex: "_createtime",
        },
        {
          title: "发布人",
          dataIndex: "_creator.realname",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      id: null,
      users: [],
      data: {},
      searchform: {},
      selectedRows: [],
    };
  },
  computed: {
    dynamicData() {
      let result = {};

      return result;
    },
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
  authorize: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.paginate();
     
    },
    paginate() {
      this.loading = true;
      const params = Object.assign(this.pagination, this.searchform);

      risktask_user_paginate(params)
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    onReply(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "task-handles",
          params: record || {},
        },
      });
    },
    onRiskRequest(){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "risk-request",
          params: {},
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
            id: record.parent,
            self: false,
          },
        },
      });
    },

    onSearch() {
      this.paginate();
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
