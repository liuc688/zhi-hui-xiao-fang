<template>
  <div style="width: 100%">
    <div id="components-layout-demo-basic">
      <a-layout style="height: 100%">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
          <div class="logos">
            <span v-if="!collapsed">数据中心</span>
          </div>
          <a-menu mode="inline" v-model="menus" @click="changes">
            <a-menu-item :key="item.id" v-for="item in menuslist">
              <a-icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </a-menu>
          <div class="triggers">
            <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)"/>
          </div>
        </a-layout-sider>
        <a-layout>
          <!-- 内容部分的头部 -->
          <a-layout-content>
            <!-- page-toggle-transition 组件为左右切换的动画 -->
            <!-- 
              <page-toggle-transition
              :disabled="animate.disabled"
              :animate="animate.name"
              :direction="animate.direction"
            > 
            -->
              <component
              ref="component"
              :is="route"
              :params="params"
              @event="event"
              @on-open="onOpen"
              :key="key"
              >
              </component>
            <!-- </page-toggle-transition> -->
          </a-layout-content>
          <!-- 内容部分的底部 -->
          <!-- 
            <a-layout-footer>
              <div class="footer">山东尚可网络科技有限公司</div>
            </a-layout-footer> 
          -->
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
// 首页
import index from "./analysis/Analysis.vue"
import Home from "./components/02ParkEnterprises/01Home.vue"
import enterprise_add_pages from "./components/02ParkEnterprises/02EnterpriseAddPages.vue"
import enterpriseDetail from "./components/02ParkEnterprises/03EnterpriseDetail.vue"
// 园区企业中管委会页面
import managementCommittee from "./components/02ParkEnterprises/05managementCommittee.vue";
import recycleBin from "./components/02ParkEnterprises/04RecycleBin.vue"
// 产品信息页面
import productInformation from "./components/04ProductInformation/01ProductInformation.vue";
// 产品详情页面
import productDetails from "./components/04ProductInformation/02ProductDetails.vue";
// 企业产品列表页面（针对于某个企业）
import businessProductList from "./components/04ProductInformation/03BusinessProductList.vue";
// 企业经营信息
import informationPaging from "./components/05BusinessInformation/01InformationPaging.vue";
// 企业经营信息详情
import managedetails from "./components/05BusinessInformation/02managedetails.vue";
// 企业经营未填报预警
import busNotFillWarn from "./components/05BusinessNotFillWarning/01BusNotFillWarn.vue";
// 经营预警
import businessWarning from "./components/05BusinessWarning/01BusinessWarning.vue";
// 企业重大事件
import majorEvents from "./components/05BusinessZhongDaEvents/01MajorEvents.vue";
// 主题调查分页
import topicPaging from "./components/06TopicPaging/01TopicPaging.vue";
// 主题调查中的回收站页面
import recycleBinofTopic from "./components/06TopicPaging/02RecycleBinofTopic.vue";
// 主题调查的详情页
import topicDetail from "./components/06TopicPaging/03TopicDetail.vue";
// 主题数据信息增加
import topicDataAdded from "./components/06TopicPaging/04TopicDataAdded.vue";
// 沟通互动分页
import communicationPagination from "./components/07CommunicationService/01CommunicationPagination.vue";
// 沟通互动详情
import communicationDetail from "./components/07CommunicationService/02CommunicationDetail.vue";
// 企业用户分页
import enterpriseUserCenterTab from "./components/08EnterpriseUserCenter/01EnterpriseUserCenterTab.vue";
// 用户信息回收站
import userInformationRecycleBin from "./components/08EnterpriseUserCenter/02UserInformationRecycleBin.vue";
import macroeconomicVisualization from "./components/06Macroeconomics/01MacroeconomicVisualization.vue";
export default {
  components: {
    index,
    Home,
    productInformation,
    productDetails,
    businessProductList,
    PageToggleTransition,
    enterpriseDetail,
    enterprise_add_pages,
    recycleBin,
    topicPaging,
    recycleBinofTopic,
    topicDetail,
    topicDataAdded,
    communicationPagination,
    communicationDetail,
    enterpriseUserCenterTab,
    userInformationRecycleBin,
    informationPaging,
    busNotFillWarn,
    businessWarning,
    majorEvents,
    macroeconomicVisualization,
    managedetails,
    managementCommittee
  },
  props: {
    data: {
      Type: Object,
      default: {},
    },
    open: {
      type: Function,
    },
  },
  data() {
    return {
      params: {},
      back: {
        route: null,
        params: null,
      },
      route: null,
      collapsed: false,
      menuslist: [
        { id: "index", title: "首  页", icon: "home" },
        { id: "home", title: "园区企业", icon: "dashboard" },
        // { id: "overduewarning", title: "超期预警企业", icon: "warning" },
        { id: "productInformation", title: "产品信息", icon: "container" },
        { id: "informationPaging", title: "企业经营信息", icon: "form" },
        { id: "busNotFillWarn", title: "未填报预警", icon: "warning" },
        { id: "businessWarning", title: "经营预警", icon: "warning" },
        { id: "majorEvents", title: "企业重大事项", icon: "alert" },
        // { id: "warningranking", title: "排行榜", icon: "form" },
        { id: "macroeconomicVisualization", title: "宏观经济", icon: "area-chart" },
        { id: "topicPaging", title: "主题调查", icon: "laptop" },
        { id: "communicationPagination", title: "意见建议", icon: "message" },
        { id: "enterpriseUserCenterTab", title: "用户中心", icon: "user" },
      ],
      menus: ["index"],
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    ...mapState("setting", ["theme", "animate"]),
    key() {
      return Math.random();
    },
  },
  created() {
    this.onLink({
      route: "index",
      params: {},
    });
  },
  methods: {
    event({ method, params }) {
      // if (params.params.menus) {
      //   this.menus = params.params.menus;
      // }
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onOpen(params) {
      console.log("on-open", params);
      this.$emit("open", params || {});
    },
    onLink({ route, params }) {
      this.back.route = this.route;
      this.back.params = this.params;
      //跳转
      this.route = route;
      this.params = params;
    },
    changes(e) {
      this.onLink({
        route: e.key,
        params: {},
      });
    },
  },
};
</script>
<style >
.vl-notify.vl-notify-main {
  padding-bottom: 0px;
}
</style>
<style scoped  lang="less">
#components-layout-demo-basic {
  height: 100%;
  .logos {
    width: calc(100% + 1px);
    padding: 17px;
    font-size: 19px;
    font-weight: 500;
    font-family: PingFang SC, PingFang SC-Medium;
    color: #000000d9;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 63px;
    img {
      width: 25px;
      height: 25px;
    }
    span {
      margin-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }
  .triggers {
    position: absolute;
    bottom: 0px;
    width: 100%;
    border-top: 1px solid #00000017;
  }
  .trigger {
    font-size: 18px;
    line-height: 40px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .ant-layout-sider {
    background: #fff;
    box-shadow: 2px 0px 10px #d9d9d9;
    z-index: 2;
  }
  .ant-layout-header {
    background: #fff;
    height: 48px;
    box-shadow: 2px 2px 10px #d9d9d9;
    z-index: 1;
    padding: 0 24px;
    a {
      display: flex;
    }
    i {
      font-size: 18px;
    }
    .info_img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    .info_title {
      margin-left: 8px;
      font-size: 14px;
      color: #000000a6;
    }
    .header_div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: end;
      align-items: center;
    }
  }
  .ant-layout-content {
    z-index: 0;
  }
  .ant-layout-footer {
    background: #f0f2f5;
    height: 70px;
    .footer {
      text-align: center;
      font-size: 14px;
      font-family: PingFang SC, PingFang;
      font-weight: 500;
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>