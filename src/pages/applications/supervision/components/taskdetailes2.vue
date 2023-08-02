<template>
  <div class="maines">
    <a-row :gutter="24" style="height: 100%">
      <a-col :span="16" style="height: 100%">
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
                  v-if="detailsdata.taskload - detailsdata.finish > 0"
                  @click="finisheds(detailsdata.id)"
                  >完成</a-button
                >
                <a-button
                  type="primary"
                  style="margin-left: 24px"
                  v-if="detailsdata.taskload - detailsdata.finish > 0"
                  @click="tofinisheds(detailsdata)"
                  >去完成</a-button
                >
                <a-button
                  type="danger"
                  style="margin-left: 24px"
                  v-if="detailsdata.taskload - detailsdata.finish > 0"
                  @click="event_creates(detailsdata.id)"
                  >催办</a-button
                >
              </div>
            </div>
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
              <a-col :span="8">
                任务站点：
                <span>{{ extension.site ? extension.site.title : "" }}</span>
              </a-col>
              <a-col :span="8">
                任务目录：
                <span>{{
                  extension.channel ? extension.channel.title : ""
                }}</span>
              </a-col>
              <a-col :span="16">
                文章标题：
                <span>{{
                  extension.document ? extension.document.title : ""
                }}</span>
              </a-col>
              <a-col :span="24" style="height: calc(100% - 70px)">
                任务内容：
                <a-button
                  style="float: right"
                  type="primary"
                  v-if="detailsdata.taskload - detailsdata.finish > 0"
                  @click="edits"
                  >修改</a-button
                >
                <div class="contents">
                  <div v-html="detailsdata.content"></div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
      <a-col :span="8" style="height: 100%">
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
                        <div
                          v-if="
                            item.category == '更新' || item.category == '主动'
                          "
                        >
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
                          <span>{{ item.count + "篇文章" }}</span>
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
    <a-modal
      title="任务督导"
      width="60%"
      :visible="visibles"
      :confirm-loading="confirmLoadings"
      :maskClosable="false"
      @ok="handleOks"
      @cancel="handleCancels"
    >
      <a-spin :spinning="spinnings" tip="加载中...">
        <k-form-build :value="formData" ref="kcompanyForms" />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import {
  risk_get,
  event_paginate,
  event_create,
  initiative_finish,
  risk_gain,
  risk_edit,
} from "@/services/supervision";
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
      detailsdata: {},
      extension: {},
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
      spinnings: false,
      edit_id: "",
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
          this.extension = res.data.data._extension;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
      // 任务动态
      event_paginate({ per_page: 9, page: 1, risk: [this.id] })
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
      form_get({ name: "delete_task" })
        .then((respose) => {
          this.formData = respose.data.data.form;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    event_paginates() {
      this.spinning = true;
      event_paginate({ per_page: 9, page: 1, risk: [this.id] })
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
    edits() {
      risk_gain({ id: this.id })
        .then((res) => {
          this.typedatas = res.data.data;
          this.visibles = true;
          this.spinnings = true;
          this.$nextTick(() => {
            this.$refs.kcompanyForms.setData({
              title: this.typedatas.title,
              content: this.typedatas.content,
              start: this.typedatas.start,
              end: this.typedatas.end,
            });
            this.spinnings = false;
          });
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
          var datas = Object.assign(res, { id: this.id });
          datas = Object.assign(datas, {
            site: this.typedatas.site,
            channel: this.typedatas.channel,
            category: this.typedatas.category,
            keywords: this.typedatas.keywords,
            taskload: this.typedatas.taskload,
            start: res.start.substring(0, 10),
            end: res.end.substring(0, 10),
          });
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
    },

    // 任务完成
    finisheds(id) {
      var that = this;
      that.$confirm({
        title: "是否确认完成此任务!",
        okText: "确定",
        cancelText: "取消",
        content: "该操作不可逆,请谨慎操作!",
        onOk() {
          initiative_finish({ id: id })
            .then(() => {
              that.init();
            })
            .catch((error) => {
              console.log(error);
            });
        },
        onCancel() {},
      });
    },
    // 去完成
    tofinisheds(datas) {
      const app = this.applications.find((item) => item.name == "content");
      this.$emit("on-open", {
        id: app.id,
        name: "content",
        title: `文章修改 -- ${app.title}`,
        status: true,
        location: "top",
        sort: 0,
        type: "system",
        hidden: false,
        width: "75%",
        height: "75%",
        router: "Content",
        data: {
          site: datas.site,
          channel: datas.channel,
          search: this.extension.document.title,
          // params: {
          //   route: "edit-documents",
          //   params: Object.assign({}, datas, {
          //     search: this.extension.document.title,
          //   }),
          // },
        },
        cancel: () => {
          this.init();
        },
      });
    },
    // 任务催办
    handleOk() {
      this.$refs.kcompanyForm
        .getData()
        .then((res) => {
          this.confirmLoading = true;
          event_create({
            risks: [this.ugreid],
            title: res.title,
          })
            .then((response) => {
              this.visible = false;
              this.confirmLoading = false;
              this.$message.success(response.data.message);
              this.event_paginates();
            })
            .catch((err) => {
              this.confirmLoading = false;
              this.$message.error(err.response.data.message)
              console.log('err', err);
            });
        })
        .catch((err) => {
          this.confirmLoading = false;
          console.log("err", err);
        });
    },
    event_creates(id) {
      this.visible = true;
      this.$nextTick(() => {
        this.ugreid = id;
        this.$refs.kcompanyForm.reset();
      });
    },
    handleCancel() {
      this.visible = false;
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
  height: calc(100% - 24px) !important;
  .top_left {
    background: #fff;
    padding: 16px 24px;
    height: 100%;
    .top_left_title {
      margin: 21px auto;
      height: calc(100% - 50px);
      .titles_all {
        display: flex;
        width: 100%;
        .titles {
          width: 60%;
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
          width: 40%;
          text-align: right;
        }
      }

      .describs {
        margin: 18px 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        height: calc(100% - 50px);
        span {
          font-size: 15px;
          font-family: PingFang SC;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
        }
        .contents {
          height: calc(100% - 60px);
          margin: 10px 0;
          padding: 10px;
          overflow: auto;
          box-shadow: 1px 2px 10px 1px #e8e8e8;
          border-radius: 5px;
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
    height: 100%;
    .card_bodys {
      // height: 666px;
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