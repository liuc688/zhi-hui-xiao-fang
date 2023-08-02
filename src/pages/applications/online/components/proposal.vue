<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="关键词"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入关键词查询"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="状态"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请选择状态查询"
              v-model="searchform.status"
              allowClear
            >
              <a-select-option v-for="item in statuslist" :key="item.id">{{
                item.title
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <template v-if="advanced">
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="类别"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择类别查询"
                v-model="searchform.category"
                allowClear
              >
                <a-select-option
                  v-for="item in categorylist"
                  :key="item.title"
                  >{{ item.title }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="类型"
              :labelCol="{ span: 7 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-select
                placeholder="请选择类型查询"
                v-model="searchform.type"
                allowClear
              >
                <a-select-option v-for="item in typelist" :key="item.title">{{
                  item.title
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </template>
        <a-col :md="7" :sm="24" :offset="1">
          <span
            style="
              float: left;
              margin-top: 3px;
              display: block;
              margin-bottom: 24px;
              white-space: nowrap;
            "
          >
            <a-button type="primary" :loading="loadingsearch" @click="onSearch"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="resetForm()"
              :loading="loadingreset"
              >重置</a-button
            >
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <a-space>
      <a-button type="primary" @click="onAdd" style="margin: 0px 0px 20px">
        <a-icon type="plus" />新增
      </a-button>
      <a-button style="margin: 0px 0px 20px">
        <a-checkbox v-model="searchform.delete" @change="onRecycles"
          >回收站</a-checkbox
        >
      </a-button>
    </a-space>
    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <a
            class="clear"
            @click="onSelectClear"
            v-if="this.selectedRowKeys.length > 0"
            >取消</a
          >
        </div>
      </a-alert>
    </div>

    <a-table
      ref="table"
      bordered
      class="table_content"
      size="middle"
      rowKey="id"
      :loading="loading"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource.items"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a
          @click="onEnter(record)"
          v-if="!record._delete"
          style="color: #00aaf0"
        >
          编辑
        </a>
        <a-popconfirm
          v-else
          placement="topRight"
          title="您确定要还原这条信息吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="restoremessage(record)"
        >
          <a style="color: #00aaf0"> 还原 </a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topRight"
          title="您确定要删除这条信息吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="deletesmessage(record)"
        >
          <a style="color: #00aaf0"> 删除 </a>
        </a-popconfirm>
      </span>
      <span slot="titles" slot-scope="text, record">
        <a @click="getdetailes(record)" style="color: #1890ff">{{
          record.title
        }}</a>
      </span>
      <span slot="mode" slot-scope="text, record">
        <a-tag :color="record.mobile ? '#2db7f5' : '#bfbfbf'">{{
          record.mobile ? "留名" : "匿名"
        }}</a-tag>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-tag :color="record.status == 0 ? '#f50' : '#2db7f5'">{{
          record.status == 0 ? "未查看" : "已查看"
        }}</a-tag>
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
      :total="dataSource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    ></a-pagination>

    <a-modal
      :title="titles"
      width="60%"
      :confirm-loading="confirmLoading"
      :visible="formDialog"
      :maskClosable="false"
      @ok="onSubmit"
      @cancel="
        () => {
          formDialog = false;
          this.$refs.forms.reset();
        }
      "
    >
      <k-form-build
        :value="jsonData"
        :config="config"
        :dynamicData="dynamicData"
        @change="changes"
        ref="forms"
      />
    </a-modal>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";

import PicPreview from "@/components/PicPreview";
import {
  message_paginate,
  message_create,
  message_edit,
  message_delete,
  message_restore,
} from "@/services/infofilling";
import { dictmap_tree } from "@/services/dictmap";
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
  components: {
    PicPreview,
  },
  data() {
    return {
      advanced: false,
      formDialog: false, //弹窗
      confirmLoading: false, //弹窗
      loading: true, //表格
      loadingsearch: false, //查询
      loadingreset: false, //重置
      searchform: {
        page: 1,
        per_page: 10,
        delete: false,
      },
      statuslist: [
        { id: 0, title: "未查看", color: "#f50" },
        { id: 1, title: "已查看", color: "#2db7f5" },
      ],
      dataSource: {},
      jsonData: {},
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          ellipsis: true,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "类别",
          dataIndex: "category",
          width: "150px",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "类型",
          dataIndex: "type",
          width: "150px",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "方式",
          dataIndex: "mode",
          width: "100px",
          scopedSlots: { customRender: "mode" },
        },
        {
          title: "状态",
          dataIndex: "status",
          width: "100px",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      selectedRowKeys: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      draftId: "",
      titles: "新增产品",
      //   图片
      previewShow: false,
      preImages: [],
      currentImg: "",
      videopres: false,
      activeKey: 0,
      videolist: [],
      categorylist: [],
      typelist: [],
      methoeds: undefined,
    };
  },
  computed: {
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
      },
    },
    config() {
      return {
        uploadFileHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
        uploadImageHeaders: {
          Authorization: Cookie.get("Authorization"),
        },
      };
    },
    dynamicData() {
      let result = {
        categorylist: [],
        typelist: [],
      };
      this.categorylist.filter((item) => {
        result.categorylist.push({
          label: item.title,
          value: item.title,
        });
      });
      this.typelist.filter((item) => {
        result.typelist.push({
          label: item.title,
          value: item.title,
        });
      });
      return result;
    },
  },
  created() {
    this.init();
    console.log("this.params", this.params);
  },
  methods: {
    // 数据初始化
    init() {
      this.searchform = this.params.searchform || this.searchform;
      Promise.all([
        form_get({ name: "zdxf_suggestions" }),
        dictmap_tree({ name: "messages_categorys" }), //沟通类别
        dictmap_tree({ name: "messages_types" }), //沟通类型
      ])
        .then((Response) => {
          this.jsonData = Response[0].data.data.form;
          this.categorylist = Response[1].data.data;
          this.typelist = Response[2].data.data;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 增编 提交
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((values) => {
          console.log("values", values);
          var datas = Object.assign(values, {
            id: this.draftId,
          });
          this.methoeds(datas)
            .then((res) => {
              console.log("res", res), (this.formDialog = false);
              this.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
              this.formDialog = false;
              this.$message.error(err.Response.data.message);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 编辑
    onEnter(record) {
      this.formDialog = true;
      this.draftId = record.id;
      this.titles = "编辑建议";
      this.methoeds = message_edit;
      this.$nextTick(() => {
        if (record.mobile) {
          this.$refs.forms.show(["name", "address", "mobile", "email"]);
          this.$nextTick(() => {
            this.$refs.forms.setData(Object.assign(record, { mode: "留名" }));
          });
        } else {
          this.$refs.forms.hide(["name", "address", "mobile", "email"]);
          this.$nextTick(() => {
            this.$refs.forms.setData(Object.assign(record, { mode: "匿名" }));
          });
        }
      });
    },
    // 添加
    onAdd() {
      this.formDialog = true;
      this.draftId = undefined;
      this.titles = "新增建议";
      this.methoeds = message_create;
      this.$nextTick(() => {
        this.$refs.forms.hide(["name", "address", "mobile", "email"]);
        this.$refs.forms.setData({
          content: undefined,
        });
        this.$refs.forms.reset();
      });
    },
    // 删除
    deletesmessage(record) {
      message_delete({ id: record.id })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.Response.data.message);
        });
    },
    // 还原
    restoremessage(record) {
      message_restore({ id: record.id })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.Response.data.message);
        });
    },
    // 分页
    changepage(page, pageSize) {
      console.log(page, pageSize);
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    onRecycles() {
      this.loadDataSrouce();
    },
    // 获取数据分页
    loadDataSrouce() {
      this.loading = true;
      message_paginate(this.searchform)
        .then((res) => {
          console.log("res123", res);
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
          this.dataSource = res.data.data;
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      this.searchform = {};
      this.loading = true;
      this.loadingreset = true;
      this.loadDataSrouce();
    },
    //详情
    getdetailes(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "proposaldetailes",
          params: {
            id: record.id,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    // 表单变动
    changes(value, key) {
      if (key == "mode") {
        if (value == "留名") {
          this.$refs.forms.show(["name", "address", "mobile", "email"]);
        } else {
          this.$refs.forms.hide(["name", "address", "mobile", "email"]);
        }
      }
    },
  },
  mounted() {},
};
</script>

<style>
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
</style>
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
.alert {
  margin-bottom: 16px;
  .message {
    a {
      font-weight: 600;
      color: #1890ff;
    }
  }
  .clear {
    float: right;
  }
}
.action_button:hover {
  color: #1890ff;
}
.table_content {
  margin: 20px 0;
}
// ::-webkit-scrollbar {
//   width: 0 !important;
// }
// ::-webkit-scrollbar {
//   width: 0 !important;
//   height: 0;
// }
</style>
