<template>
  <a-card  v-if="appdata.status">
    <a-page-header style="margin: 0px 0 10px !important">
      <template slot="footer">
        <a-tabs @change="onTabsChange" :default-active-key="routers.default">
          <a-tab-pane :key="routers.default" tab="待审文章" />
          <a-tab-pane
            :key="routers.list"
            tab="审核流程"
            v-if="$auth('approve.add')"
          />
          <template slot="tabBarExtraContent">
            <a-button
              key="refresh"
              type="primary"
              @click="onRefresh"
              icon="reload"
              >刷新</a-button
            >
          </template>
        </a-tabs>
      </template>
    </a-page-header>
    <page-toggle-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <component
        ref="component"
        style="background: none"
        :is="router"
        :key="key"
        @on-open="onOpen"
        :params="params"
        @event="event"
      ></component>
    </page-toggle-transition>
  </a-card>
  <maintain v-else/>
</template>
<script>
import { mapState } from "vuex";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import ApprovedPaginatsion from "./components/ApprovedPaginatsion.vue";
import ApprovesList from "./components/ApprovesList.vue";
import maintain from "@/pages/applications/maintain"
import { application_get } from "@/services/application";
export default {
  props: {
    open: {
      type: Function,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    appid:{
      type: String
    }
  },
  components: {
    PageToggleTransition,
    ApprovedPaginatsion,
    ApprovesList,
    maintain
  },
  computed: {
    ...mapState("setting", ["animate"]),
    key() {
      return Math.random();
    },
  },
  data() {
    return {
      routers: {
        default: "approved-paginatsion",
        list: "approves-list",
      },
      router: "approved-paginatsion",
      params: {},
      appdata:{
        status: true
      }
    };
  },
  created() {
    application_get({ id: this.appid }).then((res) => {
      this.appdata = res.data.data;
    }).catch(err=>{
      console.log(err)
      this.$message.error(response.data.message)
    })
  },
  methods: {
    event({ method, params }) {
      if (this[method] && typeof this[method] === "function") {
        this[method](params);
      }
    },
    onOpen(params) {
      this.$emit("open", params || {});
    },
    onLink({ route, params }) {
      if (params.pagination) {
        this.back.route = this.route;
        this.back.params = this.params;
      } else {
        this.back.route = null;
        this.back.params = null;
      }
      //跳转
      this.router = route;
      this.params = params;
    },
    onRefresh() {
      this.$refs.component.onLoad();
    },
    onTabsChange(e) {
      this.router = e;
    },
  },
};
</script>
