<template>
  <div class="main">
    <!-- 头 -->
    <div class="main_headers">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item
          ><a href="javascript:;">工作督导平台</a></a-breadcrumb-item
        >
      </a-breadcrumb>
      <div style="display: flex">
        <div class="header_left">
          <img v-if="userinfo.avatar.url" :src="userinfo.avatar.url" alt="" />
          <a-avatar v-else icon="user" :size="72" />
          <div class="header_left_title">
            <div class="titles">{{ userinfo.realname }}</div>
            <div class="faburenwu" @click="tasks">发布任务</div>
          </div>
        </div>
        <div class="header_right">
          <div class="items">
            总任务量
            <div>{{ datas.total }}</div>
          </div>
          <a-divider type="vertical" />
          <div class="items">
            未完成任务
            <div>{{ datas.false }}</div>
          </div>
          <a-divider type="vertical" />
          <div class="items">
            已完成任务
            <div>{{ datas.true }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 任务动态 / 数据统计 -->
    <div class="centers">
      <div class="tasks">
        <a-card class="a_cards">
          <span slot="title" class="tasks_title">
            任务动态
            <a><a-icon @click="taskavtive" type="right-circle" /></a>
          </span>
          <a slot="extra" href="#">
            <a-icon type="reload" @click="listresets" />
          </a>
          <a-spin tip="Loading..." :spinning="spinning">
            <a-list item-layout="horizontal" :data-source="taskList">
              <a-list-item
                slot="renderItem"
                slot-scope="item"
                class="items_list"
              >
                <a-list-item-meta>
                  <div slot="title" href="#" class="overflows">
                    <div v-if="item.category == '更新'">
                      <span>{{ item.site ? item.site.title : "" }}</span>
                      <span v-if="item.finish"> 完成</span>
                      <span v-else> {{ item.category }} </span>
                      <span>
                        {{ item.risk ? item.risk.title : "" }}
                      </span>
                      任务
                    </div>
                    <div v-else>
                      <span>{{
                        item._creator ? item._creator.username : ""
                      }}</span>
                      <span> {{ item.category }}</span>
                      <span> {{ item.risk ? item.risk.title : "" }}</span>
                      任务
                    </div>
                  </div>
                  <div slot="description" class="overflows">
                    <div
                      v-if="item.category == '更新' || item.category == '主动'"
                    >
                      <span v-show="item.channel">在&nbsp;</span>
                      <span
                        @click="openApplication(item.channel)"
                        class="channels"
                        >{{ item.channel ? item.channel.title : "" }}
                      </span>
                      <span v-show="item.channel">目录下</span>
                      <span> {{ item.count >= 0 ? "发布了" : "缩减了" }}</span>
                      <span>{{ Math.abs(item.count) + "篇文章" }}</span>
                    </div>
                    <div v-else>
                      <div v-if="item.category == '催办'">
                        {{ item.title }}
                      </div>
                    </div>
                  </div>
                  <a-avatar
                    v-if="item.category == '更新'"
                    slot="avatar"
                    :icon="item.finish ? 'check' : 'sync'"
                    :style="{
                      lineHeight: '40px',
                      backgroundColor: item.finish ? '#87d068' : '#8bc34a',
                    }"
                  />
                  <a-avatar
                    v-else-if="item.category == '主动'"
                    slot="avatar"
                    :style="{
                      lineHeight: '40px',
                      backgroundColor: item.finish ? '#87d068' : '#8bc34a',
                    }"
                  >
                    <span style="opacity: 1 !important">{{
                      substrings(item.category)
                    }}</span>
                  </a-avatar>
                  <a-avatar
                    v-else
                    slot="avatar"
                    :style="{
                      lineHeight: '40px',
                      backgroundColor: colors(item.category),
                    }"
                  >
                    <span style="opacity: 1 !important">{{
                      substrings(item.category)
                    }}</span>
                  </a-avatar>
                </a-list-item-meta>
                <div class="list_item">
                  {{ changestimes(item._createtime) }}
                </div>
              </a-list-item>
            </a-list>
          </a-spin>
        </a-card>
      </div>
      <div class="datas">
        <a-card class="a_cards">
          <span slot="title" class="tasks_title">
            数据统计
            <a href="#"><a-icon @click="statistics" type="right-circle" /></a>
          </span>
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

          <a-row :gutter="24">
            <a-col :span="12">
              <a-spin :spinning="documents_static">
                <div class="datas_title">
                  {{ datelist[dates - 1].name }}发文量
                  <a-tooltip
                    :title="
                      datelist[dates - 1].name +
                      '督导目录下的每' +
                      datelist[dates - 1].title +
                      '发文量涨幅根据（尾节点-上一节点）/上一节点'
                    "
                    slot="action"
                  >
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </div>
                <div style="display: flex">
                  <a-statistic
                    :value="documents.number"
                    style="margin-right: 50px"
                  />
                  <span style="margin-right: 16px; margin-top: 8px">
                    <span>{{ compute.toFixed(2) }}%</span>
                    <a-icon
                      :type="'caret-' + (compute > 0 ? 'up' : 'down')"
                      :style="{ color: compute > 0 ? 'red' : 'green' }"
                    />
                  </span>
                </div>
                <div
                  id="mains1"
                  style="width: 100%; height: 45px; margin: 10px auto"
                ></div>
              </a-spin>
            </a-col>
            <a-col :span="12">
              <a-spin :spinning="riskcount_static">
                <div class="datas_title">
                  完成周期任务量
                  <a-tooltip
                    :title="
                      datelist[dates - 1].name +
                      '督导目录下的每' +
                      datelist[dates - 1].title +
                      '周期任务量涨幅根据（尾节点-上一节点）/上一节点'
                    "
                    slot="action"
                  >
                    <a-icon type="info-circle-o" />
                  </a-tooltip>
                </div>
                <div style="display: flex">
                  <a-statistic
                    :value="riskcount.number"
                    style="margin-right: 50px"
                  />
                  <span style="margin-right: 16px; margin-top: 8px">
                    <span>{{ computes.toFixed(2) }}%</span>
                    <a-icon
                      :type="'caret-' + (computes > 0 ? 'up' : 'down')"
                      :style="{ color: computes > 0 ? 'red' : 'green' }"
                    />
                  </span>
                </div>
                <div
                  id="mains2"
                  style="width: 100%; height: 45px; margin: 10px auto"
                ></div>
              </a-spin>
            </a-col>
          </a-row>
          <a-table
            class="task_table"
            :columns="sitecolumns"
            :loading="siteloading"
            size="small"
            rowKey="id"
            bordered
            @change="changes"
            :pagination="{ pageSize: 4, showQuickJumper: true }"
            :dataSource="sitelist"
          >
            <span slot="rowIndex" slot-scope="text, record, index">
              {{ index + 1 + (current - 1) * 4 }}
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
    <!-- 任务列表 -->
    <div class="task_list">
      <div class="task_list_title">
        <div class="list_title">
          任务列表
          <a-icon @click="taskavtive" type="right-circle" />
        </div>
        <div class="task_search">
          <a-radio-group v-model="searchform.types" @change="handleSizeChange">
            <a-radio-button value="全部"> 全部 </a-radio-button>
            <a-radio-button value="发布型"> 发布型 </a-radio-button>
            <a-radio-button value="删改型"> 删改型 </a-radio-button>
          </a-radio-group>
          <a-tree-select
            style="width: 350px; margin-left: 16px"
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
          <a-input
            placeholder="请输入任务关键词查询"
            allowClear
            v-model="searchform.keyword"
            style="width: 300px; margin-left: 16px"
          />
          <a-button @click="onSearch" type="primary" style="margin-left: 16px">
            查询
          </a-button>
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
        :indentSize='50'
        :dataSource="taskData.items"
        @change="changessorts"
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
          <div class="table_contents" v-if="record.types != '删改型'">
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
        class="paginations"
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
      @ok="handleOk"
      :maskClosable="false"
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
    <Applications v-if="false"></Applications>
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
  risk_gain,
  risk_edit,
  risk_delete,
  risk_restore,
} from "@/services/supervision";

import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import Trend from "@/components/chart/Trend";
import { TinyArea } from "@antv/g2plot";
import { channel_list } from "@/services/content";
import { organization_tree } from "@/services/organization";
import { form_get } from "@/services/forms";
import { application_list } from "@/services/application";
import { mapState, mapMutations } from "vuex";
import Applications from "../../../applications/";
export default {
  props: {
    params: {
      //传递的数据
      type: Object,
    },
    event: {
      type: Function,
    },
    onOpen: {
      type: Function,
    },
  },
  components: {
    MiniArea,
    MiniBar,
    MiniProgress,
    Trend,
    Applications,
  },
  data() {
    return {
      taskList: [],
      spinning: true,
      searchform: {
        keyword: undefined,
        types: "全部",
      },
      datelist: [
        { id: 1, name: "本周", title: "天" },
        { id: 2, name: "本月", title: "周" },
        { id: 3, name: "全年", title: "月" },
      ],
      documents: {
        degrees: [],
        number: 0,
      },
      compute: 0,
      riskcount: {
        degrees: [],
        number: 0,
      },
      computes: 0,
      dates: 1,
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
          width: "20%",
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
      visible: false,
      confirmLoading: false,
      spinnings: true,
      formDatas: {},
      formDataes: {},
      formDataese: {},
      sitetree: [],
      channeltree: [],
      applications: [],
      trend: "up",
      typedatas: {},
    };
  },
  computed: {
    ...mapState("applications", ["apps"]),
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
    this.init();
  },

  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations("applications", ["addApps", "removeApps", "setApps"]),
    onRefresh() {
      // this.init();
      console.log("1111");
    },
    openApplication(channel) {
      const app = this.applications.find((item) => item.name == "content");
      this.$emit("on-open", {
        id: app.id,
        name: "content",
        title: `文章详情 -- ${app.title}`,
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "75%",
        height: "75%",
        router: "Content",
        data: {
          site: channel.site,
          channel: channel._id,
        },
        cancel: () => {
          this.init();
        },
      });
    },
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
    changessorts(e, filters) {
      for (var i in filters) {
        if (filters[i].length) {
          if (i == "status") {
            this.searchform.finish = filters[i][0] == 1 ? true : false;
          } else if (i == "progress") {
            this.searchform.compute = filters[i][0] == "ascend" ? 1 : -1;
          } else if (i == "_createtime") {
            this.searchform.create = filters[i][0] == "ascend" ? 1 : -1;
          }
        } else {
          if (i == "status") {
            this.searchform.finish = undefined;
          } else if (i == "progress") {
            this.searchform.compute = 0;
          } else if (i == "_createtime") {
            this.searchform.create = 0;
          }
        }
      }
      this.$nextTick(() => {
        this.loadDataSrouce();
      });
    },
    TinyArea() {
      if (this.indext == 1) {
        this.areaPlot = new TinyArea("mains1", {
          data: this.documents.degrees,
          smooth: true,
          autoFit: true,
          areaStyle: {
            fill: "#d6e3fd",
          },
        });
        this.areaPlot.render();
      } else {
        this.areaPlot.update({
          data: this.documents.degrees,
        });
      }
      this.documents_static = false;
    },
    TinyAreas() {
      if (this.indexl == 1) {
        this.areaPlots = new TinyArea("mains2", {
          data: this.riskcount.degrees,
          smooth: true,
          autoFit: true,
          areaStyle: {
            fill: "#d6e3fd",
          },
        });
        this.areaPlots.render();
      } else {
        this.areaPlots.update({
          data: this.riskcount.degrees,
        });
      }
      this.riskcount_static = false;
    },
    datasStatistics() {},
    init() {
      // 任务完成统计
      risk_finish()
        .then((res) => {
          this.datas = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      // 数据统计-发文量
      event_document({ category: this.dates })
        .then((res) => {
          this.documents = res.data.data;
          this.$nextTick(() => {
            this.compute = this.documents.compute;
          });
          this.indext++;
          this.TinyArea();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
      // 数据统计-任务量
      risk_count({ category: this.dates })
        .then((res) => {
          this.riskcount = res.data.data;
          this.$nextTick(() => {
            this.computes = this.riskcount.compute;
          });
          this.indexl++;
          this.TinyAreas();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });

      // 任务动态
      event_paginate({ per_page: 5, page: 1 })
        .then((res) => {
          this.taskList = res.data.data.items;
          this.spinning = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
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
      // 站点树
      organization_tree()
        .then((res) => {
          this.sitetree = res.data.data;
        })
        .catch((error) => {
          console.log("error", error);
        });
      form_get({ name: "supervise_task" })
        .then((res) => {
          this.formDataes = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      application_list()
        .then((response) => {
          this.applications = response.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      form_get({ name: "delete_task" })
        .then((respose) => {
          this.formDataese = respose.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 时间解析
    changestimes(data) {
      let timers = new Date(data).getTime();
      var now = new Date().getTime();
      let second = parseInt((now - timers) / 1000); //秒
      if (second < 60) {
        return second + "秒前";
      } else {
        let minute = parseInt(second / 60);
        if (minute < 60) {
          return minute + "分钟前";
        } else {
          let hours = parseInt(minute / 60);
          if (hours < 24) {
            return hours + "小时前";
          } else {
            let day = parseInt(hours / 24);
            if (day < 30) {
              return day + "天前";
            } else {
              let month = parseInt(day / 30);
              if (month < 12) {
                return month + "月前";
              } else {
                let year = parseInt(month / 12);
                return year + "年前";
              }
            }
          }
        }
      }
    },
    // 任务动态刷新
    listresets() {
      this.spinning = true;
      event_paginate({ per_page: 5, page: 1 })
        .then((res) => {
          this.taskList = res.data.data.items;
          this.spinning = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 任务列表-查询
    handleSizeChange() {
      this.loading = true;
      this.searchform.page = 1;
      this.searchform.per_page = 10;
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
    // 任务动态
    taskavtive() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "tasklist",
          params: {
            menus: ["tasklist"],
          },
        },
      });
    },
    clicks(items) {
      this.dates = items.id;
      this.documents_static = true;
      this.riskcount_static = true;
      event_document({ category: this.dates })
        .then((res) => {
          this.documents = res.data.data;
          this.$nextTick(() => {
            this.compute = this.documents.compute;
          });
          this.indext++;
          this.TinyArea();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
      risk_count({ category: this.dates })
        .then((res) => {
          this.riskcount = res.data.data;
          this.$nextTick(() => {
            this.computes = this.riskcount.compute;
          });
          this.indexl++;
          this.TinyAreas();
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
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
          this.$refs.kcompanyForm.show(["period", "degree", "count"]);
          this.$refs.kcompanyForm.hide(["datarange", "supervise"]);
        } else if (key == "时间类型") {
          this.$refs.kcompanyForm.hide([
            "period",
            "degree",
            "count",
            "supervise",
          ]);
          this.$refs.kcompanyForm.show(["datarange"]);
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
    // 数据统计
    statistics() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "datastatistics",
          params: {
            menus: ["datastatistics"],
          },
        },
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
            router: "home",
            searchform: this.searchform,
          },
        },
      });
    },
    handleOk() {
      this.$refs.kcompanyForm
        .getData()
        .then((res) => {
          var datas = Object.assign(res, { id: this.id });
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
                // start: res.datarange[0].substring(0, 10),
                // end: res.datarange[1].substring(0, 10),
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
                  "datarange",
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
                this.$refs.kcompanyForm.show(["datarange", "taskload"]);
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
                    // datarange: [this.typedatas.start, this.typedatas.end],
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
    // 站点详情页
    tositedetails(record) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "sitedetails",
          params: {
            site: record._id,
            router: "home",
          },
        },
      });
    },
    colors(data) {
      var colorlist = {
        还原: "#36cfc9",
        删除: "#f5222f",
        催办: "#faad14",
        编辑: "#40a9ff",
        主动: "purple",
      };
      return colorlist[data];
    },
    substrings(data) {
      return data.substring(0, 1);
    },
  },
};
</script>

<style scoped>
.task_table >>> .ant-table-body {
  margin: 0 !important;
}
.postsa {
  position: relative;
  /* padding-left: 30px; */
}
.sanjiao {
  /* position: absolute; */
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
.items_list .ant-list-item-meta {
  display: flex;
  align-items: center;
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
  .main_headers {
    background: #fff;
    padding: 16px 24px;
    .header_left {
      width: 50%;
      display: flex;
      justify-content: left;
      align-items: center;
      padding: 18px 0;
      img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
      }
      .header_left_title {
        margin-left: 24px;
        .titles {
          font-size: 20px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .faburenwu {
          margin-top: 8px;
          width: 88px;
          height: 32px;
          line-height: 32px;
          background: #1890ff;
          font-size: 14px;
          text-align: center;
          color: #ffffff;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }
    .header_right {
      width: 50%;
      display: flex;
      justify-content: right;
      align-items: center;
      padding: 18px 0;
      .ant-divider-vertical {
        height: 40px;
        background: #e9e9e9;
      }
      .items {
        font-size: 14px;
        font-family: PingFang SC, PingFang;
        font-weight: 常规体;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        width: 130px;
        div {
          font-size: 30px;
          font-family: HelveticaNeue;
          text-align: center;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
  .centers {
    display: flex;
    .a_cards {
      width: 100%;
      height: 460px;
      overflow: hidden;
      .ant-avatar {
        width: 40px;
        height: 40px;
      }
      .minis {
        width: 100%;
        height: 24px;
        margin-top: 50px;
        canvas {
          width: 100%;
        }
      }
    }
    .tasks {
      width: calc(50% - 36px);
      margin: 24px 12px 24px 24px;
      background: #fff;
      .ant-list-split .ant-list-item {
        height: 80px;
        // cursor: pointer;
      }
      .list_item {
        width: 120px;
        text-align: end;
        font-size: 14px;
        color: #00000040;
      }
    }
    .datas {
      width: calc(50% - 36px);
      margin: 24px 24px 24px 12px;
      background: #fff;
      .datas_title {
        font-size: 14px;
        text-align: left;
        margin: 24px 0 12px;
        color: rgba(0, 0, 0, 0.45);
      }
      .up {
        color: red;
      }
      .down {
        color: green;
      }
      .documents_num {
        font-size: 24px;
        color: #000000d9;
        margin-right: 28px;
      }
      .table_title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        // color: #1890ff !important;
        a {
          color: #00aaf0 !important;
        }
      }
    }
    .tasks_title {
      font-size: 16px;
      font-weight: 500;
      color: #000000d9;
    }
    i {
      color: #bfbfbf;
      margin-left: 12px;
    }
    .active {
      color: #1890ff;
    }
  }
  .task_list {
    margin: auto 24px;
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
        float: right;
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
    .paginations {
      text-align: right;
      .ant-pagination-item-active {
        background: #1890ff;
        a {
          color: #fff !important;
        }
      }
    }
  }
  .overflows {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .channels {
    cursor: pointer;
    color: #1890ff;
  }
}
</style>
