/* eslint-disable no-undef */
<template>
  <div style="height: 90vh; background: #f1f1f1">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-tabs
        :activeKey="card"
        style="padding: 20px"
        tab-position="left"
        @change="callback"
      >
        <a-tab-pane
          :tab="item.name"
          v-for="item in dynamicData.status"
          :key="item.id"
          :visible="forwards"
        >
          <div>
            <a-form-model
              layout="horizontal"
              :model="searchform"
              ref="searchform"
            >
              <a-row :gutter="24">
                <a-col :md="8" :sm="24">
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
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="工单来源"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      v-model="searchform.source"
                      placeholder="请选择项目"
                      allowClear
                    >
                      <a-select-option
                        v-for="item in dynamicData.sourcelist"
                        :key="item.value"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="部门"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }"
                  >
                    <a-select
                      v-model="searchform.site"
                      placeholder="请选择部门"
                      allowClear
                    >
                      <a-select-option
                        v-for="item in dynamicData.departments"
                        :key="item.value"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col> -->
                <template v-if="toggleSearchStatus">
                  <a-col :md="8" :sm="24">
                    <a-form-model-item
                      label="时间范围"
                      :labelCol="{ span: 5 }"
                      :wrapperCol="{ span: 18, offset: 1 }"
                    >
                      <a-select
                        v-model="searchform.scope"
                        placeholder="请选择时间范围"
                        allowClear
                      >
                        <a-select-option
                          v-for="(item, key) in dynamicData.scope"
                          :key="key"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>

                  <a-col :md="8" :sm="24">
                    <a-form-model-item
                      label="创建日期"
                      :labelCol="{ span: 5 }"
                      :wrapperCol="{ span: 18, offset: 1 }"
                      format="YYYY-MM-DD"
                    >
                      <a-range-picker
                        style="width: 100%"
                        v-model="searchform.rangedata"
                        @change="onChange"
                        allowClear
                      />
                    </a-form-model-item>
                  </a-col>

                  <!-- <a-col :md="8" :sm="24">
                    <a-form-model-item
                      label="工单来源"
                      :labelCol="{ span: 5 }"
                      :wrapperCol="{ span: 18, offset: 1 }"
                    >
                      <a-select
                        v-model="searchform.source"
                        placeholder="请选择项目"
                        allowClear
                      >
                        <a-select-option
                          v-for="item in dynamicData.sourcelist"
                          :key="item.value"
                          >{{ item.label }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col> -->
                </template>
                <a-col
                  :md="8"
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
                    <a @click="handleToggleSearch" style="margin-left: 8px">
                      {{ toggleSearchStatus ? "收起" : "展开" }}
                      <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                    </a>
                  </span>
                </a-col>
              </a-row>
            </a-form-model>
            <a-row style="padding: 10px 0px">
              <a-col :span="12" style="text-align: left">
                <a-space>
                  <a-button
                    type="primary"
                    @click="addOrder()"
                    v-auth="`order.insert`"
                  >
                    <a-icon type="plus" />
                    <span>创建工单</span>
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
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
              <span slot="titles" slot-scope="text, record">
                <a @click="todetails(record)">{{ record.title }}</a>
              </span>
              <span slot="action" slot-scope="text, record">
                <a
                  v-if="record.status == 15 && forwards"
                  @click="actionOrder(record)"
                  v-auth="`order.forward`"
                  >转发</a
                >
                <a v-else @click="todetails(record)">查看</a>
              </span>
              <span slot="keywords" slot-scope="record">
                <a-popover  placement="topLeft">
                  <template slot="content">
                    <div style="width:220px">
                    <span  v-for="(item, index) in record" :key="index">
                      <a-tag style="margin-top:5px">{{ item }}</a-tag>
                    </span>
                    </div>
                  </template>
                  <span v-for="(item, index) in record" :key="index">
                    <a-tag>{{ item }}</a-tag>
                  </span>
                </a-popover>
              </span>
              <span slot="_creator" slot-scope="text">
                {{ text.realname }}
              </span>
              <span slot="label" slot-scope="text">
                <a-tag :color="text.color">{{ text.name }}</a-tag>
              </span>
              <span slot="source" slot-scope="text">
                {{ sourcelists(text) }}
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

      <!-- 弹窗 -->
      <a-modal
        title="工单增编"
        width="80%"
        :confirm-loading="subloading"
        :visible="orderedit"
        @ok="onEditSubmit()"
        @cancel="
          () => {
            orderedit = false;
            this.$refs.orderforms.reset();
            this.$refs.keyforms.resetFields();
            this.keyforms.keywords = [];
          }
        "
      >
        <k-form-build
          :value="formData"
          :dynamicData="dynamicData"

          ref="orderforms"
        />
        <a-form-model ref="keyforms" :model="keyforms" :rules="rules">
          <a-form-model-item
            label="标签"
            prop="label"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 18 }"
          >
            <a-select
              placeholder="请选择工单标签"
              style="width: 100%"
              allow-clear
              v-model="keyforms.label"
            >
              <a-select-option v-for="i in labellists" :key="i.id">
                <a-tag :color="i.color">{{ i.name }}</a-tag>
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            label="关键词"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 18 }"
          >
          <div style="display:block">
            <a-select 
              mode="tags"
              placeholder="请输入有关此申请内容的关键词"
              style="width: 90%;float:left"
              allow-clear
              v-model="keyforms.keywords"
            >
            </a-select>
            <a-button style="float:right" type="primary" @click="changes()">提取关键词</a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 转发  操作 -->
      <a-modal
        title="工单转发"
        width="80%"
        :confirm-loading="subloading"
        :visible="orderaction"
        @ok="orderactionSubmit()"
        @cancel="
          () => {
            orderaction = false;
            $refs.orderactionforms.reset();
          }
        "
      >
        <k-form-build
          :value="orderData"
          ref="orderactionforms"
          :dynamicData="dynamicData"

        />
      </a-modal>
    </a-card>
    <!-- 视频上传中 -->
    <div class="loadings">
      <div style="width: 400px; margin: auto; margin-top: 20%">
        <a-spin class="span_loading" tip="文件上传中..." size="large" />
        <a-progress
          :stroke-color="{
            from: '#108ee9',
            to: '#87d068',
          }"
          :percent="100"
          status="active"
          :showInfo="false"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  pagiante,
  depart,
  insert,
  forward,
  labellist,
  labelall,
  documentkeyword,
  application_list,
  order_import,
} from "@/services/order";
import { project_list as projectlist } from "@/services/project";

import { getform } from "@/services/order";
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
      drawertitle: "标签管理",
      searchloading: false, //表格加载
      toggleSearchStatus: false, //搜索项隐藏
      searchform: {}, //搜索表单
      selectedRowKeys: [], //选中数组
      pageSizeOptions: ["10", "20", "30", "40"],
      page: 1,
      per_page: 10,
      total: 0,
      current: 1,
      card: 15,
      id: "",
      orderactionId: "",
      formData: {},
      orderData: {},
      subloading: false,
      orderedit: false,
      orderaction: false,
      keyforms: {
        keywords: [],
      },
      columns: [
        {
          title: "工单标题",
          dataIndex: "title",
          ellipsis: true,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "创建人",
          dataIndex: "_creator",
          align: "center",
          scopedSlots: { customRender: "_creator" },
        },
        {
          title: "工单来源",
          dataIndex: "source",
          align: "center",
          scopedSlots: { customRender: "source" },
        },
        {
          title: "驳回次数",
          dataIndex: "reject",
          align: "center",
          scopedSlots: { customRender: "reject" },
        },
        {
          title: "标签",
          dataIndex: "label",
          align: "center",
          scopedSlots: { customRender: "label" },
        },
        {
          title: "创建日期",
          dataIndex: "_createtime",
          ellipsis: true,
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "关键词",
          dataIndex: "keywords",
          ellipsis: true,
          scopedSlots: { customRender: "keywords" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
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
    userinfo() {
      return this.$store.getters["account/user"];
    },
    dynamicData() {
      let result = {
        modalList: [],
        departments: [],
        labellist: [],
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
        status: [
          { id: "15", name: "待转发" },
          { id: "25", name: "待处理" },
          { id: "40", name: "处理中" },
          { id: "10", name: "已处理" },
          { id: "0", name: "关闭" },
          { id: "", name: "全部" },
        ],
        sourcelist: [],
      };
      for (let item in this.datapart) {
        result.departments.push({
          value: this.datapart[item].id,
          label: this.datapart[item].title,
        });
      }
      for (let item in this.labellists) {
        result.labellist.push({
          value: this.labellists[item].id,
          label: this.labellists[item].name,
        });
      }
      for (let item in this.sourcelist) {
        result.sourcelist.push({
          value: this.sourcelist[item].id,
          label: this.sourcelist[item].title,
        });
      }
      return result;
    },
  },
  created() {
    this.card = this.params.searchform
      ? this.params.searchform.status.length
        ? this.params.searchform.status[0] + ""
        : ""
      : "15";
    this.searchform.status = this.params.searchform
      ? this.params.searchform.status
      : [15];
    this.searchform = this.params.searchform
      ? this.params.searchform
      : this.searchform;
    this.init();
  },
  authorize: {
    addOrder: "order.insert",
    actionOrder: "order.forward",
    confirmOk: "project.del",
  },
  methods: {
    daochu() {
      order_import({
        orders: this.selectedRowKeys,
      }).then((res) => {
        if (this.selectedRowKeys.length > 1) {
          var name = "打包文件";
          const a = document.createElement("a");
          var bstr = atob(res.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type: "application/x-zip-compressed",
          });
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        } else {
          var name = res.data.data.title;
          const a = document.createElement("a");
          var bstr = atob(res.data.data.data),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], {
            type:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          this.$message.success("操作成功！");
        }
      });
    },
    changes() {
      var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      this.$refs.orderforms
        .getData()
        .then((res) => {
          var paress = {
            text: res.content.replace(re1, "") + "," + res.title, //执行替换成空字符
          };
          documentkeyword(paress)
            .then((res) => {
              this.keyforms.keywords = res.data.data;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 数据获取
    init() {
      // this.searchform.status = [parseInt(this.dynamicData.status[0].id)];
      // var sourceid = this.$store.getters["account/user"].application.filter(
      //   (item) => {
      //     return item.title == "工单管理";
      //   }
      // );
      // this.sourceid = sourceid[0]._id;
      // var sourceid;
      Promise.all([application_list()]).then((res) => {
        this.application_list = res[0].data.data;
        if (!this.application_list) {
          return;
        } else {
          this.sourceid = this.application_list.filter((item) => {
            return item.title == "工单管理";
          })[0].id;
        }

        Promise.all([
          depart({
            exclude: ["workers"],
          }),
          getform({
            name: "workorder",
          }),
          getform({
            name: "forward",
          }),
          labelall(),
          projectlist({
            source: this.sourceid,
          }),
        ]).then((res) => {
          this.datapart = res[0].data.data;
          this.formData = res[1].data.data.form;
          this.orderData = res[2].data.data.form;
          this.labellists = res[3].data.data;
          this.sourcelist = res[4].data.data;
        });
        this.list();
      });
    },

    // 页面获取
    list() {
      if (this.searchform.status[0] == "15") {
        this.searchform.forward = true;
      } else {
        this.searchform.forward = false;
      }

      this.searchloading = true;
      pagiante(this.searchform)
        .then((res) => {
          // this.dataSource = res.data.data.items;
          this.dataSource = res.data.data;
          this.forwards = res.data.data.forward;
          this.total = res.data.data.total;
          this.searchloading = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
        });
    },
    // 创建工单
    addOrder(data) {
      this.orderedit = true;
      var that = this;
      if (data) {
        console.log('data',data);
        this.id = data.id;
        this.$nextTick(() => {
          that.keyforms.keywords = data.keywords;
          that.keyforms.label = data.label;
          that.$refs.orderforms.setData({
            title: data.title,
            content: data.content,
            source: data.source || "",
          });
        });
      } else {
        this.id = undefined;
      }
    },
    // 表单提交
    onEditSubmit() {
      this.$refs.orderforms
        .getData()
        .then((res) => {
          this.$refs.keyforms.validate((valid) => {
            if (valid) {
              this.subloading = true;
              var parems = {
                id: this.id,
                title: res.title,
                content: res.content,
                source: res.project,
                keywords: this.keyforms.keywords,
                label: this.keyforms.label,
              };
              insert(parems)
                .then(() => {
                  this.orderedit = false;
                  this.subloading = false;
                  this.$refs.orderforms.reset();
                  this.$refs.keyforms.resetFields();
                  this.keyforms.keywords = [];
                  this.$message.success("操作完成");
                  this.list();
                })
                .catch((err) => {
                  console.log(err);
                  this.subloading = false;
                });
            } else {
              this.$message.warning("请输入工单标签!");
            }
          });
        })
        .catch((error) => {
          for (var i in error) {
            this.$message.warning(error[i].errors[0].message);
          }
        });
    },
    // 转发
    actionOrder(record) {
      this.orderactionId = record.id;
      this.orderaction = true;
    },
    // 转发提交
    orderactionSubmit() {
      this.$refs.orderactionforms
        .getData()
        .then((res) => {
          this.subloading = true;
          var parems = {
            id: this.orderactionId,
            site: res.depart,
            remark: res.remark,
          };
          forward(parems)
            .then(() => {
              this.orderaction = false;
              this.subloading = false;
              this.$refs.orderactionforms.reset();
              this.list();
              this.$message.success("转发成功！");
            })
            .catch((err) => {
              console.log(err);
              this.subloading = false;
            });
        })
        .catch((error) => {
          console.log("error", error);
          for (var i in error) {
            this.$message.warning(error[i].errors[0].message);
          }
        });
    },

    //查看
    todetails(record) {
      if (record) {
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "orderdetails",
            params: Object.assign({}, record, {
              pagination: this.pagination,
              searchform: this.searchform,
            }),
          },
        });
      } else {
        this.$emit("event", {
          method: "onLink",
          params: {
            route: "orderdetails",
            params: {
              id: undefined,
              pagination: this.pagination,
              searchform: this.searchform,
            },
          },
        });
      }
    },
    // 选中清空
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    // 查询条件-日期转换
    onChange(data, strdate) {
      if (strdate && strdate.length) {
        this.searchform.start = strdate[0];
        this.searchform.end = strdate[1];
      } else {
        this.searchform.start = undefined;
        this.searchform.end = undefined;
      }
    },
    // 查询
    searchQuery() {
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.per_page = 10;
      this.current = 1;
      this.searchform.status = this.card ? [this.card] : [];
      this.list();
    },
    // 重置
    searchReset() {
      this.searchform = {};
      this.current = 1;
      if (this.card == "") {
        this.searchform.status = [];
      } else {
        this.searchform.status = [this.card];
      }
      this.list();
    },
    // 查询框隐藏
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
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
      if (this.card) {
        this.searchform.status = [this.card];
      } else {
        this.searchform.status = [];
      }
      this.list();
    },
    callback(key) {
      this.card = key;
      this.searchform = {};
      this.selectedRowKeys = [];
      this.current = 1;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.per_page = 10;
      // if (this.card) {
      //   this.searchform.status = [key];
      // } else {
      //   this.searchform.status = [];
      // }
      if (key == 15) {
        this.searchform.status = [15];
        this.searchform.forward = true;
      } else if (key == 25) {
        this.searchform.status = [25];
        this.searchform.forward = false;
      } else if (key == 40) {
        this.searchform.status = [40];
        this.searchform.forward = false;
      } else if (key == 10) {
        this.searchform.status = [10];
        this.searchform.forward = false;
      } else if (key == "") {
        this.searchform.status = [];
        this.searchform.forward = false;
      } else if (key == 0) {
        this.searchform.status = [0];
        this.searchform.forward = false;
      }
      // else if(this.card){
      //   console.log(123)
      //   this.searchform.status = [];
      //   this.searchform.forward = false;
      // }
      this.list();
    },
    sourcelists(text) {
      if (text) {
        var title = this.dynamicData.sourcelist.filter((item) => {
          return item.value == text;
        });
        return title.length ? title[0].label : "暂无来源";
      } else {
        return "暂无来源";
      }
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