/* eslint-disable no-undef */
<template>
  <div style="background: #f1f1f1">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-tabs
        type="card"
        size="large"
        :activeKey="card"
        style="padding: 20px"
        tab-position="left"
        @change="callback"
      >
        <a-tab-pane :tab="item.title" v-for="item in statuslist" :key="item.id">
          <div>
            <a-form-model
              layout="horizontal"
              :model="searchform"
              ref="searchform"
            >
              <a-row :gutter="24">
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
                <a-col
                  :md="6"
                  :sm="24"
                  style="margin-top: 4px; padding-left: 5%"
                >
                  <span>
                    <a-button type="primary" @click="searchQuery" icon="search"
                      >查询</a-button
                    >
                    <a-button
                      type="primary"
                      @click="searchReset"
                      icon="reload"
                      style="margin-left: 8px"
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
                    v-if="selectedRowKeys.length"
                    >清空</a
                  >
                  <a class="clear" @click="daochu" v-if="selectedRowKeys.length"
                    >导出</a
                  >
                </div>
              </a-alert>
            </div>
            <!-- 表格 -->
            <a-table
              ref="table"
              bordered
              class="table_content"
              size="middle"
              :loading="searchloading"
              rowKey="id"
              :pagination="false"
              :columns="columns"
              :dataSource="dataSource.items"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
            >
              <span slot="site" slot-scope="record">
                <a-popover placement="topLeft">
                  <template slot="content">
                    <div style="width: 220px">
                      <span v-for="(item, index) in record" :key="index">
                        <a-tag style="margin-top: 5px">{{ item }}</a-tag>
                      </span>
                    </div>
                  </template>
                  <span v-for="(item, index) in record" :key="index">
                    <a-tag>{{ item }}</a-tag>
                  </span>
                </a-popover>
              </span>
              <span slot="action" slot-scope="text, record">
                <div style="text-align: center">
                  <a-button :disabled="false" @click="todetailes(record)"
                    >进入考试</a-button
                  >
                  <a-divider type="vertical"></a-divider>
                  <a-button :disabled="false" @click="modifypaper(record)"
                    >修改试卷</a-button
                  >
                  <a-divider type="vertical"></a-divider>
                  <a-button :disabled="false" @click="todetailexam(record)"
                    >考试排名</a-button
                  >
                </div>
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
              :total="total"
              show-size-changer
              show-quick-jumper
              :show-total="(total) => `共 ${total} 条`"
            ></a-pagination>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import {
  examinations_add,
  examinations_edit,
  examinations_delete,
  examinations_paginate,
  examinees_add,
} from "@/services/knowledge";
import { log } from "@antv/g2plot/lib/utils";
export default {
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    event: {
      type: Function,
    },
  },
  data() {
    return {
      drawervisible: false,
      remarkvisible: false,
      countylist: [],
      drawertitle: "标签管理",
      searchloading: false, //表格加载
      toggleSearchStatus: false, //搜索项隐藏
      searchform: {}, //搜索表单
      selectedRowKeys: [], //选中数组
      pageSizeOptions: ["10", "20", "30", "40"],
      page: 1,
      handlereason: "",
      per_page: 10,
      total: 0,
      card: 1,
      id: "",
      ssss: [],
      datapourlist: [],
      policie: [],
      visibles: false,
      visibless: false,
      exportvisiblehis: false,
      channelForm: {},
      channelFormss: {},
      channelFormPour: {},
      exportChannelForm: {},
      exportobj: {},
      confirmName: "",
      orderactionId: "",
      formData: {},
      orderData: {},
      subloading: false,
      orderedit: false,
      orderaction: false,
      arr: [],
      policieslist: [],
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          ellipsis: true,
          align: "center",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "开始时间",
          dataIndex: "start_time",
          align: "center",
          ellipsis: true,
          scopedSlots: { customRender: "start_time" },
        },
        {
          title: "结束时间",
          dataIndex: "end_time",
          align: "center",
          scopedSlots: { customRender: "end_time" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: "30%",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      datapart: [],
      labellists: [],
      rules: {
        keywords: [{ required: true, message: "请输入关键词" }],
        label: [{ required: true, message: "请选择工单标签" }],
      },
      forwards: true,
      sourceid: "",
      organizations: [],
      statuslist: [
        { id: 1, title: "未开始" },
        { id: 2, title: "正在进行" },
        { id: 3, title: "已结束" },
      ],
      datalist: {},
      numberof: "",
      pageed: 1,
      per_pageed: 10,
      exampaperid: "",
    };
  },
  computed: {
    paginationed: {
      get() {
        return {
          pageed: this.datalist.page || 1,
          per_pageed: this.datalist.per_page || 10,
        };
      },
      set(val) {
        this.datalist.page = val.pageed;
        this.datalist.per_page = val.per_pageed;
      },
    },
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
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {
        modalList: [],
        departments: [],
        labellist: [],
        policielist: [],
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
      };
      for (let item in this.policieslist) {
        result.policielist.push({
          value: this.policieslist[item].id,
          label: this.policieslist[item].title,
        });
      }
      return result;
    },

    dynamicDataed() {
      let result = {
        select_regions: [],
      };
      for (let item in this.countylist) {
        result.select_regions.push({
          value: this.countylist[item]._id,
          label: this.countylist[item].title,
        });
      }
      return result;
    },
  },
  created() {
    this.card = this.params.card ? this.params.card : this.card;
    this.searchform.status = this.card;
    // this.searchform = this.params.searchform
    //   ? this.params.searchform
    //   : this.searchform;
    this.list();
  },
  methods: {
    todetailexam(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "Texamranking",
          params: {
            card: this.card,
            data: item,
          },
        },
      });
    },
    //全部导出
    exportAll() {
      this.exportvisible = true;
    },
    //导出历史
    exportAllhis() {
      this.exportvisiblehis = true;
    },
    //导出历史确定按钮
    exportHandleOkhis() {
      this.exportvisiblehis = false;
    },
    //导出历史取消按钮
    exportHandleCancelhis() {
      this.exportvisiblehis = false;
    },
    // 数据获取
    //校验有无权限显示
    handleactions(dated) {
      const a = this.arr.indexOf(dated);
      if (a > -1) {
        return true;
      } else {
        return false;
      }
    },
    //详情页面
    todetailes(item) {
      examinees_add({ examination: item.id }).then((res) => {
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "info-detail",
            params: {
              exampaperid: res.data.data.id,
              card: this.card,
              data: item,
              pagination: this.pagination,
              searchform: this.searchform,
            },
          },
        });
      });
    },
    modifypaper(item) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "Modify",
          params: {
            card: this.card,
            data: item,
          },
        },
      });
    },
    // 页面获取
    list() {
      this.searchloading = true;
      examinations_paginate(this.searchform)
        .then((res) => {
          this.papertitle = res.data.data.items[0]?res.data.data.items[0].title:"";
          this.dataSource = res.data.data;
          this.total = res.data.data.total;
          this.searchloading = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
        });
    },
    // 选中清空
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    // 查询
    searchQuery() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.per_page = 10;
      this.searchform.status = this.card;
      this.list();
    },
    // 重置
    searchReset() {
      this.searchform = {};
      this.searchform.status = this.card;
      this.list();
    },
    // 选中项
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.per_page = pageSize;
      this.searchform.status = this.card;
      this.list();
    },
    //切换标签页
    callback(key) {
      this.card = key;
      this.searchform = {};
      this.selectedRowKeys = [];
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.per_page = 10;
      this.searchform.status = key;
      this.list();
    },
    //时间查询
    onTimerRangeChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    //查询
    onSearch() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.list();
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
</style>
<style scoped>
a {
  color: #00aaf0 !important;
}
.alert {
  margin-bottom: 16px;
}
.alert .message a {
  font-weight: 600;
}
.alert .clear {
  float: right;
  padding: 0 10px;
}
.table_content {
  margin: 20px 0;
}
.demo-loading {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
/* 标签样式 */
.bq_test {
  padding: 3px 5px;
  border-radius: 3px;
}
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 500px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
<style scoped>
.loadings {
  position: fixed;
  left: 0;
  top: 0;
  display: none;
  width: 100vw;
  height: 100%;
  z-index: 990;
  background: #ffffff99;
}
@media screen and (max-width: 576px) {
  .loadings {
    width: 100%;
  }
}
.span_loading {
  align-items: center;
  display: block;
}
</style>