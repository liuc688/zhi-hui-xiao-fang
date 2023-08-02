<template>
  <div class="maines">
    <a-row :gutter="24">
      <a-col :span="16">
        <div class="top_left">
          <a-breadcrumb>
            <a-breadcrumb-item
              ><a href="javascript:;" @click="toplists(router)">{{
                router == "home"
                  ? "首页"
                  : router == "tasklist"
                  ? "任务列表"
                  : "站点详情"
              }}</a></a-breadcrumb-item
            >
            <a-breadcrumb-item>任务详情</a-breadcrumb-item>
          </a-breadcrumb>
          <div class="top_left_title">
            <div class="titles_all">
              <a-tag
                style="margin: auto"
                :color="
                  detailsdata.finish - detailsdata.taskload >= 0
                    ? 'green'
                    : 'blue'
                "
              >
                {{
                  detailsdata.finish - detailsdata.taskload >= 0
                    ? "已完成"
                    : "未完成"
                }}
              </a-tag>
              <div class="titles">
                {{ detailsdata.title }}
              </div>
              <div class="buttones">
                <a-button
                  type="primary"
                  style="margin-left: 24px"
                  @click="event_creates(1, idlist)"
                  >催办</a-button
                >
              </div>
            </div>
            <!-- <span class="titles">{{ detailsdata.title }}</span>
            <div class="button">
               <a-button-group>
                <a-button>修改</a-button>
                <a-button>撤回</a-button>
              </a-button-group>
              <a-button
                type="primary"
                style="margin-left: 24px"
                @click="event_creates(detailsdata.id)"
                >催办</a-button
              >
            </div> -->
            <a-row class="describs">
              <a-col :span="8">
                创建人：
                <span>{{
                  detailsdata._creator ? detailsdata._creator.realname : ""
                }}</span>
              </a-col>
              <a-col :span="8">
                创建时间： <span>{{ detailsdata._createtime }}</span>
              </a-col>
              <!-- <a-col :span="8" style="text-align: right">
                <a-button
                  type="primary"
                  size="small"
                  @click="event_creates(detailsdata.id)"
                  >催办</a-button
                >
              </a-col> -->
              <a-col :span="24">
                <a-popover :overlayStyle="{ width: '800px' }" placement="topLeft">
                  <template slot="content">
                    <span>{{ detailsdata.content }}</span>
                  </template>
                  <div class="contents">
                    任务内容： <span>{{ detailsdata.content }}</span>
                  </div>
                </a-popover>
              </a-col>
            </a-row>
          </div>
          <div class="actdatas">
            <div class="actdatas_cards" style="width: 17%">
              <p>任务站点</p>
              <div>{{ children.length }} <span>个</span></div>
            </div>
            <div class="actdatas_cards" style="width: 23%">
              <p>任务完成所需文章</p>
              <div>{{ detailsdata.taskloaded }} <span>篇</span></div>
            </div>
            <div class="actdatas_cards" style="width: 17%">
              <p>已发文章</p>
              <div>{{ detailsdata.finished }} <span>篇</span></div>
            </div>
            <div class="actdatas_cards" style="width: 22%">
              <p>当前周期所需文章</p>
              <div>{{ detailsdata.now_count }} <span>篇</span></div>
            </div>
            <div class="actdatas_cards" style="width: 21%">
              <p>本周期发布文章</p>
              <div>{{ detailsdata.now_drgree }} <span>篇</span></div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="top_right">
          <a-card>
            <span slot="title">任务动态</span>
            <a slot="extra" href="#" @click="event_paginates">
              <a-icon type="reload" />
            </a>
            <div class="card_bodys">
              <a-spin tip="Loading..." :spinning="spinning">
                <a-list item-layout="horizontal" :data-source="taskList">
                  <a-list-item
                    slot="renderItem"
                    slot-scope="item"
                    class="items_list"
                  >
                    <a-list-item-meta>
                      <div slot="title" href="#" class="ellipsis">
                        <div v-if="item.category == '更新'">
                          <span>{{ item.site ? item.site.title : "" }}</span>
                          <span v-if="item.finish"> 完成</span>
                          <span v-else> {{ item.category }} </span>
                          <span>
                            {{ item.risk ? item.risk.title : "" }}
                          </span>
                          任务
                        </div>
                        <div v-else class="ellipsis">
                          <span>{{
                            item._creator ? item._creator.username : ""
                          }}</span>
                          <span> {{ item.category }}</span>
                          <span> {{ item.risk ? item.risk.title : "" }}</span>
                        </div>
                      </div>
                      <div slot="description" class="ellipsis">
                        <div v-if="item.category == '更新'">
                          <span v-show="item.channel">在&nbsp;</span>
                          <span
                            @click="openApplication(item.channel)"
                            class="channels"
                            >{{ item.channel ? item.channel.title : "" }}
                          </span>
                          <span v-show="item.channel">目录下</span>
                          <span>
                            {{ item.count >= 0 ? "发布了" : "缩减了" }}</span
                          >
                          <span>{{ Math.abs(item.count) + "篇文章" }}</span>
                        </div>
                        <div v-else>
                          {{ item.title }}
                        </div>
                      </div>
                    </a-list-item-meta>
                    <div class="list_item">
                      {{ changestimes(item._createtime) }}
                    </div>
                  </a-list-item>
                </a-list>
              </a-spin>
            </div>
          </a-card>
        </div>
      </a-col>
    </a-row>
    <a-card class="implementinfo">
      <span slot="title">执行信息</span>
      <div class="contentes" v-for="(item, index) in children" :key="item.id">
        <div class="div_b">
          <a-row>
            <a-col :span="4"
              >任务站点：<span class="a_colors">{{
                retunsite(item)
              }}</span></a-col
            >
            <a-col :span="4"
              >任务目录：<span class="a_colors">
                {{
                  item._extension.channel ? item._extension.channel.title : ""
                }}</span
              >
            </a-col>
            <a-col :span="3">
              <div v-if="item.category == '周期类型'">
                任务周期：<span>{{ item.period }}</span>
              </div></a-col
            >
            <a-col :span="3">
              <div v-if="item.category == '周期类型'">
                循环次数：<span> {{ item.degree }} </span>
              </div></a-col
            >
            <a-col :span="4" style="display: flex">
              <div>关键词：</div>
              <div class="ellipsies">
                <span v-for="(stap, index) in item.keywords" :key="index">
                  {{ stap }}</span
                >
              </div>
            </a-col>
            <a-col :span="4"
              >总体完成情况： {{ item.finish + "/" + item.taskload }}</a-col
            >
            <a-col :span="2" style="text-align: right">
              <a
                href="javascript:;"
                class="a_colors paddings_r"
                @click="event_edits(item)"
                >修改</a
              >
              <a
                href="javascript:;"
                class="a_colors"
                @click="event_creates(2, item.id)"
                >单独催办</a
              ></a-col
            >
          </a-row>
        </div>
        <div class="div_c">
          <a-row>
            <a-col :span="9">
              <div>
                当前周期: <span>{{ degreess(item.degrees) }}</span>
                <span class="colors" @click="listres(index)"
                  >查看全部周期>></span
                >
              </div>
            </a-col>
            <a-col :span="4">
              <div>
                周期状态:
                <a-badge
                  :color="
                    statues(item.degrees) == '未完成' ? '#3BA0FF' : '#4DCB73'
                  "
                  :text="statues(item.degrees)"
                />
              </div>
            </a-col>
            <a-col :span="7" style="text-align: center"
              >周期进度:
              <a-progress
                style="width: 65%; margin-left: 20px"
                :percent="progress(item, 1)"
              />
            </a-col>
            <a-col :span="4" style="text-align: end"
              >周期完成情况:
              <span style="color: #1890ff">{{ progress(item, 2) }}</span>
            </a-col>
          </a-row>
        </div>
        <div class="div_d" v-if="listrs[index].visible == true">
          <div class="mains">
            <div
              v-for="(stemps, index) in item.degrees"
              :key="index"
              class="main_item"
              :style="{
                paddingTop: 25 * (item.degrees.length - index + 1) + 'px',
              }"
            >
              <div :class="progreses(stemps) ? 'times itemes' : 'times'">
                <span>{{ stemps.start.substring(0, 10) }}</span>
                <span style="padding: 0 10px">~</span>
                <span>{{ stemps.end.substring(0, 10) }}</span>
              </div>
              <div style="text-align: center; height: 20px">
                <span>周期完成情况：</span>
                <span style="color: #1890ff">{{
                  (stemps.finish || 0) + "/" + item.count
                }}</span>
              </div>
              <a-progress
                :strokeColor="exception(stemps)"
                :showInfo="false"
                :strokeWidth="20"
                :percent="((stemps.finish || 0) / item.count) * 100"
              >
              </a-progress>
              <span
                style="
                  position: relative;
                  top: -20px;
                  left: 20px;
                  color: #ffffff;
                "
                >{{
                  1 > ((stemps.finish || 0) / item.count) * 100
                    ? ((stemps.finish || 0) / item.count) * 100
                    : 100
                }}
                %</span
              >
              <!-- <a-skeleton v-else :paragraph="{ rows: 0 }" class="skeleton_an" /> -->
            </div>
          </div>
          <!-- <a-row :gutter="12">
            <div v-for="(stemps, index) in item.degrees" :key="index">
              <a-col :span="6">
                <div class="degrees_item">
                  <div class="degrees_title">
                    {{ stemps.start.substring(0, 10) }}——{{
                      stemps.end.substring(0, 10)
                    }}
                  </div>
                  <div class="progress">
                    <h3>
                      周期完成情况：
                      {{ (stemps.finish || 0) + "/" + item.count }}
                    </h3>
                    <a-progress
                      :strokeColor="exception(stemps)"
                      :percent="((stemps.finish || 0) / item.count) * 100"
                    />
                  </div>
                </div>
              </a-col>
            </div>
          </a-row> -->
        </div>
      </div>
    </a-card>
    <a-modal
      title="任务催办"
      width="60%"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <k-form-build :value="formDatas" ref="kcompanyForm" />
    </a-modal>
    <!-- 督导编辑 -->
    <a-modal
      title="任务督导"
      width="60%"
      :visible="visibles"
      :confirm-loading="confirmLoadings"
      :maskClosable="false"
      @ok="handleOks"
      @cancel="handleCancels"
      class="taskSupervisionModal"
    >
      <a-spin :spinning="spinnings" tip="加载中...">
        <k-form-build
          :value="formData"
          ref="kcompanyForms"
          :dynamicData="dynamicData"
          @change="changeforms"
        />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import {
  risk_get,
  event_paginate,
  event_create,
  risk_gain,
  risk_edit,
} from "@/services/supervision";
import { channel_list } from "@/services/content";
import { organization_tree } from "@/services/organization";
import { form_get } from "@/services/forms";
import { application_list } from "@/services/application";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
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
  },
  components: {
    Applications,
  },
  data() {
    return {
      id: undefined,
      edit_id: "",
      detailsdata: {},
      children: [],
      taskList: [],
      router: "",
      listrs: [],
      formDatas: {},
      formData: {},
      visible: false,
      visibles: false,
      confirmLoading: false,
      confirmLoadings: false,
      ugreid: undefined,
      spinning: true,
      spinnings: true,
      channeltree: [],
      sitetree: [],
      typedatas: {},
      idlist: [],
    };
  },
  created() {
    this.id = this.params.data._id || undefined;
    this.router = this.params.router || "home";
    this.init();
  },
  computed: {
    ...mapState("applications", ["apps"]),
    userinfo() {
      return this.$store.getters["account/user"];
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
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    ...mapMutations("websocket", ["setId"]),
    ...mapMutations("applications", ["addApps", "removeApps", "setApps"]),
    onRefresh() {
      this.init();
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
    init() {
      form_get({ name: "task_urge" })
        .then((res) => {
          this.formDatas = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
      risk_get({ id: this.id })
        .then((res) => {
          this.detailsdata = res.data.data;
          this.children = res.data.children;
          this.idlist = [];
          this.children.filter((item) => {
            this.listrs.push({
              title: "展开知识点",
              visible: false,
            });
            this.idlist.push(item.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      // 任务动态
      event_paginate({ per_page: 3, page: 1, risk: [this.id] })
        .then((res) => {
          this.taskList = res.data.data.items;
          this.spinning = false;
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
      form_get({ name: "supervise_task" })
        .then((res) => {
          this.formData = res.data.data.form;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      organization_tree()
        .then((res) => {
          this.sitetree = res.data.data;
          console.log("sitetree", this.sitetree);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    event_paginates() {
      this.spinning = true;
      event_paginate({ per_page: 3, page: 1, risk: [this.id] })
        .then((res) => {
          this.taskList = res.data.data.items;
          this.spinning = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },
    toplists(router) {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: router,
          params: {
            menus: [router],
            searchform: this.params.searchform,
            site: this.params.site,
          },
        },
      });
    },
    retunsite(item) {
      return item._extension.site ? item._extension.site.title : "";
    },
    // 当前周期
    degreess(degrees) {
      const degreeses = degrees.filter((item) => {
        if (item.deadline) {
          const start = new Date(item.start).getTime();
          const deadline = new Date(item.deadline).getTime();
          const end = new Date(item.end).getTime();
          if (deadline <= end && deadline > start) {
            return item;
          }
        }
      });

      if (degreeses.length) {
        return (
          degreeses[degreeses.length - 1].start.substring(0, 10) +
            "——" +
            degreeses[degreeses.length - 1].end.substring(0, 10) || ""
        );
      } else {
        return "";
      }
    },
    // 当前周期
    statues(degrees) {
      const degreeses = degrees.filter((item) => {
        if (item.deadline) {
          const start = new Date(item.start).getTime();
          const deadline = new Date(item.deadline).getTime();
          const end = new Date(item.end).getTime();
          if (deadline <= end && deadline > start) {
            return item;
          }
        }
      });
      if (degreeses.length > 0) {
        if (degreeses[degreeses.length - 1].finish >= this.detailsdata.count) {
          return "已完成";
        } else {
          return "未完成";
        }
      } else {
        return "未完成";
      }
    },
    progreses(item) {
      const now = new Date().getTime();
      const end = new Date(item.end).getTime();
      const start = new Date(item.start).getTime();
      if (end > now && start < now) {
        return true;
      } else {
        return false;
      }

      // const deadline = new Date(item.deadline).getTime();
      // const end = new Date(item.end).getTime();

      // const degreeses = item.degrees.filter((item) => {
      //   if (item.deadline) {
      //     const start = new Date(item.start).getTime();
      //     const deadline = new Date(item.deadline).getTime();
      //     const end = new Date(item.end).getTime();
      //     if (deadline <= end && deadline > start) {
      //       return true;
      //     }
      //   }
      // });
      // if (degreeses.length > 0) {
      //     return true;
      //   } else {
      //     return false;
      //   }
    },
    progress(item, index) {
      const degreeses = item.degrees.filter((item) => {
        if (item.deadline) {
          const start = new Date(item.start).getTime();
          const deadline = new Date(item.deadline).getTime();
          const end = new Date(item.end).getTime();
          if (deadline <= end && deadline > start) {
            return item;
          }
        }
      });
      if (index == 1) {
        if (degreeses.length > 0) {
          const num =
            (degreeses[degreeses.length - 1].finish / item.count) * 100;
          return num;
        } else {
          return 0;
        }
      } else if (index == 2) {
        if (degreeses.length > 0) {
          return degreeses[degreeses.length - 1].finish + "/" + item.count;
        } else {
          return 0 + "/" + item.count;
        }
      }
    },
    exception(stemps) {
      if (stemps.deadline) {
        const now = new Date().getTime();
        const end = new Date(stemps.end).getTime();
        if (end < now && stemps.finish < this.detailsdata.count) {
          return "red";
        } else {
          return "#1890ff";
        }
      } else {
        return "#1890ff";
      }
    },
    listres(index) {
      this.listrs[index].visible = !this.listrs[index].visible;
    },
    // 任务催办
    handleOk() {
      this.$refs.kcompanyForm
        .getData()
        .then((res) => {
          this.confirmLoading = true;
          event_create({
            risks: this.ugreid,
            title: res.title,
          })
            .then((response) => {
              this.visible = false;
              this.confirmLoading = false;
              this.$message.success(response.data.message);
              this.event_paginates();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 单独催办
    event_creates(num, id) {
      if (num == 1) {
        this.ugreid = this.idlist;
      } else {
        this.ugreid = [id];
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.kcompanyForm.reset();
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // 修改
    event_edits(record) {
      console.log("record", record);
      this.edit_id = record._id;
      risk_gain({ id: record._id })
        .then((res) => {
          this.typedatas = res.data.data;
          console.log("datas", this.typedatas);
          this.visibles = true;
          this.spinnings = true;
          if (this.typedatas.category == "周期类型") {
            this.$nextTick(() => {
              this.$refs.kcompanyForms.show([
                "period",
                "degree",
                "count",
                "action",
              ]);
              this.$refs.kcompanyForms.hide([
                "datarange",
                "supervise",
                "includes",
                "taskload",
              ]);
              this.$nextTick(() => {
                this.$refs.kcompanyForms.setData({
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
              this.$refs.kcompanyForms.hide([
                "period",
                "degree",
                "count",
                "supervise",
                "action",
                "includes",
              ]);
              this.$refs.kcompanyForms.show(["datarange", "taskload"]);
              var tempArrays = [];
              for(let i=0;i<this.typedatas.degrees.length;i++) {
                let ranges = []
                ranges.push(this.typedatas.degrees[i].start.split(" ")[0]);
                ranges.push(this.typedatas.degrees[i].end.split(" ")[0]);
                tempArrays.push({key:i,ranges})
              }
              this.$nextTick(() => {
                this.$refs.kcompanyForms.setData({
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 任务修改
    handleOks() {
      this.$refs.kcompanyForms
        .getData()
        .then((res) => {
          var datas = Object.assign(res, { id: this.edit_id });
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
              var tempArraysAdd = [];
              for(let i=0;i<datas.degrees.length;i++) {
                tempArraysAdd.push({start:datas.degrees[i].ranges[0],end:datas.degrees[i].ranges[1]});
              }
              datas.degrees = tempArraysAdd;
              datas = Object.assign(datas, {
                title: res.name,
                // start: res.datarange[0].substring(0, 10),
                // end: res.datarange[1].substring(0, 10),
              });
            }
          }
          this.confirmLoadings = true;
          risk_edit(datas)
            .then(() => {
              this.visibles = false;
              this.confirmLoadings = false;
              this.init();
            })
            .catch((err) => {
              this.confirmLoadings = false;
              this.$message.error(err.response.data.message);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCancels() {
      this.visibles = false;
      this.typedatas = {};
      this.$refs.kcompanyForms.reset();
    },
    // 表单改变事件： 站点
    changeforms(key, value) {
      if (value == "site") {
        this.spinnings = true;
        channel_list({
          site: key,
          tree: true,
        })
          .then((res) => {
            this.channeltree = res.data.data;
            this.spinnings = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (value == "category") {
        if (key == "周期类型") {
          this.$refs.kcompanyForms.show([
            "period",
            "degree",
            "count",
            "taskload",
          ]);
          this.$refs.kcompanyForms.hide(["datarange", "supervise"]);
        } else if (key == "时间类型") {
          this.$refs.kcompanyForms.hide([
            "period",
            "degree",
            "count",
            "taskload",
            "supervise",
          ]);
          this.$refs.kcompanyForms.show(["datarange"]);
        }
      }
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
  },
};
</script>
<style scoped lang="less">
.maines {
  margin: 24px;
  width: calc(100% - 48px);
  .top_left {
    background: #fff;
    padding: 16px 24px;
    height: 300px;
    .top_left_title {
      margin: 21px auto;
      .titles_all {
        display: flex;
        width: 100%;
        .titles {
          width: 80%;
          margin-left: 12px;
          font-size: 20px;
          font-weight: 500;
          text-align: left;
          color: rgba(0, 0, 0, 0.85);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .buttones {
          width: 20%;
          text-align: right;
        }
      }

      .describs {
        margin: 17px 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        span {
          font-size: 15px;
          font-family: PingFang SC;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
        }
        .contents {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .ant-col {
          margin: 5px 0px;
        }
      }
    }
    .actdatas {
      width: 100%;
      display: flex;
      .actdatas_cards {
        width: 20%;
        padding-left: 20px;
        text-align: center;
        p {
          font-size: 14px;
          margin-bottom: 9px;
          color: rgba(0, 0, 0, 0.45);
        }
        div {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.85);
          span {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
  }
  .top_right {
    background: #fff;
    .card_bodys {
      height: 234px;
      .list_item {
        text-align: end;
        font-size: 14px;
        color: #00000040;
      }
    }
  }
  .implementinfo {
    margin: 24px auto;
    .contentes {
      margin: 24px auto;
      .div_b {
        border: 1px solid #e8e8e8;
        padding: 21px 24px;
        background: #faffff;
        .a_colors {
          color: #1890ff !important;
        }
        .paddings_r {
          padding-right: 10px;
        }
      }
      .div_c {
        border: 1px solid #e8e8e8;
        padding: 24px;
        background: #ffffff;
      }
      .div_d {
        padding: 21px 24px;
        border: 1px solid #e8e8e8;
        .degrees_item {
          width: 100%;
          padding: 0;
          background: #fafafa;
          text-align: center;
          margin: 10px 0;
          .degrees_title {
            width: 100%;
            background: #dff4ff;
            padding: 10px;
            font-size: 16px;
          }
          .progress {
            padding: 30px 60px;
          }
        }
      }
    }
  }
  .colors {
    color: #1890ff !important;
    margin-left: 13px;
    cursor: pointer;
  }
}
</style>
<style scoped>
.progress >>> .ant-progress-inner {
  border-radius: 0px !important;
  border: 1px solid #cecece;
  background: #e8e8e8 !important;
}
.progress >>> .ant-progress-bg {
  border-radius: 0px !important;
  height: 12px !important;
}
.channels {
  cursor: pointer;
  color: #1890ff;
}
.items_list .ant-list-item-meta {
  display: flex;
  align-items: center;
  height: 49px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.ellipsies {
  overflow: hidden;
  width: calc(100% - 60px);
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
<style lang="less" scoped>
.mains {
  width: 100%;
  overflow-x: auto;
  padding: 20px 10px;
  display: -webkit-box;
  .main_item {
    width: 17%;
    border-left: 2px dashed #ebebeb;
    position: relative;

    .times {
      position: absolute;
      width: 100%;
      padding: 0 10px;
      top: 0px;
      font-size: 16px;
      text-align: center;
      font-weight: 500;
      border-top: 1px solid #e2e2e2;
      border-bottom: 1px solid #e2e2e2;
    }
    .itemes {
      background: #40a9ff;
      color: #ffffffff;
    }
  }
  .main_item:hover {
    background: #bae7ff;
  }
  .main_item:last-child {
    border-left: 2px dashed #ebebeb;
  }
  .main_item:first-child {
    border-left: 0px dashed #ebebeb;
  }
}
.mains::-webkit-scrollbar {
  height: 10px !important;
}
.mains::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px #2929291a;
  background: #c3c3c3;
}
.mains::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px #2929291a;
  border-radius: 5px;
  background: #fafafa;
}
</style>
<style scoped>
.main_item >>> .ant-progress-bg {
  border-radius: 0 !important;
  height: 20px !important;
}
.main_item >>> .ant-progress-inner {
  border-radius: 0 !important;
  height: 20px !important;
  background: #e8e8e8 !important;
}
.skeleton_an >>> .ant-skeleton-title {
  width: 100% !important;
  height: 20px;
  margin-top: 5px;
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