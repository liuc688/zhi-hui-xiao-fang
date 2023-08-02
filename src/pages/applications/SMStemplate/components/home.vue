<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-back-top />
    <a-form-model layout="horizontal" :model="searchform" ref="searchform">
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
          </span>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- 增编 -->
    <a-space style="margin: 20px auto">
      <a-button type="primary" @click="onAdd" v-auth="`short/template/create`">
        <a-icon :type="icontype" />新增
      </a-button>
      <a-button @click="counts" type="primary">统计图</a-button>
      <a-button
        ><a-checkbox @change="onRecycle" v-model="searchform.delete"
          >回收站</a-checkbox
        ></a-button
      >
    </a-space>
    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div class="message" slot="message">
          已选择&nbsp;
          <a>{{ selectedRowKeys.length }}</a>
          &nbsp;项
          <div class="clear">
            <a @click="onSelectClear" v-if="this.selectedRowKeys.length > 0"
              >清空</a
            >
            <a-divider type="vertical" />
            <a @click="deleteDraft" v-if="this.selectedRowKeys.length > 0"
              >删除</a
            >
          </div>
        </div>
      </a-alert>
    </div>
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
      <span slot="action" slot-scope="text, record">
        <a
          @click="onEnter(record)"
          v-auth="`short/template/edit`"
          v-if="!record._delete"
          >编辑</a
        >

        <a-popconfirm
          title="确定要还原此模板吗?"
          ok-text="确定"
          v-else
          cancel-text="取消"
          v-auth="`short/template/restore`"
          @confirm="restore(record)"
        >
          <a href="#">还原</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此模板吗?"
          ok-text="确定"
          cancel-text="取消"
          v-auth="`short/template/delete`"
          @confirm="confirm(record)"
        >
          <a href="#">删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="gets(record)">详情</a>
      </span>
      <span slot="dc" slot-scope="text, record">
        <a-tag :color="record.dc == 15 ? 'blue' : 'cyan'">{{
          record.dc == 15 ? "中文" : "UCS2"
        }}</a-tag>
      </span>
      <span slot="tf" slot-scope="text, record">
        <a-tag :color="record.tf == 3 ? 'blue' : 'cyan'">{{
          record.tf == 3 ? "UTF-8" : "GBK"
        }}</a-tag>
      </span>
      <span slot="rf" slot-scope="text, record">
        <a-tag :color="record.rf == 2 ? 'blue' : 'cyan'">{{
          record.rf == 2 ? "JSON" : "XML"
        }}</a-tag>
      </span>

      <span slot="rd" slot-scope="text, record">
        <a-tag :color="record.rd ? 'green' : 'orange'">{{
          record.rd ? "需要" : "不需要"
        }}</a-tag>
      </span>
      <span slot="_modifier" slot-scope="text, record">
        <a-tag color="#108ee9">{{
          record._modifier.length ? record._modifier[0].realname : ""
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
      width="50%"
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
      <k-form-build :value="jsonData" ref="forms" />
    </a-modal>
    <a-modal
      width="60%"
      :closable="false"
      :visible="datasvisible"
      :maskClosable="false"
      title="短信发送统计图"
    >
      <span slot="footer">
        <a-button @click="datasCancels">关闭</a-button>
      </span>
      <a-spin tip="Loading..." :spinning="spinning">
        <div v-if="database.length">
          <div id="paod"></div>
        </div>
        <div v-else class="database_s">暂无数据</div>
      </a-spin>
    </a-modal>
  </a-card>
</template>
<script>
import {
  short_paginate,
  short_create,
  short_edit,
  short_restore,
  short_delete,
  short_count,
} from "@/services/SMStemplate";
import { form_get } from "@/services/forms";
import { Line } from "@antv/g2plot";
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
      description: "短信模板管理页面",
      searchform: {
        per_page: 10,
        page: 1,
        delete: false,
      },
      current: 1,
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
          title: "签名",
          dataIndex: "singnature",
          ellipsis: true,
          width: "160px",
          scopedSlots: { customRender: "singnature" },
        },
        {
          title: "内容类型",
          dataIndex: "dc",
          align: "center",
          scopedSlots: { customRender: "dc" },
        },
        {
          title: "内容编码",
          dataIndex: "tf",
          align: "center",

          scopedSlots: { customRender: "tf" },
        },
        {
          title: "返回格式",
          dataIndex: "rf",
          align: "center",
          scopedSlots: { customRender: "rf" },
        },
        {
          title: "是否需要状态报告",
          dataIndex: "rd",
          align: "center",
          scopedSlots: { customRender: "rd" },
        },
        {
          title: "创建时间",
          dataIndex: "_createtime",
          align: "center",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "最后修改时间",
          dataIndex: "_modifytime",
          align: "center",
          scopedSlots: { customRender: "_modifytime" },
        },
        {
          title: "最后修改人员",
          dataIndex: "_modifier",
          align: "center",
          scopedSlots: { customRender: "_modifier" },
        },
        {
          title: "已发送条数",
          dataIndex: "count",
          align: "center",
          scopedSlots: { customRender: "count" },
        },
        {
          title: "内容模板",
          dataIndex: "sm",
          ellipsis: true,
          scopedSlots: { customRender: "sm" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 160,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      titles: "模板新增",
      confirmLoading: false,
      formDialog: false,
      jsonData: {},
      methis: undefined,
      smsid: undefined,
      datasvisible: false,
      spinning: false,
      database: [],
      stackedColumnPlot: {},
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
    onEnter: "short/template/edit",
    onAdd: "short/template/create",
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.searchform = this.params.searchform
        ? this.params.searchform
        : this.searchform;
      form_get({ name: "sms_templates" })
        .then((res) => {
          this.jsonData = res.data.data.form;
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    onSearch() {
      this.loading = true;
      this.loadingbutton = true;
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
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      this.loading = true;
      short_paginate(this.searchform)
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
      var that = this;
      this.$confirm({
        title: "删除短信模板",
        content: "确定要删除选中的模板吗？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          short_delete({ ids: that.selectedRowKeys })
            .then((res) => {
              that.$message.success(res.data.message);
              that.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
              that.$message.error(err.response.data.message);
            });
        },
      });
    },
    onRecycle() {
      this.loading = true;
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.loadDataSrouce();
    },
    onAdd() {
      this.formDialog = true;
      this.smsid = undefined;
      this.methis = short_create;
      this.$nextTick(() => {
        this.$refs.forms.reset();
      });
    },
    onEnter(record) {
      this.formDialog = true;
      this.smsid = record.id;
      this.methis = short_edit;
      this.$nextTick(() => {
        this.$refs.forms.setData({
          singnature: record.singnature,
          un: record.un,
          pw: record.pw,
          dc: record.dc.toString(),
          tf: record.tf.toString(),
          rf: record.rf.toString(),
          rd: record.rd.toString(),
          sm: record.sm,
        });
      });
    },
    confirm(record) {
      short_delete({ ids: [record.id] })
        .then((res) => {
          this.$message.success(res.data.message);
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    gets(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "in-detailes",
          params: {
            id: record.id ? record.id : "",
            searchform: Object.assign(this.searchform, this.pagination),
          },
        },
      });
    },
    restore(record) {
      short_restore({ ids: [record.id] })
        .then((res) => {
          this.$message.success(res.data.message);
          this.loadDataSrouce();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    onSubmit() {
      this.$refs.forms
        .getData()
        .then((res) => {
          var dats = Object.assign(res, {
            id: this.smsid,
            dc: parseInt(res.dc),
            tf: parseInt(res.tf),
            rf: parseInt(res.rf),
            rd: parseInt(res.rd),
          });
          this.methis(dats)
            .then((res) => {
              this.formDialog = false;
              this.loadDataSrouce();
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    counts() {
      this.datasvisible = true;
      this.spinning = true;
      this.$nextTick(() => {
        short_count()
          .then((response) => {
            this.database = response.data.data;
            this.$nextTick(() => {
              this.getselects(this.database);
            });
          })
          .catch((err) => {
            console.log("err", err);
            this.$message.error(err.response.data.message);
          });
      });
    },
    getselects(data) {
      this.spinning = false;
      this.stackedColumnPlot = new Line("paod", {
        data: data,
        padding: "auto",
        xField: "_id",
        yField: "count",
        label: {},
        point: {
          size: 5,
          shape: "diamond",
          style: {
            fill: "white",
            stroke: "#5B8FF9",
            lineWidth: 2,
          },
        },
        tooltip: { showMarkers: false },
        state: {
          active: {
            style: {
              shadowBlur: 4,
              stroke: "#000",
              fill: "red",
            },
          },
        },
        appendPadding: [26, 8, 26, 8],
      });
      this.stackedColumnPlot.render();
    },
    //
    datasCancels() {
      this.datasvisible = false;
      this.stackedColumnPlot.destroy();
      this.stackedColumnPlot = new Object();
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
  margin: 20px 0;
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
#paod {
  height: 400px;
}
</style>