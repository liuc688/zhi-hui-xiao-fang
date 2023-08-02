<template>
  <div class="main">
    <!-- 任务列表 -->
    <div class="task_list">
      <div class="task_list_title">
        <!-- <div class="list_title">
          任务列表
          <a-icon type="right-circle" />
        </div> -->
        <div class="task_search">
          <a-tree-select
            style="width: 330px; margin-left: 16px; float: left"
            show-search
            multiple
            :maxTagCount="1"
            v-model="searchform.sites"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="sitetree"
            placeholder="请选择查询站点"
            allow-clear
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
              >{{ value }}</span
            >
          </a-tree-select>
          <a-input-search
            placeholder="请输入任务关键词查询"
            allowClear
            v-model="searchform.keyword"
            style="width: 270px; margin-left: 16px; float: left"
            @search="onSearch"
          />
          <a-button
            @click="onSearch"
            type="primary"
            style="margin-left: 16px; float: left"
          >
            查询
          </a-button>

          <a-radio-group
            style="float: right"
            v-model="searchform.types"
            @change="handleSizeChange"
          >
            <a-radio-button value="全部"> 全部 </a-radio-button>
            <a-radio-button value="发布型"> 发布型 </a-radio-button>
            <a-radio-button value="删改型"> 删改型 </a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <a-button type="dashed" class="fabu_task" @click="tasks"
        ><a-icon type="plus" /> 发布任务</a-button
      >
      <!-- 表格 -->
      <a-table
        class="task_table"
        :columns="columns"
        :loading="loading"
        size="middle"
        :rowKey="(record, index) => record._id + index"
        :pagination="false"
        :indentSize="50"
        :dataSource="taskData.items"
      >
        <span slot="status" slot-scope="text, record" class="postsa">
          <div
            style="position: absolute; text-align: left; top: 8px"
            v-if="record.site.parent == null && record.count > 0"
          >
            <span class="sanjiao"></span>
            <span class="shuzi">{{ record.count }}</span>
          </div>
          <a-tag :color="record.compute - 1 >= 0 ? 'green' : 'blue'">
            {{ record.compute - 1 >= 0 ? "已完成" : "未完成" }}
          </a-tag>
        </span>
        <span slot="titles" slot-scope="text, record">
          <div class="table_titles locatoins" @click="todetailes(record)">
            {{ record.title }}
          </div>
          <div class="table_contents" v-if="record.types !== '删改型'">
            {{ record.content }}
          </div>
          <div class="table_contents" v-else>
            {{ '' }}
          </div>
        </span>
        <span slot="progress" slot-scope="text, record">
          <a-progress
            style="padding: 0 10px"
            :percent="record.compute.toFixed(2) * 100"
          />
        </span>
        <span slot="locatoins" slot-scope="text, record">
          <div class="locatoins_s">{{ record.site.title || "" }}</div>
          <div class="locatoins_s">
            {{ "【" + record.channel.title + "】" || "" }}
          </div>
        </span>
        <span slot="_createtime" slot-scope="text, record">
          {{ record._createtime.substring(0, 10) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="#" @click="edts(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="你确定要删除此条数据吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="todeletes(record)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
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
        :total="taskData.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
    </div>
    <!-- 督导编辑 -->
    <a-modal
      title="任务督导"
      width="60%"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
      class="taskSupervisionModal"
    >
      <a-spin :spinning="spinnings" tip="加载中...">
        <k-form-build
          :value="formDatas"
          ref="kcompanyForm"
          :dynamicData="dynamicData"
          @change="changeforms"
        />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import {
  risk_paginate,
  risk_gain,
  risk_edit,
  risk_delete,
  risk_restore,
  risk_children,
} from "@/services/supervision";

import MiniProgress from "@/components/chart/MiniProgress";
import { form_get } from "@/services/forms";
import { channel_list } from "@/services/content";
import { organization_tree } from "@/services/organization";

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
    MiniProgress,
  },

  data() {
    return {
      indentSize: 90,
      selectedRowKeys: [],
      taskList: [],
      spinnings: true,
      searchform: {
        keyword: undefined,
        types: "全部",
      },
      documents: {
        compute: 0,
        degrees: [],
        number: 0,
      },
      riskcount: {
        compute: 0,
        degrees: [],
        number: 0,
      },
      dates: 1,
      size: "0",
      columns: [
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          align: "center",
          width: "160px",
          filters: [
            { text: "已完成", value: 1 },
            { text: "未完成", value: 0 },
          ],
          filterMultiple: false,
        },
        {
          title: "任务标题",
          dataIndex: "title",
          width: "30%",
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "完成进度",
          dataIndex: "progress",
          width: "20%",
          align: "center",
          scopedSlots: { customRender: "progress" },
          filters: [
            {
              text: "升序",
              value: "ascend",
            },
            {
              text: "降序",
              value: "descend",
            },
          ],
          filterMultiple: false,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "任务位置",
          dataIndex: "locatoin",
          width: "25%",
          scopedSlots: { customRender: "locatoins" },
        },
        {
          title: "发布时间",
          dataIndex: "_createtime",
          scopedSlots: { customRender: "_createtime" },
          align: "center",
          width: "100px",
          filters: [
            {
              text: "升序",
              value: "ascend",
            },
            {
              text: "降序",
              value: "descend",
            },
          ],
          filterMultiple: false,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "操作",
          width: "200px",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],

      taskData: {},
      loading: true,
      siteloading: true,
      sitelist: [],
      pageSizeOptions: ["10", "20", "30", "40"],
      indext: 0,
      areaPlot: {},
      indexl: 0,
      areaPlots: {},
      datas: {
        true: 0,
        false: 0,
        total: 0,
      },
      documents_static: true,
      riskcount_static: true,
      current: 1,
      formDatas: {},
      visible: false,
      confirmLoading: false,
      channeltree: [],
      sitetree: [],
      id: undefined,
      formDataes: {},
      formDataese: {},
      typedatas: {},
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    pagination: {
      get() {
        return {
          page: this.taskData.page || 1,
          per_page: this.taskData.per_page || 10,
          total: this.taskData.total || 0,
        };
      },
      set(val) {
        this.taskData.page = val.page;
        this.taskData.per_page = val.per_page;
        this.taskData.total = val.total;
      },
    },
    dynamicData() {
      let result = {
        sitelist: this.sitetree,
        channellist: this.channeltree,
        periodlist: [
          { label: "日", value: 1 },
          { label: "周", value: 2 },
          { label: "月", value: 3 },
          { label: "季", value: 4 },
          { label: "年", value: 5 },
        ],
        superviselist: [
          { label: "是", value: true },
          { label: "否", value: false },
        ],
      };
      return result;
    },
  },
  created() {
    this.searchform = this.params.searchform || this.searchform;
    this.size = this.searchform.delete ? "2" : "0";
    this.init();
  },

  methods: {
    init() {
      // 任务分页
      risk_paginate(this.searchform)
        .then((res) => {
          this.taskData = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      form_get({ name: "supervise_task" })
        .then((res) => {
          this.formDataes = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      organization_tree()
        .then((res) => {
          this.sitetree = res.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
      form_get({ name: "delete_task" })
        .then((respose) => {
          this.formDataese = respose.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 任务点击
    itemsclick(item) {
      console.log("item", item);
    },

    // 任务列表-查询
    handleSizeChange(e) {
      this.size = e.target.value;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
      this.loading = true;
      risk_paginate(this.searchform)
        .then((res) => {
          this.taskData = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    onSearch() {
      this.loadDataSrouce();
    },
    // 分页
    changepage(page, pageSize) {
      this.searchform.page = page;
      this.searchform.per_page = pageSize;
      this.loadDataSrouce();
    },
    loadDataSrouce() {
      this.loading = true;
      risk_paginate(this.searchform)
        .then((res) => {
          this.taskData = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表单改变事件： 站点
    changeforms(key, value) {
      if (value == "site") {
        this.spinning = true;
        channel_list({
          site: key,
          tree: true,
        })
          .then((res) => {
            this.channeltree = res.data.data;
            this.spinning = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (value == "category") {
        if (key == "周期类型") {
          this.$refs.kcompanyForm.show([
            "period",
            "degree",
            "count",
            "taskload",
          ]);
          this.$refs.kcompanyForm.hide(["degrees", "supervise"]);
        } else if (key == "时间类型") {
          this.$refs.kcompanyForm.hide([
            "period",
            "degree",
            "count",
            "taskload",
            "supervise",
          ]);
          this.$refs.kcompanyForm.show(["degrees"]);
        }
      }
    },

    // 发布任务
    tasks() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "releasetask",
          params: {
            menus: ["releasetask"],
          },
        },
      });
    },
    // 弹窗确认按钮
    handleOk() {
      this.$refs.kcompanyForm
        .getData()
        .then((res) => {
          var datas = Object.assign(res, { id: this.id });
          console.log("typedatas", this.typedatas);
          if (this.typedatas.types == "删改型") {
            datas = Object.assign(datas, {
              site: this.typedatas.site,
              channel: this.typedatas.channel,
              category: this.typedatas.category,
              keywords: this.typedatas.keywords,
              taskload: this.typedatas.taskload,
              start: res.start.substring(0, 10),
              end: res.end.substring(0, 10),
            });
          } else {
            if (this.typedatas.category == "周期类型") {
              datas = Object.assign(datas, {
                title: res.name,
              });
            } else {
              // 整理自定义表单中的 degrees 数组，以便于适应接口要求的数据格式
              var tempArraysAdd = [];
              for(let i=0;i<datas.degrees.length;i++) {
                tempArraysAdd.push({start:datas.degrees[i].ranges[0],end:datas.degrees[i].ranges[1]});
              }
              console.log('123456',tempArraysAdd)
              datas.degrees = tempArraysAdd;
              datas = Object.assign(datas, {
                title: res.name,
                // start: res.degrees[0].substring(0, 10),
                // end: res.degrees[1].substring(0, 10),
              });
            }
          }
          this.confirmLoading = true;
          risk_edit(datas)
            .then(() => {
              this.visible = false;
              this.confirmLoading = false;
              this.loadDataSrouce();
            })
            .catch((err) => {
              this.confirmLoading = false;
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    expandedRowRenders(data) {
      console.log("data", data);
      if (data.count > 0 && data.site.parent == null) {
        return true;
      } else {
        return false;
      }
    },
    handleCancel() {
      this.visible = false;
      this.typedatas = {};
      this.$refs.kcompanyForm.reset();
    },
    // 编辑
    edts(record) {
      this.id = record._id;
      risk_gain({ id: record._id })
        .then((res) => {
          this.typedatas = res.data.data;
          console.log("datas", this.typedatas);
          if (this.typedatas.types == "删改型") {
            this.visible = true;
            this.spinnings = true;
            this.formDatas = this.formDataese;
            this.$nextTick(() => {
              this.$refs.kcompanyForm.setData({
                title: this.typedatas.title,
                content: this.typedatas.content,
                start: this.typedatas.start,
                end: this.typedatas.end,
              });
              this.spinnings = false;
            });
          } else {
            this.formDatas = this.formDataes;
            this.visible = true;
            this.spinnings = true;
            if (this.typedatas.category == "周期类型") {
              this.$nextTick(() => {
                this.$refs.kcompanyForm.show([
                  "period",
                  "degree",
                  "count",
                  "action",
                ]);
                this.$refs.kcompanyForm.hide([
                  "degrees",
                  "supervise",
                  "includes",
                  "taskload",
                ]);
                this.$nextTick(() => {
                  this.$refs.kcompanyForm.setData({
                    name: this.typedatas.title,
                    content: this.typedatas.content,
                    site: this.typedatas.site,
                    channel: this.typedatas.channel,
                    category: this.typedatas.category,
                    period: this.typedatas.period,
                    degree: this.typedatas.degree,
                    count: this.typedatas.count,
                    keywords: this.typedatas.keywords,
                    action: this.typedatas.action,
                  });
                  this.spinnings = false;
                });
              });
            } else if (this.typedatas.category == "时间类型") {
              this.$nextTick(() => {
                this.$refs.kcompanyForm.hide([
                  "period",
                  "degree",
                  "count",
                  "supervise",
                  "action",
                  "includes",
                ]);
                this.$refs.kcompanyForm.show(["degrees", "taskload"]);
                // 整理接口中的数据格式 -> 符合自定义表单数据格式要求，以便于回显
                var tempArrays = [];
                for(let i=0;i<this.typedatas.degrees.length;i++) {
                  let ranges = []
                  ranges.push(this.typedatas.degrees[i].start.split(" ")[0]);
                  ranges.push(this.typedatas.degrees[i].end.split(" ")[0]);
                  tempArrays.push({key:i,ranges})
                }
                this.$nextTick(() => {
                  this.$refs.kcompanyForm.setData({
                    name: this.typedatas.title,
                    content: this.typedatas.content,
                    site: this.typedatas.site,
                    channel: this.typedatas.channel,
                    category: this.typedatas.category,
                    keywords: this.typedatas.keywords,
                    taskload: this.typedatas.taskload,
                    // degrees: [this.typedatas.start, this.typedatas.end],
                    degrees:tempArrays
                  });
                  this.spinnings = false;
                });
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 文章编辑
    onEdit(record) {
      let readonly = false;
      // 映射 呈送
      if (record.site._id != this.params.site) {
        readonly = true;
      } else {
        // 抄送
        if (record.islink) {
          readonly = true;
        }
      }
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "edit-documents",
          params: Object.assign({}, record, {
            pagination: this.pagination,
            search: this.search,
            site: this.params.site,
            channel: readonly ? record.parent.id : this.params.channel,
            readonly: readonly,
            siteinfo: this.parents,
            channelData: this.params.channelData,
          }),
        },
      });
    },
    // 任务还原
    restore(record) {
      risk_restore({ id: record._id })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
    },
    // 任务删除
    todeletes(record) {
      risk_delete({ id: record._id })
        .then(() => {
          this.loadDataSrouce();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
    },
    // 任务详情
    todetailes(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: record.types == "删改型" ? "taskdetailes2" : "taskdetailes",
          params: {
            data: record,
            router: "tasklist",
            searchform: this.searchform,
          },
        },
      });
    },
    opens(record, index) {
      console.log(record, index);
      risk_children({ id: record.id, parent: record.parent })
        .then((res) => {
          console.log("res", res);
          // this.taskData.items[index].children = res.data.data;
          var dayas = this.taskData.items;
          var datas = res.data.data;
          datas.unshift(index, 0);
          Array.prototype.splice.apply(dayas, datas);
          console.log("dayas", dayas);
          this.taskData = Object.assign(this.taskData, { items: dayas });
          // this.taskData.items.splice(index, 0, res.data.data )
          console.log("this.taskData.items", this.taskData.items);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    soloede(text, record) {
      console.log("text, record", text, record);
    },
  },
};
</script>

<style scoped>
.task_table >>> .ant-table-body {
  margin: 0 !important;
}

.task_table >>> .ant-table table {
  border-collapse: collapse;
  border-spacing: 0;
}
.task_table >>> .ant-table-thead > tr > th,
.task_table >>> .ant-table-tbody > tr > td,
.task_table >>> .ant-table-tbody > tr {
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
.toop {
  max-width: 500px;
}
.postsa {
  position: relative;
  /* padding-left: 30px; */
}
.sanjiao {
  width: 0;
  height: 0;
  border-top: 35px solid #1890ff;
  border-right: 35px solid transparent;
  border-top: 35px solid #1890ff;
  border-right: 35px solid transparent;
  /* right: 95px; */
  /* top: -16px; */
  float: left;
  margin-top: -35px;
  margin-left: -5px;
}
.shuzi {
  position: absolute;
  left: 0px;
  top: -30px;
  color: #ffffff;
  font-size: 12px;
  width: 20px;
}
/* 任务督导窗口高度固定，超过固定的高度内容可沿 y 轴滚动 */
.taskSupervisionModal >>> .ant-modal-body {
  height: 640px;
  overflow-y: auto;
}
.taskSupervisionModal >>> .ant-form-item {
  padding: 15px;
  box-shadow: #dedede 0 0 5px;
  border-radius: 6px;
}
.taskSupervisionModal >>> .ant-form-item  .ant-form-item {
  /* padding: 15px; */
  padding: 0;
  box-shadow: #fff 0 0 0px;
}
/* 强制设置单元行高度，避免高度坍缩 */
.taskSupervisionModal >>> tr {
  height: 50px !important;
}
</style>
<style scoped lang="less">
.main {
  height: 100%;
  overflow: auto;
  .task_list {
    margin: 24px;
    padding: 28px 24px;
    background: #fff;
    .task_list_title {
      width: 100%;
      clear: both;
      display: inline-block;
      .list_title {
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        color: #000000d9;
        float: left;
        i {
          color: #bfbfbf;
          margin-left: 10px;
        }
      }
      .task_search {
        // float: right;
      }
    }
    .fabu_task {
      width: 100%;
      margin-top: 24px;
      font-size: 14px;
      color: #000000a6;
    }
    .task_table {
      margin: 24px auto 16px;
      a {
        color: #1890ff;
      }
      .table_titles {
        font-size: 15px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.65);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        margin-bottom: 5px;
        cursor: pointer;
      }
      .table_contents {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        min-height: 21px;
      }
      .locatoins {
        font-size: 14px;
        color: #1890ff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        padding: 0 5px;
      }
      .locatoins_s{
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        // padding: 0 5px;
      }
    }
  }
}
</style>
