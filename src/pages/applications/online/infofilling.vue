<template>
  <div style="width: 100%">
    <div id="components-layout-demo-basic">
      <a-layout style="height: 100%">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
          <div class="logos">
            <span v-if="!collapsed">在线沟通</span>
          </div>
          <a-menu mode="inline" v-model="menus" @click="changes">
            <a-menu-item :key="item.id" v-for="item in menuslist">
              <a-icon :type="item.icon" />
              <span
                >{{ item.title }}
                <a-badge v-if="item.id == 'proposal'" :count="themese"
              /></span>
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
import enterprise from "./components/enterprise.vue";
import exports from "./components/exports.vue";
import proposal from "./components/proposal.vue";
import proposaldetailes from "./components/proposaldetailes.vue";
import { message_paginate } from "@/services/infofilling";

export default {
  components: {
    enterprise,
    PageToggleTransition,
    proposal,
    exports,
    proposaldetailes,
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
        { id: "proposal", title: "意见建议", icon: "form" },
        // { id: "exports", title: "我的建议", icon: "solution" },
        // { id: "enterprise", title: "会话记录", icon: "container" },
      ],
      menus: ["proposal"],
      themese: 0,
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
    message_paginate({ status: 0 })
      .then((res) => {
        this.themese = res.data.data.total;
      })
      .catch((err) => {
        console.log(err);
      });
    this.onLink({
      route: "proposal",
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
      console.log("e", e);
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