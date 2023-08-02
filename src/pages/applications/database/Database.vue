<template>
  <div style="width: 100%">
    <div id="components-layout-demo-basic">
      <a-layout style="height: 100%">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
          <div class="logos">
            <span v-if="!collapsed">数据资源目录</span>
          </div>
          <a-menu mode="inline" v-model="menus" @click="changes">
            <a-menu-item :key="item.id" v-for="item in menuslist">
              <a-icon :type="item.icon" />
              <span>{{ item.title }} </span>
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
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import Home from "./components/home.vue";
import orderdetails from "./components/orderdetails.vue";
import report from "./components/report.vue";
import verificationhome from "./components/verificationhome.vue";
import eventhome from "./components/eventhome.vue";
import eventedit from "./components/eventedit.vue";
import index from "./analysis/Analysis.vue";

export default {
  components: {
    Home,
    orderdetails,
    report,
    verificationhome,
    eventhome,
    eventedit,
    PageToggleTransition,
    index,
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
        { id: "index", title: "首页", icon: "bank" },
        { id: "home", title: "数据资源目录", icon: "shopping" },
      ],
      menus: ["index"],
      id: undefined,
      themes: 0,
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters["account/user"];
    },
    ...mapState("setting", ["theme", "animate"]),
    key() {
      return Math.random(10000);
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
      if (params.params.menus) {
        this.menus = params.params.menus;
      }
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onLink({ route, params }) {
      this.back.route = this.route;
      this.back.params = this.params;
      //跳转
      this.route = route;
      this.params = Object.assign(params, {
        id: this.id,
      });
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
  width: 100%;
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
  .ant-layout-content {
    z-index: 0;
    height: 100%;
  }
}
</style>