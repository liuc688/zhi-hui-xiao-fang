<template>
  <a-card>
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
          <div style="padding-left: 50px; margin-top: 3px">
            <a-button type="primary" @click="onSearch" html-type="submit"
              >查询</a-button
            >
            <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <div>
      <a-space class="operator">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item>全部已读</a-menu-item>
            <a-menu-item>批量删除</a-menu-item>
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
        :pagination="false"
      >
        <span slot="isread" slot-scope="{ record }">
          <a-tag color="#ff0000" v-if="!record.isread"> 未读 </a-tag>
          <a-tag color="#87d068" v-else> 已读 </a-tag>
        </span>
        <span slot="action" slot-scope="{ record }">
          <a-tooltip v-if="record.application">
            <template slot="title">
              跳转到 -- > {{ record.application.title }}</template
            >
            <a
              style="margin-right: 8px; color: #1890ff"
              @click="onAction(record)"
            >
              {{ record.application.title }}
            </a>
          </a-tooltip>

          <template v-else> N/A </template>
        </span>
        <span slot="titles" slot-scope="{ record }">
          <a
            style="margin-right: 8px; color: #1890ff"
            @click="onDetails(record)"
          >
            {{ record.title }}
          </a>
        </span>
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
import StandardTable from "@/components/table/StandardTable";
import { messages_paginate } from "@/services/messages";
export default {
  components: {
    StandardTable,
  },
  props: {
    open: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      searchForm: {
        sort: undefined,
        order_by: undefined,
      },
      data: {},
      columns: [
        {
          title: "是否已读",
          dataIndex: "isread",
          width: 120,
        //   sorter: true,
          scopedSlots: { customRender: "isread" },
        },
        {
          title: "消息标题",
          dataIndex: "title",
          width: 200,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "详情",
          dataIndex: "details",
          ellipsis: true,
        },
        {
          title: "操作",
          width: 160,
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      selectedRows: [],
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
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.paginate();
    },
    paginate() {
      messages_paginate(Object.assign(this.pagination, this.searchForm))
        .then((response) => {
          this.data = response.data.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.loading = false;
        });
    },
    onDetails(record) {
      this.$emit("open", {
        id: record.id,
        name: "MessageDetails",
        title: "消息详情",
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "40%",
        height: "40%",
        router: "MessageDetails",
        data: {
          data: record,
          open: open,
        },
        cancel: () => {
          this.onLoad();
        },
      });
    },
    onAction(record) {
      this.$emit("open", record.application || {});
    },
    onSearch() {},
    onReset() {},
    onClear() {},
    onChange(pagination, filters, sorter) {
      if (sorter.order) {
        this.searchForm.sort = sorter.field;
        this.searchForm.order_by = sorter.order == "ascend";
      } else {
        this.searchForm.sort = undefined;
        this.searchForm.order_by = undefined;
      }
      this.paginate();
    },
    onChangePage(page, pageSize) {
      this.loading = true;
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.paginate();
    },
  },
};
</script>

