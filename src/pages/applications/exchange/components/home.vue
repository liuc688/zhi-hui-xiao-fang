<template>
  <div style="padding: 20px; min-height: 100%; background: white">
    <a-spin tip="Loading..." :spinning="loading">
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :xl="10" :lg="12">
            <div style="margin-top: 5px; text-align: left">
              <a-space>
                <a-button type="primary" icon="edit" @click="onAdd"
                  >新增</a-button
                >
                <a-popconfirm
                  title="确定删除此文章吗?"
                  ok-text="确定"
                  :disabled="!selectedRowKeys.length"
                  cancel-text="取消"
                  @confirm="onDelete"
                >
                  <a-button
                    type="danger"
                    icon="delete"
                    :disabled="!selectedRowKeys.length"
                    >删除</a-button
                  >
                </a-popconfirm>
                <a-button
                  ><a-checkbox @change="onRecycle">回收站</a-checkbox></a-button
                >
                <a-button
                  type="danger"
                  icon="delete"
                  v-if="isrecycle"
                  :disabled="!selectedRowKeys.length"
                  @click="torestore"
                  >还原</a-button
                >
              </a-space>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
      <a-table
        ref="table"
        :bordered="true"
        style="margin: 20px 0"
        size="middle"
        rowKey="id"
        :loading="loading"
        :columns="columns"
        :dataSource="data.items"
        :pagination="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onChange,
        }"
      >
        <span slot="_title" slot-scope="text, record">
          <template v-if="record._delete">
            <a-tag color="#f50">已删除</a-tag>
            <span>{{ record.title }}</span>
          </template>
          <a v-else @click="onEdit(record)" style="color: #1890ff">
            {{ record.title }}</a
          >
        </span>
        <span slot="channel" slot-scope="text, record">
          {{ record._mome.channel.title }}
        </span>
        <span slot="changes" slot-scope="text, record">
          {{ record._extension.changes }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="record._delete"> </template>
          <template v-else>
            <a
              :style="
                record.status
                  ? 'color: #ff7875 !important;'
                  : 'color: #1890ff !important;'
              "
              @click="check(record.id)"
            >
              <a-icon :type="record.status ? 'close' : 'check'" />
              {{ record.status ? "撤回" : "审核" }}
            </a>
            <a-divider type="vertical" />
            <a style="color: #1890ff" @click="reportlist(record)">兑换列表</a>
          </template>
        </span>
      </a-table>
      <a-pagination
        size="small"
        style="text-align: right"
        :current="pagination.page"
        :pageSize.sync="pagination.per_page"
        @change="changepage"
        @showSizeChange="changepage"
        :pageSizeOptions="['10', '20', '30', '40']"
        :total="pagination.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </a-spin>
    <a-modal
      title="兑换列表"
      :visible="visible"
      :width="900"
      :destroyOnClose="true"
      :maskClosable="false"
      :footer="null"
      @cancel="
        () => {
          visible = false;
        }
      "
    >
      <a-table
        ref="table"
        :bordered="true"
        style="margin: 20px 0"
        size="middle"
        rowKey="id"
        :loading="loadings"
        :columns="columnslist"
        :dataSource="datalist"
      >
        <span slot="_user" slot-scope="text, record">{{
          record._extension.user.username
        }}</span>
        <span slot="_status" slot-scope="text, record">
          <a-tag :color="record.status ? 'green' : 'blue'">{{
            record.status ? "已兑换" : "未兑换"
          }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            style="color: #1890ff"
            v-if="!record.status"
            @click="exchanges(record)"
            >兑换</a
          >
          <a-divider type="vertical" v-if="!record.status" />
          <a-popconfirm
            title="确定移除此次兑换吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deletes(record)"
          >
            <a style="color: #1890ff">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import {
  good_paginate,
  good_check,
  good_delete,
  good_restore,
  value_list,
  success_value,
  value_delete,
} from "@/services/goods";
import Templates from "../../templates/Templates.vue";
export default {
  components: { Templates },
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
      form: {},
      loading: true,
      loadings: false,
      channel: "",
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      isrecycle: false,
      data: {},
      datalist: [],
      selectedRowKeys: [],
      columns: [
        {
          title: "商品名称",
          dataIndex: "title",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "商品数量",
          dataIndex: "number",
          align: "center",
          scopedSlots: { customRender: "number" },
        },

        {
          title: "公益值兑换",
          dataIndex: "value",
          align: "center",
          scopedSlots: { customRender: "value" },
        },
        {
          title: "兑换数量",
          dataIndex: "changes",
          align: "center",
          scopedSlots: { customRender: "changes" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 180,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      columnslist: [
        {
          title: "兑换编号",
          dataIndex: "_index",
          scopedSlots: { customRender: "_index" },
        },
        {
          title: "用户",
          dataIndex: "user",
          scopedSlots: { customRender: "_user" },
        },

        {
          title: "兑换码",
          dataIndex: "select",
          scopedSlots: { customRender: "select" },
        },
        {
          title: "公益值",
          dataIndex: "value",
          align: "center",
          scopedSlots: { customRender: "value" },
        },
        {
          title: "兑换状态",
          dataIndex: "status",
          align: "center",
          scopedSlots: { customRender: "_status" },
        },
        {
          title: "兑换时间",
          dataIndex: "_createtime",
          align: "center",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 180,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      visible: false,
      goodId: "",
    };
  },
  computed: {
    search() {
      return {
        delete: this.isrecycle,
      };
    },
    pagination: {
      get() {
        return {
          page: this.data.page || 1,
          per_page: this.data.per_page || 10,
          total: this.data.total || 0,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
  },

  created() {
    this.channel = this.params.channel || undefined;
    this.pagination = this.params.pagination || this.pagination;
    this.init();
  },
  methods: {
    init() {
      this.paginate();
    },
    paginate() {
      var datas = Object.assign(this.search, {
        channel: this.channel,
        page: this.pagination.page,
        per_page: this.pagination.per_page,
      });
      good_paginate(datas)
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onSearch() {
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
    onAdd() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "document",
          params: Object.assign({
            pagination: this.pagination,
            search: this.search,
          }),
        },
      });
    },
    onEdit(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "document",
          params: Object.assign(record, {
            pagination: this.pagination,
            search: this.search,
          }),
        },
      });
    },
    onDelete() {
      good_delete({ ids: this.selectedRowKeys })
        .then(() => {
          this.loading = true;
          this.selectedRowKeys = [];
          this.paginate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reportlist(record) {
      this.loadings = true;
      this.goodId = record ? record.id : this.goodId;
      value_list({ good: this.goodId })
        .then((res) => {
          this.loadings = false;
          this.datalist = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.visible = true;
    },

    exchanges(record) {
      success_value({ id: record.id })
        .then(() => {
          this.reportlist();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletes(record) {
      value_delete({ id: record.id })
        .then(() => {
          this.reportlist();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    torestore() {
      good_restore({ ids: this.selectedRowKeys })
        .then(() => {
          this.loading = true;
          this.selectedRowKeys = [];
          this.paginate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loading = true;
      this.paginate();
    },
    check(record) {
      this.loading = true;
      good_check({ id: record })
        .then(() => {
          this.paginate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 回收站
    onRecycle(e) {
      this.selectedRowKeys = [];
      this.isrecycle = e.target.checked;
      this.loading = true;
      this.pagination.page = 1;
      this.paginate();
    },
  },
};
</script>