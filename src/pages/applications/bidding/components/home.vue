<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
      <a-row>
        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="关键词"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入关键词"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="归属地"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
              show-search
              v-model="searchform.site"
              placeholder="请选择归属地"
              allowClear
            >
              <a-select-option v-for="item in site" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="站点"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-model="searchform.organization"
              placeholder="请输入站点"
              allowClear
            />
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="类型"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
              show-search
              v-model="searchform.type"
              placeholder="请选择类型"
              allowClear
            >
              <a-select-option v-for="item in type" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="时间范围"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
            format="YYYY-MM-DD"
          >
            <a-range-picker
              style="width: 100%"
              v-model="searchform.rangedata"
              @change="onTimerRangeChange"
              allowClear
            />
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24">
          <a-form-model-item
            label="域名"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
              show-search
              v-model="searchform.domain"
              placeholder="请选择域名"
              allowClear
            >
              <a-select-option v-for="item in domain" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :md="6" :sm="24" style="margin-bottom: 10px; padding-left: 6.3%">
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
            <a-button style="margin-left: 8px" @click="resetForm()"
              >重置</a-button
            >
          </span>
        </a-col>
      </a-row>
    </a-form-model>

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
            >清空</a
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
      <span slot="titless" slot-scope="text, record" class="colorr">
        <a @click="mm(record)" target="_blank">{{ record.title }}</a>
      </span>
      <span slot="Preview" slot-scope="text, record">
        <a type="primary" @click="showModal(record)"> 查看 </a>
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
      v-model="visible"
      on-ok="handleOk"
      :width="1200"
      :height="800"
      :keyboard="true"
      :closable="true"
      :centered="true"
      class="model"
    >
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          关闭
        </a-button>
      </template>
      <p>{{ titled }}</p>
      <div v-html="content"></div>
    </a-modal>
  </a-card>
</template>

<script>
import {
  project_domain,
  project_site,
  project_type,
  project_organization,
  project_paginate,
} from "@/services/bidding";
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
      loading: false,
      visible: false,
      drawervisible: false,
      content: "",
      titled: "",
      type: [],
      domain: [],
      site: [],
      organization: {},
      advanced: false,
      formDialog: false,
      confirmLoading: false,
      loadingsearch: false,
      loadingreset: false,
      status: false,
      searchform: {},
      dataSource: {},
      jsonData: {},
      opinion_status: {
        0: "未开始",
        1: "征集中",
        2: "已结束",
      },
      columns: [
        {
          title: "招投标信息标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titless" },
          ellipsis: true,
        },
        {
          title: "归属地",
          dataIndex: "site",
          align: "center",
          scopedSlots: { customRender: "site" },
          ellipsis: true,
        },
        {
          title: "类型",
          dataIndex: "type",
          align: "center",
          scopedSlots: { customRender: "type" },
          ellipsis: true,
        },
        {
          title: "创建时间",
          dataIndex: "lasttime",
          align: "center",
          scopedSlots: { customRender: "lasttime" },
          ellipsis: true,
        },
        {
          title: "站点",
          dataIndex: "organization",
          align: "center",
          scopedSlots: { customRender: "organization" },
          ellipsis: true,
        },
        {
          title: "域名",
          dataIndex: "domain",
          align: "center",
          scopedSlots: { customRender: "domain" },
          ellipsis: true,
        },
        {
          title: "预览",
          dataIndex: "content",
          align: "center",
          scopedSlots: { customRender: "Preview" },
        },
      ],
      selectedRowKeys: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      draftId: "",
      siteList: [],
      titles: "新增意见",
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
  created() {
    this.init();
    this.list();
  },
  methods: {
    //预览弹窗的显示
    showModal(data) {
      this.visible = true;
      this.titled = data.title;
      this.content = data.content;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
    //跳转页面
    // 点击标题跳转相应的htm页面
    mm(record) {
      window.open(record.url);
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      Promise.all([
        project_type(),
        project_domain(),
        project_site(),
        project_organization(),
      ]).then((res) => {
        this.type = res[0].data.message.data;
        this.domain = res[1].data.message.data;
        this.site = res[2].data.message.data;
        this.organization = res[3].data.message.data;
      });
    },
    list() {
      this.searchloading = true;
      this.loading = true;
      project_paginate(this.searchform)
        .then((res) => {
          this.dataSource = res.data.data;
          this.forwards = res.data.data.forward;
          this.total = res.data.data.total;
          this.searchloading = false;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
          this.loading = false;
        });
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.list();
    },

    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.list();
    },
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    resetForm() {
      this.searchform = {};
      this.list();
    },
  },
  mounted() {},
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
</style>
<style lang="less" scoped>
a{
  color: #00bfff !important;
}
.model p {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin: 20px 60px;
}
.model div {
  height: 600px;
  padding: 0 99px;
  overflow: auto;
}
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
</style>