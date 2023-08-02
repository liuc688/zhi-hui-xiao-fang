<template>
  <div>
    <div class="title_back">
      <a @click="back()"><a-icon type="arrow-left" />返回</a>
    </div>
    <div class="maines">
      <a-row :gutter="24">
        <a-col :span="16">
          <div class="top_left">
            <!-- 第一部分标题 -->
            <div class='title-one'>主题详情</div>
            <div class="top_left_title">
              <a-row class="describs" style="font-size:16px">
                <a-row style="margin-bottom:12px">
                  <a-col :span="12">
                    标题：<span style="color:#b5a642;font-size:16px">{{dataSource.theme?dataSource.theme.title:""}}</span>
                  </a-col>
                  <a-col :span="12">
                    创建时间： <span style="color:#ff7f00;font-size:16px">{{creationTime}}</span>
                  </a-col>
                </a-row>
                <a-row style="margin-bottom:12px">
                  <a-col :span="12">
                    开始时间： <a-tag color='#9f5f9f' style="color:#fff">{{startTime}}</a-tag>
                  </a-col>
                  <a-col :span="12">
                    结束时间： <a-tag color='deeppink' style="color:#fff">{{endTime}}</a-tag>
                  </a-col>
                </a-row>
                <a-row style="margin-bottom:12px">
                  <a-col :span="12">
                    需完成的公司数： <span style="font-size:16px;color:blue">{{numberOfCompaniesToComplete}}&nbsp;个</span>
                  </a-col>
                  <a-col :span="12">
                    完成的公司数： <span style="font-size:16px;color:red">{{numberOfCompaniesCompleted}}&nbsp;个</span>
                  </a-col>
                </a-row>
                <a-col :span="24">
                  <div>
                    <div style="margin-bottom:10px">主题内容：</div> 
                    <div style="font-size:14px;text-indent:2em;">{{ dataSource.theme?dataSource.theme.content:"" }}</div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="top_right">
            <a-card class="implementinfo">
              <span slot="title">完成度</span>
              <div style="height:100%">
                <div v-if="dataSource.risk !== 0" class="completion_content">
                  <a-progress 
                  type="circle"
                  :stroke-color="{ '0%': '#108ee9','100%': '#87d068' }" 
                  :percent="completeness"
                  :width="280"
                  />
                </div>
                <div v-else style="text-align:center;font-size:16px">
                  无公司符合要求，不需填报！
                </div>
              </div>
            </a-card>
          </div>
        </a-col>
      </a-row>
      
      <a-card style="margin:25px 0">
        <span slot="title">公司汇总</span>
        <div class="card_bodys">
          <!-- a-comment 是评论的组件 -->
          <a-comment v-for="(item,index) in companiesDetails" :key="index">
            <a slot="author">{{item.title}}</a>
            <p slot="content" style="text-indent:2em;">
              {{ item.answer?item.answer:'暂无处置' }}
            </p>
            <div v-if="item.files&&item.files.length" style="margin-bottom:25px">
              <div v-for="(items,indexs) in item.files" :key="indexs">
                <a style="color:#1E90FF" target="_blank" :href="items.url" :title="items.name"  :download="items.name">{{items.name}}</a>
              </div>
            </div>
          </a-comment>
        </div>
        <div style="height:50px">

        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import { channel_list } from "@/services/content";
import { organization_tree } from "@/services/organization";
import { form_get } from "@/services/forms";
import { application_list } from "@/services/application";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Applications from "../../../../applications/";
import {
info_paginate,
info_delete,  // 企业信息删除接口
info_edit,  // 企业信息编辑接口
info_get,  // 企业信息详情
dict_tree,  // 字典列表
theme_paginate,  // 主题分页接口
theme_create,  // 主题创建
theme_edit,  // 主题填报编辑
theme_get,  // 主题详情
theme_info,  // 主题信息，用于主题数据的编辑，theme_get接口也可以，只是theme_get接口数据太多了，很多用不到，影响性能
theme_delete,  // 主题删除
} from "@/services/datacenter"
import moment from 'moment';
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
      spinning: false,
      spinnings: false,
      channeltree: [],
      sitetree: [],
      typedatas: {},
      idlist: [],
      dataSource:{},  // 用来承接详情接口获取到的所有数据
      likes: 0,
      dislikes: 0,
      action: null,
      moment,
    };
  },
  created() {
    console.log('params',this.params)
    // this.id = this.params.data._id || undefined;
    // this.router = this.params.router || "home";
    this.init();
  },
  computed: {
    ...mapState("applications", ["apps"]),
    userinfo() {
      return this.$store.getters["account/user"];
    },
    // 创建时间
    creationTime() {
      return this.dataSource.theme&&this.dataSource.theme._createtime?this.dataSource.theme._createtime.split(" ")[0] : ''
    },
    // 开始时间
    startTime(){
      return this.dataSource.theme&&this.dataSource.theme.start?this.dataSource.theme.start.split(" ")[0]:''
    },
    // 结束时间
    endTime(){
      return this.dataSource.theme&&this.dataSource.theme.end?this.dataSource.theme.end.split(" ")[0]:''
    },
    // 需要完成的公司数
    numberOfCompaniesToComplete(){
      return this.dataSource?this.dataSource.risk : ''
    },
    // 完成的公司数
    numberOfCompaniesCompleted(){
      return this.dataSource?this.dataSource.finish:''
    },
    // 完成度
    completeness(){
      // 返回 完成的数量除以需要完成数量
      return parseInt((this.numberOfCompaniesCompleted/this.numberOfCompaniesToComplete)*100)
    },
    // 所有需要主题填报的公司的详细信息
    companiesDetails(){
      return this.dataSource&&this.dataSource.companys ? this.dataSource.companys : ''
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
      this.id = this.params.record?this.params.record.id:"";
      theme_get({id:this.id}) 
        .then((res) => {
          this.dataSource = res.data.data;
        })
    },
    //返回
    back() {
      this.$emit("event", {
        method: "onLink",
        params: {
          route: "topicPaging",  
          params: {
            menus: ["topicPaging"],
            details:this.params.details,
            searchform:this.params.searchform,
          },
        },
      });
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
    height: 400px;
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
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        span {
          font-size: 14px;
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
        text-align: center;
        div {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
  .top_right {
    background: #fff;
    .card_bodys {
      height: 334px;
      overflow-y: auto;
      .list_item {
        text-align: end;
        font-size: 14px;
        color: #00000040;
      }
    }
  }
  .implementinfo {
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
// 完成度内容区域，这个区域使用一个进度条来展示
.completion_content {
  height:100%;
  display:flex;
  justify-content:center;  // 主轴方向居中显示
  align-items:center;  // 从轴方向居中显示
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
.top_right >>> .ant-card-body {
  padding: 5px 10px !important;
  height:343px;
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
/* 返回按钮样式 */
.title_back {
  margin: 10px 24px;
  padding: 10px;
  background: #daedff;
  border: 1px solid #40a9ff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.title-one {
  color: black !important;
  font-size:16px;
  font-weight: 500px !important;
  padding-bottom:16px !important;
  border-bottom: 1px solid #eee;
}
</style>