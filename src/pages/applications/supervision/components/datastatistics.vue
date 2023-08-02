<template>
  <div class="main">
    <!-- 警告提示 -->
    <div class="alert">
      <a-alert type="info" show-icon>
        <div slot="message">
          {{ "数据更新于" + time }}
          <a class="clear" @click="resets"
            >立即更新 <a-icon type="reload" />
          </a>
        </div>
      </a-alert>
    </div>
    <!-- 督导任务报告 -->
    <div class="task_reports"></div>

    <!-- 任务占比/站点统计 -->
    <div class="centers">
      <div class="tasks">
        <a-card class="a_cards">
          <span slot="title" class="tasks_title"> 任务占比 </span>
          <a-row :gutter="24">
            <a-col :span="12">
              <div id="piees" style="height: 330px"></div>
            </a-col>
            <a-col :span="12">
              <div style="padding: 0 10%">
                <div class="datas_title">
                  总体完成度
                  <a-tooltip
                    title="总体完成度根据 已完成任务量/任务总量"
                    slot="action"
                  >
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </div>
                <div class="numbers">
                  {{
                    ((datas.true / (datas.false + datas.true)) * 100).toFixed(
                      2
                    )
                  }}%
                </div>
                <mini-progress
                  :target="100"
                  :percent="
                    ((datas.true / (datas.false + datas.true)) * 100).toFixed(2)
                  "
                  class="mini-progresses"
                  color="#13C2C2"
                  height="12px"
                />
                <div class="badges">
                  <a-badge color="#3BA0FF" text="未完成" />
                  <a-divider type="vertical" />
                  <span class="percentage"
                    >{{
                      (
                        (datas.false / (datas.false + datas.true)) *
                        100
                      ).toFixed(2)
                    }}%
                  </span>
                  <span class="datas_num"> {{ datas.false }} 个</span>
                </div>
                <div class="badges">
                  <a-badge color="#4DCB73" text="已完成" />
                  <a-divider type="vertical" />
                  <span class="percentage"
                    >{{
                      ((datas.true / (datas.false + datas.true)) * 100).toFixed(
                        2
                      )
                    }}%
                  </span>
                  <span class="datas_num"> {{ datas.true }} 个</span>
                </div>
                <!-- 任务文章数 -->
                <div class="artics">
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <div class="artics_title">任务所需文章</div>
                      <div class="artics_num">
                        {{ datas.taskload }} <span>篇</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="artics_title">已发文章</div>
                      <div class="artics_num">
                        {{ datas.finish }} <span>篇</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </div>
      <div class="datas">
        <a-card class="a_cards">
          <span slot="title" class="tasks_title">
            站点统计
            <!-- <a href="#"><a-icon type="right-circle" /></a> -->
          </span>
          <a-table
            class="task_table"
            :columns="sitecolumns"
            :loading="siteloading"
            size="small"
            rowKey="id"
            bordered
            @change="changes"
            :pagination="{ pageSize: 6, showQuickJumper: true }"
            :dataSource="sitelist"
          >
            <span slot="rowIndex" slot-scope="text, record, index">
              {{ index + 1 + (current - 1) * 6 }}
            </span>
            <span slot="titlees" slot-scope="text, record" class="table_title">
              <a href="javascript:;" @click="tositedetails(record)">{{
                record.title
              }}</a>
            </span>
            <span slot="finishes" slot-scope="text, record">
              <span>{{ (record.finish * 100).toFixed(2) }}%</span>
            </span>
            <span slot="compute" slot-scope="text, record">
              <span>{{ record.compute.toFixed(2) }}%</span>
            </span>
          </a-table>
        </a-card>
      </div>
    </div>
    <!-- 任务量 -->
    <div class="task_volume">
      <a-card class="a_cards">
        <span slot="title" class="tasks_title"> 周期任务量 </span>
        <span slot="extra">
          <a-space :size="24">
            <a
              v-for="(items, index) in datelist"
              :key="items.id"
              :class="dates == index + 1 ? 'active ' : ''"
              @click="clicks(items)"
              >{{ items.name }}</a
            >
          </a-space>
        </span>
        <div id="finish_site" class="finish_site"></div>
      </a-card>
    </div>
    <!-- 站点完成统计 -->
    <div class="site_finish">
      <!-- <a-select
        show-search
        placeholder="请选择站点查询"
        option-filter-prop="children"
        style="width: 270px; float: right"
        :filter-option="filterOption"
        v-model="finishedes"
      >
        <a-select-option v-for="item in finished_sitelist" :key="item._id">
          {{ item.title }}
        </a-select-option>
      </a-select> -->

      <a-tree-select
          show-search
          style="width: 270px; float: right"
          v-model="finishedes"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="sitetree"
          placeholder="请选择站点查询"
          :replaceFields="{
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
      </a-tree-select>


      <div class="Task_volumes">
        <a-tabs :activeKey="finishedes" @change="callback">
          <a-tab-pane v-for="temp in finished_sitelist" :key="temp._id">
            <div slot="tab">
              <a-row :gutter="1">
                <a-col :span="12">
                  <div class="titles">{{ temp.title }}</div>
                  <div class="titles_">完成度</div>
                  <div class="title_s">
                    {{ (temp.count * 100).toFixed(2) }}%
                  </div>
                </a-col>
                <a-col :span="12">
                  <a-progress
                    type="circle"
                    stroke-linecap="square"
                    :strokeWidth="16"
                    color="#1890FF"
                    :percent="temp.count * 100"
                  />
                </a-col>
              </a-row>
            </div>
            <div></div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="Lines" id="Lines"></div>
    </div>
  </div>
</template>
<script>
import {
  event_paginate,
  event_document,
  risk_count,
  risk_paginate,
  risk_site,
  risk_finish,
  risk_site_count,
  risk_site_finish,
  risk_finish_site,
  risk_finished_site,
  risk_taskload,
} from "@/services/supervision";
import { organization_tree } from "@/services/organization"

import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import Trend from "@/components/chart/Trend";
import { Pie, Column, Line } from "@antv/g2plot";
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
    MiniArea,
    MiniBar,
    MiniProgress,
    Trend,
  },
  watch: {
    finishedes: {
      handler(val) {
        console.log("val", val);
        this.Lineschanghes();
      },
      deep: true,
    },
  },

  data() {
    return {
      // time: "2022年12月16日",
      sitecolumns: [
        {
          title: "排名",
          dataIndex: "rowIndex",
          key: "rowIndex",
          align: "center",
          width: 80,
          scopedSlots: { customRender: "rowIndex" },
        },
        {
          title: "站点名称",
          dataIndex: "title",
          scopedSlots: { customRender: "titlees" },
        },
        {
          title: "当前任务量",
          dataIndex: "taskload",
          align: "center",
          width: "23%",
          sorter: true,
        },
        {
          title: "完成度",
          dataIndex: "finish",
          align: "center",
          scopedSlots: { customRender: "finishes" },
          width: "19%",
          sorter: true,
        },
        {
          title: "周涨幅",
          align: "center",
          dataIndex: "compute",
          scopedSlots: { customRender: "compute" },
          width: "19%",
          sorter: true,
        },
      ],
      siteloading: true,
      sitelist: [],
      current: 1,
      piePlot: {},
      index: 0,
      indext: 0,
      datas: {},
      activeKey: 1,
      dates: 3,
      datelist: [
        { id: 1, name: "本周", title: "天" },
        { id: 2, name: "本月", title: "周" },
        { id: 3, name: "全年", title: "月" },
      ],
      finishsitelist: [],
      stackedColumnPlot: {},
      finished_sitelist: [],
      finishedes: undefined,
      lineDatas: [],
      Linesdata: {},
      sitetree:[]
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    time() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      return year + "年" + month + "月" + day + "日";
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
  },
  created() {
    this.searchform = this.params.searchform || this.searchform;
    this.init();
  },

  methods: {
    resets() {
      this.siteloading = true;
      this.init();
    },
    init() {
      // 站点分页
      risk_site()
        .then((res) => {
          this.sitelist = res.data.data;
          this.siteloading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      // 任务占比
      Promise.all([
        risk_site_count(),
        risk_site_finish(),
        risk_finish_site({ category: this.dates }),
      ])
        .then((res) => {
          this.index++;
          this.pieplot(res[0].data.data);
          this.datas = res[1].data.data;
          this.finishsitelist = res[2].data.data;
          this.Columns();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });

        organization_tree().then(res=>{
          console.log('res', res)
          this.sitetree = res.data.data;
        }).catch(err=>{
          console.log(err)
          this.$message.error(err.response.data.message)
        })

      risk_finished_site()
        .then((res) => {
          this.finished_sitelist = res.data.data;
          this.finishedes = this.finished_sitelist[0]._id;
          risk_taskload({ site: this.finishedes })
            .then((response) => {
              this.indext++;
              this.lineDatas = response.data.data;
              this.Lines();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    Lines() {
      if (this.indext == 1) {
        this.Linesdata = new Line("Lines", {
          data: this.lineDatas,
          xField: "create",
          yField: "value",
          seriesField: "type",
          label: false,
          // smooth: true,
          legend: {
            // layout: "vertical",
            position: "top-right",
          },
          yAxis: {
            label: {
              // 数值格式化为千分位
              formatter: (v) =>
                `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
          },
        });
        this.Linesdata.render();
      } else {
        this.Linesdata.update({
          data: this.lineDatas,
        });
      }
    },
    Columns() {
      if (this.index == 1) {
        this.stackedColumnPlot = new Column("finish_site", {
          data: this.finishsitelist,
          isStack: true,
          xField: "create",
          yField: "value",
          seriesField: "type",
          legend: false,
          color: ["#cccccc", "#1890ff", "#51C419", "#F5222D"],
          label: false,
          maxColumnWidth: 42,
          // label: {
          //   // 可手动配置 label 数据标签位置
          //   position: "middle", // 'top', 'bottom', 'middle'
          //   // 可配置附加的布局方法
          //   layout: [
          //     // 柱形图数据标签位置自动调整
          //     { type: "interval-adjust-position" },
          //     // 数据标签防遮挡
          //     { type: "interval-hide-overlap" },
          //     // 数据标签文颜色自动调整
          //     { type: "adjust-color" },
          //   ],
          // },
        });
        this.stackedColumnPlot.render();
      } else {
        this.stackedColumnPlot.update({
          data: this.finishsitelist,
        });
      }
    },
    // 圆环图-状态
    pieplot(data) {
      if (this.index == 1) {
        this.piePlot = new Pie("piees", {
          appendPadding: 30,
          data,
          angleField: "count",
          colorField: "title",
          radius: 1,
          height: 330,
          innerRadius: 0.8, //环形宽比
          content: "{percentage}",
          color: [
            "#3aa1ff",
            "#36cbcb",
            "#4ecb73",
            "#fbd437",
            "#f2637b",
            "#975fe5",
          ],
          label: false,
          // label: {
          //   type: "inner",
          //   offset: -20,
          //   offsetX: -5,
          //   autoRotate: false, //显示文字旋转
          //   content: "{value}", //显示文字内容
          //   style: {
          //     fill: "#000000",
          //     fontSize: 18,
          //     stroke: "#ffffff",
          //     lineWidth: 2,
          //   },
          // },
          legend: false,
          statistic: {
            title: {
              offsetY: 0,
              style: {
                fontSize: 20,
                whiteSpace: "normal",
              },
              formatter: (datum) => (datum ? datum.title : "总计"),
            },
            content: {
              offsetY: 10,
              style: {
                fontSize: 30,
              },
              formatter: (datum, data) =>
                datum
                  ? `${datum.count}`
                  : `${data.reduce((r, d) => r + d.count, 0)}`,
            },
          },
          // 添加 中心统计文本 交互
          // interactions: [{ type: "pie-statistic-active" }],
          interactions: [
            { type: "element-selected" },
            { type: "element-active" },
            { type: "pie-statistic-active" },
          ],
        });
      }
      this.piePlot.render();
    },
    Lineschanghes() {
      risk_taskload({ site: this.finishedes })
        .then((response) => {
          this.indext++;
          this.lineDatas = response.data.data;
          this.Lines();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changes(e, filters, sorter) {
      this.current = e.current;
      if (sorter.field) {
        if (sorter.order == "ascend") {
          // 上升
          this.sort_s(this.sitelist, sorter.field);
        } else if (sorter.order == "descend") {
          // 下降
          this.sort_y(this.sitelist, sorter.field);
        } else {
          // 站点分页
          risk_site()
            .then((res) => {
              this.sitelist = res.data.data;
              this.siteloading = false;
            })
            .catch((err) => {
              console.log(err);
              this.$message.error(err.response.data.message);
            });
        }
      } else {
        console.log(sorter);
      }
    },
    // 升序
    sort_s(array, name) {
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          if (array[i][name] > array[j][name]) {
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
          }
        }
      }
      return array;
    },
    // 降序
    sort_y(array, name) {
      for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
          if (array[i][name] < array[j][name]) {
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
          }
        }
      }
      return array;
    },
    callback(e) {
      this.finishedes = e;
    },
    clicks(items) {
      this.dates = items.id;
      risk_finish_site({ category: this.dates })
        .then((res) => {
          this.finishsitelist = res.data.data;
          this.index++;
          this.Columns();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    tositedetails(record) {
      console.log("record", record);
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "sitedetails",
          params: {
            site: record._id,
            router: "datastatistics",
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.task_table {
  border-right: none !important;
  border-left: none !important;
}
.task_table >>> .ant-table-thead > tr > th,
.task_table >>> .ant-table-tbody > tr > td,
.task_table >>> .ant-table-tbody > tr {
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
.task_volume >>> .ant-tabs-bar {
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 0 32px !important;
}

.Task_volumes >>> .ant-progress-text {
  display: none;
}
.Task_volumes >>> .ant-tabs-tab {
  opacity: 0.5;
}
.Task_volumes >>> .ant-tabs-tab-active {
  opacity: 1;
}
.Task_volumes >>> .ant-tabs-bar {
  border-bottom: 1px solid #f0f0f0 !important;
}
</style>
<style scoped lang="less">
.main {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 12px 24px;
  .alert {
    .clear {
      float: right;
      color: #1890ff !important;
      i {
        margin: auto 9px auto 5px;
      }
    }
  }
  .task_reports {
    height: 160px;
    background-image: url("../images/tops.png");
    background-size: 100% 100%;
  }

  .centers {
    a {
      color: #00aaf0 !important;
    }
    display: flex;
    .a_cards {
      width: 100%;
      height: 400px;
      overflow: hidden;
      .datas_title {
        font-size: 14px;
        text-align: left;
        margin: 24px 0 8px;
        color: rgba(0, 0, 0, 0.45);
      }
      .numbers {
        font-size: 30px;
        font-family: PingFang SC;
        text-align: left;
        color: #000000d9;
      }
      .badges {
        font-size: 14px;
        color: #000000a6;
        margin: 12px auto;
        .ant-badge {
          margin-right: 15%;
        }
        .percentage {
          font-size: 14px;
          color: #00000073;
        }
        .datas_num {
          float: right;
          font-size: 14px;
          color: #000000a6;
        }
      }
      .artics {
        margin: 30px 0;
        .artics_title {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          text-align: left;
          color: rgba(0, 0, 0, 0.45);
          margin: 9px auto;
        }
        .artics_num {
          font-size: 24px;
          font-family: HelveticaNeue;
          text-align: left;
          color: rgba(0, 0, 0, 0.85);
          span {
            font-size: 16px;
            font-family: PingFangSC-Regular;
            text-align: left;
            color: rgba(0, 0, 0, 0.65);
            margin-left: 6px;
          }
        }
      }
      .mini-progresses {
        margin-bottom: 20px;
      }
    }
    .tasks {
      width: calc(50% - 12px);
      margin: 24px 12px 24px 0px;
      background: #fff;
    }
    .datas {
      width: calc(50% - 12px);
      margin: 24px 0px 24px 12px;
      background: #fff;

      .task_table {
        margin: 16px auto;

        .table_title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          // color: #1890ff !important;
        }
      }
    }
    .tasks_title {
      font-size: 16px;
      font-weight: 500;
      color: #000000d9;
      i {
        color: #bfbfbf;
        margin-left: 12px;
      }
    }
  }
  .task_volume {
    background: #fff;
    .active {
      color: #1890ff;
    }
    .finish_site {
      height: 295px;
    }
  }
  .site_finish {
    background: #fff;
    margin: 24px auto;
    width: 100%;
    padding: 24px;
    .Task_volumes {
      margin: 50px auto 20px;
      .ant-tabs {
        width: 100% !important;
        .ant-row {
          width: 260px !important;
        }
        .ant-tabs-tab-active {
          .titles {
            color: #1890ff;
          }
        }
      }
      .titles {
        white-space: break-spaces;
        font-size: 16px;
        text-align: left;
        color: rgba(0, 0, 0, 0.65);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .titles_ {
        font-size: 14px;
        text-align: left;
        margin: 20px auto 10px;
        color: rgba(0, 0, 0, 0.45);
      }
      .title_s {
        font-size: 24px;
        text-align: left;
        color: rgba(0, 0, 0, 0.45);
        // margin: 20px auto 0;
      }
    }
    .Lines {
      height: 400px;
      margin: 20px auto;
    }
  }
}
</style>
