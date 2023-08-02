<template>
  <a-layout class="layout-container">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div :class="collapsed ? 'logomini' : 'logo'"></div>
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="[currSelected]"
        :defaultOpenKeys="defaultOpenKeys"
      >
        <template v-for="item in menu">
          <template v-if="item.children || item.group">
            <a-sub-menu :key="item.key">
              <span slot="title">
                <a-icon :type="item.icon" v-if="item.icon" />
                <span>{{ item.title }} </span>
              </span>
              <a-menu-item
                :key="temp.key"
                v-for="temp in item.children"
                @click="onItemClick(temp)"
              >
                <a-icon :type="temp.icon" v-if="temp.icon" />
                <span>{{ temp.title }}</span>
              </a-menu-item>
              <template v-if="item.group">
                <a-menu-item-group
                  :key="temp.key"
                  :title="temp.title"
                  v-for="temp in item.group"
                >
                  <a-menu-item
                    :key="index.key"
                    v-for="index in temp.children"
                    @click="onItemClick(index)"
                  >
                    <a-icon :type="index.icon" v-if="index.icon" />
                    <span>{{ index.title }}</span>
                  </a-menu-item>
                </a-menu-item-group>
              </template>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="item.key" @click="onItemClick(item)">
              <a-icon :type="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />

        <a-button-group
          :style="{ lineHeight: '64px', float: 'right', right: '45px' }"
        >
          <a-button @click="onHome" class="header-buttons">
            <a-icon type="desktop" :style="{ fontSize: '24px' }" />
            <p>返回桌面</p>
          </a-button>
          <a-popconfirm
            title="您确定退出登录?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="onLogout"
          >
            <a-button class="header-buttons">
              <a-icon type="export" :style="{ fontSize: '24px' }" />
              <p>退出登录</p>
            </a-button>
          </a-popconfirm>
        </a-button-group>
      </a-layout-header>
      <a-layout-content>
        <a-card
          :style="{
            margin: '15px',
            minHeight: 'calc(100% - 30px)',
            width: 'calc(100% - 30px)'
          }"
        >
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
              :key="key"
              :crumbs="crumbs"
            ></component>
          </page-toggle-transition>
        </a-card>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        尚可集约化信息管理系统v3.1.1  ©2022 Created by Suncool
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import {logout} from "@/services/user";
import SystemStatus from "./Pages/SystemStatus";
import Admin from "./Pages/Admin";
import GuestList from "./Pages/GuestList";
import GuestPolicy from "./Pages/GuestPolicy";
import ApplicationList from "./Pages/ApplicationList";
import DictMapResource from "./Pages/DictMapResource";
import FormResource from "./Pages/FormResource";
import BackgroundResource from "./Pages/BackgroundResource";
import IconResource from "./Pages/IconResource";
import GlobalSetting from "./Pages/GlobalSetting";
import StaticRoute from "./Pages/StaticRoute";
import AggregateRoute from "./Pages/AggregateRoute";
import Messages from "./Pages/Messages";
import ClientPagination from "./Pages/ClientPagination";
import User from "./Pages/User";
import Retrieval from "./Pages/Retrieval";

export default {
  components: {
    PageToggleTransition,
    SystemStatus,
    Admin,
    User,
    GuestList,
    GuestPolicy,
    ApplicationList,
    DictMapResource,
    FormResource,
    BackgroundResource,
    IconResource,
    GlobalSetting,
    StaticRoute,
    AggregateRoute,
    Messages,
    ClientPagination,
    Retrieval
  },
  data() {
    return {
      loading: false,
      route: null,
      params: {},
      currSelected: "SystemStatus",
      defaultOpenKeys: [],
      currData: {},
      menu: [
        {
          key: "SystemStatus",
          title: "系统状态",
          icon: "stock",
        },
        {
          key: "UserManage",
          title: "用户管理",
          icon: "user",
          children: [
            {
              key: "Admin",
              title: "管理员",
              icon: "usergroup-add",
            },
            {
              key: "User",
              title: "员工",
              icon: "user",
            },
          ],
          group: [
            {
              key: "GuestManage",
              title: "访客管理",
              children: [
                {
                  key: "GuestList",
                  title: "访客列表",
                  icon: "team",
                },
                {
                  key: "GuestPolicy",
                  title: "访客权限",
                  icon: "team",
                },
              ],
            },
            {
              key: "ClientManage",
              title: "客户端管理",
              children: [
                {
                  key: "ClientPagination",
                  title: "客户端列表",
                  icon: "profile",
                }
              ],
            }
          ],
        },
        {
          key: "ApplicationManage",
          title: "应用管理",
          icon: "profile",
          children: [
            {
              key: "ApplicationList",
              title: "应用列表",
              icon: "profile",
            },
          ],
        },
        {
          key: "ResourceManage",
          title: "资源管理",
          icon: "profile",
          group: [
            {
              key: "StaticResource",
              title: "静态资源",
              children: [
                {
                  key: "BackgroundResource",
                  title: "背景列表",
                  icon: "unordered-list",
                },
                {
                  key: "IconResource",
                  title: "图标列表",
                  icon: "unordered-list",
                },
              ],
            },
            {
              key: "DynamicResource",
              title: "动态资源",
              icon: "unordered-list",
              children: [
                {
                  key: "FormResource",
                  title: "自定义表单",
                  icon: "unordered-list",
                },
                {
                  key: "DictMapResource",
                  title: "自定义字典",
                  icon: "unordered-list",
                },
              ],
            },
          ],
        },
        {
          key: "GatewayManage",
          title: "网关管理",
          icon: "setting",
          children: [
            {
              key: "GlobalSetting",
              title: "全局配置",
              icon: "setting",
            },
          ],
          group: [
            {
              key: "RouteManage",
              title: "路由管理",
              icon: "unordered-list",
              children: [
                {
                  key: "StaticRoute",
                  title: "静态路由",
                  icon: "unordered-list",
                },
                {
                  key: "AggregateRoute",
                  title: "聚合路由",
                  icon: "unordered-list",
                },
              ],
            },
          ],
        },
        {
          key: "Message",
          title: "消息管理",
          icon: "profile",
          children: [
            {
              key: "Messages",
              title: "发送消息",
              icon: "profile",
            },
          ],
        },
        // {
        //   key: "Retrieval",
        //   title: "检索管理",
        //   icon: "profile",
        //   children: [
        //     {
        //       key: "Retrieval",
        //       title: "检索管理",
        //       icon: "profile",
        //     },
        //   ],
        // },
      ],
      collapsed: false,
      crumbs: [],
    };
  },
  computed: {
    ...mapState("setting", ["theme", "animate"]),
    key() {
      return Math.random();
    },
    userinfo() {
      return this.$store.getters["account/user"];
    },
  },
 
  created() {
    this.onReload();
  },
  methods: {
    onReload() {
      this.isAdmin();
      this.onLink({
        route: this.currSelected,
      });
    },
    onItemClick(record) {
      this.route = record.key;
    },
    onBack() {},
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onRefresh() {
      if (
        this.$refs.component &&
        typeof this.$refs.component.onReset === "function"
      ) {
        this.$refs.component.onReset();
      }
    },
    onLink({ route, params, paginate, searchform }) {
      this.params = params || {};
      this.route = route;
      this.crumbs.push({
        route: route,
        params: params || {},
        paginate: paginate || { page: 1, per_page: 10 },
        searchform: searchform || {},
      });
    },

    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    isAdmin() {
      this.$nextTick(() => {
        if (this.userinfo.role !== "admin") {
          this.$error({
            title: "您不是管理员",
            content: "无法访问此页面,因为您不是管理员",
            keyboard: false,
            onOk: () => {
              logout();
              this.$router.push({
                path: "/403",
              });
            },
          });
        }
      });
    },
    onHome() {
      this.$router.push({
        path: "/desktop",
      });
    },
    onLogout() {
      logout();
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>
<style>
.layout-container {
  height: 100%;
}
.layout-container .ant-layout-sider,
.layout-container .ant-layout .ant-layout-content {
  overflow-y: auto;
}

.layout-container .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.layout-container .trigger:hover {
  color: #1890ff;
}

.layout-container .logo {
  height: 32px;
  background: url("../../../assets/images/logobanner.png") no-repeat;
  background-size: 165px;
  margin: 16px;
}
.layout-container .logomini {
  height: 32px;
  background: url("../../../assets/images/logo.png") no-repeat;
  background-size: 32px;
  margin: 16px 24px;
}
.header-buttons {
  border: 0px;
}
</style>
