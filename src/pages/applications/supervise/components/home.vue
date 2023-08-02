<template>
  <div style="height: 90vh; background: #f1f1f1">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form-model layout="horizontal" :model="searchform" ref="searchform">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="站点"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                v-model="searchform.site"
                placeholder="请选择站点"
                allowClear
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="item in dynamicData.sitelist"
                  :key="item.value"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item
              label="任务类型"
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }"
            >
              <a-select
                v-model="searchform.genre"
                placeholder="请选择任务类型"
                allowClear
              >
                <a-select-option v-for="item in typelist" :key="item.value">{{
                  item.label
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24" style="margin-top: 4px; padding-left: 5%">
            <span>
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
                :loading="searchloadings"
                >查询</a-button
              >
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                :loading="resetloadings"
                style="margin-left: 8px"
                >重置</a-button
              >
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? "收起" : "展开" }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row style="padding: 10px 0px">
        <a-col :span="12" style="text-align: left">
          <a-button type="primary" @click="addOrder()">
            <a-icon type="plus" />
            <span>创建任务</span>
          </a-button>
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
            <a-divider class="clear" type="vertical" />
            <a-popconfirm
              title="确认删除此任务?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="removes(selectedRowKeys)"
            >
              <a href="#" class="clear" v-if="selectedRowKeys.length">删除</a>
            </a-popconfirm>
          </div>
        </a-alert>
      </div>
      <!-- 表格  @change="handleTableChange"-->
      <a-table
        ref="table"
        bordered
        class="table_content"
        size="middle"
        :loading="searchloading"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource.items"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <span slot="genre" slot-scope="text">{{ genre[text] }}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="addOrder(record)" style="color: #40a9ff">编辑</a>
          <a-divider type="vertical" />

          <a @click="todetails(record)" style="color: #40a9ff">查看</a>
        </span>
        <span slot="progress" slot-scope="text, record">
          <a-progress
            style="width: 90%"
            :stroke-color="{
              from: '#108ee9',
              to: '#87d068',
            }"
            :percent="extension(record)"
            status="active"
          />
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
        :total="pagination.total"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      ></a-pagination>
      <!-- 弹窗 -->
      <a-modal
        title="任务增编"
        width="80%"
        :confirm-loading="subloading"
        :visible="orderedit"
        @ok="onEditSubmit()"
        @cancel="
          () => {
            orderedit = false;
            this.$refs.orderforms.reset();
            if (visibles) {
              this.$refs.ordersforms.reset();
            }
          }
        "
      >
        <a-radio-group
          v-model="type"
          :disabled="disabled"
          button-style="solid"
          style="margin-bottom: 20px"
          @change="handleSizeChange"
        >
          <a-radio-button value="1"> 系统任务 </a-radio-button>
          <a-radio-button value="2"> 指派任务 </a-radio-button>
        </a-radio-group>
        <a-spin :spinning="spinning" style="min-height: 500px">
          <k-form-build
            :value="formData"
            :dynamicData="dynamicData"
            ref="orderforms"
            @change="changes"
          />

          <k-form-build
            :value="formsData"
            v-if="visibles"
            :dynamicData="dynamicData"
            ref="ordersforms"
          />
          <a-form-model-item
            label="是否关联映射"
            v-if="mappingswitch"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 14 }"
          >
            <a-switch v-model="mapping" />
          </a-form-model-item>
        </a-spin>
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
  missionlist,
  sites,
  applist,
  channellist,
  insert,
  missiondel,
  finish,
  appoint,
} from "@/services/supervise";

import { form_get } from "@/services/forms";
import { organization_list } from "@/services/organization";

export default {
  data() {
    return {
      type: "1",
      searchloadings: false,
      resetloadings: false,
      searchloading: false, //表格加载
      toggleSearchStatus: false, //搜索项隐藏
      searchform: {}, //搜索表单
      selectedRowKeys: [], //选中数组
      pageSizeOptions: ["10", "20", "30", "40"],
      // current: 1,
      subloading: false, //弹窗提交按钮加载
      columns: [
        {
          title: "任务名称",
          dataIndex: "title",
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: "titles" },
        },
        {
          title: "任务类型",
          dataIndex: "genre",
          width: 130,
          align: "center",
          scopedSlots: { customRender: "genre" },
        },
        {
          title: "站点",
          dataIndex: "site.title",
          align: "center",
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: "site" },
        },
        {
          title: "任务进度",
          dataIndex: "progress",
          align: "center",
          scopedSlots: { customRender: "progress" },
        },
        {
          title: "创建日期",
          dataIndex: "_createtime",
          width: 170,
          align: "center",
          scopedSlots: { customRender: "_createtime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 160,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ], //表格项
      dataSource: [], //表格数据
      orderedit: false, //弹窗显隐
      formData: {}, //自定义表单
      formsData: {}, //自定义表单
      systemData: {}, //系统任务
      fwrwData: {}, //范围任务
      zqrwData: {}, //周期任务
      zdrwData: {}, //指定任务
      status: {
        0: "未完成",
        1: "待审核",
        2: "已审核",
      },
      genre: {
        1: "周期类型",
        2: "时间范围类型",
        3: "指派任务",
      },
      typelist: [
        { value: 1, label: "周期类型" },
        { value: 2, label: "时间范围类型" },
        { value: 3, label: "指派任务" },
      ],
      sitelist: [], //站点列表
      applist: [], //应用列表
      channellists: [], //目录列表
      taskid: "",
      spinning: false,
      visibles: false,
      disabled: false,
      parentslists: [],
      mapping: false,
      mappingswitch: false,
      allsitelist: [],
    };
  },
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    pagination: {
      get() {
        return {
          page: this.dataSource.page || 1,
          per_page: this.dataSource.per_page || 10,
          total: this.dataSource.total || 0,
        };
      },
      set(val) {
        this.dataSource.page = val.page;
        this.dataSource.per_page = val.per_page;
        this.dataSource.total = val.total;
      },
    },
    dynamicData() {
      let result = {
        sitelist: [],
        applist: [],
        parentslist: [],
        channellist: this.channellists,
        // 任务类型
        typelist: [
          { value: 1, label: "周期类型" },
          { value: 2, label: "时间范围类型" },
        ],
        // 周期类型
        periodtype: [
          { value: 1, label: "每周" },
          { value: 2, label: "每月" },
          { value: 3, label: "每季" },
          { value: 4, label: "每年" },
        ],
        // 任务属性
        statuslist: [
          { value: 1, label: "系统任务" },
          { value: 2, label: "指派任务" },
        ],
        scope: {
          1: "今天",
          2: "本周",
          3: "上周",
          4: "本月",
          5: "上月",
        },
      };
      for (let item in this.sitelist) {
        result.sitelist.push({
          value: this.sitelist[item].id,
          label: this.sitelist[item].title,
        });
      }
      for (let item in this.applist) {
        result.applist.push({
          value: this.applist[item].id,
          label: this.applist[item].title,
        });
      }
      for (let item in this.parentslists) {
        result.parentslist.push({
          value: this.parentslists[item].id,
          label: this.parentslists[item].title,
        });
      }
      return result;
    },
  },
  created() {
    this.searchform = this.params.searchform || this.searchform;
    this.init();
  },

  methods: {
    handleSizeChange(e) {
      this.type = e.target.value;
      if (this.type == 1) {
        this.formData = this.systemData;
        this.visibles = false;
        this.$refs.orderforms.reset();
      } else if (this.type == 2) {
        //指派任务
        this.formData = this.zdrwData;
        this.visibles = false;
        this.mappingswitch = false;
        this.$refs.orderforms.reset();
      }
    },
    extension(data) {
      let n = 0;
      n = parseInt(
        ((data._extension.index / data._extension.finish) * 100).toFixed(2)
      );
      return n;
    },
    init() {
      this.$nextTick(() => {
        Promise.all([
          organization_list(), // 获取部门列表
          applist({
            // 获取应用列表
            data: {
              exclude: [
                "organization",
                "config",
                "mapping",
                "username",
                "status",
                "password",
                "salt",
              ],
            },
          }),
          form_get({
            name: "taskcreat", //系统任务
          }),
          form_get({
            name: "zqrw",
          }),
          form_get({
            name: "fwrw",
          }),
          form_get({
            name: "appointed", //指派任务
          }),
        ])
          .then((response) => {
            this.allsitelist = response[0].data.data;
            this.sitelist = response[0].data.data.filter((item) => {
              return item.parent == null;
            });
            this.parentslists = response[0].data.data.filter((item) => {
              return item.parent !== null;
            });
            var lists = response[1].data.data.filter((item) => {
              return (
                item.title == "互动交流" ||
                item.title == "主动公开" ||
                item.title == "依申请公开"
              );
            });
            this.applist = lists;
            this.systemData = response[2].data.data.form; //系统任务
            this.zqrwData = response[3].data.data.form; //周期任务
            this.fwrwData = response[4].data.data.form; //范围任务
            this.zdrwData = response[5].data.data.form; //指派任务
            this.formData = this.systemData;
          })
          .catch((error) => {
            console.log(error);
          });
      });
      this.list();
    },
    changes(key, value) {
      if (value == "genre") {
        if (key == 2) {
          this.visibles = true;
          this.formsData = this.fwrwData;
        } else if (key == 1) {
          this.visibles = true;
          this.formsData = this.zqrwData;
        }
      } else if (value == "site") {
        if (this.type == "1") {
          this.getchannel(key);
        } else if (this.type == "2") {
          this.getsites(key);
        }
      } else if (value == "application") {
        var names = this.applist.filter((item) => {
          return item.title == "主动公开";
        });
        if (key == names[0].id) {
          this.mappingswitch = this.type == "1" ? true : false;
        } else {
          this.mappingswitch = false;
        }
      }
    },
    getsites(id) {
      if (id) {
        this.parentslists = this.allsitelist.filter((item) => {
          return item.parent == id;
        });
      } else {
        this.parentslists = this.allsitelist.filter((item) => {
          return item.parent !== null;
        });
      }
    },
    // 获取目录
    getchannel(id) {
      channellist({
        site: id,
        tree: true,
        exclude: ["site", "forms", "template", "logo", "maps"],
      })
        .then((res) => {
          this.channellists = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onEditSubmit() {
      this.$refs.orderforms
        .getData()
        .then((res) => {
          let ggbd = res;
          if (this.type == "2") {
            let rules = {};
            rules.start = ggbd.date[0].substring(0, 10);
            rules.end = ggbd.date[1].substring(0, 10);
            rules.remark = ggbd.remark;
            this.subloading = true;
            appoint(Object.assign({}, ggbd, { id: this.taskid, rule: rules }))
              .then((res) => {
                this.orderedit = false;
                this.subloading = false;
                this.mappingswitch = false;
                this.mapping = false;
                this.$refs.orderforms.reset();
                this.$message.success("任务创建成功！");
                this.list();
              })
              .catch((err) => {
                this.subloading = false;
                console.log(err);
              });
          } else {
            this.$refs.ordersforms
              .getData()
              .then((ress) => {
                if (ress.date) {
                  ress.start = ress.date[0].substring(0, 10);
                  ress.end = ress.date[1].substring(0, 10);
                }
                ress.mapping = this.mapping;
                if (ress.status) {
                  ggbd.status = ress.status;
                }
                var parems = Object.assign({}, ggbd, {
                  rule: ress,
                  id: this.taskid,
                });
                this.subloading = true;
                insert(parems)
                  .then(() => {
                    this.orderedit = false;
                    this.subloading = false;
                    this.mappingswitch = false;
                    this.mapping = false;
                    this.$refs.orderforms.reset();
                    this.$refs.ordersforms.reset();
                    this.$message.success("任务创建成功！");
                    this.list();
                  })
                  .catch((err) => {
                    this.subloading = false;
                    // this.orderedit = false;
                    console.log(err);
                  });
              })
              .catch((err) => {
                for (var i in err) {
                  this.$message.warning(err[i].errors[0].message);
                }
              });
          }
        })
        .catch((error) => {
          for (var i in error) {
            this.$message.warning(error[i].errors[0].message);
          }
        });
    },
    // 创建任务
    addOrder(record) {
      this.orderedit = true;
      if (record) {
        this.disabled = true;
        this.type = record.status.toString();
        this.taskid = record.id;
        if (record.status == 1) {
          // 系统任务
          this.formData = this.systemData;
          this.visibles = true;
          this.$nextTick(() => {
            this.$refs.orderforms.setData({
              site: record.site.id,
              application: record.application.id,
              genre: record.genre,
              title: record.title,
            });
          });
          if (record.application.title == "主动公开") {
            this.mappingswitch = this.type == "1" ? true : false;
            this.mapping = record.rule.mapping;
          } else {
            this.mappingswitch = false;
            this.mapping = undefined;
          }
          if (record.genre == 1) {
            // 周期类型
            this.formsData = this.zqrwData;
            this.spinning = true;
            channellist({
              site: record.site.id,
              tree: true,
              exclude: ["site", "forms", "template", "logo", "maps"],
            })
              .then((res) => {
                this.channellists = res.data.data;
                this.$nextTick(() => {
                  this.spinning = false;
                  this.$refs.ordersforms.setData({
                    // status: record.status,
                    period: record.rule.period,
                    number: record.rule.number,
                    channel: record.rule.channel,
                    remark: record.rule.remark,
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (record.genre == 2) {
            //时间范围类型
            this.formsData = this.fwrwData;
            this.spinning = true;
            channellist({
              site: record.site.id,
              tree: true,
              exclude: ["site", "forms", "template", "logo", "maps"],
            })
              .then((res) => {
                this.channellists = res.data.data;
                this.$nextTick(() => {
                  this.spinning = false;
                  this.$refs.ordersforms.setData({
                    // status: record.status,
                    date: [record.rule.start, record.rule.end],
                    number: record.rule.number,
                    channel: record.rule.channel,
                    remark: record.rule.remark,
                  });
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else if (record.status == 2) {
          // 指派任务
          this.formData = this.zdrwData;
          this.mappingswitch = false;
          this.visibles = false;
          this.$nextTick(() => {
            this.$refs.orderforms.setData({
              site: record.site.id,
              application: record.application.id,
              appoints: record.appoints,
              title: record.title,
              date: [record.rule.start, record.rule.end],
              remark: record.rule.remark,
            });
          });
          this.getsites(record.site.id);
        }
      } else {
        this.mappingswitch = false;
        this.mapping = false;
        this.disabled = false;
        this.formsData = {};
        this.taskid = "";
      }
    },
    // 删除任务
    removes(data) {
      missiondel({
        data: {
          id: data,
        },
      })
        .then(() => {
          this.list();
          this.onSelectClear();
          this.$message.success("删除成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 页面获取
    list() {
      this.searchloading = true;
      //获取列表数据
      missionlist(this.searchform)
        .then((res) => {
          this.dataSource = res.data.data;
          this.total = res.data.data.length;
          this.searchloading = false;
          this.searchloadings = false;
          this.resetloadings = false;
        })
        .catch((err) => {
          console.log(err);
          this.searchloading = false;
          this.searchloadings = false;
          this.resetloadings = false;
        });
    },
    //查看
    todetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "orderdetails",
          params: {
            data: record,
            searchform: this.searchform,
          },
        },
      });
      // this.$router.push({
      //   path: "/orderdetails",
      //   query: { id: record.id } || this.redirect,
      // });
    },
    // 审核
    examine(record) {
      finish({
        data: {
          status: record.status,
          id: record.id,
        },
      })
        .then(() => {
          this.$message.success("操作完成！");
          this.list();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 选中清空
    onSelectClear() {
      this.selectedRowKeys = [];
    },
    // 查询
    searchQuery() {
      this.searchloadings = true;
      this.list();
    },
    // 重置
    searchReset() {
      this.searchform = {};
      // this.current = 1;
      this.resetloadings = true;
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
      this.list();
    },
    //排序
    // handleTableChange(pagination, filters, sorter) {
    //   if (sorter.order) {
    //     if (sorter.order == "ascend") {
    //       //升序
    //     } else if (sorter.order == "descend") {
    //       //降序
    //     }
    //   } else {
    //     this.list();
    //   }
    // },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
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
.alert {
  margin-bottom: 16px;
}
.alert .message a {
  font-weight: 600;
}
.alert .clear {
  float: right;
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