<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-back-top />
    <a-form-model layout="horizontal" :model="searchform" ref="searchform" style="margin-top:15px">
      <a-row>
        <a-col :md="6" :sm="24">
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
        <a-col :md="6" :sm="24" :offset="1">
          <a-form-model-item
            label="时间范围"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-select
              placeholder="请选择"
              v-model="searchform.scope"
              allowClear
            >
              <a-select-option
                v-for="(item, key) in dynamicData.scope"
                :key="key"
                :value="key"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="6" :sm="24" :offset="1">
            <a-form-model-item
              label="指定日期"
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
        <template v-if="advanced">
          <!-- <a-col :md="8" :sm="24">
            <a-form-model-item
              label="组织部门"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-tree-select
                style="width: 100%"
                show-search
                allow-clear
                v-model="searchform.organization"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="siteList"
                placeholder="请选择搜索站点"
                :replaceFields="{
                  title: 'title',
                  key: 'id',
                  value: 'id',
                }"
                :filterTreeNode="
                  (value, node) => {
                    const data = node.componentOptions.propsData.dataRef;
                    return (
                      data.title.indexOf(value) !== -1 ||
                      data.name.indexOf(value) !== -1
                    );
                  }
                "
              >
                <span
                  slot="title"
                  slot-scope="{ key, value }"
                  style="color: #08c"
                  >Child Node1 {{ value }}</span
                >
              </a-tree-select>
            </a-form-model-item>
          </a-col> -->
        </template>
        <a-col :md="3" :sm="24" :offset="1">
          <span
            style="
              float: left;
              margin-top: 3px;
              display: block;
              margin-bottom: 24px;
              white-space: nowrap;
            "
          >
            <a-button type="primary" :loading="loadingbutton" @click="onSearch"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="resetForm()"
              :loading="loadingreset"
              >重置</a-button
            >
            <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->

          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- 增编 -->
    <a-row style="padding: 10px 0">
      <a-col :span="24" style="text-align: left">
        <a-button style="margin-left:1px" @click="onAdd" v-auth="`survey.add`">
          <a-icon :type="icontype" />新增
        </a-button>
      </a-col>
    </a-row>
    <!-- 
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
            >
            清空
          </a>
          <a-divider type="vertical" />
          
          <a @click="deleteDraft" v-if="this.selectedRowKeys.length > 0">
            删除
          </a> 
         
        </div>
      </a-alert>
    </div> 
    -->
    <!-- 
      去掉了：
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
     -->
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
    >
      <span slot="action" slot-scope="text, record">
        <a @click="onEnter(record)" v-auth="`survey.update`">编辑</a>
      </span>
      <span slot="status" slot-scope="text, record">
        {{ dataFun(record) }}
      </span>
      <span slot="titles" slot-scope="text, record">
        <a @click="onEnter(record)" v-auth="`survey.update`">{{ record.title }}</a>
      </span>
      <span slot="start" slot-scope="text,record">
        {{record.start.substring(0, 10)}}
      </span>
      <span slot="end" slot-scope="text,record">
        {{record.end.substring(0, 10)}}
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
    <!-- <div class="loading" v-if="loadings">
      <a-spin class="span_loading" tip="Loading..." size="large" />
    </div> -->
  </a-card>
</template>
<script>
// import { site_list } from "@/services/opinion";
import { survey_paginate } from "@/services/survey";
import { organization_tree } from "@/services/organization";
import object from "lodash/object";
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
      description: "问卷调查页面",
      searchform: {
        per_page: 10,
        page: 1,
      },
      siteList: [],
      current: 1,
      advanced: false,
      selectedRowKeys: [],
      dataSource: [],
      icontype: "plus",
      loading: false,
      loadings: true,
      loadingreset: false,
      loadingbutton: false,
      total: 1,
      pageSizeOptions: ["10", "20", "30", "40"],
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          align:"center",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "部门",
          dataIndex: "organization.title",
          // width: 150,
          scopedSlots: { customRender: "organization" },
        },
        {
          title: "内容",
          dataIndex: "content",
          // width: 500,
          ellipsis: true,
          scopedSlots: { customRender: "content" },
        },
        {
          title: "开始时间",
          dataIndex: "start",
          scopedSlots: { customRender: "start" },
        },
        {
          title: "结束时间",
          dataIndex: "end",
          scopedSlots: { customRender: "end" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
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
    dynamicData() {
      let result = {
        organizations: [],
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
      };
      return result;
    },
  },
  authorize: {
    onEnter: "survey.update",
    onAdd: "survey.add",
  },
  created() {
    console.log('this.params', this.params)
    this.init();
  },
  methods: {
    init() {
      this.searchform =this.params.searchform ? this.params.searchform : this.searchform
      organization_tree()
        .then((res) => {
          this.siteList = res.data.data;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSearch() {
      this.loadingbutton = true;
      this.loading = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
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
    resetForm() {
      this.loadingreset = true;
      this.loading = true;
      this.searchform = {};
      this.current = 1;
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
      this.loading = true;
      this.searchform.organization = this.params.id ? this.params.id : '';
      survey_paginate(this.searchform)
        .then((res) => {
          this.dataSource = res.data.data;
          this.loading = false;
          this.loadings = false;
          this.loadingreset = false;
          this.loadingbutton = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.loadings = false;
        });
    },
    deleteDraft() {
    },
    onAdd(){
        this.$emit("event", {
        method: "onLink",
        params: {
          route: "survey-details",
          params: {
            id:this.params.id ? this.params.id : '',
            data: {},
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    onEnter(record) {
        this.$emit("event", {
        method: "onLink",
        params: {
          route: "survey-details",
          params: {
            data: record,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
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
a {
  color: #00aaf0 !important;
}
.table_content {
  margin: 5px 0 20px;
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