<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <div class="title_back">
      <a @click="back"><a-icon type="rollback" />&nbsp;&nbsp;返回</a>
    </div>
    <a-back-top />
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="关键字"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入查询关键字"
              allowClear
            />
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24">
          <span style="float: left; margin-top: 3px; margin-left: 20px">
            <a-button type="primary" :loading="loadingbutton" @click="onSearch"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="resetForm()"
              :loading="loadingreset"
              >重置</a-button
            >
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- 增编 -->
    <a-row style="padding: 10px 0">
      <a-col :span="24" style="text-align: left">
        <a-space>
          <a-button type="primary" @click="onAdd" v-auth="`sensitive.apply`">
            <a-icon :type="icontype" />新增
          </a-button>
          <a-button
            ><a-checkbox
              v-model="searchform.delete"
              @change="onRecycle"
              style="font-size: 14px"
              >回收站</a-checkbox
            ></a-button
          >
        </a-space>
      </a-col>
    </a-row>
    <!-- <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <a
            class="clear"
            @click="onSelectClear"
            v-if="this.selectedRowKeys.length > 0"
            >取消选中</a
          >
        </div>
      </a-alert>
    </div> -->
    <a-table
      ref="table"
      bordered
      :loading="loading"
      class="table_content"
      size="middle"
      rowKey="id"
      :pagination="false"
      :columns="columns"
      :dataSource="dataSource.items"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <!-- 操作 -->
      <span slot="action" slot-scope="text, record">
        <a @click="onEnter(record)" v-if="!record._delete">编辑</a>
        <a-divider type="vertical" v-if="!record._delete" />
        <a @click="onDetails(record)">详情</a>
      </span>
      <!-- 父级行政划分 -->
      <!-- <span slot="title" slot-scope="text, record">
       {{record.title}}
      </span> -->
      <span slot="parent" slot-scope="text, record">
       {{record.parent ? record.parent.title : '' }}
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
      :title="modal_titles"
      :visible="visible"
      :width="900"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build :value="listData" ref="forms" />
    </a-modal>
  </a-card>
</template>
<script>
import {
  project_paginate,
  project_delete,
  project_restore,
} from "@/services/dataproject";
import {
  address_paginate,
address_create,
address_edit,
address_delete,
address_restore,
address_tree
} from "@/services/database";
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
      searchform: {
        per_page: 10,
        page: 1,
        keyword: undefined,
      },
      selectedRowKeys: [],
      dataSource: [],
      icontype: "plus",
      loading: true,
      loadingreset: false,
      loadingbutton: false,
      pageSizeOptions: ["10", "20", "30", "40"],
      statuslist: [
        { id: 0, name: "新建", color: "#2db7f5" },
        { id: 1, name: "续建", color: "#ff9800" },
        { id: 2, name: "准备", color: "#87d068" },
      ],
      columns: [
        {
          title: "地址名称",
          dataIndex: "title",
          scopedSlots: { customRender: "title" },
        },
         {
          title: "上级行政区域",
          dataIndex: "parent",
          scopedSlots: { customRender: "parent" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "200px",
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      modal_titles: "项目新增",
      visible: false,
      confirmLoading: false,
      listData: {},
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
  },
  authorize: {
    // onEnter: "sensitive.get",
    // confirm: "project.delete",
  },
  created() {
    this.init();
  },
  mounted() {
    this.loadDataSrouce();
  },
  methods: {
    handleOk() {},
    handleCancel() {
      this.visible = false;
    },
    init() {
      this.searchform = this.params.searchform
        ? this.params.searchform
        : this.searchform;
      Promise.all([form_get({ name: "projects_add" })])
        .then((res) => {
          console.log("res", res);
          this.listData = res[0].data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    onSearch() {
      this.loadingbutton = true;
      this.loading = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    resetForm() {
      this.loadingreset = true;
      this.loading = true;
      this.searchform = {};
      this.loadDataSrouce();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loading = true;
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      address_paginate(this.searchform)
        .then((res) => {
          this.dataSource = res.data.data;
          this.loading = false;
          this.loadingreset = false;
          this.loadingbutton = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.loadingreset = false;
          this.loadingbutton = false;
          this.loading = false;
        });
    },
    deleteDraft() {},
    onEnter(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home-edit",
          params: {
            id: record.id,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    onAdd() {
      // this.visible = true;
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home-edit",
          params: {
            id: undefined,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    onDetails(record){
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "survey-details",
          params: {
            id: record.id,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    // 回收站
    onRecycle() {
      this.selectedRowKeys = [];
      this.loading = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
    },
    /**审核 */
    confirm(record) {
      console.log(record);
      if (record._delete) {
        project_restore({ id: record.id })
          .then((res) => {
            console.log("res", res);
            this.loading = true;
            this.loadDataSrouce();
          })
          .catch((err) => {
            console.log("err", err);
            this.$message.error(err.response.data.message);
          });
      } else {
        project_delete({ id: record.id })
          .then((res) => {
            console.log("res", res);
            this.loading = true;
            this.loadDataSrouce();
          })
          .catch((err) => {
            console.log("err", err);
            this.$message.error(err.response.data.message);
          });
      }
    },
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "home",
          params: this.params,
        },
      });
    },
  },
};
</script>
<style >
.ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  border-left: 1px solid #f0f0f0;
  border-top: 1px solid #f0f0f0;
}
.toop {
  max-width: 500px;
}
</style>
<style scoped lang="less">
.title_back {
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 40px;
}
.title_back a {
  color: #1890ff;
}
.page_paper {
  background: #f0f8ff;
  padding: 20px;
}
a {
  color: #00aaf0 !important;
}
.table_content {
  margin: 20px 0;
  ::-webkit-scrollbar {
    width: 5px !important;
    height: 8px !important;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.alert {
  margin-bottom: 16px;
  .message {
    a {
      font-weight: 600;
    }
  }
  .clear {
    float: right;
  }
}
</style>