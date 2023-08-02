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
          <a-col :xl="12" :lg="8">
            <!-- <a-form-model-item label="标题">
              <a-select
              show-search
              v-model="search.title"
              placeholder="请选择标题"
              allowClear
            >
              <a-select-option v-for="item in title" :key="item">{{
                item
              }}</a-select-option>
            </a-select>

             
            </a-form-model-item> -->

            <a-form-model-item
              label="项目名称"
              :labelCol="{ span: 5 }"
              :model="search"
              ref="search"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-input
                v-model="search.title"
                placeholder="请输入项目名称"
                allowClear
              />
            </a-form-model-item>
          </a-col>
          <a-col :xl="10" :lg="8">
            <div style="margin-top: 4px; text-align: left">
              <a-space>
                <a-button
                  type="primary"
                  icon="search"
                  @click="onSearch"
                  style="margin-left: 20px"
                  >查询</a-button
                >
                <a-button
                  type="primary"
                  icon="edit"
                  @click="onAdd"
                  style="margin-left: 15px"
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
                    style="margin-left: 15px"
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
          <a style="color: #40a9ff" @click="onEdit(record)">{{
            record.title
          }}</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="todetiles(record)" style="color: #40a9ff">查看</a>
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
import {
  bookings_get,
  person_accept,
  person_add,
  bookings_paginate,
  person_paginate,
} from "@/services/booking";
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
      searchform: {},
      data: {},
      issueList: [
        { name: "解答期", color: "green" },
        { name: "选择期", color: "cyan" },
        { name: "投票期", color: "blue" },
        { name: "已结束", color: "orange" },
      ],
      columns: [
        {
          title: "项目名称",
          dataIndex: "title",
          scopedSlots: { customRender: "_title" },
        },
        {
          title: "该项目预约的人员信息",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: false,
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
      form_get({ name: "preview_management" })
        .then((res) => {
          this.listData = res.data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadDataSrouce() {
      bookings_paginate(Object.assign({}, this.pagination, this.search))
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
        this.mothed = person_add;
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