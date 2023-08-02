<template>
  <a-spin
    :spinning="spinning"
    style="height: 100%; width: 100%"
    tip="Loading..."
  >
    <div style="padding: 20px; min-height: 100%; background: white">
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :xl="7" :lg="5">
            <a-form-model-item label="问答状态">
              <a-select
                placeholder="请选择问答状态"
                v-model="issue"
                allowClear
                style="width: 100%"
              >
                <a-select-option
                  v-for="(item, index) in issueList"
                  :key="index"
                  :value="index"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="7" :lg="5">
            <a-form-model-item label="是否审核">
              <a-select
                placeholder="请选择审核状态"
                v-model="status"
                allowClear
                style="width: 100%"
              >
                <a-select-option value="true"> 是 </a-select-option>
                <a-select-option value="false"> 否 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="10" :lg="12">
            <div style="margin-top: 5px; text-align: left">
              <a-space>
                <a-button type="primary" icon="search" @click="onSearch"
                  >查询</a-button
                >
                <a-button
                  ><a-checkbox @change="onRecycle" v-model="deleted"
                    >回收站</a-checkbox
                  ></a-button
                >
                <a-button type="primary" icon="edit" @click="onAdd"
                  >新增</a-button
                >
                <a-popconfirm
                  title="确定删除此问答吗?"
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
                  type="danger"
                  @click="torestore"
                  icon="pull-request"
                  v-if="deleted"
                  :disabled="!selectedRowKeys.length"
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
            <span v-if="record._delete"> {{ record.title }}</span>
          </template>
          <a v-else style="color: #40a9ff" @click="onEdit(record)">{{
            record.title
          }}</a>
        </span>
        <span slot="_issue" slot-scope="text, record">
          <a-tag
            v-if="record._extension.issue !== undefined"
            :color="issueList[record._extension.issue].color"
            >{{ issueList[record._extension.issue].name }}</a-tag
          >
          <a-tag v-else color="#00aaf0">未审核</a-tag>
        </span>
        <span slot="_answers" slot-scope="text, record">
          {{ record.answers.length }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            :style="
              record.status
                ? 'color: #ff7875 !important;'
                : 'color: #40a9ff !important;'
            "
            v-if="!record._delete"
            @click="check(record)"
          >
            <a-icon :type="record.status ? 'close' : 'check'" />
            {{ record.status ? "撤回" : "审核" }}
          </a>
          <a-divider type="vertical" v-if="!record._delete" />
          <a @click="todetiles(record)" style="color: #40a9ff">查看答案</a>
        </span>
      </a-table>
      <a-pagination
        size="small"
        style="text-align: right"
        @change="changepage"
        :current="pagination.page"
        :pageSize="pagination.per_page"
        @showSizeChange="changepage"
        :pageSizeOptions="pageSizeOptions"
        :total="data.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
    <a-modal
      title="问题新增"
      :visible="visible"
      :width="900"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build :value="listData" ref="forms" />
    </a-modal>
  </a-spin>
</template>
<script>
import {
  know_paginate,
  know_check,
  know_delete,
  know_edit,
  know_insert,
  know_restore,
} from "@/services/know";

import { form_get } from "@/services/forms";
export default {
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
      spinning: false,
      deleted: undefined,
      issue: undefined,
      status: undefined,
      form: {},
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      selectedRowKeys: [],
      data: {},
      issueList: [
        { name: "解答期", color: "green" },
        { name: "选择期", color: "cyan" },
        { name: "投票期", color: "blue" },
        { name: "已结束", color: "orange" },
      ],
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "问答状态",
          dataIndex: "issue",
          align: "center",
          scopedSlots: { customRender: "_issue" },
        },
        {
          title: "回答数量",
          dataIndex: "answers",
          align: "center",
          scopedSlots: { customRender: "_answers" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: true,
      visible: false,
      confirmLoading: false,
      listData: {},
      pageSizeOptions: ["10", "20", "30", "40"],
      mothed: know_edit,
    };
  },
  computed: {
    search: {
      get() {
        return {
          delete: this.deleted,
          issue: this.issue,
          status: this.status,
        };
      },
      set(val) {
        this.deleted = val.delete;
        this.issue = val.issue;
        this.status = val.status;
      },
    },
    pagination: {
      get() {
        return {
          page: this.data.page ? this.data.page : 1,
          per_page: this.data.per_page ? this.data.per_page : 10,
          total: this.data.total ? this.data.total : 0,
        };
      },
      set(val) {
        this.data.page = val.page;
        this.data.per_page = val.per_page;
      },
    },
  },
  created() {
    this.pagination = this.params.pagination || this.pagination;
    this.search = this.params.search || this.search;
    this.init();
  },
  methods: {
    init() {
      form_get({ name: "volunteer_quest" })
        .then((res) => {
          this.listData = res.data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadDataSrouce() {
      know_paginate(Object.assign({}, this.pagination, this.search))
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onDelete() {
      know_delete({ ids: this.selectedRowKeys })
        .then(() => {
          this.loading = true;
          this.selectedRowKeys = [];
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSearch() {
      this.loading = true;
      this.loadDataSrouce();
    },
    onRecycle(e) {
      this.deleted = e.target.checked;
      this.selectedRowKeys = [];
      this.loading = true;
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.loadDataSrouce();
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    check(record) {
      know_check({ id: record.id })
        .then((res) => {
          this.$message.success(res.data.message);
          this.loading = true;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.loading = true;
      this.loadDataSrouce();
    },

    onAdd() {
      this.visible = true;
      this.$nextTick(() => {
        this.mothed = know_insert;
        this.ids = undefined;
        this.$refs.forms.reset();
      });
    },
    onEdit(record) {
      this.visible = true;
      this.$nextTick(() => {
        this.mothed = know_edit;
        this.ids = record.id;
        this.$refs.forms.setData({
          title: record.title,
          content: record.content,
        });
      });
    },
    handleOk() {
      this.$refs.forms
        .getData()
        .then((valid) => {
          valid.id = this.ids;
          this.mothed(valid)
            .then(() => {
              this.loading = true;
              this.visible = false;
              this.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleCancel() {
      this.visible = false;
    },
    torestore() {
      know_restore({ ids: this.selectedRowKeys })
        .then((res) => {
          this.loading = true;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查看答案
    todetiles(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "in-detailes",
          params: Object.assign({
            search: this.search,
            pagination: this.pagination,
            id: record.id,
          }),
        },
      });
    },
  },
};
</script>