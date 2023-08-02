<template>
  <div style="width: 100%">
    <div id="components-layout-demo-basic" v-if="appdata.status">
      <a-layout style="height: 100%">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
          <div class="logos">
            <span v-if="!collapsed">督导任务平台</span>
          </div>
          <a-menu mode="inline" v-model="menus" @click="changes">
            <a-menu-item :key="item.id" v-for="item in menuslist">
              <a-icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </a-menu>
          <div class="triggers">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
          </div>
        </a-layout-sider>
        <a-layout>
          <a-layout-header>
            <div class="header_div">
              <a-space :size="24">
                <!-- <a href="#"><a-icon type="search" /></a>
                <a href="#"><a-icon type="bell" /></a> -->
                <span>
                  <img
                    class="info_img"
                    v-if="userinfo.avatar.url"
                    :src="userinfo.avatar.url"
                    alt=""
                  />
                  <a-avatar icon="user" :size="24" v-else />
                  <span class="info_title">{{ userinfo.realname }}</span>
                </span>
              </a-space>
            </div>
          </a-layout-header>
          <a-layout-content>
            <page-toggle-transition
              :disabled="animate.disabled"
              :animate="animate.name"
              :direction="animate.direction"
            >
              <component
                ref="component"
                :is="route"
                :params="params"
                @event="event"
                @on-open="onOpen"
                :key="key"
              ></component>
            </page-toggle-transition>
          </a-layout-content>
          <!-- <a-layout-footer>
            <div class="footer">山东尚可网络科技有限公司</div>
          </a-layout-footer> -->
        </a-layout>
      </a-layout>
    </div>
    <maintain v-else/>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import Home from "./components/home.vue";
import tasklist from "./components/tasklist.vue";
import releasetask from "./components/releasetask.vue";
import datastatistics from "./components/datastatistics.vue";
import taskdetailes from "./components/taskdetailes.vue";
import taskdetailes2 from "./components/taskdetailes2.vue";
import sitedetails from "./components/sitedetails.vue";

import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";

export default {
  components: {
    Home,
    tasklist,
    releasetask,
    datastatistics,
    PageToggleTransition,
    taskdetailes,
    taskdetailes2,
    sitedetails,
    maintain
  },
  props: {
    data: {
      Type: Object,
      default: {},
    },
    open: {
      type: Function,
    },
    appid: {
      type: String,
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
        { id: "home", title: "首页", icon: "dashboard" },
        { id: "tasklist", title: "任务列表", icon: "container" },
        { id: "releasetask", title: "发布任务", icon: "form" },
        { id: "datastatistics", title: "数据统计", icon: "laptop" },
      ],
      menus: ["home"],
      appdata:{
        status: true
      }
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
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
      if (this.appdata.status) {
        if (this.data.riskid) {
          this.onLink({
            route: this.data.types == "发布型" ? "taskdetailes" : "taskdetailes2",
            params: {
              data: {
                _id: this.data.riskid,
              },
            },
          });
        } else {
          this.onLink({
            route: "home",
            params: {},
          });
        }
      }
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })


    
  },
  methods: {
    event({ method, params }) {
      if (params.params.menus) {
        this.menus = params.params.menus;
      }
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