<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form-model layout="horizontal" :model="searchform" ref="searchform" style="margin-top:17px">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
            label="关键字"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-input
              v-model="searchform.keyword"
              placeholder="请输入查询关键字"
              allowClear
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
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
        <template v-if="advanced">
          <a-col :md="8" :sm="24">
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
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="问政状态"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                placeholder="请选择"
                v-model="searchform.status"
                allowClear
              >
                <a-select-option v-for="(item, index) in status" :key="index">{{
                  item
                }}</a-select-option>
                <!-- <a-select-option value="1">进行中</a-select-option>
                <a-select-option value="2">结束</a-select-option> -->
              </a-select>
            </a-form-model-item>
          </a-col>
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
        <a-col :md="6" :sm="24" :offset="2">
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
              :loading="loadingreset"
              @click="resetForm()"
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
    <!-- 增编 -->
    <a-row style="padding: 10px 0">
      <a-col :span="24" style="text-align: left">
        <a-button style="margin-left:1px" @click="onAdd" v-if="$auth('inquire.add')" v-auth="`inquire.add`">
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
            >清空</a
          >
          <a-divider type="vertical" />
          <a @click="deleteDraft" v-if="this.selectedRowKeys.length > 0">
            删除
          </a> 
        </div>
      </a-alert>
    </div>  
    -->
    <!-- 
      a-table 去掉了：
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    -->
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
      <span slot="action" slot-scope="text, record">
        <a
          @click="onEnter(record)"
          v-if="record.status == 1"
          style="color: #00aaf0"
          v-auth="`inquire.update`"
        >
          编辑
        </a>
        <a-divider type="vertical" v-if="record.status == 1" />
        <a @click="toform(record)" style="color: #00aaf0">查看详情</a>
      </span>
      <span slot="status" slot-scope="text, record">
        {{ status[record.status] }}
      </span>
      <span slot="titles" slot-scope="text, record">
        <a
          @click="onEnter(record)"
          v-auth="`inquire.update`"
          style="color: #00aaf0"
          v-if="record.status == 1"
        >
          {{ record.title }}
        </a>
        <span v-else>{{ record.title }}</span>
      </span>
    </a-table>
    <a-pagination
      size="small"
      style="text-align: right"
      @change="changepage"
      @showSizeChange="changepage"
      :current="pagination.page"
      :pageSize="pagination.per_page"
      :pageSizeOptions="pageSizeOptions"
      :total="dataSource.total"
      show-size-changer
      show-quick-jumper
      :show-total="(total) => `共 ${total} 条`"
    >
    </a-pagination>
    <!-- 增编弹窗 -->
    <a-modal
      class="popUpNotification"
      :title="actionName"
      :maskClosable="false"
      :visible="politicsmodal"
      :width="800"
      :confirm-loading="politicsLoading"
      @ok="politicsHandle"
      @cancel="
        () => {
          politicsmodal = false;
          this.$refs.politicsform.reset();
          this.$refs.politicsforms.resetFields();
        }
      "
    >
      <!-- 拼接表单 -->
      <a-form-model
        ref="politicsforms"
        :model="politicsforms"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="问政标题" prop="title">
          <a-input v-model="politicsforms.title" placeholder="请输入问政标题" />
        </a-form-model-item>
        <a-form-model-item label="组织部门" prop="organization">
          <a-tree-select
            style="width: 100%"
            show-search
            allow-clear
            v-model="politicsforms.organization"
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
            <span slot="title" slot-scope="{ key, value }" style="color: #08c"
              >Child Node1 {{ value }}</span
            >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="起止日期" prop="range">
          <a-range-picker
            show-time
            @change="onChanges"
            date-format="YYYY-MM-DD HH:mm:ss"
            v-model="politicsforms.range"
            style="width: 100%"
          >
          </a-range-picker>
        </a-form-model-item>
      </a-form-model>
      <!-- 自定义表单 -->
      <k-form-build
        :value="jsonData"
        ref="politicsform"
        :config="config"
        :dynamicData="dynamicData"
      />
    </a-modal>
    <!-- <div class="loading" v-if="loadings">
      <a-spin class="span_loading" tip="Loading..." size="large" />
    </div> -->
  </a-card>
</template>
<script>
import { form_get } from "@/services/forms";
import Cookie from "js-cookie";
import { organization_tree } from "@/services/organization";
import {
  inquire_paginate,
  inquire_add,
  inquire_update,
} from "@/services/inquire";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
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
      description: "网络问政",
      searchform: {},
      siteList: [],
      jsonData: {},
      politicsform: {},
      politicsforms: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      previewVisible: false,
      previewImage: "",
      fileList: [],
      politiceId: "",
      advanced: false,
      politicsmodal: false,
      politicsLoading: false,
      loadingsearch: false,
      loadingreset: false,
      loading: true,
      selectedRowKeys: [],
      dataSource: [],
      actionName: "新增",
      icontype: "plus",
      loadings: true,
      total: 1,
      politicsId: "",
      pageSizeOptions: ["10", "20", "30", "40"],
      status: {
        1: "未开始",
        2: "进行中",
        3: "结束",
      },
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "部门",
          dataIndex: "organization.title",
          scopedSlots: { customRender: "organization" },
        },
        {
          title: "描述",
          dataIndex: "describe",
          ellipsis: true,
          scopedSlots: { customRender: "describe" },
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
          title: "问政状态",
          dataIndex: "_extension.status",
          width: 80,
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 150,
          scopedSlots: { customRender: "action" },
        },
      ],
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
          },
        ],
        organization: [
          {
            required: true,
            message: "请选择组织部门",
          },
        ],
        range: [{ required: true, message: "请输入起止时间" }],
      },
      methodes: inquire_update,
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
  },
  created() {
    this.init();
  },
  authorize: {
    onEnter: "inquire.update",
    onAdd: "inquire.add",
  },
  methods: {
    init() {
      this.searchform = this.params.searchform || this.searchform;
      Promise.all([organization_tree(), form_get({ name: "politics_add" })])
        .then((res) => {
          this.siteList = res[0].data.data;
          this.jsonData = res[1].data.data.form;
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
      this.loadingsearch = true;
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      this.loading = true;
      this.searchform.organization = this.params.id?this.params.id:'';
      inquire_paginate(this.searchform)
      .then((res) => {
        this.dataSource = res.data.data;
        this.loadings = false;
        this.loading = false;
        this.loadingsearch = false;
        this.loadingreset = false;
      })
      .catch((err) => {
        this.loadings = false;
        console.log("err", err);
      });
    },
    deleteDraft() {

    },
    resetForm() {
      this.loading = true;
      this.loadingreset = true;
      this.searchform = {};
      this.loadDataSrouce();
    },
    onAdd() {
      this.politicsmodal = true;
      this.politiceId = undefined;
      this.actionName = "新增";
      this.methodes = inquire_add;
      this.$nextTick(() => {
        this.politicsforms = {
          organization: this.params.id ? this.params.id : ''
        };
      });
    },

    onEnter(record) {
      this.politicsmodal = true;
      this.politiceId = record.id;
      this.actionName = "编辑";
      this.methodes = inquire_update;
      console.log(record);
      this.$nextTick(() => {
        this.politicsforms = {
          title: record.title,
          organization: record.organization._id,
          range: [record.start, record.end],
        };
        this.$refs.politicsform.setData({
          // title: record.title,
          // organization: record.organization.id,
          // range: [record.start, record.end],
          describe: record.describe,
          name: record.name,
          avatar: record.avatar,
          introduce: record.introduce,
        });
      });
    },
    onChanges(value, dateString) {
      this.politicsforms.range = [dateString[0], dateString[1]];
    },
    politicsHandle() {
      this.$refs.politicsform
        .getData()
        .then((values) => {
          this.$refs.politicsforms.validate((valid) => {
            if (valid) {
              this.politicsLoading = true;
              var parems = {
                id: this.politiceId,
                title: this.politicsforms.title,
                organization: this.politicsforms.organization,
                start: this.politicsforms.range[0],
                end: this.politicsforms.range[1],
                describe: values.describe,
                name: values.name,
                avatar: values.avatar,
                introduce: values.introduce,
              };
              this.methodes(parems).then(() => {
                this.politicsforms = {};
                this.politicsmodal = false;
                this.politicsLoading = false;
                this.$refs.politicsform.reset();
                this.$message.success("提交成功！");
                this.loadDataSrouce();
              });
            }
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 查看详情
    toform(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "inquire-details",
          params: {
            id:this.params.id?this.params.id:'',
            data: record,
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
  },
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
.toop {
  max-width: 500px;
}
</style>
<style scoped lang="less">
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
<style scoped>
.popUpNotification >>> .ant-modal-body {
  height: 640px;
  overflow: auto;
}
</style>