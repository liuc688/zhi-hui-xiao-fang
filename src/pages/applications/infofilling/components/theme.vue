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
              placeholder="请输入关键词查询"
              v-model="searchform.keyword"
              allowClear
            />
            <!-- <a-select
              placeholder="请输入填报类型查询"
              v-model="searchform.category"
              allowClear
            >
              <a-select-option value="建设审批">建设审批</a-select-option>
              <a-select-option value="安全生产">安全生产</a-select-option>
              <a-select-option value="环保治污">环保治污</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select> -->
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="填报状态"
            :labelCol="{ span: 7 }"
            :wrapperCol="{ span: 16 }"
          >
            <a-select
              placeholder="请选择填报状态查询"
              v-model="searchform.status"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in categorystatuslist"
                :key="index"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="6" :sm="24" :offset="1">
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
          </span>
        </a-col>
      </a-row>
    </a-form-model>

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
    >
      <!-- :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }" -->
      <span slot="action" slot-scope="text, record">
        <a @click="onEnter(record)" style="color: #00aaf0"> 查看详情 </a>
      </span>
      <span slot="answers" slot-scope="text, record">
        <a-tag :color="record.answer == 0 ? 'orange' : 'green'">{{
          record.answer == 0 ? "未填报" : "已填报"
        }}</a-tag>
      </span>
      <span slot="start" slot-scope="text">
        {{ text.substring(0, 10) }}
      </span>
      <span slot="end" slot-scope="text">
        {{ text.substring(0, 10) }}
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
        ref="forms"
      />
    </a-modal>
    <pic-preview
      :file-preview-show="previewShow"
      :img-list="preImages"
      :current-img="currentImg"
      @close="() => (previewShow = false)"
    ></pic-preview>
    <a-modal
      :visible="videopres"
      title="产品视频"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      :closable="false"
      width="70%"
      @cancel="
        () => {
          videopres = false;
          this.activeKey = 0;
        }
      "
    >
      <span slot="footer">
        <a-button @click="cancels">关闭</a-button>
      </span>
      <a-tabs :activeKey="activeKey" @change="changes" tabPosition="right">
        <a-tab-pane v-for="(item, index) in videolist" :key="index">
          <span slot="tab">{{ item.name }} </span>
          <video controls style="width: 100%" :src="item.url"></video>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";
import { form_get } from "@/services/forms";

import PicPreview from "@/components/PicPreview";
import { enterpriselist } from "./data.json";
import { theme_paginate } from "@/services/infofilling";
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
      id: undefined,
      formDialog: false, //弹窗
      confirmLoading: false, //弹窗
      loading: true, //表格
      loadingsearch: false, //查询
      loadingreset: false, //重置
      searchform: {},
      dataSource: {},
      jsonData: {},
      columns: [
        {
          title: "填报标题",
          dataIndex: "title",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "下发日期",
          dataIndex: "start",
          scopedSlots: { customRender: "start" },
        },
        {
          title: "截止日期 ",
          dataIndex: "end",
          scopedSlots: { customRender: "end" },
        },
        {
          title: "填报状态",
          dataIndex: "answers",
          width: "100px",
          align: "center",
          scopedSlots: { customRender: "answers" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "130px",
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
      industry: [
        "批发业",
        "金属制品业",
        "其他制造业",
        "研究和试验发展",
        "科技推广和应用服务业",
        "电气机械和器材制造业",
        "科技推广和应用服务业",
        "医药制造业",
        "仪器仪表制造业",
        "零售业",
      ],
      categorystatuslist: ["未填报", "已填报"],
      enterpriselist,
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
        organizations: [],
        sitelist: [],
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
  created() {
    this.id = this.params.id;
    this.init();
    console.log("this.params", this.params);
  },
  methods: {
    // 增编 提交
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((values) => {
          console.log("values", values);
          this.confirmLoading = true;
          setTimeout(() => {
            this.dataSource.items.push(
              Object.assign(values, { id: this.dataSource.items.length + 1 })
            );
            this.confirmLoading = false;
            this.formDialog = false;
          }, 500);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 编辑
    onEnter(record) {
      console.log("record", record);
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "themedetails",
          params: {
            ids: record.id,
          },
        },
      });
    },
    init() {
      this.searchform = this.params.searchform || this.searchform;
      form_get({ name: "zdxf_products" })
        .then((Response) => {
          this.jsonData = Response.data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    changepage(page, pageSize) {
      console.log(page, pageSize);
      this.pagination.page = page;
      this.pagination.per_page = pageSize;
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },

    loadDataSrouce() {
      this.loading = true;
      theme_paginate(this.searchform)
        .then((Response) => {
          console.log("Response", Response);
          this.dataSource = Response.data.data;
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.loading = false;
          this.loadingsearch = false;
          this.loadingreset = false;
          this.$message.error(err.Response.data.message);
        });
    },
    onSearch() {
      this.loading = true;
      this.loadingsearch = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loadDataSrouce();
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
    // 图片
    previews(record) {
      this.preImages = record.map((item) => item.url);
      this.currentImg = record[0].url;
      this.previewShow = true;
    },
    // 视频
    prevideos(record) {
      console.log(record);
      this.videopres = true;
      this.$nextTick(() => {
        this.videolist = record;
      });
    },
    cancels() {
      this.activeKey = 0;
      this.videopres = false;
    },
    changes(value) {
      this.activeKey = value;
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
// .loading {
//   position: fixed;
//   left: 0;
//   top: 0;
//   width: 100vw;
//   height: 100%;
//   z-index: 990;
//   padding: 45vh 0;
//   background: #ffffff;
// }
// .span_loading {
//   align-items: center;
//   display: block;
// }
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
